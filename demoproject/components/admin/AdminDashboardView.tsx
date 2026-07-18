"use client";

import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart2, ShoppingBag, Package, Users } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import type { Order } from "@/lib/data";

interface SalesDataPoint { month: string; revenue: number; orders: number; }

interface Props {
  salesData: SalesDataPoint[];
  orders: Order[];
}

const KPIS = [
  { label: "ยอดขายเดือนนี้", value: "฿53,400", change: "+11.7%", up: true, icon: BarChart2 },
  { label: "คำสั่งซื้อทั้งหมด", value: "197", change: "+4.2%", up: true, icon: ShoppingBag },
  { label: "หนังสือในสต็อก", value: "2,418", change: "-32 เล่ม", up: false, icon: Package },
  { label: "ลูกค้าลงทะเบียน", value: "1,084", change: "+23 คน", up: true, icon: Users },
];

export function AdminDashboardView({ salesData, orders }: Props) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-['Playfair_Display'] text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">ภาพรวมระบบ — 13 มกราคม 2568</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {KPIS.map(({ label, value, change, up, icon: Icon }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs text-muted-foreground">{label}</p>
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <p className="font-['Playfair_Display'] text-2xl font-bold">{value}</p>
            <p className={`text-xs mt-1 font-['DM_Mono'] ${up ? "text-green-600" : "text-red-500"}`}>{change} จากเดือนที่แล้ว</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-5 mb-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-medium">รายได้รายเดือน (บาท)</h2>
            <span className="text-xs text-muted-foreground font-['DM_Mono']">ส.ค. 2567 – ม.ค. 2568</span>
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
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `฿${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [`฿${v.toLocaleString()}`, "รายได้"]} />
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
              <Tooltip formatter={(v: number) => [v, "คำสั่งซื้อ"]} />
              <Bar dataKey="orders" fill="#B45309" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h2 className="font-medium">คำสั่งซื้อล่าสุด</h2>
          <span className="text-xs text-muted-foreground">{orders.length} รายการ</span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-secondary border-b border-border">
            <tr>
              {["เลขคำสั่งซื้อ","ลูกค้า","วันที่","ยอดรวม","สถานะ"].map((h) => (
                <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-muted-foreground font-['DM_Mono'] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-secondary/40 transition-colors">
                <td className="px-4 py-3 font-['DM_Mono'] text-xs text-primary font-medium">{o.id}</td>
                <td className="px-4 py-3 text-sm">{o.customer}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{o.date}</td>
                <td className="px-4 py-3 font-['DM_Mono'] text-xs font-semibold">฿{o.total}</td>
                <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
