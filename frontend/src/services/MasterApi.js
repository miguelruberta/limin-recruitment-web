export class MasterApi {
  #client;

  constructor(client) {
    this.#client = client;
  }

  list(resource, query = {}) {
    return this.#client.get(`/${resource}`, query);
  }

  create(resource, payload) {
    return this.#client.post(`/${resource}`, payload);
  }

  get(resource, id) {
    return this.#client.get(`/${resource}/${id}`);
  }

  update(resource, id, payload) {
    return this.#client.put(`/${resource}/${id}`, payload);
  }

  remove(resource, id) {
    return this.#client.delete(`/${resource}/${id}`);
  }

  listEquipment(vesselId) {
    return this.#client.get(`/vessels/${vesselId}/equipment`);
  }

  createEquipment(vesselId, payload) {
    return this.#client.post(`/vessels/${vesselId}/equipment`, payload);
  }

  listChecklistItems(masterId) {
    return this.#client.get(`/work-order-masters/${masterId}/checklist-items`);
  }

  createChecklistItem(masterId, payload) {
    return this.#client.post(`/work-order-masters/${masterId}/checklist-items`, payload);
  }

  updateChecklistItem(masterId, itemId, payload) {
    return this.#client.patch(`/work-order-masters/${masterId}/checklist-items/${itemId}`, payload);
  }

  removeChecklistItem(masterId, itemId) {
    return this.#client.delete(`/work-order-masters/${masterId}/checklist-items/${itemId}`);
  }
}