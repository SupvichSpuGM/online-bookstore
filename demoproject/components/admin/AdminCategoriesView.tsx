"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, X, Tags, CheckCircle2 } from "lucide-react";
import { useAdminStore } from "@/lib/stores/adminStore";

export function AdminCategoriesView() {
  const { categories, addCategory, updateCategory, deleteCategory, showToast } = useAdminStore();
  
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState("");
  
  const [editOld, setEditOld] = useState<string | null>(null);
  const [editCat, setEditCat] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [confirmSave, setConfirmSave] = useState<{ action: 'add' | 'edit' } | null>(null);

  const handleAddClick = () => {
    if (newCat.trim()) {
      setConfirmSave({ action: 'add' });
    }
  };

  const handleEditClick = () => {
    if (editOld && editCat.trim()) {
      setConfirmSave({ action: 'edit' });
    }
  };

  const doConfirmSave = () => {
    if (confirmSave?.action === 'add') {
      addCategory(newCat.trim());
      showToast(`เพิ่มหมวดหมู่ "${newCat.trim()}" สำเร็จ`, "success");
      setShowAdd(false);
      setNewCat("");
    } else if (confirmSave?.action === 'edit') {
      const newName = editCat.trim();
      updateCategory(editOld!, newName);
      showToast(`เปลี่ยนชื่อหมวดหมู่จาก "${editOld}" เป็น "${newName}" สำเร็จ`, "success");
      setEditOld(null);
      setEditCat("");
    }
    setConfirmSave(null);
  };

  const handleDelete = (cat: string) => {
    setConfirmDelete(cat);
  };

  const doConfirmDelete = () => {
    if (confirmDelete) {
      deleteCategory(confirmDelete);
      showToast(`ลบหมวดหมู่ "${confirmDelete}" สำเร็จ`, "success");
      setConfirmDelete(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Playfair_Display'] text-2xl font-bold">จัดการหมวดหมู่</h1>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> เพิ่มหมวดหมู่ใหม่
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden max-w-3xl">
        <table className="w-full text-sm">
          <thead className="bg-secondary border-b border-border">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide w-full">ชื่อหมวดหมู่</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {categories.map((c) => (
              <tr key={c} className="hover:bg-secondary/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Tags className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{c}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => { setEditOld(c); setEditCat(c); }} className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(c)} className="p-1.5 hover:bg-red-50 rounded text-muted-foreground hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={2} className="px-4 py-8 text-center text-muted-foreground">ไม่มีหมวดหมู่</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-['Playfair_Display'] text-lg font-semibold">เพิ่มหมวดหมู่ใหม่</h3>
              <button onClick={() => setShowAdd(false)} className="p-1.5 rounded hover:bg-secondary transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">ชื่อหมวดหมู่</label>
                <input value={newCat} onChange={e => setNewCat(e.target.value)} type="text" placeholder="เช่น นิยายแฟนตาซี" className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm" autoFocus />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border border-border rounded-lg text-sm hover:bg-secondary transition-colors">ยกเลิก</button>
              <button onClick={handleAddClick} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors">บันทึก</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editOld && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditOld(null)}>
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-sm shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-['Playfair_Display'] text-lg font-semibold">แก้ไขหมวดหมู่</h3>
              <button onClick={() => setEditOld(null)} className="p-1.5 rounded hover:bg-secondary transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">เปลี่ยนชื่อจาก "{editOld}" เป็น:</label>
                <input value={editCat} onChange={e => setEditCat(e.target.value)} type="text" className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm" autoFocus />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button onClick={() => setEditOld(null)} className="flex-1 py-2.5 border border-border rounded-lg text-sm hover:bg-secondary transition-colors">ยกเลิก</button>
              <button onClick={handleEditClick} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors">บันทึก</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200" onClick={() => setConfirmDelete(null)}>
          <div className="bg-card rounded-xl border border-border p-6 w-full max-w-sm shadow-xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <Trash2 className="w-12 h-12 text-red-500 mb-4 p-3 bg-red-50 rounded-full" />
            <h3 className="font-['Playfair_Display'] text-xl font-bold mb-2">ยืนยันการลบหมวดหมู่</h3>
            <p className="text-sm text-muted-foreground mb-6">
              คุณต้องการลบหมวดหมู่ "{confirmDelete}" ใช่หรือไม่?<br/>
              <span className="text-xs text-red-500/80 block mt-2">(หนังสือที่อยู่ในหมวดหมู่นี้จะกลายเป็น Uncategorized โดยอัตโนมัติ)</span>
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors">ยกเลิก</button>
              <button onClick={doConfirmDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">ลบหมวดหมู่</button>
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
              {confirmSave.action === 'add' 
                ? `ยืนยันการเพิ่มหมวดหมู่ "${newCat.trim()}" ใช่หรือไม่?`
                : `ยืนยันการเปลี่ยนชื่อหมวดหมู่จาก "${editOld}" เป็น "${editCat.trim()}" ใช่หรือไม่?`
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
