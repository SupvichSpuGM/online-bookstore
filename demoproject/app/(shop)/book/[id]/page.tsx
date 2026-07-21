import { notFound } from "next/navigation";
import { BookDetailView } from "@/components/customer/BookDetailView";
import type { Book } from "@/lib/types";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

async function getBook(id: string): Promise<Book | null> {
  try {
    const res = await fetch(`${BASE}/api/books/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.book ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getBook(id);
  return { title: book ? `${book.title} — Booka` : "ไม่พบหนังสือ" };
}

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getBook(id);
  if (!book) notFound();
  return <BookDetailView book={book} />;
}
