import React from 'react';
import { testimonialsData } from '../data/testimonials';
import TestimonialCard from '../components/TestimonialCard';
import CTASection from '../components/CTASection';
import { Star } from 'lucide-react';

const Testimonials = () => {
  return (
    <div className="pt-20">
      {/* Header Banner */}
      <section className="hero-gradient py-16 md:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] rounded-full border border-[#DBEAFE]">
            Verified Patient Reviews
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-[-0.03em] mt-4">
            Patient Stories & Reviews
          </h1>
          <p className="text-[#475569] text-base sm:text-lg max-w-2xl mx-auto mt-4 leading-relaxed font-normal">
            Hear directly from our patients about their clinical experiences, painless procedures, and restored smiles.
          </p>

          {/* Rating Summary Bar */}
          <div className="inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-full shadow-saas mt-6 border border-[#E2E8F0]">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-bold text-[#0F172A] text-xs sm:text-sm">4.9 / 5.0 Rating</span>
            <span className="text-[#E2E8F0]">|</span>
            <span className="text-xs font-semibold text-[#2563EB]">Based on 500+ Patient Feedback Records</span>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonialsData.map((testimonial, index) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default Testimonials;

