"use client";

import { useState } from "react";
import { Bell, Eye, X } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Order } from "@/lib/data";

const FILTERS = [["all","ทั้งหมด"],["pending","รอชำระ"],["payment_review","ตรวจสลิป"],["confirmed","ยืนยัน"],["shipping","จัดส่ง"],["delivered","สำเร็จ"]];
const NEXT_STATUS: Record<string, string> = { pending:"payment_review", payment_review:"confirmed", confirmed:"shipping", shipping:"delivered" };

export function StaffOrdersView({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Order | null>(null);

  const shown = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  const advance = (id: string) =>
    setOrders(orders.map((o) => o.id === id && NEXT_STATUS[o.status] ? { ...o, status: NEXT_STATUS[o.status] as Order["status"] } : o));

  const cancel = (id: string) =>
    setOrders(orders.map((o) => o.id === id ? { ...o, status: "cancelled" } : o));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Playfair_Display'] text-xl font-bold">จัดการคำสั่งซื้อ</h1>
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full font-['DM_Mono']">
            {orders.filter((o) => o.status === "payment_review").length} รอตรวจสอบ
          </span>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map(([v, l]) => (
          <button key={v} onClick={() => setFilter(v)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === v ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-muted text-muted-foreground"}`}>
            {l}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary border-b border-border">
            <tr>
              {["เลขคำสั่งซื้อ","ลูกค้า","วันที่","รายการ","ยอดรวม","สถานะ","จัดการ"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground font-['DM_Mono'] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {shown.map((o) => (
              <tr key={o.id} className="hover:bg-secondary/40 transition-colors">
                <td className="px-4 py-3 font-['DM_Mono'] text-xs text-primary font-medium">{o.id}</td>
                <td className="px-4 py-3 font-medium">{o.customer}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{o.date}</td>
                <td className="px-4 py-3 text-center font-['DM_Mono']">{o.items}</td>
                <td className="px-4 py-3 font-['DM_Mono'] font-semibold">฿{o.total}</td>
                <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => setSelected(o)} className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                    {NEXT_STATUS[o.status] && (
                      <button onClick={() => advance(o.id)} className="px-2.5 py-1 bg-primary text-primary-foreground rounded text-xs hover:bg-accent transition-colors">
                        {o.status === "payment_review" ? "อนุมัติ" : "ถัดไป"}
                      </button>
                    )}
                    {!["delivered","cancelled"].includes(o.status) && (
                      <button onClick={() => cancel(o.id)} className="px-2 py-1 text-red-600 border border-red-200 rounded text-xs hover:bg-red-50 transition-colors">ยกเลิก</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {shown.length === 0 && <p className="text-center text-muted-foreground py-10 text-sm">ไม่มีคำสั่งซื้อในหมวดนี้</p>}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-['Playfair_Display'] text-lg font-semibold">รายละเอียดคำสั่งซื้อ</h3>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded hover:bg-secondary transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="bg-secondary rounded-lg p-3 space-y-2">
                {[["เลขคำสั่งซื้อ",selected.id],["ลูกค้า",selected.customer],["วันที่",selected.date],["ยอดรวม",`฿${selected.total}`]].map(([k,v]) => (
                  <div key={k} className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="font-medium font-['DM_Mono'] text-xs">{v}</span></div>
                ))}
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">ที่อยู่จัดส่ง</p>
                <p className="text-sm">{selected.address}</p>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-muted-foreground">สถานะ</span>
                <StatusBadge status={selected.status} />
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              {NEXT_STATUS[selected.status] && (
                <button onClick={() => { advance(selected.id); setSelected(null); }} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors">
                  {selected.status === "payment_review" ? "อนุมัติการชำระเงิน" : "อัปเดตสถานะ"}
                </button>
              )}
              <button onClick={() => setSelected(null)} className="flex-1 py-2.5 border border-border rounded-lg text-sm hover:bg-secondary transition-colors">ปิด</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
