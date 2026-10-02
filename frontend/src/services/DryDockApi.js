export class DryDockApi {
  #client;

  constructor(client) {
    this.#client = client;
  }

  list(query = {}) {
    return this.#client.get('/dry-docks', query);
  }

  get(id) {
    return this.#client.get(`/dry-docks/${id}`);
  }

  create(payload) {
    return this.#client.post('/dry-docks', payload);
  }

  update(id, payload) {
    return this.#client.put(`/dry-docks/${id}`, payload);
  }

  remove(id) {
    return this.#client.delete(`/dry-docks/${id}`);
  }

  selectShipyard(id, shipyardId) {
    return this.#client.patch(`/dry-docks/${id}/shipyard`, { shipyardId });
  }

  changePriority(id, priority) {
    return this.#client.patch(`/dry-docks/${id}/priority`, { priority });
  }

  changeStatus(id, status) {
    return this.#client.patch(`/dry-docks/${id}/status`, { status });
  }

  start(id) {
    return this.#client.post(`/dry-docks/${id}/start`, {});
  }

  costSummary(id) {
    return this.#client.get(`/dry-docks/${id}/cost-summary`);
  }

  chartStatus(id) {
    return this.#client.get(`/dry-docks/${id}/charts/status`);
  }

  chartYardStay(id) {
    return this.#client.get(`/dry-docks/${id}/charts/yard-stay`);
  }

  chartComparison(id) {
    return this.#client.get(`/dry-docks/${id}/charts/comparison`);
  }

  specifications(id, search = '') {
    return this.#client.get(`/dry-docks/${id}/specifications`, { search });
  }

  previewSpecification(id) {
    return this.#client.get(`/dry-docks/${id}/specifications/preview`);
  }

  exportSpecification(id) {
    return this.#client.post(`/dry-docks/${id}/specifications/export`, {});
  }

  createWorkOrder(dryDockId, payload) {
    return this.#client.post(`/dry-docks/${dryDockId}/work-orders`, payload);
  }

  purchaseOrders(dryDockId, search = '') {
    return this.#client.get(`/dry-docks/${dryDockId}/purchase-orders`, { search });
  }

  createPurchaseOrder(dryDockId, payload) {
    return this.#client.post(`/dry-docks/${dryDockId}/purchase-orders`, payload);
  }

  attachments(dryDockId) {
    return this.#client.get(`/dry-docks/${dryDockId}/attachments`);
  }

  uploadAttachment(dryDockId, file, { title, includeInSpecs = false }, onProgress) {
    const form = new FormData();
    form.append('file', file);
    form.append('title', title);
    form.append('includeInSpecs', includeInSpecs ? 'true' : 'false');
    return this.#client.upload(`/dry-docks/${dryDockId}/attachments`, form, onProgress);
  }

  updateAttachment(dryDockId, attachmentId, includeInSpecs) {
    return this.#client.patch(`/dry-docks/${dryDockId}/attachments/${attachmentId}`, {
      includeInSpecs,
    });
  }

  removeAttachment(dryDockId, attachmentId) {
    return this.#client.delete(`/dry-docks/${dryDockId}/attachments/${attachmentId}`);
  }

  tasks(dryDockId, query = {}) {
    return this.#client.get(`/dry-docks/${dryDockId}/tasks`, query);
  }

  createTask(dryDockId, payload) {
    return this.#client.post(`/dry-docks/${dryDockId}/tasks`, payload);
  }

  updateTask(dryDockId, taskId, payload) {
    return this.#client.patch(`/dry-docks/${dryDockId}/tasks/${taskId}`, payload);
  }

  removeTask(dryDockId, taskId) {
    return this.#client.delete(`/dry-docks/${dryDockId}/tasks/${taskId}`);
  }
}