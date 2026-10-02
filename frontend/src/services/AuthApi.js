export class AuthApi {
  #client;

  constructor(client) {
    this.#client = client;
  }

  login(credentials) {
    return this.#client.post('/auth/login', credentials);
  }

  refresh(refreshToken) {
    return this.#client.post('/auth/refresh', { refreshToken });
  }

  logout(refreshToken) {
    return this.#client.post('/auth/logout', refreshToken ? { refreshToken } : {});
  }

  me() {
    return this.#client.get('/auth/me');
  }
}