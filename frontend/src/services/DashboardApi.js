export class DashboardApi {
  #client;

  constructor(client) {
    this.#client = client;
  }

  summary() {
    return this.#client.get('/dashboard/summary');
  }

  upcoming(limit = 10) {
    return this.#client.get('/dashboard/upcoming', { limit });
  }
}