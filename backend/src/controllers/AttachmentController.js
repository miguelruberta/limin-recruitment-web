import { BaseController } from '../core/BaseController.js';
import { BadRequestError } from '../core/errors.js';

export class AttachmentController extends BaseController {
  #attachmentService;

  constructor({ attachmentService }) {
    super();
    this.#attachmentService = attachmentService;
  }

  index = async (req, res, next) => {
    try {
      return this.ok(res, await this.#attachmentService.list(req.params.id));
    } catch (error) {
      return next(error);
    }
  };

  store = async (req, res, next) => {
    try {
      if (!req.file) throw new BadRequestError('Berkas wajib diunggah pada field file');
      const result = await this.#attachmentService.upload(req.params.id, req.file, req.body);
      return this.created(res, result);
    } catch (error) {
      return next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const { includeInSpecs } = req.body;
      const result = await this.#attachmentService.update(req.params.id, req.params.attachmentId, {
        includeInSpecs,
      });
      return this.ok(res, result);
    } catch (error) {
      return next(error);
    }
  };

  destroy = async (req, res, next) => {
    try {
      await this.#attachmentService.remove(req.params.id, req.params.attachmentId);
      return this.noContent(res);
    } catch (error) {
      return next(error);
    }
  };
}