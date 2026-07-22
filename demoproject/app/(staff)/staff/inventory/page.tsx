import { InventoryView } from "@/components/staff/InventoryView";
import { BOOKS as MOCK_BOOKS } from "@/lib/data";

export const metadata = { title: "จัดการสต็อก — Booka Staff" };

async function getBooks() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/books?limit=100`, {
      cache: "no-store",
    });
    if (!res.ok) return MOCK_BOOKS;
    const data = await res.json();
    return data.books && data.books.length > 0 ? data.books : MOCK_BOOKS;
  } catch {
    return MOCK_BOOKS;
  }
}

export default async function InventoryPage() {
  const books = await getBooks();
  return <InventoryView books={books} />;
}
