import { pool } from '../config/database.js';

export class BaseModel {
  #props;

  constructor(props = {}) {
    this.#props = { ...props };
  }

  get id() {
    return this.#props.id;
  }

  get(key) {
    return this.#props[key];
  }

  get props() {
    return { ...this.#props };
  }

  static get table() {
    return '';
  }

  static get usesSoftDelete() {
    return true;
  }

  static async findById(id, executor = pool) {
    const clause = this.usesSoftDelete ? ' AND deleted_at IS NULL' : '';
    const [rows] = await executor.execute(
      `SELECT * FROM ${this.table} WHERE id = ?${clause} LIMIT 1`,
      [id],
    );
    return rows[0] ? new this(rows[0]) : null;
  }

  static async softDelete(id, executor = pool) {
    const [result] = await executor.execute(
      `UPDATE ${this.table} SET deleted_at = NOW() WHERE id = ?`,
      [id],
    );
    return result.affectedRows;
  }
}