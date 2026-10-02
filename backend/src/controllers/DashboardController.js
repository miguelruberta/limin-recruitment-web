import { BaseController } from '../core/BaseController.js';

export class DashboardController extends BaseController {
  #dashboardService;

  constructor({ dashboardService }) {
    super();
    this.#dashboardService = dashboardService;
  }

  summary = async (req, res, next) => {
    try {
      return this.ok(res, await this.#dashboardService.summary());
    } catch (error) {
      return next(error);
    }
  };

  upcoming = async (req, res, next) => {
    try {
      return this.ok(res, await this.#dashboardService.upcoming(req.query.limit));
    } catch (error) {
      return next(error);
    }
  };
}