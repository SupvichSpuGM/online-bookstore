"use client";

import Link from "next/link";
import { useState } from "react";
import { BookOpen, ArrowLeft, Mail, CheckCircle2, RefreshCw } from "lucide-react";

export function ForgotPasswordView() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("กรุณากรอกอีเมลก่อน");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data as { error?: string }).error || "ไม่สามารถส่งคำขอได้");
      }

      setMessage("ส่งคำขอสำเร็จ หากอีเมลนี้มีบัญชีในระบบ ระบบจะแสดงคำแนะนำต่อไปในหน้าจอนี้");
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-6 h-6 text-accent" />
          <span className="font-['Playfair_Display'] text-xl font-semibold">Booka</span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Link href="/login" className="text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-semibold">ลืมรหัสผ่าน</h1>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          ป้อนอีเมลของคุณ เราจะช่วยแนะนำขั้นตอนในการตั้งรหัสผ่านใหม่
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">อีเมล</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && (
            <div className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-3 text-sm text-green-700">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary text-white py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> กำลังส่ง…</> : "ส่งคำขอ"}
          </button>
        </form>

        <p className="text-xs text-muted-foreground mt-4">
          สำหรับตัวอย่างนี้ ระบบจะตอบกลับข้อความสั้น ๆ และคุณยังสามารถใช้รหัสผ่านเดิมต่อไปได้จนกว่าจะมีระบบรีเซ็ตจริง ๆ
        </p>
      </div>
    </div>
  );
}
