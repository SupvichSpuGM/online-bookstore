"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/authStore";
import { useCartStore } from "@/lib/stores/cartStore";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Rehydrate Zustand stores from localStorage after mount
    useAuthStore.persist.rehydrate();
    useCartStore.persist.rehydrate();
  }, []);

  return <>{children}</>;
}
