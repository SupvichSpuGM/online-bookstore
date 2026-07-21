import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser, forbiddenResponse, unauthorizedResponse } from "@/lib/auth";

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

// ─── GET /api/books/[id] — ดูรายละเอียดหนังสือ ───────────────
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const books = await query<BookRow[]>(
    `SELECT id, title, author, isbn, price, original_price,
            stock_qty, category, cover_image_url, description,
            rating, review_count
     FROM books WHERE id = ? LIMIT 1`,
    [Number(id)]
  );

  if (books.length === 0) {
    return NextResponse.json({ error: "ไม่พบหนังสือ" }, { status: 404 });
  }

  return NextResponse.json({ book: books[0] });
}

// ─── PUT /api/books/[id] — แก้ไขหนังสือ (admin/staff) ───────
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const me = await getCurrentUser();
  if (!me) return unauthorizedResponse();
  if (me.role === "customer") return forbiddenResponse();

  const { id } = await params;

  try {
    const body = await request.json();
    const {
      title, author, isbn, price, original_price,
      stock_qty, category, cover_image_url, description,
    } = body as Partial<BookRow>;

    const updates: string[] = [];
    const values: unknown[] = [];

    if (title)            { updates.push("title = ?");           values.push(title); }
    if (author)           { updates.push("author = ?");          values.push(author); }
    if (isbn !== undefined){ updates.push("isbn = ?");            values.push(isbn); }
    if (price !== undefined)         { updates.push("price = ?");          values.push(price); }
    if (original_price !== undefined){ updates.push("original_price = ?"); values.push(original_price); }
    if (stock_qty !== undefined)     { updates.push("stock_qty = ?");      values.push(stock_qty); }
    if (category)         { updates.push("category = ?");        values.push(category); }
    if (cover_image_url !== undefined){ updates.push("cover_image_url = ?"); values.push(cover_image_url); }
    if (description !== undefined)   { updates.push("description = ?");    values.push(description); }

    if (updates.length === 0) {
      return NextResponse.json({ error: "ไม่มีข้อมูลที่จะอัปเดต" }, { status: 400 });
    }

    values.push(Number(id));
    await query(`UPDATE books SET ${updates.join(", ")} WHERE id = ?`, values);

    // ตรวจสอบ low stock alert (stock <= 5)
    if (stock_qty !== undefined && stock_qty <= 5) {
      const books = await query<BookRow[]>("SELECT title FROM books WHERE id = ?", [Number(id)]);
      if (books.length > 0) {
        await query(
          "INSERT INTO notifications (type, message, book_id) VALUES ('low_stock', ?, ?)",
          [`หนังสือ "${books[0].title}" เหลือสต็อกน้อย (${stock_qty} เล่ม)`, Number(id)]
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[PUT /api/books/[id]]", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในระบบ" }, { status: 500 });
  }
}

// ─── DELETE /api/books/[id] — ลบหนังสือ (admin only) ────────
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const me = await getCurrentUser();
  if (!me) return unauthorizedResponse();
  if (me.role !== "admin") return forbiddenResponse();

  const { id } = await params;

  try {
    await query("DELETE FROM books WHERE id = ?", [Number(id)]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/books/[id]]", error);
    return NextResponse.json({ error: "เกิดข้อผิดพลาดภายในระบบ" }, { status: 500 });
  }
}
