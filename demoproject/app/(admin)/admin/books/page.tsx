import { AdminBooksView } from "@/components/admin/AdminBooksView";
import { BOOKS } from "@/lib/data";

export const metadata = { title: "จัดการหนังสือ — Booka Admin" };

export default function AdminBooksPage() {
  return <AdminBooksView books={BOOKS} />;
}
