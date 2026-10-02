import { BaseController } from '../core/BaseController.js';

export class PurchaseOrderController extends BaseController {
  #purchaseOrderService;

  constructor({ purchaseOrderService }) {
    super();
    this.#purchaseOrderService = purchaseOrderService;
  }

  index = async (req, res, next) => {
    try {
      return this.ok(res, await this.#purchaseOrderService.listByDryDock(req.params.id, req.query));
    } catch (error) {
      return next(error);
    }
  };

  store = async (req, res, next) => {
    try {
      return this.created(res, await this.#purchaseOrderService.create(req.params.id, req.body));
    } catch (error) {
      return next(error);
    }
  };

  show = async (req, res, next) => {
    try {
      return this.ok(res, await this.#purchaseOrderService.show(req.params.id));
    } catch (error) {
      return next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      return this.ok(res, await this.#purchaseOrderService.update(req.params.id, req.body));
    } catch (error) {
      return next(error);
    }
  };

  destroy = async (req, res, next) => {
    try {
      await this.#purchaseOrderService.remove(req.params.id);
      return this.noContent(res);
    } catch (error) {
      return next(error);
    }
  };
}