import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export const runtime = "edge";
import { calculateTrustScore } from "@/lib/trustScore";

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { reportId } = body;

    if (!reportId) {
      return NextResponse.json(
        { error: "Report ID is required" },
        { status: 400 },
      );
    }

    // Update report status to closed
    const report = await prisma.report.update({
      where: { id: reportId },
      data: { status: "closed" },
    });

    // Recalculate trust score (closed reports don't affect score)
    await calculateTrustScore(report.businessId);

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error("Close report error:", error);
    return NextResponse.json(
      { error: "Failed to close report" },
      { status: 500 },
    );
  }
}
