"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Edit, Check, CheckCircle, ClipboardList, Lock, LogOut } from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";
import { StatusBadge } from "@/components/ui/StatusBadge";

type RecentOrder = {
  id: number;
  order_date: string;
  total_amount: number;
  status: string;
};

export function ProfileView() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [saved, setSaved] = useState(false);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const currentUser = user;

  useEffect(() => {
    if (!currentUser) {
      router.replace("/login");
      return;
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "customer") return;

    let active = true;
    const loadOrders = async () => {
      setOrdersLoading(true);
      try {
        const res = await fetch("/api/orders", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load orders");
        const data = await res.json();
        const orders = Array.isArray(data.orders) ? data.orders : [];
        if (active) {
          setRecentOrders(orders.slice(0, 4));
        }
      } catch {
        if (active) {
          setRecentOrders([]);
        }
      } finally {
        if (active) {
          setOrdersLoading(false);
        }
      }
    };

    loadOrders();
    return () => {
      active = false;
    };
  }, [currentUser?.role]);

  if (!currentUser) {
    return null;
  }

  const totalSpent = recentOrders.reduce((s, o) => s + Number(o.total_amount ?? 0), 0);
  const orderCount = recentOrders.length;

  const handleSave = () => { setSaved(true); setEditing(false); setTimeout(() => setSaved(false), 2500); };
  const handleChangePassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("รหัสผ่านใหม่ต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(passwordForm),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error((data as { error?: string }).error || "ไม่สามารถเปลี่ยนรหัสผ่านได้");
      }

      setPasswordSuccess("เปลี่ยนรหัสผ่านสำเร็จแล้ว");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "ไม่สามารถเปลี่ยนรหัสผ่านได้");
    } finally {
      setPasswordLoading(false);
    }
  };
  const handleLogout = () => {
    logout();
    window.setTimeout(() => router.replace("/login"), 0);
  };

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
              <span className="text-white text-xl font-bold font-['Playfair_Display']">{currentUser.avatar}</span>
            </div>
            <div className="pb-1 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-semibold">{name}</h2>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${roleBadge[currentUser.role]}`}>{roleLabel[currentUser.role]}</span>
              </div>
              <p className="text-sm text-muted-foreground font-['DM_Mono']">{currentUser.email}</p>
            </div>
            <button onClick={() => setEditing((e) => !e)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${editing ? "bg-secondary border-border text-muted-foreground" : "bg-primary text-white border-transparent hover:bg-primary/90"}`}>
              <Edit className="w-3.5 h-3.5" />
              {editing ? "ยกเลิก" : "แก้ไขโปรไฟล์"}
            </button>
          </div>

          {currentUser.role === "customer" && (
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[["คำสั่งซื้อทั้งหมด", String(orderCount)], ["ยอดใช้จ่าย", `฿${totalSpent.toLocaleString()}`], ["สมาชิกมาแล้ว", currentUser.joined]].map(([label, val]) => (
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
              {currentUser.role === "customer" && (
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
              {[["ชื่อ-นามสกุล", name], ["เบอร์โทรศัพท์", phone], ["อีเมล", currentUser.email], ["สมาชิกตั้งแต่", currentUser.joined], ...(currentUser.role === "customer" ? [["ที่อยู่จัดส่งหลัก", address]] : [])].map(([label, val]) => (
                <div key={label}><p className="text-xs text-muted-foreground mb-0.5">{label}</p><p>{val || "—"}</p></div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Lock className="w-4 h-4 text-accent" />
          <h3 className="font-medium">เปลี่ยนรหัสผ่าน</h3>
        </div>
        <form onSubmit={handleChangePassword} className="p-5 space-y-4">
          {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
          {passwordSuccess && <p className="text-sm text-green-600">{passwordSuccess}</p>}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-medium mb-1.5">รหัสผ่านปัจจุบัน</label>
              <input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))} className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">รหัสผ่านใหม่</label>
              <input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))} className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-accent" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5">ยืนยันรหัสผ่านใหม่</label>
              <input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))} className="w-full px-3.5 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:border-accent" />
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={passwordLoading} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60">
              {passwordLoading ? "กำลังบันทึก..." : "เปลี่ยนรหัสผ่าน"}
            </button>
          </div>
        </form>
      </div>

      {/* Recent orders */}
      {currentUser.role === "customer" && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <h3 className="font-medium flex items-center gap-2"><ClipboardList className="w-4 h-4 text-accent" /> คำสั่งซื้อล่าสุด</h3>
            <button onClick={() => router.push("/orders")} className="text-xs text-accent hover:underline">ดูทั้งหมด →</button>
          </div>
          <div className="divide-y divide-border">
            {ordersLoading ? (
              <div className="px-5 py-6 text-sm text-muted-foreground">กำลังโหลดคำสั่งซื้อล่าสุด…</div>
            ) : recentOrders.length === 0 ? (
              <div className="px-5 py-6 text-sm text-muted-foreground">ยังไม่มีคำสั่งซื้อในระบบ</div>
            ) : recentOrders.map((o) => (
              <div key={o.id} className="px-5 py-3.5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium font-['DM_Mono']">ORD-{String(o.id).padStart(6, "0")}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(o.order_date).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <p className="text-sm font-medium font-['DM_Mono']">฿{Number(o.total_amount ?? 0).toLocaleString()}</p>
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
