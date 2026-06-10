import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET || "dev-insecure-secret-change-me";
export const SESSION_COOKIE = "vd_token";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface SessionUser {
  userId: string;
  email: string;
  firstName?: string;
}

export function hashPassword(pw: string) {
  return bcrypt.hash(pw, 12);
}
export function verifyPassword(pw: string, hash: string) {
  return bcrypt.compare(pw, hash);
}

export function signToken(payload: SessionUser) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, SECRET) as SessionUser;
  } catch {
    return null;
  }
}

/** Read the current session from the auth cookie (server-side). */
export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** Options for the httpOnly session cookie. */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  };
}
