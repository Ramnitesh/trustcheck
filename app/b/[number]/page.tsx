"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  X,
  Phone,
  Folder,
  Building,
  MapPin,
  Eye,
  Copy,
  Star,
  AlertTriangle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrustBadge from "@/components/TrustBadge";
import ReviewCard from "@/components/ReviewCard";
import ReportForm from "@/components/ReportForm";

export default function BusinessProfilePage() {
  const params = useParams();
  const number = params.number as string;

  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showReportForm, setShowReportForm] = useState(false);

  // Review form state
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBusiness();
  }, [number]);

  const fetchBusiness = async () => {
    try {
      const response = await fetch(`/api/business/${number}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Business not found");
      }

      setBusiness(data.business);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("/api/reviews/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          reviewerName,
          rating,
          comment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      // Reset form
      setReviewerName("");
      setRating(5);
      setComment("");
      setShowReviewForm(false);

      // Refresh business data
      fetchBusiness();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const copyProfileLink = () => {
    const link = `${window.location.origin}/b/${number}`;
    navigator.clipboard.writeText(link);
    alert("Profile link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-2xl text-gray-600">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <X size={64} className="text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Business Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              {error ||
                "The WhatsApp number you searched for is not registered."}
            </p>
            <a
              href="/"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Search
            </a>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Business Header */}
          <div className="bg-white rounded-xl shadow-md p-8 mb-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {business.businessName}
                </h1>
                <div className="space-y-2 text-gray-600">
                  <p className="flex items-center gap-2">
                    <Phone size={20} className="text-gray-500" />
                    <span className="font-semibold">WhatsApp:</span>
                    <span className="text-lg">{business.whatsappNumber}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Folder size={20} className="text-gray-500" />
                    <span className="font-semibold">Category:</span>
                    <span>{business.category}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Building size={20} className="text-gray-500" />
                    <span className="font-semibold">City:</span>
                    <span>{business.city}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={20} className="text-gray-500" />
                    <span className="font-semibold">Address:</span>
                    <span>{business.address}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Eye size={20} className="text-gray-500" />
                    <span className="font-semibold">Profile Views:</span>
                    <span>{business.profileViews}</span>
                  </p>
                </div>
              </div>

              <div>
                <TrustBadge
                  score={business.trustScore}
                  isVerified={business.isVerified}
                  isBanned={business.isBanned}
                />
                <button
                  onClick={copyProfileLink}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <Copy size={18} />
                  Copy Profile Link
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Reviews Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    ⭐ Reviews ({business.reviews.length})
                  </h2>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {showReviewForm ? "Cancel" : "+ Add Review"}
                  </button>
                </div>

                {showReviewForm && (
                  <form
                    onSubmit={handleSubmitReview}
                    className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-6"
                  >
                    <h3 className="text-xl font-bold text-blue-800 mb-4">
                      Write a Review
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Rating
                        </label>
                        <select
                          value={rating}
                          onChange={(e) => setRating(parseInt(e.target.value))}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        >
                          <option value={5}>★★★★★ (5 stars)</option>
                          <option value={4}>★★★★ (4 stars)</option>
                          <option value={3}>★★★ (3 stars)</option>
                          <option value={2}>★★ (2 stars)</option>
                          <option value={1}>★ (1 star)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Comment
                        </label>
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Share your experience..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none text-gray-900"
                          required
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 font-semibold"
                      >
                        {submitting ? "Submitting..." : "Submit Review"}
                      </button>
                    </div>
                  </form>
                )}

                {business.reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No reviews yet. Be the first to review!
                  </p>
                ) : (
                  <div className="space-y-4">
                    {business.reviews.map((review: any) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reports Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  <AlertTriangle
                    className="inline mr-2 text-red-600"
                    size={20}
                  />{" "}
                  Reports ({business.totalReports || 0})
                </h2>

                {business.reports && business.reports.length > 0 ? (
                  <div className="space-y-3">
                    {business.reports.slice(0, 3).map((report: any) => (
                      <div
                        key={report.id}
                        className="border border-red-200 rounded-lg p-3 bg-red-50"
                      >
                        <p className="font-semibold text-red-800">
                          {report.reason}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {report.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                    {business.totalReports > 3 && (
                      <p className="text-sm text-gray-500 text-center">
                        +{business.totalReports - 3} more reports
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    No reports yet
                  </p>
                )}
              </div>

              {!showReportForm ? (
                <button
                  onClick={() => setShowReportForm(true)}
                  className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  <AlertTriangle className="inline mr-2" size={20} />
                  Report This Business
                </button>
              ) : (
                <div>
                  <ReportForm
                    businessId={business.id}
                    onSuccess={() => {
                      setShowReportForm(false);
                      fetchBusiness();
                    }}
                  />
                  <button
                    onClick={() => setShowReportForm(false)}
                    className="w-full mt-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
