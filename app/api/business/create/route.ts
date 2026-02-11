import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { businessName, whatsappNumber, category, city, address } = body;

    // Validate input
    if (!businessName || !whatsappNumber || !category || !city || !address) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Validate WhatsApp number (10 digits)
    const cleanNumber = whatsappNumber.replace(/\D/g, "");
    if (cleanNumber.length !== 10) {
      return NextResponse.json(
        { error: "WhatsApp number must be 10 digits" },
        { status: 400 },
      );
    }

    // Check if business with this number already exists
    const existingBusiness = await prisma.business.findUnique({
      where: { whatsappNumber: cleanNumber },
    });

    if (existingBusiness) {
      return NextResponse.json(
        { error: "Business with this WhatsApp number already exists" },
        { status: 400 },
      );
    }

    // Check if user already has a business
    const userBusiness = await prisma.business.findFirst({
      where: { userId: user.userId },
    });

    if (userBusiness) {
      return NextResponse.json(
        { error: "You already have a registered business" },
        { status: 400 },
      );
    }

    // Create business
    const business = await prisma.business.create({
      data: {
        userId: user.userId,
        businessName,
        whatsappNumber: cleanNumber,
        category,
        city,
        address,
      },
    });

    return NextResponse.json({
      success: true,
      business,
    });
  } catch (error: any) {
    console.error("Create business error:", error);
    return NextResponse.json(
      { error: "Failed to create business" },
      { status: 500 },
    );
  }
}
