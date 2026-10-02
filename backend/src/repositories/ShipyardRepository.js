import { BaseRepository } from '../core/BaseRepository.js';

export class ShipyardRepository extends BaseRepository {
  constructor() {
    super({
      table: 'shipyards',
      searchable: ['name', 'country', 'contact'],
      sortable: ['name', 'country', 'id'],
      defaultSort: 'name',
    });
  }
}