import React from 'react';
import LoadingState from '../../components/LoadingState';
import EmptyState from '../../components/EmptyState';

export const AdminTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyTitle = 'No records found',
  emptyDescription = 'There are currently no items in this table.',
  emptyActionLabel,
  onEmptyAction,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-saas overflow-hidden p-8">
        <LoadingState message="Loading data..." minHeight="min-h-[200px]" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
      />
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-saas overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className={`px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#64748B] ${
                    col.className || ''
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F5F9] text-sm text-[#0F172A]">
            {data.map((row, rIdx) => (
              <tr
                key={row.id || rIdx}
                className="hover:bg-[#F8FAFC]/80 transition-colors"
              >
                {columns.map((col, cIdx) => (
                  <td
                    key={cIdx}
                    className={`px-6 py-4 align-middle ${col.cellClassName || ''}`}
                  >
                    {col.render ? col.render(row, rIdx) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTable;
