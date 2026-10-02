import { BaseModel } from '../core/BaseModel.js';
import { ROLES, WRITE_ROLES } from '../config/constants.js';

export class User extends BaseModel {
  static get table() {
    return 'users';
  }

  get role() {
    return this.get('role');
  }

  get isActive() {
    return Boolean(this.get('is_active'));
  }

  get isLocked() {
    const lockedUntil = this.get('locked_until');
    if (!lockedUntil) return false;
    return new Date(lockedUntil).getTime() > Date.now();
  }

  get canWrite() {
    return WRITE_ROLES.includes(this.role);
  }

  get isAdmin() {
    return this.role === ROLES.ADMIN;
  }
}