import { InventoryView } from "@/components/staff/InventoryView";
import { BOOKS } from "@/lib/data";

export const metadata = { title: "จัดการสต็อก — Booka Staff" };

export default function InventoryPage() {
  return <InventoryView books={BOOKS} />;
}
