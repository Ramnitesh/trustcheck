import SearchBar from "@/components/SearchBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, SearchCheck, AlertTriangle, Star } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <ShieldCheck size={64} className="text-blue-600" />
              <h1 className="text-5xl font-bold text-gray-900">TrustCheck</h1>
            </div>
            <p className="text-2xl text-gray-600 mb-2">
              Verify WhatsApp Businesses Before You Trust Them
            </p>
            <p className="text-lg text-gray-500">
              Check trust scores, read reviews, and report scams
            </p>
          </div>

          <SearchBar />

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="mb-4">
                <SearchCheck size={40} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Verify Businesses
              </h3>
              <p className="text-gray-600">
                Check if a WhatsApp business is verified and trustworthy before
                engaging.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="mb-4">
                <Star size={40} className="text-yellow-500" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Trust Scores
              </h3>
              <p className="text-gray-600">
                View calculated trust scores based on verification, reviews, and
                reports.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
              <div className="mb-4">
                <AlertTriangle size={40} className="text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">
                Report Scams
              </h3>
              <p className="text-gray-600">
                Help the community by reporting fraudulent or suspicious
                businesses.
              </p>
            </div>
          </div>

          <div className="mt-16 bg-blue-600 text-white rounded-xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Are You a Business Owner?
            </h2>
            <p className="text-xl mb-6">
              Register your WhatsApp business and build trust with your
              customers
            </p>
            <a
              href="/auth/register"
              className="inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Register Your Business
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
