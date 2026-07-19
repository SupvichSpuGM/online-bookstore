import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, Receipt } from "lucide-react";
import { ORDERS } from "@/lib/data";
import { StatusBadge } from "@/components/ui/StatusBadge";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `รายละเอียดคำสั่งซื้อ ${id} — Booka` };
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = ORDERS.find((o) => o.id === id);

  if (!order) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/orders" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> กลับหน้ารายการสั่งซื้อ
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-['Playfair_Display'] text-2xl font-bold mb-1">
            คำสั่งซื้อ <span className="font-['DM_Mono'] text-primary">#{order.id}</span>
          </h1>
          <p className="text-sm text-muted-foreground">ทำรายการเมื่อ {order.date}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-foreground font-medium mb-2">
            <Package className="w-5 h-5 text-primary" /> ข้อมูลสินค้า
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>จำนวนสินค้ารวม</span>
              <span className="font-['DM_Mono'] text-foreground">{order.items} รายการ</span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 text-foreground font-medium mb-2">
            <MapPin className="w-5 h-5 text-primary" /> จัดส่งไปที่
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="block text-foreground mb-1">{order.customer}</span>
            {order.address}
          </p>
        </div>
      </div>

      <div className="mt-6 bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 text-foreground font-medium mb-4">
          <Receipt className="w-5 h-5 text-primary" /> สรุปยอดชำระ
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>ยอดรวมสินค้า</span>
            <span className="font-['DM_Mono']">฿{order.total}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>ค่าจัดส่ง</span>
            <span className="font-['DM_Mono']">฿0</span>
          </div>
          <div className="pt-3 border-t border-border flex justify-between font-semibold text-lg">
            <span>ยอดสุทธิ</span>
            <span className="font-['DM_Mono'] text-primary">฿{order.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
