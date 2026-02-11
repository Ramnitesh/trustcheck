import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export const runtime = "nodejs";
import { calculateTrustScore } from "@/lib/trustScore";

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { businessId, isVerified } = body;

    if (!businessId || typeof isVerified !== "boolean") {
      return NextResponse.json(
        { error: "Business ID and verification status are required" },
        { status: 400 },
      );
    }

    // Update business verification status
    const business = await prisma.business.update({
      where: { id: businessId },
      data: { isVerified },
    });

    // Recalculate trust score
    await calculateTrustScore(businessId);

    return NextResponse.json({
      success: true,
      business,
    });
  } catch (error: any) {
    console.error("Verify business error:", error);
    return NextResponse.json(
      { error: "Failed to update verification status" },
      { status: 500 },
    );
  }
}
