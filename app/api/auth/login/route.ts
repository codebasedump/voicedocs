import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/lib/models/User";
import { verifyPassword, signToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

// POST /api/auth/login
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
  const { email, password } = parsed.data;

  const user = await UserModel.findOne({ email: email.toLowerCase() });
  const ok = user?.passwordHash && (await verifyPassword(password, user.passwordHash));
  if (!user || !ok) {
    return NextResponse.json(
      { success: false, error: "Incorrect email or password." },
      { status: 401 }
    );
  }

  const token = signToken({ userId: String(user._id), email: user.email, firstName: user.firstName });
  const res = NextResponse.json({
    success: true,
    data: { id: String(user._id), email: user.email, firstName: user.firstName },
  });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return res;
}
