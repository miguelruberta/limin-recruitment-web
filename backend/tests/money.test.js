import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { addMoney, toNumber } from '../src/utils/money.js';

describe('toNumber', () => {
  it('mengubah string numerik menjadi angka', () => {
    assert.equal(toNumber('1500.50'), 1500.5);
  });

  it('mengembalikan 0 untuk nilai null atau string kosong', () => {
    assert.equal(toNumber(null), 0);
    assert.equal(toNumber(''), 0);
  });

  it('mengembalikan 0 untuk nilai yang bukan angka', () => {
    assert.equal(toNumber('abc'), 0);
  });
});

describe('addMoney', () => {
  it('menjumlahkan dua nilai uang', () => {
    assert.equal(addMoney(1000, 2500), 3500);
  });

  it('menganggap nilai kosong sebagai nol', () => {
    assert.equal(addMoney(null, undefined), 0);
  });

  it('menghindari galat floating point pada pecahan kecil', () => {
    assert.equal(addMoney(0.1, 0.2), 0.3);
  });
});