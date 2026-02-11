import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";

export const runtime = "edge";

export async function GET() {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({
      user,
    });
  } catch (error: any) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "Failed to check authentication" },
      { status: 500 },
    );
  }
}
