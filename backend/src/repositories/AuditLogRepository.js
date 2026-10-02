import { BaseRepository } from '../core/BaseRepository.js';

export class AuditLogRepository extends BaseRepository {
  constructor() {
    super({
      table: 'audit_logs',
      sortable: ['created_at', 'id'],
      filters: {
        user_id: 'user_id',
        entity: 'entity',
        entity_id: 'entity_id',
        action: 'action',
      },
      softDelete: false,
      defaultSort: 'created_at',
    });
  }
}