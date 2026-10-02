import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { AppError } from '../core/AppError.js';
import { ConflictError, NotFoundError, ValidationError } from '../core/errors.js';

const DB_ERROR_MAP = {
  ER_DUP_ENTRY: () => new ConflictError('Data sudah ada (duplikat)'),
  ER_NO_REFERENCED_ROW_2: () => new ValidationError('Relasi tidak valid atau data induk tidak ada'),
  ER_ROW_IS_REFERENCED_2: () => new ConflictError('Data masih digunakan data lain'),
  ER_DATA_TOO_LONG: () => new ValidationError('Nilai terlalu panjang untuk kolom'),
};

export function notFoundHandler(req, res, next) {
  next(new NotFoundError(`Endpoint ${req.method} ${req.path}`));
}

function normalize(error) {
  if (error instanceof AppError) return error;

  const mapped = DB_ERROR_MAP[error?.code];
  if (mapped) return mapped();

  return new AppError('Terjadi kesalahan pada server', 500, 'INTERNAL_ERROR');
}

export function errorHandler(error, req, res, _next) {
  const appError = normalize(error);

  if (appError.status >= 500) {
    logger.error({ err: error, path: req.originalUrl, method: req.method }, 'Permintaan gagal');
  } else {
    logger.warn({ code: appError.code, path: req.originalUrl }, 'Permintaan ditolak');
  }

  const message =
    appError.status >= 500 && env.isProduction ? 'Terjadi kesalahan pada server' : appError.message;

  res.status(appError.status).json({
    success: false,
    error: {
      code: appError.code,
      message,
      details: appError.details ?? undefined,
    },
  });
}