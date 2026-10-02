import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import pinoHttp from 'pino-http';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { createContainer } from './container.js';
import { authenticate } from './middlewares/auth.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { UPLOAD_PATH_PATTERN, serveUpload } from './middlewares/uploads.js';
import { apiRoutes } from './routes/index.js';

const JSON_LIMIT = '1mb';

const apiLimiter = rateLimit({
  windowMs: 60_000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

export function createApp() {
  const app = express();
  const container = createContainer();

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(pinoHttp({ logger }));
  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigins,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    }),
  );
  app.use(compression());
  app.use(express.json({ limit: JSON_LIMIT }));
  app.use(express.urlencoded({ extended: true, limit: JSON_LIMIT }));
  app.use(cookieParser());
  app.use(hpp());

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', uptime: Math.round(process.uptime()) });
  });

  app.get(UPLOAD_PATH_PATTERN, authenticate, serveUpload);

  app.use('/api/v1', apiLimiter, apiRoutes(container));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}