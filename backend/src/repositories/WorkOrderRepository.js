import { BaseRepository } from '../core/BaseRepository.js';

const DETAIL_COLUMNS = `
  w.*,
  g.name AS specification_group_name,
  g.sort_order AS specification_group_sort_order,
  e.name AS equipment_name,
  e.code AS equipment_code
`;

const DETAIL_JOINS = `
  FROM work_orders w
  JOIN specification_groups g ON g.id = w.specification_group_id
  LEFT JOIN equipment e ON e.id = w.equipment_id
  LEFT JOIN work_order_masters m ON m.id = w.work_order_master_id
`;

export class WorkOrderRepository extends BaseRepository {
  constructor() {
    super({
      table: 'work_orders',
      searchable: ['title', 'description'],
      sortable: ['title', 'status', 'created_at', 'estimated_cost', 'actual_cost', 'id'],
      filters: {
        dry_dock_id: 'dry_dock_id',
        specification_group_id: 'specification_group_id',
        status: 'status',
        equipment_id: 'equipment_id',
        work_order_master_id: 'work_order_master_id',
      },
    });
  }

  async findByIdWithRelations(id, executor) {
    const rows = await this.execute(
      `SELECT ${DETAIL_COLUMNS} ${DETAIL_JOINS}
       WHERE w.id = ? AND w.deleted_at IS NULL LIMIT 1`,
      [id],
      executor,
    );
    return rows[0] ?? null;
  }

  async findGroupedBySpecificationGroup(dryDockId, { search } = {}, executor) {
    const like = `%${search}%`;
    const searchSql = search ? ' AND (w.title LIKE ? OR e.name LIKE ?)' : '';
    const searchParams = search ? [like, like] : [];

    const rows = await this.execute(
      `SELECT ${DETAIL_COLUMNS} ${DETAIL_JOINS}
       WHERE w.dry_dock_id = ? AND w.deleted_at IS NULL${searchSql}
       ORDER BY g.sort_order ASC, w.id ASC`,
      [dryDockId, ...searchParams],
      executor,
    );

    return rows;
  }

  async countByGroup(dryDockId, executor) {
    return this.execute(
      `SELECT specification_group_id, COUNT(*) AS total
       FROM work_orders
       WHERE dry_dock_id = ? AND deleted_at IS NULL
       GROUP BY specification_group_id`,
      [dryDockId],
      executor,
    );
  }

  async belongsToDryDock(id, dryDockId, executor) {
    const row = await this.findById(id, executor);
    return row !== null && Number(row.dry_dock_id) === Number(dryDockId);
  }
}