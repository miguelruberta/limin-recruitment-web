import Router from 'express';
import { ROLES } from '../config/constants.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { idParams } from '../validators/commonSchemas.js';
import * as userSchemas from '../validators/userSchemas.js';

export function userRoutes({ userController: c }) {
  const router = Router();
  const isAdmin = authorize(ROLES.ADMIN);

  router.use(authenticate, isAdmin);

  router.get('/', validate(userSchemas.list), c.index);
  router.post('/', validate(userSchemas.create), c.store);
  router.get('/:id', validate({ params: idParams }), c.show);
  router.put('/:id', validate(userSchemas.update), c.update);
  router.delete('/:id', validate({ params: idParams }), c.destroy);

  return router;
}