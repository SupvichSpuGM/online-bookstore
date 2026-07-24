import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getCurrentUser, unauthorizedResponse } from "@/lib/auth";
import { query } from "@/lib/db";

interface UserPasswordRow {
  id: number;
  password_hash: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { currentPassword, newPassword, confirmPassword, email, requestType } = body as {
      currentPassword?: string;
      newPassword?: string;
      confirmPassword?: string;
      email?: string;
      requestType?: string;
    };

    if (requestType === "forgot-password") {
      if (!email) {
        return NextResponse.json(
          { error: "กรุณากรอกอีเมลก่อน" },
          { status: 400 }
        );
      }

      const normalizedEmail = email.trim().toLowerCase();
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
    }

    const currentUser = await getCurrentUser();
    if (!currentUser?.sub) {
      return unauthorizedResponse("กรุณาเข้าสู่ระบบก่อน");
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "กรุณากรอกข้อมูลให้ครบถ้วน" },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน" },
        { status: 400 }
      );
    }

    const userId = Number(currentUser.sub);
    if (!Number.isInteger(userId)) {
      return unauthorizedResponse("ข้อมูลผู้ใช้ไม่ถูกต้อง");
    }

    const users = await query<UserPasswordRow[]>(
      "SELECT id, password_hash FROM users WHERE id = ? LIMIT 1",
      [userId]
    );

    if (users.length === 0) {
      return unauthorizedResponse("ไม่พบบัญชีผู้ใช้งานนี้");
    }

    const user = users[0];
    const isValidCurrentPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidCurrentPassword) {
      return NextResponse.json(
        { error: "รหัสผ่านปัจจุบันไม่ถูกต้อง" },
        { status: 401 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await query("UPDATE users SET password_hash = ? WHERE id = ?", [hashedPassword, user.id]);

    return NextResponse.json({
      success: true,
      message: "เปลี่ยนรหัสผ่านสำเร็จ",
    });
  } catch (error) {
    console.error("[POST /api/auth/change-password]", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในระบบ" },
      { status: 500 }
    );
  }
}
