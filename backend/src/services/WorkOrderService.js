import { BaseService } from '../core/BaseService.js';
import { NotFoundError } from '../core/errors.js';
import { WorkOrderResource } from '../resources/WorkOrderResource.js';
import { assertRealMime } from '../utils/fileSignature.js';
import { mapFields } from '../utils/mapper.js';
import { removeUpload, saveUpload, toPublicUrl } from '../utils/storage.js';

const FIELD_MAP = {
  specificationGroupId: 'specification_group_id',
  workOrderMasterId: 'work_order_master_id',
  equipmentId: 'equipment_id',
  title: 'title',
  description: 'description',
  imagePath: 'image_path',
  status: 'status',
  estimatedCost: 'estimated_cost',
  budgetCost: 'budget_cost',
  actualCost: 'actual_cost',
};

const UPLOAD_FOLDER = 'work-orders';
const ATTACHMENT_FOLDER = 'work-order-attachments';

export class WorkOrderService extends BaseService {
  #dryDockRepository;
  #workOrderAttachmentRepository;

  constructor({ workOrderRepository, dryDockRepository, workOrderAttachmentRepository }) {
    super({ repository: workOrderRepository });
    this.#dryDockRepository = dryDockRepository;
    this.#workOrderAttachmentRepository = workOrderAttachmentRepository;
  }

  get entityName() {
    return 'Work order';
  }

  async #assertDryDockExists(dryDockId) {
    const dryDock = await this.#dryDockRepository.findById(dryDockId);
    if (!dryDock) throw new NotFoundError('Dry dock');
  }

  async #loadRelation(id) {
    const row = await this.repository.findByIdWithRelations(id);
    if (!row) throw new NotFoundError(this.entityName);
    return row;
  }

  async assertBelongsToDryDock(id, dryDockId) {
    const row = await this.#loadRelation(id);
    if (Number(row.dry_dock_id) !== Number(dryDockId)) throw new NotFoundError(this.entityName);
    return row;
  }

  async show(id) {
    const row = await this.#loadRelation(id);
    return new WorkOrderResource(row).toJSON();
  }

  async create(dryDockId, payload) {
    await this.#assertDryDockExists(dryDockId);

    const columns = mapFields(payload, FIELD_MAP);
    columns.dry_dock_id = dryDockId;

    const id = await this.repository.insert(columns);
    return this.show(id);
  }

  async update(id, payload) {
    await this.show(id);
    const columns = mapFields(payload, FIELD_MAP);

    if (Object.keys(columns).length === 0) return this.show(id);

    await this.repository.updateById(id, columns);
    return this.show(id);
  }

  async changeStatus(id, status) {
    await this.show(id);
    await this.repository.updateById(id, { status });
    return this.show(id);
  }

  async remove(id) {
    await this.show(id);
    await this.repository.softDeleteById(id);
  }

  async uploadImage(id, file) {
    const row = await this.#loadRelation(id);
    assertRealMime(file);

    const filePath = await saveUpload(file.buffer, {
      mimeType: file.mimetype,
      folder: `${UPLOAD_FOLDER}/${row.dry_dock_id}`,
    });

    await removeUpload(row.image_path);
    await this.repository.updateById(id, { image_path: filePath });

    return { id: Number(id), imageUrl: toPublicUrl(filePath) };
  }

  async addAttachment(id, file) {
    const row = await this.#loadRelation(id);
    assertRealMime(file);

    const filePath = await saveUpload(file.buffer, {
      mimeType: file.mimetype,
      folder: `${ATTACHMENT_FOLDER}/${row.dry_dock_id}`,
    });

    await this.#workOrderAttachmentRepository.insert({
      work_order_id: id,
      file_path: filePath,
      mime_type: file.mimetype,
      file_size: file.size,
    });

    return this.listAttachments(id);
  }

  async listAttachments(id) {
    await this.show(id);
    const rows = await this.#workOrderAttachmentRepository.findAllBy('work_order_id', id);

    return rows.map((row) => ({
      id: row.id,
      fileUrl: toPublicUrl(row.file_path),
      mimeType: row.mime_type,
      fileSize: row.file_size,
      createdAt: row.created_at,
    }));
  }

  async removeAttachment(id, attachmentId) {
    await this.show(id);
    const row = await this.#workOrderAttachmentRepository.findById(attachmentId);

    if (!row || Number(row.work_order_id) !== Number(id)) {
      throw new NotFoundError('Lampiran');
    }

    await this.#workOrderAttachmentRepository.deleteById(attachmentId);
    await removeUpload(row.file_path);
  }
}