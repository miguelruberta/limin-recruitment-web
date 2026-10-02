import { BaseRepository } from '../core/BaseRepository.js';

export class UserRepository extends BaseRepository {
  constructor() {
    super({
      table: 'users',
      searchable: ['name', 'email'],
      sortable: ['name', 'email', 'role', 'created_at', 'id'],
      filters: { role: 'role', is_active: 'is_active' },
      defaultSort: 'name',
    });
  }

  async findByEmail(email) {
    return this.findOneBy({ email });
  }

  async incrementLoginFailure(id) {
    return this.execute(
      'UPDATE users SET failed_login_attempts = failed_login_attempts + 1 WHERE id = ?',
      [id],
    );
  }

  async resetLoginState(id) {
    return this.updateById(id, {
      failed_login_attempts: 0,
      locked_until: null,
    });
  }

  async lockAccount(id, until) {
    return this.updateById(id, {
      failed_login_attempts: 0,
      locked_until: until,
    });
  }

  async setActive(id, isActive) {
    return this.updateById(id, { is_active: isActive ? 1 : 0 });
  }
}