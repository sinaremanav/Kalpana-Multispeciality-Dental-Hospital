import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { Calendar, MessageCircle } from 'lucide-react';
import { clinicConfig } from '../config/clinicConfig';

const CTASection = () => {
  const whatsappUrl = `https://wa.me/${clinicConfig.whatsappNumber}?text=${encodeURIComponent(
    'Hello Doctor, I would like to book an appointment.'
  )}`;

  return (
    <section className="py-20 bg-gradient-to-br from-sky-50 via-sky-100/70 to-blue-50 relative overflow-hidden border-y border-sky-100">
      {/* Subtle Background Glow Circles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl -z-0 pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200/40 rounded-full blur-3xl -z-0 pointer-events-none transform -translate-x-1/3 translate-y-1/3" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-wider text-sky-800 bg-white/80 backdrop-blur-md rounded-full border border-sky-200 uppercase">
            Start Your Journey Today
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 tracking-tight mb-6">
            Ready to Take Care of Your Smile?
          </h2>

          <p className="text-base sm:text-lg text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Book your dental appointment today and take the first step toward a healthier, more confident smile with our compassionate team.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              to="/appointment"
              variant="primary"
              size="lg"
              icon={Calendar}
            >
              Book Appointment
            </Button>

            <Button
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="whatsapp"
              size="lg"
              icon={MessageCircle}
            >
              WhatsApp Us
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
