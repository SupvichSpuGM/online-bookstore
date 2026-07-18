"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Eye, RefreshCw, Check, X, User } from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";
import { DEMO_ACCOUNTS } from "@/lib/data";
import type { Role } from "@/lib/data";

const roleColor: Record<Role, string> = {
  customer: "border-amber-200 hover:border-amber-400 bg-amber-50/50",
  staff:    "border-blue-200  hover:border-blue-400  bg-blue-50/50",
  admin:    "border-purple-200 hover:border-purple-400 bg-purple-50/50",
};
const roleBadge: Record<Role, string> = {
  customer: "bg-amber-100 text-amber-700",
  staff:    "bg-blue-100 text-blue-700",
  admin:    "bg-purple-100 text-purple-700",
};
const roleLabel: Record<Role, string> = { customer: "Customer", staff: "Staff", admin: "Admin" };
const roleRedirect: Record<Role, string> = { customer: "/", staff: "/staff", admin: "/admin" };

export function LoginView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, setGuestMode } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const acct = DEMO_ACCOUNTS.find((a) => a.email === email.trim());
    if (!acct || password !== "demo1234") {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login(acct);
      router.push(roleRedirect[acct.role]);
    }, 700);
  };

  const handleGuestMode = () => {
    setGuestMode();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-[45%] bg-primary flex-col items-center justify-center p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=900&h=1200&fit=crop')", backgroundSize: "cover" }}
        />
        <div className="relative z-10 text-center">
          <div className="flex items-center gap-3 justify-center mb-10">
            <BookOpen className="w-9 h-9 text-amber-400" />
            <span className="font-['Playfair_Display'] text-3xl font-semibold text-white">Booka</span>
          </div>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            ระบบจำหน่ายหนังสือออนไลน์<br />
            <span className="font-['DM_Mono'] text-amber-400/80 text-xs tracking-widest uppercase">CSI204 · Digital Platform</span>
          </p>
          <div className="mt-12 grid gap-3">
            {["ค้นหาหนังสือกว่า 10,000 ชื่อ", "ชำระเงินออนไลน์อย่างปลอดภัย", "ติดตามสถานะจัดส่ง Real-time"].map((f) => (
              <div key={f} className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-2.5">
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-white/70 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <BookOpen className="w-6 h-6 text-accent" />
            <span className="font-['Playfair_Display'] text-xl font-semibold">Booka</span>
          </div>

          <h1 className="text-2xl font-semibold mb-1">เข้าสู่ระบบ</h1>
          <p className="text-muted-foreground text-sm mb-7">ยินดีต้อนรับกลับมา</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">อีเมล</label>
              <input
                value={email} onChange={(e) => setEmail(e.target.value)}
                type="email" required placeholder="กรอกอีเมลของคุณ"
                className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">รหัสผ่าน</label>
              <div className="relative">
                <input
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  type={showPass ? "text" : "password"} required placeholder="กรอกรหัสผ่าน"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors pr-10"
                />
                <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-sm">
                <X className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}
            <button
              type="submit" disabled={loading}
              className="w-full bg-primary text-white rounded-lg py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? <><RefreshCw className="w-4 h-4 animate-spin" /> กำลังเข้าสู่ระบบ…</> : "เข้าสู่ระบบ"}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-7">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-['DM_Mono']">DEMO ACCOUNTS</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <div className="grid gap-2">
              {DEMO_ACCOUNTS.map((acct) => (
                <button
                  key={acct.role} type="button"
                  onClick={() => { setEmail(acct.email); setPassword("demo1234"); }}
                  className={`border rounded-lg px-3.5 py-2.5 text-left transition-all ${roleColor[acct.role]}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center shrink-0 ${roleBadge[acct.role]}`}>
                      {acct.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{acct.name}</p>
                      <p className="text-xs text-muted-foreground font-['DM_Mono']">{acct.email}</p>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${roleBadge[acct.role]}`}>
                      {roleLabel[acct.role]}
                    </span>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-center text-xs text-muted-foreground mt-2.5 font-['DM_Mono']">password: demo1234</p>
          </div>

          {/* Guest mode */}
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground">หรือ</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            <button
              onClick={handleGuestMode}
              className="w-full py-2.5 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-accent hover:bg-accent/5 transition-all flex items-center justify-center gap-2"
            >
              <User className="w-4 h-4" /> เข้าชมร้านก่อน (ไม่ต้องล็อกอิน)
            </button>
            <p className="text-xs text-muted-foreground mt-2 text-center">สามารถดูหนังสือได้ แต่ไม่สามารถสั่งซื้อได้</p>
          </div>
        </div>
      </div>
    </div>
  );
}
