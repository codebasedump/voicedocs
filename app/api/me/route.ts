import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { UserModel } from "@/lib/models/User";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

// Only ever expose / return these fields — never passwordHash.
const SAFE_FIELDS =
  "firstName lastName email phone businessName abn businessAddress logoUrl paymentTerms bankBsb bankAccount plan role createdAt";

// GET /api/me — current user's profile
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const user = await UserModel.findById(session.userId).select(SAFE_FIELDS).lean();
  if (!user) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: user });
}

// Whitelist of editable fields. `.strict()` rejects anything else
// (plan, role, email, passwordHash…) so a user can't escalate privileges.
const updateSchema = z
  .object({
    firstName: z.string().trim().min(1).max(80).optional(),
    lastName: z.string().trim().max(80).optional(),
    phone: z.string().trim().max(40).optional(),
    businessName: z.string().trim().max(120).optional(),
    abn: z.string().trim().max(20).optional(),
    businessAddress: z.string().trim().max(200).optional(),
    paymentTerms: z.string().trim().max(60).optional(),
    bankBsb: z.string().trim().max(20).optional(),
    bankAccount: z.string().trim().max(40).optional(),
  })
  .strict();

// PATCH /api/me — update own profile (validated, scoped)
export async function PATCH(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  await connectDB();
  const user = await UserModel.findByIdAndUpdate(session.userId, parsed.data, {
    new: true,
    runValidators: true,
  })
    .select(SAFE_FIELDS)
    .lean();

  return NextResponse.json({ success: true, data: user });
}
