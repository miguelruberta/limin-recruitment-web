export class DryDockListItem {
  static fromApi(payload = {}) {
    return {
      id: payload.id,
      dryDockNo: payload.dryDockNo ?? '',
      title: payload.title ?? '',
      vesselName: payload.vesselName ?? '',
      vesselImageUrl: payload.vesselImageUrl ?? null,
      companyName: payload.companyName ?? '',
      shipyardName: payload.shipyardName ?? null,
      status: payload.status ?? 'PLANNING',
      priority: payload.priority ?? 'MEDIUM',
      currency: payload.currency ?? 'USD',
      budget: Number(payload.budget ?? 0),
      plannedStartDate: payload.plannedStartDate ?? null,
      plannedEndDate: payload.plannedEndDate ?? null,
    };
  }
}