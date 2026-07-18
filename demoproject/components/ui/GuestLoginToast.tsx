"use client";

import Link from "next/link";
import { X, ShoppingCart, LogIn } from "lucide-react";
import { useToastStore } from "@/lib/stores/toastStore";

export function GuestLoginToast() {
  const { visible, hide } = useToastStore();

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] max-w-sm w-full animate-in slide-in-from-bottom-4 fade-in duration-300"
      role="alert"
    >
      <div className="bg-primary text-primary-foreground rounded-2xl shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-white/20">
          <div className="h-full bg-amber-400 animate-[shrink_4s_linear_forwards]" />
        </div>

        <div className="p-4 flex items-start gap-3">
          {/* Icon */}
          <div className="w-9 h-9 rounded-full bg-amber-400/20 flex items-center justify-center shrink-0 mt-0.5">
            <ShoppingCart className="w-4 h-4 text-amber-400" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm leading-snug">
              ต้องเข้าสู่ระบบก่อน
            </p>
            <p className="text-blue-200 text-xs mt-0.5 leading-relaxed">
              กรุณาเข้าสู่ระบบหรือสมัครสมาชิกเพื่อเพิ่มสินค้าลงตะกร้า
            </p>
            <Link
              href="/login"
              onClick={hide}
              className="inline-flex items-center gap-1.5 mt-2.5 px-3.5 py-1.5 bg-amber-400 text-primary rounded-lg text-xs font-semibold hover:bg-amber-300 transition-colors"
            >
              <LogIn className="w-3.5 h-3.5" />
              เข้าสู่ระบบ / สมัครสมาชิก
            </Link>
          </div>

          {/* Close */}
          <button
            onClick={hide}
            className="p-1 rounded-lg hover:bg-white/10 transition-colors text-blue-200 hover:text-white shrink-0"
            aria-label="ปิด"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
