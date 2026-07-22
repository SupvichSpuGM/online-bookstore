import mysql from "mysql2/promise";
import { BOOKS, ORDERS } from "./data";

// ─── Connection Pool ────────────────────────────────────────────────────────
const pool = mysql.createPool({
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER ?? "root",
  password: process.env.DB_PASSWORD ?? "root",
  database: process.env.DB_NAME ?? "bookstore_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4",
  timezone: "+07:00",
});

// ─── Mock Fallback Generator (เมื่อ MySQL ปิดอยู่) ──────────────────────────
function getMockFallback(sql: string): unknown {
  const cleanSql = sql.toLowerCase();

  // Books query
  if (cleanSql.includes("from books")) {
    if (cleanSql.includes("distinct category")) {
      return Array.from(new Set(BOOKS.map((b) => b.category))).map((c) => ({ category: c }));
    }
    if (cleanSql.includes("count(*)")) {
      return [{ total: BOOKS.length }];
    }
    // Return books in DB format
    return BOOKS.map((b) => ({
      id: b.id,
      title: b.title,
      author: b.author,
      isbn: b.isbn,
      price: b.price,
      original_price: b.originalPrice,
      stock_qty: b.stock,
      category: b.category,
      cover_image_url: `https://images.unsplash.com/${b.imgId}?w=400&h=560&fit=crop`,
      description: b.description,
      rating: b.rating,
      review_count: b.reviews,
    }));
  }

  // Categories query
  if (cleanSql.includes("distinct category")) {
    return Array.from(new Set(BOOKS.map((b) => b.category))).map((c) => ({ category: c }));
  }

  // Users query
  if (cleanSql.includes("from users")) {
    if (cleanSql.includes("count(*)")) return [{ count: 6 }];
    return [
      { id: 1, name: "สมชาย วงศ์สุข", email: "customer@booka.app", role: "customer", phone: "081-234-5678" },
      { id: 5, name: "กิตติวัฒน์ กุดั่น", email: "staff@booka.app", role: "staff", phone: "082-345-6789" },
      { id: 6, name: "ศิระเดช ศรีอ่ำ", email: "admin@booka.app", role: "admin", phone: "083-456-7890" },
    ];
  }

  // Orders query
  if (cleanSql.includes("from orders")) {
    if (cleanSql.includes("count(*)")) return [{ count: ORDERS.length }];
    return ORDERS.map((o, idx) => ({
      id: idx + 1,
      user_id: 1,
      address_id: 1,
      verified_by: null,
      total_amount: o.total,
      status: o.status,
      slip_image_url: null,
      tracking_number: "TH123456789",
      order_date: new Date().toISOString(),
      shipped_at: null,
      customer_name: o.customer,
    }));
  }

  // Dashboard summary query
  if (cleanSql.includes("total_revenue")) {
    return [{
      total_revenue: 53400,
      total_orders: ORDERS.length,
      total_customers: 6,
      total_books: BOOKS.length,
    }];
  }

  // Default empty array
  return [];
}

// ─── Query Helper ───────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function query<T = unknown>(sql: string, params?: any[]): Promise<T> {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T;
  } catch (err: unknown) {
    // เมื่อไม่ได้เปิด MySQL หรือเชื่อมต่อไม่ได้ → สลับไปใช้ mock fallback อัตโนมัติ เพื่อไม่ให้หน้าเว็บพัง
    const errorMsg = (err as Error)?.message ?? "";
    if (errorMsg.includes("ECONNREFUSED") || errorMsg.includes("ETIMEDOUT") || errorMsg.includes("Access denied")) {
      return getMockFallback(sql) as T;
    }
    throw err;
  }
}

// ─── Transaction Helper ─────────────────────────────────────────────────────
export async function withTransaction<T>(
  fn: (conn: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  try {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const result = await fn(conn);
      await conn.commit();
      return result;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  } catch {
    // DB offline fallback mock response for transaction
    return { order_id: Math.floor(Math.random() * 1000) + 1 } as T;
  }
}

export default pool;
