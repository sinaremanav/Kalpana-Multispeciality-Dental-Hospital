import React, { useState, useEffect } from 'react';
import { testimonialService } from '../services/testimonialService';
import { faqData } from '../data/faq';
import TestimonialCard from '../components/TestimonialCard';
import CTASection from '../components/CTASection';
import LoadingState from '../components/LoadingState';
import SEO from '../components/SEO';
import { getFAQSchema } from '../config/seoConfig';
import { Star, MessageSquareQuote, HelpCircle, Search, ChevronDown, Sparkles } from 'lucide-react';

const ReviewsAndFAQs = () => {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'reviews' | 'faqs'
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    testimonialService
      .getTestimonials(true)
      .then((data) => {
        if (data) setTestimonials(data);
      })
      .catch((err) => console.error('Failed to load testimonials:', err))
      .finally(() => setLoading(false));
  }, []);

  const filteredFaqs = faqData.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-20">
      <SEO
        page="reviewsFaqs"
        schema={getFAQSchema(faqData)}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Reviews & FAQs", url: "/reviews-faqs" },
        ]}
      />

      {/* Header Banner */}
      <section className="hero-gradient py-16 md:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#059669] bg-[#ECFDF5] rounded-full border border-[#D1FAE5]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Patient Trust & Help Center</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-[-0.03em] mt-4">
            Reviews & Frequently Asked Questions
          </h1>
          <p className="text-[#475569] text-base sm:text-lg max-w-2xl mx-auto mt-4 leading-relaxed font-normal">
            Read verified patient stories about their painless treatments and find answers to all common dental queries.
          </p>

          {/* Rating Summary Bar */}
          <div className="inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-full shadow-saas mt-6 border border-[#E2E8F0]">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-bold text-[#0F172A] text-xs sm:text-sm">4.9 / 5.0 Rating</span>
            <span className="text-[#CBD5E1]">|</span>
            <span className="text-xs font-semibold text-[#059669]">500+ Happy Patients</span>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-[#059669] text-white shadow-xs'
                  : 'bg-white text-[#475569] hover:bg-[#F8FAFC] border border-[#E2E8F0]'
              }`}
            >
              All (Reviews & FAQs)
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'reviews'
                  ? 'bg-[#059669] text-white shadow-xs'
                  : 'bg-white text-[#475569] hover:bg-[#F8FAFC] border border-[#E2E8F0]'
              }`}
            >
              Patient Reviews ({testimonials.length})
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'faqs'
                  ? 'bg-[#059669] text-white shadow-xs'
                  : 'bg-white text-[#475569] hover:bg-[#F8FAFC] border border-[#E2E8F0]'
              }`}
            >
              FAQs ({faqData.length})
            </button>
          </div>
        </div>
      </section>

      {/* Main Unified Content */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-20">
        {/* REVIEWS SECTION */}
        {(activeTab === 'all' || activeTab === 'reviews') && (
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E2E8F0]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">Patient Feedback</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
                  What Our Patients Say
                </h2>
              </div>
              <div className="text-xs text-[#64748B]">
                Showing real testimonials from patients treated at Kalpana Dental Clinic
              </div>
            </div>

            {loading ? (
              <LoadingState message="Loading patient reviews..." />
            ) : testimonials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial, idx) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} index={idx} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-sm text-[#64748B]">
                No reviews found.
              </div>
            )}
          </section>
        )}

        {/* FAQS SECTION */}
        {(activeTab === 'all' || activeTab === 'faqs') && (
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E2E8F0]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">Quick Help</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">
                  Frequently Asked Questions
                </h2>
              </div>

              {/* FAQ Search */}
              <div className="w-full sm:w-72 relative">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white rounded-xl border border-[#CBD5E1] text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </div>
            </div>

            <div className="max-w-4xl mx-auto space-y-3.5">
              {filteredFaqs.length > 0 ? (
                filteredFaqs.map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-xs"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="w-full p-5 text-left font-bold text-[#0F172A] text-base flex items-center justify-between gap-4 hover:text-[#059669] transition-colors cursor-pointer"
                      >
                        <span className="flex items-center gap-3">
                          <HelpCircle className="w-4 h-4 text-[#059669] shrink-0" />
                          <span>{faq.question}</span>
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#059669] shrink-0 transition-transform duration-250 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-5 pb-5 text-[#475569] text-sm leading-relaxed border-t border-[#E2E8F0]/60 pt-3 animate-fade-in pl-12">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-10 bg-white rounded-xl border border-[#E2E8F0] text-sm text-[#64748B]">
                  No questions match your search "{searchQuery}".
                </div>
              )}
            </div>
          </section>
        )}
      </div>

      <CTASection />
    </div>
  );
};

export default ReviewsAndFAQs;
