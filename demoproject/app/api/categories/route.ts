import { NextResponse } from "next/server";
import { query } from "@/lib/db";

// ─── GET /api/categories — ดึงหมวดหมู่หนังสือทั้งหมด ──────────
export async function GET() {
  const rows = await query<Array<{ category: string }>>(
    "SELECT DISTINCT category FROM books ORDER BY category ASC"
  );

  const categories = ["ทั้งหมด", ...rows.map((r) => r.category)];
  return NextResponse.json({ categories });
}
