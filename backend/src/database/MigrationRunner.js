import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { pool, closePool } from '../config/database.js';
import { logger } from '../config/logger.js';

const MIGRATIONS_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../database/migrations',
);

export class MigrationRunner {
  #db;

  constructor(db = pool) {
    this.#db = db;
  }

  async ensureRegistry() {
    await this.#db.query(`CREATE TABLE IF NOT EXISTS schema_migrations (
      id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(190) NOT NULL UNIQUE,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`);
  }

  async appliedFiles() {
    const [rows] = await this.#db.query('SELECT filename FROM schema_migrations');
    return new Set(rows.map((row) => row.filename));
  }

  async pendingFiles() {
    const entries = await fs.readdir(MIGRATIONS_DIR);
    const applied = await this.appliedFiles();

    return entries
      .filter((entry) => entry.endsWith('.sql'))
      .sort()
      .filter((entry) => !applied.has(entry));
  }

  async migrate() {
    await this.ensureRegistry();
    const pending = await this.pendingFiles();

    for (const filename of pending) {
      const sql = await fs.readFile(path.join(MIGRATIONS_DIR, filename), 'utf8');
      await this.#db.query(sql);
      await this.#db.execute('INSERT INTO schema_migrations (filename) VALUES (?)', [filename]);
      logger.info({ filename }, 'Migrasi diterapkan');
    }

    return pending.length;
  }
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  try {
    const count = await new MigrationRunner().migrate();
    console.log(count === 0 ? 'Tidak ada migrasi baru.' : `${count} migrasi diterapkan.`);
  } catch (error) {
    console.error('Migrasi gagal:', error.message);
    process.exitCode = 1;
  } finally {
    await closePool();
  }
}