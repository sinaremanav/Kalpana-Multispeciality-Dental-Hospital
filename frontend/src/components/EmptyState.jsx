import React from 'react';
import { FileQuestion } from 'lucide-react';
import Button from './Button';

export const EmptyState = ({
  icon: Icon = FileQuestion,
  title = 'No records found',
  description = 'There are no items to display at this moment.',
  actionLabel,
  onAction,
  actionTo,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#F8FAFC] rounded-2xl border border-dashed border-[#CBD5E1]">
      <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-[#0F172A]">{title}</h3>
      <p className="text-xs sm:text-sm text-[#64748B] max-w-sm mt-1 mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && (
        <Button
          onClick={onAction}
          to={actionTo}
          variant="primary"
          size="sm"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
