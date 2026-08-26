import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { clinicConfig } from '../config/clinicConfig';
import { servicesData } from '../data/services';
import { doctorsData } from '../data/doctors';
import Button from '../components/Button';
import apiService from '../services/api';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MessageCircle,
  CheckCircle2,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

const Appointment = () => {
  const [searchParams] = useSearchParams();
  const prefilledService = searchParams.get('service') || '';
  const prefilledDoctor = searchParams.get('doctor') || '';

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    date: '',
    time: '10:00 AM',
    treatment: prefilledService || servicesData[0].title,
    doctor: prefilledDoctor || doctorsData[0].name,
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (prefilledService) {
      setFormData(prev => ({ ...prev, treatment: prefilledService }));
    }
    if (prefilledDoctor) {
      setFormData(prev => ({ ...prev, doctor: prefilledDoctor }));
    }
  }, [prefilledService, prefilledDoctor]);

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required';
    if (!formData.phone.trim()) {
      errs.phone = 'Phone Number is required';
    } else if (!/^[0-9+\-\s]{8,15}$/.test(formData.phone.trim())) {
      errs.phone = 'Please enter a valid phone number';
    }
    if (!formData.date) errs.date = 'Preferred Date is required';
    if (!formData.treatment) errs.treatment = 'Treatment is required';
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
    setSubmitted(true);

    let whatsappUrl = '';
    try {
      const response = await apiService.createAppointment(formData);
      if (response && response.whatsappUrl) {
        whatsappUrl = response.whatsappUrl;
      }
    } catch (err) {
      console.warn('Backend API submission fallback to direct WhatsApp URL generation');
    }

    if (!whatsappUrl) {
      const messageText = `Hello Doctor,

I would like to book an appointment.

Name: ${formData.fullName}
Phone: ${formData.phone}
Email: ${formData.email || 'N/A'}
Preferred Date: ${formData.date}
Preferred Time: ${formData.time}
Treatment: ${formData.treatment}
Preferred Doctor: ${formData.doctor}

Additional Message:
${formData.message || 'None'}

Thank you.`;
      whatsappUrl = `https://wa.me/${clinicConfig.whatsappNumber}?text=${encodeURIComponent(messageText)}`;
    }

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="pt-20">
      {/* Header Banner */}
      <section className="hero-gradient py-16 md:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] rounded-full border border-[#DBEAFE]">
            Online Appointment Booking
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-[-0.03em] mt-4">
            Book Your Hospital Visit
          </h1>
          <p className="text-[#475569] text-base sm:text-lg max-w-2xl mx-auto mt-4 leading-relaxed font-normal">
            Schedule your appointment in under 60 seconds. Receive instant WhatsApp confirmation directly from our medical desk.
          </p>
        </div>
      </section>

      {/* Main Booking Section */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Info Panel */}
            <div className="lg:col-span-5 space-y-8">
              <div className="peak-card p-8 sm:p-10">
                <h3 className="text-2xl font-bold text-[#0F172A] mb-4 tracking-tight">Why Book With Us?</h3>
                <ul className="space-y-4">
                  {[
                    { title: "Zero Wait Time", desc: "Prioritized scheduling ensures minimal wait times at the clinic." },
                    { title: "Instant Confirmation", desc: "Get direct WhatsApp confirmation from our medical reception team." },
                    { title: "Painless Protocol", desc: "Gentle diagnostic screening and stress-free care." },
                    { title: "Sterilized Environment", desc: "Class-B autoclave sterilized instruments for total safety." }
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-[#0F172A] text-sm">{item.title}</h4>
                        <p className="text-xs text-[#64748B] mt-0.5">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Direct Call / Emergency Box */}
              <div className="bg-[#0F172A] text-white p-7 rounded-[16px] border border-[#1E293B] shadow-saas space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2563EB] flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">Need Immediate Assistance?</h4>
                    <p className="text-xs text-slate-400">Emergency Dental Helpline</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Call our clinic desk directly to book instant same-day emergency appointments.
                </p>

                <a
                  href={`tel:${clinicConfig.phone}`}
                  className="inline-flex items-center justify-center w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold rounded-lg transition-colors text-sm"
                >
                  Call {clinicConfig.displayPhone}
                </a>
              </div>
            </div>

            {/* Right Booking Form */}
            <div className="lg:col-span-7 peak-card p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-[#0F172A] mb-2 tracking-tight">Appointment Details</h2>
              <p className="text-[#475569] text-sm mb-6 font-normal">
                Please fill in your information below. Submitting will pre-fill a formatted WhatsApp booking request.
              </p>

              {submitted && (
                <div className="mb-6 p-4 bg-[#F0FDF4] border border-[#DCFCE7] rounded-xl text-[#166534] flex items-center gap-3 text-xs sm:text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
                  <span>Opening WhatsApp with your pre-filled appointment request...</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] rounded-lg border text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${
                          errors.fullName ? 'border-red-400' : 'border-[#E2E8F0]'
                        }`}
                      />
                    </div>
                    {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] rounded-lg border text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${
                          errors.phone ? 'border-red-400' : 'border-[#E2E8F0]'
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Email & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                      Preferred Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className={`w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] rounded-lg border text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB] ${
                          errors.date ? 'border-red-400' : 'border-[#E2E8F0]'
                        }`}
                      />
                    </div>
                    {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
                  </div>
                </div>

                {/* Preferred Time & Treatment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                      Preferred Time Slot
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      >
                        <option value="09:30 AM">09:30 AM - Morning Slot</option>
                        <option value="11:00 AM">11:00 AM - Morning Slot</option>
                        <option value="02:00 PM">02:00 PM - Afternoon Slot</option>
                        <option value="04:30 PM">04:30 PM - Evening Slot</option>
                        <option value="06:30 PM">06:30 PM - Evening Slot</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                      Treatment / Service <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.treatment}
                      onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-medium"
                    >
                      {servicesData.map((svc) => (
                        <option key={svc.id} value={svc.title}>
                          {svc.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Preferred Doctor */}
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                    Preferred Doctor
                  </label>
                  <select
                    value={formData.doctor}
                    onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB] font-medium"
                  >
                    {doctorsData.map((doc) => (
                      <option key={doc.id} value={doc.name}>
                        {doc.name} ({doc.qualification})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                    Additional Message / Symptoms (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe any tooth pain, past treatment history, or specific preferences..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                  />
                </div>

                {/* Submit CTA */}
                <Button
                  type="submit"
                  variant="whatsapp"
                  size="lg"
                  fullWidth
                  icon={MessageCircle}
                >
                  Book Appointment via WhatsApp
                </Button>

                <p className="text-center text-xs text-[#64748B]">
                  🔒 Your information is safe. Submitting opens WhatsApp with your pre-filled details.
                </p>
              </form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Appointment;

