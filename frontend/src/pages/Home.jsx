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
  Smile
} from 'lucide-react';

const Home = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const whatsappUrl = `https://wa.me/${clinicConfig.whatsappNumber}?text=${encodeURIComponent(
    'Hello Doctor, I would like to book an appointment.'
  )}`;

  return (
    <div className="pt-20">
      {/* 1. HERO SECTION */}
      <section className="relative py-20 md:py-28 hero-gradient overflow-hidden border-b border-[#E2E8F0]/60">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            
            {/* Left Column Text + CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6 text-left"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EFF6FF] border border-[#DBEAFE] text-[#2563EB] text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Trusted Healthcare • Advanced Medical Care</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold text-[#0F172A] tracking-[-0.035em] leading-[1.12]">
                Healthy Smile. <br />
                <span className="text-[#2563EB]">Confident You.</span>
              </h1>

              <p className="text-base sm:text-lg text-[#475569] max-w-xl leading-relaxed font-normal">
                {clinicConfig.subTagline}
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
              <div className="pt-6 border-t border-[#E2E8F0] flex flex-wrap items-center gap-6 text-xs text-[#64748B] font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                  <span>Class-B Sterilization</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                  <span>Painless Treatment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                  <span>Transparent Pricing</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Hero Visual Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 relative flex justify-center"
            >
              <div className="relative w-full max-w-md">
                {/* Visual Image Container */}
                <div className="rounded-[20px] overflow-hidden border border-[#E2E8F0] bg-white shadow-saas aspect-[4/5] relative">
                  <img
                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80"
                    alt="Kalpana Dental Clinic Care"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/40 via-transparent to-transparent" />
                </div>

                {/* Floating Card 1 */}
                <motion.div
                  initial={{ y: 15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="absolute -top-5 -left-5 bg-white p-3.5 rounded-xl shadow-saas flex items-center gap-3 border border-[#E2E8F0]"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center border border-[#DBEAFE]">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#0F172A]">{clinicConfig.stats.experienceYears} Experience</h4>
                    <p className="text-[10px] text-[#64748B] font-medium">Experienced Medical Team</p>
                  </div>
                </motion.div>

                {/* Floating Card 2 */}
                <motion.div
                  initial={{ y: -15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="absolute -bottom-5 -right-5 bg-white p-3.5 rounded-xl shadow-saas flex items-center gap-3 border border-[#E2E8F0]"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center border border-[#DCFCE7]">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-[#0F172A]">{clinicConfig.stats.happyPatients} Patients</h4>
                    <p className="text-[10px] text-[#64748B] font-medium">Trusted Healthcare</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. TRUST / CREDIBILITY / STATISTICS SECTION */}
      <section className="py-12 bg-white border-b border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { number: clinicConfig.stats.experienceYears, label: "Years Experience" },
              { number: clinicConfig.stats.happyPatients, label: "Happy Patients" },
              { number: clinicConfig.stats.proceduresDone, label: "Procedures Done" },
              { number: clinicConfig.stats.satisfactionRate, label: "Satisfaction Rate" },
            ].map((stat, index) => (
              <div key={index} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <p className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                  {stat.number}
                </p>
                <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CLINIC INTRODUCTION / WHY US GRID */}
      <section className="py-20 md:py-28 bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Welcome to Our Hospital"
            title="Your Trusted Partner in Advanced Healthcare"
            subtitle="Combining medical precision, state-of-the-art diagnostic equipment, and compassionate doctor patient relationships."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "Experienced Dentists",
                desc: "Led by specialist doctors with over 4 years of clinical practice and advanced surgery expertise."
              },
              {
                icon: Sparkles,
                title: "Advanced Technology",
                desc: "Digital intraoral radiograph scanners, rotary endodontics, and modern surgical suites."
              },
              {
                icon: HeartHandshake,
                title: "Personalized Care",
                desc: "Tailored treatment protocols designed strictly around patient comfort and transparent guidance."
              },
              {
                icon: CheckCircle2,
                title: "Sterile Environment",
                desc: "Adheres strictly to Class-B autoclave sterilization and international hygiene standards."
              }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  className="peak-card p-6 sm:p-7 text-left flex flex-col justify-between"
                >
                  <div>
                    <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-5 border border-[#DBEAFE]">
                      <Icon className="w-5.5 h-5.5" />
                    </div>
                    <h3 className="text-lg font-bold text-[#0F172A] mb-2 tracking-tight">
                      {feature.title}
                    </h3>
                    <p className="text-[#475569] text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. SERVICES SECTION */}
      <section className="py-20 md:py-28 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Specialized Care"
            title="Our Healthcare Services"
            subtitle="Comprehensive dental and oral healthcare procedures performed by qualified specialist surgeons."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* 5. ABOUT HOSPITAL SECTION (50/50 SPLIT) */}
      <section className="py-20 md:py-28 bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Image */}
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="rounded-[20px] overflow-hidden border border-[#E2E8F0] bg-white shadow-saas h-[440px]">
                  <img
                    src={doctorsData[0].image}
                    alt={doctorsData[0].name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="absolute bottom-5 left-5 right-5 glass-card p-4 rounded-xl border border-[#E2E8F0]">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-[#0F172A] text-sm">{doctorsData[0].name}</h4>
                      <p className="text-xs text-[#2563EB] font-medium">{doctorsData[0].qualification}</p>
                    </div>
                    <span className="text-[11px] bg-[#2563EB] text-white font-semibold px-2.5 py-1 rounded-md">
                      Chief Surgeon
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Text */}
            <div className="lg:col-span-7 space-y-6">
              <span className="inline-flex items-center px-3.5 py-1 text-xs font-semibold tracking-wider text-[#2563EB] bg-[#EFF6FF] rounded-full border border-[#DBEAFE] uppercase">
                ABOUT OUR HOSPITAL
              </span>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
                Dedicated to Crafting Your Healthy, Confident Smile
              </h2>

              <p className="text-[#475569] leading-relaxed text-base">
                {doctorsData[0].bio}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0]">
                  <h4 className="text-2xl font-extrabold text-[#2563EB]">{doctorsData[0].experience}</h4>
                  <p className="text-xs text-[#64748B] mt-0.5">Clinical Surgery Practice</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-[#E2E8F0]">
                  <h4 className="text-2xl font-extrabold text-[#2563EB]">{clinicConfig.stats.satisfactionRate}</h4>
                  <p className="text-xs text-[#64748B] mt-0.5">Patient Satisfaction Rate</p>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  to="/about"
                  variant="primary"
                  size="md"
                  icon={ArrowRight}
                >
                  Learn More About Hospital
                </Button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. DOCTORS SECTION */}
      <section className="py-20 md:py-28 bg-white border-y border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Medical Specialists"
            title="Meet Our Specialist Doctors"
            subtitle="Highly trained dental surgeons committed to clinical excellence and gentle patient treatment."
          />

          <div className="max-w-4xl mx-auto">
            <DoctorCard doctor={doctorsData[0]} />
          </div>

          <div className="text-center mt-10">
            <Button to="/doctors" variant="outline" size="md" icon={ArrowRight}>
              View All Doctors
            </Button>
          </div>
        </div>
      </section>

      {/* 7. TESTIMONIALS SECTION */}
      <section className="py-20 md:py-28 bg-[#F8FAFC]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Patient Reviews"
            title="What Our Patients Say"
            subtitle="Verified reviews and feedback from patients who received treatments at Kalpana Dental Clinic."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonialsData.slice(0, 3).map((testimonial, idx) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} index={idx} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/testimonials"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8]"
            >
              <span>View All Verified Reviews</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. GALLERY PREVIEW */}
      <section className="py-20 md:py-28 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Hospital Facilities"
            title="Our Gallery"
            subtitle="Explore our modern clinic environment, treatment rooms, and surgical equipment."
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

      {/* 9. FAQ ACCORDION PREVIEW */}
      <section className="py-20 md:py-28 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Help Center"
            title="Frequently Asked Questions"
            subtitle="Answers to common questions regarding dental procedures, appointments, and care."
          />

          <div className="space-y-3.5">
            {faqData.slice(0, 5).map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-5 text-left font-bold text-[#0F172A] text-base flex items-center justify-between gap-4 hover:text-[#2563EB] transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#2563EB] shrink-0 transition-transform duration-250 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-[#475569] text-sm leading-relaxed border-t border-[#E2E8F0]/60 pt-3 animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link to="/faqs" className="text-xs font-semibold text-[#2563EB] hover:underline">
              Have more questions? Visit our complete FAQ page →
            </Link>
          </div>
        </div>
      </section>

      {/* 10. GOOGLE MAP & EMERGENCY SECTION */}
      <section className="py-16 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-semibold px-3 py-1 bg-[#EFF6FF] text-[#2563EB] rounded-full border border-[#DBEAFE]">
                Location & Directions
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                Conveniently Located in Kopargaon Bet
              </h2>
              <p className="text-[#475569] text-sm leading-relaxed">
                {clinicConfig.landmark}
              </p>

              <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-[#0F172A]">
                <a
                  href={clinicConfig.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 hover:text-[#2563EB] transition-colors group cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span>{clinicConfig.address}</span>
                </a>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#2563EB] shrink-0" />
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

            <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-saas min-h-[320px] bg-[#F8FAFC]">
              <iframe
                title="Kalpana Dental Clinic Location Map"
                src={clinicConfig.googleMapsEmbed}
                width="100%"
                height="340"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA SECTION */}
      <CTASection />
    </div>
  );
};

export default Home;

