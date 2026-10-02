import { withTransaction } from '../config/database.js';
import {
  DRY_DOCK_STATUS,
  DRY_DOCK_STATUS_FLOW,
  ROLES,
  STAY_TYPE,
  WORK_ORDER_STATUS,
} from '../config/constants.js';
import { BaseService } from '../core/BaseService.js';
import { ConflictError, NotFoundError, ValidationError } from '../core/errors.js';
import { DryDock } from '../models/DryDock.js';
import { CostSummaryResource } from '../resources/CostSummaryResource.js';
import { DryDockListItemResource } from '../resources/DryDockListItemResource.js';
import { DryDockResource } from '../resources/DryDockResource.js';
import { WorkOrderResource } from '../resources/WorkOrderResource.js';
import { mapFields } from '../utils/mapper.js';
import { buildMeta, normalizePagination } from '../utils/pagination.js';
import { toNumber } from '../utils/money.js';

const FIELD_MAP = {
  dryDockNo: 'dry_dock_no',
  vesselId: 'vessel_id',
  shipyardId: 'shipyard_id',
  title: 'title',
  description: 'description',
  accountCode: 'account_code',
  responsibleRank: 'responsible_rank',
  currency: 'currency',
  budget: 'budget',
  yardEstimates: 'yard_estimates',
  ownerEstimates: 'owner_estimates',
  actualYardCosts: 'actual_yard_costs',
  actualOwnerCosts: 'actual_owner_costs',
  priority: 'priority',
  status: 'status',
  plannedStartDate: 'planned_start_date',
  plannedEndDate: 'planned_end_date',
  actualStartDate: 'actual_start_date',
  actualEndDate: 'actual_end_date',
};

const CHART_LABELS = Object.values(WORK_ORDER_STATUS);

export class DryDockService extends BaseService {
  #yardStayLogRepository;

  constructor({ dryDockRepository, yardStayLogRepository }) {
    super({ repository: dryDockRepository });
    this.#yardStayLogRepository = yardStayLogRepository;
  }

  get entityName() {
    return 'Dry dock';
  }

  mapListFilters(query) {
    return {
      status: query.status,
      priority: query.priority,
      vessel_id: query.vessel_id ?? query.vesselId,
      shipyard_id: query.shipyard_id ?? query.shipyardId,
    };
  }

  async list(query = {}) {
    const { page, limit, offset } = normalizePagination(query);
    const result = await this.repository.listWithRelations({
      page,
      limit,
      offset,
      search: query.search,
      sort: query.sort,
      filters: this.mapListFilters(query),
    });

    return {
      rows: result.rows.map((row) => new DryDockListItemResource(row).toJSON()),
      meta: buildMeta(result.total, page, limit),
    };
  }

  async show(id) {
    const row = await this.repository.findDetailById(id);
    if (!row) throw new NotFoundError(this.entityName);
    return new DryDockResource(row).toJSON();
  }

  async getModel(id) {
    const row = await this.repository.findById(id);
    if (!row) throw new NotFoundError(this.entityName);
    return new DryDock(row);
  }

  async #assertDryDockNoAvailable(dryDockNo, excludeId = null) {
    const existing = await this.repository.findOneBy({ dry_dock_no: dryDockNo });
    if (existing && Number(existing.id) !== Number(excludeId)) {
      throw new ConflictError(`Nomor dry dock ${dryDockNo} sudah digunakan`);
    }
  }

  async create(payload, user) {
    const columns = mapFields(payload, FIELD_MAP);
    await this.#assertDryDockNoAvailable(columns.dry_dock_no);
    columns.created_by = user.id;

    const id = await this.repository.insert(columns);
    return this.show(id);
  }

  async update(id, payload) {
    await this.getModel(id);
    const columns = mapFields(payload, FIELD_MAP);

    if (columns.dry_dock_no) await this.#assertDryDockNoAvailable(columns.dry_dock_no, id);
    if (Object.keys(columns).length === 0) return this.show(id);

    await this.repository.updateById(id, columns);
    return this.show(id);
  }

  async remove(id) {
    await this.getModel(id);
    await this.repository.softDeleteById(id);
  }

  async selectShipyard(id, shipyardId) {
    await this.getModel(id);
    await this.repository.updateById(id, { shipyard_id: shipyardId ?? null });
    return this.show(id);
  }

  async changePriority(id, priority) {
    await this.getModel(id);
    await this.repository.updateById(id, { priority });
    return this.show(id);
  }

  #assertTransition(dryDock, nextStatus, actorRole) {
    if (dryDock.status === nextStatus) {
      throw new ValidationError(`Status dry dock sudah ${nextStatus}`);
    }

    const allowedNext = DRY_DOCK_STATUS_FLOW[dryDock.status] ?? [];
    if (allowedNext.includes(nextStatus)) return;

    const isBackward = (DRY_DOCK_STATUS_FLOW[nextStatus] ?? []).includes(dryDock.status);
    if (isBackward && actorRole === ROLES.ADMIN) return;

    throw new ValidationError(
      `Transisi status ${dryDock.status} ke ${nextStatus} tidak diperbolehkan`,
    );
  }

  async changeStatus(id, nextStatus, actor) {
    const dryDock = await this.getModel(id);
    this.#assertTransition(dryDock, nextStatus, actor.role);

    const columns = { status: nextStatus };
    if (nextStatus === DRY_DOCK_STATUS.COMPLETED) {
      columns.actual_end_date = new Date();
      await this.#closeYardStayLogs(id);
    }

    await this.repository.updateById(id, columns);
    return this.show(id);
  }

  async #closeYardStayLogs(dryDockId) {
    await this.#yardStayLogRepository.execute(
      'UPDATE yard_stay_logs SET end_date = CURDATE() WHERE dry_dock_id = ? AND end_date IS NULL',
      [dryDockId],
    );
  }

  async start(id) {
    const dryDock = await this.getModel(id);

    if (dryDock.status !== DRY_DOCK_STATUS.PLANNING) {
      throw new ValidationError('Hanya dry dock berstatus PLANNING yang dapat dimulai');
    }
    if (!dryDock.canStart) {
      throw new ValidationError('Shipyard harus dipilih sebelum dry dock dimulai');
    }

    await withTransaction(async (connection) => {
      await this.repository.execute(
        'UPDATE dry_docks SET status = ?, actual_start_date = CURDATE() WHERE id = ?',
        [DRY_DOCK_STATUS.EXECUTION, id],
        connection,
      );
      await this.#yardStayLogRepository.insert(
        { dry_dock_id: id, stay_type: STAY_TYPE.IN_DOCK, start_date: new Date() },
        connection,
      );
    });

    return this.show(id);
  }

  async costSummary(id) {
    const row = await this.repository.findCostSummary(id);
    if (!row) throw new NotFoundError(this.entityName);
    return new CostSummaryResource(row).toJSON();
  }

  async chartStatus(id) {
    await this.getModel(id);
    const rows = await this.repository.countWorkOrderByStatus(id);
    const counts = new Map(rows.map((row) => [row.status, toNumber(row.total)]));

    return CHART_LABELS.map((label) => ({ label, value: counts.get(label) ?? 0 }));
  }

  async chartYardStay(id) {
    await this.getModel(id);
    const rows = await this.repository.sumYardStayDays(id);

    return Object.values(STAY_TYPE).map((label) => {
      const match = rows.find((row) => row.stay_type === label);
      return { label, value: toNumber(match?.days ?? 0) };
    });
  }

  async chartComparison(id) {
    await this.getModel(id);
    const rows = await this.repository.comparisonByGroup(id);

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      totalCosts: toNumber(row.total_costs),
      totalEstimates: toNumber(row.total_estimates),
      totalBudget: toNumber(row.total_budget),
    }));
  }

  async specifications(id, { search } = {}) {
    const dryDock = await this.getModel(id);
    const rows = await this.repository.findGroupedBySpecificationGroup(id, { search });

    const groups = new Map();
    for (const row of rows) {
      const groupId = Number(row.specification_group_id);
      if (!groups.has(groupId)) {
        groups.set(groupId, {
          id: groupId,
          name: row.specification_group_name,
          items: [],
        });
      }
      groups.get(groupId).items.push(new WorkOrderResource(row).toJSON());
    }

    return {
      version: toNumber(dryDock.get('spec_version')),
      exportedAt: dryDock.get('spec_exported_at'),
      groups: [...groups.values()],
    };
  }

  async previewSpecification(id) {
    return this.specifications(id);
  }

  async exportSpecification(id) {
    const dryDock = await this.getModel(id);
    await this.repository.markSpecificationExported(id);
    const updated = await this.getModel(id);

    return {
      dryDockNo: dryDock.dryDockNo,
      version: toNumber(updated.get('spec_version')),
      exportedAt: updated.get('spec_exported_at'),
    };
  }
}