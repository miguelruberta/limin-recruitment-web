import { env } from '../config/env.js';
import { BaseController } from '../core/BaseController.js';

const REFRESH_COOKIE = 'refreshToken';
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: 'strict',
  path: '/api/v1/auth',
};

export class AuthController extends BaseController {
  #authService;

  constructor({ authService }) {
    super();
    this.#authService = authService;
  }

  #readRefreshToken(req) {
    return req.body?.refreshToken ?? req.cookies?.[REFRESH_COOKIE] ?? null;
  }

  #sendTokens(res, result) {
    res.cookie(REFRESH_COOKIE, result.refreshToken, {
      ...COOKIE_OPTIONS,
      maxAge: env.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
    });

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      expiresIn: result.expiresIn,
      user: result.user,
    };
  }

  login = async (req, res, next) => {
    try {
      const result = await this.#authService.login(req.body);
      return this.ok(res, this.#sendTokens(res, result));
    } catch (error) {
      return next(error);
    }
  };

  refresh = async (req, res, next) => {
    try {
      const token = this.#readRefreshToken(req);
      const result = await this.#authService.refresh(token);
      return this.ok(res, this.#sendTokens(res, result));
    } catch (error) {
      return next(error);
    }
  };

  logout = async (req, res, next) => {
    try {
      await this.#authService.logout(this.#readRefreshToken(req));
      res.clearCookie(REFRESH_COOKIE, COOKIE_OPTIONS);
      return this.noContent(res);
    } catch (error) {
      return next(error);
    }
  };

  me = async (req, res, next) => {
    try {
      return this.ok(res, await this.#authService.me(req.user.id));
    } catch (error) {
      return next(error);
    }
  };
}