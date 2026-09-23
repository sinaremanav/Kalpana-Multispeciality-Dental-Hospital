import React, { useState, useEffect } from 'react';
import { serviceService } from '../services/serviceService';
import ServiceCard from '../components/ServiceCard';
import SectionTitle from '../components/SectionTitle';
import CTASection from '../components/CTASection';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { CheckCircle2, ArrowRight, Briefcase } from 'lucide-react';
import * as Icons from 'lucide-react';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await serviceService.getServices(true);
      setServices(list);
    } catch (err) {
      console.error('Failed to load services:', err);
      setError(err.message || 'Unable to load services');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="pt-20">
      <SEO
        page="services"
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Dental Services", url: "/services" },
        ]}
      />

      {/* Header Banner */}
      <section className="hero-gradient py-16 md:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#059669] bg-[#ECFDF5] rounded-full border border-[#D1FAE5]">
            Comprehensive Dental Treatments • Kopargaon
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-[-0.03em] mt-4">
            Dental Services & Treatments
          </h1>
          <p className="text-[#475569] text-base sm:text-lg max-w-2xl mx-auto mt-4 leading-relaxed font-normal">
            From routine oral screening to complex restorative surgery, we provide gentle, state-of-the-art care under one roof.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 md:py-24 bg-white min-h-[400px]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <LoadingState message="Loading dental treatments & services..." minHeight="min-h-[300px]" />
          ) : error ? (
            <ErrorState title="Unable to load services" message={error} onRetry={fetchServices} />
          ) : services.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No Services Found"
              description="Services catalog is currently empty."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ServiceCard key={service.id} service={service} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detailed Highlights */}
      {services.length > 0 && (
        <section className="py-20 md:py-24 bg-[#F8FAFC] border-t border-[#E2E8F0]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle
              badge="Treatment Standards"
              title="Why Patients Trust Our Dental Care"
              subtitle="Every procedure is performed using micro-precision equipment, pain-reduction techniques, and sterile protocols."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {services.slice(0, 4).map((service, i) => {
                const IconComponent = Icons[service.icon] || Icons.Activity;
                return (
                  <div key={i} className="peak-card p-8 sm:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0 border border-[#D1FAE5]">
                          <IconComponent className="w-5.5 h-5.5" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-[#0F172A] tracking-tight">{service.title}</h3>
                          <span className="text-xs text-[#059669] font-semibold">{service.priceRange}</span>
                        </div>
                      </div>

                      <p className="text-[#475569] text-sm leading-relaxed mb-6 font-normal">
                        {service.description || service.fullDesc}
                      </p>

                      {service.features && service.features.length > 0 && (
                        <>
                          <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] mb-3">Key Highlights</h4>
                          <ul className="space-y-2 mb-6">
                            {service.features.map((feat, fIdx) => (
                              <li key={fIdx} className="flex items-center gap-2 text-xs font-medium text-[#0F172A]">
                                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                                <span>{feat}</span>
                              </li>
                            ))}
                          </ul>
                        </>
                      )}
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
      )}

      <CTASection />
    </div>
  );
};

export default Services;
