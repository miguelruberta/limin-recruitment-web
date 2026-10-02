import { BaseService } from '../core/BaseService.js';
import { MasterResource } from '../resources/MasterResource.js';
import { buildMeta, normalizePagination } from '../utils/pagination.js';

export class CrudService extends BaseService {
  #fields;

  constructor({ repository, fields }) {
    super({ repository });
    this.#fields = fields;
  }

  toJson(row) {
    return new MasterResource(row, this.#fields).toJSON();
  }

  toColumns(payload) {
    const columns = {};

    for (const [key, value] of Object.entries(payload)) {
      const column = this.#fields[key];
      if (!column || value === undefined) continue;
      columns[column] = value === '' ? null : value;
    }

    return columns;
  }

  mapListFilters(query) {
    return query;
  }

  async list(query = {}) {
    const { page, limit, offset } = normalizePagination(query);
    const result = await this.repository.findAll({
      page,
      limit,
      offset,
      search: query.search,
      sort: query.sort,
      filters: this.mapListFilters(query),
    });

    return {
      rows: result.rows.map((row) => this.toJson(row)),
      meta: buildMeta(result.total, page, limit),
    };
  }

  async getById(id) {
    return this.toJson(await super.getById(id));
  }

  async create(payload) {
    const id = await this.repository.insert(this.toColumns(payload));
    return this.toJson(await this.repository.findById(id));
  }

  async update(id, payload) {
    await super.getById(id);
    const columns = this.toColumns(payload);
    if (Object.keys(columns).length > 0) await this.repository.updateById(id, columns);
    return this.toJson(await this.repository.findById(id));
  }
}