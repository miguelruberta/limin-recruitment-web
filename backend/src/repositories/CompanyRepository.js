import { BaseRepository } from '../core/BaseRepository.js';

export class CompanyRepository extends BaseRepository {
  constructor() {
    super({
      table: 'companies',
      searchable: ['name'],
      sortable: ['name', 'id'],
      defaultSort: 'name',
    });
  }
}