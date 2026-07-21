import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser, unauthorizedResponse, forbiddenResponse } from "@/lib/auth";

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  created_at: string;
}

// ─── GET /api/users/[id] — ดู profile ──────────────────────
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const me = await getCurrentUser();
  if (!me) return unauthorizedResponse();

  const { id } = await params;
  const userId = Number(id);

  // customer ดูได้เฉพาะของตัวเอง, admin/staff ดูได้ทุก user
  if (me.role === "customer" && Number(me.sub) !== userId) {
    return forbiddenResponse();
  }

  const users = await query<UserRow[]>(
    "SELECT id, name, email, role, phone, created_at FROM users WHERE id = ? LIMIT 1",
    [userId]
  );

  if (users.length === 0) {
    return NextResponse.json({ error: "ไม่พบผู้ใช้งาน" }, { status: 404 });
  }

  return NextResponse.json({ user: users[0] });
}

// ─── PUT /api/users/[id] — อัปเดต profile ──────────────────
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const me = await getCurrentUser();
  if (!me) return unauthorizedResponse();

  const { id } = await params;
  const userId = Number(id);

  // customer แก้ได้เฉพาะของตัวเอง, admin แก้ได้ทุก user
  if (me.role === "customer" && Number(me.sub) !== userId) {
    return forbiddenResponse();
  }

  try {
    const body = await request.json();
    const { name, phone, role } = body as {
      name?: string;
      phone?: string;
      role?: string;
    };

    // เฉพาะ admin เปลี่ยน role ได้
    const updates: string[] = [];
    const values: unknown[] = [];

    if (name) { updates.push("name = ?"); values.push(name.trim()); }
    if (phone !== undefined) { updates.push("phone = ?"); values.push(phone || null); }
    if (role && me.role === "admin") { updates.push("role = ?"); values.push(role); }

    if (updates.length === 0) {
      return NextResponse.json({ error: "ไม่มีข้อมูลที่จะอัปเดต" }, { status: 400 });
    }

    values.push(userId);
    await query(
      `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
      values
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PUT /api/users/[id]]", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในระบบ" }, { status: 500 });
  }
}
