export class DryDock {
  static fromApi(payload = {}) {
    return {
      id: payload.id,
      dryDockNo: payload.dryDockNo ?? '',
      title: payload.title ?? '',
      description: payload.description ?? '',
      vessel: payload.vessel ?? { id: null, name: '', imageUrl: null },
      company: payload.company ?? '',
      shipyard: payload.shipyard ?? null,
      accountCode: payload.accountCode ?? '',
      responsibleRank: payload.responsibleRank ?? '',
      currency: payload.currency ?? 'USD',
      budget: Number(payload.budget ?? 0),
      priority: payload.priority ?? 'MEDIUM',
      status: payload.status ?? 'PLANNING',
      dates: payload.dates ?? {},
      specification: payload.specification ?? { version: 0, exportedAt: null },
      costSummary: payload.costSummary ?? null,
      actions: payload.actions ?? { canStart: false, canEdit: false },
    };
  }
}