import { create } from 'zustand';
import { BOOKS, USERS, CATEGORIES, Book } from '@/lib/data';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  joined: string;
  orders: number;
  spent: number;
}

interface AdminState {
  books: Book[];
  users: AdminUser[];
  categories: string[];
  
  addBook: (book: Omit<Book, 'id'>) => void;
  updateBook: (id: number, book: Partial<Book>) => void;
  deleteBook: (id: number) => void;

  addUser: (user: Omit<AdminUser, 'id'>) => void;
  updateUser: (id: number, user: Partial<AdminUser>) => void;
  deleteUser: (id: number) => void;

  addCategory: (cat: string) => void;
  updateCategory: (oldCat: string, newCat: string) => void;
  deleteCategory: (cat: string) => void;

  toast: { visible: boolean; message: string; type: "success" | "error" } | null;
  showToast: (message: string, type?: "success" | "error") => void;
  hideToast: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  books: [...BOOKS],
  users: [...USERS],
  categories: [...CATEGORIES.filter(c => c !== "ทั้งหมด")], // Filter out default dynamic 'all' if present
  
  addBook: (newBook) => set((state) => ({
    books: [...state.books, { ...newBook, id: Math.max(...state.books.map(b => b.id), 0) + 1 }]
  })),
  
  updateBook: (id, updatedFields) => set((state) => ({
    books: state.books.map(b => b.id === id ? { ...b, ...updatedFields } : b)
  })),
  
  deleteBook: (id) => set((state) => ({
    books: state.books.filter(b => b.id !== id)
  })),

  addUser: (newUser) => set((state) => ({
    users: [...state.users, { ...newUser, id: Math.max(...state.users.map(u => u.id), 0) + 1 }]
  })),
  
  updateUser: (id, updatedFields) => set((state) => ({
    users: state.users.map(u => u.id === id ? { ...u, ...updatedFields } : u)
  })),
  
  deleteUser: (id) => set((state) => ({
    users: state.users.filter(u => u.id !== id)
  })),

  addCategory: (cat) => set((state) => ({
    categories: [...state.categories, cat]
  })),
  
  updateCategory: (oldCat, newCat) => set((state) => ({
    categories: state.categories.map(c => c === oldCat ? newCat : c),
    books: state.books.map(b => b.category === oldCat ? { ...b, category: newCat } : b) // cascade update
  })),
  
  deleteCategory: (cat) => set((state) => ({
    categories: state.categories.filter(c => c !== cat),
    books: state.books.map(b => b.category === cat ? { ...b, category: "Uncategorized" } : b) // default fallback
  })),

  toast: null,
  showToast: (message, type = "success") => {
    set({ toast: { visible: true, message, type } });
    setTimeout(() => {
      set((state) => (state.toast?.message === message ? { toast: null } : state));
    }, 4000);
  },
  hideToast: () => set({ toast: null }),
}));
