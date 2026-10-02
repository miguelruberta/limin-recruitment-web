import { NotFoundError } from './errors.js';
import { buildMeta, normalizePagination } from '../utils/pagination.js';

export class BaseService {
  #repository;

  constructor({ repository }) {
    this.#repository = repository;
  }

  get repository() {
    return this.#repository;
  }

  get entityName() {
    return 'Data';
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

    return { rows: result.rows, meta: buildMeta(result.total, page, limit) };
  }

  async getById(id) {
    const row = await this.repository.findById(id);
    if (!row) throw new NotFoundError(this.entityName);
    return row;
  }

  async create(payload) {
    const id = await this.repository.insert(payload);
    return this.repository.findById(id);
  }

  async update(id, payload) {
    await this.getById(id);
    await this.repository.updateById(id, payload);
    return this.repository.findById(id);
  }

  async remove(id) {
    await this.getById(id);
    await this.repository.softDeleteById(id);
  }
}