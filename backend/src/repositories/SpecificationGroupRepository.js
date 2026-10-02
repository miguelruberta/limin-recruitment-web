import { BaseRepository } from '../core/BaseRepository.js';

export class SpecificationGroupRepository extends BaseRepository {
  constructor() {
    super({
      table: 'specification_groups',
      searchable: ['name'],
      sortable: ['name', 'sort_order', 'id'],
      defaultSort: 'sort_order',
    });
  }
}