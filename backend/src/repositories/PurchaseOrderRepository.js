import { BaseRepository } from '../core/BaseRepository.js';

const LIST_COLUMNS = `
  po.*,
  c.name AS category_name,
  s.name AS supplier_name
`;

const LIST_JOINS = `
  FROM purchase_orders po
  JOIN purchase_order_categories c ON c.id = po.category_id
  LEFT JOIN suppliers s ON s.id = po.supplier_id
`;

export class PurchaseOrderRepository extends BaseRepository {
  constructor() {
    super({
      table: 'purchase_orders',
      searchable: ['po_number'],
      sortable: ['po_number', 'total_usd', 'status', 'created_at', 'id'],
      filters: {
        dry_dock_id: 'dry_dock_id',
        category_id: 'category_id',
        supplier_id: 'supplier_id',
        status: 'status',
      },
      defaultSort: 'po_number',
    });
  }

  async findByIdWithRelations(id, executor) {
    const rows = await this.execute(
      `SELECT ${LIST_COLUMNS} ${LIST_JOINS}
       WHERE po.id = ? AND po.deleted_at IS NULL LIMIT 1`,
      [id],
      executor,
    );
    return rows[0] ?? null;
  }

  async findByDryDockGroupedByCategory(dryDockId, { search } = {}, executor) {
    const like = `%${search}%`;
    const searchSql = search ? ' AND po.po_number LIKE ?' : '';
    const searchParams = search ? [like] : [];

    const rows = await this.execute(
      `SELECT ${LIST_COLUMNS} ${LIST_JOINS}
       WHERE po.dry_dock_id = ? AND po.deleted_at IS NULL${searchSql}
       ORDER BY c.name ASC, po.po_number ASC`,
      [dryDockId, ...searchParams],
      executor,
    );

    const categories = await this.execute(
      'SELECT id, name FROM purchase_order_categories ORDER BY name ASC',
      [],
      executor,
    );

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      items: rows.filter((row) => Number(row.category_id) === Number(category.id)),
    }));
  }

  async existsPoNumber(dryDockId, poNumber, excludeId = null, executor) {
    const excludeSql = excludeId ? ' AND id <> ?' : '';
    const params = excludeId ? [dryDockId, poNumber, excludeId] : [dryDockId, poNumber];

    const rows = await this.execute(
      `SELECT id FROM purchase_orders
       WHERE dry_dock_id = ? AND po_number = ? AND deleted_at IS NULL${excludeSql}
       LIMIT 1`,
      params,
      executor,
    );

    return rows[0] ?? null;
  }
}