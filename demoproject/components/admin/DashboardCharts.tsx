"use client";

import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export interface SalesDataPoint {
  month: string;
  revenue: number;
  orders: number;
}

export function DashboardCharts({ salesData }: { salesData: SalesDataPoint[] }) {
  return (
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
  );
}
