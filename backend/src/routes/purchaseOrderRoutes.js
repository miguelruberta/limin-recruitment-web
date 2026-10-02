import Router from 'express';
import { WRITE_ROLES } from '../config/constants.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import * as purchaseOrderSchemas from '../validators/purchaseOrderSchemas.js';

export function purchaseOrderRoutes({ purchaseOrderController: c }) {
  const router = Router();
  const canWrite = authorize(...WRITE_ROLES);

  router.use(authenticate);

  router.get('/:id', validate(purchaseOrderSchemas.update), c.show);
  router.put('/:id', canWrite, validate(purchaseOrderSchemas.update), c.update);
  router.delete('/:id', canWrite, validate(purchaseOrderSchemas.update), c.destroy);

  return router;
}