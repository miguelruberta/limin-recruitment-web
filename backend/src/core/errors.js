import { AppError } from './AppError.js';

export class ValidationError extends AppError {
  constructor(message = 'Data tidak valid', details = null) {
    super(message, 422, 'VALIDATION_ERROR', details);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Permintaan tidak valid', details = null) {
    super(message, 400, 'BAD_REQUEST', details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Belum login atau token tidak valid') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Role tidak punya akses') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class NotFoundError extends AppError {
  constructor(entity = 'Data') {
    super(`${entity} tidak ditemukan`, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Data sudah ada', details = null) {
    super(message, 409, 'CONFLICT', details);
  }
}