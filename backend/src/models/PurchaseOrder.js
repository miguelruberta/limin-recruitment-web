import { BaseModel } from '../core/BaseModel.js';
import { PURCHASE_ORDER_STATUS } from '../config/constants.js';
import { toNumber } from '../utils/money.js';

export class PurchaseOrder extends BaseModel {
  static get table() {
    return 'purchase_orders';
  }

  get poNumber() {
    return this.get('po_number');
  }

  get totalUsd() {
    return toNumber(this.get('total_usd'));
  }

  get status() {
    return this.get('status');
  }

  get isEditable() {
    return this.status === PURCHASE_ORDER_STATUS.DRAFT;
  }

  get isCancellable() {
    return this.status !== PURCHASE_ORDER_STATUS.CANCELLED;
  }
}