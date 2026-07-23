import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser, unauthorizedResponse, forbiddenResponse } from "@/lib/auth";
import { saveSlipImage } from "@/lib/slipStorage";

// ─── POST /api/orders/[id]/slip — แนบ slip URL ────────────────
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const me = await getCurrentUser();
  if (!me) return unauthorizedResponse();

  const { id } = await params;
  const orderId = Number(id);

  // ตรวจสิทธิ์: customer แนบได้เฉพาะ order ของตัวเอง
  const orders = await query<Array<{ user_id: number; status: string }>>(
    "SELECT user_id, status FROM orders WHERE id = ? LIMIT 1",
    [orderId]
  );

  if (orders.length === 0) {
    return NextResponse.json({ error: "ไม่พบ order" }, { status: 404 });
  }

  if (me.role === "customer" && orders[0].user_id !== Number(me.sub)) {
    return forbiddenResponse();
  }

  if (orders[0].status !== "pending") {
    return NextResponse.json(
      { error: "ไม่สามารถแนบสลิปได้ (order ไม่อยู่ในสถานะ pending)" },
      { status: 409 }
    );
  }

  const body = await request.json();
  const { slip_image_url } = body as { slip_image_url?: string };

  if (!slip_image_url) {
    return NextResponse.json({ error: "กรุณาระบุ slip_image_url" }, { status: 400 });
  }

  const storedSlipUrl = await saveSlipImage(slip_image_url);

  await query(
    "UPDATE orders SET slip_image_url = ?, status = 'payment_review' WHERE id = ?",
    [storedSlipUrl ?? slip_image_url, orderId]
  );

  return NextResponse.json({ success: true, status: "payment_review" });
}
