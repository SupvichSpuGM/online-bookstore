import { Suspense } from "react";
import { BrowseView } from "@/components/customer/BrowseView";
import { BOOKS } from "@/lib/data";

export const metadata = { title: "เลือกดูหนังสือ — Booka" };

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">กำลังโหลด...</div>}>
      <BrowseView books={BOOKS} />
    </Suspense>
  );
}
