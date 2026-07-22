import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Book, CartItem } from "@/lib/data";

interface CartStore {
  items: CartItem[];
  addItem: (book: Book) => void;
  removeItem: (bookId: number) => void;
  updateQty: (bookId: number, qty: number) => void;
  clearCart: () => void;
  get count(): number;
  get subtotal(): number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (book) => {
        const items = get().items;
        const existing = items.find((i) => i.book.id === book.id);
        if (existing) {
          set({ items: items.map((i) => i.book.id === book.id ? { ...i, qty: i.qty + 1 } : i) });
        } else {
          set({ items: [...items, { book, qty: 1 }] });
        }
      },

      removeItem: (bookId) => {
        set({ items: get().items.filter((i) => i.book.id !== bookId) });
      },

      updateQty: (bookId, qty) => {
        if (qty <= 0) {
          set({ items: get().items.filter((i) => i.book.id !== bookId) });
        } else {
          set({ items: get().items.map((i) => i.book.id === bookId ? { ...i, qty } : i) });
        }
      },

      clearCart: () => set({ items: [] }),

      get count() {
        return get().items.reduce((s, i) => s + i.qty, 0);
      },

      get subtotal() {
        return get().items.reduce((s, i) => s + i.book.price * i.qty, 0);
      },
    }),
    {
      name: "booka-cart",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : ({ getItem: () => null, setItem: () => {}, removeItem: () => {} } as unknown as Storage)
      ),
      skipHydration: true,
    }
  )
);
