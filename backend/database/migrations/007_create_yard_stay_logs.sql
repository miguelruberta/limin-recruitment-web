-- 007_create_yard_stay_logs.sql
CREATE TABLE yard_stay_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  dry_dock_id BIGINT UNSIGNED NOT NULL,
  stay_type ENUM('IN_DOCK', 'REPAIR') NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NULL,
  FOREIGN KEY (dry_dock_id) REFERENCES dry_docks (id) ON DELETE CASCADE,
  INDEX idx_ysl_dd (dry_dock_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;