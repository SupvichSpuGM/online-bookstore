import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { signToken, setAuthCookie } from "@/lib/auth";

interface UserRow {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: "customer" | "staff" | "admin";
  phone: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body as { email?: string; password?: string };

    if (!email || !password) {
      return NextResponse.json(
        { error: "กรุณากรอก email และ password" },
        { status: 400 }
      );
    }

    // ดึง user จาก DB
    const users = await query<UserRow[]>(
      "SELECT id, name, email, password_hash, role, phone FROM users WHERE email = ? LIMIT 1",
      [email.toLowerCase().trim()]
    );

    if (users.length === 0) {
      return NextResponse.json(
        { error: "ไม่พบบัญชีผู้ใช้งานนี้" },
        { status: 401 }
      );
    }

    const user = users[0];

    // ตรวจสอบ password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: "รหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    // สร้าง JWT token
    const token = await signToken({
      sub: String(user.id),
      name: user.name,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
    });

    setAuthCookie(response, token);

    // Legacy cookie สำหรับ middleware เดิม
    response.cookies.set("booka-role", user.role, {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในระบบ" },
      { status: 500 }
    );
  }
}
