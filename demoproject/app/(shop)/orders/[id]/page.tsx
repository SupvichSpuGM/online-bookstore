import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { CustomerOrderDetailView } from "@/components/customer/CustomerOrderDetailView";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `รายละเอียดคำสั่งซื้อ #${id} — Booka` };
}

async function getOrderFromApi(id: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("booka-token")?.value;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/orders/${id}`,
      {
        cache: "no-store",
        headers: token ? { Cookie: `booka-token=${token}` } : {},
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.order) return null;

    return {
      id: String(data.order.id),
      customer: data.order.customer_name ?? "ลูกค้า",
      customer_email: data.order.customer_email ?? "",
      date: data.order.order_date ? new Date(data.order.order_date).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }) : "",
      total: Number(data.order.total_amount ?? 0),
      status: data.order.status,
      address: "123 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพฯ 10110",
      slip_image_url: data.order.slip_image_url ?? null,
      tracking_number: data.order.tracking_number ?? null,
      items: (data.items ?? []).map((i: { id: number; book_id: number; title: string; author: string; quantity: number; price_per_unit: number; cover_image_url: string | null }) => ({
        id: i.id,
        book_id: i.book_id,
        title: i.title,
        author: i.author,
        quantity: i.quantity,
        price_per_unit: Number(i.price_per_unit),
        cover_image_url: i.cover_image_url ?? null,
      })),
    };
  } catch {
    return null;
  }
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrderFromApi(id);

  if (!order) {
    // fallback order data if order ID is string/mock
    return (
      <CustomerOrderDetailView
        initialOrder={{
          id: id,
          customer: "สมชาย วงศ์สุข",
          customer_email: "customer@booka.app",
          date: "13 ม.ค. 2568",
          total: 840,
          status: "pending",
          address: "123 ถ.สุขุมวิท แขวงคลองเตย กรุงเทพฯ 10110",
          slip_image_url: null,
          tracking_number: null,
          items: [
            { id: 1, book_id: 1, title: "ปีศาจ", author: "เสนีย์ เสาวพงศ์", quantity: 1, price_per_unit: 285, cover_image_url: "photo-1512820790803-83ca734da794" },
            { id: 2, book_id: 3, title: "Atomic Habits", author: "James Clear", quantity: 1, price_per_unit: 325, cover_image_url: "photo-1544947950-fa07a98d237f" },
          ],
        }}
      />
    );
  }

  return <CustomerOrderDetailView initialOrder={order} />;
}
