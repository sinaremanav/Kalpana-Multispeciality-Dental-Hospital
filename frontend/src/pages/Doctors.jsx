import React, { useState, useEffect } from 'react';
import { doctorService } from '../services/doctorService';
import DoctorCard from '../components/DoctorCard';
import CTASection from '../components/CTASection';
import LoadingState from '../components/LoadingState';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import SEO from '../components/SEO';
import { getPhysicianSchema } from '../config/seoConfig';
import { Users } from 'lucide-react';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await doctorService.getDoctors(true);
      setDoctors(list);
    } catch (err) {
      console.error('Failed to load doctors:', err);
      setError(err.message || 'Unable to load doctors list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  return (
    <div className="pt-20">
      <SEO
        page="doctors"
        schema={getPhysicianSchema(doctors)}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Specialist Doctors", url: "/doctors" },
        ]}
      />

      {/* Page Header */}
      <section className="hero-gradient py-16 md:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#059669] bg-[#ECFDF5] rounded-full border border-[#D1FAE5]">
            Dental Specialists • Kopargaon
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-[-0.03em] mt-4">
            Meet Our Specialist Dental Surgeons
          </h1>
          <p className="text-[#475569] text-base sm:text-lg max-w-2xl mx-auto mt-4 leading-relaxed font-normal">
            Passionate healthcare professionals committed to delivering gentle, precise, and compassionate dental treatments.
          </p>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-20 md:py-24 bg-white min-h-[400px]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <LoadingState message="Loading doctors and specialists..." minHeight="min-h-[300px]" />
          ) : error ? (
            <ErrorState title="Unable to load doctors" message={error} onRetry={fetchDoctors} />
          ) : doctors.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No Doctors Listed"
              description="Doctor profiles will appear here once added."
            />
          ) : (
            <div className="space-y-10">
              {doctors.map((doctor, index) => (
                <DoctorCard key={doctor.id} doctor={doctor} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </div>
  );
};

export default Doctors;
