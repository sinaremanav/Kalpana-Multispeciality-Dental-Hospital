import React, { useState, useEffect } from 'react';
import { testimonialService } from '../services/testimonialService';
import TestimonialCard from '../components/TestimonialCard';
import CTASection from '../components/CTASection';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { Star, MessageSquareQuote } from 'lucide-react';

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTestimonials = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await testimonialService.getTestimonials(true);
      setTestimonials(list);
    } catch (err) {
      console.error('Failed to load testimonials:', err);
      setError(err.message || 'Unable to load patient reviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

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
      <section className="py-20 md:py-24 bg-white min-h-[400px]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <LoadingState message="Loading verified patient stories..." minHeight="min-h-[300px]" />
          ) : error ? (
            <ErrorState title="Unable to load reviews" message={error} onRetry={fetchTestimonials} />
          ) : testimonials.length === 0 ? (
            <EmptyState
              icon={MessageSquareQuote}
              title="No Patient Reviews Found"
              description="Patient reviews will be published here."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={testimonial.id} testimonial={testimonial} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default Testimonials;
