import React from 'react';

export default function StatusBadge({ status }: { status?: string }) {
  const cls = status === 'draft' ? 'bg-yellow-100 text-yellow-800' : status === 'archived' ? 'bg-gray-100 text-gray-700' : 'bg-green-100 text-green-800';
  return <span className={`px-2 py-1 text-xs rounded ${cls}`}>{status || 'active'}</span>;
}
