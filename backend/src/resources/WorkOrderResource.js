import { Resource } from './Resource.js';
import { toNumber } from '../utils/money.js';

export class WorkOrderResource extends Resource {
  toJSON() {
    const equipmentId = this.get('equipment_id');
    const budgetCost = toNumber(this.get('budget_cost'));
    const actualCost = toNumber(this.get('actual_cost'));

    return {
      id: this.get('id'),
      dryDockId: this.get('dry_dock_id'),
      title: this.get('title'),
      description: this.get('description'),
      imageUrl: this.get('image_path'),
      status: this.get('status'),
      specificationGroup: {
        id: this.get('specification_group_id'),
        name: this.get('specification_group_name'),
      },
      workOrderMasterId: this.get('work_order_master_id'),
      equipment: equipmentId
        ? {
            id: equipmentId,
            code: this.get('equipment_code'),
            name: this.get('equipment_name'),
          }
        : null,
      estimatedCost: toNumber(this.get('estimated_cost')),
      budgetCost,
      actualCost,
      variance: Math.round((actualCost - budgetCost) * 100) / 100,
      createdAt: this.get('created_at'),
      updatedAt: this.get('updated_at'),
    };
  }
}