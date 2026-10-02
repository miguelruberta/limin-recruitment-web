import { CostSummaryResource } from './CostSummaryResource.js';
import { DRY_DOCK_STATUS } from '../config/constants.js';
import { Resource } from './Resource.js';
import { toNumber } from '../utils/money.js';

export class DryDockResource extends Resource {
  toJSON() {
    const status = this.get('status');
    const shipyardId = this.get('shipyard_id');

    return {
      id: this.get('id'),
      dryDockNo: this.get('dry_dock_no'),
      title: this.get('title'),
      description: this.get('description'),
      vessel: {
        id: this.get('vessel_id'),
        name: this.get('vessel_name'),
        imageUrl: this.get('vessel_image_path'),
      },
      company: this.get('company_name'),
      shipyard: shipyardId
        ? { id: shipyardId, name: this.get('shipyard_name') }
        : null,
      accountCode: this.get('account_code'),
      responsibleRank: this.get('responsible_rank'),
      currency: this.get('currency'),
      budget: toNumber(this.get('budget')),
      priority: this.get('priority'),
      status,
      dates: {
        plannedStart: this.get('planned_start_date'),
        plannedEnd: this.get('planned_end_date'),
        actualStart: this.get('actual_start_date'),
        actualEnd: this.get('actual_end_date'),
      },
      specification: {
        version: toNumber(this.get('spec_version')),
        exportedAt: this.get('spec_exported_at'),
      },
      costSummary: new CostSummaryResource(this.props).toJSON(),
      actions: {
        canStart: status === DRY_DOCK_STATUS.PLANNING && Boolean(shipyardId),
        canEdit: status !== DRY_DOCK_STATUS.COMPLETED,
      },
      createdAt: this.get('created_at'),
      updatedAt: this.get('updated_at'),
    };
  }
}