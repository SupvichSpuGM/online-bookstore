import { StaffOrdersView } from "@/components/staff/StaffOrdersView";
import { ORDERS } from "@/lib/data";

export const metadata = { title: "จัดการคำสั่งซื้อ — Booka Staff" };

export default function StaffPage() {
  return <StaffOrdersView initialOrders={ORDERS} />;
}
