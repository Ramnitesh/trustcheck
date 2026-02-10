interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-xl ${
              star <= rating ? 'text-yellow-500' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h4 className="font-semibold text-gray-900">{review.reviewerName}</h4>
          {renderStars(review.rating)}
        </div>
        <p className="text-xs text-gray-500">
          {new Date(review.createdAt).toLocaleDateString()}
        </p>
      </div>
      <p className="text-gray-700 mt-2">{review.comment}</p>
    </div>
  );
}
