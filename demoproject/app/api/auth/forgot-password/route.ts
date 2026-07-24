import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body as { email?: string };
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "กรุณากรอกอีเมลที่ถูกต้อง" },
        { status: 400 }
      );
    }

    const users = await query<{ id: number }[]>("SELECT id FROM users WHERE email = ? LIMIT 1", [normalizedEmail]);

    if (users.length === 0) {
      return NextResponse.json(
        { error: "อีเมลนี้ไม่ตรงกับบัญชีในระบบ" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "หากอีเมลนี้มีบัญชีในระบบ เราจะส่งคำแนะนำการตั้งรหัสผ่านใหม่ให้คุณในไม่ช้า",
    });
  } catch (error) {
    console.error("[POST /api/auth/forgot-password]", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในระบบ" },
      { status: 500 }
    );
  }
}
