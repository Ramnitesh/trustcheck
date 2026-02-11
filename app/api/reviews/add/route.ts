import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateTrustScore } from "@/lib/trustScore";

export const runtime = "edge";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessId, reviewerName, rating, comment } = body;

    // Validate input
    if (!businessId || !reviewerName || !rating || !comment) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
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

    // Create review
    const review = await prisma.review.create({
      data: {
        businessId,
        reviewerName,
        rating: parseInt(rating),
        comment,
      },
    });

    // Recalculate trust score
    await calculateTrustScore(businessId);

    return NextResponse.json({
      success: true,
      review,
    });
  } catch (error: any) {
    console.error("Add review error:", error);
    return NextResponse.json(
      { error: "Failed to add review" },
      { status: 500 },
    );
  }
}
