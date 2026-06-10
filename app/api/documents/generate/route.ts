import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { DocumentModel } from "@/lib/models/Document";
import { UserModel } from "@/lib/models/User";
import { getSession } from "@/lib/auth";
import { generateDocument } from "@/lib/ai";

export const runtime = "nodejs";
export const maxDuration = 30;

const schema = z.object({
  templateId: z.string().min(1),
  transcript: z.string().default(""),
  durationSec: z.number().optional(),
});

// POST /api/documents/generate — transcript → AI-formatted document, saved.
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
  }
  const { templateId, transcript, durationSec } = parsed.data;

  await connectDB();

  // Pull the user's business profile so invoices carry THEIR ABN/details.
  const user = await UserModel.findById(session.userId)
    .select("businessName abn businessAddress paymentTerms bankBsb bankAccount")
    .lean();
  const business = {
    name: user?.businessName || "",
    abn: user?.abn || "",
    address: user?.businessAddress || "",
    paymentTerms: user?.paymentTerms || "",
    bankBsb: user?.bankBsb || "",
    bankAccount: user?.bankAccount || "",
  };

  const generated = await generateDocument(templateId, transcript);

  const doc = await DocumentModel.create({
    userId: session.userId,
    type: generated.type,
    title: generated.title,
    status: "Draft",
    data: { ...generated.data, business },
    transcript,
    durationSec,
    clientName: generated.clientName,
    totalAmount: generated.totalAmount,
    currency: generated.currency,
    generatedByAI: true,
  });

  return NextResponse.json({ success: true, data: doc }, { status: 201 });
}
