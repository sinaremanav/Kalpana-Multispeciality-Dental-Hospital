import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { clinicConfig } from '../config/clinicConfig';
import { serviceService } from '../services/serviceService';
import { doctorService } from '../services/doctorService';
import apiService from '../services/api';
import Button from '../components/Button';
import LoadingState from '../components/LoadingState';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MessageCircle,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const Appointment = () => {
  const [searchParams] = useSearchParams();
  const prefilledService = searchParams.get('service') || '';
  const prefilledDoctor = searchParams.get('doctor') || '';

  const [services, setServices] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    date: '',
    time: '10:00 AM',
    treatment: '',
    doctor: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [servList, docList] = await Promise.all([
          serviceService.getServices(true),
          doctorService.getDoctors(true),
        ]);
        setServices(servList);
        setDoctors(docList);

        setFormData((prev) => ({
          ...prev,
          treatment: prefilledService || (servList[0] ? servList[0].title : 'Root Canal Treatment (RCT)'),
          doctor: prefilledDoctor || (docList[0] ? docList[0].name : clinicConfig.doctorName),
        }));
      } catch (err) {
        console.warn('Error loading appointment dropdowns:', err);
      } finally {
        setLoadingData(false);
      }
    };

    loadDropdownData();
  }, [prefilledService, prefilledDoctor]);

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Patient full name is required';
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s]{8,15}$/.test(formData.phone.trim())) {
      errs.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!formData.date) errs.date = 'Please select your preferred consultation date';
    if (!formData.treatment) errs.treatment = 'Please select a dental service';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const selectedServObj = services.find((s) => s.title === formData.treatment);
      const selectedDocObj = doctors.find((d) => d.name === formData.doctor);

      const response = await apiService.createAppointment({
        ...formData,
        service_id: selectedServObj?.id || null,
        doctor_id: selectedDocObj?.id || null,
      });

      setBookingResult(response);
      setSubmitted(true);
    } catch (err) {
      console.error('Appointment booking error:', err);
      alert('Unable to complete appointment booking. Please contact the clinic directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="pt-20">
      {/* Header Banner */}
      <section className="hero-gradient py-16 md:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#059669] bg-[#ECFDF5] rounded-full border border-[#D1FAE5]">
            Direct Online Scheduling
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-[-0.03em] mt-4">
            Book Your Dental Appointment
          </h1>
          <p className="text-[#475569] text-base sm:text-lg max-w-2xl mx-auto mt-4 leading-relaxed font-normal">
            Schedule a hassle-free clinical consultation with Dr. Nikhil Mahanubhav and our specialist dental surgeons.
          </p>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[#0F172A] mb-3 tracking-tight">
                  Seamless Clinical Scheduling
                </h2>
                <p className="text-[#475569] text-sm sm:text-base leading-relaxed font-normal">
                  Fill in your convenient date and preferred treatment. We will reserve your operatory slot and confirm your appointment via WhatsApp/Call.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: 'Micro-Sterilized Environment',
                    desc: 'Class-B hospital autoclave sterilization for zero cross-infection risk.',
                  },
                  {
                    title: 'Minimal Waiting Times',
                    desc: 'Pre-allocated dedicated operatories for scheduled patients.',
                  },
                  {
                    title: 'Transparent Pricing & Diagnosis',
                    desc: 'Digital RVG sensor screening and honest treatment cost estimates.',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3.5 p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                    <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#059669] flex items-center justify-center shrink-0 border border-[#D1FAE5]">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#0F172A]">{item.title}</h4>
                      <p className="text-xs text-[#64748B] mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-[#ECFDF5] border border-[#D1FAE5] rounded-2xl">
                <span className="text-xs font-bold text-[#059669] uppercase tracking-wider block mb-1">
                  Immediate Dental Emergency?
                </span>
                <p className="text-xs text-[#1E3A8A] leading-relaxed mb-4">
                  For acute toothaches, fractured teeth, or trauma, call our urgent assistance desk directly:
                </p>
                <a
                  href={`tel:${clinicConfig.phone}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#059669] hover:underline"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call {clinicConfig.displayPhone}</span>
                </a>
              </div>
            </div>

            {/* Right Booking Form Column */}
            <div className="lg:col-span-7">
              <div className="peak-card p-8 sm:p-10">
                {submitted ? (
                  <div className="text-center py-10 space-y-5 animate-fade-in">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>

                    <h3 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                      Appointment Saved in Clinic System!
                    </h3>

                    <p className="text-[#475569] text-sm max-w-md mx-auto leading-relaxed">
                      Thank you <strong className="text-[#0F172A]">{formData.fullName}</strong>. Your appointment for{' '}
                      <strong className="text-[#059669]">{formData.treatment}</strong> on{' '}
                      <strong className="text-[#0F172A]">{formData.date} ({formData.time})</strong> has been registered directly into our clinic database and displayed on the doctor's dashboard.
                    </p>

                    <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-xs text-[#166534] max-w-md mx-auto font-medium">
                      ✓ Your slot is recorded. You do not need to send a WhatsApp message for this booking to appear in the clinic system.
                    </div>

                    {bookingResult?.whatsappUrl && (
                      <div className="pt-2">
                        <Button
                          href={bookingResult.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="whatsapp"
                          size="md"
                          icon={MessageCircle}
                        >
                          Chat on WhatsApp (Optional)
                        </Button>
                      </div>
                    )}

                    <div className="pt-4">
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setFormData((prev) => ({ ...prev, fullName: '', phone: '', message: '' }));
                        }}
                        className="text-xs font-bold text-[#059669] hover:underline cursor-pointer"
                      >
                        Book Another Appointment
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="text-xl font-bold text-[#0F172A] tracking-tight mb-2">
                      Patient Details & Preferred Slot
                    </h3>

                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
                        Patient Full Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={formData.fullName}
                          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                          placeholder="e.g. Rameshwar Shinde"
                          className="w-full pl-10 pr-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
                        />
                      </div>
                      {errors.fullName && <span className="text-xs text-rose-600 mt-1 block">{errors.fullName}</span>}
                    </div>

                    {/* Phone & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
                          Phone Number *
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                            <Phone className="w-4 h-4" />
                          </div>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="e.g. 7447226136"
                            className="w-full pl-10 pr-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
                          />
                        </div>
                        {errors.phone && <span className="text-xs text-rose-600 mt-1 block">{errors.phone}</span>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
                          Email (Optional)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="patient@example.com"
                            className="w-full pl-10 pr-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Treatment & Doctor */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
                          Service / Treatment *
                        </label>
                        <select
                          value={formData.treatment}
                          onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-sm text-[#0F172A] border border-[#CBD5E1] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
                        >
                          {services.map((s) => (
                            <option key={s.id} value={s.title}>
                              {s.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
                          Preferred Doctor
                        </label>
                        <select
                          value={formData.doctor}
                          onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-sm text-[#0F172A] border border-[#CBD5E1] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
                        >
                          {doctors.map((d) => (
                            <option key={d.id} value={d.name}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
                          Preferred Date *
                        </label>
                        <div className="relative">
                          <input
                            type="date"
                            required
                            min={todayStr}
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
                          />
                        </div>
                        {errors.date && <span className="text-xs text-rose-600 mt-1 block">{errors.date}</span>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
                          Preferred Time Slot
                        </label>
                        <select
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-sm text-[#0F172A] border border-[#CBD5E1] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#059669]"
                        >
                          <option value="09:30 AM">09:30 AM (Morning)</option>
                          <option value="11:00 AM">11:00 AM (Morning)</option>
                          <option value="01:00 PM">01:00 PM (Afternoon)</option>
                          <option value="04:30 PM">04:30 PM (Evening)</option>
                          <option value="06:30 PM">06:30 PM (Evening)</option>
                          <option value="07:30 PM">07:30 PM (Night)</option>
                        </select>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
                        Dental Symptoms / Special Request (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Briefly describe any toothache, sensitivity, bleeding gums, or questions..."
                        className="w-full px-3.5 py-2.5 text-sm text-[#0F172A] placeholder:text-[#94A3B8] border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      icon={ArrowRight}
                      disabled={submitting}
                    >
                      {submitting ? 'Confirming Appointment...' : 'Submit Appointment Request'}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Appointment;
