export class CostSummary {
  static fromApi(payload = {}) {
    return {
      budget: Number(payload.budget ?? 0),
      yardEstimates: Number(payload.yardEstimates ?? 0),
      ownerEstimates: Number(payload.ownerEstimates ?? 0),
      totalEstimates: Number(payload.totalEstimates ?? 0),
      actualYardCosts: Number(payload.actualYardCosts ?? 0),
      actualOwnerCosts: Number(payload.actualOwnerCosts ?? 0),
      totalCosts: Number(payload.totalCosts ?? 0),
      variance: Number(payload.variance ?? 0),
      currency: payload.currency ?? 'USD',
    };
  }
}