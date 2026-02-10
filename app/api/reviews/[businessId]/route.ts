import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const { businessId } = await params;

    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    const reviews = await prisma.review.findMany({
      where: { businessId },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      reviews,
    });
  } catch (error: any) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
