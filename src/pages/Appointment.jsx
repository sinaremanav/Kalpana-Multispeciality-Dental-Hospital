import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { clinicConfig } from '../config/clinicConfig';
import { servicesData } from '../data/services';
import { doctorsData } from '../data/doctors';
import Button from '../components/Button';
import SectionTitle from '../components/SectionTitle';
import {
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  MessageCircle,
  CheckCircle2,
  ShieldCheck,
  Award
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setSubmitted(true);

    // Format WhatsApp message strictly as requested in Section 12
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

    const whatsappUrl = `https://wa.me/${clinicConfig.whatsappNumber}?text=${encodeURIComponent(messageText)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="pt-24 pb-16">
      {/* Header Banner */}
      <section className="bg-sky-50 py-16 border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-800 bg-sky-100 rounded-full">
            Online Booking
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mt-4">
            Book a Dental Appointment
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto mt-4">
            Schedule your visit in under 60 seconds. Our desk will confirm your appointment instantly via WhatsApp.
          </p>
        </div>
      </section>

      {/* Main Booking Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Info Panel */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-sky-50/70 p-8 rounded-3xl border border-sky-100 shadow-soft">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Why Book With Us?</h3>
                <ul className="space-y-4">
                  {[
                    { title: "Zero Wait Time", desc: "Prioritized scheduling ensures minimal wait times at the clinic." },
                    { title: "Instant Confirmation", desc: "Get direct WhatsApp confirmation from our medical reception team." },
                    { title: "Painless Protocol", desc: "Gentle diagnostic screening and stress-free care." },
                    { title: "Sterilized Environment", desc: "Class-B autoclave sterilized instruments for total safety." }
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                        <p className="text-xs text-slate-600 mt-0.5">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Direct Call / Emergency Box */}
              <div className="bg-slate-900 text-white p-7 rounded-3xl shadow-xl space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">Need Immediate Assistance?</h4>
                    <p className="text-xs text-slate-400">Emergency Dental Helpline</p>
                  </div>
                </div>

                <p className="text-sm text-slate-300">
                  Call our desk directly to book instant same-day emergency appointments.
                </p>

                <a
                  href={`tel:${clinicConfig.phone}`}
                  className="inline-flex items-center justify-center w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl transition-colors text-sm"
                >
                  Call {clinicConfig.displayPhone}
                </a>
              </div>
            </div>

            {/* Right Booking Form */}
            <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-sky-100 shadow-soft">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Appointment Details</h2>
              <p className="text-slate-600 text-sm mb-6">
                Please fill in your details below. Submitting will pre-fill a formatted WhatsApp booking message.
              </p>

              {submitted && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 flex items-center gap-3 text-sm">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                  <span>Opening WhatsApp with your pre-filled appointment request...</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                          errors.fullName ? 'border-red-400' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                          errors.phone ? 'border-red-400' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Email & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50/50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Preferred Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 ${
                          errors.date ? 'border-red-400' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
                  </div>
                </div>

                {/* Preferred Time & Treatment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Preferred Time Slot
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <select
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50/50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
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
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Treatment / Service <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.treatment}
                      onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50/50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-800"
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
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Preferred Doctor
                  </label>
                  <select
                    value={formData.doctor}
                    onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50/50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-800"
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
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Additional Message / Symptoms (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe any tooth pain, past treatment history, or specific preferences..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50/50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
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

                <p className="text-center text-xs text-slate-400">
                  🔒 Your data is safe. Clicking above opens WhatsApp with your pre-filled details.
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
