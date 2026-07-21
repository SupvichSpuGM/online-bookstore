"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingCart, Check, Plus, Minus } from "lucide-react";
import { BookImg } from "@/components/ui/BookImg";
import { Stars } from "@/components/ui/Stars";
import { useCartStore } from "@/lib/stores/cartStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { useToastStore } from "@/lib/stores/toastStore";
import type { Book } from "@/lib/types";
import { getBookImageUrl } from "@/lib/types";

const REVIEWS = [
  { name: "สมชาย ว.", rating: 5, date: "10 ม.ค. 2568", text: "อ่านแล้วสะท้อนใจมาก เขียนได้ลึกซึ้งมาก แนะนำเลย" },
  { name: "นภา ร.", rating: 4, date: "5 ม.ค. 2568", text: "หนังสือดีมาก ส่งเร็ว บรรจุหีบห่ออย่างดี ขอบคุณครับ" },
  { name: "กิตติ ช.", rating: 5, date: "28 ธ.ค. 2567", text: "ซื้อมาอ่านครั้งที่สาม ยังคงประทับใจทุกครั้ง" },
];

export function BookDetailView({ book }: { book: Book }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const { user, isGuest } = useAuthStore();
  const showToast = useToastStore((s) => s.show);

  const canBuy = !!user && !isGuest;

  const handleAddToCart = async () => {
    if (!user && !isGuest) { router.push("/login"); return; }
    if (isGuest) { showToast(); return; }
    // POST ไป API
    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book_id: book.id, quantity: qty }),
      });
    } catch { /* fail silently */ }
    // Optimistic Zustand update
    for (let i = 0; i < qty; i++) addItem({
      id: book.id, title: book.title, author: book.author,
      price: book.price, originalPrice: book.original_price,
      category: book.category, rating: book.rating,
      reviews: book.review_count, stock: book.stock_qty,
      imgId: "", isbn: book.isbn ?? "", description: book.description ?? "",
    } as Parameters<typeof addItem>[0]);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> กลับไปเลือกหนังสือ
      </button>

      <div className="grid md:grid-cols-[280px_1fr] gap-10">
        {/* Book cover */}
        <div>
          <div className="rounded-xl overflow-hidden shadow-lg aspect-[3/4] bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={getBookImageUrl(book)} alt={book.title} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5">
          <div>
            <span className="inline-block text-xs font-['DM_Mono'] text-accent bg-accent/10 px-2.5 py-1 rounded-full mb-3">
              {book.category}
            </span>
            <h1 className="font-['Playfair_Display'] text-3xl font-bold leading-tight mb-2">{book.title}</h1>
            <p className="text-muted-foreground">โดย <span className="text-foreground font-medium">{book.author}</span></p>
          </div>

          <div className="flex items-center gap-3">
            <Stars rating={book.rating} />
            <span className="text-sm font-['DM_Mono'] text-muted-foreground">{book.rating} ({book.review_count} รีวิว)</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="font-['Playfair_Display'] text-3xl font-bold">฿{book.price}</span>
            {book.original_price > book.price && (
              <>
                <span className="text-muted-foreground line-through text-lg">฿{book.original_price}</span>
                <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded font-medium">
                  ประหยัด ฿{book.original_price - book.price}
                </span>
              </>
            )}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">{book.description}</p>

          <div className="grid grid-cols-2 gap-3 text-sm">
            {[["ISBN", book.isbn ?? "-"], ["คงเหลือ", `${book.stock_qty} เล่ม`]].map(([k, v]) => (
              <div key={k} className="bg-secondary rounded-lg p-3">
                <p className="text-muted-foreground text-xs mb-0.5 font-['DM_Mono']">{k}</p>
                <p className="font-medium">{v}</p>
              </div>
            ))}
          </div>

          {/* Case 1: ลูกค้าที่ login แล้ว — แสดง qty + ปุ่มเพิ่มตะกร้า */}
          {canBuy && (
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2.5 hover:bg-secondary transition-colors"><Minus className="w-4 h-4" /></button>
                <span className="px-5 py-2.5 font-['DM_Mono'] text-sm border-x border-border">{qty}</span>
                <button onClick={() => setQty(Math.min(book.stock_qty, qty + 1))} className="px-3 py-2.5 hover:bg-secondary transition-colors"><Plus className="w-4 h-4" /></button>
              </div>
              <button onClick={handleAddToCart}
                className={`flex-1 py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2 ${added ? "bg-green-600 text-white" : "bg-primary text-primary-foreground hover:bg-accent"}`}>
                {added ? <><Check className="w-4 h-4" /> เพิ่มแล้ว!</> : <><ShoppingCart className="w-4 h-4" /> เพิ่มลงตะกร้า</>}
              </button>
            </div>
          )}

          {/* Case 2: Guest mode — แสดง qty + ปุ่มที่จะ trigger toast เตือน */}
          {isGuest && (
            <div className="pt-2">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2.5 hover:bg-secondary transition-colors"><Minus className="w-4 h-4" /></button>
                  <span className="px-5 py-2.5 font-['DM_Mono'] text-sm border-x border-border">{qty}</span>
                  <button onClick={() => setQty(Math.min(book.stock_qty, qty + 1))} className="px-3 py-2.5 hover:bg-secondary transition-colors"><Plus className="w-4 h-4" /></button>
                </div>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 rounded-lg font-medium text-sm bg-primary text-primary-foreground hover:bg-accent transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" /> เพิ่มลงตะกร้า
                </button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                ⚠️ ต้องเข้าสู่ระบบก่อนสั่งซื้อ
              </p>
            </div>
          )}

          {/* Case 3: ยังไม่ได้ login และไม่ใช่ guest — แสดงปุ่ม redirect */}
          {!canBuy && !isGuest && (
            <div className="bg-accent/5 border border-accent/20 rounded-xl p-5 flex flex-col gap-3">
              <p className="text-sm text-muted-foreground">เข้าสู่ระบบเพื่อซื้อหนังสือเล่มนี้</p>
              <button onClick={() => router.push("/login")} className="w-full py-3 rounded-lg font-medium text-sm bg-primary text-primary-foreground hover:bg-accent transition-all flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" /> เข้าสู่ระบบเพื่อสั่งซื้อ
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-12 border-t border-border pt-8">
        <h2 className="font-['Playfair_Display'] text-xl font-semibold mb-5">รีวิวจากผู้อ่าน</h2>
        <div className="space-y-4">
          {REVIEWS.map((r) => (
            <div key={r.name} className="bg-card border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium">{r.name[0]}</div>
                  <span className="font-medium text-sm">{r.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Stars rating={r.rating} />
                  <span className="text-xs text-muted-foreground font-['DM_Mono']">{r.date}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">{r.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
