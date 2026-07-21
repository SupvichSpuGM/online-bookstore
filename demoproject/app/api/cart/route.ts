import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { getCurrentUser, unauthorizedResponse } from "@/lib/auth";

interface CartItemRow {
  id: number;
  cart_id: number;
  book_id: number;
  quantity: number;
  title: string;
  author: string;
  price: number;
  original_price: number;
  stock_qty: number;
  cover_image_url: string | null;
  category: string;
  isbn: string | null;
  description: string | null;
  rating: number;
  review_count: number;
}

// ─── GET /api/cart — ดึงตะกร้าสินค้าของ user ────────────────
export async function GET() {
  const me = await getCurrentUser();
  if (!me) return unauthorizedResponse();

  const userId = Number(me.sub);

  // หา cart ของ user (สร้างถ้ายังไม่มี)
  let carts = await query<Array<{ id: number }>>(
    "SELECT id FROM carts WHERE user_id = ? LIMIT 1",
    [userId]
  );

  if (carts.length === 0) {
    const result = await query<{ insertId: number }>(
      "INSERT INTO carts (user_id) VALUES (?)",
      [userId]
    );
    carts = [{ id: result.insertId }];
  }

  const cartId = carts[0].id;

  const items = await query<CartItemRow[]>(
    `SELECT ci.id, ci.cart_id, ci.book_id, ci.quantity,
            b.title, b.author, b.price, b.original_price,
            b.stock_qty, b.cover_image_url, b.category,
            b.isbn, b.description, b.rating, b.review_count
     FROM cart_items ci
     JOIN books b ON b.id = ci.book_id
     WHERE ci.cart_id = ?`,
    [cartId]
  );

  return NextResponse.json({ cartId, items });
}

// ─── POST /api/cart — เพิ่ม/อัปเดต item ────────────────────
export async function POST(request: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return unauthorizedResponse();

  const userId = Number(me.sub);
  const body = await request.json();
  const { book_id, quantity } = body as { book_id?: number; quantity?: number };

  if (!book_id || !quantity || quantity < 1) {
    return NextResponse.json(
      { error: "กรุณาระบุ book_id และ quantity (>= 1)" },
      { status: 400 }
    );
  }

  // ตรวจสอบ stock
  const books = await query<Array<{ stock_qty: number; title: string }>>(
    "SELECT stock_qty, title FROM books WHERE id = ? LIMIT 1",
    [book_id]
  );
  if (books.length === 0) {
    return NextResponse.json({ error: "ไม่พบหนังสือ" }, { status: 404 });
  }
  if (books[0].stock_qty < quantity) {
    return NextResponse.json(
      { error: `สินค้าในคลังไม่เพียงพอ (มีอยู่ ${books[0].stock_qty} เล่ม)` },
      { status: 409 }
    );
  }

  // หา/สร้าง cart
  let carts = await query<Array<{ id: number }>>(
    "SELECT id FROM carts WHERE user_id = ? LIMIT 1",
    [userId]
  );
  if (carts.length === 0) {
    const result = await query<{ insertId: number }>(
      "INSERT INTO carts (user_id) VALUES (?)",
      [userId]
    );
    carts = [{ id: result.insertId }];
  }
  const cartId = carts[0].id;

  // INSERT หรือ UPDATE quantity
  await query(
    `INSERT INTO cart_items (cart_id, book_id, quantity)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = ?`,
    [cartId, book_id, quantity, quantity]
  );

  return NextResponse.json({ success: true });
}

// ─── DELETE /api/cart — ลบ item ออกจากตะกร้า ────────────────
export async function DELETE(request: NextRequest) {
  const me = await getCurrentUser();
  if (!me) return unauthorizedResponse();

  const userId = Number(me.sub);
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get("book_id");

  const carts = await query<Array<{ id: number }>>(
    "SELECT id FROM carts WHERE user_id = ? LIMIT 1",
    [userId]
  );
  if (carts.length === 0) {
    return NextResponse.json({ success: true }); // cart ว่างอยู่แล้ว
  }

  const cartId = carts[0].id;

  if (bookId) {
    // ลบเฉพาะ item
    await query("DELETE FROM cart_items WHERE cart_id = ? AND book_id = ?", [
      cartId,
      Number(bookId),
    ]);
  } else {
    // ล้าง cart ทั้งหมด
    await query("DELETE FROM cart_items WHERE cart_id = ?", [cartId]);
  }

  return NextResponse.json({ success: true });
}
