import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
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

// ─── GET /api/users — รายชื่อ users ทั้งหมด (admin only) ───
export async function GET(request: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return unauthorizedResponse();
  if (me.role !== "admin") return forbiddenResponse();

  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role");
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(50, Number(searchParams.get("limit") ?? 20));
  const offset = (page - 1) * limit;

  const whereClause = role ? "WHERE role = ?" : "";
  const params: unknown[] = role ? [role] : [];

  const users = await query<UserRow[]>(
    `SELECT id, name, email, role, phone, created_at
     FROM users
     ${whereClause}
     ORDER BY created_at DESC
     LIMIT ${limit} OFFSET ${offset}`,
    params
  );

  const [{ total }] = await query<[{ total: number }]>(
    `SELECT COUNT(*) as total FROM users ${role ? "WHERE role = ?" : ""}`,
    role ? [role] : []
  );

  return NextResponse.json({ users, total, page, limit });
}

// ─── POST /api/users — Register user ใหม่ ──────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body as {
      name?: string;
      email?: string;
      password?: string;
      phone?: string;
    };

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "กรุณากรอก name, email และ password" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร" },
        { status: 400 }
      );
    }

    // ตรวจสอบ email ซ้ำ
    const existing = await query<UserRow[]>(
      "SELECT id FROM users WHERE email = ? LIMIT 1",
      [email.toLowerCase().trim()]
    );
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "อีเมลนี้ถูกใช้งานแล้ว" },
        { status: 409 }
      );
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await query<{ insertId: number }>(
      "INSERT INTO users (name, email, password_hash, role, phone) VALUES (?, ?, ?, 'customer', ?)",
      [name.trim(), email.toLowerCase().trim(), password_hash, phone ?? null]
    );

    return NextResponse.json(
      {
        success: true,
        user: { id: result.insertId, name, email: email.toLowerCase(), role: "customer" },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/users]", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในระบบ" }, { status: 500 });
  }
}
