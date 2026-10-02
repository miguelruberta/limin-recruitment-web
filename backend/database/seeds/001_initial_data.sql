-- 001_initial_data.sql
INSERT INTO purchase_order_categories (id, name) VALUES
  (1, 'Inventory'),
  (2, 'Spare part'),
  (3, 'Machinery')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO specification_groups (id, name, sort_order) VALUES
  (1, 'Fasting', 1),
  (2, 'General', 2),
  (3, 'Machinery Main Components', 3),
  (4, 'Hull', 4),
  (5, 'Equipment Crew', 5),
  (6, 'Ship Common Systems', 6)
ON DUPLICATE KEY UPDATE name = VALUES(name), sort_order = VALUES(sort_order);

INSERT INTO companies (id, name) VALUES (1, 'UHC Pvt. Ltd.')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO users (id, name, email, password_hash, role) VALUES
  (1, 'Administrator', '__ADMIN_EMAIL__', '__ADMIN_PASSWORD_HASH__', 'ADMIN')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  password_hash = VALUES(password_hash),
  role = VALUES(role),
  deleted_at = NULL;

INSERT INTO vessels (id, company_id, name, imo_number) VALUES (1, 1, 'Ocean Star', '9210497')
ON DUPLICATE KEY UPDATE name = VALUES(name), deleted_at = NULL;

INSERT INTO shipyards (id, name, country) VALUES
  (1, 'PT Jaya Shipyard', 'Indonesia'),
  (2, 'Mitsubishi Kakoki Kaisha Ltd', 'Japan'),
  (3, 'Kepdock Thailand', 'Thailand')
ON DUPLICATE KEY UPDATE name = VALUES(name), deleted_at = NULL;

INSERT INTO suppliers (id, name) VALUES
  (1, 'Mitsubishi Kakoki Kaisha Ltd'),
  (2, 'PT Astra International')
ON DUPLICATE KEY UPDATE name = VALUES(name), deleted_at = NULL;

INSERT INTO dry_docks (
  id, dry_dock_no, vessel_id, title, description, currency, budget, priority, status, created_by
) VALUES (
  1, 'SEPT2020/DD1', 1, 'DD Required change BWT', 'DD Required change BWT', 'USD', 200000.00,
  'MEDIUM', 'PLANNING', 1
)
ON DUPLICATE KEY UPDATE title = VALUES(title), deleted_at = NULL;

INSERT INTO equipment (id, vessel_id, code, name) VALUES
  (1, 1, '115.041', 'Yokohama Fender crane no.4'),
  (2, 1, '115.042', 'Auxiliary engine no.1'),
  (3, 1, '115.043', 'Main engine no.1')
ON DUPLICATE KEY UPDATE name = VALUES(name), deleted_at = NULL;