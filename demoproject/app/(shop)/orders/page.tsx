import { cookies } from "next/headers";
import { OrdersView } from "@/components/customer/OrdersView";
import type { Order } from "@/lib/types";

export const metadata = { title: "คำสั่งซื้อของฉัน — Booka" };

async function getOrders(): Promise<Order[]> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("booka-token")?.value;
    if (!token) return [];

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/orders`,
      {
        cache: "no-store",
        headers: { Cookie: `booka-token=${token}` },
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.orders ?? [];
  } catch {
    return [];
  }
}

export default async function OrdersPage() {
  const orders = await getOrders();
  return <OrdersView orders={orders} />;
}
