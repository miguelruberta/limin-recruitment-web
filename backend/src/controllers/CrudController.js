import { BaseController } from '../core/BaseController.js';

export class CrudController extends BaseController {
  constructor({ crudService }) {
    super();
    this.crudService = crudService;
  }

  index = async (req, res, next) => {
    try {
      const { rows, meta } = await this.crudService.list(req.query);
      return this.ok(res, rows, meta);
    } catch (error) {
      return next(error);
    }
  };

  store = async (req, res, next) => {
    try {
      return this.created(res, await this.crudService.create(req.body));
    } catch (error) {
      return next(error);
    }
  };

  show = async (req, res, next) => {
    try {
      return this.ok(res, await this.crudService.getById(req.params.id));
    } catch (error) {
      return next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      return this.ok(res, await this.crudService.update(req.params.id, req.body));
    } catch (error) {
      return next(error);
    }
  };

  destroy = async (req, res, next) => {
    try {
      await this.crudService.remove(req.params.id);
      return this.noContent(res);
    } catch (error) {
      return next(error);
    }
  };
}