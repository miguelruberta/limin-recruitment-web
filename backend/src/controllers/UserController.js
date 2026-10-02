import { BaseController } from '../core/BaseController.js';

export class UserController extends BaseController {
  #userService;

  constructor({ userService }) {
    super();
    this.#userService = userService;
  }

  index = async (req, res, next) => {
    try {
      const { rows, meta } = await this.#userService.list(req.query);
      return this.ok(res, rows, meta);
    } catch (error) {
      return next(error);
    }
  };

  store = async (req, res, next) => {
    try {
      return this.created(res, await this.#userService.create(req.body));
    } catch (error) {
      return next(error);
    }
  };

  show = async (req, res, next) => {
    try {
      return this.ok(res, await this.#userService.show(req.params.id));
    } catch (error) {
      return next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      return this.ok(res, await this.#userService.update(req.params.id, req.body));
    } catch (error) {
      return next(error);
    }
  };

  destroy = async (req, res, next) => {
    try {
      await this.#userService.remove(req.params.id);
      return this.noContent(res);
    } catch (error) {
      return next(error);
    }
  };
}