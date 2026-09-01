import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

export const ErrorState = ({
  title = 'Unable to load content',
  message = 'An unexpected error occurred while fetching information from the server.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-rose-50/60 rounded-2xl border border-rose-200">
      <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-rose-900">{title}</h3>
      <p className="text-xs sm:text-sm text-rose-700 max-w-md mt-1 mb-5">
        {message}
      </p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          icon={RefreshCw}
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
