import { BaseService } from '../core/BaseService.js';
import { NotFoundError } from '../core/errors.js';
import { mapFields } from '../utils/mapper.js';
import { buildMeta, normalizePagination } from '../utils/pagination.js';

const FIELD_MAP = {
  title: 'title',
  assigneeId: 'assignee_id',
  dueDate: 'due_date',
  status: 'status',
};

export class TaskService extends BaseService {
  #dryDockRepository;

  constructor({ taskRepository, dryDockRepository }) {
    super({ repository: taskRepository });
    this.#dryDockRepository = dryDockRepository;
  }

  get entityName() {
    return 'Task';
  }

  #toJson(row) {
    return {
      id: row.id,
      dryDockId: row.dry_dock_id,
      title: row.title,
      assigneeId: row.assignee_id,
      dueDate: row.due_date,
      status: row.status,
      createdAt: row.created_at,
    };
  }

  async #assertDryDockExists(dryDockId) {
    const dryDock = await this.#dryDockRepository.findById(dryDockId);
    if (!dryDock) throw new NotFoundError('Dry dock');
  }

  mapListFilters(query) {
    return { dry_dock_id: query.dryDockId, status: query.status };
  }

  async listByDryDock(dryDockId, query = {}) {
    await this.#assertDryDockExists(dryDockId);
    const { page, limit, offset } = normalizePagination(query);

    const result = await this.repository.findAll({
      page,
      limit,
      offset,
      search: query.search,
      sort: query.sort,
      filters: { dry_dock_id: dryDockId, status: query.status },
    });

    return {
      rows: result.rows.map((row) => this.#toJson(row)),
      meta: buildMeta(result.total, page, limit),
    };
  }

  async create(dryDockId, payload) {
    await this.#assertDryDockExists(dryDockId);

    const columns = mapFields(payload, FIELD_MAP);
    columns.dry_dock_id = dryDockId;

    const id = await this.repository.insert(columns);
    return this.#toJson(await this.repository.findById(id));
  }

  async #loadOwned(dryDockId, id) {
    const row = await this.repository.findById(id);
    if (!row || Number(row.dry_dock_id) !== Number(dryDockId)) {
      throw new NotFoundError(this.entityName);
    }
    return row;
  }

  async update(dryDockId, id, payload) {
    const current = await this.#loadOwned(dryDockId, id);
    const columns = mapFields(payload, FIELD_MAP);
    if (Object.keys(columns).length > 0) await this.repository.updateById(current.id, columns);
    return this.#toJson(await this.#loadOwned(dryDockId, current.id));
  }

  async remove(dryDockId, id) {
    const row = await this.#loadOwned(dryDockId, id);
    await this.repository.softDeleteById(row.id);
  }
}