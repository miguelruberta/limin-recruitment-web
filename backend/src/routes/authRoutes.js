import Router from 'express';
import rateLimit from 'express-rate-limit';
import { ROLES } from '../config/constants.js';
import { authenticate, authorize } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import * as authSchemas from '../validators/authSchemas.js';

const loginLimiter = rateLimit({
  windowMs: 60_000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'TOO_MANY_REQUESTS', message: 'Terlalu banyak percobaan login. Coba lagi nanti.' },
  },
});

export function authRoutes({ authController: c }) {
  const router = Router();

  router.post('/login', loginLimiter, validate(authSchemas.login), c.login);
  router.post('/refresh', validate(authSchemas.refresh), c.refresh);
  router.post('/logout', c.logout);
  router.get('/me', authenticate, authorize(ROLES.ADMIN, ROLES.SUPERINTENDENT, ROLES.VIEWER), c.me);

  return router;
}