import Router from 'express';
import { WRITE_ROLES } from '../config/constants.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { idParams, listQuery } from '../validators/commonSchemas.js';
import * as masterSchemas from '../validators/masterSchemas.js';

export function equipmentRoutes({ equipmentController: c }) {
  const router = Router();
  const canWrite = authorize(...WRITE_ROLES);

  router.use(authenticate);

  router.get('/', validate({ query: listQuery(), params: masterSchemas.equipment.list.params }), c.index);
  router.post('/', canWrite, validate(masterSchemas.equipment.create), c.store);
  router.put('/:id', canWrite, validate(masterSchemas.equipment.update), c.update);
  router.delete('/:id', canWrite, validate({ params: idParams }), c.destroy);

  return router;
}