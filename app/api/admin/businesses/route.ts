import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const businesses = await prisma.business.findMany({
      where: search
        ? {
            OR: [
              { businessName: { contains: search, mode: "insensitive" } },
              { whatsappNumber: { contains: search } },
              { city: { contains: search, mode: "insensitive" } },
            ],
          }
        : {},
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            reviews: true,
            reports: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      businesses,
    });
  } catch (error: any) {
    console.error("Get businesses error:", error);
    return NextResponse.json(
      { error: "Failed to fetch businesses" },
      { status: 500 },
    );
  }
}
