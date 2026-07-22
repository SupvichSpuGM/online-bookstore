"use client";

import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart2, ShoppingBag, Package, Users } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Order } from "@/lib/types";

interface SalesDataPoint { month: string; revenue: number; orders: number; }
interface TopBook { book_id: number; title: string; author: string; total_sold: number; revenue: number; }
interface Summary {
  total_revenue: number;
  total_orders: number;
  total_customers: number;
  total_books: number;
}

interface Props {
  salesData: SalesDataPoint[];
  orders: Order[];
  summary?: Summary | null;
  topBooks?: TopBook[];
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" });
  } catch { return dateStr; }
}

export function AdminDashboardView({ salesData, orders, summary, topBooks = [] }: Props) {
  const kpis = [
    {
      label: "ยอดขายรวม",
      value: summary ? `฿${Number(summary.total_revenue ?? 0).toLocaleString()}` : "—",
      icon: BarChart2,
    },
    {
      label: "คำสั่งซื้อทั้งหมด",
      value: summary ? String(summary.total_orders ?? 0) : "—",
      icon: ShoppingBag,
    },
    {
      label: "หนังสือในระบบ",
      value: summary ? String(summary.total_books ?? 0) : "—",
      icon: Package,
    },
    {
      label: "ลูกค้าลงทะเบียน",
      value: summary ? String(summary.total_customers ?? 0) : "—",
      icon: Users,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-['Playfair_Display'] text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">ภาพรวมระบบ</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-muted-foreground">{label}</p>
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <p className="font-['Playfair_Display'] text-2xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-5 mb-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-medium">รายได้รายเดือน (บาท)</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A2E44" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#1A2E44" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,22,18,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `฿${(Number(v) / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => [`฿${Number(v).toLocaleString()}`, "รายได้"]} />
              <Area type="monotone" dataKey="revenue" stroke="#1A2E44" strokeWidth={2} fill="url(#revenueGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="font-medium mb-5">จำนวนคำสั่งซื้อ</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(26,22,18,0.06)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v) => [v, "คำสั่งซื้อ"]} />
              <Bar dataKey="orders" fill="#B45309" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Books */}
      {topBooks.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-medium">หนังสือขายดี</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-secondary border-b border-border">
              <tr>
                {["ชื่อหนังสือ", "ผู้แต่ง", "จำนวนที่ขาย", "รายได้"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground font-['DM_Mono'] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {topBooks.map((b) => (
                <tr key={b.book_id} className="hover:bg-secondary/40 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium">{b.title}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{b.author}</td>
                  <td className="px-4 py-3 font-['DM_Mono'] text-xs">{b.total_sold} เล่ม</td>
                  <td className="px-4 py-3 font-['DM_Mono'] text-xs font-semibold">฿{Number(b.revenue).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recent orders */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-medium">คำสั่งซื้อล่าสุด</h2>
          <span className="text-xs text-muted-foreground">{orders.length} รายการ</span>
        </div>
        {orders.length === 0 ? (
          <p className="px-5 py-6 text-center text-sm text-muted-foreground">ยังไม่มีคำสั่งซื้อ</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-secondary border-b border-border">
              <tr>
                {["เลขคำสั่งซื้อ", "ลูกค้า", "วันที่", "ยอดรวม", "สถานะ"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground font-['DM_Mono'] uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-secondary/40 transition-colors">
                  <td className="px-4 py-3 font-['DM_Mono'] text-xs text-primary font-medium">
                    ORD-{String(o.id).padStart(6, "0")}
                  </td>
                  <td className="px-4 py-3 text-sm">{o.customer_name}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(o.order_date)}</td>
                  <td className="px-4 py-3 font-['DM_Mono'] text-xs font-semibold">฿{Number(o.total_amount).toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
