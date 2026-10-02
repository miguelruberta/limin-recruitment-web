import { BaseRepository } from '../core/BaseRepository.js';

export class VesselRepository extends BaseRepository {
  constructor() {
    super({
      table: 'vessels',
      searchable: ['name', 'imo_number'],
      sortable: ['name', 'imo_number', 'id'],
      filters: { company_id: 'company_id' },
      defaultSort: 'name',
    });
  }
}