import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { MAX_LOGIN_FAILURES } from '../config/constants.js';
import { UnauthorizedError } from '../core/errors.js';
import { UserResource } from '../resources/UserResource.js';
import { issueRefreshToken, signAccessToken } from '../utils/tokens.js';
import { sha256 } from '../utils/hash.js';

const LOCK_DURATION_MINUTES = 15;
const GENERIC_FAILURE_MESSAGE = 'Email atau password salah';

export class AuthService {
  #userRepository;
  #refreshTokenRepository;

  constructor({ userRepository, refreshTokenRepository }) {
    this.#userRepository = userRepository;
    this.#refreshTokenRepository = refreshTokenRepository;
  }

  async #issueTokens(user) {
    const accessToken = signAccessToken(user);
    const refresh = issueRefreshToken();
    await this.#refreshTokenRepository.createToken(user.id, refresh.hash, refresh.expiresAt);

    return {
      accessToken,
      refreshToken: refresh.token,
      expiresIn: env.JWT_EXPIRES_IN,
    };
  }

  #assertNotLocked(user) {
    const lockedUntil = user.locked_until;
    if (!lockedUntil) return;
    if (new Date(lockedUntil).getTime() > Date.now()) {
      throw new UnauthorizedError('Akun terkunci sementara karena terlalu banyak percobaan login');
    }
  }

  async #registerFailure(user) {
    const attempts = Number(user.failed_login_attempts ?? 0) + 1;

    if (attempts >= MAX_LOGIN_FAILURES) {
      const lockedUntil = new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000);
      await this.#userRepository.lockAccount(user.id, lockedUntil);
      return;
    }

    await this.#userRepository.incrementLoginFailure(user.id);
  }

  async login({ email, password }) {
    const user = await this.#userRepository.findByEmail(email);

    if (!user) throw new UnauthorizedError(GENERIC_FAILURE_MESSAGE);
    if (!user.is_active) throw new UnauthorizedError('Akun tidak aktif');

    this.#assertNotLocked(user);

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      await this.#registerFailure(user);
      throw new UnauthorizedError(GENERIC_FAILURE_MESSAGE);
    }

    await this.#userRepository.resetLoginState(user.id);
    const tokens = await this.#issueTokens(user);

    return { ...tokens, user: new UserResource(user).toJSON() };
  }

  async refresh(refreshToken) {
    const record = await this.#refreshTokenRepository.findUsableByHash(sha256(refreshToken));
    if (!record) throw new UnauthorizedError('Refresh token tidak valid atau kedaluwarsa');

    await this.#refreshTokenRepository.revokeByHash(sha256(refreshToken));

    const user = await this.#userRepository.findById(record.user_id);
    if (!user) throw new UnauthorizedError('Pengguna tidak ditemukan');
    if (!user.is_active) throw new UnauthorizedError('Akun tidak aktif');

    const tokens = await this.#issueTokens(user);
    return { ...tokens, user: new UserResource(user).toJSON() };
  }

  async logout(refreshToken) {
    if (!refreshToken) return;
    await this.#refreshTokenRepository.revokeByHash(sha256(refreshToken));
  }

  async me(userId) {
    const user = await this.#userRepository.findById(userId);
    if (!user) throw new UnauthorizedError('Pengguna tidak ditemukan');
    return new UserResource(user).toJSON();
  }
}