import { ForbiddenError, UnauthorizedError } from '../core/errors.js';
import { verifyAccessToken } from '../utils/tokens.js';

export function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization ?? '';
    if (!header.startsWith('Bearer ')) throw new UnauthorizedError();

    const payload = verifyAccessToken(header.slice(7).trim());
    req.user = {
      id: Number(payload.sub),
      role: payload.role,
      email: payload.email,
      name: payload.name,
    };
    next();
  } catch {
    next(new UnauthorizedError());
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) return next(new UnauthorizedError());
    if (roles.length > 0 && !roles.includes(req.user.role)) return next(new ForbiddenError());
    next();
  };
}