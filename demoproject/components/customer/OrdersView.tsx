"use client";

import Link from "next/link";
import { ChevronRight, Package } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Order } from "@/lib/types";

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("th-TH", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function OrdersView({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h1 className="font-['Playfair_Display'] text-2xl font-bold mb-2">ยังไม่มีคำสั่งซื้อ</h1>
        <p className="text-muted-foreground text-sm mb-6">เริ่มเลือกซื้อหนังสือที่คุณชื่นชอบได้เลย</p>
        <Link href="/browse" className="px-6 py-3 bg-primary text-white rounded-lg text-sm font-medium hover:bg-accent transition-colors">
          เลือกดูหนังสือ →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-['Playfair_Display'] text-2xl font-bold mb-6">คำสั่งซื้อของฉัน</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-['DM_Mono'] text-sm font-medium text-primary">
                  ORD-{String(o.id).padStart(6, "0")}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatDate(o.order_date)}
                  {o.tracking_number && (
                    <span className="ml-2 text-accent">· {o.tracking_number}</span>
                  )}
                </p>
              </div>
              <StatusBadge status={o.status} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                ยอดรวม: <span className="font-semibold text-foreground font-['DM_Mono']">฿{Number(o.total_amount).toLocaleString()}</span>
              </p>
              <Link href={`/orders/${o.id}`} className="text-xs text-accent hover:underline flex items-center gap-1">
                รายละเอียด <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
