"use client";

import { useState } from "react";
import { Search, Eye, Edit } from "lucide-react";
import { USERS } from "@/lib/data";

const roleColor: Record<string, string> = {
  customer: "text-blue-700 bg-blue-50 border-blue-200",
  staff:    "text-green-700 bg-green-50 border-green-200",
  admin:    "text-purple-700 bg-purple-50 border-purple-200",
};
const roleLabel: Record<string, string> = { customer: "ลูกค้า", staff: "พนักงาน", admin: "แอดมิน" };

export function AdminUsersView() {
  const [query, setQuery] = useState("");
  const filtered = USERS.filter(
    (u) => u.name.includes(query) || u.email.includes(query)
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Playfair_Display'] text-2xl font-bold">จัดการผู้ใช้</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาผู้ใช้..."
            className="pl-8 pr-4 py-2 rounded-lg bg-card border border-border text-sm focus:border-accent focus:outline-none w-48"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          ["ลูกค้าทั้งหมด", USERS.filter((u) => u.role === "customer").length, "text-blue-600"],
          ["พนักงาน", USERS.filter((u) => u.role === "staff").length, "text-green-600"],
          ["แอดมิน", USERS.filter((u) => u.role === "admin").length, "text-purple-600"],
        ].map(([l, v, c]) => (
          <div key={String(l)} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className={`font-['Playfair_Display'] text-3xl font-bold ${c}`}>{v}</p>
            <p className="text-xs text-muted-foreground mt-1">{l}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary border-b border-border">
            <tr>
              {["ผู้ใช้","อีเมล","บทบาท","สมัครเมื่อ","คำสั่งซื้อ","ยอดรวม","จัดการ"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground font-['DM_Mono'] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-secondary/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold">{u.name[0]}</div>
                    <span className="font-medium text-sm">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground font-['DM_Mono']">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${roleColor[u.role]}`}>{roleLabel[u.role]}</span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{u.joined}</td>
                <td className="px-4 py-3 text-center font-['DM_Mono'] text-xs">{u.orders}</td>
                <td className="px-4 py-3 font-['DM_Mono'] text-xs font-medium">{u.spent > 0 ? `฿${u.spent.toLocaleString()}` : "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
