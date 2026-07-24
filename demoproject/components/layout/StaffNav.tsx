"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, ClipboardList, Boxes, Bell, LogOut } from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";

const navItems = [
  { href: "/staff", label: "จัดการคำสั่งซื้อ", icon: ClipboardList },
  { href: "/staff/inventory", label: "จัดการสต็อก", icon: Boxes },
];

export function StaffNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    window.setTimeout(() => router.replace("/login"), 0);
  };

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <span className="font-['Playfair_Display'] font-semibold">Booka</span>
            <span className="text-blue-300 text-xs ml-1 font-['DM_Mono']">STAFF</span>
          </div>
          <nav className="flex gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  pathname === href ? "bg-white/20 text-white" : "text-blue-200 hover:bg-white/10"
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Bell className="w-4 h-4 text-amber-400" />
          <span className="text-blue-200">{user?.name ?? "Staff"}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-blue-300 hover:text-white transition-colors text-xs"
          >
            <LogOut className="w-3.5 h-3.5" /> ออก
          </button>
        </div>
      </div>
    </header>
  );
}
