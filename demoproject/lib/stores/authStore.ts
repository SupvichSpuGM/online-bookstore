import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserAccount } from "@/lib/data";

interface AuthStore {
  user: UserAccount | null;
  isGuest: boolean;
  login: (user: UserAccount) => void;
  logout: () => void;
  setGuestMode: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isGuest: false,

      login: (user) => {
        set({ user, isGuest: false });
        // Also store role in cookie for middleware route protection
        if (typeof document !== "undefined") {
          document.cookie = `booka-role=${user.role}; path=/; max-age=86400; SameSite=Lax`;
        }
      },

      logout: () => {
        set({ user: null, isGuest: false });
        if (typeof document !== "undefined") {
          document.cookie = "booka-role=; path=/; max-age=0";
        }
      },

      setGuestMode: () => set({ isGuest: true, user: null }),
    }),
    {
      name: "booka-auth",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : ({ getItem: () => null, setItem: () => {}, removeItem: () => {} } as unknown as Storage)
      ),
      skipHydration: true,
    }
  )
);
