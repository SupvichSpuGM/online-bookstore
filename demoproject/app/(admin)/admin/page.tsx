import { AdminDashboardView } from "@/components/admin/AdminDashboardView";
import { SALES_DATA, ORDERS } from "@/lib/data";

export const metadata = { title: "Dashboard — Booka Admin" };

export default function AdminPage() {
  return <AdminDashboardView salesData={SALES_DATA} orders={ORDERS} />;
}
