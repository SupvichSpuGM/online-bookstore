"use client";

import { useAdminStore } from "@/lib/stores/adminStore";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export function AdminToast() {
  const { toast, hideToast } = useAdminStore();

  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <div
      className="fixed bottom-6 right-6 z-[100] max-w-sm w-full animate-in slide-in-from-bottom-4 fade-in duration-300"
      role="alert"
    >
      <div className={`rounded-xl shadow-2xl overflow-hidden border ${isSuccess ? "bg-green-50 border-green-200 text-green-900" : "bg-red-50 border-red-200 text-red-900"}`}>
        <div className="p-4 flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            {isSuccess ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-red-600" />}
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <p className="font-medium text-sm leading-snug">
              {toast.message}
            </p>
          </div>
          <button
            onClick={hideToast}
            className={`p-1 rounded-lg transition-colors shrink-0 ${isSuccess ? "hover:bg-green-100 text-green-700" : "hover:bg-red-100 text-red-700"}`}
            aria-label="ปิด"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
