import React from 'react';
import { motion } from 'framer-motion';
import { doctorsData } from '../data/doctors';
import DoctorCard from '../components/DoctorCard';
import SectionTitle from '../components/SectionTitle';
import CTASection from '../components/CTASection';

const Doctors = () => {
  return (
    <div className="pt-24 pb-16">
      {/* Page Header */}
      <section className="bg-sky-50 py-16 border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-800 bg-sky-100 rounded-full">
            Our Medical Team
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mt-4">
            Meet Our Specialist Dentists
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto mt-4">
            Passionate healthcare professionals committed to delivering gentle, precise, and compassionate dental treatments.
          </p>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
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
