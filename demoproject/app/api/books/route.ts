import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser, forbiddenResponse } from "@/lib/auth";

interface BookRow {
  id: number;
  title: string;
  author: string;
  isbn: string | null;
  price: number;
  original_price: number;
  stock_qty: number;
  category: string;
  cover_image_url: string | null;
  description: string | null;
  rating: number;
  review_count: number;
}

// ─── GET /api/books — รายการหนังสือพร้อม search/filter/page ─
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search   = searchParams.get("search")?.trim() ?? "";
  const category = searchParams.get("category")?.trim() ?? "";
  const page     = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit    = Math.min(50, Number(searchParams.get("limit") ?? 12));
  const offset   = (page - 1) * limit;

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (search) {
    conditions.push("(title LIKE ? OR author LIKE ? OR isbn LIKE ?)");
    const like = `%${search}%`;
    params.push(like, like, like);
  }
  if (category && category !== "ทั้งหมด") {
    conditions.push("category = ?");
    params.push(category);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const books = await query<BookRow[]>(
    `SELECT id, title, author, isbn, price, original_price,
            stock_qty, category, cover_image_url, description,
            rating, review_count
     FROM books
     ${where}
     ORDER BY id ASC
     LIMIT ${limit} OFFSET ${offset}`,
    params
  );

  const [{ total }] = await query<[{ total: number }]>(
    `SELECT COUNT(*) as total FROM books ${where}`,
    params
  );

  return NextResponse.json({ books, total, page, limit });
}

// ─── POST /api/books — เพิ่มหนังสือใหม่ (admin/staff) ───────
export async function POST(request: NextRequest) {
  const me = await getCurrentUser();
  if (!me) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (me.role === "customer") return forbiddenResponse();

  try {
    const body = await request.json();
    const {
      title, author, isbn, price, original_price,
      stock_qty, category, cover_image_url, description,
    } = body as {
      title?: string; author?: string; isbn?: string;
      price?: number; original_price?: number; stock_qty?: number;
      category?: string; cover_image_url?: string; description?: string;
    };

    if (!title || !author || !price || !category) {
      return NextResponse.json(
        { error: "กรุณากรอก title, author, price และ category" },
        { status: 400 }
      );
    }

    const result = await query<{ insertId: number }>(
      `INSERT INTO books
         (title, author, isbn, price, original_price, stock_qty,
          category, cover_image_url, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(), author.trim(), isbn ?? null,
        price, original_price ?? price,
        stock_qty ?? 0, category.trim(),
        cover_image_url ?? null, description ?? null,
      ]
    );

    return NextResponse.json({ success: true, id: result.insertId }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/books]", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในระบบ" }, { status: 500 });
  }
}
