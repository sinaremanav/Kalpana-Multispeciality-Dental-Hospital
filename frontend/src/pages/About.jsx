import React from 'react';
import { motion } from 'framer-motion';
import { clinicConfig } from '../config/clinicConfig';
import { doctorsData } from '../data/doctors';
import SectionTitle from '../components/SectionTitle';
import DoctorCard from '../components/DoctorCard';
import CTASection from '../components/CTASection';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <div className="pt-20">
      {/* Header Banner */}
      <section className="hero-gradient py-16 md:py-24 border-b border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] rounded-full border border-[#DBEAFE]"
          >
            About {clinicConfig.clinicName}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-[#0F172A] tracking-[-0.03em] mt-4"
          >
            Compassionate Healthcare Excellence
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[#475569] text-base sm:text-lg max-w-2xl mx-auto mt-4 leading-relaxed font-normal"
          >
            Providing gentle, modern, and trustworthy dental & oral healthcare for families across Kopargaon.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="peak-card p-8 sm:p-10">
              <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-6 border border-[#DBEAFE]">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#0F172A] mb-3 tracking-tight">Our Mission</h3>
              <p className="text-[#475569] text-sm leading-relaxed">
                To deliver world-class, painless, and transparent dental care to every patient. We prioritize preventive education, gentle treatment protocols, and long-term oral wellness.
              </p>
            </div>

            <div className="peak-card p-8 sm:p-10">
              <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-6 border border-[#DBEAFE]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-[#0F172A] mb-3 tracking-tight">Our Vision</h3>
              <p className="text-[#475569] text-sm leading-relaxed">
                To be recognized as the most trusted, patient-centric dental care center where state-of-the-art diagnostic technology meets genuine human compassion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sterilization Standards */}
      <section className="py-20 md:py-24 bg-[#F8FAFC] border-y border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="100% Sterile & Safe"
            title="World-Class Hygiene & Safety"
            subtitle="Your safety is our non-negotiable priority. We adhere strictly to international hospital sterilization standards."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Class-B Autoclave Sterilization",
                desc: "All non-disposable instruments undergo multi-stage ultrasonic cleaning and high-pressure steam autoclaving."
              },
              {
                title: "Single-Use Disposable Consumables",
                desc: "Needles, gloves, suction tips, patient drapes, and cups are strictly 100% disposable single-use items."
              },
              {
                title: "Air & Surface Disinfection",
                desc: "Operatories are sanitized between every single patient session with medical-grade hospital disinfectants."
              }
            ].map((item, idx) => (
              <div key={idx} className="peak-card p-7">
                <div className="w-10 h-10 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-4 border border-[#DBEAFE]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-[#0F172A] mb-2 tracking-tight">{item.title}</h3>
                <p className="text-[#475569] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctor Section */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Medical Leadership"
            title="Meet Our Chief Dentist & Surgeon"
            subtitle="Led by Dr. Nikhil Hiralal Mahanubhav with specialized expertise in oral surgery, RCT, and maxillofacial prosthetics."
          />

          <div className="max-w-4xl mx-auto">
            <DoctorCard doctor={doctorsData[0]} />
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default About;

