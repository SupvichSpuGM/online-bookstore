"use client";

import { useState, useCallback } from "react";
import { Search, Plus, Edit, Trash2, X, CheckCircle2, RefreshCw, Phone } from "lucide-react";
import { useAdminStore } from "@/lib/stores/adminStore";

const roleColor: Record<string, string> = {
  customer: "text-blue-700 bg-blue-50 border-blue-200",
  staff:    "text-green-700 bg-green-50 border-green-200",
  admin:    "text-purple-700 bg-purple-50 border-purple-200",
};
const roleLabel: Record<string, string> = { customer: "ลูกค้า", staff: "พนักงาน", admin: "แอดมิน" };

export interface ApiUser {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  created_at: string;
  order_count: number;
  total_spent: number;
}

interface Props {
  initialUsers: ApiUser[];
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("th-TH", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch { return dateStr; }
}

export function AdminUsersView({ initialUsers }: Props) {
  const { showToast } = useAdminStore();
  const [users, setUsers] = useState<ApiUser[]>(initialUsers);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [showAdd, setShowAdd] = useState(false);
  const [editingUser, setEditingUser] = useState<ApiUser | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; name: string } | null>(null);
  const [confirmSave, setConfirmSave] = useState<{ isEdit: boolean } | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("customer");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const filtered = users.filter((u) => {
    const matchSearch = u.name.includes(query) || u.email.includes(query);
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const refreshUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/users?limit=100", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users ?? []);
      }
    } catch { /* ignore */ }
  }, []);

  const openAdd = () => {
    setName(""); setEmail(""); setPhone(""); setRole("customer"); setPassword("");
    setFormError("");
    setEditingUser(null);
    setShowAdd(true);
  };

  const openEdit = (u: ApiUser) => {
    setName(u.name); setEmail(u.email); setPhone(u.phone ?? ""); setRole(u.role); setPassword("");
    setFormError("");
    setEditingUser(u);
    setShowAdd(true);
  };

  const handleSaveClick = () => {
    if (!name.trim()) { setFormError("กรุณากรอกชื่อ-นามสกุล"); return; }
    if (!email.trim()) { setFormError("กรุณากรอกอีเมล"); return; }
    if (!editingUser && !password) { setFormError("กรุณากรอกรหัสผ่านสำหรับผู้ใช้ใหม่"); return; }
    setFormError("");
    setConfirmSave({ isEdit: !!editingUser });
  };

  const doConfirmSave = async () => {
    setSaving(true);
    try {
      if (editingUser) {
        // PUT /api/users/[id]
        const res = await fetch(`/api/users/${editingUser.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), phone: phone.trim() || null, role }),
        });
        if (!res.ok) {
          const d = await res.json();
          showToast(d.error ?? "เกิดข้อผิดพลาด", "error");
        } else {
          showToast(`อัปเดตข้อมูลผู้ใช้ "${name}" สำเร็จ`, "success");
          await refreshUsers();
        }
      } else {
        // POST /api/users
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), email: email.trim(), password, phone: phone.trim() || undefined, role }),
        });
        if (!res.ok) {
          const d = await res.json();
          showToast(d.error ?? "เกิดข้อผิดพลาด", "error");
        } else {
          showToast(`เพิ่มผู้ใช้ใหม่ "${name}" สำเร็จ`, "success");
          await refreshUsers();
        }
      }
    } catch {
      showToast("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์", "error");
    } finally {
      setSaving(false);
      setConfirmSave(null);
      setShowAdd(false);
    }
  };

  const handleDelete = (id: number, userName: string) => {
    setConfirmDelete({ id, name: userName });
  };

  const doConfirmDelete = async () => {
    if (!confirmDelete) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/users/${confirmDelete.id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json();
        showToast(d.error ?? "ลบไม่สำเร็จ", "error");
      } else {
        showToast(`ลบผู้ใช้ "${confirmDelete.name}" สำเร็จ`, "success");
        setUsers((prev) => prev.filter((u) => u.id !== confirmDelete.id));
      }
    } catch {
      showToast("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์", "error");
    } finally {
      setSaving(false);
      setConfirmDelete(null);
    }
  };

  const counts = {
    customer: users.filter((u) => u.role === "customer").length,
    staff:    users.filter((u) => u.role === "staff").length,
    admin:    users.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Playfair_Display'] text-2xl font-bold">จัดการผู้ใช้</h1>
        <div className="flex gap-3">
          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-card border border-border text-sm focus:border-accent focus:outline-none"
          >
            <option value="all">ทุกบทบาท</option>
            <option value="customer">ลูกค้า</option>
            <option value="staff">พนักงาน</option>
            <option value="admin">แอดมิน</option>
          </select>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาผู้ใช้..."
              className="pl-8 pr-4 py-2 rounded-lg bg-card border border-border text-sm focus:border-accent focus:outline-none w-48"
            />
          </div>
          {/* Refresh */}
          <button
            onClick={refreshUsers}
            className="p-2 rounded-lg bg-card border border-border hover:bg-secondary transition-colors"
            title="รีเฟรชข้อมูล"
          >
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={openAdd}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> เพิ่มผู้ใช้
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          ["ลูกค้าทั้งหมด", counts.customer, "text-blue-600"],
          ["พนักงาน", counts.staff, "text-green-600"],
          ["แอดมิน", counts.admin, "text-purple-600"],
        ].map(([l, v, c]) => (
          <div key={String(l)} className="bg-card border border-border rounded-xl p-4 text-center">
            <p className={`font-['Playfair_Display'] text-3xl font-bold ${c}`}>{v}</p>
            <p className="text-xs text-muted-foreground mt-1">{l}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">ไม่พบผู้ใช้ที่ตรงกับเงื่อนไข</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary border-b border-border">
                <tr>
                  {["ผู้ใช้", "อีเมล", "เบอร์โทร", "บทบาท", "สมัครเมื่อ", "คำสั่งซื้อ", "ยอดรวม", "จัดการ"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground font-['DM_Mono'] uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-secondary/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold shrink-0">
                          {u.name?.[0] ?? "?"}
                        </div>
                        <div>
                          <p className="font-medium text-sm leading-tight">{u.name}</p>
                          <p className="text-xs text-muted-foreground font-['DM_Mono']">#{u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground font-['DM_Mono']">{u.email}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {u.phone ? (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />{u.phone}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${roleColor[u.role] ?? ""}`}>
                        {roleLabel[u.role] ?? u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatDate(u.created_at)}</td>
                    <td className="px-4 py-3 text-center font-['DM_Mono'] text-xs">{u.order_count}</td>
                    <td className="px-4 py-3 font-['DM_Mono'] text-xs font-medium">
                      {Number(u.total_spent) > 0 ? `฿${Number(u.total_spent).toLocaleString()}` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(u)} className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors" title="แก้ไข">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(u.id, u.name)} className="p-1.5 hover:bg-red-50 rounded text-muted-foreground hover:text-red-600 transition-colors" title="ลบ">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-4 py-2.5 border-t border-border bg-secondary/30 text-xs text-muted-foreground">
          แสดง {filtered.length} จาก {users.length} ผู้ใช้
        </div>
      </div>

      {/* Add/Edit modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-['Playfair_Display'] text-lg font-semibold">{editingUser ? "แก้ไขผู้ใช้" : "เพิ่มผู้ใช้ใหม่"}</h3>
              <button onClick={() => setShowAdd(false)} className="p-1.5 rounded hover:bg-secondary transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">ชื่อ - นามสกุล <span className="text-red-500">*</span></label>
                <input value={name} onChange={e => setName(e.target.value)} type="text"
                  className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm"
                  placeholder="เช่น สมชาย วงศ์สุข" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">อีเมล <span className="text-red-500">*</span></label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email"
                  disabled={!!editingUser}
                  className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="example@email.com" />
                {editingUser && <p className="text-xs text-muted-foreground mt-1">ไม่สามารถเปลี่ยนอีเมลได้</p>}
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">เบอร์โทรศัพท์</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} type="tel"
                  className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm"
                  placeholder="0812345678" />
              </div>
              {!editingUser && (
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">รหัสผ่าน <span className="text-red-500">*</span></label>
                  <input value={password} onChange={e => setPassword(e.target.value)} type="password"
                    className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm"
                    placeholder="อย่างน้อย 8 ตัวอักษร" />
                </div>
              )}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">บทบาท</label>
                <select value={role} onChange={e => setRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm">
                  {Object.entries(roleLabel).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
              {formError && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs">
                  <X className="w-3.5 h-3.5 shrink-0" />{formError}
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border border-border rounded-lg text-sm hover:bg-secondary transition-colors">ยกเลิก</button>
              <button onClick={handleSaveClick} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors">บันทึก</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4" onClick={() => setConfirmDelete(null)}>
          <div className="bg-card rounded-xl border border-border p-6 w-full max-w-sm shadow-xl flex flex-col items-center text-center" onClick={(e) => e.stopPropagation()}>
            <Trash2 className="w-12 h-12 text-red-500 mb-4 p-3 bg-red-50 rounded-full" />
            <h3 className="font-['Playfair_Display'] text-xl font-bold mb-2">ยืนยันการลบผู้ใช้</h3>
            <p className="text-sm text-muted-foreground mb-6">
              คุณต้องการลบผู้ใช้ &quot;{confirmDelete.name}&quot; ออกจากระบบใช่หรือไม่?<br/>
              <span className="text-xs text-red-500/80 block mt-2">การลบอาจล้มเหลวหากผู้ใช้มีคำสั่งซื้อในระบบ</span>
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setConfirmDelete(null)} disabled={saving} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50">ยกเลิก</button>
              <button onClick={doConfirmDelete} disabled={saving} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {saving ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> กำลังลบ…</> : "ลบผู้ใช้"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Save Modal */}
      {confirmSave && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4" onClick={() => setConfirmSave(null)}>
          <div className="bg-card rounded-xl border border-border p-6 w-full max-w-sm shadow-xl flex flex-col items-center text-center" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full mb-4">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-['Playfair_Display'] text-xl font-bold mb-2">ยืนยันการบันทึก</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {confirmSave.isEdit
                ? `ยืนยันการอัปเดตข้อมูลของผู้ใช้ "${name}" ใช่หรือไม่?`
                : `ยืนยันการเพิ่มผู้ใช้ใหม่ "${name}" ใช่หรือไม่?`}
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setConfirmSave(null)} disabled={saving} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50">ไม่ใช่</button>
              <button onClick={doConfirmSave} disabled={saving} className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {saving ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> กำลังบันทึก…</> : "ใช่, บันทึก"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
