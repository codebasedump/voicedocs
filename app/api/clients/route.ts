import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { ClientModel } from "@/lib/models/Client";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

// GET /api/clients — list the current user's clients
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const clients = await ClientModel.find({ userId: session.userId }).sort({ name: 1 }).limit(500).lean();
  return NextResponse.json({ success: true, data: clients });
}

const createSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  abn: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

// POST /api/clients — create a client for the current user
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }
  const client = await ClientModel.create({ ...parsed.data, userId: session.userId });
  return NextResponse.json({ success: true, data: client }, { status: 201 });
}
