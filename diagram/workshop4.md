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
    Customer["👤 ลูกค้า"]
    Staff["🧑‍💼 พนักงาน"]
    Admin["⚙️ ผู้ดูแลระบบ"]

    subgraph System ["📦 ระบบร้านหนังสือออนไลน์"]
        subgraph G1 ["🔐 การสมัครและจัดการบัญชีผู้ใช้"]
            UC_Register(["สมัครสมาชิกใหม่"])
            UC_Auth(["เข้าสู่ระบบ"])
            UC_Profile(["แก้ไขโปรไฟล์และที่อยู่จัดส่ง"])
        end
        subgraph G2 ["🛒 การค้นหาและสั่งซื้อหนังสือ"]
            UC_Search(["ค้นหาและดูรายละเอียดหนังสือ"])
            UC_Cart(["เพิ่มหรือลบสินค้าในตะกร้า"])
            UC_Checkout(["กดยืนยันสั่งซื้อ ⚠️ ต้องล็อกอินก่อน"])
            UC_UploadSlip(["แนบสลิปโอนเงิน ✅ ทำต่อจากการสั่งซื้อ"])
            UC_OrderHistory(["ติดตามพัสดุและประวัติออเดอร์ ⚠️ ต้องล็อกอินก่อน"])
        end
        subgraph G3 ["🧑‍💼 งานพนักงานหลังบ้าน"]
            UC_VerifySlip(["ตรวจสอบและอนุมัติสลิปโอนเงิน ⚠️ ต้องล็อกอินก่อน"])
            UC_ShipOrder(["บันทึกการจัดส่งและเลขพัสดุ ⚠️ ต้องล็อกอินก่อน"])
            UC_ManageCatalog(["เพิ่ม/แก้ไข/ลบหนังสือในคลัง ⚠️ ต้องล็อกอินก่อน"])
            UC_StockAlert(["แจ้งเตือนอัตโนมัติเมื่อสินค้าใกล้หมด ✅ เชื่อมกับการจัดการคลัง"])
        end
        subgraph G4 ["📊 การวิเคราะห์และจัดการระบบ"]
            UC_Dashboard(["ดูรายงานยอดขายและสถิติ ⚠️ ต้องล็อกอินก่อน"])
            UC_ManageUsers(["จัดการบัญชีพนักงานและสิทธิ์ ⚠️ ต้องล็อกอินก่อน"])
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

### 🔐 3.1 UC1 & UC2: การสมัครสมาชิกและการเข้าสู่ระบบ (Register & Login Flow)
กระบวนการ **UC1: สมัครสมาชิกใหม่ (Register)** และ **UC2: เข้าสู่ระบบ (Login)** เพื่อรับสิทธิ์การใช้งานผ่าน JWT Token:

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

### 👤 3.2 UC3: การแก้ไขโปรไฟล์และที่อยู่จัดส่ง (Edit Profile & Address Flow)
ขั้นตอน **UC3: แก้ไขโปรไฟล์และที่อยู่จัดส่ง** ที่ลูกค้าสามารถอัปเดตข้อมูลส่วนตัวและจัดการที่อยู่จัดส่งได้:

```mermaid
sequenceDiagram
            autonumber
            actor Customer as Customer (ลูกค้า)
            participant Client as React App (หน้าบ้าน)
            participant AuthMW as Middleware (สิทธิ์)
            participant API as Express.js (หลังบ้าน)
            participant DB as MySQL (ฐานข้อมูล)

            Customer->>Client: เข้าหน้าโปรไฟล์การใช้งาน (My Profile)
            Client->>AuthMW: GET /api/users/profile [Authorization Header]
            AuthMW->>AuthMW: ตรวจสอบ JWT Token
            alt Token ไม่ถูกต้อง
                AuthMW-->>Client: HTTP 401 Unauthorized
                Client-->>Customer: แสดงหน้าล็อกอิน
            else Token ถูกต้อง
                AuthMW->>API: ส่ง user_id ที่ถอดรหัสได้
                API->>DB: SELECT id, name, email, phone FROM users WHERE id = ?
                DB-->>API: คืนค่าข้อมูลโปรไฟล์และรายการที่อยู่
                API->>DB: SELECT * FROM addresses WHERE user_id = ?
                DB-->>API: คืนค่ารายการที่อยู่ทั้งหมด
                API-->>Client: HTTP 200 OK (Profile + Addresses Array)
                Client-->>Customer: แสดงหน้าโปรไฟล์และรายการที่อยู่
            end

            opt แก้ไขข้อมูลส่วนตัว (Edit Profile)
                Customer->>Client: กรอกชื่อใหม่ / เบอร์โทรศัพท์
                Client->>AuthMW: PUT /api/users/profile (name, phone) [Auth Header]
                AuthMW->>API: ส่ง request พร้อม user_id
                API->>DB: UPDATE users SET name = ?, phone = ? WHERE id = ?
                DB-->>API: ยืนยันบันทึกสำเร็จ
                API-->>Client: HTTP 200 OK (Profile Updated)
                Client-->>Customer: แสดงผลสำเร็จการอัปเดตโปรไฟล์
            end

            opt เพิ่มที่อยู่ใหม่ (Add Address)
                Customer->>Client: กรอกชื่อผู้รับ, เบอร์โทร, ที่อยู่, จังหวัด, รหัสไปรษณีย์
                Client->>AuthMW: POST /api/addresses (address detail) [Auth Header]
                AuthMW->>API: ส่ง request พร้อม user_id
                API->>DB: INSERT INTO addresses (user_id, recipient_name, phone, address_line, province, postal_code)
                DB-->>API: คืนค่า address_id ใหม่
                API-->>Client: HTTP 201 Created (New Address)
                Client-->>Customer: แสดงที่อยู่ใหม่ในรายการ
            end
```

### 🛒 3.3 UC4 & UC5: การค้นหาหนังสือและจัดการตะกร้าสินค้า (Search & Cart Flow)
ขั้นตอน **UC4: ค้นหาและดูรายละเอียดหนังสือ** และ **UC5: เพิ่มหรือลบสินค้าในตะกร้า** พร้อมตรวจสอบ Auth และจำนวนคลังสินค้า:

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

### 💳 3.4 UC6: การยืนยันสั่งซื้อหนังสือพร้อม Pessimistic Locking (Checkout Flow)
ขั้นตอน **UC6: กดยืนยันสั่งซื้อ** ที่มีการล็อคข้อมูลจำนวนสต็อกในตารางเพื่อป้องกันสภาวะชิงข้อมูล (Race Condition):

```mermaid
sequenceDiagram
            autonumber
            actor Customer as Customer (ลูกค้า)
            participant Client as React App (หน้าบ้าน)
            participant AuthMW as Middleware (สิทธิ์)
            participant API as Express.js (หลังบ้าน)
            participant DB as MySQL (ฐานข้อมูล)

            Customer->>Client: คลิกปุ่มชำระเงิน
            activate Client
            Client->>AuthMW: POST /api/orders (Authorization)
            activate AuthMW
            
            AuthMW->>AuthMW: ตรวจสอบความถูกต้อง JWT
            
            alt โทเค็นไม่ผ่าน (Token Invalid)
                AuthMW-->>Client: HTTP 401 Unauthorized
                Client-->>Customer: แสดงแจ้งเตือนล็อกอินใหม่
            else โทเค็นผ่าน (Token Valid)
                AuthMW->>API: ส่งข้อมูลออเดอร์และผู้ใช้
                deactivate AuthMW
                activate API
                
                rect rgb(240, 249, 255)
                    note over API, DB: เริ่มต้นทำธุรกรรมและดึงจำนวนสต็อกล่าสุด
                    API->>DB: START TRANSACTION
                    activate DB
                    DB-->>API: Transaction Started
                    
                    API->>DB: SELECT stock FROM books FOR UPDATE (ล็อกแถวข้อมูล)
                    DB-->>API: คืนค่าจำนวนสต็อกล่าสุด
                end
                
                alt สต็อกไม่พอ (Stock < Qty)
                    rect rgb(255, 247, 237)
                        note over API, DB: กรณีสต็อกไม่พอ ทำการ Rollback คืนค่าข้อมูล
                        API->>DB: ROLLBACK
                        DB-->>API: Transaction Rolled Back
                        deactivate DB
                        API-->>Client: HTTP 400 Bad Request
                        Client-->>Customer: แจ้งเตือนสินค้าไม่พอ
                    end
                else สต็อกพอ (Stock >= Qty)
                    rect rgb(240, 253, 244)
                        note over API, DB: บันทึกข้อมูลและยืนยันการทำรายการชำระเงินสำเร็จ
                        API->>DB: UPDATE books SET stock_qty = stock_qty - ? (หักลบสต็อก)
                        activate DB
                        DB-->>API: Stock Updated
                        
                        API->>DB: INSERT INTO orders (user_id, address_id, total_amount, status='pending')
                        DB-->>API: คืนค่า order_id ใหม่
                        
                        API->>DB: INSERT INTO order_items (order_id, book_id, quantity, price_per_unit)
                        DB-->>API: Items Saved

                        API->>DB: DELETE FROM cart_items WHERE cart_id = ? (ล้างตะกร้าสินค้า)
                        DB-->>API: Cart Cleared
                        
                        API->>DB: COMMIT
                        DB-->>API: Transaction Committed
                        deactivate DB
                    end
                    
                    API-->>Client: HTTP 201 Created (order_id)
                    deactivate API
                    Client-->>Customer: แสดงจอออเดอร์สำเร็จ & นำทางไปหน้าแนบสลิปเงิน
                    deactivate Client
                end
            end
```

### 📄 3.5 UC7: การแนบหลักฐานการชำระเงิน (Upload Payment Slip Flow)
ขั้นตอน **UC7: แนบสลิปโอนเงิน** ที่ลูกค้าอัปโหลดรูปภาพสลิปเงินเพื่อผูกกับใบสั่งซื้อค้างจ่าย:

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
            activate Client
            Client->>AuthMW: POST /api/orders/:id/slip (Multipart Image File) [Auth Header]
            activate AuthMW
            AuthMW->>AuthMW: ตรวจสอบ JWT Token และสิทธิ์เจ้าของ order
            alt Token ไม่ถูกต้องหรือไม่ใช่เจ้าของ order
                AuthMW-->>Client: HTTP 401/403 Unauthorized / Forbidden
                Client-->>Customer: แจ้งเตือนไม่มีสิทธิ์อัปโหลด
            else Token ถูกต้องและเป็นเจ้าของ order
                AuthMW->>API: ส่ง request พร้อม user_id
                deactivate AuthMW
                activate API
                API->>DB: SELECT status FROM orders WHERE id = ? AND user_id = ?
                activate DB
                DB-->>API: คืนค่าสถานะ order ปัจจุบัน
                deactivate DB
                alt order ไม่อยู่ในสถานะ 'pending'
                    API-->>Client: HTTP 400 Bad Request (Order not in pending state)
                    Client-->>Customer: แจ้งเตือนไม่สามารถแนบสลิปได้
                else order สถานะ 'pending'
                    API->>Storage: อัปโหลดรูปภาพสลิปไปยัง Cloud Storage (เช่น S3/Cloudinary)
                    activate Storage
                    Storage-->>API: คืนค่า URL ของรูปภาพสลิปโอนเงิน (slip_image_url)
                    deactivate Storage
                    API->>DB: UPDATE orders SET slip_image_url = ? WHERE id = ?
                    activate DB
                    DB-->>API: บันทึกและยืนยันการเปลี่ยนแปลงข้อมูล
                    deactivate DB
                    API-->>Client: HTTP 200 OK (Slip Uploaded)
                    deactivate API
                    Client-->>Customer: แสดงแจ้งเตือนอัปโหลดสลิปสำเร็จ & สเตตัสเปลี่ยนเป็น "รอตรวจสอบ"
                end
            end
            deactivate Client
```

### 📦 3.6 UC8: ติดตามพัสดุและประวัติออเดอร์ (Order History & Tracking Flow)
ขั้นตอน **UC8: ติดตามพัสดุและประวัติออเดอร์** ที่ลูกค้าสามารถดูสถานะและรายละเอียดใบสั่งซื้อทั้งหมด:

```mermaid
sequenceDiagram
            autonumber
            actor Customer as Customer (ลูกค้า)
            participant Client as React App (หน้าบ้าน)
            participant AuthMW as Middleware (สิทธิ์)
            participant API as Express.js (หลังบ้าน)
            participant DB as MySQL (ฐานข้อมูล)

            Customer->>Client: คลิกเมนู "ประวัติการสั่งซื้อของฉัน"
            activate Client
            Client->>AuthMW: GET /api/orders [Authorization Header]
            activate AuthMW
            AuthMW->>AuthMW: ตรวจสอบ JWT Token
            alt Token ไม่ถูกต้อง
                AuthMW-->>Client: HTTP 401 Unauthorized
                Client-->>Customer: แสดงหน้าล็อกอิน
            else Token ถูกต้อง
                AuthMW->>API: ส่ง user_id ที่ถอดรหัสได้
                deactivate AuthMW
                activate API
                API->>DB: SELECT o.id, o.status, o.total_amount, o.tracking_number, o.order_date FROM orders o WHERE o.user_id = ? ORDER BY o.order_date DESC
                activate DB
                DB-->>API: คืนค่ารายการออเดอร์ทั้งหมดของลูกค้า
                deactivate DB
                API-->>Client: HTTP 200 OK (Orders Array)
                deactivate API
                Client-->>Customer: แสดงรายการออเดอร์ที่ผ่านมา พร้อมสถานะและเลขพัสดุ
            end

            opt ดูรายละเอียดออเดอร์ (View Order Detail)
                Customer->>Client: คลิกออเดอร์เพื่อดูรายละเอียด
                Client->>AuthMW: GET /api/orders/:id [Auth Header]
                AuthMW->>API: ส่ง request พร้อม user_id
                activate API
                API->>DB: SELECT o.*, oi.book_id, oi.quantity, oi.price_per_unit, b.title FROM orders o JOIN order_items oi ON oi.order_id = o.id JOIN books b ON b.id = oi.book_id WHERE o.id = ? AND o.user_id = ?
                activate DB
                DB-->>API: คืนค่ารายละเอียดออเดอร์พร้อมสินค้าและเลขพัสดุ
                deactivate DB
                API-->>Client: HTTP 200 OK (Order Detail Object)
                deactivate API
                Client-->>Customer: แสดงสถานะออเดอร์และเลขติดตามพัสดุ
            end
            deactivate Client
```

### 📦 3.7 UC9 & UC10: การตรวจสอบสลิปและการบันทึกจัดส่ง (Verify Slip & Ship Order Flow)
ขั้นตอน **UC9: ตรวจสอบและอนุมัติสลิปโอนเงิน** โดยพนักงาน และ **UC10: บันทึกการจัดส่งและเลขพัสดุ** พร้อม Tracking Number:

```mermaid
sequenceDiagram
            autonumber
            actor Staff as Staff (พนักงานคลังสินค้า)
            participant Client as React App (หน้าบ้าน)
            participant AuthMW as Middleware (สิทธิ์)
            participant API as Express.js (หลังบ้าน)
            participant DB as MySQL (ฐานข้อมูล)

            Staff->>Client: เปิดหน้ารายการคำสั่งซื้อค้างตรวจสอบ (Pending Orders)
            activate Client
            Client->>AuthMW: GET /api/orders/pending [Auth Header]
            activate AuthMW
            AuthMW->>AuthMW: ตรวจสอบ JWT Token และ role = 'staff' หรือ 'admin'
            alt Token ไม่ถูกต้องหรือไม่มีสิทธิ์
                AuthMW-->>Client: HTTP 403 Forbidden
                Client-->>Staff: แสดงหน้าปฏิเสธสิทธิ์
            else ผ่านการตรวจสอบ
                AuthMW->>API: ส่ง request พร้อม role
                deactivate AuthMW
                activate API
                API->>DB: SELECT o.*, u.name, o.slip_image_url FROM orders o JOIN users u ON o.user_id = u.id WHERE o.status = 'pending'
                activate DB
                DB-->>API: คืนค่ารายการคำสั่งซื้อและลิงก์รูปสลิป
                deactivate DB
                API-->>Client: HTTP 200 OK (Orders Array)
                deactivate API
                Client-->>Staff: แสดงรูปภาพสลิปเปรียบเทียบกับยอดเงินออเดอร์
            end

            alt ข้อมูลสลิปถูกต้องยอดเงินครบ
                Staff->>Client: คลิกอนุมัติ "ยืนยันยอดเงินสำเร็จ"
                Client->>AuthMW: PUT /api/orders/:id/approve [Auth Header]
                activate AuthMW
                AuthMW->>API: ส่ง request พร้อม staff_id
                deactivate AuthMW
                activate API
                API->>DB: UPDATE orders SET status = 'paid', verified_by = ? WHERE id = ?
                activate DB
                DB-->>API: ยืนยันปรับปรุงแถวข้อมูลสำเร็จ
                deactivate DB
                API-->>Client: HTTP 200 OK (Payment Verified)
                deactivate API
                Client-->>Staff: อัปเดตสเตตัสออเดอร์เป็น "Paid (ชำระเงินแล้ว)" บนหน้าจอ
            else สลิปปลอมหรือยอดเงินไม่ตรง
                Staff->>Client: คลิกปฏิเสธรายการพร้อมระบุเหตุผล
                Client->>AuthMW: PUT /api/orders/:id/reject (reason) [Auth Header]
                activate AuthMW
                AuthMW->>API: ส่ง request พร้อม staff_id
                deactivate AuthMW
                activate API
                API->>DB: SELECT oi.book_id, oi.quantity FROM order_items WHERE order_id = ?
                activate DB
                DB-->>API: คืนค่ารายการสินค้าในออเดอร์
                deactivate DB
                API->>DB: UPDATE books SET stock_qty = stock_qty + ? WHERE id = ? (คืนสต็อก)
                activate DB
                DB-->>API: Stock Restored
                deactivate DB
                API->>DB: UPDATE orders SET status = 'cancelled' WHERE id = ?
                activate DB
                DB-->>API: ยืนยันคืนสต็อกและยกเลิกคำสั่งซื้อสำเร็จ
                deactivate DB
                API-->>Client: HTTP 200 OK (Order Cancelled)
                deactivate API
                Client-->>Staff: อัปเดตสถานะออเดอร์บนหน้าจอเป็น "Cancelled"
            end

            opt ขั้นตอนการจัดส่งสินค้า (UC10)
                Staff->>Client: กรอกเลขพัสดุ (Tracking Number) สำหรับออเดอร์สเตตัส 'paid'
                Client->>AuthMW: PUT /api/orders/:id/ship (tracking_number) [Auth Header]
                activate AuthMW
                AuthMW->>API: ส่ง request ผ่าน Middleware
                deactivate AuthMW
                activate API
                API->>DB: UPDATE orders SET status = 'shipped', tracking_number = ?, shipped_at = NOW() WHERE id = ?
                activate DB
                DB-->>API: ยืนยันบันทึกข้อมูลเรียบร้อย
                deactivate DB
                API-->>Client: HTTP 200 OK (Order Shipped)
                deactivate API
                Client-->>Staff: แสดงสถานะการจัดส่งสำเร็จพร้อมเลขพัสดุ
                deactivate Client
            end
```

### ⚙️ 3.8 UC11 & UC12: การบริหารคลังสินค้าและแจ้งเตือนสต็อกต่ำ (Manage Catalog & Stock Alert Flow)
ขั้นตอน **UC11: เพิ่ม/แก้ไข/ลบหนังสือในคลัง** โดยพนักงาน/แอดมิน และ **UC12: แจ้งเตือนอัตโนมัติเมื่อสินค้าใกล้หมด**:

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
                activate Client
                Client->>AuthMW: POST /api/books (book data) [Auth Header]
                activate AuthMW
                AuthMW->>AuthMW: ตรวจสอบ JWT Token และ role = 'staff' หรือ 'admin'
                alt Token ไม่ถูกต้องหรือไม่มีสิทธิ์
                    AuthMW-->>Client: HTTP 403 Forbidden
                    Client-->>Staff: แสดงหน้าปฏิเสธสิทธิ์
                else ผ่านการตรวจสอบ
                    AuthMW->>API: ส่ง request พร้อม role
                    deactivate AuthMW
                    activate API
                    API->>DB: SELECT id FROM books WHERE isbn = ?
                    activate DB
                    DB-->>API: ตรวจสอบ ISBN ซ้ำ
                    deactivate DB
                    alt ISBN ซ้ำกับหนังสือที่มีอยู่
                        API-->>Client: HTTP 409 Conflict (ISBN already exists)
                        Client-->>Staff: แจ้งเตือน ISBN ซ้ำ
                    else ISBN ไม่ซ้ำ
                        API->>DB: INSERT INTO books (title, author, isbn, price, stock_qty, category)
                        activate DB
                        DB-->>API: คืนค่า book_id ใหม่
                        deactivate DB
                        API-->>Client: HTTP 201 Created (New Book)
                        deactivate API
                        Client-->>Staff: แสดงผลหนังสือใหม่ในรายการคลังสินค้า
                    end
                end
                deactivate Client
            end

            opt แก้ไขรายละเอียด/จำนวนสต็อกหนังสือ (Edit Book)
                Staff->>Client: กรอกข้อมูลปรับเพิ่ม/แก้ไขรายละเอียดหนังสือในสต็อก
                activate Client
                Client->>AuthMW: PUT /api/books/:id (title, price, stock_qty) [Auth Header]
                activate AuthMW
                AuthMW->>AuthMW: ตรวจสอบ JWT Token และ role
                AuthMW->>API: ส่ง request ผ่าน Middleware
                deactivate AuthMW
                activate API
                API->>DB: UPDATE books SET stock_qty = ?, price = ?, title = ? WHERE id = ?
                activate DB
                DB-->>API: อัปเดตแถวสินค้าในฐานข้อมูลสำเร็จ
                deactivate DB
                API->>DB: SELECT stock_qty, title FROM books WHERE id = ?
                activate DB
                DB-->>API: คืนค่าจำนวนสต็อกคงเหลือปัจจุบัน
                deactivate DB
                alt สต็อกต่ำกว่าเกณฑ์ความปลอดภัย (stock_qty <= 5)
                    API->>Discord: ส่ง Webhook/Notification แจ้งเตือนระบบ "สินค้าสต็อกต่ำ!"
                    Discord-->>Staff: แสดงข้อความแจ้งเตือน "หนังสือ [Title] เหลือในคลังเพียง [Qty] เล่ม!"
                end
                API-->>Client: HTTP 200 OK (Book Updated Successfully)
                deactivate API
                Client-->>Staff: แสดงผลข้อมูลคลังหนังสือเวอร์ชันอัปเดตเรียบร้อย
                deactivate Client
            end

            opt ลบหนังสือออกจากคลัง (Delete Book)
                Staff->>Client: คลิกปุ่มลบรายการหนังสือ
                activate Client
                Client->>AuthMW: DELETE /api/books/:id [Auth Header]
                activate AuthMW
                AuthMW->>API: ตรวจสอบสิทธิ์และส่ง request
                deactivate AuthMW
                activate API
                API->>DB: DELETE FROM books WHERE id = ?
                activate DB
                DB-->>API: ยืนยันลบข้อมูลสำเร็จ
                deactivate DB
                API-->>Client: HTTP 200 OK (Book Deleted)
                deactivate API
                Client-->>Staff: ลบรายการหนังสือออกจากหน้าจอคลังสินค้า
                deactivate Client
            end
```

### 📊 3.9 UC13 & UC14: รายงานสรุปยอดขายและจัดการผู้ใช้สำหรับผู้ดูแลระบบ (Dashboard & User Management Flow)
ขั้นตอน **UC13: ดูรายงานยอดขายและสถิติ** และ **UC14: จัดการบัญชีพนักงานและสิทธิ์** สำหรับผู้ดูแลระบบ:

```mermaid
sequenceDiagram
            autonumber
            actor Admin as Admin (ผู้ดูแลระบบ)
            participant Client as React App (หน้าบ้าน)
            participant AuthMW as Middleware (สิทธิ์)
            participant API as Express.js (หลังบ้าน)
            participant DB as MySQL (ฐานข้อมูล)

            Admin->>Client: คลิกหน้าเมนู "แผงสรุปรายงาน (Dashboard)"
            activate Client
            Client->>AuthMW: GET /api/reports/dashboard [Auth Header]
            activate AuthMW
            AuthMW->>AuthMW: ตรวจสอบ JWT Token และ role = 'admin'
            alt Token ไม่ถูกต้องหรือไม่ใช่ Admin
                AuthMW-->>Client: HTTP 403 Forbidden
                Client-->>Admin: แสดงหน้าปฏิเสธสิทธิ์
            else ผ่านการตรวจสอบ Admin
                AuthMW->>API: ส่ง request พร้อม role
                deactivate AuthMW
                activate API
                API->>DB: SELECT SUM(total_amount), COUNT(id) FROM orders WHERE status IN ('paid','shipped')
                activate DB
                DB-->>API: คืนค่ารายรับสะสมและจำนวนออเดอร์ทั้งหมด
                deactivate DB
                API->>DB: SELECT oi.book_id, b.title, SUM(oi.quantity) as total_sold FROM order_items oi JOIN books b ON oi.book_id = b.id GROUP BY oi.book_id ORDER BY total_sold DESC LIMIT 5
                activate DB
                DB-->>API: คืนค่ารายชื่อ 5 หนังสือยอดนิยม
                deactivate DB
                API->>DB: SELECT DATE(order_date), SUM(total_amount) FROM orders WHERE order_date >= DATE_SUB(NOW(), INTERVAL 7 DAY) GROUP BY DATE(order_date)
                activate DB
                DB-->>API: คืนค่าข้อมูลกราฟยอดขายรายวัน
                deactivate DB
                API->>DB: SELECT COUNT(id) as total_users FROM users WHERE role = 'customer'
                activate DB
                DB-->>API: คืนค่าจำนวนสมาชิกทั้งหมด
                deactivate DB
                API-->>Client: HTTP 200 OK (JSON Payload ครบทุก Metric)
                deactivate API
                Client->>Client: นำข้อมูลไปเรนเดอร์ในรูปแบบ Chart & Metrics
                Client-->>Admin: แสดงผล BI Dashboard สวยงามบนหน้าจอแอดมิน
            end
            deactivate Client
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
