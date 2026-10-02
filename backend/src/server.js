import { createApp } from './app.js';
import { closePool, verifyConnection } from './config/database.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

async function bootstrap() {
  await verifyConnection();

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT, env: env.NODE_ENV }, 'API siap digunakan');
  });

  const shutdown = (signal) => {
    logger.info({ signal }, 'Mematikan server');
    server.close(async () => {
      await closePool();
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((error) => {
  logger.fatal({ err: error }, 'Gagal menjalankan server');
  process.exit(1);
});