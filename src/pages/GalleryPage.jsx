import React from 'react';
import GalleryGrid from '../components/GalleryGrid';
import CTASection from '../components/CTASection';

const GalleryPage = () => {
  return (
    <div className="pt-24 pb-16">
      {/* Header Banner */}
      <section className="bg-sky-50 py-16 border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-800 bg-sky-100 rounded-full">
            Visual Experience
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mt-4">
            Clinic & Smile Gallery
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto mt-4">
            Take a look inside our clean treatment operatories, advanced dental equipment, and happy patient smiles.
          </p>
        </div>
      </section>

      {/* Main Gallery Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GalleryGrid />
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default GalleryPage;
