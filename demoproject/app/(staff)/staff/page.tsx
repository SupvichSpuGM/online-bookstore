import { cookies } from "next/headers";
import { StaffOrdersView } from "@/components/staff/StaffOrdersView";
import { ORDERS as MOCK_ORDERS } from "@/lib/data";

export const metadata = { title: "จัดการคำสั่งซื้อ — Booka Staff" };

async function getOrders() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("booka-token")?.value;
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/orders`, {
      cache: "no-store",
      headers: token ? { Cookie: `booka-token=${token}` } : {},
    });
    if (!res.ok) return MOCK_ORDERS;
    const data = await res.json();
    return data.orders && data.orders.length > 0 ? data.orders : MOCK_ORDERS;
  } catch {
    return MOCK_ORDERS;
  }
}

export default async function StaffPage() {
  const orders = await getOrders();
  return <StaffOrdersView initialOrders={orders} />;
}
