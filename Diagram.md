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
        subgraph G1 ["🔐 ส่วนกลางและการเข้าถึง"]
            UC_Auth((UC1: ยืนยันตัวตน))
            UC_Search((UC2: ค้นหาหนังสือ))
        end
        subgraph G2 ["🛒 ตะกร้าและการสั่งซื้อ"]
            UC_Cart((UC3: จัดการตะกร้า))
            UC_Checkout((UC4: สั่งซื้อหนังสือ))
            UC_UploadSlip((UC5: แนบสลิปโอนเงิน))
        end
        subgraph G3 ["⚙️ จัดการคลังและหลังบ้าน"]
            UC_VerifySlip((UC6: ตรวจสอบสลิปเงิน))
            UC_ShipOrder((UC7: จัดการจัดส่ง))
            UC_ManageCatalog((UC8: บริหารคลังสินค้า))
            UC_StockAlert((UC9: เตือนสต็อกต่ำ))
            UC_Dashboard((UC10: รายงานสรุปยอดขาย))
        end
    end

    Customer --> UC_Search
    Customer --> UC_Cart
    Customer --> UC_Checkout
    Staff --> UC_VerifySlip
    Staff --> UC_ShipOrder
    Staff --> UC_ManageCatalog
    Admin --> UC_ManageCatalog
    Admin --> UC_Dashboard

    UC_Checkout -.->|include| UC_Auth
    UC_VerifySlip -.->|include| UC_Auth
    UC_ShipOrder -.->|include| UC_Auth
    UC_ManageCatalog -.->|include| UC_Auth
    UC_Dashboard -.->|include| UC_Auth
    UC_UploadSlip -.->|extend| UC_Checkout
    UC_StockAlert -.->|extend| UC_ManageCatalog
```

### ตารางแจกแจงรายละเอียดสิทธิ์การใช้งาน (Use Case Specification Matrix)

| รหัสและชื่อ Use Case | ผู้มีสิทธิ์ (Actors) | เงื่อนไขและคำอธิบาย |
| :--- | :--- | :--- |
| **UC1: ยืนยันตัวตนเข้าระบบ** | ลูกค้า, พนักงาน, ผู้ดูแลระบบ | ตรวจสอบ email/password แล้วสร้าง JWT Token สำหรับควบคุมการเข้าถึง API |
| **UC2: ค้นหาหนังสือ** | ลูกค้า (Customer) | สืบค้นหนังสือจากชื่อ, ผู้แต่ง, ISBN หรือหมวดหมู่ ไม่ต้องล็อกอินก็ใช้งานได้ |
| **UC3: จัดการตะกร้าสินค้า** | ลูกค้า (Customer) | เพิ่ม/ลบ/ปรับจำนวนหนังสือในตะกร้า ระบบตรวจสอบสต็อกก่อนยืนยัน |
| **UC4: สั่งซื้อและแนบหลักฐาน** | ลูกค้า (Customer) | คำนวณราคาสุทธิ, ตัดสต็อกด้วย Transaction Lock และสร้าง Order |
| **UC5: แนบสลิปโอนเงิน** | ลูกค้า (Customer) | «extend» UC4 — อัปโหลดไฟล์ภาพสลิปผูกกับ order_id |
| **UC6: ตรวจสอบสลิปเงิน** | พนักงาน (Staff) | ดูรายการออเดอร์ค้างอนุมัติ ตรวจยืนยันสลิปและอัปเดต status เป็น "paid" |
| **UC7: จัดการจัดส่ง** | พนักงาน (Staff) | บันทึกเลขพัสดุและวันที่จัดส่ง อัปเดต status ออเดอร์เป็น "shipped" |
| **UC8: บริหารคลังสินค้า** | พนักงานหลังบ้าน, ผู้ดูแลระบบ | เพิ่ม/ลบ/แก้ไขข้อมูลหนังสือ จัดการหมวดหมู่ และปรับปรุงสต็อก Real-time |
| **UC9: เตือนสต็อกต่ำ** | ระบบ → พนักงาน | «extend» UC8 — แจ้งเตือนอัตโนมัติเมื่อ stock_qty ต่ำกว่าเกณฑ์ |
| **UC10: รายงานสรุปยอดขาย** | ผู้ดูแลระบบ (Admin) | แสดง Dashboard สรุปยอดขาย, หนังสือขายดี, รายรับรายสัปดาห์/เดือน |

---

## 🏗️ 2. Class Diagram & Entity Attributes (โครงสร้างความสัมพันธ์ของคลาสข้อมูล)

แผนภาพคลาสเชิงวัตถุระบุข้อมูลจำเพาะ (Data Specifications) ของชุดข้อมูล ประกอบด้วยชนิดข้อมูล (Data Type), สิทธิ์การเข้าถึง (Access Modifier) เช่น Private (-) และ Public (+) รวมถึงฟังก์ชันบริการภายในตัวคลาส:

```mermaid
classDiagram
    class User {
        -int id
        -string name
        -string email
        -string password_hash
        -string role
        +register(name, email, password) bool
        +login(email, password) string
        +logout() bool
    }
    class Book {
        -int id
        -string title
        -string author
        -string isbn
        -decimal price
        -int stock_qty
        -string category
        +searchBooks(query) List~Book~
        +addBook(title, author, isbn, price, stock_qty, category) bool
        +updateBookDetails(id, title, author, price, category) bool
        +deleteBook(id) bool
        +updateStock(id, qty) bool
        +checkLowStockLimit(limit) List~Book~
        +isAvailable() bool
    }
    class Cart {
        -int id
        -int user_id
        +addItem(book_id, qty) bool
        +removeItem(book_id) bool
        +updateItemQty(book_id, qty) bool
        +clear() bool
    }
    class Order {
        -int id
        -int user_id
        -int verified_by
        -decimal total_amount
        -string status
        -string slip_image_url
        -string tracking_number
        -timestamp order_date
        -timestamp shipped_at
        +checkout(cart_id) int
        +attachSlip(url) bool
        +verifySlipPayment(staff_id, is_valid) bool
        +shipOrder(tracking_number) bool
    }
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
    class Dashboard {
        -int report_id
        -timestamp generated_at
        +getSalesReport(startDate, endDate) SalesReport
        +getBestSellers(limit) List~Book~
        +getTotalRevenue() decimal
    }

    User "1" --> "1" Cart : Owns
    User "1" --> "0..*" Order : Places
    User "0..1" --> "0..*" Order : Verifies (Staff)
    Cart "1" *--> "0..*" CartItem : Contains
    Book "1" --> "0..*" CartItem : Referenced
    Order "1" *--> "1..*" OrderItem : Comprises
    Book "1" --> "0..*" OrderItem : Sold via
    User "0..*" --> "1" Dashboard : Accesses (Admin)
    Dashboard --> Order : Analyzes
    Dashboard --> Book : Tracks
```

---

## 🔄 3. Sequence Diagram (ลำดับขั้นตอนการตรวจสอบและชำระเงินเชิงลึก)

แผนภาพจำลองปฏิสัมพันธ์ในลักษณะเวลา (Timeline Base) อธิบายกระบวนการสั่งซื้อสินค้า, แนบหลักฐานชำระเงิน, การตรวจสอบอนุมัติโดยพนักงาน และการจัดส่งสินค้า โดยสอดคล้องสัมพันธ์กับ Use Cases (UC4, UC5, UC6, UC7) และการทำงานของคลาสข้อมูล:

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer (ลูกค้า)
    actor Staff as Staff (พนักงาน)
    participant Client as React App (หน้าบ้าน)
    participant AuthMW as Middleware (สิทธิ์)
    participant API as Express.js (หลังบ้าน)
    participant DB as MySQL (ฐานข้อมูล)

    %% Part 1: Order Checkout (UC4)
    rect rgb(240, 249, 255)
        note over Customer, DB: Part 1: Order Checkout (UC4)
        Customer->>Client: คลิกปุ่มชำระเงิน
        activate Client
        Client->>AuthMW: POST /api/orders (Authorization Token)
        activate AuthMW
        AuthMW->>AuthMW: ตรวจสอบความถูกต้อง JWT (UC1)
        alt โทเค็นไม่ผ่าน
            AuthMW-->>Client: HTTP 401 Unauthorized
            Client-->>Customer: แสดงหน้าจอแจ้งเตือนล็อกอิน
        else โทเค็นผ่าน
            AuthMW->>API: ส่งข้อมูลออเดอร์และสิทธิ์ผู้ใช้
            deactivate AuthMW
            activate API
            API->>DB: START TRANSACTION
            activate DB
            DB-->>API: Transaction Started
            API->>DB: SELECT stock_qty FROM books FOR UPDATE (ตรวจสอบสต็อก)
            DB-->>API: คืนค่าจำนวนสต็อกล่าสุด
            alt สต็อกไม่พอ
                API->>DB: ROLLBACK
                DB-->>API: Transaction Rolled Back
                deactivate DB
                API-->>Client: HTTP 400 Bad Request (สินค้าไม่พอ)
                Client-->>Customer: แจ้งเตือนสินค้าไม่เพียงพอ
            else สต็อกพอ
                API->>DB: UPDATE books (หักลบสต็อก)
                activate DB
                DB-->>API: Stock Updated
                API->>DB: INSERT INTO orders (สถานะ = 'pending')
                DB-->>API: คืนค่า order_id
                API->>DB: INSERT INTO order_items (บันทึกข้อมูลรายการ)
                API->>DB: COMMIT
                DB-->>API: Transaction Committed
                deactivate DB
                API-->>Client: HTTP 201 Created (order_id)
                deactivate API
                Client-->>Customer: แสดงหน้าจอให้แนบสลิปเงิน
                deactivate Client
            end
        end
    end

    %% Part 2: Attach Slip (UC5)
    rect rgb(254, 242, 242)
        note over Customer, DB: Part 2: Attach Slip (UC5)
        Customer->>Client: เลือกไฟล์รูปภาพและกดอัปโหลดสลิป
        activate Client
        Client->>API: POST /api/orders/:id/slip (Slip Image File)
        activate API
        API->>DB: UPDATE orders SET slip_image_url = ?, status = 'pending' WHERE id = ?
        activate DB
        DB-->>API: Slip Saved
        deactivate DB
        API-->>Client: HTTP 200 OK
        deactivate API
        Client-->>Customer: แสดงสถานะออเดอร์ 'รอตรวจสอบสลิป'
        deactivate Client
    end

    %% Part 3: Verify Payment Slip (UC6)
    rect rgb(255, 251, 235)
        note over Staff, DB: Part 3: Verify Payment Slip (UC6)
        Staff->>Client: เปิดหน้ารายการสั่งซื้อค้างตรวจสอบ
        activate Client
        Client->>API: GET /api/orders?status=pending (Authorization Token)
        activate API
        API->>DB: SELECT * FROM orders WHERE status = 'pending'
        activate DB
        DB-->>API: คืนค่ารายการออเดอร์ค้างตรวจสอบ
        deactivate DB
        API-->>Client: HTTP 200 OK (แสดงรายการพร้อมรูปภาพสลิป)
        deactivate API
        Client-->>Staff: แสดงผลรายการออเดอร์และรูปภาพสลิปบนบราวเซอร์
        deactivate Client
        
        Staff->>Client: กดปุ่มอนุมัติยอดเงิน (สลิปถูกต้อง)
        activate Client
        Client->>API: PATCH /api/orders/:id/verify (status = 'paid')
        activate API
        API->>DB: UPDATE orders SET status = 'paid', verified_by = ? WHERE id = ?
        activate DB
        DB-->>API: Order Status Updated to 'paid'
        deactivate DB
        API-->>Client: HTTP 200 OK
        deactivate API
        Client-->>Staff: แจ้งเตือนสถานะสำเร็จและอัปเดตหน้าจอ
        deactivate Client
    end

    %% Part 4: Ship Order (UC7)
    rect rgb(240, 253, 244)
        note over Staff, DB: Part 4: Ship Order (UC7)
        Staff->>Client: บันทึกเลขพัสดุและจัดส่งสินค้า
        activate Client
        Client->>API: PATCH /api/orders/:id/ship (tracking_number)
        activate API
        API->>DB: UPDATE orders SET status = 'shipped', tracking_number = ?, shipped_at = NOW() WHERE id = ?
        activate DB
        DB-->>API: Order Status Updated to 'shipped'
        deactivate DB
        API-->>Client: HTTP 200 OK
        deactivate API
        Client-->>Staff: แสดงสถานะการจัดส่งสำเร็จ
        deactivate Client
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
    [*] --> pending : Customer creates order (UC4)
    pending --> paid : Staff verifies slip ✅ (UC6)
    pending --> cancelled : Stock insufficient OR Slip rejected ❌
    paid --> shipped : Staff dispatches parcel (UC7)
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
