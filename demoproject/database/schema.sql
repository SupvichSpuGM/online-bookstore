-- ============================================================
-- Online Bookstore Database Schema
-- Version: 1.0
-- Description: ตาราง MySQL สำหรับระบบร้านหนังสือออนไลน์
-- ============================================================

CREATE DATABASE IF NOT EXISTS bookstore_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE bookstore_db;

-- ─── 1. Users ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  name          VARCHAR(100)    NOT NULL,
  email         VARCHAR(150)    NOT NULL UNIQUE,
  password_hash VARCHAR(255)    NOT NULL,
  role          ENUM('customer','staff','admin') NOT NULL DEFAULT 'customer',
  phone         VARCHAR(20)     NULL,
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_users_email (email),
  INDEX idx_users_role  (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 2. Addresses ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS addresses (
  id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id        INT UNSIGNED NOT NULL,
  recipient_name VARCHAR(100) NOT NULL,
  phone          VARCHAR(20)  NOT NULL,
  address_line   VARCHAR(255) NOT NULL,
  province       VARCHAR(100) NOT NULL,
  postal_code    VARCHAR(10)  NOT NULL,
  is_default     TINYINT(1)   NOT NULL DEFAULT 0,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_addresses_user_id (user_id),
  CONSTRAINT fk_addresses_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 3. Books ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS books (
  id              INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  title           VARCHAR(255)      NOT NULL,
  author          VARCHAR(150)      NOT NULL,
  isbn            VARCHAR(20)       NULL UNIQUE,
  price           DECIMAL(10,2)     NOT NULL,
  original_price  DECIMAL(10,2)     NOT NULL,
  stock_qty       INT UNSIGNED      NOT NULL DEFAULT 0,
  category        VARCHAR(100)      NOT NULL,
  cover_image_url VARCHAR(500)      NULL,
  description     TEXT              NULL,
  rating          DECIMAL(3,2)      NOT NULL DEFAULT 0.00,
  review_count    INT UNSIGNED      NOT NULL DEFAULT 0,
  created_at      TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_books_category  (category),
  INDEX idx_books_title     (title),
  FULLTEXT INDEX ft_books_search (title, author, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 4. Carts ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS carts (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED NOT NULL UNIQUE,  -- 1 user = 1 cart
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_carts_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 5. Cart Items ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cart_items (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  cart_id    INT UNSIGNED NOT NULL,
  book_id    INT UNSIGNED NOT NULL,
  quantity   INT UNSIGNED NOT NULL DEFAULT 1,
  added_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cart_book (cart_id, book_id),
  INDEX idx_cart_items_cart_id (cart_id),
  INDEX idx_cart_items_book_id (book_id),
  CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id)
    REFERENCES carts(id) ON DELETE CASCADE,
  CONSTRAINT fk_cart_items_book FOREIGN KEY (book_id)
    REFERENCES books(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 6. Orders ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS orders (
  id              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id         INT UNSIGNED  NOT NULL,
  address_id      INT UNSIGNED  NULL,
  verified_by     INT UNSIGNED  NULL,   -- staff/admin ที่อนุมัติ
  total_amount    DECIMAL(12,2) NOT NULL,
  status          ENUM(
    'pending',
    'payment_review',
    'confirmed',
    'shipping',
    'delivered',
    'cancelled'
  ) NOT NULL DEFAULT 'pending',
  slip_image_url  VARCHAR(500)  NULL,
  tracking_number VARCHAR(100)  NULL,
  order_date      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  shipped_at      TIMESTAMP     NULL,
  updated_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_orders_user_id   (user_id),
  INDEX idx_orders_status    (status),
  INDEX idx_orders_order_date(order_date),
  CONSTRAINT fk_orders_user    FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE RESTRICT,
  CONSTRAINT fk_orders_address FOREIGN KEY (address_id)
    REFERENCES addresses(id) ON DELETE SET NULL,
  CONSTRAINT fk_orders_verifier FOREIGN KEY (verified_by)
    REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 7. Order Items ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS order_items (
  id             INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  order_id       INT UNSIGNED  NOT NULL,
  book_id        INT UNSIGNED  NOT NULL,
  quantity       INT UNSIGNED  NOT NULL,
  price_per_unit DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id),
  INDEX idx_order_items_order_id (order_id),
  INDEX idx_order_items_book_id  (book_id),
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id)
    REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_book  FOREIGN KEY (book_id)
    REFERENCES books(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ─── 8. Notifications ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id      INT UNSIGNED NOT NULL AUTO_INCREMENT,
  type    VARCHAR(50)  NOT NULL,   -- e.g. 'low_stock'
  message TEXT         NOT NULL,
  book_id INT UNSIGNED NULL,
  sent_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_notifications_book_id (book_id),
  CONSTRAINT fk_notifications_book FOREIGN KEY (book_id)
    REFERENCES books(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
