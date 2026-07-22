"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Order as DbOrder } from "@/lib/types";
import type { Order as MockOrder } from "@/lib/data";

type OrderItem = DbOrder | MockOrder;

export function OrdersView({ orders }: { orders: OrderItem[] }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-['Playfair_Display'] text-2xl font-bold mb-6">คำสั่งซื้อของฉัน</h1>
      {orders.length === 0 ? (
        <p className="text-muted-foreground text-sm">ยังไม่มีรายการสั่งซื้อ</p>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => {
            const id = o.id;
            const date = "order_date" in o ? o.order_date : o.date;
            const total = "total_amount" in o ? o.total_amount : o.total;
            const itemsCount = "items" in o ? o.items : undefined;

            return (
              <div key={id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-['DM_Mono'] text-sm font-medium text-primary">#{id}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {date} {itemsCount !== undefined ? `· ${itemsCount} รายการ` : ""}
                    </p>
                  </div>
                  <StatusBadge status={o.status} />
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    ยอดรวม: <span className="font-semibold text-foreground font-['DM_Mono']">฿{total}</span>
                  </p>
                  <Link href={`/orders/${id}`} className="text-xs text-accent hover:underline flex items-center gap-1">
                    รายละเอียด <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
