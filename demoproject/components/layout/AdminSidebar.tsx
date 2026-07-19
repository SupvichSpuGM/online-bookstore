"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen, LayoutDashboard, Users, LogOut, Tags
} from "lucide-react";
import { useAuthStore } from "@/lib/stores/authStore";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/books", label: "จัดการหนังสือ", icon: BookOpen },
  { href: "/admin/categories", label: "จัดการหมวดหมู่", icon: Tags },
  { href: "/admin/users", label: "จัดการผู้ใช้", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="w-56 bg-primary text-primary-foreground flex flex-col fixed top-0 bottom-0 z-40">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span className="font-['Playfair_Display'] font-semibold">Booka</span>
        </div>
        <span className="text-[10px] font-['DM_Mono'] text-blue-300 uppercase tracking-widest">
          Admin Panel
        </span>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? "bg-white/20 text-white" : "text-blue-200 hover:bg-white/10"
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-full bg-amber-400 flex items-center justify-center text-primary text-sm font-bold">
            {user?.avatar ?? "A"}
          </div>
          <div>
            <p className="text-sm text-white font-medium leading-none">{user?.name ?? "Admin"}</p>
            <p className="text-[10px] text-blue-300 mt-0.5">Administrator</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-blue-200 hover:bg-white/10 transition-colors"
        >
          <LogOut className="w-4 h-4" /> ออกจากระบบ
        </button>
      </div>
    </aside>
  );
}
