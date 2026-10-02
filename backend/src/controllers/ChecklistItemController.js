import { BaseController } from '../core/BaseController.js';
import { NotFoundError } from '../core/errors.js';

export class ChecklistItemController extends BaseController {
  #checklistItemRepository;
  #workOrderMasterRepository;

  constructor({ checklistItemRepository, workOrderMasterRepository }) {
    super();
    this.#checklistItemRepository = checklistItemRepository;
    this.#workOrderMasterRepository = workOrderMasterRepository;
  }

  #toJson(row) {
    return {
      id: row.id,
      workOrderMasterId: row.work_order_master_id,
      label: row.label,
      sortOrder: row.sort_order,
    };
  }

  async #assertMasterExists(masterId) {
    const master = await this.#workOrderMasterRepository.findById(masterId);
    if (!master) throw new NotFoundError('Work order master');
  }

  async #loadOwned(masterId, itemId) {
    const row = await this.#checklistItemRepository.findById(itemId);
    if (!row || Number(row.work_order_master_id) !== Number(masterId)) {
      throw new NotFoundError('Checklist item');
    }
    return row;
  }

  index = async (req, res, next) => {
    try {
      await this.#assertMasterExists(req.params.id);
      const rows = await this.#checklistItemRepository.findAllBy(
        'work_order_master_id',
        req.params.id,
      );
      return this.ok(res, rows.map((row) => this.#toJson(row)));
    } catch (error) {
      return next(error);
    }
  };

  store = async (req, res, next) => {
    try {
      await this.#assertMasterExists(req.params.id);
      const id = await this.#checklistItemRepository.insert({
        work_order_master_id: req.params.id,
        label: req.body.label,
        sort_order: req.body.sortOrder ?? 0,
      });
      return this.created(res, this.#toJson(await this.#checklistItemRepository.findById(id)));
    } catch (error) {
      return next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      await this.#loadOwned(req.params.id, req.params.itemId);
      const columns = {};
      if (req.body.label !== undefined) columns.label = req.body.label;
      if (req.body.sortOrder !== undefined) columns.sort_order = req.body.sortOrder;

      if (Object.keys(columns).length > 0) {
        await this.#checklistItemRepository.updateById(req.params.itemId, columns);
      }
      return this.ok(
        res,
        this.#toJson(await this.#checklistItemRepository.findById(req.params.itemId)),
      );
    } catch (error) {
      return next(error);
    }
  };

  destroy = async (req, res, next) => {
    try {
      await this.#loadOwned(req.params.id, req.params.itemId);
      await this.#checklistItemRepository.deleteById(req.params.itemId);
      return this.noContent(res);
    } catch (error) {
      return next(error);
    }
  };
}