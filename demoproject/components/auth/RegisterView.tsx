"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Eye,
  EyeOff,
  RefreshCw,
  Check,
  X,
  User,
  Mail,
  Phone,
  Lock,
  UserPlus,
  ShieldCheck,
} from "lucide-react";

type FieldError = {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
};

function validateForm(
  name: string,
  email: string,
  phone: string,
  password: string,
  confirmPassword: string
): FieldError {
  const errors: FieldError = {};
  if (!name.trim()) errors.name = "กรุณากรอกชื่อ-นามสกุล";
  if (!email.trim()) errors.email = "กรุณากรอกอีเมล";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "รูปแบบอีเมลไม่ถูกต้อง";
  if (phone && !/^[0-9]{9,10}$/.test(phone.replace(/-/g, "")))
    errors.phone = "เบอร์โทรต้องเป็นตัวเลข 9-10 หลัก";
  if (!password) errors.password = "กรุณากรอกรหัสผ่าน";
  else if (password.length < 8) errors.password = "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
  if (!confirmPassword) errors.confirmPassword = "กรุณายืนยันรหัสผ่าน";
  else if (password !== confirmPassword) errors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
  return errors;
}

const BENEFITS = [
  "ค้นหาหนังสือกว่า 10,000 ชื่อ",
  "ชำระเงินออนไลน์อย่างปลอดภัย",
  "ติดตามสถานะจัดส่ง Real-time",
  "รับสิทธิพิเศษสมาชิก",
];

export function RegisterView() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldError>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const passwordStrength = (() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  })();

  const strengthLabel = ["", "อ่อนแอ", "พอใช้ได้", "ดี", "แข็งแกร่ง"][passwordStrength];
  const strengthColor = [
    "",
    "bg-red-400",
    "bg-amber-400",
    "bg-blue-400",
    "bg-emerald-500",
  ][passwordStrength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    const errors = validateForm(name, email, phone, password, confirmPassword);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), password, phone: phone.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setApiError(data.error ?? "เกิดข้อผิดพลาด กรุณาลองใหม่");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch {
      setApiError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-[45%] bg-primary flex-col items-center justify-center p-12 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=900&h=1200&fit=crop')",
            backgroundSize: "cover",
          }}
        />
        <div className="relative z-10 text-center">
          <div className="flex items-center gap-3 justify-center mb-10">
            <BookOpen className="w-9 h-9 text-amber-400" />
            <span className="font-['Playfair_Display'] text-3xl font-semibold text-white">
              Booka
            </span>
          </div>
          <p className="text-white/70 text-base font-medium mb-1">เข้าร่วมกับเรา</p>
          <p className="text-white/50 text-sm leading-relaxed max-w-xs mb-10">
            สมัครสมาชิกวันนี้เพื่อเข้าถึงสิทธิพิเศษมากมาย
          </p>
          <div className="grid gap-3">
            {BENEFITS.map((f) => (
              <div
                key={f}
                className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-2.5"
              >
                <Check className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-white/70 text-sm">{f}</span>
              </div>
            ))}
          </div>
          {/* Decorative ring */}
          <div className="mt-12 mx-auto w-20 h-20 rounded-full border-2 border-amber-400/30 flex items-center justify-center">
            <UserPlus className="w-8 h-8 text-amber-400/70" />
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <BookOpen className="w-6 h-6 text-accent" />
            <span className="font-['Playfair_Display'] text-xl font-semibold">Booka</span>
          </div>

          {/* Success state */}
          {success ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-xl font-semibold mb-2">สมัครสมาชิกสำเร็จ!</h2>
              <p className="text-muted-foreground text-sm">
                กำลังพาคุณไปยังหน้าเข้าสู่ระบบ…
              </p>
              <div className="mt-4 h-1 w-full bg-border rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full animate-[progress_2.5s_linear_forwards]" />
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-semibold mb-1">สมัครสมาชิก</h1>
              <p className="text-muted-foreground text-sm mb-7">
                สร้างบัญชีใหม่เพื่อเริ่มต้นช้อปปิ้ง
              </p>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    ชื่อ-นามสกุล <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="register-name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setFieldErrors((p) => ({ ...p, name: undefined }));
                      }}
                      type="text"
                      placeholder="เช่น สมชาย วงศ์สุข"
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors ${
                        fieldErrors.name ? "border-red-400" : "border-border"
                      }`}
                    />
                  </div>
                  {fieldErrors.name && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <X className="w-3 h-3" /> {fieldErrors.name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    อีเมล <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="register-email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setFieldErrors((p) => ({ ...p, email: undefined }));
                      }}
                      type="email"
                      placeholder="example@email.com"
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors ${
                        fieldErrors.email ? "border-red-400" : "border-border"
                      }`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <X className="w-3 h-3" /> {fieldErrors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    เบอร์โทรศัพท์{" "}
                    <span className="text-muted-foreground text-xs font-normal">(ไม่บังคับ)</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="register-phone"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        setFieldErrors((p) => ({ ...p, phone: undefined }));
                      }}
                      type="tel"
                      placeholder="0812345678"
                      className={`w-full pl-9 pr-3.5 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors ${
                        fieldErrors.phone ? "border-red-400" : "border-border"
                      }`}
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <X className="w-3 h-3" /> {fieldErrors.phone}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    รหัสผ่าน <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="register-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setFieldErrors((p) => ({ ...p, password: undefined }));
                      }}
                      type={showPass ? "text" : "password"}
                      placeholder="อย่างน้อย 8 ตัวอักษร"
                      className={`w-full pl-9 pr-10 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors ${
                        fieldErrors.password ? "border-red-400" : "border-border"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength meter */}
                  {password && (
                    <div className="mt-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              i <= passwordStrength ? strengthColor : "bg-border"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        ความแข็งแกร่ง:{" "}
                        <span
                          className={`font-medium ${
                            passwordStrength <= 1
                              ? "text-red-500"
                              : passwordStrength === 2
                              ? "text-amber-500"
                              : passwordStrength === 3
                              ? "text-blue-500"
                              : "text-emerald-600"
                          }`}
                        >
                          {strengthLabel}
                        </span>
                      </p>
                    </div>
                  )}
                  {fieldErrors.password && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <X className="w-3 h-3" /> {fieldErrors.password}
                    </p>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    ยืนยันรหัสผ่าน <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="register-confirm-password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setFieldErrors((p) => ({ ...p, confirmPassword: undefined }));
                      }}
                      type={showConfirmPass ? "text" : "password"}
                      placeholder="กรอกรหัสผ่านอีกครั้ง"
                      className={`w-full pl-9 pr-10 py-2.5 rounded-lg border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors ${
                        fieldErrors.confirmPassword ? "border-red-400" : "border-border"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPass((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showConfirmPass ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    {confirmPassword && password === confirmPassword && (
                      <Check className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
                    )}
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <X className="w-3 h-3" /> {fieldErrors.confirmPassword}
                    </p>
                  )}
                </div>

                {/* API error */}
                {apiError && (
                  <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 text-sm">
                    <X className="w-4 h-4 shrink-0" /> {apiError}
                  </div>
                )}

                <button
                  id="register-submit"
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white rounded-lg py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> กำลังสมัครสมาชิก…
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" /> สมัครสมาชิก
                    </>
                  )}
                </button>
              </form>

              {/* Login link */}
              <div className="mt-6 text-center">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-border" />
                  <span className="text-xs text-muted-foreground">มีบัญชีอยู่แล้ว?</span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 w-full justify-center py-2.5 border border-border rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-accent hover:bg-accent/5 transition-all"
                >
                  เข้าสู่ระบบ
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
