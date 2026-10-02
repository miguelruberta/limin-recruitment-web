import { addMoney, toNumber } from '../utils/money.js';
import { Resource } from './Resource.js';

export class CostSummaryResource extends Resource {
  toJSON() {
    const budget = toNumber(this.get('budget'));
    const totalEstimates = addMoney(this.get('yard_estimates'), this.get('owner_estimates'));
    const totalCosts = addMoney(this.get('actual_yard_costs'), this.get('actual_owner_costs'));

    return {
      budget,
      yardEstimates: toNumber(this.get('yard_estimates')),
      ownerEstimates: toNumber(this.get('owner_estimates')),
      totalEstimates,
      actualYardCosts: toNumber(this.get('actual_yard_costs')),
      actualOwnerCosts: toNumber(this.get('actual_owner_costs')),
      totalCosts,
      variance: Math.round((totalCosts - budget) * 100) / 100,
      currency: this.get('currency'),
    };
  }
}