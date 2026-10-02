import { CrudService } from './CrudService.js';
import { NotFoundError } from '../core/errors.js';

export class WorkOrderMasterService extends CrudService {
  async getById(id) {
    const row = await this.repository.findByIdWithChecklist(id);
    if (!row) throw new NotFoundError('Work order master');
    return this.toJson(row);
  }
}