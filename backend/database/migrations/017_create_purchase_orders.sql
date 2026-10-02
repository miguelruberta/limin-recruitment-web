-- 017_create_purchase_orders.sql
CREATE TABLE purchase_orders (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  dry_dock_id BIGINT UNSIGNED NOT NULL,
  category_id BIGINT UNSIGNED NOT NULL,
  supplier_id BIGINT UNSIGNED NULL,
  po_number VARCHAR(60) NOT NULL,
  total_usd DECIMAL(15, 2) NOT NULL DEFAULT 0,
  status ENUM('DRAFT', 'ISSUED', 'RECEIVED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  UNIQUE KEY uq_po (dry_dock_id, po_number),
  FOREIGN KEY (dry_dock_id) REFERENCES dry_docks (id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES purchase_order_categories (id),
  FOREIGN KEY (supplier_id) REFERENCES suppliers (id) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;