import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { DocumentModel } from "@/lib/models/Document";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

// GET /api/documents — list the current user's documents
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const type = req.nextUrl.searchParams.get("type");
  const filter: Record<string, unknown> = { userId: session.userId };
  if (type) filter.type = type;

  const docs = await DocumentModel.find(filter).sort({ createdAt: -1 }).limit(100).lean();
  return NextResponse.json({ success: true, data: docs });
}

const createSchema = z.object({
  type: z.string().min(1),
  title: z.string().min(1),
  status: z.enum(["Draft", "Sent", "Viewed", "Paid", "Submitted", "Shared"]).optional(),
  data: z.unknown().optional(),
  transcript: z.string().optional(),
  durationSec: z.number().optional(),
  clientName: z.string().optional(),
  totalAmount: z.number().optional(),
  currency: z.string().optional(),
});

// POST /api/documents — create a document for the current user
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  await connectDB();
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
  }
  const doc = await DocumentModel.create({ ...parsed.data, userId: session.userId });
  return NextResponse.json({ success: true, data: doc }, { status: 201 });
}
