import { create } from "zustand";

interface ToastStore {
  visible: boolean;
  show: () => void;
  hide: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  visible: false,
  show: () => {
    set({ visible: true });
    // Auto-dismiss after 4s
    setTimeout(() => set({ visible: false }), 4000);
  },
  hide: () => set({ visible: false }),
}));
