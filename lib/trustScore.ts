import { prisma } from './prisma';

export async function calculateTrustScore(businessId: string): Promise<number> {
  try {
    // Fetch business with reviews and reports
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      include: {
        reviews: true,
        reports: {
          where: { status: 'open' },
        },
      },
    });

    if (!business) {
      throw new Error('Business not found');
    }

    // If business is banned, trust score is 0
    if (business.isBanned) {
      await prisma.business.update({
        where: { id: businessId },
        data: { trustScore: 0 },
      });
      return 0;
    }

    let score = 50; // Base score

    // Add 30 if verified
    if (business.isVerified) {
      score += 30;
    }

    // Calculate average rating
    if (business.reviews.length > 0) {
      const totalRating = business.reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = totalRating / business.reviews.length;

      if (avgRating >= 4.5) {
        score += 20;
      } else if (avgRating >= 4.0) {
        score += 15;
      } else if (avgRating >= 3.0) {
        score += 5;
      } else {
        score -= 20;
      }
    }

    // Subtract 10 for each open report
    score -= business.reports.length * 10;

    // Clamp score between 0 and 100
    score = Math.max(0, Math.min(100, score));

    // Update business trust score in database
    await prisma.business.update({
      where: { id: businessId },
      data: { trustScore: score },
    });

    return score;
  } catch (error) {
    console.error('Error calculating trust score:', error);
    throw error;
  }
}

export async function recalculateAllTrustScores(): Promise<void> {
  try {
    const businesses = await prisma.business.findMany();
    
    for (const business of businesses) {
      await calculateTrustScore(business.id);
    }
  } catch (error) {
    console.error('Error recalculating all trust scores:', error);
    throw error;
  }
}
