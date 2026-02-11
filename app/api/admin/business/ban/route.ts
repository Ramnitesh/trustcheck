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
    const { businessId, isBanned } = body;

    if (!businessId || typeof isBanned !== "boolean") {
      return NextResponse.json(
        { error: "Business ID and ban status are required" },
        { status: 400 },
      );
    }

    // Update business ban status
    const business = await prisma.business.update({
      where: { id: businessId },
      data: { isBanned },
    });

    // Recalculate trust score (will be 0 if banned)
    await calculateTrustScore(businessId);

    return NextResponse.json({
      success: true,
      business,
    });
  } catch (error: any) {
    console.error("Ban business error:", error);
    return NextResponse.json(
      { error: "Failed to update ban status" },
      { status: 500 },
    );
  }
}
