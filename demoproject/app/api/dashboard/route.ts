import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser, unauthorizedResponse, forbiddenResponse } from "@/lib/auth";

// ─── GET /api/dashboard — สถิติยอดขาย (admin only) ────────────
export async function GET(request: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return unauthorizedResponse();
  if (me.role !== "admin") return forbiddenResponse();

  const { searchParams } = new URL(request.url);
  const months = Math.min(12, Number(searchParams.get("months") ?? 6));

  // Monthly revenue + order count (ย้อนหลัง N เดือน)
  const salesData = await query<Array<{
    month: string;
    revenue: number;
    orders: number;
  }>>(
    `SELECT
       DATE_FORMAT(MIN(order_date), '%b %Y') AS month,
       ROUND(SUM(total_amount), 2)            AS revenue,
       COUNT(*)                               AS orders
     FROM orders
     WHERE status NOT IN ('cancelled')
       AND order_date >= DATE_SUB(NOW(), INTERVAL ? MONTH)
     GROUP BY DATE_FORMAT(order_date, '%Y-%m')
     ORDER BY MIN(order_date) ASC`,
    [months]
  );

  // Top selling books
  const topBooks = await query<Array<{
    book_id: number;
    title: string;
    author: string;
    total_sold: number;
    revenue: number;
  }>>(
    `SELECT oi.book_id, b.title, b.author,
            SUM(oi.quantity) AS total_sold,
            ROUND(SUM(oi.quantity * oi.price_per_unit), 2) AS revenue
     FROM order_items oi
     JOIN books b ON b.id = oi.book_id
     JOIN orders o ON o.id = oi.order_id
     WHERE o.status NOT IN ('cancelled')
     GROUP BY oi.book_id, b.title, b.author
     ORDER BY total_sold DESC
     LIMIT 5`
  );

  // Order counts by status
  const statusCounts = await query<Array<{ status: string; count: number }>>(
    `SELECT status, COUNT(*) AS count
     FROM orders
     GROUP BY status`
  );

  // Summary stats
  const [summary] = await query<Array<{
    total_revenue: number;
    total_orders: number;
    total_customers: number;
    total_books: number;
  }>>(
    `SELECT
       (SELECT ROUND(SUM(total_amount), 2) FROM orders WHERE status NOT IN ('cancelled')) AS total_revenue,
       (SELECT COUNT(*) FROM orders WHERE status NOT IN ('cancelled'))                    AS total_orders,
       (SELECT COUNT(*) FROM users WHERE role = 'customer')                               AS total_customers,
       (SELECT COUNT(*) FROM books)                                                       AS total_books`
  );

  // Recent orders (10 รายการล่าสุด)
  const orders = await query<Array<{
    id: number; user_id: number; address_id: number | null; verified_by: number | null;
    total_amount: number; status: string; slip_image_url: string | null;
    tracking_number: string | null; order_date: string; shipped_at: string | null;
    customer_name: string;
  }>>(
    `SELECT o.*, u.name AS customer_name
     FROM orders o
     JOIN users u ON u.id = o.user_id
     ORDER BY o.order_date DESC
     LIMIT 10`
  );

  return NextResponse.json({
    summary,
    salesData,
    topBooks,
    statusCounts,
    orders,
  });
}
