import { BaseRepository } from '../core/BaseRepository.js';

export class PurchaseOrderCategoryRepository extends BaseRepository {
  constructor() {
    super({
      table: 'purchase_order_categories',
      searchable: ['name'],
      sortable: ['name', 'id'],
      softDelete: false,
      defaultSort: 'name',
    });
  }
}