# 📊 ระบบจำหน่ายหนังสือออนไลน์ (Online Book Store System)
> เอกสารส่งมอบชิ้นงานสถาปัตยกรรมและการออกแบบระบบเชิงลึก (CSI204)

---

## 📋 1. Use Case Diagram & Specification (ขอบเขตระบบและการวิเคราะห์การใช้งาน)

แผนภาพยกระดับขอบเขตของระบบ (System Boundary) เพื่อแจกแจงกรณีการใช้งานเชิงลึก โดยระบุความสัมพันธ์แบบ `<<include>>` สำหรับการยืนยันตัวตนในกิจกรรมสำคัญ และแยกระดับสิทธิ์เข้าถึงระหว่าง ลูกค้า (Customer), พนักงานจัดการสต็อก (Staff) และผู้ดูแลระบบวิเคราะห์ข้อมูล (Admin) ไว้อย่างเด็ดขาด

```mermaid
graph LR
    Customer["👤 Customer"]
    Staff["🧑‍💼 Staff"]
    Admin["⚙️ Admin"]

    subgraph System ["📦 ขอบเขตระบบร้านหนังสือออนไลน์ (System Boundary)"]
        subgraph G1 ["🔐 ส่วนการเข้าถึงและจัดการสมาชิก"]
            UC_Register((UC1: สมัครสมาชิก))
            UC_Auth((UC2: เข้าสู่ระบบและยืนยันตัวตน))
            UC_Profile((UC8: จัดการโปรไฟล์และที่อยู่จัดส่ง))
        end
        subgraph G2 ["🛒 ส่วนสืบค้นและสั่งซื้อสินค้า"]
            UC_Search((UC3: ค้นหาและดูรายละเอียดหนังสือ))
            UC_Cart((UC4: จัดการตะกร้าสินค้า))
            UC_Checkout((UC5: สั่งซื้อหนังสือ))
            UC_UploadSlip((UC6: แนบสลิปโอนเงิน))
            UC_OrderHistory((UC7: ติดตามพัสดุและประวัติสั่งซื้อ))
        end
        subgraph G3 ["🧑‍💼 ส่วนจัดการหลังบ้านของพนักงาน"]
            UC_VerifySlip((UC9: ตรวจสอบและอนุมัติสลิปโอนเงิน))
            UC_ShipOrder((UC10: จัดการการจัดส่งและระบุเลขพัสดุ))
            UC_ManageCatalog((UC11: บริหารจัดการคลังสินค้าและสต็อก))
            UC_StockAlert((UC12: แจ้งเตือนสต็อกสินค้าต่ำ))
        end
        subgraph G4 ["⚙️ ส่วนจัดการระบบและวิเคราะห์ข้อมูล"]
            UC_Dashboard((UC13: ดูรายงานวิเคราะห์ยอดขาย BI Dashboard))
            UC_ManageUsers((UC14: จัดการผู้ใช้งานและระดับสิทธิ์ระบบ))
        end
    end

    Customer --> UC_Register
    Customer --> UC_Auth
    Customer --> UC_Search
    Customer --> UC_Cart
    Customer --> UC_Checkout
    Customer --> UC_UploadSlip
    Customer --> UC_OrderHistory
    Customer --> UC_Profile

    Staff --> UC_Auth
    Staff --> UC_VerifySlip
    Staff --> UC_ShipOrder
    Staff --> UC_ManageCatalog

    Admin --> UC_Auth
    Admin --> UC_ManageCatalog
    Admin --> UC_Dashboard
    Admin --> UC_ManageUsers

    UC_Checkout -.->|include| UC_Auth
    UC_OrderHistory -.->|include| UC_Auth
    UC_Profile -.->|include| UC_Auth
    UC_VerifySlip -.->|include| UC_Auth
    UC_ShipOrder -.->|include| UC_Auth
    UC_ManageCatalog -.->|include| UC_Auth
    UC_Dashboard -.->|include| UC_Auth
    UC_ManageUsers -.->|include| UC_Auth
    UC_UploadSlip -.->|extend| UC_Checkout
    UC_StockAlert -.->|extend| UC_ManageCatalog
```

### ตารางแจกแจงรายละเอียดสิทธิ์การใช้งาน (Use Case Specification Matrix)

| รหัสและชื่อ Use Case | ผู้มีสิทธิ์ (Actors) | เงื่อนไขและคำอธิบาย |
| :--- | :--- | :--- |
| **UC1: สมัครสมาชิก** | ลูกค้าผู้ใช้งานใหม่ | ลงทะเบียนสร้างบัญชีลูกค้าใหม่โดยระบุ ชื่อ, อีเมล, รหัสผ่าน และข้อมูลที่อยู่เริ่มต้น ระบบทำการบันทึกอย่างปลอดภัย |
| **UC2: เข้าสู่ระบบและยืนยันตัวตน** | ลูกค้า, พนักงาน, ผู้ดูแลระบบ | ตรวจสอบ email/password แล้วสร้าง JWT Token ที่มีอายุการใช้งาน สำหรับควบคุมและสแกนสิทธิ์การเข้าถึงข้อมูลหลังบ้าน |
| **UC3: ค้นหาและดูรายละเอียดหนังสือ** | ลูกค้า / บุคคลทั่วไป | สืบค้นหนังสือจากชื่อ, ชื่อผู้แต่ง, ISBN หรือหมวดหมู่ พร้อมแสดงรายละเอียด ราคา และข้อมูลคลังสินค้า โดยไม่ต้องล็อกอิน |
| **UC4: จัดการตะกร้าสินค้า** | ลูกค้า (Customer) | เพิ่ม/ลด/ปรับจำนวนเล่มหนังสือในตะกร้าช็อปปิ้งส่วนตัว ระบบทำการดึงสต็อกคอยควบคุมปริมาณ |
| **UC5: สั่งซื้อหนังสือ** | ลูกค้า (Customer) | «include» UC2 — ตรวจสอบและประมวลผลคำสั่งซื้อ คำนวณราคาหักส่วนลด ล็อกจำนวนสต็อกจริงด้วย Pessimistic Locking และสร้างใบสั่งซื้อสถานะ pending |
| **UC6: แนบสลิปโอนเงิน** | ลูกค้า (Customer) | «extend» UC5 — ลูกค้าทำการอัปโหลดสลิปหลักฐานการชำระเงินโอนผูกกับ order_id เพื่อส่งให้พนักงานเข้าตรวจสอบคิว |
| **UC7: ติดตามพัสดุและประวัติสั่งซื้อ** | ลูกค้า (Customer) | «include» UC2 — เข้าส่องดูสถานะออเดอร์ (pending, paid, shipped, cancelled) และแสดงเลข Tracking Number พร้อมลิงก์ขนส่ง |
| **UC8: จัดการโปรไฟล์และที่อยู่จัดส่ง** | ลูกค้า (Customer) | «include» UC2 — แก้ไขข้อมูลบัญชี เบอร์ติดต่อ และจัดระเบียบข้อมูลที่อยู่จัดส่งสำหรับออเดอร์ถัดไป |
| **UC9: ตรวจสอบและอนุมัติสลิปโอนเงิน** | พนักงาน (Staff) | «include» UC2 — พนักงานเปิดดูลายน้ำและรูปภาพหลักฐานการโอน หากถูกต้องจะกดยืนยันแล้วปรับสถานะออเดอร์เป็น paid |
| **UC10: จัดการการจัดส่งและระบุเลขพัสดุ** | พนักงาน (Staff) | «include» UC2 — แพ็คสินค้าจัดส่งพัสดุ บันทึกเลขขนส่ง Tracking Number เข้าออเดอร์ และปรับสถานะเป็น shipped |
| **UC11: บริหารจัดการคลังสินค้าและสต็อก** | พนักงานหลังบ้าน, ผู้ดูแลระบบ | «include» UC2 — เพิ่มหนังสือใหม่ ลบรายการที่หมดอายุ หรือแก้ไขข้อมูลราคา รายละเอียด และจำนวนสต็อกสินค้าในคลัง |
| **UC12: แจ้งเตือนสต็อกสินค้าต่ำ** | ระบบอัตโนมัติ (System) | «extend» UC11 — ตรวจสอบสต็อกหนังสือเมื่อเกิดการสั่งซื้อหรือปรับปรุง หากสต็อกต่ำกว่าเกณฑ์ (<= 5 เล่ม) จะยิง Webhook แจ้งเตือนพนักงานคลังสินค้า |
| **UC13: ดูรายงานสรุปยอดขาย BI Dashboard** | ผู้ดูแลระบบ (Admin) | «include» UC2 — แสดงแผง BI Dashboard วิเคราะห์รายได้รวม หนังสือขายดี 5 อันดับแรก และสถิติข้อมูลธุรกรรมสะสม |
| **UC14: จัดการผู้ใช้งานและระดับสิทธิ์ระบบ** | ผู้ดูแลระบบ (Admin / Super Admin) | «include» UC2 — จัดการบัญชีรายชื่อพนักงาน ตรวจสอบประวัติการล็อกอิน และสับเปลี่ยนกำหนดบทบาทหน้าที่ (Roles) ภายในระบบ |

---

## 🏗️ 2. Class Diagram & Entity Attributes (โครงสร้างความสัมพันธ์ของคลาสข้อมูล)

แผนภาพคลาสเชิงวัตถุระบุข้อมูลจำเพาะ (Data Specifications) ของชุดข้อมูล ประกอบด้วยชนิดข้อมูล (Data Type), สิทธิ์การเข้าถึง (Access Modifier) เช่น Private (-) และ Public (+) รวมถึงฟังก์ชันบริการภายในตัวคลาสที่เชื่อมโยงไปกับ Use Cases ทั้งหมด:

```mermaid
classDiagram
    %% Core Entities (Master Data)
    class User {
        -int id
        -string name
        -string email
        -string password_hash
        -string role
        +register(name, email, password) bool
        +login(email, password) string
        +getProfile() User
        +updateProfile(name, phone) bool
        +verifyToken(token) User$
    }

    class Address {
        -int id
        -int user_id
        -string recipient_name
        -string phone
        -string address_line
        -string province
        -string postal_code
        -bool is_default
        +addAddress(user_id, detail) bool
        +editAddress(id, detail) bool
        +deleteAddress(id) bool
        +setDefault(id) bool
    }

    class Book {
        -int id
        -string title
        -string author
        -string isbn
        -decimal price
        -int stock_qty
        -string category
        -string cover_image_url
        +updateStock(qty) bool
        +isAvailable() bool
        +search(query, category) List~Book~$
        +addBook(title, author, isbn, price, qty, category) bool$
        +editBook(id, title, author, price, qty, category) bool$
        +deleteBook(id) bool$
        +checkLowStockAlert() bool
    }

    class Notification {
        -int id
        -string type
        -string message
        -int book_id
        -timestamp sent_at
        +sendLowStockAlert(book_id, qty) bool$
        +sendWebhook(payload) bool$
    }

    class SalesReport {
        -timestamp generated_at
        -decimal total_sales
        -int total_orders
        +getWeeklySales() SalesReport$
        +getMonthlySales() SalesReport$
        +getTopSellers() List~Book~$
        +getDailyRevenue(days) List~Object~$
    }

    %% Transactional Entities (Operations)
    class Cart {
        -int id
        -int user_id
        +addItem(book_id, qty) bool
        +removeItem(book_id) bool
        +updateItemQty(book_id, qty) bool
        +getItems() List~CartItem~
        +clear() bool
    }

    class Order {
        -int id
        -int user_id
        -int address_id
        -int verified_by
        -decimal total_amount
        -string status
        -string slip_image_url
        -string tracking_number
        -timestamp order_date
        -timestamp shipped_at
        +createOrder(user_id, address_id) int
        +attachSlip(order_id, url) bool
        +approvePayment(order_id, staff_id) bool
        +rejectOrder(order_id, reason) bool
        +shipOrder(order_id, tracking_number) bool
        +getOrderHistory(user_id) List~Order~
    }

    %% Detail Entities (Sub-transactions)
    class CartItem {
        -int id
        -int cart_id
        -int book_id
        -int quantity
    }

    class OrderItem {
        -int id
        -int order_id
        -int book_id
        -int quantity
        -decimal price_per_unit
    }

    %% Relations
    User "1" --> "1" Cart : Owns
    User "1" --> "0..*" Order : Places
    User "1" --> "0..*" Address : Manages (UC8)
    User "0..1" --> "0..*" Order : Verifies (Staff)
    User "1" --> "0..*" SalesReport : Generates (Admin)

    Address "1" --> "0..*" Order : UsedIn

    Cart "1" *--> "0..*" CartItem : Contains
    Book "1" --> "0..*" CartItem : Referenced

    Order "1" *--> "1..*" OrderItem : Comprises
    Book "1" --> "0..*" OrderItem : Sold via

    Book "1" --> "0..*" Notification : Triggers (UC12)
    SalesReport "1" ..> "0..*" Order : Aggregates
```

---

## 🔄 3. Sequence Diagrams (ลำดับขั้นตอนการประมวลผลตาม Use Cases)

แผนภาพจำลองปฏิสัมพันธ์ในลักษณะเวลา (Timeline Base) เพื่อแจกแจงลำดับการทำงานของ Use Cases สำคัญต่างๆ ในระบบ:

### 🔐 3.1 UC1 & UC2: การสมัครสมาชิกและการเข้าสู่ระบบเพื่อยืนยันตัวตน (Register & Login Flow)
กระบวนการสมัครสมาชิก (Register) และการเข้าสู่ระบบ (Login) เพื่อรับสิทธิ์การใช้งานผ่าน JWT Token:

```mermaid
sequenceDiagram
    autonumber
    actor User as User (ลูกค้า/พนักงาน/แอดมิน)
    participant Client as React App (หน้าบ้าน)
    participant API as Express.js (หลังบ้าน)
    participant DB as MySQL (ฐานข้อมูล)

    opt กรณีผู้ใช้ใหม่ (สมัครสมาชิก)
        User->>Client: กรอกข้อมูลสมัครสมาชิก (ชื่อ, อีเมล, รหัสผ่าน)
        Client->>API: POST /api/auth/register (payload)
        API->>DB: SELECT id FROM users WHERE email = ?
        DB-->>API: คืนค่าผู้ใช้ (ถ้ามี)
        alt อีเมลซ้ำซ้อน
            API-->>Client: HTTP 400 Bad Request (Email already exists)
            Client-->>User: แสดงข้อความเตือนอีเมลซ้ำ
        else อีเมลไม่ซ้ำ
            API->>API: ทำการแฮชรหัสผ่าน (bcrypt)
            API->>DB: INSERT INTO users (name, email, password_hash, role)
            DB-->>API: คืนค่า insert_id และยืนยันบันทึก
            API-->>Client: HTTP 201 Created (Success Status)
            Client-->>User: แสดงการสมัครสมาชิกสำเร็จ & นำไปหน้าล็อกอิน
        end
    end

    User->>Client: กรอกอีเมลและรหัสผ่านเพื่อเข้าสู่ระบบ
    Client->>API: POST /api/auth/login (email, password)
    API->>DB: SELECT * FROM users WHERE email = ?
    DB-->>API: คืนค่าข้อมูลผู้ใช้ (id, password_hash, role)
    
    alt ไม่พบอีเมล หรือ รหัสผ่านไม่ถูกต้อง
        API-->>Client: HTTP 401 Unauthorized (Invalid credentials)
        Client-->>User: แสดงข้อความแจ้งเตือนความผิดพลาด
    else อีเมลและรหัสผ่านถูกต้อง
        API->>API: สร้าง JWT Token (ระบุ id, role, วันหมดอายุ)
        API-->>Client: HTTP 200 OK (JWT Token, User Profile)
        Client->>Client: บันทึก Token ใน LocalStorage/Context
        Client-->>User: ยินดีต้อนรับเข้าสู่ระบบ (Redirect ไปยังหน้าหลักตามสิทธิ์)
    end
```

### 🛒 3.2 UC3 & UC4: การค้นหาหนังสือและจัดการตะกร้าสินค้า (Search & Shopping Flow)
ขั้นตอนที่ผู้ใช้ค้นหาหนังสือและทำรายการใส่ตะกร้า พร้อมตรวจสอบจำนวนคลังสินค้าก่อนอัปเดตสเตตัสตะกร้า:

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer (ลูกค้า)
    participant Client as React App (หน้าบ้าน)
    participant AuthMW as Middleware (สิทธิ์)
    participant API as Express.js (หลังบ้าน)
    participant DB as MySQL (ฐานข้อมูล)

    Customer->>Client: พิมพ์คำค้นหาหนังสือ / เลือกหมวดหมู่
    Client->>API: GET /api/books?search=...&category=...
    API->>DB: SELECT * FROM books WHERE title LIKE ... OR category = ...
    DB-->>API: คืนค่ารายการหนังสือที่ค้นหาพบ
    API-->>Client: HTTP 200 OK (Array of Books)
    Client-->>Customer: แสดงผลรายการหนังสือบนหน้าจอ

    opt ดูรายละเอียดหนังสือ (View Book Detail)
        Customer->>Client: คลิกที่หนังสือเพื่อดูรายละเอียด (ชื่อ, ผู้แต่ง, ราคา, สต็อก)
        Client->>API: GET /api/books/:id
        API->>DB: SELECT * FROM books WHERE id = ?
        DB-->>API: คืนค่ารายละเอียดครบถ้วนของหนังสือ (พร้อม stock_qty)
        API-->>Client: HTTP 200 OK (Book Detail Object)
        Client-->>Customer: แสดงหน้ารายละเอียดหนังสือพร้อมปุ่ม "ใส่ตะกร้า"
    end

    opt เปิดหน้าตะกร้าสินค้า (View Cart)
        Customer->>Client: คลิกไอคอนตะกร้าสินค้า
        Client->>AuthMW: GET /api/cart [Authorization Header]
        AuthMW->>AuthMW: ตรวจสอบ JWT Token
        alt Token ไม่ถูกต้อง
            AuthMW-->>Client: HTTP 401 Unauthorized
            Client-->>Customer: แสดงหน้าล็อกอิน
        else Token ถูกต้อง
            AuthMW->>API: ส่ง user_id ที่ถอดรหัสได้
            API->>DB: SELECT ci.*, b.title, b.price FROM cart_items ci JOIN books b ON ci.book_id = b.id WHERE ci.cart_id = ?
            DB-->>API: คืนค่ารายการหนังสือในตะกร้า
            API-->>Client: HTTP 200 OK (Cart Items Array)
            Client-->>Customer: แสดงรายการหนังสือในตะกร้าพร้อมยอดรวม
        end
    end

    opt เพิ่มสินค้าลงตะกร้า (Add Item)
        Customer->>Client: คลิกปุ่ม "ใส่ตะกร้า"
        Client->>AuthMW: POST /api/cart/items (book_id, quantity) [Auth Header]
        AuthMW->>AuthMW: ตรวจสอบ JWT Token
        AuthMW->>API: ส่ง request พร้อม user_id
        API->>DB: SELECT stock_qty FROM books WHERE id = ?
        DB-->>API: คืนค่าจำนวนสต็อกของหนังสือ
        alt สต็อกต่ำกว่าจำนวนที่ต้องการ
            API-->>Client: HTTP 400 Bad Request (Insufficient stock)
            Client-->>Customer: แจ้งเตือนสินค้าในคลังไม่พอ
        else สต็อกเพียงพอ
            API->>DB: INSERT/UPDATE cart_items (cart_id, book_id, quantity)
            DB-->>API: บันทึกข้อมูลสำเร็จ
            API-->>Client: HTTP 200 OK (Updated Cart Items)
            Client-->>Customer: อัปเดตตัวเลขในตะกร้าช็อปปิ้ง
        end
    end

    opt ลบสินค้าหรือปรับจำนวน (Remove/Update Qty)
        Customer->>Client: ปรับลดจำนวน/ลบสินค้าในหน้าตะกร้า
        Client->>AuthMW: PUT/DELETE /api/cart/items/:id (quantity) [Auth Header]
        AuthMW->>API: ส่ง request ผ่าน Middleware
        API->>DB: UPDATE/DELETE cart_items SET quantity = ... WHERE id = ?
        DB-->>API: ดำเนินการฐานข้อมูลสำเร็จ
        API-->>Client: HTTP 200 OK (Updated Cart)
        Client-->>Customer: อัปเดตยอดรวมและรายการใหม่บนตะกร้า
    end
```

### 💳 3.3 UC5: การสั่งซื้อหนังสือพร้อม Pessimistic Locking (Checkout Flow)
ขั้นตอนสั่งซื้อที่มีการล็อคข้อมูลจำนวนสต็อกในตารางเพื่อป้องกันสภาวะชิงข้อมูล (Race Condition):

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer (ลูกค้า)
    participant Client as React App (หน้าบ้าน)
    participant AuthMW as Middleware (สิทธิ์)
    participant API as Express.js (หลังบ้าน)
    participant DB as MySQL (ฐานข้อมูล)

    Customer->>Client: คลิกปุ่มชำระเงิน
    Client->>AuthMW: POST /api/orders (Authorization)
    AuthMW->>AuthMW: ตรวจสอบความถูกต้อง JWT

    alt โทเค็นไม่ผ่าน
        AuthMW-->>Client: HTTP 401 Unauthorized
        Client-->>Customer: แสดงแจ้งเตือนล็อกอินใหม่
    else โทเค็นผ่าน
        AuthMW->>API: ส่งข้อมูลออเดอร์และผู้ใช้
        API->>DB: START TRANSACTION
        DB-->>API: Transaction Started
        API->>DB: SELECT stock FROM books FOR UPDATE
        DB-->>API: คืนค่าจำนวนสต็อกล่าสุด

        alt สต็อกไม่พอ
            API->>DB: ROLLBACK
            DB-->>API: Transaction Rolled Back
            API-->>Client: HTTP 400 Bad Request
            Client-->>Customer: แจ้งเตือนสินค้าไม่พอ
        else สต็อกพอ
            API->>DB: UPDATE books SET stock_qty = stock_qty - ? (หักลบสต็อก)
            API->>DB: INSERT INTO orders (user_id, address_id, total_amount, status='pending')
            DB-->>API: คืนค่า order_id ใหม่
            API->>DB: INSERT INTO order_items (order_id, book_id, quantity, price_per_unit)
            API->>DB: DELETE FROM cart_items WHERE cart_id = ? (ล้างตะกร้าสินค้า)
            API->>DB: COMMIT
            DB-->>API: Transaction Committed
            API-->>Client: HTTP 201 Created (order_id)
            Client-->>Customer: แสดงจอออเดอร์สำเร็จ & นำทางไปหน้าแนบสลิปเงิน
        end
    end
```

### 📄 3.4 UC6: การแนบหลักฐานการชำระเงิน (Upload Payment Slip Flow)
ขั้นตอนที่ลูกค้าอัปโหลดรูปภาพสลิปเงินเพื่อผูกกับใบสั่งซื้อค้างจ่าย:

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer (ลูกค้า)
    participant Client as React App (หน้าบ้าน)
    participant AuthMW as Middleware (สิทธิ์)
    participant API as Express.js (หลังบ้าน)
    participant Storage as Cloud Storage (ที่เก็บไฟล์)
    participant DB as MySQL (ฐานข้อมูล)

    Customer->>Client: ไปที่หน้ารายการสั่งซื้อ & เลือกอัปโหลดรูปภาพสลิป
    Client->>AuthMW: POST /api/orders/:id/slip (Multipart Image File) [Auth Header]
    AuthMW->>AuthMW: ตรวจสอบ JWT Token และสิทธิ์เจ้าของ order
    alt Token ไม่ถูกต้องหรือไม่ใช่เจ้าของ order
        AuthMW-->>Client: HTTP 401/403 Unauthorized / Forbidden
        Client-->>Customer: แจ้งเตือนไม่มีสิทธิ์อัปโหลด
    else Token ถูกต้องและเป็นเจ้าของ order
        AuthMW->>API: ส่ง request พร้อม user_id
        API->>DB: SELECT status FROM orders WHERE id = ? AND user_id = ?
        DB-->>API: คืนค่าสถานะ order ปัจจุบัน
        alt order ไม่อยู่ในสถานะ 'pending'
            API-->>Client: HTTP 400 Bad Request (Order not in pending state)
            Client-->>Customer: แจ้งเตือนไม่สามารถแนบสลิปได้
        else order สถานะ 'pending'
            API->>Storage: อัปโหลดรูปภาพสลิปไปยัง Cloud Storage (เช่น S3/Cloudinary)
            Storage-->>API: คืนค่า URL ของรูปภาพสลิปโอนเงิน (slip_image_url)
            API->>DB: UPDATE orders SET slip_image_url = ? WHERE id = ?
            DB-->>API: บันทึกและยืนยันการเปลี่ยนแปลงข้อมูล
            API-->>Client: HTTP 200 OK (Slip Uploaded)
            Client-->>Customer: แสดงแจ้งเตือนอัปโหลดสลิปสำเร็จ & สเตตัสเปลี่ยนเป็น "รอตรวจสอบ"
        end
    end
```

### 📦 3.5 UC9 & UC10: การตรวจสอบสลิปและการจัดการจัดส่ง (Verify & Fulfillment Flow)
ขั้นตอนการตรวจสอบและอนุมัติยอดโอนเงินโดยพนักงาน และการออกใบจัดส่งพร้อม tracking number:

```mermaid
sequenceDiagram
    autonumber
    actor Staff as Staff (พนักงานคลังสินค้า)
    participant Client as React App (หน้าบ้าน)
    participant AuthMW as Middleware (สิทธิ์)
    participant API as Express.js (หลังบ้าน)
    participant DB as MySQL (ฐานข้อมูล)

    Staff->>Client: เปิดหน้ารายการคำสั่งซื้อค้างตรวจสอบ (Pending Orders)
    Client->>AuthMW: GET /api/orders/pending [Auth Header]
    AuthMW->>AuthMW: ตรวจสอบ JWT Token และ role = 'staff' หรือ 'admin'
    alt Token ไม่ถูกต้องหรือไม่มีสิทธิ์
        AuthMW-->>Client: HTTP 403 Forbidden
        Client-->>Staff: แสดงหน้าปฏิเสธสิทธิ์
    else ผ่านการตรวจสอบ
        AuthMW->>API: ส่ง request พร้อม role
        API->>DB: SELECT o.*, u.name, o.slip_image_url FROM orders o JOIN users u ON o.user_id = u.id WHERE o.status = 'pending'
        DB-->>API: คืนค่ารายการคำสั่งซื้อและลิงก์รูปสลิป
        API-->>Client: HTTP 200 OK (Orders Array)
        Client-->>Staff: แสดงรูปภาพสลิปเปรียบเทียบกับยอดเงินออเดอร์
    end

    alt ข้อมูลสลิปถูกต้องยอดเงินครบ
        Staff->>Client: คลิกอนุมัติ "ยืนยันยอดเงินสำเร็จ"
        Client->>AuthMW: PUT /api/orders/:id/approve [Auth Header]
        AuthMW->>API: ส่ง request พร้อม staff_id
        API->>DB: UPDATE orders SET status = 'paid', verified_by = ? WHERE id = ?
        DB-->>API: ยืนยันปรับปรุงแถวข้อมูลสำเร็จ
        API-->>Client: HTTP 200 OK (Payment Verified)
        Client-->>Staff: อัปเดตสเตตัสออเดอร์เป็น "Paid (ชำระเงินแล้ว)" บนหน้าจอ
    else สลิปปลอมหรือยอดเงินไม่ตรง
        Staff->>Client: คลิกปฏิเสธรายการพร้อมระบุเหตุผล
        Client->>AuthMW: PUT /api/orders/:id/reject (reason) [Auth Header]
        AuthMW->>API: ส่ง request พร้อม staff_id
        API->>DB: SELECT oi.book_id, oi.quantity FROM order_items WHERE order_id = ?
        DB-->>API: คืนค่ารายการสินค้าในออเดอร์
        API->>DB: UPDATE books SET stock_qty = stock_qty + ? WHERE id = ? (คืนสต็อก)
        API->>DB: UPDATE orders SET status = 'cancelled' WHERE id = ?
        DB-->>API: ยืนยันคืนสต็อกและยกเลิกคำสั่งซื้อสำเร็จ
        API-->>Client: HTTP 200 OK (Order Cancelled)
        Client-->>Staff: อัปเดตสถานะออเดอร์บนหน้าจอเป็น "Cancelled"
    end

    opt ขั้นตอนการจัดส่งสินค้า (UC10)
        Staff->>Client: กรอกเลขพัสดุ (Tracking Number) สำหรับออเดอร์สเตตัส 'paid'
        Client->>AuthMW: PUT /api/orders/:id/ship (tracking_number) [Auth Header]
        AuthMW->>API: ส่ง request ผ่าน Middleware
        API->>DB: UPDATE orders SET status = 'shipped', tracking_number = ?, shipped_at = NOW() WHERE id = ?
        DB-->>API: ยืนยันบันทึกข้อมูลเรียบร้อย
        API-->>Client: HTTP 200 OK (Order Shipped)
        Client-->>Staff: แสดงสถานะการจัดส่งสำเร็จพร้อมเลขพัสดุ
    end
```

### ⚙️ 3.6 UC11 & UC12: การบริหารคลังสินค้าและเตือนสต็อกต่ำ (Inventory & Alert Flow)
การจัดการข้อมูลหนังสือและการรับรู้ระบบแจ้งเตือนอัตโนมัติเมื่อจำนวนสต็อกต่ำกว่าเกณฑ์:

```mermaid
sequenceDiagram
    autonumber
    actor Staff as Staff/Admin (พนักงานคลังสินค้า)
    participant Client as React App (หน้าบ้าน)
    participant AuthMW as Middleware (สิทธิ์)
    participant API as Express.js (หลังบ้าน)
    participant DB as MySQL (ฐานข้อมูล)
    actor Discord as Discord/System Notification

    opt เพิ่มหนังสือใหม่เข้าคลัง (Add New Book)
        Staff->>Client: กรอกข้อมูลหนังสือใหม่ (ชื่อ, ผู้แต่ง, ISBN, ราคา, จำนวน)
        Client->>AuthMW: POST /api/books (book data) [Auth Header]
        AuthMW->>AuthMW: ตรวจสอบ JWT Token และ role = 'staff' หรือ 'admin'
        alt Token ไม่ถูกต้องหรือไม่มีสิทธิ์
            AuthMW-->>Client: HTTP 403 Forbidden
            Client-->>Staff: แสดงหน้าปฏิเสธสิทธิ์
        else ผ่านการตรวจสอบ
            AuthMW->>API: ส่ง request พร้อม role
            API->>DB: SELECT id FROM books WHERE isbn = ?
            DB-->>API: ตรวจสอบ ISBN ซ้ำ
            alt ISBN ซ้ำกับหนังสือที่มีอยู่
                API-->>Client: HTTP 409 Conflict (ISBN already exists)
                Client-->>Staff: แจ้งเตือน ISBN ซ้ำ
            else ISBN ไม่ซ้ำ
                API->>DB: INSERT INTO books (title, author, isbn, price, stock_qty, category)
                DB-->>API: คืนค่า book_id ใหม่
                API-->>Client: HTTP 201 Created (New Book)
                Client-->>Staff: แสดงผลหนังสือใหม่ในรายการคลังสินค้า
            end
        end
    end

    opt แก้ไขรายละเอียด/จำนวนสต็อกหนังสือ (Edit Book)
        Staff->>Client: กรอกข้อมูลปรับเพิ่ม/แก้ไขรายละเอียดหนังสือในสต็อก
        Client->>AuthMW: PUT /api/books/:id (title, price, stock_qty) [Auth Header]
        AuthMW->>AuthMW: ตรวจสอบ JWT Token และ role
        AuthMW->>API: ส่ง request ผ่าน Middleware
        API->>DB: UPDATE books SET stock_qty = ?, price = ?, title = ? WHERE id = ?
        DB-->>API: อัปเดตแถวสินค้าในฐานข้อมูลสำเร็จ
        API->>DB: SELECT stock_qty, title FROM books WHERE id = ?
        DB-->>API: คืนค่าจำนวนสต็อกคงเหลือปัจจุบัน
        alt สต็อกต่ำกว่าเกณฑ์ความปลอดภัย (stock_qty <= 5)
            API->>Discord: ส่ง Webhook/Notification แจ้งเตือนระบบ "สินค้าสต็อกต่ำ!"
            Discord-->>Staff: แสดงข้อความแจ้งเตือน "หนังสือ [Title] เหลือในคลังเพียง [Qty] เล่ม!"
        end
        API-->>Client: HTTP 200 OK (Book Updated Successfully)
        Client-->>Staff: แสดงผลข้อมูลคลังหนังสือเวอร์ชันอัปเดตเรียบร้อย
    end

    opt ลบหนังสือออกจากคลัง (Delete Book)
        Staff->>Client: คลิกปุ่มลบรายการหนังสือ
        Client->>AuthMW: DELETE /api/books/:id [Auth Header]
        AuthMW->>API: ตรวจสอบสิทธิ์และส่ง request
        API->>DB: DELETE FROM books WHERE id = ?
        DB-->>API: ยืนยันลบข้อมูลสำเร็จ
        API-->>Client: HTTP 200 OK (Book Deleted)
        Client-->>Staff: ลบรายการหนังสือออกจากหน้าจอคลังสินค้า
    end
```

### 📊 3.7 UC13: รายงานสรุปยอดขายสำหรับผู้ดูแลระบบ (BI Dashboard Summary Flow)
การสรุปและคำนวณสถิติยอดขายเพื่อใช้ในการวิเคราะห์แบบเรียลไทม์:

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Admin (ผู้ดูแลระบบ)
    participant Client as React App (หน้าบ้าน)
    participant AuthMW as Middleware (สิทธิ์)
    participant API as Express.js (หลังบ้าน)
    participant DB as MySQL (ฐานข้อมูล)

    Admin->>Client: คลิกหน้าเมนู "แผงสรุปรายงาน (Dashboard)"
    Client->>AuthMW: GET /api/reports/dashboard [Auth Header]
    AuthMW->>AuthMW: ตรวจสอบ JWT Token และ role = 'admin'
    alt Token ไม่ถูกต้องหรือไม่ใช่ Admin
        AuthMW-->>Client: HTTP 403 Forbidden
        Client-->>Admin: แสดงหน้าปฏิเสธสิทธิ์
    else ผ่านการตรวจสอบ Admin
        AuthMW->>API: ส่ง request พร้อม role
        API->>DB: SELECT SUM(total_amount), COUNT(id) FROM orders WHERE status IN ('paid','shipped')
        DB-->>API: คืนค่ารายรับสะสมและจำนวนออเดอร์ทั้งหมด
        API->>DB: SELECT oi.book_id, b.title, SUM(oi.quantity) as total_sold FROM order_items oi JOIN books b ON oi.book_id = b.id GROUP BY oi.book_id ORDER BY total_sold DESC LIMIT 5
        DB-->>API: คืนค่ารายชื่อ 5 หนังสือยอดนิยม
        API->>DB: SELECT DATE(order_date), SUM(total_amount) FROM orders WHERE order_date >= DATE_SUB(NOW(), INTERVAL 7 DAY) GROUP BY DATE(order_date)
        DB-->>API: คืนค่าข้อมูลกราฟยอดขายรายวัน
        API->>DB: SELECT COUNT(id) as total_users FROM users WHERE role = 'customer'
        DB-->>API: คืนค่าจำนวนสมาชิกทั้งหมด
        API-->>Client: HTTP 200 OK (JSON Payload ครบทุก Metric)
        Client->>Client: นำข้อมูลไปเรนเดอร์ในรูปแบบ Chart & Metrics
        Client-->>Admin: แสดงผล BI Dashboard สวยงามบนหน้าจอแอดมิน
    end
```

---

## 🔄 4. Activity Diagram (แผนภาพแสดงลำดับเวิร์กโฟลว์ผู้ใช้ข้ามบทบาท)

แผนภาพกิจกรรม (Activity Diagram) แสดงการไหลของกระบวนการสั่งซื้อหนังสือข้ามระบบผู้ใช้แบบ Swimlanes:

```mermaid
flowchart TD
    subgraph Customer_Lane ["👤 Customer Workflow"]
        A1([เริ่มต้น]) --> A2[สืบค้นหนังสือบนแคตตาล็อก]
        A2 --> A3[เพิ่มหนังสือลงตะกร้า]
        A3 --> A4[กดชำระเงินและยืนยันออเดอร์]
        A4 --> A5[โอนเงินและแนบรูปสลิป]
        A5 --> A6[รอรับพัสดุและรหัสจัดส่ง]
        A6 --> A7([เสร็จสิ้นกระบวนการ])
    end

    subgraph System_Lane ["⚙️ Core System Workflow"]
        S1[ตรวจสอบสต็อกหนังสือ]
        S2[ประมวลผลล็อค Transaction]
        S3{สต็อกพอ?}
        S4[หักจำนวนสินค้าคงคลัง]
        S5[บันทึกคำสั่งซื้อเข้า MySQL]
        S6[ยกเลิกรายการสั่งซื้อ]
        S7[ส่งอีเมลยืนยัน]
        S1 --> S2 --> S3
        S3 -->|สต็อกพอ| S4 --> S5
        S3 -->|สต็อกหมด| S6
    end

    subgraph Staff_Lane ["🧑‍💼 Staff Workflow"]
        ST1[รับแจ้งออเดอร์ใหม่]
        ST2[ตรวจสอบสลิปและยอดเงิน]
        ST3{สลิปถูกต้อง?}
        ST4[อนุมัติออเดอร์และเตรียมจัดส่ง]
        ST5[บันทึกสลิปจัดส่งสำเร็จ]
        ST6[ปฏิเสธออเดอร์]
        ST1 --> ST2 --> ST3
        ST3 -->|ถูกต้อง| ST4 --> ST5
        ST3 -->|ไม่ถูกต้อง| ST6
    end

    A4 --> S1
    S5 --> ST1
    S6 --> A_Cancel([❌ แจ้งลูกค้า: ยกเลิกออเดอร์])
    ST4 --> S7 --> A6
    ST5 --> A7
```

---

## 📌 5. State Diagram (วงจรชีวิตสถานะของคำสั่งซื้อ Order)

แผนภาพสถานะ (State Diagram) แสดงการเปลี่ยนสถานะของ Order ตลอด Lifecycle ตั้งแต่ลูกค้ากดยืนยัน จนพัสดุถูกจัดส่งหรือออเดอร์ถูกยกเลิก:

```mermaid
stateDiagram-v2
    [*] --> pending : Customer creates order (UC5)
    pending --> paid : Staff verifies slip ✅ (UC9)
    pending --> cancelled : Stock insufficient OR Slip rejected ❌
    paid --> shipped : Staff dispatches parcel (UC10)
    paid --> cancelled : Admin / Staff cancels order
    shipped --> [*] : Order complete — delivery confirmed
    cancelled --> [*] : Order terminated

    note right of pending
        สถานะเริ่มต้นหลังลูกค้ากด
        ยืนยันออเดอร์และแนบสลิป
    end note
    note right of paid
        พนักงานยืนยันการชำระเงิน
        แล้ว เตรียมจัดส่ง
    end note
```

---

## 💾 6. Database ERD (การออกแบบความสัมพันธ์ฐานข้อมูล MySQL 3NF)

แผนภาพความสัมพันธ์ของเอนทิตี (Entity-Relationship Diagram) แสดงรูปแบบฐานข้อมูลจริงที่รันในโปรดักชัน ซึ่งแยกส่วนของตารางกลางแบบ Normalized (3NF):

```mermaid
erDiagram
    users {
        int id PK
        string name
        string email UK
        string password_hash
        enum role
        timestamp created_at
    }
    books {
        int id PK
        string title
        string author
        string isbn UK
        decimal price
        int stock_qty
        string category
    }
    carts {
        int id PK
        int user_id FK
    }
    cart_items {
        int id PK
        int cart_id FK
        int book_id FK
        int quantity
    }
    orders {
        int id PK
        int user_id FK
        int verified_by FK
        decimal total_amount
        enum status
        string slip_image_url
        string tracking_number
        timestamp order_date
        timestamp shipped_at
    }
    order_items {
        int id PK
        int order_id FK
        int book_id FK
        int quantity
        decimal price_per_unit
    }

    users ||--|| carts : owns
    users ||--o{ orders : places
    carts ||--o{ cart_items : contains
    books ||--o{ cart_items : added_to
    orders ||--|{ order_items : comprises
    books ||--o{ order_items : sold_in
```

---

## 🚀 7. Deployment Architecture (สถาปัตยกรรมทางกายภาพและการติดตั้งจริง)

แผนภาพจำลองการติดตั้งระบบบน Cloud แยกสภาพแวดล้อมฝั่ง Client (React บน Vercel) และ Backend (Node.js & Express บน Render) เชื่อมสู่ MySQL:

```mermaid
flowchart TD
    subgraph Client_Env ["🌐 Client Environment (Frontend Web)"]
        Browser["🌐 User Web Browser"]
        ReactApp["📱 React App (Vercel Cloud)"]
        Browser -->|Render UI| ReactApp
    end

    subgraph Cloud_Env ["⚙️ Cloud Service Environment (Express API)"]
        API_Server["🖥️ Node.js & Express API (Render Cloud)"]
        JWT_Verify["🛡️ JWT Security Verification"]
        API_Server --> JWT_Verify
    end

    subgraph Data_Env ["🗄️ Database Environment"]
        MySQL_RDS[("MySQL DB Instance (Cloud SQL)\nPort: 3306")]
    end

    Browser -->|HTTPS API Requests / JSON| API_Server
    API_Server -->|Connection Pool / SQL Queries| MySQL_RDS
```

---

## 💾 8. Data Schema Specification (JSON Contract Payload)

โครงสร้างข้อมูลระดับลึก (Data Contract Payload) ที่ใช้ทดสอบสัญญาความถูกต้องในการผูกระบบระหว่างหน้าบ้านและ API หลังบ้าน:

```json
{
  "transaction_metadata": {
    "environment": "production-v1",
    "api_version": "1.0.4"
  },
  "order_id": 40291,
  "customer_details": {
    "student_user_id": 67120669,
    "fullname": "Siradech Sriam",
    "shipping_address": "99/1 ถนนวิภาวดีรังสิต ดินแดง กรุงเทพฯ"
  },
  "items": [
    {
      "book_id": 101,
      "title": "คู่มือการพัฒนาซอฟต์แวร์แพลตฟอร์มด้วย React",
      "quantity": 2,
      "price_per_unit": 250.00
    },
    {
      "book_id": 105,
      "title": "Introduction to RDBMS & MySQL Architecture",
      "quantity": 1,
      "price_per_unit": 390.00
    }
  ],
  "financials": {
    "subtotal": 890.00,
    "shipping_fee": 0.00,
    "grand_total": 890.00
  },
  "payment_status": "Verified_Success",
  "is_dispatched": true
}
```

---

## 🚀 9. แหล่งเก็บซอร์สโค้ดและรายงานความคืบหน้า (Project Deliverables)

### 👥 โครงสร้างทีมและบทบาทหน้าที่

| รายชื่อสมาชิก | บทบาทหน้าที่ (Role) | ขอบเขตความรับผิดชอบหลัก |
| :--- | :--- | :--- |
| **นายศิระเดช ศรีอ่ำ** (67120669) | 🛂 Customer System Developer | ฟังก์ชันลูกค้าทั้งหมด (Storefront, ค้นหาหนังสือ, ตะกร้า, สั่งซื้อ/แนบสลิป) |
| **นายกิตติวัฒน์ กุดั่น** (67107666) | 🧑‍💼 Admin System Developer | ฟังก์ชันพนักงาน/แอดมิน (อนุมัติสลิปและจัดการจัดส่งสินค้า) |
| **นายศุภวิชญ์ เชื้อสาทุม** (67125897) | ⚙️ Super Admin / Backend & DBA | Super Admin Dashboard, MySQL, REST API |

### 📈 ตารางสถานะชิ้นงาน (Progress Checklist)

| กิจกรรม/งานส่งมอบ | สถานะ | ผู้รับผิดชอบ |
| :--- | :---: | :--- |
| 1. เอกสารสถาปัตยกรรมระบบ (Use Case, Class, Sequence) | ✅ 100% | นายศิระเดช ศรีอ่ำ (PM) |
| 2. การออกแบบโครงสร้างฐานข้อมูล (MySQL Schema ERD) | ✅ 100% | นายศุภวิชญ์ เชื้อสาทุม (DBA) |
| 3. พัฒนา React Storefront UI | ✅ 100% | นายศิระเดช, นายกิตติวัฒน์ |
| 4. พัฒนา Core RESTful API และ Transaction Lock | ✅ 100% | นายศุภวิชญ์ เชื้อสาทุม |
| 5. API Automation Testing (Postman) | ✅ 100% | นายศุภวิชญ์ เชื้อสาทุม |
| 6. User Acceptance Testing (UAT Manual) | ✅ 100% | นายกิตติวัฒน์ กุดั่น (QA) |

📂 **GitHub Repository:** [https://github.com/SupvichSpuGM/online-bookstore](https://github.com/SupvichSpuGM/online-bookstore)
