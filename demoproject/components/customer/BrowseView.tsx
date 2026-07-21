"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, ChevronRight } from "lucide-react";
import { BookCard } from "@/components/ui/BookCard";
import type { Book } from "@/lib/types";

const PRICE_RANGES = ["ต่ำกว่า ฿200", "฿200–350", "฿350–500", "มากกว่า ฿500"];

export function BrowseView({ books, categories }: { books: Book[]; categories: string[] }) {
  const searchParams = useSearchParams();
  const [cat, setCat] = useState(searchParams.get("cat") ?? "ทั้งหมด");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("popular");

  useEffect(() => {
    const c = searchParams.get("cat");
    if (c) setCat(c);
  }, [searchParams]);

  const filtered = books
    .filter(
      (b) =>
        (cat === "ทั้งหมด" || b.category === cat) &&
        (b.title.toLowerCase().includes(query.toLowerCase()) ||
          b.author.toLowerCase().includes(query.toLowerCase()))
    )
    .sort((a, b) =>
      sort === "price_asc" ? a.price - b.price
      : sort === "price_desc" ? b.price - a.price
      : b.review_count - a.review_count
    );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">หน้าหลัก</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground">เลือกดูหนังสือ</span>
      </div>

      <div className="flex gap-6">
        {/* Sidebar filter */}
        <aside className="w-52 shrink-0 hidden md:block">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 font-['DM_Mono']">หมวดหมู่</p>
          <div className="flex flex-col gap-1">
            {categories.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-3 py-2 rounded-lg text-sm text-left transition-colors ${
                  cat === c ? "bg-primary text-primary-foreground font-medium" : "hover:bg-secondary text-muted-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <hr className="my-4 border-border" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3 font-['DM_Mono']">ราคา</p>
          <div className="space-y-2">
            {PRICE_RANGES.map((r) => (
              <label key={r} className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="rounded accent-accent" /> {r}
              </label>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="ค้นหาชื่อหนังสือหรือผู้แต่ง..."
                className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-card border border-border text-sm focus:border-accent focus:outline-none"
              />
            </div>
            <select
              value={sort} onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2.5 rounded-lg bg-card border border-border text-sm focus:outline-none"
            >
              <option value="popular">ยอดนิยม</option>
              <option value="price_asc">ราคา: น้อย–มาก</option>
              <option value="price_desc">ราคา: มาก–น้อย</option>
            </select>
          </div>
          <p className="text-sm text-muted-foreground mb-4">พบ {filtered.length} รายการ</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((b) => <BookCard key={b.id} book={b} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
