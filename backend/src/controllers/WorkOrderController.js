import { BaseController } from '../core/BaseController.js';
import { BadRequestError } from '../core/errors.js';

export class WorkOrderController extends BaseController {
  #workOrderService;

  constructor({ workOrderService }) {
    super();
    this.#workOrderService = workOrderService;
  }

  #requireFile(req) {
    if (!req.file) throw new BadRequestError('Berkas wajib diunggah pada field file');
    return req.file;
  }

  store = async (req, res, next) => {
    try {
      const result = await this.#workOrderService.create(req.params.id, req.body);
      return this.created(res, result);
    } catch (error) {
      return next(error);
    }
  };

  show = async (req, res, next) => {
    try {
      return this.ok(res, await this.#workOrderService.show(req.params.id));
    } catch (error) {
      return next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      return this.ok(res, await this.#workOrderService.update(req.params.id, req.body));
    } catch (error) {
      return next(error);
    }
  };

  changeStatus = async (req, res, next) => {
    try {
      return this.ok(res, await this.#workOrderService.changeStatus(req.params.id, req.body.status));
    } catch (error) {
      return next(error);
    }
  };

  destroy = async (req, res, next) => {
    try {
      await this.#workOrderService.remove(req.params.id);
      return this.noContent(res);
    } catch (error) {
      return next(error);
    }
  };

  uploadImage = async (req, res, next) => {
    try {
      const file = this.#requireFile(req);
      return this.ok(res, await this.#workOrderService.uploadImage(req.params.id, file));
    } catch (error) {
      return next(error);
    }
  };

  listAttachments = async (req, res, next) => {
    try {
      return this.ok(res, await this.#workOrderService.listAttachments(req.params.id));
    } catch (error) {
      return next(error);
    }
  };

  uploadAttachment = async (req, res, next) => {
    try {
      const file = this.#requireFile(req);
      return this.created(res, await this.#workOrderService.addAttachment(req.params.id, file));
    } catch (error) {
      return next(error);
    }
  };

  removeAttachment = async (req, res, next) => {
    try {
      await this.#workOrderService.removeAttachment(req.params.id, req.params.attachmentId);
      return this.noContent(res);
    } catch (error) {
      return next(error);
    }
  };
}