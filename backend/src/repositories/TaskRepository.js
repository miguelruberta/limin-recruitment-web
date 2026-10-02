import { BaseRepository } from '../core/BaseRepository.js';

export class TaskRepository extends BaseRepository {
  constructor() {
    super({
      table: 'tasks',
      searchable: ['title'],
      sortable: ['title', 'due_date', 'status', 'id'],
      filters: {
        dry_dock_id: 'dry_dock_id',
        status: 'status',
        assignee_id: 'assignee_id',
      },
    });
  }
}