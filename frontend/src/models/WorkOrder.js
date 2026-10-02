export class WorkOrder {
  static fromApi(payload = {}) {
    const budgetCost = Number(payload.budgetCost ?? 0);
    const actualCost = Number(payload.actualCost ?? 0);

    return {
      id: payload.id,
      dryDockId: payload.dryDockId ?? null,
      title: payload.title ?? '',
      description: payload.description ?? '',
      imageUrl: payload.imageUrl ?? null,
      status: payload.status ?? 'OPEN',
      specificationGroup: payload.specificationGroup ?? { id: null, name: '' },
      workOrderMasterId: payload.workOrderMasterId ?? null,
      equipment: payload.equipment ?? null,
      estimatedCost: Number(payload.estimatedCost ?? 0),
      budgetCost,
      actualCost,
      variance: Math.round((actualCost - budgetCost) * 100) / 100,
    };
  }
}