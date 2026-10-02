import { BaseRepository } from '../core/BaseRepository.js';

export class EquipmentRepository extends BaseRepository {
  constructor() {
    super({
      table: 'equipment',
      searchable: ['code', 'name'],
      sortable: ['code', 'name', 'id'],
      filters: { vessel_id: 'vessel_id' },
    });
  }
}