import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { PAGINATION } from '../src/config/constants.js';
import { buildMeta, normalizePagination } from '../src/utils/pagination.js';

describe('normalizePagination', () => {
  it('memakai nilai default saat parameter kosong', () => {
    assert.deepEqual(normalizePagination({}), {
      page: PAGINATION.DEFAULT_PAGE,
      limit: PAGINATION.DEFAULT_LIMIT,
      offset: 0,
    });
  });

  it('menghitung offset dari page dan limit', () => {
    assert.deepEqual(normalizePagination({ page: 3, limit: 10 }), {
      page: 3,
      limit: 10,
      offset: 20,
    });
  });

  it('membatasi limit pada nilai maksimum', () => {
    const { limit } = normalizePagination({ limit: 9999 });
    assert.equal(limit, PAGINATION.MAX_LIMIT);
  });

  it('menolak nilai tidak valid dengan memakai default', () => {
    assert.deepEqual(normalizePagination({ page: 'abc', limit: -5 }), {
      page: PAGINATION.DEFAULT_PAGE,
      limit: PAGINATION.DEFAULT_LIMIT,
      offset: 0,
    });
  });
});

describe('buildMeta', () => {
  it('menghitung jumlah halaman dengan pembulatan ke atas', () => {
    assert.deepEqual(buildMeta(25, 1, 10), {
      page: 1,
      limit: 10,
      total: 25,
      totalPages: 3,
    });
  });

  it('menghasilkan totalPages minimal satu saat data kosong', () => {
    assert.equal(buildMeta(0, 1, 10).totalPages, 1);
  });
});