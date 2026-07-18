// ─── Types ────────────────────────────────────────────────────────────────────
export type Role = "customer" | "staff" | "admin";

export interface UserAccount {
  name: string;
  email: string;
  role: Role;
  phone: string;
  address: string;
  joined: string;
  avatar: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  originalPrice: number;
  category: string;
  rating: number;
  reviews: number;
  stock: number;
  imgId: string;
  isbn: string;
  description: string;
}

export interface CartItem {
  book: Book;
  qty: number;
}

export interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: "pending" | "payment_review" | "confirmed" | "shipping" | "delivered" | "cancelled";
  items: number;
  address: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
export const BOOKS: Book[] = [
  { id: 1, title: "ปีศาจ", author: "เสนีย์ เสาวพงศ์", price: 285, originalPrice: 320, category: "วรรณกรรมไทย", rating: 4.8, reviews: 234, stock: 45, imgId: "photo-1512820790803-83ca734da794", isbn: "978-616-7904-01-2", description: "นวนิยายอมตะที่สะท้อนสังคมไทยในยุคเปลี่ยนผ่าน เรื่องราวความรักและชนชั้นที่ข้ามพ้นกาลเวลา" },
  { id: 2, title: "คำพิพากษา", author: "ชาติ กอบจิตติ", price: 195, originalPrice: 220, category: "วรรณกรรมไทย", rating: 4.9, reviews: 412, stock: 23, imgId: "photo-1481627834876-b7833e8f5570", isbn: "978-616-7904-02-9", description: "ผลงานซีไรต์อันเลื่องชื่อ บอกเล่าเรื่องราวของฟักซึ่งตกอยู่ใต้อิทธิพลของสังคมและศีลธรรม" },
  { id: 3, title: "Atomic Habits", author: "James Clear", price: 325, originalPrice: 380, category: "Self-Help", rating: 4.7, reviews: 891, stock: 78, imgId: "photo-1544947950-fa07a98d237f", isbn: "978-0-735-21129-4", description: "An easy and proven way to build good habits and break bad ones." },
  { id: 4, title: "Sapiens", author: "Yuval Noah Harari", price: 445, originalPrice: 520, category: "ประวัติศาสตร์", rating: 4.8, reviews: 1203, stock: 12, imgId: "photo-1495446815901-a7297e633e8d", isbn: "978-0-062-31609-7", description: "A brief history of humankind." },
  { id: 5, title: "สี่แผ่นดิน", author: "ม.ร.ว.คึกฤทธิ์ ปราโมช", price: 350, originalPrice: 400, category: "วรรณกรรมไทย", rating: 4.9, reviews: 567, stock: 8, imgId: "photo-1507003211169-0a1dd7228f2d", isbn: "978-616-7904-03-6", description: "มหากาพย์ชีวิตของ 'แม่พลอย' ผ่านสี่รัชกาล" },
  { id: 6, title: "The Alchemist", author: "Paulo Coelho", price: 265, originalPrice: 300, category: "Fiction", rating: 4.6, reviews: 756, stock: 34, imgId: "photo-1509266272358-7701da638078", isbn: "978-0-06-231500-7", description: "A novel about following your dream." },
  { id: 7, title: "ข้างหลังภาพ", author: "ศรีบูรพา", price: 180, originalPrice: 200, category: "วรรณกรรมไทย", rating: 4.7, reviews: 389, stock: 56, imgId: "photo-1474932430478-367dbb6832c1", isbn: "978-616-7904-04-3", description: "นวนิยายรักอมตะที่ยืนนานกว่าทศวรรษ" },
  { id: 8, title: "Zero to One", author: "Peter Thiel", price: 355, originalPrice: 420, category: "ธุรกิจ", rating: 4.5, reviews: 445, stock: 29, imgId: "photo-1543002588-bfa74002ed7e", isbn: "978-0-804-13929-8", description: "Notes on startups, or how to build the future." },
  { id: 9, title: "ดอกส้มสีทอง", author: "ทมยันตี", price: 210, originalPrice: 240, category: "วรรณกรรมไทย", rating: 4.6, reviews: 298, stock: 41, imgId: "photo-1512436991641-6745cdb1723f", isbn: "978-616-7904-05-0", description: "นิยายโรแมนติกอมตะของนักเขียนหญิงแถวหน้าของไทย" },
  { id: 10, title: "Good to Great", author: "Jim Collins", price: 395, originalPrice: 460, category: "ธุรกิจ", rating: 4.5, reviews: 612, stock: 5, imgId: "photo-1456513080510-7bf3a84b82f8", isbn: "978-0-066-62099-5", description: "Why some companies make the leap and others do not." },
];

export const CATEGORIES = ["ทั้งหมด", "วรรณกรรมไทย", "Fiction", "Self-Help", "ธุรกิจ", "ประวัติศาสตร์"];

export const ORDERS: Order[] = [
  { id: "ORD-2568-0892", customer: "สมชาย วงศ์สุข", date: "13 ม.ค. 2568", total: 840, status: "pending", items: 3, address: "123 ถ.สุขุมวิท แขวงคลองเตย กรุงเทพฯ 10110" },
  { id: "ORD-2568-0891", customer: "นภา รัตนโชติ", date: "13 ม.ค. 2568", total: 510, status: "payment_review", items: 2, address: "456 ถ.เพชรบุรี แขวงมักกะสัน กรุงเทพฯ 10400" },
  { id: "ORD-2568-0890", customer: "กิตติ์ ชาญวิทย์", date: "12 ม.ค. 2568", total: 1250, status: "confirmed", items: 4, address: "789 ถ.ลาดพร้าว แขวงลาดพร้าว กรุงเทพฯ 10230" },
  { id: "ORD-2568-0889", customer: "มาลี สุริยา", date: "12 ม.ค. 2568", total: 325, status: "shipping", items: 1, address: "321 ถ.รัชดา แขวงดินแดง กรุงเทพฯ 10400" },
  { id: "ORD-2568-0888", customer: "ธนา พรมมา", date: "11 ม.ค. 2568", total: 695, status: "delivered", items: 2, address: "654 ถ.พระราม 9 แขวงห้วยขวาง กรุงเทพฯ 10310" },
  { id: "ORD-2568-0887", customer: "อรุณี แก้วใส", date: "11 ม.ค. 2568", total: 445, status: "cancelled", items: 1, address: "987 ถ.บรรทัดทอง แขวงรองเมือง กรุงเทพฯ 10330" },
  { id: "ORD-2568-0886", customer: "ประยุทธ์ สมบัติ", date: "10 ม.ค. 2568", total: 920, status: "delivered", items: 3, address: "246 ถ.สาทร แขวงยานนาวา กรุงเทพฯ 10120" },
];

export const SALES_DATA = [
  { month: "ส.ค.", revenue: 42000, orders: 156 },
  { month: "ก.ย.", revenue: 38500, orders: 142 },
  { month: "ต.ค.", revenue: 51200, orders: 189 },
  { month: "พ.ย.", revenue: 47800, orders: 174 },
  { month: "ธ.ค.", revenue: 68900, orders: 251 },
  { month: "ม.ค.", revenue: 53400, orders: 197 },
];

export const USERS = [
  { id: 1, name: "สมชาย วงศ์สุข", email: "somchai@email.com", role: "customer", joined: "10 ก.พ. 2567", orders: 12, spent: 4850 },
  { id: 2, name: "นภา รัตนโชติ", email: "napa@email.com", role: "customer", joined: "15 มี.ค. 2567", orders: 7, spent: 2340 },
  { id: 3, name: "กิตติวัฒน์ กุดั่น", email: "kitti@staff.com", role: "staff", joined: "1 ม.ค. 2568", orders: 0, spent: 0 },
  { id: 4, name: "ธนา พรมมา", email: "thana@email.com", role: "customer", joined: "3 เม.ย. 2567", orders: 19, spent: 7820 },
  { id: 5, name: "มาลี สุริยา", email: "malee@email.com", role: "customer", joined: "22 พ.ค. 2567", orders: 4, spent: 1250 },
  { id: 6, name: "ศิระเดช ศรีอ่ำ", email: "siradech@admin.com", role: "admin", joined: "1 ม.ค. 2568", orders: 0, spent: 0 },
];

export const DEMO_ACCOUNTS: UserAccount[] = [
  { name: "สมชาย วงศ์สุข", email: "customer@booka.app", role: "customer", phone: "081-234-5678", address: "123 ถ.สุขุมวิท แขวงคลองเตย กรุงเทพฯ 10110", joined: "10 ก.พ. 2567", avatar: "SC" },
  { name: "กิตติวัฒน์ กุดั่น", email: "staff@booka.app", role: "staff", phone: "082-345-6789", address: "—", joined: "1 ม.ค. 2568", avatar: "KK" },
  { name: "ศิระเดช ศรีอ่ำ", email: "admin@booka.app", role: "admin", phone: "083-456-7890", address: "—", joined: "1 ม.ค. 2568", avatar: "SR" },
];

// ─── Status Config ────────────────────────────────────────────────────────────
export const statusCfg: Record<string, { label: string; color: string; dot: string }> = {
  pending:        { label: "รอชำระเงิน",     color: "text-amber-700  bg-amber-50  border-amber-200",  dot: "bg-amber-500"  },
  payment_review: { label: "ตรวจสอบหลักฐาน", color: "text-blue-700   bg-blue-50   border-blue-200",   dot: "bg-blue-500"   },
  confirmed:      { label: "ยืนยันแล้ว",      color: "text-green-700  bg-green-50  border-green-200",  dot: "bg-green-500"  },
  shipping:       { label: "กำลังจัดส่ง",     color: "text-purple-700 bg-purple-50 border-purple-200", dot: "bg-purple-500" },
  delivered:      { label: "จัดส่งสำเร็จ",    color: "text-gray-600   bg-gray-50   border-gray-200",   dot: "bg-gray-400"   },
  cancelled:      { label: "ยกเลิก",          color: "text-red-700    bg-red-50    border-red-200",    dot: "bg-red-500"    },
};
