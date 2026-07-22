const fs = require('fs');
const files = ['d:/Myproject/online-bookstore/diagram/workshop4.md', 'd:/Myproject/online-bookstore/diagram/Diagram.md'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Chunk 1
    content = content.replace(
`                rect rgb(240, 249, 255)
                    note over API, DB: เริ่มต้นทำธุรกรรมและดึงจำนวนสต็อกล่าสุด
                    API->>DB: START TRANSACTION
                    activate DB
                    DB-->>API: Transaction Started
                    
                    API->>DB: SELECT stock FROM books FOR UPDATE (ล็อกแถวข้อมูล)
                    DB-->>API: คืนค่าจำนวนสต็อกล่าสุด
                end`,
`                note over API, DB: เริ่มต้นทำธุรกรรมและดึงจำนวนสต็อกล่าสุด
                API->>DB: START TRANSACTION
                activate DB
                DB-->>API: Transaction Started
                
                API->>DB: SELECT stock FROM books FOR UPDATE (ล็อกแถวข้อมูล)
                DB-->>API: คืนค่าจำนวนสต็อกล่าสุด`);

    // Chunk 2
    content = content.replace(
`                    rect rgb(255, 247, 237)
                        note over API, DB: กรณีสต็อกไม่พอ ทำการ Rollback คืนค่าข้อมูล
                        API->>DB: ROLLBACK
                        DB-->>API: Transaction Rolled Back
                        deactivate DB
                        API-->>Client: HTTP 400 Bad Request
                        Client-->>Customer: แจ้งเตือนสินค้าไม่พอ
                    end`,
`                    note over API, DB: กรณีสต็อกไม่พอ ทำการ Rollback คืนค่าข้อมูล
                    API->>DB: ROLLBACK
                    DB-->>API: Transaction Rolled Back
                    deactivate DB
                    API-->>Client: HTTP 400 Bad Request
                    Client-->>Customer: แจ้งเตือนสินค้าไม่พอ`);

    // Chunk 3
    content = content.replace(
`                    rect rgb(240, 253, 244)
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
                    end`,
`                    note over API, DB: บันทึกข้อมูลและยืนยันการทำรายการชำระเงินสำเร็จ
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
                    deactivate DB`);

    fs.writeFileSync(file, content);
    console.log(`Fixed ${file}`);
});
