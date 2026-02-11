import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const business = await prisma.business.findFirst({
      where: { userId: user.userId },
      include: {
        reviews: {
          orderBy: { createdAt: "desc" },
        },
        reports: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return NextResponse.json({
      business,
    });
  } catch (error: any) {
    console.error("Get my business error:", error);
    return NextResponse.json(
      { error: "Failed to fetch business" },
      { status: 500 },
    );
  }
}
