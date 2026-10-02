import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { DryDock } from '../src/models/DryDock.js';

function createDryDock(overrides = {}) {
  return new DryDock({
    id: 1,
    dry_dock_no: 'SEPT2020/DD1',
    status: 'PLANNING',
    priority: 'MEDIUM',
    budget: 200000,
    yard_estimates: 90000,
    owner_estimates: 100000,
    actual_yard_costs: 80000,
    actual_owner_costs: 110000,
    shipyard_id: 3,
    ...overrides,
  });
}

describe('DryDock', () => {
  it('menjumlahkan total estimates dari yard dan owner', () => {
    assert.equal(createDryDock().totalEstimates, 190000);
  });

  it('menjumlahkan total costs dari yard dan owner', () => {
    assert.equal(createDryDock().totalCosts, 190000);
  });

  it('menghitung selisih terhadap budget', () => {
    assert.equal(createDryDock().variance, -10000);
  });

  it('hanya dapat dimulai saat status PLANNING dan shipyard tersedia', () => {
    assert.equal(createDryDock().canStart, true);
    assert.equal(createDryDock({ status: 'EXECUTION' }).canStart, false);
    assert.equal(createDryDock({ shipyard_id: null }).canStart, false);
  });

  it('membolehkan transisi status sesuai alur', () => {
    const planning = createDryDock();

    assert.equal(planning.canTransitionTo('EXECUTION'), true);
    assert.equal(planning.canTransitionTo('COMPLETED'), false);
  });
});