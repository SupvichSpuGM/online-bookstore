"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { BookImg } from "@/components/ui/BookImg";
import { CATEGORIES } from "@/lib/data";
import type { Book } from "@/lib/data";

export function AdminBooksView({ books }: { books: Book[] }) {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Playfair_Display'] text-2xl font-bold">จัดการหนังสือ</h1>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> เพิ่มหนังสือใหม่
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary border-b border-border">
            <tr>
              {["หนังสือ","หมวดหมู่","ราคา","สต็อก","ยอดรีวิว","จัดการ"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground font-['DM_Mono'] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {books.map((b) => (
              <tr key={b.id} className="hover:bg-secondary/40 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-12 rounded overflow-hidden shrink-0 bg-muted"><BookImg imgId={b.imgId} alt={b.title} className="w-full h-full" /></div>
                    <div>
                      <p className="font-medium text-xs leading-tight">{b.title}</p>
                      <p className="text-muted-foreground text-[10px]">{b.author}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{b.category}</td>
                <td className="px-4 py-3 font-['DM_Mono'] text-xs">฿{b.price}</td>
                <td className="px-4 py-3">
                  <span className={`font-['DM_Mono'] text-xs font-bold ${b.stock <= 10 ? "text-amber-600" : "text-green-700"}`}>{b.stock}</span>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground font-['DM_Mono']">{b.reviews}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <button className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 hover:bg-red-50 rounded text-muted-foreground hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-['Playfair_Display'] text-lg font-semibold">เพิ่มหนังสือใหม่</h3>
              <button onClick={() => setShowAdd(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              {[["ชื่อหนังสือ","text","ใส่ชื่อหนังสือ"],["ผู้แต่ง","text","ชื่อผู้แต่ง"],["ISBN","text","xxx-xxx-xxxxx-x-x"],["ราคา (บาท)","number","0"],["จำนวนสต็อก","number","0"]].map(([label,type,ph]) => (
                <div key={label as string}>
                  <label className="text-xs text-muted-foreground mb-1.5 block">{label}</label>
                  <input type={type as string} placeholder={ph as string} className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm" />
                </div>
              ))}
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">หมวดหมู่</label>
                <select className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm">
                  {CATEGORIES.slice(1).map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors">บันทึก</button>
              <button onClick={() => setShowAdd(false)} className="flex-1 py-2.5 border border-border rounded-lg text-sm hover:bg-secondary transition-colors">ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
