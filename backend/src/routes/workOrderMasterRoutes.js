import Router from 'express';
import { WRITE_ROLES } from '../config/constants.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { listQuery } from '../validators/commonSchemas.js';
import * as masterSchemas from '../validators/masterSchemas.js';

export function workOrderMasterRoutes(container) {
  const router = Router();
  const c = container.workOrderMasterController;
  const checklist = container.checklistItemController;
  const canWrite = authorize(...WRITE_ROLES);

  router.use(authenticate);

  router.get('/', validate({ query: listQuery() }), c.index);
  router.post('/', canWrite, validate(masterSchemas.workOrderMaster.create), c.store);
  router.get('/:id', validate(masterSchemas.checklistItem.list), c.show);
  router.put('/:id', canWrite, validate(masterSchemas.workOrderMaster.update), c.update);
  router.delete('/:id', canWrite, validate(masterSchemas.checklistItem.list), c.destroy);

  router.get('/:id/checklist-items', validate(masterSchemas.checklistItem.list), checklist.index);
  router.post(
    '/:id/checklist-items',
    canWrite,
    validate(masterSchemas.checklistItem.create),
    checklist.store,
  );
  router.patch(
    '/:id/checklist-items/:itemId',
    canWrite,
    validate(masterSchemas.checklistItem.update),
    checklist.update,
  );
  router.delete(
    '/:id/checklist-items/:itemId',
    canWrite,
    validate(masterSchemas.checklistItem.remove),
    checklist.destroy,
  );

  return router;
}