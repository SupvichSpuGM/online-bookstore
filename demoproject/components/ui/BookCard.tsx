"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus } from "lucide-react";
import { BookImg } from "@/components/ui/BookImg";
import { Stars } from "@/components/ui/Stars";
import { useCartStore } from "@/lib/stores/cartStore";
import { useAuthStore } from "@/lib/stores/authStore";
import { useToastStore } from "@/lib/stores/toastStore";
import type { Book } from "@/lib/data";

export function BookCard({ book }: { book: Book }) {
  const [added, setAdded] = useState(false);
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const { user, isGuest } = useAuthStore();
  const showToast = useToastStore((s) => s.show);

  const handleCart = () => {
    // ยังไม่ได้ login เลย → redirect ไปหน้า login
    if (!user && !isGuest) {
      router.push("/login");
      return;
    }
    // Guest mode → แสดง toast เตือนให้ login
    if (isGuest) {
      showToast();
      return;
    }
    addItem(book);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="group flex flex-col bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-all">
      <button
        onClick={() => router.push(`/book/${book.id}`)}
        className="relative aspect-[3/4] bg-muted overflow-hidden"
      >
        <BookImg
          imgId={book.imgId}
          alt={book.title}
          className="w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        {book.stock <= 10 && (
          <span className="absolute top-2 left-2 text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded font-medium">
            เหลือน้อย
          </span>
        )}
        {book.originalPrice > book.price && (
          <span className="absolute top-2 right-2 text-[10px] bg-accent text-white px-1.5 py-0.5 rounded font-medium">
            ลด {Math.round((1 - book.price / book.originalPrice) * 100)}%
          </span>
        )}
      </button>

      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <button onClick={() => router.push(`/book/${book.id}`)} className="text-left">
          <p className="font-medium text-sm leading-snug line-clamp-2 hover:text-accent transition-colors">
            {book.title}
          </p>
          <p className="text-muted-foreground text-xs mt-0.5">{book.author}</p>
        </button>

        <div className="flex items-center gap-1 mt-auto">
          <Stars rating={book.rating} />
          <span className="text-[10px] text-muted-foreground font-['DM_Mono']">
            ({book.reviews})
          </span>
        </div>

        <div className="flex items-center justify-between mt-1">
          <div>
            <span className="font-semibold text-sm">฿{book.price}</span>
            {book.originalPrice > book.price && (
              <span className="text-muted-foreground text-xs line-through ml-1">
                ฿{book.originalPrice}
              </span>
            )}
          </div>
          <button
            onClick={handleCart}
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
              added
                ? "bg-green-500 text-white"
                : "bg-secondary hover:bg-accent hover:text-white"
            }`}
          >
            {added ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
