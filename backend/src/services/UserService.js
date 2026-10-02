import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { BaseService } from '../core/BaseService.js';
import { ConflictError, NotFoundError } from '../core/errors.js';
import { UserResource } from '../resources/UserResource.js';
import { pickDefined } from '../utils/mapper.js';
import { buildMeta, normalizePagination } from '../utils/pagination.js';

export class UserService extends BaseService {
  constructor({ userRepository }) {
    super({ repository: userRepository });
  }

  get entityName() {
    return 'Pengguna';
  }

  mapListFilters(query) {
    return { role: query.role, is_active: query.is_active };
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
      rows: result.rows.map((row) => new UserResource(row).toJSON()),
      meta: buildMeta(result.total, page, limit),
    };
  }

  async show(id) {
    const row = await this.repository.findById(id);
    if (!row) throw new NotFoundError(this.entityName);
    return new UserResource(row).toJSON();
  }

  async #assertEmailAvailable(email, excludeId = null) {
    const existing = await this.repository.findByEmail(email);
    if (existing && Number(existing.id) !== Number(excludeId)) {
      throw new ConflictError(`Email ${email} sudah digunakan`);
    }
  }

  async create(payload) {
    await this.#assertEmailAvailable(payload.email);

    const row = {
      name: payload.name,
      email: payload.email,
      role: payload.role,
      password_hash: await bcrypt.hash(payload.password, env.BCRYPT_COST),
    };

    const id = await this.repository.insert(row);
    return this.show(id);
  }

  async update(id, payload) {
    await this.show(id);

    const columns = pickDefined(payload, ['name', 'email', 'role']);
    if (payload.email) await this.#assertEmailAvailable(payload.email, id);
    if (payload.password) {
      columns.password_hash = await bcrypt.hash(payload.password, env.BCRYPT_COST);
      columns.failed_login_attempts = 0;
      columns.locked_until = null;
    }
    if (payload.isActive !== undefined) columns.is_active = payload.isActive ? 1 : 0;

    if (Object.keys(columns).length > 0) await this.repository.updateById(id, columns);
    return this.show(id);
  }
}