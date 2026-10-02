import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { CostSummaryResource } from '../src/resources/CostSummaryResource.js';

describe('CostSummaryResource', () => {
  it('menghitung ringkasan biaya dari kolom mentah', () => {
    const result = new CostSummaryResource({
      budget: 200000,
      yard_estimates: 90000,
      owner_estimates: 100000,
      actual_yard_costs: 80000,
      actual_owner_costs: 110000,
      currency: 'USD',
    }).toJSON();

    assert.equal(result.totalEstimates, 190000);
    assert.equal(result.totalCosts, 190000);
    assert.equal(result.variance, -10000);
    assert.equal(result.currency, 'USD');
  });

  it('menangani baris tanpa nilai biaya', () => {
    const result = new CostSummaryResource({ budget: 5000 }).toJSON();

    assert.equal(result.totalEstimates, 0);
    assert.equal(result.totalCosts, 0);
    assert.equal(result.variance, -5000);
  });
});