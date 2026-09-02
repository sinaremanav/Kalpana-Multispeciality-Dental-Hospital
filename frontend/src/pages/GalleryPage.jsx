import React from 'react';
import GalleryGrid from '../components/GalleryGrid';
import CTASection from '../components/CTASection';

const GalleryPage = () => {
  return (
    <div className="pt-20">
      {/* Header Banner */}
      <section className="hero-gradient py-16 md:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#059669] bg-[#ECFDF5] rounded-full border border-[#D1FAE5]">
            Hospital Visual Experience
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-[-0.03em] mt-4">
            Hospital Facilities & Gallery
          </h1>
          <p className="text-[#475569] text-base sm:text-lg max-w-2xl mx-auto mt-4 leading-relaxed font-normal">
            Take a look inside our clean treatment operatories, surgical suites, and advanced diagnostic equipment.
          </p>
        </div>
      </section>

      {/* Main Gallery Section */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <GalleryGrid />
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default GalleryPage;

