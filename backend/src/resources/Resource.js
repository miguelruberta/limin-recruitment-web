export class Resource {
  #props;

  constructor(props = {}) {
    this.#props = props;
  }

  get(key) {
    return this.#props[key];
  }

  get props() {
    return { ...this.#props };
  }

  toJSON() {
    return { ...this.#props };
  }

  static map(rows, ResourceClass) {
    return (rows ?? []).map((row) => new ResourceClass(row).toJSON());
  }
}