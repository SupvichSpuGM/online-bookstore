"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Check, CheckCircle, ClipboardList, ShoppingBag, User, LogOut } from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";
import { ORDERS } from "@/lib/data";
import { StatusBadge } from "@/components/ui/StatusBadge";

export function ProfileView() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [saved, setSaved] = useState(false);

  if (!user) { router.push("/login"); return null; }

  const myOrders = ORDERS.slice(0, 4);
  const totalSpent = myOrders.reduce((s, o) => s + o.total, 0);

  const handleSave = () => { setSaved(true); setEditing(false); setTimeout(() => setSaved(false), 2500); };
  const handleLogout = () => { logout(); router.push("/"); };

  const roleBadge: Record<string, string> = {
    customer: "bg-amber-100 text-amber-700 border-amber-200",
    staff:    "bg-blue-100  text-blue-700  border-blue-200",
    admin:    "bg-purple-100 text-purple-700 border-purple-200",
  };
  const roleLabel: Record<string, string> = { customer: "Customer", staff: "Staff", admin: "Admin" };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold">โปรไฟล์ของฉัน</h1>
        {saved && (
          <span className="flex items-center gap-1.5 text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1 text-xs font-medium ml-2">
            <CheckCircle className="w-3.5 h-3.5" /> บันทึกแล้ว
          </span>
        )}
      </div>

      {/* Profile card */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-primary to-primary/70" />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-4 -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl border-4 border-card bg-primary flex items-center justify-center shadow-md shrink-0">
              <span className="text-white text-xl font-bold font-['Playfair_Display']">{user.avatar}</span>
            </div>
            <div className="pb-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-semibold">{name}</h2>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${roleBadge[user.role]}`}>{roleLabel[user.role]}</span>
              </div>
              <p className="text-sm text-muted-foreground font-['DM_Mono']">{user.email}</p>
            </div>
            <button onClick={() => setEditing((e) => !e)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${editing ? "bg-secondary border-border text-muted-foreground" : "bg-primary text-white border-transparent hover:bg-primary/90"}`}>
              <Edit className="w-3.5 h-3.5" />
              {editing ? "ยกเลิก" : "แก้ไขโปรไฟล์"}
            </button>
          </div>

          {user.role === "customer" && (
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[["คำสั่งซื้อทั้งหมด", String(myOrders.length)], ["ยอดใช้จ่าย", `฿${totalSpent.toLocaleString()}`], ["สมาชิกมาแล้ว", user.joined]].map(([label, val]) => (
                <div key={label} className="bg-secondary rounded-xl p-4 text-center">
                  <p className="text-lg font-semibold">{val}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          )}

          {editing ? (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className="block text-xs font-medium mb-1.5">ชื่อ-นามสกุล</label><input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-accent" /></div>
                <div><label className="block text-xs font-medium mb-1.5">เบอร์โทรศัพท์</label><input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-accent" /></div>
              </div>
              {user.role === "customer" && (
                <div><label className="block text-xs font-medium mb-1.5">ที่อยู่จัดส่งหลัก</label><textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={2} className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-accent resize-none" /></div>
              )}
              <div className="flex gap-2 justify-end">
                <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors">ยกเลิก</button>
                <button onClick={handleSave} className="px-5 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-1.5">
                  <Check className="w-4 h-4" /> บันทึก
                </button>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
              {[["ชื่อ-นามสกุล", name], ["เบอร์โทรศัพท์", phone], ["อีเมล", user.email], ["สมาชิกตั้งแต่", user.joined], ...(user.role === "customer" ? [["ที่อยู่จัดส่งหลัก", address]] : [])].map(([label, val]) => (
                <div key={label}><p className="text-xs text-muted-foreground mb-0.5">{label}</p><p>{val || "—"}</p></div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent orders */}
      {user.role === "customer" && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-medium flex items-center gap-2"><ClipboardList className="w-4 h-4 text-accent" /> คำสั่งซื้อล่าสุด</h3>
            <button onClick={() => router.push("/orders")} className="text-xs text-accent hover:underline">ดูทั้งหมด →</button>
          </div>
          <div className="divide-y divide-border">
            {myOrders.map((o) => (
              <div key={o.id} className="px-5 py-3.5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium font-['DM_Mono']">{o.id}</p>
                  <p className="text-xs text-muted-foreground">{o.date} · {o.items} รายการ</p>
                </div>
                <p className="text-sm font-medium font-['DM_Mono']">฿{o.total.toLocaleString()}</p>
                <StatusBadge status={o.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm font-medium">
        <LogOut className="w-4 h-4" /> ออกจากระบบ
      </button>
    </div>
  );
}
