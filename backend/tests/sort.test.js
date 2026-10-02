import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { resolveSort } from '../src/utils/sort.js';

const ALLOWED = ['name', 'created_at', 'id'];

describe('resolveSort', () => {
  it('menggunakan default saat sort tidak diberikan', () => {
    assert.deepEqual(resolveSort(undefined, ALLOWED, 'name'), {
      column: 'name',
      direction: 'ASC',
    });
  });

  it('membaca prefix minus sebagai descending', () => {
    assert.deepEqual(resolveSort('-created_at', ALLOWED, 'name'), {
      column: 'created_at',
      direction: 'DESC',
    });
  });

  it('menolak kolom di luar allowlist', () => {
    assert.deepEqual(resolveSort('password_hash', ALLOWED, 'name'), {
      column: 'name',
      direction: 'ASC',
    });
  });

  it('menggunakan arah ASC untuk nama kolom tanpa prefix', () => {
    assert.deepEqual(resolveSort('name', ALLOWED, 'id'), {
      column: 'name',
      direction: 'ASC',
    });
  });

  it('mengabaikan spasi berlebih pada parameter sort', () => {
    assert.deepEqual(resolveSort('  -name  ', ALLOWED, 'id'), {
      column: 'name',
      direction: 'DESC',
    });
  });
});