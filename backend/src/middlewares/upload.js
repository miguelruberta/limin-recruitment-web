import multer from 'multer';
import { env } from '../config/env.js';
import { ALLOWED_UPLOAD_MIME } from '../config/constants.js';
import { AppError } from '../core/AppError.js';

export const MAX_UPLOAD_SIZE = env.MAX_UPLOAD_SIZE;

export const uploadSingle = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD_SIZE, files: 1 },
  fileFilter(req, file, callback) {
    if (!ALLOWED_UPLOAD_MIME.includes(file.mimetype)) {
      return callback(
        new AppError(
          'Tipe berkas tidak didukung. Gunakan JPEG, PNG, WebP, PDF, atau DOCX',
          422,
          'UNSUPPORTED_FILE_TYPE',
        ),
      );
    }
    return callback(null, true);
  },
}).single('file');