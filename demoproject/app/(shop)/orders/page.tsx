import { OrdersView } from "@/components/customer/OrdersView";
import { ORDERS } from "@/lib/data";

export const metadata = { title: "คำสั่งซื้อของฉัน — Booka" };

export default function OrdersPage() {
  return <OrdersView orders={ORDERS} />;
}
