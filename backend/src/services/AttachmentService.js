import { NotFoundError } from '../core/errors.js';
import { assertRealMime } from '../utils/fileSignature.js';
import { removeUpload, saveUpload, toPublicUrl } from '../utils/storage.js';

const UPLOAD_FOLDER = 'dry-dock-attachments';

export class AttachmentService {
  #repository;
  #dryDockRepository;

  constructor({ dryDockAttachmentRepository, dryDockRepository }) {
    this.#repository = dryDockAttachmentRepository;
    this.#dryDockRepository = dryDockRepository;
  }

  #toJson(row) {
    return {
      id: row.id,
      dryDockId: row.dry_dock_id,
      title: row.title,
      fileUrl: toPublicUrl(row.file_path),
      mimeType: row.mime_type,
      fileSize: row.file_size,
      includeInSpecs: Boolean(row.include_in_specs),
      createdAt: row.created_at,
    };
  }

  async #assertDryDockExists(dryDockId) {
    const dryDock = await this.#dryDockRepository.findById(dryDockId);
    if (!dryDock) throw new NotFoundError('Dry dock');
  }

  async #loadOwned(dryDockId, attachmentId) {
    const row = await this.#repository.findById(attachmentId);
    if (!row || Number(row.dry_dock_id) !== Number(dryDockId)) {
      throw new NotFoundError('Lampiran');
    }
    return row;
  }

  async list(dryDockId) {
    await this.#assertDryDockExists(dryDockId);
    const rows = await this.#repository.findAllBy('dry_dock_id', dryDockId);
    return rows.map((row) => this.#toJson(row));
  }

  async upload(dryDockId, file, { title, includeInSpecs }) {
    await this.#assertDryDockExists(dryDockId);
    assertRealMime(file);

    const filePath = await saveUpload(file.buffer, {
      mimeType: file.mimetype,
      folder: `${UPLOAD_FOLDER}/${dryDockId}`,
    });

    const id = await this.#repository.insert({
      dry_dock_id: dryDockId,
      title,
      file_path: filePath,
      mime_type: file.mimetype,
      file_size: file.size,
      include_in_specs: includeInSpecs ? 1 : 0,
    });

    return this.#toJson(await this.#repository.findById(id));
  }

  async update(dryDockId, attachmentId, { includeInSpecs }) {
    await this.#loadOwned(dryDockId, attachmentId);
    await this.#repository.updateById(attachmentId, { include_in_specs: includeInSpecs ? 1 : 0 });
    return this.#toJson(await this.#repository.findById(attachmentId));
  }

  async remove(dryDockId, attachmentId) {
    const row = await this.#loadOwned(dryDockId, attachmentId);
    await this.#repository.deleteById(attachmentId);
    await removeUpload(row.file_path);
  }
}