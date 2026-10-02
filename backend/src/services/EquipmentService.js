import { CrudService } from './CrudService.js';

export class EquipmentService extends CrudService {
  async listByVessel(vesselId, query = {}) {
    return this.list({ ...query, vessel_id: vesselId });
  }

  async createForVessel(vesselId, payload) {
    const columns = { ...this.toColumns(payload), vessel_id: vesselId };
    const id = await this.repository.insert(columns);
    return this.toJson(await this.repository.findById(id));
  }
}