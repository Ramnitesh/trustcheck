"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"businesses" | "reports">(
    "businesses",
  );

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me");
      const data = await response.json();

      if (!response.ok || data.user.role !== "admin") {
        router.push("/auth/login");
        return;
      }

      setUser(data.user);
      await fetchData();
    } catch (err) {
      router.push("/auth/login");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    await Promise.all([fetchBusinesses(), fetchReports()]);
  };

  const fetchBusinesses = async (search = "") => {
    try {
      const url = `/api/admin/businesses${search ? `?search=${search}` : ""}`;
      const response = await fetch(url);
      const data = await response.json();
      setBusinesses(data.businesses || []);
    } catch (err) {
      console.error("Failed to fetch businesses");
    }
  };

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/admin/reports");
      const data = await response.json();
      setReports(data.reports || []);
    } catch (err) {
      console.error("Failed to fetch reports");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBusinesses(searchQuery);
  };

  const handleVerify = async (businessId: string, isVerified: boolean) => {
    try {
      const response = await fetch("/api/admin/business/verify", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, isVerified: !isVerified }),
      });

      if (response.ok) {
        await fetchBusinesses();
      }
    } catch (err) {
      alert("Failed to update verification status");
    }
  };

  const handleBan = async (businessId: string, isBanned: boolean) => {
    if (
      !confirm(
        `Are you sure you want to ${isBanned ? "unban" : "ban"} this business?`,
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/admin/business/ban", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessId, isBanned: !isBanned }),
      });

      if (response.ok) {
        await fetchBusinesses();
      }
    } catch (err) {
      alert("Failed to update ban status");
    }
  };

  const handleCloseReport = async (reportId: string) => {
    try {
      const response = await fetch("/api/admin/report/close", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId }),
      });

      if (response.ok) {
        await fetchReports();
      }
    } catch (err) {
      alert("Failed to close report");
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
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage businesses and moderate reports
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab("businesses")}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === "businesses"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Businesses ({businesses.length})
            </button>
            <button
              onClick={() => setActiveTab("reports")}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                activeTab === "reports"
                  ? "bg-purple-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Reports ({reports.filter((r) => r.status === "open").length})
            </button>
          </div>

          {/* Businesses Tab */}
          {activeTab === "businesses" && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="mb-6">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by business name, number, or city..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Search
                  </button>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        fetchBusinesses();
                      }}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </form>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Business
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Contact
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">
                        Owner
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">
                        Trust Score
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">
                        Stats
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">
                        Status
                      </th>
                      <th className="text-center py-3 px-4 font-semibold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {businesses.map((business) => (
                      <tr
                        key={business.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {business.businessName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {business.category}
                            </p>
                            <p className="text-sm text-gray-500">
                              {business.city}
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-900">
                            {business.whatsappNumber}
                          </p>
                          <a
                            href={`/b/${business.whatsappNumber}`}
                            target="_blank"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            View Profile →
                          </a>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-900">
                            {business.user.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {business.user.email}
                          </p>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span
                            className={`text-2xl font-bold ${
                              business.trustScore >= 80
                                ? "text-green-600"
                                : business.trustScore >= 60
                                  ? "text-yellow-600"
                                  : business.trustScore >= 40
                                    ? "text-orange-600"
                                    : "text-red-600"
                            }`}
                          >
                            {business.trustScore}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-center">
                            <p>👀 {business.profileViews}</p>
                            <p>⭐ {business._count.reviews}</p>
                            <p>🚨 {business._count.reports}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-2 items-center">
                            {business.isBanned && (
                              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">
                                BANNED
                              </span>
                            )}
                            {business.isVerified && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                VERIFIED
                              </span>
                            )}
                            {!business.isVerified && !business.isBanned && (
                              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">
                                UNVERIFIED
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() =>
                                handleVerify(business.id, business.isVerified)
                              }
                              className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                                business.isVerified
                                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                                  : "bg-blue-600 text-white hover:bg-blue-700"
                              }`}
                            >
                              {business.isVerified ? "Unverify" : "Verify"}
                            </button>
                            <button
                              onClick={() =>
                                handleBan(business.id, business.isBanned)
                              }
                              className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                                business.isBanned
                                  ? "bg-green-600 text-white hover:bg-green-700"
                                  : "bg-red-600 text-white hover:bg-red-700"
                              }`}
                            >
                              {business.isBanned ? "Unban" : "Ban"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {businesses.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No businesses found
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === "reports" && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                All Reports
              </h2>

              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className={`border rounded-lg p-4 ${
                      report.status === "open"
                        ? "border-red-200 bg-red-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              report.status === "open"
                                ? "bg-red-200 text-red-800"
                                : "bg-green-200 text-green-800"
                            }`}
                          >
                            {report.status.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-600">
                            {new Date(report.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="font-semibold text-gray-900 mb-1">
                          Business: {report.business.businessName}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          WhatsApp: {report.business.whatsappNumber}
                        </p>

                        <div className="bg-white rounded p-3 mb-2">
                          <p className="font-semibold text-red-800 mb-1">
                            {report.reason}
                          </p>
                          <p className="text-gray-700">{report.description}</p>
                        </div>

                        <a
                          href={`/b/${report.business.whatsappNumber}`}
                          target="_blank"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          View Business Profile →
                        </a>
                      </div>

                      {report.status === "open" && (
                        <button
                          onClick={() => handleCloseReport(report.id)}
                          className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                        >
                          Close Report
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {reports.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No reports found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
