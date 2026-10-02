import { BaseRepository } from '../core/BaseRepository.js';
import { resolveSort } from '../utils/sort.js';

const FILTER_MAP = {
  status: 'd.status',
  priority: 'd.priority',
  vessel_id: 'd.vessel_id',
  shipyard_id: 'd.shipyard_id',
};

const SORT_MAP = {
  dry_dock_no: 'd.dry_dock_no',
  title: 'd.title',
  priority: 'd.priority',
  status: 'd.status',
  planned_start_date: 'd.planned_start_date',
  created_at: 'd.created_at',
  id: 'd.id',
};

const SEARCH_COLUMNS = ['d.dry_dock_no', 'd.title', 'd.description', 'd.account_code'];

const LIST_COLUMNS = `
  d.*,
  v.name AS vessel_name,
  v.image_path AS vessel_image_path,
  co.name AS company_name,
  sy.name AS shipyard_name
`;

const LIST_JOINS = `
  FROM dry_docks d
  JOIN vessels v ON v.id = d.vessel_id
  JOIN companies co ON co.id = v.company_id
  LEFT JOIN shipyards sy ON sy.id = d.shipyard_id
`;

export class DryDockRepository extends BaseRepository {
  constructor() {
    super({
      table: 'dry_docks',
      searchable: ['dry_dock_no', 'title', 'description', 'account_code', 'responsible_rank'],
      sortable: Object.keys(SORT_MAP),
      filters: Object.keys(FILTER_MAP),
      defaultSort: 'planned_start_date',
    });
  }

  #buildConditions({ search, filters }) {
    const clauses = ['d.deleted_at IS NULL'];
    const params = [];

    for (const [key, value] of Object.entries(filters ?? {})) {
      const column = FILTER_MAP[key];
      if (!column || value === undefined || value === null || value === '') continue;
      clauses.push(`${column} = ?`);
      params.push(value);
    }

    if (search) {
      const like = `%${search}%`;
      clauses.push(`(${SEARCH_COLUMNS.map((column) => `${column} LIKE ?`).join(' OR ')})`);
      params.push(...SEARCH_COLUMNS.map(() => like));
    }

    return { sql: ` WHERE ${clauses.join(' AND ')}`, params };
  }

  async listWithRelations(options = {}, executor) {
    const db = this.resolveExecutor(executor);
    const { limit = 20, offset = 0, sort } = options;
    const { sql: where, params } = this.#buildConditions(options);
    const { column, direction } = resolveSort(sort, Object.keys(SORT_MAP), 'planned_start_date');
    const orderBy = `${SORT_MAP[column]} ${direction}`;

    const [dataRows, countRows] = await Promise.all([
      db.execute(
        `SELECT ${LIST_COLUMNS} ${LIST_JOINS}${where} ORDER BY ${orderBy}, d.id DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset],
      ),
      db.execute(
        `SELECT COUNT(*) AS total ${LIST_JOINS}${where}`,
        params,
      ),
    ]);

    return { rows: dataRows[0], total: countRows[0][0]?.total ?? 0 };
  }

  async findDetailById(id, executor) {
    const rows = await this.execute(
      `SELECT ${LIST_COLUMNS} ${LIST_JOINS} WHERE d.id = ? AND d.deleted_at IS NULL LIMIT 1`,
      [id],
      executor,
    );
    return rows[0] ?? null;
  }

  async findRawById(id, executor) {
    return this.findById(id, executor);
  }

  async findCostSummary(id, executor) {
    const rows = await this.execute(
      `SELECT id, dry_dock_no, currency, budget, yard_estimates, owner_estimates,
              actual_yard_costs, actual_owner_costs
       FROM dry_docks WHERE id = ? AND deleted_at IS NULL LIMIT 1`,
      [id],
      executor,
    );
    return rows[0] ?? null;
  }

  async countWorkOrderByStatus(id, executor) {
    return this.execute(
      `SELECT status, COUNT(*) AS total
       FROM work_orders
       WHERE dry_dock_id = ? AND deleted_at IS NULL
       GROUP BY status`,
      [id],
      executor,
    );
  }

  async sumYardStayDays(id, executor) {
    return this.execute(
      `SELECT stay_type, SUM(DATEDIFF(COALESCE(end_date, CURDATE()), start_date) + 1) AS days
       FROM yard_stay_logs
       WHERE dry_dock_id = ?
       GROUP BY stay_type`,
      [id],
      executor,
    );
  }

  async comparisonByGroup(id, executor) {
    return this.execute(
      `SELECT g.id, g.name,
              SUM(w.actual_cost) AS total_costs,
              SUM(w.estimated_cost) AS total_estimates,
              SUM(w.budget_cost) AS total_budget
       FROM work_orders w
       JOIN specification_groups g ON g.id = w.specification_group_id
       WHERE w.dry_dock_id = ? AND w.deleted_at IS NULL
       GROUP BY g.id, g.name
       ORDER BY g.sort_order ASC`,
      [id],
      executor,
    );
  }

  async markSpecificationExported(id, executor) {
    return this.execute(
      `UPDATE dry_docks
       SET spec_version = spec_version + 1, spec_exported_at = NOW()
       WHERE id = ? AND deleted_at IS NULL`,
      [id],
      executor,
    );
  }

  async countByStatus(executor) {
    return this.execute(
      'SELECT status, COUNT(*) AS total FROM dry_docks WHERE deleted_at IS NULL GROUP BY status',
      [],
      executor,
    );
  }

  async sumBudgetAndCost(executor) {
    return this.execute(
      `SELECT
         COALESCE(SUM(budget), 0) AS total_budget,
         COALESCE(SUM(actual_yard_costs + actual_owner_costs), 0) AS total_costs
       FROM dry_docks WHERE deleted_at IS NULL`,
      [],
      executor,
    );
  }

  async findUpcoming(limit, executor) {
    return this.execute(
      `SELECT d.id, d.dry_dock_no, d.title, d.planned_start_date, d.status, d.priority,
              v.name AS vessel_name
       FROM dry_docks d
       JOIN vessels v ON v.id = d.vessel_id
       WHERE d.deleted_at IS NULL
         AND d.status <> 'COMPLETED'
         AND d.planned_start_date IS NOT NULL
       ORDER BY d.planned_start_date ASC
       LIMIT ?`,
      [limit],
      executor,
    );
  }
}