import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { REFRESH_TOKEN_BYTES } from '../config/constants.js';
import { randomToken, sha256 } from './hash.js';

const ALGORITHM = 'HS256';

export function signAccessToken(user) {
  return jwt.sign(
    { role: user.role, email: user.email, name: user.name },
    env.JWT_SECRET,
    { subject: String(user.id), algorithm: ALGORITHM, expiresIn: env.JWT_EXPIRES_IN },
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_SECRET, { algorithms: [ALGORITHM] });
}

export function issueRefreshToken() {
  const token = randomToken(REFRESH_TOKEN_BYTES);
  const expiresAt = new Date(Date.now() + env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);

  return { token, hash: sha256(token), expiresAt };
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET, { algorithms: [ALGORITHM] });
}