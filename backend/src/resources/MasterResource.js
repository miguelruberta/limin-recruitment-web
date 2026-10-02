import { Resource } from './Resource.js';

export class MasterResource extends Resource {
  #fields;

  constructor(props = {}, fields = {}) {
    super(props);
    this.#fields = fields;
  }

  toJSON() {
    return Object.fromEntries(
      Object.entries(this.#fields).map(([outputKey, sourceKey]) => [outputKey, this.get(sourceKey)]),
    );
  }

  static map(rows, fields) {
    return (rows ?? []).map((row) => new MasterResource(row, fields).toJSON());
  }
}