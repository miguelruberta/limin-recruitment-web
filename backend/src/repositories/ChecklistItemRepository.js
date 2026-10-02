import { BaseRepository } from '../core/BaseRepository.js';

export class ChecklistItemRepository extends BaseRepository {
  constructor() {
    super({
      table: 'checklist_items',
      sortable: ['sort_order', 'id'],
      filters: { work_order_master_id: 'work_order_master_id' },
      softDelete: false,
      defaultSort: 'sort_order',
    });
  }
}