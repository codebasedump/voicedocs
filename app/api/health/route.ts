import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export const runtime = "nodejs";

// GET /api/health — verify the server + DB connection are up.
export async function GET() {
  try {
    const conn = await connectDB();
    return NextResponse.json({
      success: true,
      db: conn.connection.readyState === 1 ? "connected" : "connecting",
      time: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
