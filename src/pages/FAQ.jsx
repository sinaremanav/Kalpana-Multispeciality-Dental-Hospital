import React, { useState } from 'react';
import { faqData } from '../data/faq';
import SectionTitle from '../components/SectionTitle';
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
    <div className="pt-24 pb-16">
      {/* Header Banner */}
      <section className="bg-sky-50 py-16 border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-800 bg-sky-100 rounded-full">
            Help Center
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mt-4">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto mt-4 mb-8">
            Find answers to common questions about dental procedures, appointments, costs, and emergency care.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search a question (e.g. root canal, cost, appointment)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-sky-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-md"
            />
          </div>
        </div>
      </section>

      {/* Accordion List */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-sky-100 overflow-hidden shadow-soft transition-all duration-200"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full p-6 text-left font-bold text-slate-800 text-base md:text-lg flex items-center justify-between gap-4 hover:text-sky-600 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-sky-500 shrink-0" />
                      <span>{faq.question}</span>
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-sky-500 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-50 pt-4 animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-sky-50 rounded-2xl">
              <p className="text-slate-600">No matching questions found for "{searchQuery}".</p>
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default FAQ;
