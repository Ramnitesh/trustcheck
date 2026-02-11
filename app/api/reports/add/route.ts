import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateTrustScore } from "@/lib/trustScore";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, reason, description } = body;

    // Validate input
    if (!businessId || !reason || !description) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Check if business exists
    const business = await prisma.business.findUnique({
      where: { id: businessId },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 },
      );
    }

    // Create report
    const report = await prisma.report.create({
      data: {
        businessId,
        reason,
        description,
        status: "open",
      },
    });

    // Recalculate trust score
    await calculateTrustScore(businessId);

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error("Add report error:", error);
    return NextResponse.json(
      { error: "Failed to add report" },
      { status: 500 },
    );
  }
}
