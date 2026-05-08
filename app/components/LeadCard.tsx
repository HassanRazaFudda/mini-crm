'use client';

import { Lead } from '@/lib/supabase';
import { updateLeadStatus, deleteLead } from '@/app/actions';
import { useState } from 'react';

const statusColors = {
  new: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'New' },
  contacted: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Contacted' },
  qualified: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Qualified' },
  converted: { bg: 'bg-green-100', text: 'text-green-800', label: 'Converted' },
  lost: { bg: 'bg-red-100', text: 'text-red-800', label: 'Lost' },
};

export function LeadCard({ lead }: { lead: Lead }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statusOptions: Lead['status'][] = ['new', 'contacted', 'qualified', 'converted', 'lost'];

  async function handleStatusChange(newStatus: Lead['status']) {
    setLoading(true);
    setError(null);
    const result = await updateLeadStatus(lead.id, newStatus);
    if (result.error) {
      setError(result.error);
    }
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this lead?')) return;

    setLoading(true);
    setError(null);
    const result = await deleteLead(lead.id);
    if (result.error) {
      setError(result.error);
    }
    setLoading(false);
  }

  const currentStatusColor = statusColors[lead.status];

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
      {error && (
        <div className="mb-3 rounded-md bg-red-50 p-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{lead.name}</h3>
        <p className="text-sm text-gray-500">{lead.email}</p>
      </div>

      {(lead.phone || lead.company) && (
        <div className="mb-3 space-y-1 text-sm text-gray-600">
          {lead.phone && <p>📱 {lead.phone}</p>}
          {lead.company && <p>🏢 {lead.company}</p>}
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${currentStatusColor.bg} ${currentStatusColor.text}`}>
          {currentStatusColor.label}
        </span>
        <p className="text-xs text-gray-400">
          {new Date(lead.created_at).toLocaleDateString()}
        </p>
      </div>

      <div className="space-y-2">
        <select
          value={lead.status}
          onChange={(e) => handleStatusChange(e.target.value as Lead['status'])}
          disabled={loading}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 hover:border-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {statusColors[status].label}
            </option>
          ))}
        </select>

        <button
          onClick={handleDelete}
          disabled={loading}
          className="w-full rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
