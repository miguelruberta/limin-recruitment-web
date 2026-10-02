import { BaseController } from '../core/BaseController.js';

export class DryDockController extends BaseController {
  #dryDockService;

  constructor({ dryDockService }) {
    super();
    this.#dryDockService = dryDockService;
  }

  index = async (req, res, next) => {
    try {
      const { rows, meta } = await this.#dryDockService.list(req.query);
      return this.ok(res, rows, meta);
    } catch (error) {
      return next(error);
    }
  };

  store = async (req, res, next) => {
    try {
      return this.created(res, await this.#dryDockService.create(req.body, req.user));
    } catch (error) {
      return next(error);
    }
  };

  show = async (req, res, next) => {
    try {
      return this.ok(res, await this.#dryDockService.show(req.params.id));
    } catch (error) {
      return next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      return this.ok(res, await this.#dryDockService.update(req.params.id, req.body));
    } catch (error) {
      return next(error);
    }
  };

  destroy = async (req, res, next) => {
    try {
      await this.#dryDockService.remove(req.params.id);
      return this.noContent(res);
    } catch (error) {
      return next(error);
    }
  };

  selectShipyard = async (req, res, next) => {
    try {
      const { shipyardId } = req.body;
      return this.ok(res, await this.#dryDockService.selectShipyard(req.params.id, shipyardId));
    } catch (error) {
      return next(error);
    }
  };

  changePriority = async (req, res, next) => {
    try {
      return this.ok(res, await this.#dryDockService.changePriority(req.params.id, req.body.priority));
    } catch (error) {
      return next(error);
    }
  };

  changeStatus = async (req, res, next) => {
    try {
      return this.ok(
        res,
        await this.#dryDockService.changeStatus(req.params.id, req.body.status, req.user),
      );
    } catch (error) {
      return next(error);
    }
  };

  start = async (req, res, next) => {
    try {
      return this.ok(res, await this.#dryDockService.start(req.params.id));
    } catch (error) {
      return next(error);
    }
  };

  costSummary = async (req, res, next) => {
    try {
      return this.ok(res, await this.#dryDockService.costSummary(req.params.id));
    } catch (error) {
      return next(error);
    }
  };

  chartStatus = async (req, res, next) => {
    try {
      return this.ok(res, await this.#dryDockService.chartStatus(req.params.id));
    } catch (error) {
      return next(error);
    }
  };

  chartYardStay = async (req, res, next) => {
    try {
      return this.ok(res, await this.#dryDockService.chartYardStay(req.params.id));
    } catch (error) {
      return next(error);
    }
  };

  chartComparison = async (req, res, next) => {
    try {
      return this.ok(res, await this.#dryDockService.chartComparison(req.params.id));
    } catch (error) {
      return next(error);
    }
  };

  specifications = async (req, res, next) => {
    try {
      return this.ok(res, await this.#dryDockService.specifications(req.params.id, req.query));
    } catch (error) {
      return next(error);
    }
  };

  previewSpecification = async (req, res, next) => {
    try {
      return this.ok(res, await this.#dryDockService.previewSpecification(req.params.id));
    } catch (error) {
      return next(error);
    }
  };

  exportSpecification = async (req, res, next) => {
    try {
      return this.ok(res, await this.#dryDockService.exportSpecification(req.params.id));
    } catch (error) {
      return next(error);
    }
  };
}