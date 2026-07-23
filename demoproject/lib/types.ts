// ─── Shared Types (จาก Database Schema) ─────────────────────────────────────
// ใช้แทน types ใน lib/data.ts เมื่อดึงข้อมูลจาก API

export type Role = "customer" | "staff" | "admin";

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string | null;
  price: number;
  original_price: number;
  stock_qty: number;
  category: string;
  cover_image_url: string | null;
  description: string | null;
  rating: number;
  review_count: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  phone: string | null;
  created_at?: string;
}

export interface CartItem {
  id: number;
  cart_id: number;
  book_id: number;
  quantity: number;
  // joined from books
  title: string;
  author: string;
  price: number;
  original_price: number;
  stock_qty: number;
  cover_image_url: string | null;
  category: string;
  isbn: string | null;
  description: string | null;
  rating: number;
  review_count: number;
}

export type OrderStatus =
  | "pending"
  | "payment_review"
  | "confirmed"
  | "shipping"
  | "delivered"
  | "cancelled";

export interface Order {
  id: number;
  user_id: number;
  address_id: number | null;
  verified_by: number | null;
  total_amount: number;
  status: OrderStatus;
  slip_image_url: string | null;
  tracking_number: string | null;
  order_date: string;
  shipped_at: string | null;
  customer_name: string;
  customer_email?: string;
}

export interface OrderItem {
  id: number;
  book_id: number;
  quantity: number;
  price_per_unit: number;
  title: string;
  author: string;
  cover_image_url: string | null;
}

// ─── Helper: แปลง Book (DB) → image URL ────────────────────────────────────
export function getBookImageUrl(book: Partial<Book> & { cover_image_url?: string | null; imgId?: string }): string {
  if (book.cover_image_url) return book.cover_image_url;
  if (book.imgId) return `https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=560&fit=crop`;
  // fallback placeholder
  return `https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=560&fit=crop`;
}

// ─── Status config ─────────────────────────────────────────────────────────
export const statusCfg: Record<OrderStatus, { label: string; color: string; dot: string }> = {
  pending:        { label: "รอชำระเงิน",     color: "text-amber-700  bg-amber-50  border-amber-200",  dot: "bg-amber-500"  },
  payment_review: { label: "ตรวจสอบหลักฐาน", color: "text-blue-700   bg-blue-50   border-blue-200",   dot: "bg-blue-500"   },
  confirmed:      { label: "ยืนยันแล้ว",      color: "text-green-700  bg-green-50  border-green-200",  dot: "bg-green-500"  },
  shipping:       { label: "กำลังจัดส่ง",     color: "text-purple-700 bg-purple-50 border-purple-200", dot: "bg-purple-500" },
  delivered:      { label: "จัดส่งสำเร็จ",    color: "text-gray-600   bg-gray-50   border-gray-200",   dot: "bg-gray-400"   },
  cancelled:      { label: "ยกเลิก",          color: "text-red-700    bg-red-50    border-red-200",    dot: "bg-red-500"    },
};
