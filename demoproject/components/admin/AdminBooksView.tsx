"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, CheckCircle2 } from "lucide-react";
import { BookImg } from "@/components/ui/BookImg";
import { useAdminStore } from "@/lib/stores/adminStore";
import type { Book } from "@/lib/data";

function mapApiBook(b: any): Book {
  return {
    id: b.id,
    title: b.title,
    author: b.author,
    price: Number(b.price),
    originalPrice: Number(b.original_price ?? b.price),
    category: b.category,
    rating: Number(b.rating ?? 0),
    reviews: Number(b.review_count ?? b.reviews ?? 0),
    stock: Number(b.stock_qty ?? b.stock ?? 0),
    imgId: b.imgId ?? "photo-1544947950-fa07a98d237f",
    isbn: b.isbn ?? "",
    description: b.description ?? "",
  };
}

export function AdminBooksView() {
  const { books, categories, setBooks, addBook, deleteBook, updateBook, showToast } = useAdminStore();
  
  const [showAdd, setShowAdd] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number, title: string } | null>(null);
  const [confirmSave, setConfirmSave] = useState<{ isEdit: boolean, changes: string[] } | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetch("/api/books?limit=100")
      .then((res) => res.json())
      .then((data) => {
        if (data.books && Array.isArray(data.books) && data.books.length > 0) {
          setBooks(data.books.map(mapApiBook));
        }
      })
      .catch((err) => console.error("Error fetching books in Admin:", err));
  }, [setBooks]);

  const openAdd = () => {
    setTitle(""); setAuthor(""); setIsbn(""); setPrice(""); setStock(""); setCategory(categories[0] || "");
    setEditingBook(null);
    setShowAdd(true);
  };

  const openEdit = (b: Book) => {
    setTitle(b.title); setAuthor(b.author); setIsbn(b.isbn); setPrice(b.price.toString()); setStock(b.stock.toString()); setCategory(b.category);
    setEditingBook(b);
    setShowAdd(true);
  };

  const handleSaveClick = () => {
    if (editingBook) {
      const st = Number(stock);
      const cat = category || categories[0];
      const changes: string[] = [];
      if (editingBook.category !== cat) {
        changes.push(`หมวดหมู่ "${editingBook.category}" ➔ "${cat}"`);
      }
      if (editingBook.stock !== st) {
        changes.push(`สต็อก ${editingBook.stock} ➔ ${st}`);
      }
      setConfirmSave({ isEdit: true, changes });
    } else {
      setConfirmSave({ isEdit: false, changes: [] });
    }
  };

  const doConfirmSave = async () => {
    const st = Number(stock);
    const cat = category || categories[0];
    const numPrice = Number(price);

    if (editingBook) {
      // Send PUT request to API database
      try {
        await fetch(`/api/books/${editingBook.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title, author, isbn, category: cat,
            price: numPrice, stock_qty: st
          }),
        });
      } catch (err) {
        console.error("API update error:", err);
      }

      updateBook(editingBook.id, {
        title, author, isbn, category: cat,
        price: numPrice, stock: st
      });
      
      if (confirmSave?.changes && confirmSave.changes.length > 0) {
        showToast(`อัปเดตข้อมูลเรียบร้อย (${confirmSave.changes.join(', ')})`, "success");
      } else {
        showToast(`บันทึกข้อมูลหนังสือสำเร็จ`, "success");
      }
    } else {
      let createdId: number | undefined;
      // Send POST request to API database
      try {
        const res = await fetch("/api/books", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title, author, isbn, category: cat,
            price: numPrice, original_price: numPrice, stock_qty: st,
            cover_image_url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
            description: ""
          }),
        });
        const data = await res.json();
        if (data.id) createdId = data.id;
      } catch (err) {
        console.error("API create error:", err);
      }

      addBook({
        id: createdId!,
        title, author, isbn, category: cat,
        price: numPrice, originalPrice: numPrice, stock: st,
        imgId: "photo-1544947950-fa07a98d237f", rating: 0, reviews: 0, description: ""
      });
      showToast(`เพิ่มหนังสือ "${title}" สำเร็จ`, "success");
    }
    setConfirmSave(null);
    setShowAdd(false);
  };

  const handleDelete = (id: number, title: string) => {
    setConfirmDelete({ id, title });
  };

  const doConfirmDelete = async () => {
    if (confirmDelete) {
      try {
        await fetch(`/api/books/${confirmDelete.id}`, { method: "DELETE" });
      } catch (err) {
        console.error("API delete error:", err);
      }
      deleteBook(confirmDelete.id);
      showToast(`ลบหนังสือ "${confirmDelete.title}" สำเร็จ`, "success");
      setConfirmDelete(null);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-['Playfair_Display'] text-2xl font-bold">จัดการหนังสือ</h1>
        <button onClick={openAdd} className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors flex items-center gap-2">
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
                    <button onClick={() => openEdit(b)} className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(b.id, b.title)} className="p-1.5 hover:bg-red-50 rounded text-muted-foreground hover:text-red-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-['Playfair_Display'] text-lg font-semibold">{editingBook ? "แก้ไขหนังสือ" : "เพิ่มหนังสือใหม่"}</h3>
              <button onClick={() => setShowAdd(false)} className="p-1.5 rounded hover:bg-secondary transition-colors"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">ชื่อหนังสือ</label>
                <input value={title} onChange={e=>setTitle(e.target.value)} type="text" className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">ผู้แต่ง</label>
                <input value={author} onChange={e=>setAuthor(e.target.value)} type="text" className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">ISBN</label>
                <input value={isbn} onChange={e=>setIsbn(e.target.value)} type="text" className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1.5 block">ราคา (บาท)</label>
                  <input value={price} onChange={e=>setPrice(e.target.value)} type="number" className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm" />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1.5 block">สต็อก</label>
                  <input value={stock} onChange={e=>setStock(e.target.value)} type="number" className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">หมวดหมู่</label>
                <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full px-3 py-2.5 rounded-lg bg-secondary border border-transparent focus:border-accent focus:outline-none text-sm">
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 mt-5">
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
            <h3 className="font-['Playfair_Display'] text-xl font-bold mb-2">ยืนยันการลบหนังสือ</h3>
            <p className="text-sm text-muted-foreground mb-6">
              คุณต้องการลบหนังสือ &quot;{confirmDelete.title}&quot; ออกจากระบบใช่หรือไม่?<br/>
              <span className="text-xs text-red-500/80 block mt-2">การดำเนินการนี้ไม่สามารถเรียกคืนได้</span>
            </p>
            <div className="flex gap-3 w-full">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium hover:bg-secondary transition-colors">ยกเลิก</button>
              <button onClick={doConfirmDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">ลบหนังสือ</button>
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
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              {confirmSave.isEdit 
                ? (confirmSave.changes.length > 0 
                  ? <span>คุณต้องการยืนยันการเปลี่ยนแปลงต่อไปนี้ใช่หรือไม่?<br/><br/><span className="font-semibold text-foreground block bg-secondary/50 p-3 rounded-lg text-left">{confirmSave.changes.map(c => <span key={c} className="block">• {c}</span>)}</span></span> 
                  : "คุณยังไม่ได้แก้ไขข้อมูลใดๆ ต้องการบันทึกใช่หรือไม่?")
                : `ต้องการเพิ่มหนังสือใหม่ "${title}" ใช่หรือไม่?`
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
