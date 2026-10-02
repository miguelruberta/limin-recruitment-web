import { BaseController } from '../core/BaseController.js';

export class TaskController extends BaseController {
  #taskService;

  constructor({ taskService }) {
    super();
    this.#taskService = taskService;
  }

  index = async (req, res, next) => {
    try {
      const { rows, meta } = await this.#taskService.listByDryDock(req.params.id, req.query);
      return this.ok(res, rows, meta);
    } catch (error) {
      return next(error);
    }
  };

  store = async (req, res, next) => {
    try {
      return this.created(res, await this.#taskService.create(req.params.id, req.body));
    } catch (error) {
      return next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      return this.ok(res, await this.#taskService.update(req.params.id, req.params.taskId, req.body));
    } catch (error) {
      return next(error);
    }
  };

  destroy = async (req, res, next) => {
    try {
      await this.#taskService.remove(req.params.id, req.params.taskId);
      return this.noContent(res);
    } catch (error) {
      return next(error);
    }
  };
}