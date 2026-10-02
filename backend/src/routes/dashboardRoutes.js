import Router from 'express';
import Joi from 'joi';
import { ROLES } from '../config/constants.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const upcomingQuery = { query: Joi.object({ limit: Joi.number().integer().min(1).max(50) }) };

export function dashboardRoutes({ dashboardController: c }) {
  const router = Router();

  router.use(authenticate, authorize(ROLES.ADMIN, ROLES.SUPERINTENDENT, ROLES.VIEWER));

  router.get('/summary', c.summary);
  router.get('/upcoming', validate(upcomingQuery), c.upcoming);

  return router;
}