import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const COOKIE_NAME = "nw_admin_session";
const JWT_SECRET = process.env.JWT_SECRET;

export interface AdminSession {
  adminId: string;
  email: string;
  name: string;
}

function getSecret(): string {
  if (!JWT_SECRET) {
    // Fail loudly in production; allow a dev-only fallback so local `npm run dev`
    // works out of the box without extra setup.
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET environment variable is not set.");
    }
    return "dev-only-insecure-secret-change-me";
  }
  return JWT_SECRET;
}

export function signAdminSession(payload: AdminSession): string {
  return jwt.sign(payload, getSecret(), { expiresIn: "7d" });
}

export function verifyAdminSession(token: string): AdminSession | null {
  try {
    return jwt.verify(token, getSecret()) as AdminSession;
  } catch {
    return null;
  }
}

export async function setAdminCookie(token: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminSession(token);
}

export { COOKIE_NAME };

/** Throws-free guard for use at the top of admin API route handlers. */
export async function requireAdmin(): Promise<AdminSession | null> {
  return getAdminSession();
}
