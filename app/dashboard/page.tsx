"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TrustBadge from "@/components/TrustBadge";
import ReviewCard from "@/components/ReviewCard";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // Form state
  const [businessName, setBusinessName] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();

      if (!response.ok) {
        router.push("/auth/login");
        return;
      }

      setUser(data.user);
      await fetchBusiness();
    } catch (err) {
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchBusiness = async () => {
    try {
      const response = await fetch("/api/business/my");
      const data = await response.json();

      if (data.business) {
        setBusiness(data.business);
        setBusinessName(data.business.businessName);
        setCategory(data.business.category);
        setCity(data.business.city);
        setAddress(data.business.address);
      }
    } catch (err) {
      console.error("Failed to fetch business");
    }
  };

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/business/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          whatsappNumber,
          category,
          city,
          address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setShowCreateForm(false);
      await fetchBusiness();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const response = await fetch("/api/business/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          category,
          city,
          address,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setShowEditForm(false);
      await fetchBusiness();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const copyProfileLink = () => {
    if (business) {
      const link = `${window.location.origin}/b/${business.whatsappNumber}`;
      navigator.clipboard.writeText(link);
      alert("Profile link copied to clipboard!");
    }
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Business Dashboard
            </h1>
            <p className="text-gray-600">
              Manage your business profile and track performance
            </p>
          </div>

          {!business && !showCreateForm && (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
              <div className="text-6xl mb-4">🏢</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No Business Profile Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Create your business profile to start building trust with
                customers
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Create Business Profile
              </button>
            </div>
          )}

          {showCreateForm && (
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Create Business Profile
              </h2>

              <form onSubmit={handleCreateBusiness} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    WhatsApp Number (10 digits) *
                  </label>
                  <input
                    type="text"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  >
                    <option value="">Select category</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Food & Beverage">Food & Beverage</option>
                    <option value="Services">Services</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Technology">Technology</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none text-gray-900"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 font-semibold"
                  >
                    {submitting ? "Creating..." : "Create Business"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {business && (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="text-3xl mb-2">🎯</div>
                  <p className="text-sm text-gray-600">Trust Score</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {business.trustScore}/100
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="text-3xl mb-2">👀</div>
                  <p className="text-sm text-gray-600">Profile Views</p>
                  <p className="text-3xl font-bold text-green-600">
                    {business.profileViews}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="text-3xl mb-2">⭐</div>
                  <p className="text-sm text-gray-600">Total Reviews</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {business.reviews.length}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="text-3xl mb-2">🚨</div>
                  <p className="text-sm text-gray-600">Total Reports</p>
                  <p className="text-3xl font-bold text-red-600">
                    {business.reports.length}
                  </p>
                </div>
              </div>

              {/* Business Profile */}
              <div className="bg-white rounded-xl shadow-md p-8 mb-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Business Profile
                    </h2>
                    {showEditForm ? (
                      <p className="text-gray-600">
                        Update your business information
                      </p>
                    ) : (
                      <div className="flex items-center gap-4 mt-4">
                        <TrustBadge
                          score={business.trustScore}
                          isVerified={business.isVerified}
                          isBanned={business.isBanned}
                        />
                      </div>
                    )}
                  </div>
                  {!showEditForm && (
                    <div className="flex gap-2">
                      <button
                        onClick={copyProfileLink}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        📋 Copy Link
                      </button>
                      <button
                        onClick={() => setShowEditForm(true)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  )}
                </div>

                {!showEditForm ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <span className="font-semibold text-gray-700">
                        Business Name:
                      </span>
                      <span className="text-gray-900">
                        {business.businessName}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold text-gray-700">
                        WhatsApp Number:
                      </span>
                      <span className="text-gray-900">
                        {business.whatsappNumber}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold text-gray-700">
                        Category:
                      </span>
                      <span className="text-gray-900">{business.category}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold text-gray-700">City:</span>
                      <span className="text-gray-900">{business.city}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-semibold text-gray-700">
                        Address:
                      </span>
                      <span className="text-gray-900">{business.address}</span>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateBusiness} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        required
                      >
                        <option value="E-commerce">E-commerce</option>
                        <option value="Food & Beverage">Food & Beverage</option>
                        <option value="Services">Services</option>
                        <option value="Education">Education</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Real Estate">Real Estate</option>
                        <option value="Technology">Technology</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address *
                      </label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none text-gray-900"
                        required
                      />
                    </div>

                    {error && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        {error}
                      </div>
                    )}

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 font-semibold"
                      >
                        {submitting ? "Updating..." : "Update Business"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditForm(false);
                          setError("");
                        }}
                        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {/* Reviews List */}
              <div className="bg-white rounded-xl shadow-md p-8 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Recent Reviews ({business.reviews.length})
                </h2>
                {business.reviews.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No reviews yet
                  </p>
                ) : (
                  <div className="space-y-4">
                    {business.reviews.slice(0, 5).map((review: any) => (
                      <ReviewCard key={review.id} review={review} />
                    ))}
                  </div>
                )}
              </div>

              {/* Reports List */}
              <div className="bg-white rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Reports ({business.reports.length})
                </h2>
                {business.reports.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No reports</p>
                ) : (
                  <div className="space-y-3">
                    {business.reports.map((report: any) => (
                      <div
                        key={report.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {report.reason}
                            </p>
                            <p className="text-gray-600 mt-1">
                              {report.description}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                              {new Date(report.createdAt).toLocaleDateString()}{" "}
                              • Status: {report.status}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              report.status === "open"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {report.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
