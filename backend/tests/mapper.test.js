import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { mapFields, pickDefined } from '../src/utils/mapper.js';

const FIELD_MAP = {
  dryDockNo: 'dry_dock_no',
  vesselId: 'vessel_id',
  title: 'title',
};

describe('mapFields', () => {
  it('memetakan kunci camelCase ke kolom database', () => {
    const columns = mapFields({ dryDockNo: 'DD-1', vesselId: 4, title: 'Tug' }, FIELD_MAP);

    assert.deepEqual(columns, {
      dry_dock_no: 'DD-1',
      vessel_id: 4,
      title: 'Tug',
    });
  });

  it('mengabaikan kunci yang tidak ada di field map', () => {
    const columns = mapFields({ unknown: 'x', title: 'Tug' }, FIELD_MAP);

    assert.deepEqual(columns, { title: 'Tug' });
  });

  it('mengabaikan nilai undefined dan mengubah string kosong menjadi null', () => {
    const columns = mapFields({ vesselId: undefined, dryDockNo: '' }, FIELD_MAP);

    assert.deepEqual(columns, { dry_dock_no: null });
  });

  it('mempertahankan nilai nol', () => {
    assert.deepEqual(mapFields({ vesselId: 0 }, FIELD_MAP), { vessel_id: 0 });
  });
});

describe('pickDefined', () => {
  it('hanya mengambil kunci yang terdefinisi', () => {
    assert.deepEqual(pickDefined({ a: 1, b: undefined, c: null }, ['a', 'b', 'c']), {
      a: 1,
      c: null,
    });
  });

  it('mengabaikan kunci yang tidak ada pada payload', () => {
    assert.deepEqual(pickDefined({ a: 1 }, ['a', 'z']), { a: 1 });
  });
});