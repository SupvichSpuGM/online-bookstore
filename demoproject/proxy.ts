import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const role = request.cookies.get("booka-role")?.value;
  const token = request.cookies.get("booka-token")?.value;
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

  // Protected customer routes — logged in user required
  const protectedRoutes = ["/cart", "/checkout", "/orders", "/profile"];
  if (protectedRoutes.some((p) => pathname.startsWith(p)) && !token && !role) {
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
