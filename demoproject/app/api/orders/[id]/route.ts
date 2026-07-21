import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser, unauthorizedResponse, forbiddenResponse } from "@/lib/auth";

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
  customer_email: string;
}

interface OrderItemRow {
  id: number;
  book_id: number;
  quantity: number;
  price_per_unit: number;
  title: string;
  author: string;
  cover_image_url: string | null;
}

// ─── GET /api/orders/[id] — รายละเอียด order ──────────────────
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const me = await getCurrentUser();
  if (!me) return unauthorizedResponse();

  const { id } = await params;
  const orderId = Number(id);

  const orders = await query<OrderRow[]>(
    `SELECT o.id, o.user_id, o.address_id, o.verified_by,
            o.total_amount, o.status, o.slip_image_url,
            o.tracking_number, o.order_date, o.shipped_at,
            u.name AS customer_name, u.email AS customer_email
     FROM orders o
     JOIN users u ON u.id = o.user_id
     WHERE o.id = ? LIMIT 1`,
    [orderId]
  );

  if (orders.length === 0) {
    return NextResponse.json({ error: "ไม่พบ order" }, { status: 404 });
  }

  const order = orders[0];

  // customer ดูได้เฉพาะ order ของตัวเอง
  if (me.role === "customer" && order.user_id !== Number(me.sub)) {
    return forbiddenResponse();
  }

  const items = await query<OrderItemRow[]>(
    `SELECT oi.id, oi.book_id, oi.quantity, oi.price_per_unit,
            b.title, b.author, b.cover_image_url
     FROM order_items oi
     JOIN books b ON b.id = oi.book_id
     WHERE oi.order_id = ?`,
    [orderId]
  );

  return NextResponse.json({ order, items });
}
