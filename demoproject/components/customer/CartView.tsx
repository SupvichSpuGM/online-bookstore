"use client";

import Link from "next/link";
import { ShoppingCart, Check, Minus, Plus, Trash2 } from "lucide-react";
import { BookImg } from "@/components/ui/BookImg";
import { useCartStore } from "@/lib/stores/cartStore";

export function CartView() {
  const { items, updateQty, clearCart } = useCartStore();
  const subtotal = items.reduce((s, i) => s + i.book.price * i.qty, 0);
  const shipping = subtotal >= 300 ? 0 : 50;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingCart className="w-16 h-16 text-muted mx-auto mb-4" />
        <h2 className="font-['Playfair_Display'] text-2xl font-semibold mb-2">ตะกร้าว่างเปล่า</h2>
        <p className="text-muted-foreground mb-6">เริ่มเลือกหนังสือที่คุณชอบได้เลย</p>
        <Link href="/browse" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-accent transition-colors inline-block">
          เลือกดูหนังสือ
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-['Playfair_Display'] text-2xl font-bold mb-6">ตะกร้าสินค้า ({items.length} รายการ)</h1>
      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        {/* Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.book.id} className="bg-card rounded-xl border border-border p-4 flex gap-4 items-center">
              <div className="w-16 h-20 rounded-lg overflow-hidden shrink-0 bg-muted">
                <BookImg imgId={item.book.imgId} alt={item.book.title} className="w-full h-full" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm leading-snug">{item.book.title}</p>
                <p className="text-muted-foreground text-xs">{item.book.author}</p>
                <p className="text-accent font-semibold text-sm mt-1">฿{item.book.price}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center border border-border rounded-lg overflow-hidden text-sm">
                  <button onClick={() => updateQty(item.book.id, item.qty - 1)} className="px-2.5 py-1.5 hover:bg-secondary transition-colors"><Minus className="w-3 h-3" /></button>
                  <span className="px-3 py-1.5 font-['DM_Mono']">{item.qty}</span>
                  <button onClick={() => updateQty(item.book.id, item.qty + 1)} className="px-2.5 py-1.5 hover:bg-secondary transition-colors"><Plus className="w-3 h-3" /></button>
                </div>
                <button onClick={() => updateQty(item.book.id, 0)} className="p-1.5 text-muted-foreground hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-card border border-border rounded-xl p-5 h-fit">
          <h2 className="font-['Playfair_Display'] text-lg font-semibold mb-4">สรุปคำสั่งซื้อ</h2>
          <div className="space-y-3 text-sm mb-4">
            <div className="flex justify-between"><span className="text-muted-foreground">ยอดรวมสินค้า</span><span className="font-['DM_Mono']">฿{subtotal}</span></div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ค่าจัดส่ง</span>
              <span className={`font-['DM_Mono'] ${shipping === 0 ? "text-green-600" : ""}`}>{shipping === 0 ? "ฟรี" : `฿${shipping}`}</span>
            </div>
            {shipping === 0 && (
              <p className="text-xs text-green-600 bg-green-50 rounded-lg p-2 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> จัดส่งฟรีเมื่อซื้อครบ ฿300
              </p>
            )}
            <hr className="border-border" />
            <div className="flex justify-between font-semibold text-base">
              <span>ยอดรวมทั้งสิ้น</span>
              <span className="font-['DM_Mono'] text-accent">฿{total}</span>
            </div>
          </div>
          <Link href="/checkout" className="block w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-accent transition-colors text-sm text-center">
            ดำเนินการชำระเงิน →
          </Link>
          <Link href="/browse" className="block w-full py-2.5 mt-2 text-muted-foreground text-sm hover:text-foreground transition-colors text-center">
            ← เลือกซื้อเพิ่ม
          </Link>
          <button onClick={clearCart} className="block w-full py-2 mt-1 text-red-500 text-xs hover:text-red-700 transition-colors text-center">
            ล้างตะกร้า
          </button>
        </div>
      </div>
    </div>
  );
}
