import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ number: string }> },
) {
  try {
    const { number } = await params;

    if (!number) {
      return NextResponse.json(
        { error: "Number is required" },
        { status: 400 },
      );
    }

    // Find business by WhatsApp number
    const business = await prisma.business.findUnique({
      where: { whatsappNumber: number },
      include: {
        reviews: {
          orderBy: { createdAt: "desc" },
        },
        reports: {
          where: { status: "open" },
          orderBy: { createdAt: "desc" },
          take: 3,
        },
      },
    });

    if (!business) {
      return NextResponse.json(
        { error: "Business not found" },
        { status: 404 },
      );
    }

    // Increment profile views
    await prisma.business.update({
      where: { id: business.id },
      data: {
        profileViews: business.profileViews + 1,
      },
    });

    // Get total reports count
    const totalReports = await prisma.report.count({
      where: { businessId: business.id },
    });

    return NextResponse.json({
      business: {
        ...business,
        profileViews: business.profileViews + 1,
        totalReports,
      },
    });
  } catch (error: any) {
    console.error("Get business error:", error);
    return NextResponse.json(
      { error: "Failed to fetch business" },
      { status: 500 },
    );
  }
}
