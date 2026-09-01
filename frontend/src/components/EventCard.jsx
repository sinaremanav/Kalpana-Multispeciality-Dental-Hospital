import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Tag, ArrowRight, MessageCircle } from 'lucide-react';
import Button from './Button';
import { clinicConfig } from '../config/clinicConfig';

export const EventCard = ({ event, index = 0, isPast = false }) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedH = h % 12 || 12;
    return `${formattedH}:${minutes} ${ampm}`;
  };

  const whatsappInquiryUrl = `https://wa.me/${clinicConfig.whatsappNumber}?text=${encodeURIComponent(
    `Hello Doctor, I would like to inquire/register for the event: ${event.title} scheduled on ${formatDate(
      event.event_date
    )}.`
  )}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={`peak-card overflow-hidden flex flex-col justify-between ${
        isPast ? 'opacity-85 filter grayscale-[20%]' : ''
      }`}
    >
      <div>
        {/* Image / Header */}
        <div className="relative h-48 sm:h-52 w-full bg-[#F1F5F9] overflow-hidden">
          <img
            src={
              event.image_url ||
              event.image ||
              'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=800'
            }
            alt={event.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            <span
              className={`px-3 py-1 text-[11px] font-bold rounded-md shadow-xs ${
                isPast
                  ? 'bg-slate-800 text-slate-200'
                  : 'bg-[#2563EB] text-white'
              }`}
            >
              {isPast ? 'Past Event' : event.category || 'Dental Camp'}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 sm:p-7">
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#2563EB] font-semibold mb-3">
            <span className="flex items-center gap-1.5 bg-[#EFF6FF] px-2.5 py-1 rounded-md border border-[#DBEAFE]">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(event.event_date)}
            </span>
            {event.start_time && (
              <span className="flex items-center gap-1.5 bg-[#F8FAFC] text-[#475569] px-2.5 py-1 rounded-md border border-[#E2E8F0]">
                <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                {formatTime(event.start_time)} {event.end_time ? `– ${formatTime(event.end_time)}` : ''}
              </span>
            )}
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] tracking-tight leading-snug mb-2">
            {event.title}
          </h3>

          <p className="text-xs sm:text-sm text-[#475569] leading-relaxed line-clamp-3 mb-4 font-normal">
            {event.description}
          </p>

          <div className="flex items-start gap-2 text-xs text-[#64748B] pt-2 border-t border-[#F1F5F9]">
            <MapPin className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
            <span className="line-clamp-2">{event.location}</span>
          </div>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="p-6 sm:p-7 pt-0 flex items-center justify-between gap-3">
        {!isPast ? (
          <Button
            href={whatsappInquiryUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="sm"
            fullWidth
            icon={MessageCircle}
          >
            Register / Inquire on WhatsApp
          </Button>
        ) : (
          <div className="w-full text-center py-2 px-3 bg-slate-100 text-slate-500 rounded-lg text-xs font-semibold">
            Event Successfully Completed
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EventCard;
