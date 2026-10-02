import { pool } from '../config/database.js';
import { resolveSort } from '../utils/sort.js';

const SAFE_IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_]*$/;

export class BaseRepository {
  #table;
  #searchable;
  #sortable;
  #filters;
  #softDelete;
  #defaultSort;
  #db;

  constructor({
    table,
    searchable = [],
    sortable = [],
    filters = {},
    softDelete = true,
    defaultSort = 'id',
    db = null,
  }) {
    if (!table) throw new Error('Repository wajib memiliki nama tabel');

    this.#table = table;
    this.#searchable = searchable;
    this.#sortable = sortable;
    this.#filters = filters;
    this.#softDelete = softDelete;
    this.#defaultSort = defaultSort;
    this.#db = db;
  }

  get table() {
    return this.#table;
  }

  resolveExecutor(executor) {
    return executor ?? this.#db ?? pool;
  }

  async execute(sql, params = [], executor) {
    const [rows] = await this.resolveExecutor(executor).execute(sql, params);
    return rows;
  }

  buildSearchClause(search) {
    if (!search || this.#searchable.length === 0) return { sql: '', params: [] };

    const like = `%${search}%`;
    const sql = `(${this.#searchable.map((column) => `${column} LIKE ?`).join(' OR ')})`;
    return { sql: ` AND ${sql}`, params: this.#searchable.map(() => like) };
  }

  buildFilterClause(filters = {}) {
    const clauses = [];
    const params = [];

    for (const [key, value] of Object.entries(filters)) {
      const column = this.#filters[key];
      if (!column || value === undefined || value === null || value === '') continue;

      if (Array.isArray(value)) {
        if (value.length === 0) continue;
        clauses.push(`${column} IN (${value.map(() => '?').join(', ')})`);
        params.push(...value);
      } else {
        clauses.push(`${column} = ?`);
        params.push(value);
      }
    }

    return { sql: clauses.length ? ` AND ${clauses.join(' AND ')}` : '', params };
  }

  buildSoftDeleteClause() {
    return this.#softDelete ? ' AND deleted_at IS NULL' : '';
  }

  #assertSafeKeys(data) {
    const entries = Object.entries(data).filter(([, value]) => value !== undefined);
    for (const [key] of entries) {
      if (!SAFE_IDENTIFIER.test(key)) throw new Error(`Nama kolom tidak valid: ${key}`);
    }
    return entries;
  }

  async findById(id, executor) {
    return this.execute(
      `SELECT * FROM ${this.#table} WHERE id = ?${this.buildSoftDeleteClause()} LIMIT 1`,
      [id],
      executor,
    ).then((rows) => rows[0] ?? null);
  }

  async findOneBy(conditions = {}, executor) {
    const { sql: filterSql, params: filterParams } = this.buildFilterClause(conditions);
    const rows = await this.execute(
      `SELECT * FROM ${this.#table} WHERE 1 = 1${filterSql}${this.buildSoftDeleteClause()} LIMIT 1`,
      filterParams,
      executor,
    );
    return rows[0] ?? null;
  }

  async findBy(field, value, executor) {
    if (!SAFE_IDENTIFIER.test(field)) throw new Error(`Kolom tidak valid: ${field}`);
    const rows = await this.execute(
      `SELECT * FROM ${this.#table} WHERE ${field} = ?${this.buildSoftDeleteClause()} LIMIT 1`,
      [value],
      executor,
    );
    return rows[0] ?? null;
  }

  async findAllBy(field, value, executor) {
    if (!SAFE_IDENTIFIER.test(field)) throw new Error(`Kolom tidak valid: ${field}`);
    return this.execute(
      `SELECT * FROM ${this.#table} WHERE ${field} = ?${this.buildSoftDeleteClause()} ORDER BY id ASC`,
      [value],
      executor,
    );
  }

  async exists(conditions = {}, executor) {
    const row = await this.findOneBy(conditions, executor);
    return row !== null;
  }

  async count(conditions = {}, executor) {
    const { sql: filterSql, params } = this.buildFilterClause(conditions);
    const rows = await this.execute(
      `SELECT COUNT(*) AS total FROM ${this.#table} WHERE 1 = 1${filterSql}${this.buildSoftDeleteClause()}`,
      params,
      executor,
    );
    return rows[0]?.total ?? 0;
  }

  async findAll(options = {}, executor) {
    const db = this.resolveExecutor(executor);
    const { page = 1, limit = 20, offset = 0, search, sort, filters = {} } = options;

    const searchClause = this.buildSearchClause(search);
    const filterClause = this.buildFilterClause(filters);
    const where = ` WHERE 1 = 1${this.buildSoftDeleteClause()}${filterClause.sql}${searchClause.sql}`;
    const { column, direction } = resolveSort(sort, this.#sortable, this.#defaultSort);
    const params = [...filterClause.params, ...searchClause.params];

    const [dataRows, countRows] = await Promise.all([
      db.execute(`SELECT * FROM ${this.#table}${where} ORDER BY ${column} ${direction}, id DESC LIMIT ? OFFSET ?`, [
        ...params,
        limit,
        offset,
      ]),
      db.execute(`SELECT COUNT(*) AS total FROM ${this.#table}${where}`, params),
    ]);

    return { rows: dataRows[0], total: countRows[0][0]?.total ?? 0, page, limit };
  }

  async insert(data, executor) {
    const entries = this.#assertSafeKeys(data);
    if (entries.length === 0) throw new Error('Tidak ada kolom untuk disisipkan');

    const columns = entries.map(([key]) => `\`${key}\``).join(', ');
    const placeholders = entries.map(() => '?').join(', ');
    const result = await this.execute(
      `INSERT INTO ${this.#table} (${columns}) VALUES (${placeholders})`,
      entries.map(([, value]) => value),
      executor,
    );

    return result.insertId;
  }

  async updateById(id, data, executor) {
    const entries = this.#assertSafeKeys(data);
    if (entries.length === 0) return 0;

    const assignments = entries.map(([key]) => `\`${key}\` = ?`).join(', ');
    const result = await this.execute(
      `UPDATE ${this.#table} SET ${assignments} WHERE id = ?`,
      [...entries.map(([, value]) => value), id],
      executor,
    );

    return result.affectedRows;
  }

  async updateMany(conditions, data, executor) {
    const entries = this.#assertSafeKeys(data);
    const { sql: filterSql, params } = this.buildFilterClause(conditions);
    if (entries.length === 0) return 0;

    const assignments = entries.map(([key]) => `\`${key}\` = ?`).join(', ');
    const result = await this.execute(
      `UPDATE ${this.#table} SET ${assignments} WHERE 1 = 1${filterSql}`,
      [...entries.map(([, value]) => value), ...params],
      executor,
    );

    return result.affectedRows;
  }

  async softDeleteById(id, executor) {
    const result = await this.execute(
      `UPDATE ${this.#table} SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL`,
      [id],
      executor,
    );
    return result.affectedRows;
  }

  async deleteById(id, executor) {
    const result = await this.execute(`DELETE FROM ${this.#table} WHERE id = ?`, [id], executor);
    return result.affectedRows;
  }

  async deleteBy(conditions = {}, executor) {
    const { sql, params } = this.buildFilterClause(conditions);
    const result = await this.execute(
      `DELETE FROM ${this.#table} WHERE 1 = 1${sql}`,
      params,
      executor,
    );
    return result.affectedRows;
  }
}