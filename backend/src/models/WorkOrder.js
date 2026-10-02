import { BaseModel } from '../core/BaseModel.js';
import { WORK_ORDER_STATUS } from '../config/constants.js';
import { toNumber } from '../utils/money.js';

export class WorkOrder extends BaseModel {
  static get table() {
    return 'work_orders';
  }

  get title() {
    return this.get('title');
  }

  get status() {
    return this.get('status');
  }

  get estimatedCost() {
    return toNumber(this.get('estimated_cost'));
  }

  get budgetCost() {
    return toNumber(this.get('budget_cost'));
  }

  get actualCost() {
    return toNumber(this.get('actual_cost'));
  }

  get variance() {
    return Math.round((this.actualCost - this.budgetCost) * 100) / 100;
  }

  get isComplete() {
    return this.status === WORK_ORDER_STATUS.COMPLETE;
  }
}