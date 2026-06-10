import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/lib/models/User";
import { hashPassword, signToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

export const runtime = "nodejs";

const schema = z.object({
  firstName: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  businessName: z.string().optional(),
});

// POST /api/auth/register
export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }
  const { firstName, email, password, businessName } = parsed.data;

  const existing = await UserModel.findOne({ email: email.toLowerCase() });
  if (existing) {
    return NextResponse.json(
      { success: false, error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await UserModel.create({ email, passwordHash, firstName, businessName });

  const token = signToken({ userId: String(user._id), email: user.email, firstName: user.firstName });
  const res = NextResponse.json(
    { success: true, data: { id: String(user._id), email: user.email, firstName: user.firstName } },
    { status: 201 }
  );
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
