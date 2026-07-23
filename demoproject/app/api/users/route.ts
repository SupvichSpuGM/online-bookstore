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
  const search = searchParams.get("search") ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(100, Number(searchParams.get("limit") ?? 50));
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (role) { conditions.push("u.role = ?"); params.push(role); }
  if (search) { conditions.push("(u.name LIKE ? OR u.email LIKE ?)"); params.push(`%${search}%`, `%${search}%`); }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const users = await query<(UserRow & { order_count: number; total_spent: number })[]>(
    `SELECT u.id, u.name, u.email, u.role, u.phone, u.created_at,
            COUNT(o.id)              AS order_count,
            COALESCE(SUM(CASE WHEN o.status NOT IN ('cancelled') THEN o.total_amount ELSE 0 END), 0) AS total_spent
     FROM users u
     LEFT JOIN orders o ON o.user_id = u.id
     ${whereClause}
     GROUP BY u.id, u.name, u.email, u.role, u.phone, u.created_at
     ORDER BY u.created_at DESC
     LIMIT ${limit} OFFSET ${offset}`,
    params
  );

  const [{ total }] = await query<[{ total: number }]>(
    `SELECT COUNT(*) as total FROM users u ${whereClause}`,
    params
  );

  return NextResponse.json({ users, total, page, limit });
}

// ─── POST /api/users — สร้าง user ใหม่ (public = register, admin = สร้างทุก role) ─
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone, role: requestedRole } = body as {
      name?: string;
      email?: string;
      password?: string;
      phone?: string;
      role?: string;
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

    // เฉพาะ admin กำหนด role ได้
    const me = await getCurrentUser();
    const validRoles = ["customer", "staff", "admin"];
    const role =
      me?.role === "admin" && requestedRole && validRoles.includes(requestedRole)
        ? requestedRole
        : "customer";

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
      "INSERT INTO users (name, email, password_hash, role, phone) VALUES (?, ?, ?, ?, ?)",
      [name.trim(), email.toLowerCase().trim(), password_hash, role, phone ?? null]
    );

    return NextResponse.json(
      {
        success: true,
        user: { id: result.insertId, name, email: email.toLowerCase(), role },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/users]", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในระบบ" }, { status: 500 });
  }
}
