import fs from 'node:fs';
import path from 'node:path';
import { env } from '../config/env.js';
import { AppError } from '../core/AppError.js';

const UPLOAD_ROOT = path.resolve(process.cwd(), env.UPLOAD_DIR);

export const UPLOAD_PATH_PATTERN = /^\/uploads\/(.+)$/;

export function serveUpload(req, res, next) {
  const relativePath = decodeURIComponent(req.params[0] ?? '');
  const absolutePath = path.resolve(UPLOAD_ROOT, relativePath);

  if (!absolutePath.startsWith(UPLOAD_ROOT)) {
    return next(new AppError('Path berkas tidak valid', 400, 'INVALID_PATH'));
  }

  fs.stat(absolutePath, (error, stats) => {
    if (error || !stats.isFile()) {
      return next(new AppError('Berkas tidak ditemukan', 404, 'NOT_FOUND'));
    }

    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Disposition', `inline; filename="${path.basename(absolutePath)}"`);
    return res.sendFile(absolutePath);
  });
}