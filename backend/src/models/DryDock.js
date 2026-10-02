import { BaseModel } from '../core/BaseModel.js';
import { DRY_DOCK_STATUS, DRY_DOCK_STATUS_FLOW } from '../config/constants.js';
import { addMoney, toNumber } from '../utils/money.js';

export class DryDock extends BaseModel {
  static get table() {
    return 'dry_docks';
  }

  get dryDockNo() {
    return this.get('dry_dock_no');
  }

  get budget() {
    return toNumber(this.get('budget'));
  }

  get currency() {
    return this.get('currency');
  }

  get status() {
    return this.get('status');
  }

  get priority() {
    return this.get('priority');
  }

  get totalEstimates() {
    return addMoney(this.get('yard_estimates'), this.get('owner_estimates'));
  }

  get totalCosts() {
    return addMoney(this.get('actual_yard_costs'), this.get('actual_owner_costs'));
  }

  get variance() {
    return Math.round((this.totalCosts - this.budget) * 100) / 100;
  }

  get isPlanning() {
    return this.status === DRY_DOCK_STATUS.PLANNING;
  }

  get isCompleted() {
    return this.status === DRY_DOCK_STATUS.COMPLETED;
  }

  get canStart() {
    return this.isPlanning && Boolean(this.get('shipyard_id'));
  }

  canTransitionTo(nextStatus) {
    return (DRY_DOCK_STATUS_FLOW[this.status] ?? []).includes(nextStatus);
  }
}