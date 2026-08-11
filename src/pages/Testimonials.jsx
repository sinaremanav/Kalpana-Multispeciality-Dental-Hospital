import React from 'react';
import { testimonialsData } from '../data/testimonials';
import TestimonialCard from '../components/TestimonialCard';
import SectionTitle from '../components/SectionTitle';
import CTASection from '../components/CTASection';
import { Star, ShieldCheck } from 'lucide-react';
import { clinicConfig } from '../config/clinicConfig';

const Testimonials = () => {
  return (
    <div className="pt-24 pb-16">
      {/* Header Banner */}
      <section className="bg-sky-50 py-16 border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-800 bg-sky-100 rounded-full">
            Patient Stories
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mt-4">
            Patient Feedback & Reviews
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto mt-4">
            Hear directly from our patients about their experiences, treatments, and smiles.
          </p>

          {/* Rating Summary Bar */}
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md mt-8 border border-sky-100">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-bold text-slate-800 text-sm">4.9 / 5.0</span>
            <span className="text-slate-400 text-xs">|</span>
            <span className="text-xs font-semibold text-sky-700">Based on 500+ Verified Patient Reviews</span>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
