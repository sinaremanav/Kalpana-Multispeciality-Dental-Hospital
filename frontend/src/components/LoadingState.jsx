import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = 'Loading details...', minHeight = 'min-h-[220px]' }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${minHeight} p-8 text-center animate-fade-in`}>
      <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin mb-3" />
      <p className="text-sm font-medium text-[#64748B]">{message}</p>
    </div>
  );
};

export default LoadingState;
