import { DRY_DOCK_STATUS } from '../config/constants.js';
import { toNumber } from '../utils/money.js';

const DEFAULT_UPCOMING_LIMIT = 10;
const MAX_UPCOMING_LIMIT = 50;

export class DashboardService {
  #dryDockRepository;

  constructor({ dryDockRepository }) {
    this.#dryDockRepository = dryDockRepository;
  }

  async summary() {
    const [statusRows, totals] = await Promise.all([
      this.#dryDockRepository.countByStatus(),
      this.#dryDockRepository.sumBudgetAndCost(),
    ]);

    const counts = new Map(statusRows.map((row) => [row.status, toNumber(row.total)]));
    const totalBudget = toNumber(totals?.total_budget ?? 0);
    const totalCosts = toNumber(totals?.total_costs ?? 0);

    return {
      byStatus: Object.values(DRY_DOCK_STATUS).map((status) => ({
        status,
        total: counts.get(status) ?? 0,
      })),
      totalBudget,
      totalCosts,
      variance: Math.round((totalCosts - totalBudget) * 100) / 100,
    };
  }

  async upcoming(limit) {
    const bounded = Math.min(
      Math.max(1, Number(limit) || DEFAULT_UPCOMING_LIMIT),
      MAX_UPCOMING_LIMIT,
    );

    const rows = await this.#dryDockRepository.findUpcoming(bounded);

    return rows.map((row) => ({
      id: row.id,
      dryDockNo: row.dry_dock_no,
      title: row.title,
      vesselName: row.vessel_name,
      plannedStartDate: row.planned_start_date,
      status: row.status,
      priority: row.priority,
    }));
  }
}