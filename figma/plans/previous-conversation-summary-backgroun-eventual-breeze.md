# Plan: Guest Homepage (ไม่ต้องล็อกอิน)

## Context
ปัจจุบัน unauthenticated user เห็นแค่ `LoginPage` เท่านั้น ผู้ใช้ต้องการให้ guest สามารถเข้าดูหน้า homepage ของร้านหนังสือได้โดยไม่ต้องล็อกอิน พร้อม browse หนังสือและดู book detail ได้ แต่เมื่อพยายาม add to cart / checkout จะแสดง prompt ให้ล็อกอิน

## Scope ที่ต้องแก้ (ใน `src/app/App.tsx`)

### 1. เพิ่ม guest page type
```ts
type GPage = "home" | "browse" | "detail";
```
และ state ใน root:
```ts
const [gPage, setGPage] = useState<GPage>("home");
const [gSelectedBook, setGSelectedBook] = useState<Book | null>(null);
```

### 2. เพิ่ม `GuestNavBar` component (~lines 120 area)
- Logo + ชื่อร้าน (Booka)
- ลิงก์ "หน้าแรก" / "หนังสือทั้งหมด"
- ปุ่ม "เข้าสู่ระบบ" → navigate to login

### 3. เพิ่ม `GuestHomePage` component
Reuse layout จาก `HomePage` (lines 169-272) แต่:
- Hero banner + headline
- Featured books section (BOOKS.slice(0,4)) — click → GuestBookDetail
- New Arrivals section (BOOKS.slice(4,8))
- "Add to Cart" button แสดง modal/badge แนะนำให้ล็อกอิน แทนที่จะเพิ่มจริง
- CTA banner กลางหน้า: "เข้าสู่ระบบเพื่อสั่งซื้อ"

### 4. เพิ่ม `GuestBrowsePage` component
Reuse layout จาก `BrowsePage` (lines 322-386):
- Search bar + category filter
- Book grid — click → GuestBookDetail

### 5. เพิ่ม `GuestBookDetailPage` component
Reuse layout จาก `BookDetailPage` (lines 388-480):
- รูป + ข้อมูลหนังสือ
- ปุ่ม "เพิ่มลงตะกร้า" → แสดง login prompt modal แทน
- ปุ่ม "เข้าสู่ระบบเพื่อซื้อ" ชัดเจน

### 6. เพิ่ม `LoginPromptModal` component
- Modal overlay เมื่อ guest พยายาม add to cart
- ข้อความ: "กรุณาเข้าสู่ระบบเพื่อเพิ่มสินค้าลงตะกร้า"
- ปุ่ม "เข้าสู่ระบบ" → setShowGuestMode(false) เพื่อกลับไป LoginPage
- ปุ่ม "ยกเลิก" → ปิด modal

### 7. แก้ root App component (lines 2542-2665)
เพิ่ม state:
```ts
const [showGuestMode, setShowGuestMode] = useState(false);
```

แก้ conditional render:
```
if loggedIn → แสดง role-based pages (เดิม)
else if showGuestMode → แสดง Guest pages (GuestNavBar + GuestHomePage/Browse/Detail)
else → แสดง LoginPage (เพิ่มปุ่ม "เข้าชมร้านก่อน (ไม่ล็อกอิน)" ด้านล่าง)
```

### 8. แก้ `LoginPage` (lines 1232-1370)
เพิ่มปุ่ม "เข้าชมร้านก่อน" ด้านล่าง form → `setShowGuestMode(true)`

### 9. Wireframe mode
เพิ่ม wireframe screen สำหรับ GuestHome ใน wireframe section ด้วย (optional แต่ consistent)

## Critical Files
- `/workspaces/default/code/src/app/App.tsx` — ไฟล์เดียวที่ต้องแก้

## Reuse ที่มีอยู่แล้ว
- `BOOKS` data array (lines 35-87) — ใช้ได้เลย
- `BookCard` หรือ book card pattern จาก `HomePage`
- Hero banner markup จาก `HomePage` (lines 180-213)
- Category pills จาก `HomePage` (lines 216-225)
- Filter/search markup จาก `BrowsePage` (lines 322-386)

## Verification
1. เปิด app → เห็น LoginPage มีปุ่ม "เข้าชมร้านก่อน"
2. กด "เข้าชมร้านก่อน" → เห็น GuestHomePage พร้อม navbar
3. คลิกหนังสือ → ไป GuestBookDetail
4. กด "เพิ่มลงตะกร้า" → เห็น LoginPromptModal
5. กด "หนังสือทั้งหมด" ใน nav → ไป GuestBrowsePage พร้อม filter
6. กด "เข้าสู่ระบบ" ใน nav หรือ modal → กลับไป LoginPage
7. ล็อกอินเป็น customer → เห็นหน้า customer flow ปกติ
