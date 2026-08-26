import React from 'react';
import { doctorsData } from '../data/doctors';
import DoctorCard from '../components/DoctorCard';
import CTASection from '../components/CTASection';

const Doctors = () => {
  return (
    <div className="pt-20">
      {/* Page Header */}
      <section className="hero-gradient py-16 md:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] rounded-full border border-[#DBEAFE]">
            Medical Team & Doctors
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-[-0.03em] mt-4">
            Meet Our Specialist Doctors
          </h1>
          <p className="text-[#475569] text-base sm:text-lg max-w-2xl mx-auto mt-4 leading-relaxed font-normal">
            Passionate healthcare professionals committed to delivering gentle, precise, and compassionate dental treatments.
          </p>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {doctorsData.map((doctor, index) => (
            <DoctorCard key={doctor.id} doctor={doctor} index={index} />
          ))}
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default Doctors;

