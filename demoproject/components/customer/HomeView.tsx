"use client";

import Link from "next/link";
import { BookOpen, ChevronRight, Truck, RefreshCw, ShoppingBag } from "lucide-react";
import { BookCard } from "@/components/ui/BookCard";
import { useAuthStore } from "@/lib/stores/authStore";
import type { Book } from "@/lib/data";

const CATEGORIES_DISPLAY = ["ทั้งหมด", "วรรณกรรมไทย", "Fiction", "Self-Help", "ธุรกิจ", "ประวัติศาสตร์"];

export function HomeView({ books }: { books: Book[] }) {
  const { isGuest } = useAuthStore();
  const featured = books.slice(0, 4);
  const newArrivals = books.slice(4, 8);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-primary overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600&h=600&fit=crop&auto=format')", backgroundSize: "cover", backgroundPosition: "center" }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block text-xs font-['DM_Mono'] tracking-widest text-amber-400 uppercase mb-4">
              ร้านหนังสือออนไลน์ · CSI204
            </span>
            <h1 className="font-['Playfair_Display'] text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              ค้นพบโลกใบใหม่<br />
              <span className="italic text-amber-400">ผ่านทุกบทอ่าน</span>
            </h1>
            <p className="text-blue-200 text-base mb-8 leading-relaxed">
              คัดสรรหนังสือคุณภาพกว่า 2,400 รายการ จัดส่งทั่วประเทศ พร้อมระบบติดตามพัสดุแบบ Real-time
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/browse" className="px-6 py-3 bg-accent text-white rounded-lg font-medium hover:bg-amber-700 transition-colors text-sm">
                เลือกดูหนังสือ →
              </Link>
              {isGuest ? (
                <Link href="/login" className="px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors text-sm border border-white/20">
                  เข้าสู่ระบบ / สมัครสมาชิก
                </Link>
              ) : (
                <Link href="/browse" className="px-6 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-colors text-sm border border-white/20">
                  หนังสือแนะนำ
                </Link>
              )}
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 gap-3 rotate-1">
            {featured.map((b) => (
              <div key={b.id} className="rounded-lg overflow-hidden shadow-lg aspect-[3/4] bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://images.unsplash.com/${b.imgId}?w=300&h=420&fit=crop&auto=format`} alt={b.title} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guest banner */}
      {isGuest && (
        <section className="bg-accent/10 border-b border-accent/20">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-sm text-accent font-medium">
              คุณกำลังเข้าชมในฐานะ Guest — สมัครสมาชิกเพื่อสั่งซื้อ
            </p>
            <Link href="/login" className="text-xs px-3 py-1.5 bg-accent text-white rounded-lg font-medium hover:bg-amber-700 transition-colors shrink-0">
              เข้าสู่ระบบ / สมัครสมาชิก
            </Link>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES_DISPLAY.map((cat) => (
            <Link key={cat} href={`/browse?cat=${encodeURIComponent(cat)}`}
              className="px-4 py-2 rounded-full text-sm border border-border bg-card hover:bg-accent hover:text-white hover:border-accent transition-all">
              {cat}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured books */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-['Playfair_Display'] text-2xl font-semibold">หนังสือยอดนิยม</h2>
          <Link href="/browse" className="text-sm text-accent hover:underline flex items-center gap-1">
            ดูทั้งหมด <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {featured.map((b) => <BookCard key={b.id} book={b} />)}
        </div>
      </section>

      {/* Benefits banner */}
      <section className="bg-secondary border-y border-border py-10">
        <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: Truck, title: "จัดส่งฟรี", desc: "เมื่อสั่งซื้อครบ ฿300" },
            { icon: RefreshCw, title: "คืนสินค้าได้", desc: "ภายใน 7 วัน ไม่มีเงื่อนไข" },
            { icon: ShoppingBag, title: "ชำระเงินง่าย", desc: "โอนแล้วแนบสลิปได้เลย" },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <p className="font-medium text-sm">{title}</p>
              <p className="text-muted-foreground text-xs">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <h2 className="font-['Playfair_Display'] text-2xl font-semibold mb-6">มาใหม่ล่าสุด</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {newArrivals.map((b) => <BookCard key={b.id} book={b} />)}
        </div>
      </section>

      {/* CTA join — only for guest */}
      {isGuest && (
        <section className="bg-primary py-14">
          <div className="max-w-xl mx-auto px-4 text-center">
            <BookOpen className="w-10 h-10 text-amber-400 mx-auto mb-4" />
            <h2 className="font-['Playfair_Display'] text-3xl font-bold text-white mb-3">พร้อมเริ่มอ่านแล้วหรือยัง?</h2>
            <p className="text-blue-200 text-sm mb-7 leading-relaxed">สมัครสมาชิกฟรี รับส่วนลด 10% สำหรับการสั่งซื้อครั้งแรก</p>
            <Link href="/login" className="px-8 py-3 bg-accent text-white rounded-lg font-medium hover:bg-amber-700 transition-colors text-sm">
              สมัครสมาชิกฟรี →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
