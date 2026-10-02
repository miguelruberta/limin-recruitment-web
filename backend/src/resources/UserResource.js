import { ROLES, WRITE_ROLES } from '../config/constants.js';
import { Resource } from './Resource.js';

export class UserResource extends Resource {
  toJSON() {
    return {
      id: this.get('id'),
      name: this.get('name'),
      email: this.get('email'),
      role: this.get('role'),
      isActive: Boolean(this.get('is_active')),
      createdAt: this.get('created_at'),
      canWrite: WRITE_ROLES.includes(this.get('role')),
      isAdmin: this.get('role') === ROLES.ADMIN,
    };
  }
}