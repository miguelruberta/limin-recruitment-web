import { BaseRepository } from '../core/BaseRepository.js';

export class WorkOrderAttachmentRepository extends BaseRepository {
  constructor() {
    super({
      table: 'work_order_attachments',
      sortable: ['created_at', 'id'],
      filters: { work_order_id: 'work_order_id' },
      softDelete: false,
    });
  }
}