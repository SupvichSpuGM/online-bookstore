import { notFound } from "next/navigation";
import { BOOKS } from "@/lib/data";
import { BookDetailView } from "@/components/customer/BookDetailView";

export async function generateStaticParams() {
  return BOOKS.map((b) => ({ id: String(b.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = BOOKS.find((b) => b.id === Number(id));
  return { title: book ? `${book.title} — Booka` : "ไม่พบหนังสือ" };
}

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = BOOKS.find((b) => b.id === Number(id));
  if (!book) notFound();
  return <BookDetailView book={book} />;
}
