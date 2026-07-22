import { NextRequest, NextResponse } from "next/server";
import { query, withTransaction } from "@/lib/db";
import { getCurrentUser, unauthorizedResponse } from "@/lib/auth";
import type { PoolConnection } from "mysql2/promise";

interface OrderRow {
  id: number;
  user_id: number;
  address_id: number | null;
  verified_by: number | null;
  total_amount: number;
  status: string;
  slip_image_url: string | null;
  tracking_number: string | null;
  order_date: string;
  shipped_at: string | null;
  customer_name: string;
}

// ─── GET /api/orders — รายการ orders ──────────────────────────
export async function GET(request: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return unauthorizedResponse();

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const page   = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit  = Math.min(50, Number(searchParams.get("limit") ?? 20));
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: unknown[] = [];

  // customer เห็นเฉพาะ order ของตัวเอง
  if (me.role === "customer") {
    conditions.push("o.user_id = ?");
    params.push(Number(me.sub));
  }

  if (status) {
    conditions.push("o.status = ?");
    params.push(status);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const orders = await query<OrderRow[]>(
    `SELECT o.id, o.user_id, o.address_id, o.verified_by,
            o.total_amount, o.status, o.slip_image_url,
            o.tracking_number, o.order_date, o.shipped_at,
            u.name AS customer_name
     FROM orders o
     JOIN users u ON u.id = o.user_id
     ${where}
     ORDER BY o.order_date DESC
     LIMIT ${limit} OFFSET ${offset}`,
    params
  );

  const [{ total }] = await query<[{ total: number }]>(
    `SELECT COUNT(*) as total FROM orders o ${where}`,
    params
  );

  return NextResponse.json({ orders, total, page, limit });
}

// ─── POST /api/orders — สร้าง order จากตะกร้า ────────────────
export async function POST(request: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return unauthorizedResponse();

  const userId = Number(me.sub);
  const body = await request.json();
  const { address_id } = body as { address_id?: number };

  try {
    const orderId = await withTransaction(async (conn: PoolConnection) => {
      // 1. ดึง cart items
      const [cartRow] = await conn.execute<any[]>(
        "SELECT id FROM carts WHERE user_id = ? LIMIT 1",
        [userId]
      );
      const carts = cartRow as Array<{ id: number }>;
      if (carts.length === 0) throw new Error("ตะกร้าสินค้าว่างเปล่า");

      const cartId = carts[0].id;
      const [itemRows] = await conn.execute<any[]>(
        `SELECT ci.book_id, ci.quantity, b.price, b.stock_qty, b.title
         FROM cart_items ci
         JOIN books b ON b.id = ci.book_id
         WHERE ci.cart_id = ?
         FOR UPDATE`,
        [cartId]
      );
      const items = itemRows as Array<{
        book_id: number; quantity: number; price: number;
        stock_qty: number; title: string;
      }>;

      if (items.length === 0) throw new Error("ตะกร้าสินค้าว่างเปล่า");

      // 2. ตรวจสอบ stock ทุกรายการ
      for (const item of items) {
        if (item.stock_qty < item.quantity) {
          throw new Error(`"${item.title}" สต็อกไม่เพียงพอ (เหลือ ${item.stock_qty} เล่ม)`);
        }
      }

      // 3. คำนวณ total
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // 4. สร้าง order
      const [orderResult] = await conn.execute<any>(
        `INSERT INTO orders (user_id, address_id, total_amount, status)
         VALUES (?, ?, ?, 'pending')`,
        [userId, address_id ?? null, total]
      );
      const orderId = (orderResult as { insertId: number }).insertId;

      // 5. บันทึก order items + หัก stock
      for (const item of items) {
        await conn.execute(
          "INSERT INTO order_items (order_id, book_id, quantity, price_per_unit) VALUES (?, ?, ?, ?)",
          [orderId, item.book_id, item.quantity, item.price]
        );
        await conn.execute(
          "UPDATE books SET stock_qty = stock_qty - ? WHERE id = ?",
          [item.quantity, item.book_id]
        );

        // low stock alert
        const newStock = item.stock_qty - item.quantity;
        if (newStock <= 5) {
          await conn.execute(
            "INSERT INTO notifications (type, message, book_id) VALUES ('low_stock', ?, ?)",
            [`หนังสือ "${item.title}" เหลือสต็อกน้อย (${newStock} เล่ม)`, item.book_id]
          );
        }
      }

      // 6. ล้างตะกร้า
      await conn.execute("DELETE FROM cart_items WHERE cart_id = ?", [cartId]);

      return orderId;
    });

    return NextResponse.json({ success: true, order_id: orderId }, { status: 201 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "เกิดข้อผิดพลาดภายในระบบ";
    console.error("[POST /api/orders]", error);
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
