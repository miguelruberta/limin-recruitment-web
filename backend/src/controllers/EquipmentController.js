import { CrudController } from './CrudController.js';

export class EquipmentController extends CrudController {
  index = async (req, res, next) => {
    try {
      const { rows, meta } = await this.crudService.listByVessel(req.params.vesselId, req.query);
      return this.ok(res, rows, meta);
    } catch (error) {
      return next(error);
    }
  };

  store = async (req, res, next) => {
    try {
      const result = await this.crudService.createForVessel(req.params.vesselId, req.body);
      return this.created(res, result);
    } catch (error) {
      return next(error);
    }
  };
}