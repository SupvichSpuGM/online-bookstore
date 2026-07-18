import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const role = request.cookies.get("booka-role")?.value;
  const { pathname } = request.nextUrl;

  // Admin routes — admin only
  if (pathname.startsWith("/admin") && role !== "admin") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Staff routes — staff only
  if (pathname.startsWith("/staff") && role !== "staff") {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protected customer routes — any logged-in user (not empty)
  const protectedRoutes = ["/cart", "/checkout", "/orders", "/profile"];
  if (protectedRoutes.some((p) => pathname.startsWith(p)) && !role) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/staff/:path*",
    "/cart",
    "/checkout",
    "/orders",
    "/profile",
  ],
};
