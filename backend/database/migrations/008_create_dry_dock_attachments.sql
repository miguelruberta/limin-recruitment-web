-- 008_create_dry_dock_attachments.sql
CREATE TABLE dry_dock_attachments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  dry_dock_id BIGINT UNSIGNED NOT NULL,
  title VARCHAR(150) NOT NULL,
  file_path VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  file_size INT UNSIGNED NOT NULL,
  include_in_specs TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (dry_dock_id) REFERENCES dry_docks (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;