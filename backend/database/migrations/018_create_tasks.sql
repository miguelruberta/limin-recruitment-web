-- 018_create_tasks.sql
CREATE TABLE tasks (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  dry_dock_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(255) NOT NULL,
  assignee_id BIGINT UNSIGNED NULL,
  due_date DATE NULL,
  status ENUM('TODO', 'DOING', 'DONE') NOT NULL DEFAULT 'TODO',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (dry_dock_id) REFERENCES dry_docks (id) ON DELETE CASCADE,
  FOREIGN KEY (assignee_id) REFERENCES users (id) ON DELETE SET NULL,
  INDEX idx_task_dd (dry_dock_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;