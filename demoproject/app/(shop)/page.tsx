import { HomeView } from "@/components/customer/HomeView";
import type { Book } from "@/lib/types";

export const metadata = { title: "Booka — ร้านหนังสือออนไลน์" };

async function getBooks(): Promise<Book[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/books?limit=12`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.books ?? [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const books = await getBooks();
  return <HomeView books={books} />;
}
