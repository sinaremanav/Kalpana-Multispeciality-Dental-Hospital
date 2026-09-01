import React from 'react';

export const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'unread':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'confirmed':
      case 'read':
      case 'active':
      case 'published':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'completed':
      case 'replied':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'cancelled':
      case 'inactive':
      case 'unpublished':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${getStyles()}`}
    >
      {status || 'Unknown'}
    </span>
  );
};

export default StatusBadge;
