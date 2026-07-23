"use client";

import { useState } from "react";
import { Search, Plus, Edit, Trash2, X, CheckCircle2 } from "lucide-react";
import { useAdminStore } from "@/lib/stores/adminStore";
import type { AdminUser } from "@/lib/stores/adminStore";

const roleColor: Record<string, string> = {
  customer: "text-blue-700 bg-blue-50 border-blue-200",
  staff:    "text-green-700 bg-green-50 border-green-200",
  admin:    "text-purple-700 bg-purple-50 border-purple-200",
};
const roleLabel: Record<string, string> = { customer: "ลูกค้า", staff: "พนักงาน", admin: "แอดมิน" };

export function AdminUsersView() {
  const { users, addUser, updateUser, deleteUser, showToast } = useAdminStore();
  const [query, setQuery] = useState("");
  
  const [showAdd, setShowAdd] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number, name: string } | null>(null);
  const [confirmSave, setConfirmSave] = useState<{ isEdit: boolean } | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("customer");

  const filtered = users.filter(
    (u) => u.name.includes(query) || u.email.includes(query)
  );

  const openAdd = () => {
    setName(""); setEmail(""); setRole("customer");
    setEditingUser(null);
    setShowAdd(true);
  };

  const openEdit = (u: AdminUser) => {
    setName(u.name); setEmail(u.email); setRole(u.role);
    setEditingUser(u);
    setShowAdd(true);
  };

  const handleSaveClick = () => {
    setConfirmSave({ isEdit: !!editingUser });
  };

  const doConfirmSave = () => {
    if (editingUser) {
      updateUser(editingUser.id, { name, email, role });
      showToast(`อัปเดตข้อมูลผู้ใช้ "${name}" สำเร็จ`, "success");
    } else {
      addUser({
        name, email, role,
        joined: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' }),
        orders: 0, spent: 0
      });
      showToast(`เพิ่มผู้ใช้ใหม่ "${name}" สำเร็จ`, "success");
    }
    setConfirmSave(null);
    setShowAdd(false);
  };

  const handleDelete = (id: number, name: string) => {
    setConfirmDelete({ id, name });
  };

  const doConfirmDelete = () => {
    if (confirmDelete) {
      deleteUser(confirmDelete.id);
      showToast(`ลบผู้ใช้ "${confirmDelete.name}" สำเร็จ`, "success");
      setConfirmDelete(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Playfair_Display'] text-2xl font-bold">จัดการผู้ใช้</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาผู้ใช้..."
              className="pl-8 pr-4 py-2 rounded-lg bg-card border border-border text-sm focus:border-accent focus:outline-none w-48"
            />
          </div>
          <button onClick={openAdd} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> เพิ่มผู้ใช้
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          ["ลูกค้าทั้งหมด", users.filter((u) => u.role === "customer").length, "text-blue-600"],
          ["พนักงาน", users.filter((u) => u.role === "staff").length, "text-green-600"],
          ["แอดมิน", users.filter((u) => u.role === "admin").length, "text-purple-600"],
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
                    <button onClick={() => openEdit(u)} className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(u.id, u.name)} className="p-1.5 hover:bg-red-50 rounded text-muted-foreground hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">ไม่พบผู้ใช้</td>
              </tr>
            )}
          </tbody>
        </table>
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
                <label className="text-xs text-muted-foreground mb-1.5 block">ชื่อ - นามสกุล</label>
                <input value={name} onChange={e=>setName(e.target.value)} type="text" className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">อีเมล</label>
                <input value={email} onChange={e=>setEmail(e.target.value)} type="email" className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">บทบาท</label>
                <select value={role} onChange={e=>setRole(e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm">
                  {Object.entries(roleLabel).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200" onClick={() => setConfirmDelete(null)}>
          <div className="bg-card rounded-xl border border-border p-6 w-full max-w-sm shadow-xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <Trash2 className="w-12 h-12 text-red-500 mb-4 p-3 bg-red-50 rounded-full" />
            <h3 className="font-['Playfair_Display'] text-xl font-bold mb-2">ยืนยันการลบผู้ใช้</h3>
            <p className="text-sm text-muted-foreground mb-6">
              คุณต้องการลบผู้ใช้ &quot;{confirmDelete.name}&quot; ออกจากระบบใช่หรือไม่?<br/>
              <span className="text-xs text-red-500/80 block mt-2">ประวัติคำสั่งซื้อและข้อมูลของผู้นี้อาจสูญหาย</span>
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors">ยกเลิก</button>
              <button onClick={doConfirmDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">ลบผู้ใช้</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Save Modal */}
      {confirmSave && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4 animate-in fade-in duration-200" onClick={() => setConfirmSave(null)}>
          <div className="bg-card rounded-xl border border-border p-6 w-full max-w-sm shadow-xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-12 flex items-center justify-center bg-primary/10 rounded-full mb-4">
              <CheckCircle2 className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-['Playfair_Display'] text-xl font-bold mb-2">ยืนยันการบันทึก</h3>
            <p className="text-sm text-muted-foreground mb-6">
              {confirmSave.isEdit 
                ? `ยืนยันการอัปเดตข้อมูลของผู้ใช้ "${name}" ใช่หรือไม่?`
                : `ยืนยันการเพิ่มผู้ใช้ใหม่ "${name}" ใช่หรือไม่?`
              }
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setConfirmSave(null)} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors">ไม่ใช่</button>
              <button onClick={doConfirmSave} className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">ใช่, บันทึก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
