-- ============================================================
-- Seed Data — Online Bookstore
-- Run AFTER schema.sql
-- ============================================================

USE bookstore_db;
SET NAMES utf8mb4;

-- ─── Users (password = "password123" bcrypt hash) ──────────
-- Hash สร้างจาก bcrypt rounds=10
INSERT INTO users (id, name, email, password_hash, role, phone) VALUES
(1, 'สมชาย วงศ์สุข',   'customer@booka.app', '$2b$10$/unmei3MrGslKSK9ObYa5.m42Ciyp/JW8GzG5AkovQBlZH4RR5kq6', 'customer', '081-234-5678'),
(2, 'นภา รัตนโชติ',     'napa@email.com',     '$2b$10$/unmei3MrGslKSK9ObYa5.m42Ciyp/JW8GzG5AkovQBlZH4RR5kq6', 'customer', '082-111-2222'),
(3, 'ธนา พรมมา',       'thana@email.com',    '$2b$10$/unmei3MrGslKSK9ObYa5.m42Ciyp/JW8GzG5AkovQBlZH4RR5kq6', 'customer', '083-333-4444'),
(4, 'มาลี สุริยา',      'malee@email.com',    '$2b$10$/unmei3MrGslKSK9ObYa5.m42Ciyp/JW8GzG5AkovQBlZH4RR5kq6', 'customer', '084-555-6666'),
(5, 'กิตติวัฒน์ กุดั่น', 'staff@booka.app',   '$2b$10$/unmei3MrGslKSK9ObYa5.m42Ciyp/JW8GzG5AkovQBlZH4RR5kq6', 'staff',    '082-345-6789'),
(6, 'ศิระเดช ศรีอ่ำ',   'admin@booka.app',   '$2b$10$/unmei3MrGslKSK9ObYa5.m42Ciyp/JW8GzG5AkovQBlZH4RR5kq6', 'admin',    '083-456-7890');

-- ─── Addresses ─────────────────────────────────────────────
INSERT INTO addresses (id, user_id, recipient_name, phone, address_line, province, postal_code, is_default) VALUES
(1, 1, 'สมชาย วงศ์สุข', '081-234-5678', '123 ถ.สุขุมวิท แขวงคลองเตย', 'กรุงเทพมหานคร', '10110', 1),
(2, 2, 'นภา รัตนโชติ',   '082-111-2222', '456 ถ.เพชรบุรี แขวงมักกะสัน', 'กรุงเทพมหานคร', '10400', 1),
(3, 3, 'ธนา พรมมา',     '083-333-4444', '654 ถ.พระราม 9 แขวงห้วยขวาง', 'กรุงเทพมหานคร', '10310', 1),
(4, 4, 'มาลี สุริยา',    '084-555-6666', '321 ถ.รัชดา แขวงดินแดง',     'กรุงเทพมหานคร', '10400', 1);

-- ─── Books ─────────────────────────────────────────────────
INSERT INTO books (id, title, author, isbn, price, original_price, stock_qty, category, cover_image_url, description, rating, review_count) VALUES
(1,  'ปีศาจ',          'เสนีย์ เสาวพงศ์',         '978-616-7904-01-2', 285.00, 320.00, 45, 'วรรณกรรมไทย', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', 'นวนิยายอมตะที่สะท้อนสังคมไทยในยุคเปลี่ยนผ่าน เรื่องราวความรักและชนชั้นที่ข้ามพ้นกาลเวลา',            4.80, 234),
(2,  'คำพิพากษา',      'ชาติ กอบจิตติ',            '978-616-7904-02-9', 195.00, 220.00, 23, 'วรรณกรรมไทย', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', 'ผลงานซีไรต์อันเลื่องชื่อ บอกเล่าเรื่องราวของฟักซึ่งตกอยู่ใต้อิทธิพลของสังคมและศีลธรรม',              4.90, 412),
(3,  'Atomic Habits',  'James Clear',              '978-0-735-21129-4', 325.00, 380.00, 78, 'Self-Help',     'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', 'An easy and proven way to build good habits and break bad ones.',                                          4.70, 891),
(4,  'Sapiens',        'Yuval Noah Harari',         '978-0-062-31609-7', 445.00, 520.00, 12, 'ประวัติศาสตร์', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400', 'A brief history of humankind.',                                                                            4.80, 1203),
(5,  'สี่แผ่นดิน',     'ม.ร.ว.คึกฤทธิ์ ปราโมช',   '978-616-7904-03-6', 350.00, 400.00,  8, 'วรรณกรรมไทย', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 'มหากาพย์ชีวิตของ แม่พลอย ผ่านสี่รัชกาล',                                                                4.90, 567),
(6,  'The Alchemist',  'Paulo Coelho',              '978-0-06-231500-7', 265.00, 300.00, 34, 'Fiction',       'https://images.unsplash.com/photo-1509266272358-7701da638078?w=400', 'A novel about following your dream.',                                                                      4.60, 756),
(7,  'ข้างหลังภาพ',    'ศรีบูรพา',                 '978-616-7904-04-3', 180.00, 200.00, 56, 'วรรณกรรมไทย', 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=400', 'นวนิยายรักอมตะที่ยืนนานกว่าทศวรรษ',                                                                       4.70, 389),
(8,  'Zero to One',    'Peter Thiel',               '978-0-804-13929-8', 355.00, 420.00, 29, 'ธุรกิจ',       'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400', 'Notes on startups, or how to build the future.',                                                          4.50, 445),
(9,  'ดอกส้มสีทอง',   'ทมยันตี',                   '978-616-7904-05-0', 210.00, 240.00, 41, 'วรรณกรรมไทย', 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=400', 'นิยายโรแมนติกอมตะของนักเขียนหญิงแถวหน้าของไทย',                                                           4.60, 298),
(10, 'Good to Great',  'Jim Collins',               '978-0-066-62099-5', 395.00, 460.00,  5, 'ธุรกิจ',       'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400', 'Why some companies make the leap and others do not.',                                                     4.50, 612);

-- ─── Orders (สร้างก่อน carts ได้เพราะไม่ depend กัน) ──────
INSERT INTO orders (id, user_id, address_id, verified_by, total_amount, status, tracking_number, order_date) VALUES
(1, 1, 1, NULL, 840.00,  'pending',        NULL,          '2025-01-13 09:00:00'),
(2, 2, 2, NULL, 510.00,  'payment_review', NULL,          '2025-01-13 10:30:00'),
(3, 3, 3,    5, 1250.00, 'confirmed',      NULL,          '2025-01-12 14:00:00'),
(4, 4, 4,    5, 325.00,  'shipping',       'TH1234567890','2025-01-12 11:00:00'),
(5, 1, 1,    5, 695.00,  'delivered',      'TH0987654321','2025-01-11 08:00:00'),
(6, 2, 2,    5, 445.00,  'cancelled',      NULL,          '2025-01-11 15:00:00'),
(7, 3, 3,    5, 920.00,  'delivered',      'TH1122334455','2025-01-10 09:30:00');

-- ─── Order Items ────────────────────────────────────────────
INSERT INTO order_items (order_id, book_id, quantity, price_per_unit) VALUES
(1, 1, 2, 285.00),
(1, 3, 1, 325.00),  -- 285*2 + 325 = 895 ≈ 840 (demo)
(2, 4, 1, 445.00),
(2, 6, 1, 265.00),  -- 445+265 = 710 ≈ 510 (demo)
(3, 3, 2, 325.00),
(3, 8, 1, 355.00),
(3, 1, 1, 285.00),  -- demo totals
(4, 3, 1, 325.00),
(5, 4, 1, 445.00),
(5, 2, 1, 195.00),
(6, 4, 1, 445.00),
(7, 1, 2, 285.00),
(7, 2, 1, 195.00),
(7, 6, 1, 265.00);

-- ─── Carts (empty carts สำหรับ customers) ─────────────────
INSERT INTO carts (id, user_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4);

-- NOTE: รหัสผ่านสำหรับทุก account คือ "password123"
-- customer@booka.app / staff@booka.app / admin@booka.app
