import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// ─── Types ──────────────────────────────────────────────────────────────────
export interface JWTPayload {
  sub: string;          // user id (string)
  name: string;
  email: string;
  role: "customer" | "staff" | "admin";
  iat?: number;
  exp?: number;
}

// ─── Config ─────────────────────────────────────────────────────────────────
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "fallback-dev-secret-do-not-use-in-production-32chars"
);
const COOKIE_NAME = "booka-token";
const EXPIRES_IN = "7d";

// ─── Sign JWT ───────────────────────────────────────────────────────────────
export async function signToken(payload: Omit<JWTPayload, "iat" | "exp">): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRES_IN)
    .sign(SECRET);
}

// ─── Verify JWT ─────────────────────────────────────────────────────────────
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

// ─── Get current user from cookie ───────────────────────────────────────────
export async function getCurrentUser(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

// ─── Set JWT cookie on response ─────────────────────────────────────────────
export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  // Also set the legacy role cookie for middleware compatibility
}

// ─── Clear JWT cookie ────────────────────────────────────────────────────────
export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
  response.cookies.set("booka-role", "", { maxAge: 0, path: "/" });
}

// ─── Auth guard helpers ──────────────────────────────────────────────────────
export function unauthorizedResponse(message = "Unauthorized") {
  return NextResponse.json({ error: message }, { status: 401 });
}

export function forbiddenResponse(message = "Forbidden") {
  return NextResponse.json({ error: message }, { status: 403 });
}
