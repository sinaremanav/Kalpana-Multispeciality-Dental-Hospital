import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { clinicConfig as fallbackConfig } from '../config/clinicConfig';
import { servicesData as fallbackServices } from '../data/services';
import { doctorsData as fallbackDoctors } from '../data/doctors';
import { testimonialsData as fallbackTestimonials } from '../data/testimonials';
import { faqData } from '../data/faq';
import { doctorService } from '../services/doctorService';
import { serviceService } from '../services/serviceService';
import { testimonialService } from '../services/testimonialService';
import { clinicService } from '../services/clinicService';
import { eventService } from '../services/eventService';

import Button from '../components/Button';
import SectionTitle from '../components/SectionTitle';
import ServiceCard from '../components/ServiceCard';
import DoctorCard from '../components/DoctorCard';
import TestimonialCard from '../components/TestimonialCard';
import GalleryGrid from '../components/GalleryGrid';
import CTASection from '../components/CTASection';
import SEO from '../components/SEO';
import { getLocalBusinessSchema, getWebSiteSchema } from '../config/seoConfig';

import {
  PhoneCall,
  MessageCircle,
  Award,
  Users,
  ShieldCheck,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  Activity,
  Smile,
  Calendar,
  Star,
} from 'lucide-react';

const Home = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [clinic, setClinic] = useState(fallbackConfig);
  const [services, setServices] = useState(fallbackServices);
  const [doctors, setDoctors] = useState(fallbackDoctors);
  const [testimonials, setTestimonials] = useState(fallbackTestimonials);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    clinicService.getClinicSettings().then(setClinic);
    serviceService.getServices(true).then((data) => {
      if (data && data.length > 0) setServices(data);
    });
    doctorService.getDoctors(true).then((data) => {
      if (data && data.length > 0) setDoctors(data);
    });
    testimonialService.getTestimonials(true).then((data) => {
      if (data && data.length > 0) setTestimonials(data);
    });
    eventService.getCategorizedEvents().then((data) => {
      if (data?.upcoming) setUpcomingEvents(data.upcoming.slice(0, 2));
    });
  }, []);

  const whatsappUrl = `https://wa.me/${clinic.whatsappNumber || fallbackConfig.whatsappNumber}?text=${encodeURIComponent(
    'Hello Doctor, I would like to book an appointment.'
  )}`;

  const mainDoctor = doctors[0] || fallbackDoctors[0];

  return (
    <div className="pt-20">
      <SEO page="home" schema={[getLocalBusinessSchema(), getWebSiteSchema()]} />

      {/* 1. HERO SECTION */}
      <section className="relative py-20 md:py-28 hero-gradient overflow-hidden border-b border-[#E2E8F0]/60 dark:border-slate-800/60">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-72 h-72 bg-emerald-400/20 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Left Column Text + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECFDF5] dark:bg-slate-800 border border-[#D1FAE5] dark:border-slate-700 text-[#059669] dark:text-emerald-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#059669] dark:text-emerald-400" />
                <span>Trusted Healthcare • Advanced Medical Care</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold text-slate-900 dark:text-white tracking-[-0.03em] leading-[1.12] transition-colors duration-500">
                Healthy Smile. <br />
                <span className="creative-gradient-text transition-colors duration-500">Confident You.</span>
                <span className="sr-only"> — Comprehensive Dental Care at Kalpana Multispeciality Dental Hospital Kopargaon</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed font-normal transition-colors duration-500">
                {clinic.subTagline || fallbackConfig.subTagline}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  to="/appointment"
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                >
                  Book an Appointment
                </Button>

                <Button
                  to="/services"
                  variant="outline"
                  size="lg"
                >
                  Explore Services
                </Button>

                <Button
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="whatsapp"
                  size="lg"
                  icon={MessageCircle}
                >
                  WhatsApp
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-[#E2E8F0] dark:border-slate-800 flex flex-wrap items-center gap-6 text-xs text-[#64748B] dark:text-slate-400 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#059669] dark:text-emerald-400" />
                  <span>Experienced Doctors</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#059669] dark:text-emerald-400" />
                  <span>Modern Sterilized Operatories</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#059669] dark:text-emerald-400" />
                  <span>Digital Low-Radiation RVG</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column Doctor Image & Stats Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#ECFDF5] to-white dark:from-slate-800 dark:to-slate-900 border border-[#E2E8F0] dark:border-slate-700 shadow-saas dark-glow-shadow">
                  <img
                    src={mainDoctor.image_url || mainDoctor.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800'}
                    alt={`${mainDoctor.name} - Chief Dental Surgeon at Kalpana Multispeciality Dental Hospital Kopargaon`}
                    width="800"
                    height="800"
                    fetchPriority="high"
                    className="w-full h-[440px] sm:h-[480px] object-cover object-top"
                  />

                  {/* Doctor Info Floating Card */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-2xl border border-[#E2E8F0] dark:border-slate-700 shadow-saas">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-[#0F172A] dark:text-white text-sm sm:text-base">
                          {mainDoctor.name}
                        </h3>
                        <p className="text-xs text-[#059669] dark:text-emerald-400 font-semibold mt-0.5">
                          {mainDoctor.qualification}
                        </p>
                      </div>
                      <span className="text-[11px] font-bold bg-[#ECFDF5] dark:bg-slate-800 text-[#059669] dark:text-emerald-400 px-2.5 py-1 rounded-md border border-[#D1FAE5] dark:border-slate-700">
                        Lead Surgeon
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. UPCOMING CAMPS & EVENTS BANNER (If available) */}
      {upcomingEvents.length > 0 && (
        <section className="py-4 bg-[#ECFDF5] dark:bg-slate-800/80 border-b border-[#D1FAE5] dark:border-slate-700">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#065F46] dark:text-emerald-300 font-semibold">
              <Sparkles className="w-4 h-4 text-[#059669] dark:text-emerald-400 shrink-0" />
              <span>Upcoming Dental Camp: <strong>{upcomingEvents[0].title}</strong> on {upcomingEvents[0].event_date}</span>
            </div>
            <Link
              to="/events"
              className="font-bold text-[#059669] dark:text-emerald-400 hover:underline flex items-center gap-1 shrink-0"
            >
              View Camp Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      )}

      {/* 3. KEY CLINIC STATS */}
      <section className="py-12 bg-white dark:bg-slate-900 border-b border-[#E2E8F0] dark:border-slate-800">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              {
                number: clinic.stats?.experienceYears || fallbackConfig.stats.experienceYears,
                label: 'Years Clinical Experience',
                sub: 'Dr. Nikhil & Team',
              },
              {
                number: clinic.stats?.happyPatients || fallbackConfig.stats.happyPatients,
                label: 'Smiles Restored',
                sub: 'Satisfied Patients',
              },
              {
                number: clinic.stats?.proceduresDone || fallbackConfig.stats.proceduresDone,
                label: 'Painless Treatments Done',
                sub: 'High Success Rate',
              },
              {
                number: clinic.stats?.satisfactionRate || fallbackConfig.stats.satisfactionRate,
                label: 'Patient Rating Score',
                sub: '5-Star Clinical Feedback',
              },
            ].map((stat, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 dark-glow-shadow">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#059669] dark:text-emerald-400 tracking-tight">
                  {stat.number}
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-1 transition-colors duration-500">{stat.label}</div>
                <div className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 transition-colors duration-500">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SERVICES PREVIEW */}
      <section className="py-20 md:py-28 bg-[#F8FAFC] dark:bg-slate-900/50">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Clinical Treatments"
            title="Comprehensive Dental Care"
            subtitle="Explore our advanced restorative and aesthetic dental treatments designed for painless, long-lasting outcomes."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 6).map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button to="/services" variant="primary" size="md" icon={ArrowRight}>
              View All Dental Treatments
            </Button>
          </div>
        </div>
      </section>

      {/* 5. ABOUT DOCTOR HIGHLIGHT */}
      <section className="py-20 md:py-28 bg-white dark:bg-slate-900">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Image */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-saas dark-glow-shadow border border-[#E2E8F0] dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
                <img
                  src={mainDoctor.image_url || mainDoctor.image || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800'}
                  alt={`${mainDoctor.name} - Chief Dental Surgeon & Founder at Kalpana Multispeciality Dental Hospital`}
                  width="800"
                  height="800"
                  loading="lazy"
                  className="w-full h-[420px] sm:h-[460px] object-cover object-top"
                />
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-[#E2E8F0] dark:border-slate-700">
                  <h4 className="font-bold text-[#0F172A] dark:text-white text-sm">{mainDoctor.name}</h4>
                  <p className="text-xs text-[#059669] dark:text-emerald-400 font-medium">{mainDoctor.qualification}</p>
                </div>
              </div>
            </div>

            {/* Right Text */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center px-3.5 py-1 text-xs font-semibold tracking-wider text-[#059669] dark:text-emerald-400 bg-[#ECFDF5] dark:bg-slate-800 rounded-full border border-[#D1FAE5] dark:border-slate-700 uppercase">
                ABOUT OUR CHIEF SURGEON
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight transition-colors duration-500">
                Dedicated to Crafting Your Healthy, Confident Smile
              </h2>

              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base transition-colors duration-500">
                {mainDoctor.bio || clinic.aboutText || fallbackConfig.aboutText}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-[#F8FAFC] dark:bg-slate-800 p-4 rounded-xl border border-[#E2E8F0] dark:border-slate-700">
                  <h4 className="text-2xl font-extrabold text-[#059669] dark:text-emerald-400">{mainDoctor.experience || '4+ Years'}</h4>
                  <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">Clinical Practice</p>
                </div>
                <div className="bg-[#F8FAFC] dark:bg-slate-800 p-4 rounded-xl border border-[#E2E8F0] dark:border-slate-700">
                  <h4 className="text-2xl font-extrabold text-[#059669] dark:text-emerald-400">
                    {clinic.stats?.satisfactionRate || fallbackConfig.stats.satisfactionRate}
                  </h4>
                  <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">Patient Satisfaction</p>
                </div>
              </div>

              <div className="pt-2">
                <Button to="/about" variant="primary" size="md" icon={ArrowRight}>
                  Learn More About Clinic
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. GALLERY PREVIEW */}
      <section className="py-20 md:py-28 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Hospital Facilities"
            title="Our Gallery"
            subtitle="Explore our modern clinic environment, treatment rooms, and surgical equipment."
          />

          <GalleryGrid limit={6} />

          <div className="text-center mt-10">
            <Button to="/gallery" variant="outline" size="md" icon={ArrowRight}>
              View Full Gallery
            </Button>
          </div>
        </div>
      </section>

      {/* 7. UNIFIED REVIEWS & FAQS SECTION */}
      <section className="py-20 md:py-28 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Patient Trust & Help Center"
            title="Reviews & Frequently Asked Questions"
            subtitle="Explore real patient experiences alongside quick answers to common questions about dental procedures and care."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start mt-12">
            {/* Left 6 cols: Patient Reviews */}
            <div className="lg:col-span-6 space-y-5">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#0F172A]">
                    4.9 / 5.0 Rating (500+ Patients)
                  </span>
                </div>
                <Link
                  to="/reviews-faqs"
                  className="text-xs font-bold text-[#059669] hover:text-[#047857] flex items-center gap-1 shrink-0"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-4">
                {testimonials.slice(0, 2).map((testimonial, idx) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} index={idx} />
                ))}
              </div>
            </div>

            {/* Right 6 cols: FAQ Accordion */}
            <div className="lg:col-span-6 space-y-3.5">
              <div className="flex items-center justify-between px-1 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#059669]">
                  Common Questions
                </span>
                <Link
                  to="/reviews-faqs"
                  className="text-xs font-bold text-[#059669] hover:text-[#047857] flex items-center gap-1"
                >
                  <span>View Full FAQ</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {faqData.slice(0, 4).map((faq, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <div
                      key={index}
                      className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-xs"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                        className="w-full p-4 text-left font-bold text-[#0F172A] text-sm sm:text-base flex items-center justify-between gap-3 hover:text-[#059669] transition-colors cursor-pointer"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-[#059669] shrink-0 transition-transform duration-250 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 text-[#475569] text-xs sm:text-sm leading-relaxed border-t border-[#E2E8F0]/60 pt-2.5 animate-fade-in">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button to="/reviews-faqs" variant="secondary" size="md" icon={ArrowRight}>
              Explore All Reviews & FAQs
            </Button>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default Home;
