import Router from 'express';
import { WRITE_ROLES } from '../config/constants.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { uploadSingle } from '../middlewares/upload.js';
import { validate } from '../middlewares/validate.js';
import * as workOrderSchemas from '../validators/workOrderSchemas.js';

export function workOrderRoutes({ workOrderController: c }) {
  const router = Router();
  const canWrite = authorize(...WRITE_ROLES);

  router.use(authenticate);

  router.get('/:id', validate(workOrderSchemas.show), c.show);
  router.put('/:id', canWrite, validate(workOrderSchemas.update), c.update);
  router.patch('/:id/status', canWrite, validate(workOrderSchemas.changeStatus), c.changeStatus);
  router.delete('/:id', canWrite, validate(workOrderSchemas.show), c.destroy);

  router.post('/:id/image', canWrite, uploadSingle, validate(workOrderSchemas.uploadImage), c.uploadImage);

  router.get('/:id/attachments', validate(workOrderSchemas.uploadAttachment), c.listAttachments);
  router.post(
    '/:id/attachments',
    canWrite,
    uploadSingle,
    validate(workOrderSchemas.uploadAttachment),
    c.uploadAttachment,
  );
  router.delete(
    '/:id/attachments/:attachmentId',
    canWrite,
    validate(workOrderSchemas.removeAttachment),
    c.removeAttachment,
  );

  return router;
}