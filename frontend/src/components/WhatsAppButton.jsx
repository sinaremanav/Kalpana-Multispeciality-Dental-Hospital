import React, { useState } from 'react';
import { clinicConfig } from '../config/clinicConfig';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const whatsappUrl = `https://wa.me/${clinicConfig.whatsappNumber}?text=${encodeURIComponent(
    'Hello Doctor, I would like to inquire about dental services / book an appointment.'
  )}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center">
      {/* Tooltip */}
      {showTooltip && (
        <div className="mr-3 px-3.5 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-lg shadow-lg whitespace-nowrap animate-fade-in">
          Chat with us on WhatsApp
        </div>
      )}

      {/* Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Chat with us on WhatsApp"
        className="relative group flex items-center justify-center w-14 h-14 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-full shadow-[0_12px_28px_rgba(22,163,74,0.3)] hover:shadow-[0_16px_34px_rgba(22,163,74,0.4)] transition-all duration-300 transform hover:scale-110 active:scale-95"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-300"></span>
        </span>
        <MessageCircle className="w-7 h-7 fill-white/20 stroke-[2.5]" />
      </a>
    </div>
  );
};

export default WhatsAppButton;
