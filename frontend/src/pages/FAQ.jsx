import React, { useState } from 'react';
import { faqData } from '../data/faq';
import CTASection from '../components/CTASection';
import { ChevronDown, HelpCircle, Search } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-20">
      {/* Header Banner */}
      <section className="hero-gradient py-16 md:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] rounded-full border border-[#DBEAFE]">
            Help Center & FAQs
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-[-0.03em] mt-4">
            Frequently Asked Questions
          </h1>
          <p className="text-[#475569] text-base sm:text-lg max-w-2xl mx-auto mt-4 mb-8 leading-relaxed font-normal">
            Find quick answers to common questions about dental procedures, appointments, costs, and care.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-[#64748B] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search a question (e.g. root canal, cost, location)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-[#E2E8F0] text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] shadow-saas"
            />
          </div>
        </div>
      </section>

      {/* Accordion List */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3.5">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left font-bold text-[#0F172A] text-base flex items-center justify-between gap-4 hover:text-[#2563EB] transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-4 h-4 text-[#2563EB] shrink-0" />
                      <span>{faq.question}</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#2563EB] shrink-0 transition-transform duration-250 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-[#475569] text-sm leading-relaxed border-t border-[#E2E8F0]/60 pt-3 animate-fade-in font-normal">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <p className="text-[#475569] text-sm">No matching questions found for "{searchQuery}".</p>
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default FAQ;

