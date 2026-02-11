import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { businessName, category, city, address } = body;

    // Find user's business
    const business = await prisma.business.findFirst({
      where: { userId: user.userId },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 },
      );
    }

    // Update business
    const updatedBusiness = await prisma.business.update({
      where: { id: business.id },
      data: {
        ...(businessName && { businessName }),
        ...(category && { category }),
        ...(city && { city }),
        ...(address && { address }),
      },
    });

    return NextResponse.json({
      success: true,
      business: updatedBusiness,
    });
  } catch (error: any) {
    console.error("Update business error:", error);
    return NextResponse.json(
      { error: "Failed to update business" },
      { status: 500 },
    );
  }
}
