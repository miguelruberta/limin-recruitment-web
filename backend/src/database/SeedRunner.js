import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { logger } from '../config/logger.js';

const SEEDS_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../database/seeds',
);

const DEFAULT_SEED_EMAIL = 'admin@drydock.local';
const DEFAULT_SEED_PASSWORD = 'ChangeMe123!';

export class SeedRunner {
  #connection;

  constructor() {
    this.#connection = null;
  }

  async #connect() {
    this.#connection = await mysql.createConnection({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: env.DB_NAME,
      charset: 'utf8mb4_unicode_ci',
      multipleStatements: true,
    });
  }

  #buildPlaceholders() {
    const email = process.env.ADMIN_SEED_EMAIL || DEFAULT_SEED_EMAIL;
    const password = process.env.ADMIN_SEED_PASSWORD || DEFAULT_SEED_PASSWORD;

    return {
      email,
      password,
      hashPromise: bcrypt.hash(password, env.BCRYPT_COST),
    };
  }

  async seed() {
    await this.#connect();

    const entries = (await fs.readdir(SEEDS_DIR)).filter((entry) => entry.endsWith('.sql')).sort();
    const { email, password, hashPromise } = this.#buildPlaceholders();

    for (const entry of entries) {
      const template = await fs.readFile(path.join(SEEDS_DIR, entry), 'utf8');
      const sql = template
        .replaceAll('__ADMIN_EMAIL__', email)
        .replaceAll('__ADMIN_PASSWORD_HASH__', await hashPromise);

      await this.#connection.query(sql);
      logger.info({ file: entry }, 'Seed diterapkan');
    }

    if (env.isProduction) {
      logger.warn('Seed produksi aktif: ganti kredensial admin bawaan sebelum rilis.');
    }

    return { email, password, files: entries.length };
  }

  async close() {
    if (this.#connection) await this.#connection.end();
  }
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectRun) {
  const runner = new SeedRunner();
  try {
    const result = await runner.seed();
    console.log(`Seed selesai (${result.files} berkas).`);
    console.log(`Admin: ${result.email} / ${result.password}`);
  } catch (error) {
    console.error('Seed gagal:', error.message);
    process.exitCode = 1;
  } finally {
    await runner.close();
  }
}