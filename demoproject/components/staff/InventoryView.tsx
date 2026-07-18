"use client";

import { useState } from "react";
import { AlertTriangle, Edit, Check, X } from "lucide-react";
import { BookImg } from "@/components/ui/BookImg";
import type { Book } from "@/lib/data";

export function InventoryView({ books: initialBooks }: { books: Book[] }) {
  const [books, setBooks] = useState(initialBooks.map((b) => ({ ...b })));
  const [editing, setEditing] = useState<number | null>(null);
  const [editVal, setEditVal] = useState("");
  const lowStock = books.filter((b) => b.stock <= 10);

  const saveStock = (id: number) => {
    const val = parseInt(editVal);
    if (!isNaN(val) && val >= 0) setBooks(books.map((b) => b.id === id ? { ...b, stock: val } : b));
    setEditing(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Playfair_Display'] text-xl font-bold">จัดการสต็อกสินค้า</h1>
        <span className="text-xs font-['DM_Mono'] text-muted-foreground">{books.length} รายการ</span>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800">สินค้าใกล้หมด ({lowStock.length} รายการ)</p>
            <p className="text-xs text-amber-700 mt-0.5">{lowStock.map((b) => b.title).join(", ")}</p>
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary border-b border-border">
            <tr>
              {["หนังสือ","หมวดหมู่","ISBN","ราคา","คงเหลือ","สถานะ","แก้ไขสต็อก"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground font-['DM_Mono'] uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {books.map((b) => (
              <tr key={b.id} className={`hover:bg-secondary/40 transition-colors ${b.stock <= 10 ? "bg-amber-50/50" : ""}`}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-10 rounded overflow-hidden shrink-0 bg-muted"><BookImg imgId={b.imgId} alt={b.title} className="w-full h-full" /></div>
                    <div>
                      <p className="font-medium leading-snug text-xs">{b.title}</p>
                      <p className="text-muted-foreground text-[10px]">{b.author}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{b.category}</td>
                <td className="px-4 py-3 font-['DM_Mono'] text-[10px] text-muted-foreground">{b.isbn}</td>
                <td className="px-4 py-3 font-['DM_Mono'] text-xs font-medium">฿{b.price}</td>
                <td className="px-4 py-3 font-['DM_Mono'] font-bold text-sm">{b.stock}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${b.stock === 0 ? "bg-red-50 text-red-700 border-red-200" : b.stock <= 10 ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-green-50 text-green-700 border-green-200"}`}>
                    {b.stock === 0 ? "หมดแล้ว" : b.stock <= 10 ? "ใกล้หมด" : "พร้อมขาย"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {editing === b.id ? (
                    <div className="flex items-center gap-1.5">
                      <input value={editVal} onChange={(e) => setEditVal(e.target.value)} type="number" min={0}
                        className="w-16 px-2 py-1 border border-accent rounded text-sm font-['DM_Mono'] focus:outline-none" autoFocus />
                      <button onClick={() => saveStock(b.id)} className="p-1 text-green-600 hover:bg-green-50 rounded"><Check className="w-4 h-4" /></button>
                      <button onClick={() => setEditing(null)} className="p-1 text-red-500 hover:bg-red-50 rounded"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <button onClick={() => { setEditing(b.id); setEditVal(String(b.stock)); }}
                      className="flex items-center gap-1.5 text-xs text-primary hover:text-accent transition-colors">
                      <Edit className="w-3.5 h-3.5" /> แก้ไข
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
