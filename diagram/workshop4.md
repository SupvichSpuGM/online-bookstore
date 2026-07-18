# 📝 Workshop #4: Theoretical Assessment (8 คะแนน)
> วิชา CSI204 ดิจิทัลแพลตฟอร์มสำหรับพัฒนาซอฟต์แวร์ • โครงงานระบบร้านหนังสือออนไลน์

---

## คำถาม 1: การประยุกต์ใช้เครื่องมือในกระบวนการ SDLC (2 คะแนน)

ในการบริหารและดำเนินงานพัฒนาโครงการกลุ่ม "ระบบร้านหนังสือออนไลน์ (Online Book Store)" ภายใต้กรอบเวลา 4 สัปดาห์ โดยคณะทำงาน 3 คน แบ่งบทบาทตามระดับผู้ใช้งาน ได้แก่ Customer System, Admin System และ Super Admin System ได้คัดเลือกและประยุกต์ใช้เครื่องมือซอฟต์แวร์ดังนี้

### 📌 1. Planning (การวางแผน)
* **เครื่องมือ:** GitHub Projects
* **เหตุผล:** เพื่อให้ทำงานร่วมกับระบบเก็บ Source Code ได้ทันที ทีมงานใช้บอร์ดในรูปแบบ Kanban เพื่อแจกจ่ายตารางงานและติดตามสถานะชิ้นงานของสมาชิกฝั่ง Frontend และ Backend
* **การใช้งานจริง:** การสร้างการ์ดกิจกรรมงาน (Task Cards) เช่น "Implement ตะกร้าสินค้า", "ออกแบบโครงสร้าง Database หนังสือ" และระบุผู้รับผิดชอบพร้อมกำหนด Timeline ชัดเจน

### 📐 2. Analysis & Design
* **เครื่องมือ:** Mermaid.js / Figma
* **เหตุผล:** เพื่อให้นักพัฒนาในทีมสร้างเอกสารข้อกำหนดทางเทคนิค (Specification Documentation) และแบบแปลนสถาปัตยกรรมชุดเดียวกันก่อนเริ่มลงมือเขียนโปรแกรม
* **การใช้งานจริง:** ร่วมกันกำหนดขอบเขตฟังก์ชันผ่าน Use Case Diagram และกำหนด Object-Oriented Schema เพื่อแปลงไปเป็น Database Model บนระบบจัดการฐานข้อมูลหลัก

### 💻 3. Development (การพัฒนา)
* **เครื่องมือ:** Visual Studio Code & Git / GitHub
* **เหตุผล:** เป็นแพลตฟอร์มหลักที่ทีมคุ้นเคย และมี Git เป็นระบบควบคุมเวอร์ชัน (Version Control) เพื่อจัดการประวัติการแก้ไขและป้องกันซอร์สโค้ดเขียนชนทับกัน
* **การใช้งานจริง:** ทุกคนดึงรหัสต้นฉบับจากคลังกลาง แตกกิ่งสายพัฒนา (Feature Branching) เช่น `feature/book-catalog` และส่ง Pull Request เพื่อทำ Code Review ก่อนรวมโค้ด

### 🧪 4. Testing (การทดสอบ)
* **เครื่องมือ:** Postman
* **เหตุผล:** ชิ้นงานระบบร้านหนังสือมีการแลกเปลี่ยนข้อมูลผ่าน HTTP REST API การใช้ Postman ช่วยให้ Tester สามารถตรวจสอบความเสถียรและความถูกต้องของการรับส่ง Data Payload ได้แม่นยำ
* **การใช้งานจริง:** ส่งคำขอจำลอง Request จริงตรวจสอบ API Endpoint เช่น `GET /api/books` เพื่อดูว่าเซิร์ฟเวอร์ส่งคืนข้อมูลหนังสือ ราคา และจำนวนสต็อกถูกต้องตามสเปกหรือไม่

### 🚀 5. Deployment (การนำระบบขึ้นใช้งาน)
* **เครื่องมือ:** Vercel และ Render (แพลตฟอร์มคลาวด์สำหรับเว็บแอปพลิเคชัน)
* **เหตุผล:** รองรับท่อส่งมอบงานอัตโนมัติ (Automated CI/CD Pipelines) เมื่อมีการบันทึกโค้ดขึ้นระบบคลาวด์ แพลตฟอร์มจะทำการ Build และทดสอบความเรียบร้อย แล้วเปิดบริการขึ้นอินเทอร์เน็ตให้ทันทีโดยอัตโนมัติ
* **การใช้งานจริง:** เมื่อซอร์สโค้ดผ่านกระบวนการตรวจสอบและรวมโค้ดเข้าสู่สายหลัก (Branch: main) ระบบจะแปลงสภาพชิ้นงานเวอร์ชันล่าสุดและเปิด URL ให้คณาจารย์และผู้ใช้อื่นเข้าทดสอบระบบได้ทันที

---

## คำถาม 2: การวิเคราะห์และออกแบบระบบ (5 คะแนน)

สถาปัตยกรรมทางวิศวกรรมซอฟต์แวร์ของชิ้นงานระบบร้านหนังสือออนไลน์ ได้รับการสื่อสารผ่านแผนภาพและแบบจำลองโครงสร้างดังต่อไปนี้

### 💡 1. Use Case Diagram

**หน้าที่และความสำคัญ:** แผนภาพที่ใช้สรุปและระบุขอบเขตของระบบ (System Boundary) เพื่อระบุว่ามีผู้ใช้งานกลุ่มใดบ้าง (Actors) และพวกเขาสามารถทำฟังก์ชันงานใดบนแพลตฟอร์มดิจิทัลนี้ได้บ้าง

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

    Customer --- UC_Register
    Customer --- UC_Auth
    Customer --- UC_Search
    Customer --- UC_Cart
    Customer --- UC_Checkout
    Customer --- UC_UploadSlip
    Customer --- UC_OrderHistory
    Customer --- UC_Profile

    Staff --- UC_Auth
    Staff --- UC_VerifySlip
    Staff --- UC_ShipOrder
    Staff --- UC_ManageCatalog

    Admin --- UC_Auth
    Admin --- UC_ManageCatalog
    Admin --- UC_Dashboard
    Admin --- UC_ManageUsers

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

### 💡 2. Class Diagram

**หน้าที่และความสำคัญ:** แผนภาพโครงสร้างเชิงสถิต (Static Diagram) ที่ระบุคุณลักษณะ (Attributes) วิธีการทำงาน (Methods) รวมถึงตรรกะความสัมพันธ์เชื่อมโยงของข้อมูลวัตถุ (Entities Relationship)

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

### 💡 3. Sequence Diagram

**หน้าที่และความสำคัญ:** แผนภาพจำลองตามลำดับกิจกรรมและทิศทางการส่งข้อมูลเมสเซจ (Messages Payload) ระหว่างวัตถุองค์ประกอบต่างๆ ของชิ้นงานตามลำดับเงื่อนไขของเวลา

```mermaid
sequenceDiagram
    autonumber
    actor Customer as Customer (ลูกค้า)
    participant Client as React App (หน้าบ้าน)
    participant AuthMW as Middleware (สิทธิ์)
    participant API as Express.js (หลังบ้าน)
    participant DB as MySQL (ฐานข้อมูล)

    Note over Customer, DB: ① ค้นหาและดูรายละเอียดหนังสือ (UC3)
    Customer->>Client: พิมพ์คำค้นหา / เลือกหมวดหมู่
    Client->>API: GET /api/books?search=...&category=...
    API->>DB: SELECT * FROM books WHERE title LIKE ... OR category = ...
    DB-->>API: คืนค่ารายการหนังสือ
    API-->>Client: HTTP 200 OK (Array of Books)
    Client-->>Customer: แสดงรายการหนังสือ

    Customer->>Client: คลิกเลือกหนังสือเพื่อดูรายละเอียด
    Client->>API: GET /api/books/:id
    API->>DB: SELECT * FROM books WHERE id = ?
    DB-->>API: คืนค่ารายละเอียดหนังสือ (พร้อม stock_qty)
    API-->>Client: HTTP 200 OK (Book Detail Object)
    Client-->>Customer: แสดงหน้ารายละเอียดพร้อมปุ่ม "ใส่ตะกร้า"

    Note over Customer, DB: ② เพิ่มสินค้าลงตะกร้า (UC4)
    Customer->>Client: คลิกปุ่ม "ใส่ตะกร้า"
    Client->>AuthMW: POST /api/cart/items (book_id, quantity) [Auth Header]
    AuthMW->>AuthMW: ตรวจสอบ JWT Token
    alt Token ไม่ถูกต้อง
        AuthMW-->>Client: HTTP 401 Unauthorized
        Client-->>Customer: แจ้งเตือนล็อกอินใหม่
    else Token ถูกต้อง
        AuthMW->>API: ส่ง request พร้อม user_id
        API->>DB: SELECT stock_qty FROM books WHERE id = ?
        DB-->>API: คืนค่าจำนวนสต็อก
        alt สต็อกไม่พอ
            API-->>Client: HTTP 400 Bad Request (Insufficient stock)
            Client-->>Customer: แจ้งเตือนสินค้าในคลังไม่พอ
        else สต็อกเพียงพอ
            API->>DB: INSERT/UPDATE cart_items (cart_id, book_id, quantity)
            DB-->>API: บันทึกสำเร็จ
            API-->>Client: HTTP 200 OK (Updated Cart)
            Client-->>Customer: อัปเดตตัวเลขในตะกร้า
        end
    end

    Note over Customer, DB: ③ สั่งซื้อพร้อม Pessimistic Locking (UC5)
    Customer->>Client: คลิกปุ่มชำระเงิน
    Client->>AuthMW: POST /api/orders [Auth Header]
    AuthMW->>AuthMW: ตรวจสอบ JWT Token
    alt Token ไม่ถูกต้อง
        AuthMW-->>Client: HTTP 401 Unauthorized
        Client-->>Customer: แจ้งเตือนล็อกอินใหม่
    else Token ถูกต้อง
        AuthMW->>API: ส่งข้อมูลออเดอร์และผู้ใช้
        API->>DB: START TRANSACTION
        DB-->>API: Transaction Started
        API->>DB: SELECT stock FROM books FOR UPDATE (ล็อกแถวข้อมูล)
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
            API->>DB: DELETE FROM cart_items WHERE cart_id = ? (ล้างตะกร้า)
            API->>DB: COMMIT
            DB-->>API: Transaction Committed
            API-->>Client: HTTP 201 Created (order_id)
            Client-->>Customer: แสดงออเดอร์สำเร็จ & นำทางไปหน้าแนบสลิป
        end
    end
```

### 💡 4. Wireframe (Low-Fidelity)

**หน้าที่และความสำคัญ:** โครงร่างจัดวางองค์ประกอบหน้าต่างผู้ใช้ระดับต่ำ (Low-fidelity) เพื่อระบุตรรกะตำแหน่งการมองเห็นและโครงสร้างหน้าเว็บก่อนเริ่มเขียน HTML/CSS

```
┌─────────────────────────────────────────────────────────────┐
│  WIREFRAME: หน้าแรกระบบร้านหนังสือออนไลน์                    │
├─────────────────────────────────────────────────────────────┤
│  📚 BOOKSTORE    🔍 ค้นหาหนังสือ...    🛒 ตะกร้า (0) | Login │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────┐  ┌───────────┐  ┌───────────┐               │
│  │  [Cover]  │  │  [Cover]  │  │  [Cover]  │               │
│  │           │  │           │  │           │               │
│  │  หนังสือ A │  │  หนังสือ B │  │  หนังสือ C │               │
│  │  250 บาท  │  │  320 บาท  │  │  190 บาท  │               │
│  │[+ ใส่ตะกร้า]│  │[+ ใส่ตะกร้า]│  │[+ ใส่ตะกร้า]│               │
│  └───────────┘  └───────────┘  └───────────┘               │
└─────────────────────────────────────────────────────────────┘
```

### 💡 5. Prototype (High-Fidelity)

**หน้าที่และความสำคัญ:** แบบจำลองหน้าต่างแอปพลิเคชันที่มีความเสมือนจริงสูง (High-fidelity) มีสีสัน กราฟิก และตอบสนองต่อการทดลองคลิกสลับหน้าจอ (Clickable Flow) เพื่อทำแบบทดสอบ UX Testing ก่อนสร้างชิ้นงานสมบูรณ์

> **Figma Interactive Prototype:** [คลิกเพื่อเปิดทดลองใช้งานบน Figma](https://www.figma.com/make/sfQBdsZm0zQ2XW9xZZv85Y/E-Commerce-Bookstore-Wireframe?t=5LqLUcmW0jqEUlre-1)

ความแตกต่างจาก Wireframe:
* มีการใช้สีสัน Gradient และ Typography ตาม Design System จริง
* แสดงชื่อหนังสือ ราคา และปุ่มสั่งซื้อด้วย Style ของ Production
* รองรับ Clickable Flow ระหว่างหน้าจอต่างๆ ของระบบ
* ใช้สำหรับการทดสอบ UX และรับ Feedback จากผู้ใช้จริงก่อนเขียนโค้ด

---

## คำถาม 3: การวิเคราะห์ปัญหาและการทดสอบระบบ (1 คะแนน)

> **กรณีสมมติ:** ในช่วงแคมเปญส่งเสริมการขายลดราคาพิเศษครั้งใหญ่ (Flash Sale) มีปริมาณลูกค้าหลั่งไหลเข้าสู่เว็บไซต์เป็นจำนวนมาก ส่งผลเกิดปัญหาคอขวดระบบล่าช้า (API Response Latency) และเกิดการปฏิเสธการให้บริการในที่สุด

### 🛠️ 1. เครื่องมือตรวจสอบวิเคราะห์และหาสาเหตุของปัญหา

* **Chrome DevTools (Network Panel):** ใช้ตรวจสอบและจำแนกเวลาแฝงค่าน้ำหนักฝั่งไคลเอนต์ (Client-Side Latency) โดยจับตาดูเวลาการรอคอยข้อมูลตอบกลับตัวแรก (Time to First Byte - TTFB) เพื่อหา Endpoint ที่ช้าที่สุด
* **Morgan หรือ Winston Middleware Library:** เครื่องมือตัวบันทึกข้อมูลฝั่งเซิร์ฟเวอร์ (Server Logging) เพื่อสแกนดูประวัติระยะเวลาการ Query ข้อมูลในเลเยอร์ฐานข้อมูล
* **Postman (Load Testing Tools):** ใช้จัดทำสภาพแวดล้อมจำลองการส่งคำขอปริมาณมหาศาลพร้อมๆ กัน (Virtual Users Load) เพื่อตรวจสอบหาจุดวิกฤตที่รับไม่ไหว (System Break-point)

### 🔄 2. ขั้นตอนการดำเนินงานแก้ไขปัญหา

1. **ระบุจุดคอขวด (Identify Bottleneck):** เปิด Network Tab จำแนกเส้นทางที่มีความล่าช้าสูง เช่น `POST /api/orders` สังเกตสเตตัสข้อผิดพลาดหากเกิดระบบทำงานเกินกำลังจนขึ้น 504 Gateway Timeout
2. **วิเคราะห์บันทึกฝั่งฐานข้อมูล (Database Trace):** เช็กประวัติ Logs ดูว่ากระบวนการสั่งซื้อค้างอยู่ที่ขั้นตอนใด หากพบว่าช้าตรงส่วนการค้นหาหนังสือ แสดงว่าระบบฐานข้อมูลกำลังเจอปัญหาไร้ดัชนีนำทาง
3. **จำลองสถานการณ์เพื่อตรวจสอบ (Replicate & Confirm):** ใช้เครื่องมือจำลองโหลดส่งยอดคำขอในอัตราที่เพิ่มขึ้น เพื่อประเมินจำนวน Thread หรือพอร์ตเชื่อมต่อที่ค้างคา (Database Connection Leak)

### 💡 3. แนวทางการแก้ไขปัญหาทางวิศวกรรมเบื้องต้น

* **จัดทำ Database Indexing:** สร้างโครงสร้างดัชนี (Index) บนตารางข้อมูลร้านหนังสือ โดยเฉพาะคอลัมน์ที่ถูกเรียกค้นหาซ้ำๆ เช่น `book_id` หรือประเภทหมวดหมู่หนังสือ ช่วยให้ฐานข้อมูลสืบค้นได้เร็วขึ้นโดยไม่ต้องแสกนอ่านไฟล์ตารางทั้งหมด
* **ประยุกต์ใช้ระบบแคชความเร็วสูง (In-Memory Caching):** นำข้อมูลหนังสือที่ไม่ค่อยเปลี่ยนแปลง (เช่น รายชื่อหนังสือแนะนำ หน้าแคตตาล็อก) ไปเก็บไว้บนระบบ Memory Cache ความเร็วสูง เพื่อให้หน้าบ้านสามารถดึงผลลัพธ์ได้ทันที ลดภาระที่ฐานข้อมูลหลัก
* **การจัดการ Connection Pooling:** ปรับแต่งโครงสร้าง Pool จำนวนการต่อท่อเชื่อมต่อข้อมูลให้เหมาะสมยืดหยุ่น เพื่อจำกัดคิวและรองรับคำสั่งจากผู้ใช้จำนวนมากไม่ให้ไปยืนรอค้างจนหน่วยความจำ Server ทำงานหนักเกินพิกัด
