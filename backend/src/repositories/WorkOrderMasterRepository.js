import { BaseRepository } from '../core/BaseRepository.js';

export class WorkOrderMasterRepository extends BaseRepository {
  constructor() {
    super({
      table: 'work_order_masters',
      searchable: ['title'],
      sortable: ['title', 'id'],
      filters: { specification_group_id: 'specification_group_id' },
      defaultSort: 'title',
    });
  }

  async findByIdWithChecklist(id) {
    const master = await this.findById(id);
    if (!master) return null;

    const items = await this.execute(
      'SELECT * FROM checklist_items WHERE work_order_master_id = ? ORDER BY sort_order ASC, id ASC',
      [id],
    );

    return { ...master, checklist_items: items };
  }
}