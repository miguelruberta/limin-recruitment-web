export class PurchaseOrderApi {
  #client;

  constructor(client) {
    this.#client = client;
  }

  get(id) {
    return this.#client.get(`/purchase-orders/${id}`);
  }

  update(id, payload) {
    return this.#client.put(`/purchase-orders/${id}`, payload);
  }

  remove(id) {
    return this.#client.delete(`/purchase-orders/${id}`);
  }
}