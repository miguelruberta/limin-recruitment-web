-- 012_create_checklist_items.sql
CREATE TABLE checklist_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  work_order_master_id BIGINT UNSIGNED NOT NULL,
  label VARCHAR(255) NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  FOREIGN KEY (work_order_master_id) REFERENCES work_order_masters (id) ON DELETE CASCADE,
  INDEX idx_ci_wom (work_order_master_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;