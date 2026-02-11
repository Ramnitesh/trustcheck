"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [number, setNumber] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate number (10 digits)
    const cleanNumber = number.replace(/\D/g, "");

    if (cleanNumber.length !== 10) {
      setError("Please enter a valid 10-digit WhatsApp number");
      return;
    }

    router.push(`/b/${cleanNumber}`);
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter WhatsApp number (10 digits)"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg text-gray-900"
            maxLength={15}
          />
          <button
            type="submit"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Search
          </button>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </form>
  );
}
