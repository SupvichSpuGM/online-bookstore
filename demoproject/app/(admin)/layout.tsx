import { AdminSidebar } from "@/components/layout/AdminSidebar";

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="ml-56 flex-1 bg-secondary/30">{children}</main>
    </div>
  );
}
