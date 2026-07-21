import { Suspense } from "react";
import { BrowseView } from "@/components/customer/BrowseView";
import type { Book } from "@/lib/types";

export const metadata = { title: "เลือกดูหนังสือ — Booka" };

async function getBooks(): Promise<Book[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/books?limit=50`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.books ?? [];
  } catch {
    return [];
  }
}

async function getCategories(): Promise<string[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/categories`,
      { cache: "no-store" }
    );
    if (!res.ok) return ["ทั้งหมด"];
    const data = await res.json();
    return data.categories ?? ["ทั้งหมด"];
  } catch {
    return ["ทั้งหมด"];
  }
}

export default async function BrowsePage() {
  const [books, categories] = await Promise.all([getBooks(), getCategories()]);
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">กำลังโหลด...</div>}>
      <BrowseView books={books} categories={categories} />
    </Suspense>
  );
}
