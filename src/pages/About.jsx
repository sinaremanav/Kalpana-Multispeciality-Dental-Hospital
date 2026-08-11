import React from 'react';
import { motion } from 'framer-motion';
import { clinicConfig } from '../config/clinicConfig';
import { doctorsData } from '../data/doctors';
import SectionTitle from '../components/SectionTitle';
import DoctorCard from '../components/DoctorCard';
import CTASection from '../components/CTASection';
import { ShieldCheck, Heart, Sparkles, Award, CheckCircle, Flame } from 'lucide-react';

const About = () => {
  return (
    <div className="pt-24 pb-16">
      {/* Header Banner */}
      <section className="bg-sky-50 py-16 border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-800 bg-sky-100 rounded-full"
          >
            About Kalpana Dental Clinic
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold text-slate-800 mt-4"
          >
            Compassionate Dental Excellence
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-600 text-lg max-w-2xl mx-auto mt-4"
          >
            Providing gentle, modern, and trustworthy dental care for families since 2014.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-sky-50/70 p-8 rounded-3xl border border-sky-100 shadow-soft">
              <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center mb-6">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed">
                To deliver world-class, painless, and transparent dental care to every patient. We prioritize preventive education, gentle treatment protocols, and long-term oral wellness over quick fixes.
              </p>
            </div>

            <div className="bg-sky-50/70 p-8 rounded-3xl border border-sky-100 shadow-soft">
              <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed">
                To be recognized as the city's most trusted, patient-centric dental care center where state-of-the-art technology meets genuine human compassion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sterilization Standards */}
      <section className="py-20 bg-sky-50/40 border-y border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="100% Sterile & Safe"
            title="World-Class Hygiene & Safety"
            subtitle="Your safety is our non-negotiable priority. We adhere strictly to international hospital sterilization standards."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
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
              <div key={idx} className="bg-white p-7 rounded-2xl border border-sky-100 shadow-soft">
                <ShieldCheck className="w-10 h-10 text-sky-500 mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Doctor Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Expert Leadership"
            title="Meet Our Founder & Chief Dentist"
            subtitle="Led by Dr. Nikhil Hiralal Mahanubhav with over 12 years of specialized dental clinical practice in Kopargaon."
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
