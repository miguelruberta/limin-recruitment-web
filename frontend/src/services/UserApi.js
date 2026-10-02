export class UserApi {
  #client;

  constructor(client) {
    this.#client = client;
  }

  list(query = {}) {
    return this.#client.get('/users', query);
  }

  create(payload) {
    return this.#client.post('/users', payload);
  }

  update(id, payload) {
    return this.#client.put(`/users/${id}`, payload);
  }

  remove(id) {
    return this.#client.delete(`/users/${id}`);
  }
}