import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { clinicConfig } from '../config/clinicConfig';

const CTASection = () => {
  const whatsappUrl = `https://wa.me/${clinicConfig.whatsappNumber}?text=${encodeURIComponent(
    'Hello Doctor, I would like to book an appointment.'
  )}`;

  return (
    <section className="py-20 md:py-24 bg-[#351275] relative overflow-hidden text-white border-t border-[#4B168F]">
      {/* Subtle Blue Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#A96BFF]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center px-3.5 py-1 mb-4 text-xs font-semibold tracking-wider text-[#E9DDFF] bg-white/10 rounded-full border border-white/20 uppercase">
            Take The Next Step
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[-0.03em] leading-tight text-white mb-6">
            Take the Next Step Toward Better Health
          </h2>

          <p className="text-base sm:text-lg text-[#E9DDFF] mb-10 max-w-2xl mx-auto leading-relaxed">
            Book your dental appointment online in under 60 seconds and experience gentle, compassionate, multi-speciality dental care.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Button
              to="/appointment"
              variant="primary"
              size="lg"
              icon={ArrowRight}
            >
              Book an Appointment
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

