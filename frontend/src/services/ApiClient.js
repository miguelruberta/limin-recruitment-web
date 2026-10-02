import axios from 'axios';

export class ApiError extends Error {
  constructor(message, { status = 500, code = 'UNKNOWN_ERROR', details = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const DEFAULT_TIMEOUT = 20_000;

export class ApiClient {
  #http;
  #accessToken = null;
  #onUnauthorized;

  constructor({ baseURL = '/api/v1', onUnauthorized = null, timeout = DEFAULT_TIMEOUT } = {}) {
    this.#http = axios.create({ baseURL, withCredentials: true, timeout });
    this.#onUnauthorized = onUnauthorized;
  }

  setAccessToken(token) {
    this.#accessToken = token;
  }

  get accessToken() {
    return this.#accessToken;
  }

  #headers(extra = {}) {
    const headers = { ...extra };
    if (this.#accessToken) headers.Authorization = `Bearer ${this.#accessToken}`;
    return headers;
  }

  #unwrap(payload) {
    if (payload && typeof payload === 'object' && 'success' in payload) {
      if (!payload.success) {
        throw new ApiError(payload.error?.message ?? 'Permintaan gagal', {
          status: payload.status,
          code: payload.error?.code,
          details: payload.error?.details,
        });
      }
      return payload.meta ? { data: payload.data, meta: payload.meta } : payload.data;
    }
    return payload;
  }

  #normalize(error) {
    if (error instanceof ApiError) return error;

    const response = error.response;
    if (!response) {
      return new ApiError('Tidak dapat terhubung ke server', {
        status: 0,
        code: 'NETWORK_ERROR',
      });
    }

    if (response.status === 401 && this.#onUnauthorized) this.#onUnauthorized();

    return new ApiError(response.data?.error?.message ?? error.message, {
      status: response.status,
      code: response.data?.error?.code ?? 'REQUEST_FAILED',
      details: response.data?.error?.details ?? null,
    });
  }

  async request(config) {
    try {
      const response = await this.#http.request({
        ...config,
        headers: this.#headers(config.headers),
      });
      return this.#unwrap(response.data);
    } catch (error) {
      throw this.#normalize(error);
    }
  }

  get(url, params = {}) {
    return this.request({ method: 'get', url, params });
  }

  post(url, data = {}) {
    return this.request({ method: 'post', url, data });
  }

  put(url, data = {}) {
    return this.request({ method: 'put', url, data });
  }

  patch(url, data = {}) {
    return this.request({ method: 'patch', url, data });
  }

  delete(url) {
    return this.request({ method: 'delete', url });
  }

  upload(url, formData, onProgress) {
    return this.request({
      method: 'post',
      url,
      data: formData,
      onUploadProgress: onProgress,
    });
  }
}