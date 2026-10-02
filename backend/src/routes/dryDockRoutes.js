import Router from 'express';
import { ROLES, WRITE_ROLES } from '../config/constants.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import * as purchaseOrderSchemas from '../validators/purchaseOrderSchemas.js';
import * as dryDockSchemas from '../validators/dryDockSchemas.js';
import * as taskSchemas from '../validators/taskSchemas.js';
import * as attachmentSchemas from '../validators/attachmentSchemas.js';
import { uploadSingle } from '../middlewares/upload.js';

export function dryDockRoutes({
  dryDockController: c,
  workOrderController: workOrders,
  purchaseOrderController: purchaseOrders,
  taskController: tasks,
  attachmentController: attachments,
}) {
  const router = Router();
  const canWrite = authorize(...WRITE_ROLES);
  const isAdmin = authorize(ROLES.ADMIN);

  router.use(authenticate);

  router.get('/', validate(dryDockSchemas.list), c.index);
  router.post('/', canWrite, validate(dryDockSchemas.create), c.store);

  router.get('/:id', validate(dryDockSchemas.show), c.show);
  router.put('/:id', canWrite, validate(dryDockSchemas.update), c.update);
  router.delete('/:id', isAdmin, validate(dryDockSchemas.remove), c.destroy);

  router.patch('/:id/shipyard', canWrite, validate(dryDockSchemas.selectShipyard), c.selectShipyard);
  router.patch('/:id/priority', canWrite, validate(dryDockSchemas.changePriority), c.changePriority);
  router.patch('/:id/status', canWrite, validate(dryDockSchemas.changeStatus), c.changeStatus);
  router.post('/:id/start', canWrite, validate(dryDockSchemas.remove), c.start);

  router.get('/:id/cost-summary', validate(dryDockSchemas.show), c.costSummary);
  router.get('/:id/charts/status', validate(dryDockSchemas.show), c.chartStatus);
  router.get('/:id/charts/yard-stay', validate(dryDockSchemas.show), c.chartYardStay);
  router.get('/:id/charts/comparison', validate(dryDockSchemas.show), c.chartComparison);

  router.get('/:id/specifications', validate(dryDockSchemas.specifications), c.specifications);
  router.get(
    '/:id/specifications/preview',
    validate(dryDockSchemas.show),
    c.previewSpecification,
  );
  router.post(
    '/:id/specifications/export',
    canWrite,
    validate(dryDockSchemas.show),
    c.exportSpecification,
  );

  router.post(
    '/:id/work-orders',
    canWrite,
    validate(dryDockSchemas.createWorkOrder),
    workOrders.store,
  );

  router.get(
    '/:id/purchase-orders',
    validate(purchaseOrderSchemas.listByDryDock),
    purchaseOrders.index,
  );
  router.post(
    '/:id/purchase-orders',
    canWrite,
    validate(purchaseOrderSchemas.create),
    purchaseOrders.store,
  );

  router.get('/:id/attachments', validate(attachmentSchemas.list), attachments.index);
  router.post(
    '/:id/attachments',
    canWrite,
    uploadSingle,
    validate(attachmentSchemas.upload),
    attachments.store,
  );
  router.patch(
    '/:id/attachments/:attachmentId',
    canWrite,
    validate(attachmentSchemas.update),
    attachments.update,
  );
  router.delete(
    '/:id/attachments/:attachmentId',
    canWrite,
    validate(attachmentSchemas.remove),
    attachments.destroy,
  );

  router.get('/:id/tasks', validate(taskSchemas.list), tasks.index);
  router.post('/:id/tasks', canWrite, validate(taskSchemas.create), tasks.store);
  router.patch('/:id/tasks/:taskId', canWrite, validate(taskSchemas.remove), tasks.update);
  router.delete('/:id/tasks/:taskId', canWrite, validate(taskSchemas.remove), tasks.destroy);

  return router;
}