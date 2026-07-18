"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Search, ShoppingCart, ClipboardList, User } from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";
import { useCartStore } from "@/lib/stores/cartStore";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isGuest } = useAuthStore();
  const items = useCartStore((s) => s.items);
  const cartCount = items.reduce((s, i) => s + i.qty, 0);

  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <BookOpen className="w-6 h-6 text-accent" />
          <span className="font-['Playfair_Display'] text-lg font-semibold text-foreground leading-none">
            Booka
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="ค้นหาหนังสือ ผู้แต่ง หรือ ISBN..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-secondary text-sm border border-transparent focus:border-accent focus:outline-none transition-colors"
            onFocus={() => router.push("/browse")}
            readOnly
          />
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          {!user && !isGuest && (
            <>
              <Link
                href="/"
                className={`hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm transition-colors rounded-md ${
                  pathname === "/" ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                หน้าแรก
              </Link>
              <Link
                href="/browse"
                className={`hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm transition-colors rounded-md ${
                  pathname === "/browse" ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <BookOpen className="w-4 h-4" /> หนังสือทั้งหมด
              </Link>
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-accent transition-colors"
              >
                <User className="w-4 h-4" /> เข้าสู่ระบบ
              </Link>
            </>
          )}

          {(user || isGuest) && (
            <>
              {user && (
                <Link
                  href="/orders"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
                >
                  <ClipboardList className="w-4 h-4" /> คำสั่งซื้อ
                </Link>
              )}
              <Link href="/cart" className="relative p-2 rounded-md hover:bg-secondary transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-accent text-accent-foreground text-[10px] font-semibold flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>
              {user ? (
                <Link
                  href="/profile"
                  className={`p-1.5 rounded-md hover:bg-secondary transition-colors ${pathname === "/profile" ? "bg-secondary" : ""}`}
                >
                  <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-semibold flex items-center justify-center">
                    {user.avatar}
                  </div>
                </Link>
              ) : (
                <Link href="/login" className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors">
                  <User className="w-4 h-4" /> เข้าสู่ระบบ
                </Link>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
