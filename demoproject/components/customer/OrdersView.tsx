"use client";

import { ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Order } from "@/lib/data";

export function OrdersView({ orders }: { orders: Order[] }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-['Playfair_Display'] text-2xl font-bold mb-6">คำสั่งซื้อของฉัน</h1>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <p className="font-['DM_Mono'] text-sm font-medium text-primary">{o.id}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{o.date} · {o.items} รายการ</p>
              </div>
              <StatusBadge status={o.status} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                ยอดรวม: <span className="font-semibold text-foreground font-['DM_Mono']">฿{o.total}</span>
              </p>
              <button className="text-xs text-accent hover:underline flex items-center gap-1">
                รายละเอียด <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
