import React from 'react';
import { servicesData } from '../data/services';
import ServiceCard from '../components/ServiceCard';
import SectionTitle from '../components/SectionTitle';
import CTASection from '../components/CTASection';
import Button from '../components/Button';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';

const Services = () => {
  return (
    <div className="pt-20">
      {/* Header Banner */}
      <section className="hero-gradient py-16 md:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] rounded-full border border-[#DBEAFE]">
            Comprehensive Healthcare Treatments
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-[-0.03em] mt-4">
            Our Healthcare Services
          </h1>
          <p className="text-[#475569] text-base sm:text-lg max-w-2xl mx-auto mt-4 leading-relaxed font-normal">
            From routine oral screening to complex restorative surgery, we provide gentle, state-of-the-art care under one roof.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Service Highlights Breakdown */}
      <section className="py-20 md:py-24 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Treatment Standards"
            title="Why Patients Trust Our Dental Care"
            subtitle="Every procedure is performed using micro-precision equipment, pain-reduction techniques, and sterile protocols."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {servicesData.slice(0, 4).map((service, i) => {
              const IconComponent = Icons[service.icon] || Icons.Activity;
              return (
                <div key={i} className="peak-card p-8 sm:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 border border-[#DBEAFE]">
                        <IconComponent className="w-5.5 h-5.5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-[#0F172A] tracking-tight">{service.title}</h3>
                        <span className="text-xs text-[#2563EB] font-semibold">{service.priceRange}</span>
                      </div>
                    </div>

                    <p className="text-[#475569] text-sm leading-relaxed mb-6 font-normal">
                      {service.fullDesc}
                    </p>

                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-3">Key Highlights</h4>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2 text-xs font-medium text-[#0F172A]">
                          <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    to={`/appointment?service=${encodeURIComponent(service.title)}`}
                    variant="primary"
                    size="sm"
                    icon={ArrowRight}
                  >
                    Book {service.title}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default Services;

