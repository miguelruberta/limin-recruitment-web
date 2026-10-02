import { Resource } from './Resource.js';
import { toNumber } from '../utils/money.js';

export class DryDockListItemResource extends Resource {
  toJSON() {
    return {
      id: this.get('id'),
      dryDockNo: this.get('dry_dock_no'),
      title: this.get('title'),
      vesselName: this.get('vessel_name'),
      vesselImageUrl: this.get('vessel_image_path'),
      companyName: this.get('company_name'),
      shipyardName: this.get('shipyard_name'),
      status: this.get('status'),
      priority: this.get('priority'),
      currency: this.get('currency'),
      budget: toNumber(this.get('budget')),
      plannedStartDate: this.get('planned_start_date'),
      plannedEndDate: this.get('planned_end_date'),
      updatedAt: this.get('updated_at'),
    };
  }
}