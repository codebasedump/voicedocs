import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { DocumentModel } from "@/lib/models/Document";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

async function requireUser() {
  const session = await getSession();
  return session?.userId ?? null;
}

// GET /api/documents/:id (own document only)
export async function GET(_req: NextRequest, { params }: Ctx) {
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await connectDB();
  const doc = await DocumentModel.findOne({ _id: id, userId }).lean();
  if (!doc) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: doc });
}

// PATCH /api/documents/:id (own document only)
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await connectDB();
  const body = await req.json().catch(() => ({}));
  // never allow reassigning ownership
  delete (body as Record<string, unknown>).userId;
  const doc = await DocumentModel.findOneAndUpdate({ _id: id, userId }, body, {
    new: true,
    runValidators: true,
  }).lean();
  if (!doc) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, data: doc });
}

// DELETE /api/documents/:id (own document only)
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const userId = await requireUser();
  if (!userId) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await connectDB();
  const doc = await DocumentModel.findOneAndDelete({ _id: id, userId }).lean();
  if (!doc) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
