import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { clinicConfig } from '../config/clinicConfig';
import { servicesData } from '../data/services';
import { doctorsData } from '../data/doctors';
import { testimonialsData } from '../data/testimonials';
import { faqData } from '../data/faq';

import Button from '../components/Button';
import SectionTitle from '../components/SectionTitle';
import ServiceCard from '../components/ServiceCard';
import DoctorCard from '../components/DoctorCard';
import TestimonialCard from '../components/TestimonialCard';
import GalleryGrid from '../components/GalleryGrid';
import CTASection from '../components/CTASection';

import {
  Calendar,
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
  ChevronRight
} from 'lucide-react';

const Home = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const whatsappUrl = `https://wa.me/${clinicConfig.whatsappNumber}?text=${encodeURIComponent(
    'Hello Doctor, I would like to book an appointment.'
  )}`;

  return (
    <div className="pt-20">
      {/* 1. HERO SECTION */}
      <section className="relative py-16 md:py-24 bg-gradient-to-b from-sky-50/70 via-white to-white overflow-hidden">
        {/* Background decorative blue shape */}
        <div className="absolute top-1/4 right-0 w-96 md:w-[600px] h-96 md:h-[600px] bg-sky-200/30 rounded-full blur-3xl -z-10 transform translate-x-1/3 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/80 border border-sky-200 text-sky-800 text-xs sm:text-sm font-semibold">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>{clinicConfig.tagline}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 tracking-tight leading-[1.15]">
                Healthy Smile. <br />
                <span className="text-sky-500">Confident You.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                {clinicConfig.subTagline}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  to="/appointment"
                  variant="primary"
                  size="lg"
                  icon={Calendar}
                >
                  Book Appointment
                </Button>

                <Button
                  href={`tel:${clinicConfig.phone}`}
                  variant="outline"
                  size="lg"
                  icon={PhoneCall}
                >
                  Call Now
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

              {/* Trust Indicators / Badges */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-500" />
                  <span>ISO Sterilization Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-500" />
                  <span>Painless Treatment Options</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-500" />
                  <span>Transparent Pricing</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Image with soft background shape & floating cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 relative flex justify-center"
            >
              <div className="relative w-full max-w-md">
                {/* Soft Light Blue Backdrop Card */}
                <div className="absolute inset-0 bg-sky-100 rounded-3xl transform rotate-3 scale-105 -z-10" />

                {/* Main Hero Image */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-[4/5]">
                  <img
                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80"
                    alt="Kalpana Dental Clinic Care"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Card 1: 10+ Years Experience */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="absolute -top-6 -left-6 glass-card p-3.5 rounded-2xl shadow-lg flex items-center gap-3 border border-sky-100"
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{clinicConfig.stats.experienceYears} Experience</h4>
                    <p className="text-[11px] text-slate-500">Excellence in Dental Care</p>
                  </div>
                </motion.div>

                {/* Floating Card 2: 5000+ Happy Patients */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute -bottom-6 -right-6 glass-card p-3.5 rounded-2xl shadow-lg flex items-center gap-3 border border-sky-100"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{clinicConfig.stats.happyPatients} Patients</h4>
                    <p className="text-[11px] text-slate-500">Trusted Smiles</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. CLINIC INTRODUCTION SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Welcome to Our Clinic"
            title="Your Trusted Dental Care Partner"
            subtitle="At Kalpana Dental Clinic, we combine medical precision, state-of-the-art technology, and genuine human warmth to deliver an unforgettable dental experience."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              {
                icon: ShieldCheck,
                title: "Experienced Dentists",
                desc: "12+ years of clinical excellence led by specialist doctors."
              },
              {
                icon: Sparkles,
                title: "Advanced Technology",
                desc: "Digital X-rays, 3D intraoral scanners & laser equipment."
              },
              {
                icon: HeartHandshake,
                title: "Personalized Care",
                desc: "Tailored treatment plans tailored strictly to your comfort."
              },
              {
                icon: CheckCircle2,
                title: "Comfortable Environment",
                desc: "Relaxing, stress-free clinic atmosphere for all age groups."
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  className="bg-sky-50/50 p-6 rounded-2xl border border-sky-100/80 shadow-soft text-center group hover:bg-white hover:border-sky-200 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white text-sky-600 flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. FEATURED SERVICES SECTION */}
      <section className="py-20 bg-gradient-to-b from-sky-50/40 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Specialized Care"
            title="Our Dental Services"
            subtitle="Comprehensive dental care for every stage of life, using gentle and effective methods."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {servicesData.slice(0, 6).map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              to="/services"
              variant="outline"
              size="lg"
              icon={ArrowRight}
            >
              View All Services
            </Button>
          </div>
        </div>
      </section>

      {/* 4. ABOUT / DOCTOR INTRODUCTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="absolute -inset-2 bg-sky-200 rounded-3xl transform -rotate-2 -z-10" />
                <img
                  src={doctorsData[0].image}
                  alt={doctorsData[0].name}
                  className="rounded-3xl shadow-xl w-full h-[450px] object-cover object-center"
                />
                <div className="absolute bottom-6 left-6 right-6 glass-card p-4 rounded-2xl shadow-lg border border-sky-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{doctorsData[0].name}</h4>
                      <p className="text-xs text-sky-600 font-medium">{doctorsData[0].qualification}</p>
                    </div>
                    <span className="text-xs bg-sky-500 text-white font-bold px-2.5 py-1 rounded-md">
                      Chief Dentist
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              <span className="inline-block px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-700 bg-sky-100 rounded-full">
                Meet Our Dentist
              </span>

              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-tight">
                Dedicated to Crafting Your Perfect, Healthy Smile
              </h2>

              <p className="text-slate-600 leading-relaxed">
                {doctorsData[0].bio}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-sky-50 p-4 rounded-xl border border-sky-100">
                  <h4 className="text-2xl font-bold text-sky-700">{doctorsData[0].experience}</h4>
                  <p className="text-xs text-slate-600 mt-1">Clinical Practice & Surgery</p>
                </div>
                <div className="bg-sky-50 p-4 rounded-xl border border-sky-100">
                  <h4 className="text-2xl font-bold text-sky-700">{clinicConfig.stats.satisfactionRate}</h4>
                  <p className="text-xs text-slate-600 mt-1">Patient Satisfaction Rate</p>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  to="/doctors"
                  variant="primary"
                  size="md"
                  icon={ArrowRight}
                >
                  Meet Our Doctors
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <section className="py-20 bg-sky-50/70 border-y border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Why Us"
            title="Why Choose Our Dental Clinic?"
            subtitle="We prioritize your comfort, health, and peace of mind with gold-standard dental practices."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {[
              {
                title: "Experienced Care",
                desc: "Highly qualified dental professionals focused on high precision and quality treatment."
              },
              {
                title: "Modern Technology",
                desc: "State-of-the-art equipment for painless, accurate diagnosis and treatment."
              },
              {
                title: "Patient Comfort",
                desc: "A calming and compassionate environment ensuring zero anxiety for every patient."
              },
              {
                title: "Personalized Treatment",
                desc: "Custom treatment plans tailored specifically to your unique dental goals."
              }
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-7 rounded-2xl border border-sky-100 shadow-soft flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 font-extrabold flex items-center justify-center mb-4 text-sm">
                    0{idx + 1}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TESTIMONIALS SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Patient Reviews"
            title="What Our Patients Say"
            subtitle="Read real stories from patients who restored their smiles and confidence at Kalpana Dental Clinic."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {testimonialsData.slice(0, 3).map((testimonial, idx) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={idx} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/testimonials"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 hover:text-sky-700"
            >
              <span>Read All Patient Reviews</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. GALLERY PREVIEW */}
      <section className="py-20 bg-sky-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Clinic Tour"
            title="Our Gallery"
            subtitle="Explore our modern clinic facilities, treatment suites, and happy smiles."
          />

          <GalleryGrid limit={6} />

          <div className="text-center mt-10">
            <Button
              to="/gallery"
              variant="outline"
              size="md"
              icon={ArrowRight}
            >
              View Full Gallery
            </Button>
          </div>
        </div>
      </section>

      {/* 8. FAQ ACCORDION PREVIEW */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Questions & Answers"
            title="Frequently Asked Questions"
            subtitle="Get quick answers to common questions about dental procedures, appointments, and care."
          />

          <div className="space-y-4 mt-12">
            {faqData.slice(0, 5).map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-sky-100 overflow-hidden shadow-soft"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left font-bold text-slate-800 text-base md:text-lg flex items-center justify-between gap-4 hover:text-sky-600 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-sky-500 shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-50 pt-3 animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link to="/faqs" className="text-sm font-semibold text-sky-600 hover:underline">
              Have more questions? Visit our complete FAQ page →
            </Link>
          </div>
        </div>
      </section>

      {/* 9. GOOGLE MAP SECTION */}
      <section className="py-16 bg-sky-50/60 border-t border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-semibold px-3 py-1 bg-sky-100 text-sky-800 rounded-full">
                Visit Us
              </span>
              <h2 className="text-3xl font-bold text-slate-800">
                Conveniently Located in City Center
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our clinic is easily accessible with ample parking and wheelchair access.
              </p>

              <div className="space-y-3 pt-2 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <span>{clinicConfig.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-sky-600 shrink-0" />
                  <span>{clinicConfig.workingHours.weekdays}</span>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  href={clinicConfig.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  size="sm"
                  icon={ExternalLink}
                >
                  Get Directions on Google Maps
                </Button>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-3xl overflow-hidden shadow-lg border-2 border-white min-h-[320px] bg-slate-200">
              <iframe
                title="Kalpana Dental Clinic Location Map"
                src={clinicConfig.googleMapsEmbed}
                width="100%"
                height="350"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 10. CTA SECTION */}
      <CTASection />
    </div>
  );
};

export default Home;
