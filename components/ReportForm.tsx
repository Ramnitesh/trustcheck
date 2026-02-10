'use client';

import { useState } from 'react';

interface ReportFormProps {
  businessId: string;
  onSuccess: () => void;
}

export default function ReportForm({ businessId, onSuccess }: ReportFormProps) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const reasons = [
    'Scam/Fraud',
    'Fake Business',
    'Poor Service',
    'Misleading Information',
    'Spam Messages',
    'Other',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!reason || !description.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/reports/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          reason,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit report');
      }

      setReason('');
      setDescription('');
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-red-50 border border-red-200 rounded-lg p-6">
      <h3 className="text-xl font-bold text-red-800 mb-4">🚨 Report a Problem</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Reason
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          >
            <option value="">Select a reason</option>
            {reasons.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Please provide details about your experience..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 h-24 resize-none"
            required
          />
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 font-semibold"
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>
      </div>
    </form>
  );
}
