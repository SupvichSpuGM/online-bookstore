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

// ─── PUT /api/orders/[id] — แก้ไขรายละเอียด order ─────────────────
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const me = await getCurrentUser();
  if (!me) return unauthorizedResponse();

  const { id } = await params;
  const orderId = Number(id);

  const existingOrders = await query<Array<{ id: number; user_id: number; address_id: number | null; status: string }>>(
    "SELECT id, user_id, address_id, status FROM orders WHERE id = ? LIMIT 1",
    [orderId]
  );

  if (existingOrders.length === 0) {
    return NextResponse.json({ error: "ไม่พบ order" }, { status: 404 });
  }

  const existing = existingOrders[0];

  // ถ้าเป็น customer ต้องเป็นเจ้าของออเดอร์เท่านั้น
  if (me.role === "customer") {
    if (existing.user_id !== Number(me.sub)) {
      return forbiddenResponse("ไม่มีสิทธิ์แก้ไขคำสั่งซื้อนี้");
    }
    if (["shipping", "delivered", "cancelled"].includes(existing.status)) {
      return NextResponse.json(
        { error: "ไม่สามารถแก้ไขคำสั่งซื้อที่อยู่ระหว่างจัดส่ง จัดส่งสำเร็จ หรือยกเลิกแล้วได้" },
        { status: 400 }
      );
    }
  }

  const body = await request.json();
  const { status, tracking_number, total_amount, address, slip_image_url } = body as {
    status?: string;
    tracking_number?: string | null;
    total_amount?: number;
    address?: string;
    slip_image_url?: string;
  };

  const updates: string[] = [];
  const values: unknown[] = [];

  if (status !== undefined) {
    if (me.role === "customer") {
      if (status === "cancelled" || (status === "payment_review" && slip_image_url)) {
        updates.push("status = ?");
        values.push(status);
      }
    } else {
      updates.push("status = ?");
      values.push(status);
    }
  }

  if (slip_image_url !== undefined) {
    updates.push("slip_image_url = ?");
    values.push(slip_image_url);
    if (me.role === "customer" && existing.status === "pending") {
      updates.push("status = 'payment_review'");
    }
  }

  if (tracking_number !== undefined && me.role !== "customer") {
    updates.push("tracking_number = ?");
    values.push(tracking_number);
    if (tracking_number && status === "shipping") {
      updates.push("shipped_at = NOW()");
    }
  }

  if (total_amount !== undefined && !isNaN(Number(total_amount)) && me.role !== "customer") {
    updates.push("total_amount = ?");
    values.push(Number(total_amount));
  }

  if (updates.length > 0) {
    values.push(orderId);
    await query(`UPDATE orders SET ${updates.join(", ")} WHERE id = ?`, values);
  }

  // อัปเดตที่อยู่จัดส่งในตาราง addresses ถ้ามี address_id
  if (address && existing.address_id) {
    await query(
      "UPDATE addresses SET address_line = ? WHERE id = ?",
      [address, existing.address_id]
    );
  }

  return NextResponse.json({ success: true, message: "อัปเดตข้อมูลคำสั่งซื้อเรียบร้อยแล้ว" });
}


