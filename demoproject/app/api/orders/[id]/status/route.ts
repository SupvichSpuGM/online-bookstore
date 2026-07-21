import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser, unauthorizedResponse, forbiddenResponse } from "@/lib/auth";

// สถานะที่อนุญาตให้เปลี่ยนได้ (state machine)
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  payment_review: ["confirmed", "cancelled"],
  confirmed:      ["shipping", "cancelled"],
  shipping:       ["delivered"],
};

// ─── PUT /api/orders/[id]/status — อัปเดต status (staff/admin) ─
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const me = await getCurrentUser();
  if (!me) return unauthorizedResponse();
  if (me.role === "customer") return forbiddenResponse("เฉพาะ staff/admin เท่านั้น");

  const { id } = await params;
  const orderId = Number(id);

  const orders = await query<Array<{ status: string; user_id: number }>>(
    "SELECT status, user_id FROM orders WHERE id = ? LIMIT 1",
    [orderId]
  );

  if (orders.length === 0) {
    return NextResponse.json({ error: "ไม่พบ order" }, { status: 404 });
  }

  const currentStatus = orders[0].status;
  const body = await request.json();
  const { status, tracking_number } = body as {
    status?: string;
    tracking_number?: string;
  };

  if (!status) {
    return NextResponse.json({ error: "กรุณาระบุ status ที่ต้องการเปลี่ยน" }, { status: 400 });
  }

  const allowed = ALLOWED_TRANSITIONS[currentStatus] ?? [];
  if (!allowed.includes(status)) {
    return NextResponse.json(
      { error: `ไม่สามารถเปลี่ยนจาก "${currentStatus}" เป็น "${status}" ได้` },
      { status: 409 }
    );
  }

  const updates: string[] = ["status = ?"];
  const values: unknown[] = [status];

  if (status === "confirmed" || status === "cancelled") {
    updates.push("verified_by = ?");
    values.push(Number(me.sub));
  }

  if (status === "shipping") {
    if (!tracking_number) {
      return NextResponse.json(
        { error: "กรุณาระบุ tracking_number สำหรับสถานะ shipping" },
        { status: 400 }
      );
    }
    updates.push("tracking_number = ?", "shipped_at = NOW()");
    values.push(tracking_number);
  }

  values.push(orderId);
  await query(`UPDATE orders SET ${updates.join(", ")} WHERE id = ?`, values);

  return NextResponse.json({ success: true, status });
}
