import { BaseRepository } from '../core/BaseRepository.js';

export class YardStayLogRepository extends BaseRepository {
  constructor() {
    super({
      table: 'yard_stay_logs',
      sortable: ['start_date', 'id'],
      filters: { dry_dock_id: 'dry_dock_id', stay_type: 'stay_type' },
      softDelete: false,
    });
  }
}