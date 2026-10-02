import { BaseRepository } from '../core/BaseRepository.js';

export class SupplierRepository extends BaseRepository {
  constructor() {
    super({
      table: 'suppliers',
      searchable: ['name'],
      sortable: ['name', 'id'],
      defaultSort: 'name',
    });
  }
}