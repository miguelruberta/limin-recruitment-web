import { Resource } from './Resource.js';
import { toNumber } from '../utils/money.js';

export class PurchaseOrderResource extends Resource {
  toJSON() {
    const supplierId = this.get('supplier_id');

    return {
      id: this.get('id'),
      dryDockId: this.get('dry_dock_id'),
      poNumber: this.get('po_number'),
      category: {
        id: this.get('category_id'),
        name: this.get('category_name'),
      },
      supplier: supplierId ? { id: supplierId, name: this.get('supplier_name') } : null,
      totalUsd: toNumber(this.get('total_usd')),
      status: this.get('status'),
      createdAt: this.get('created_at'),
      updatedAt: this.get('updated_at'),
    };
  }
}