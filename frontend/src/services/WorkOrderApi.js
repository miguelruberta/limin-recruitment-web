export class WorkOrderApi {
  #client;

  constructor(client) {
    this.#client = client;
  }

  get(id) {
    return this.#client.get(`/work-orders/${id}`);
  }

  update(id, payload) {
    return this.#client.put(`/work-orders/${id}`, payload);
  }

  changeStatus(id, status) {
    return this.#client.patch(`/work-orders/${id}/status`, { status });
  }

  remove(id) {
    return this.#client.delete(`/work-orders/${id}`);
  }

  uploadImage(id, file, onProgress) {
    const form = new FormData();
    form.append('file', file);
    return this.#client.upload(`/work-orders/${id}/image`, form, onProgress);
  }

  attachments(id) {
    return this.#client.get(`/work-orders/${id}/attachments`);
  }

  uploadAttachment(id, file, onProgress) {
    const form = new FormData();
    form.append('file', file);
    return this.#client.upload(`/work-orders/${id}/attachments`, form, onProgress);
  }

  removeAttachment(id, attachmentId) {
    return this.#client.delete(`/work-orders/${id}/attachments/${attachmentId}`);
  }
}