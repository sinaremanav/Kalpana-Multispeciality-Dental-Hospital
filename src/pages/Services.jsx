import React from 'react';
import { motion } from 'framer-motion';
import { servicesData } from '../data/services';
import ServiceCard from '../components/ServiceCard';
import SectionTitle from '../components/SectionTitle';
import CTASection from '../components/CTASection';
import Button from '../components/Button';
import { CheckCircle2, Calendar } from 'lucide-react';
import * as Icons from 'lucide-react';

const Services = () => {
  return (
    <div className="pt-24 pb-16">
      {/* Header Banner */}
      <section className="bg-sky-50 py-16 border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-800 bg-sky-100 rounded-full">
            Comprehensive Treatments
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mt-4">
            Our Dental Services
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto mt-4">
            From preventive checkups to complex cosmetic smile redesigns, we provide comprehensive care under one roof.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesData.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Service Highlights Breakdown */}
      <section className="py-20 bg-sky-50/50 border-t border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            badge="Treatment Standards"
            title="Why Patients Trust Our Dental Care"
            subtitle="Every procedure is performed using micro-precision equipment, pain-reduction techniques, and sterile protocols."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            {servicesData.slice(0, 4).map((service, i) => {
              const IconComponent = Icons[service.icon] || Icons.Activity;
              return (
                <div key={i} className="bg-white p-8 rounded-3xl border border-sky-100 shadow-soft flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">{service.title}</h3>
                        <span className="text-xs text-sky-600 font-semibold">{service.priceRange}</span>
                      </div>
                    </div>

                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {service.fullDesc}
                    </p>

                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Key Highlights</h4>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    to={`/appointment?service=${encodeURIComponent(service.title)}`}
                    variant="primary"
                    size="sm"
                    icon={Calendar}
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
