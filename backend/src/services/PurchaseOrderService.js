import { BaseService } from '../core/BaseService.js';
import { ConflictError, NotFoundError } from '../core/errors.js';
import { PurchaseOrderResource } from '../resources/PurchaseOrderResource.js';
import { mapFields } from '../utils/mapper.js';

const FIELD_MAP = {
  categoryId: 'category_id',
  supplierId: 'supplier_id',
  poNumber: 'po_number',
  totalUsd: 'total_usd',
  status: 'status',
};

export class PurchaseOrderService extends BaseService {
  #dryDockRepository;

  constructor({ purchaseOrderRepository, dryDockRepository }) {
    super({ repository: purchaseOrderRepository });
    this.#dryDockRepository = dryDockRepository;
  }

  get entityName() {
    return 'Purchase order';
  }

  async #assertDryDockExists(dryDockId) {
    const dryDock = await this.#dryDockRepository.findById(dryDockId);
    if (!dryDock) throw new NotFoundError('Dry dock');
  }

  #groupRows(rows) {
    return rows.map((group) => ({
      id: group.id,
      name: group.name,
      items: group.items.map((item) => new PurchaseOrderResource(item).toJSON()),
    }));
  }

  async listByDryDock(dryDockId, { search } = {}) {
    await this.#assertDryDockExists(dryDockId);
    const groups = await this.repository.findByDryDockGroupedByCategory(dryDockId, { search });
    return this.#groupRows(groups);
  }

  async show(id) {
    const row = await this.repository.findByIdWithRelations(id);
    if (!row) throw new NotFoundError(this.entityName);
    return new PurchaseOrderResource(row).toJSON();
  }

  async #assertPoNumberAvailable(dryDockId, poNumber, excludeId = null) {
    const existing = await this.repository.existsPoNumber(dryDockId, poNumber, excludeId);
    if (existing) {
      throw new ConflictError(`Nomor PO ${poNumber} sudah digunakan pada dry dock ini`);
    }
  }

  async create(dryDockId, payload) {
    await this.#assertDryDockExists(dryDockId);

    const columns = mapFields(payload, FIELD_MAP);
    columns.dry_dock_id = dryDockId;
    await this.#assertPoNumberAvailable(dryDockId, columns.po_number);

    const id = await this.repository.insert(columns);
    return this.show(id);
  }

  async update(id, payload) {
    const current = await this.show(id);
    const columns = mapFields(payload, FIELD_MAP);

    if (columns.po_number && columns.po_number !== current.poNumber) {
      await this.#assertPoNumberAvailable(current.dryDockId, columns.po_number, id);
    }
    if (Object.keys(columns).length === 0) return current;

    await this.repository.updateById(id, columns);
    return this.show(id);
  }

  async remove(id) {
    await this.show(id);
    await this.repository.softDeleteById(id);
  }
}