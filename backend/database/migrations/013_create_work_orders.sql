-- 013_create_work_orders.sql
CREATE TABLE work_orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  dry_dock_id BIGINT UNSIGNED NOT NULL,
  specification_group_id BIGINT UNSIGNED NOT NULL,
  work_order_master_id BIGINT UNSIGNED NULL,
  equipment_id BIGINT UNSIGNED NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  image_path VARCHAR(255) NULL,
  status ENUM('OPEN', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETE') NOT NULL DEFAULT 'OPEN',
  estimated_cost DECIMAL(15, 2) NOT NULL DEFAULT 0,
  actual_cost DECIMAL(15, 2) NOT NULL DEFAULT 0,
  budget_cost DECIMAL(15, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (dry_dock_id) REFERENCES dry_docks (id) ON DELETE CASCADE,
  FOREIGN KEY (specification_group_id) REFERENCES specification_groups (id),
  FOREIGN KEY (work_order_master_id) REFERENCES work_order_masters (id) ON DELETE SET NULL,
  FOREIGN KEY (equipment_id) REFERENCES equipment (id) ON DELETE SET NULL,
  INDEX idx_wo_dd_group (dry_dock_id, specification_group_id),
  INDEX idx_wo_status (status)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;