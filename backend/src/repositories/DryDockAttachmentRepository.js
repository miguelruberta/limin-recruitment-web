import { BaseRepository } from '../core/BaseRepository.js';

export class DryDockAttachmentRepository extends BaseRepository {
  constructor() {
    super({
      table: 'dry_dock_attachments',
      sortable: ['created_at', 'id'],
      filters: { dry_dock_id: 'dry_dock_id' },
      softDelete: false,
    });
  }
}