import React, { useState } from 'react';
import { clinicConfig } from '../config/clinicConfig';
import Button from '../components/Button';
import apiService from '../services/api';
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  ExternalLink,
  Send,
  CheckCircle2
} from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    let waUrl = '';
    try {
      const response = await apiService.sendContactMessage(formData);
      if (response && response.whatsappUrl) {
        waUrl = response.whatsappUrl;
      }
    } catch (err) {
      console.warn('Backend API contact submission fallback to WhatsApp URL');
    }

    if (!waUrl) {
      const text = `Hello Doctor,

I have a query from your website contact page.

Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}
Subject: ${formData.subject || 'General Inquiry'}
Message: ${formData.message}`;

      waUrl = `https://wa.me/${clinicConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;
    }

    window.open(waUrl, '_blank');
  };

  const whatsappUrl = `https://wa.me/${clinicConfig.whatsappNumber}`;

  return (
    <div className="pt-20">
      {/* Header Banner */}
      <section className="hero-gradient py-16 md:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] rounded-full border border-[#DBEAFE]">
            Contact & Support
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-[-0.03em] mt-4">
            Contact Kalpana Dental Clinic
          </h1>
          <p className="text-[#475569] text-base sm:text-lg max-w-2xl mx-auto mt-4 leading-relaxed font-normal">
            We are here to assist you with inquiries, appointment scheduling, and patient support.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact Information & Action Buttons */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[#0F172A] mb-6 tracking-tight">Clinic Information</h2>
                <div className="space-y-6">
                  
                  {/* Address */}
                  <a
                    href={clinicConfig.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3.5 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] group-hover:bg-[#2563EB] group-hover:text-white flex items-center justify-center shrink-0 border border-[#DBEAFE] transition-colors">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0F172A] group-hover:text-[#2563EB] text-sm transition-colors">Clinic Address</h4>
                      <p className="text-[#475569] text-xs sm:text-sm mt-0.5 leading-snug">{clinicConfig.address}</p>
                      <p className="text-xs text-[#2563EB] font-semibold mt-1">{clinicConfig.landmark}</p>
                    </div>
                  </a>

                  {/* Phone */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 border border-[#DBEAFE]">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0F172A] text-sm">Phone Number</h4>
                      <a href={`tel:${clinicConfig.phone}`} className="text-[#475569] hover:text-[#2563EB] text-xs sm:text-sm mt-0.5 block font-semibold transition-colors">
                        {clinicConfig.displayPhone}
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center shrink-0 border border-[#DCFCE7]">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0F172A] text-sm">WhatsApp Care Line</h4>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#16A34A] hover:underline text-xs sm:text-sm mt-0.5 block font-semibold"
                      >
                        +{clinicConfig.whatsappNumber}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 border border-[#DBEAFE]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0F172A] text-sm">Email Address</h4>
                      <a href={`mailto:${clinicConfig.email}`} className="text-[#475569] hover:text-[#2563EB] text-xs sm:text-sm mt-0.5 block transition-colors">
                        {clinicConfig.email}
                      </a>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-start gap-3.5 pt-4 border-t border-[#E2E8F0]">
                    <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 border border-[#DBEAFE]">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0F172A] text-sm">Working Hours</h4>
                      <p className="text-[#0F172A] text-xs sm:text-sm mt-0.5 font-semibold">{clinicConfig.workingHours.weekdays}</p>
                      <p className="text-[#64748B] text-xs mt-0.5">{clinicConfig.workingHours.sunday}</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2.5 pt-2">
                <Button
                  href={`tel:${clinicConfig.phone}`}
                  variant="primary"
                  size="md"
                  icon={Phone}
                >
                  Call Now
                </Button>

                <Button
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="whatsapp"
                  size="md"
                  icon={MessageCircle}
                >
                  WhatsApp
                </Button>

                <Button
                  href={clinicConfig.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  size="md"
                  icon={ExternalLink}
                >
                  Get Directions
                </Button>
              </div>
            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-7 peak-card p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-[#0F172A] mb-2 tracking-tight">Send Us a Message</h2>
              <p className="text-[#475569] text-sm mb-6 font-normal">
                Fill out the form below to send an instant inquiry to our medical reception desk.
              </p>

              {submitted ? (
                <div className="bg-[#F0FDF4] border border-[#DCFCE7] text-[#166534] p-6 rounded-xl text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-[#16A34A] mx-auto" />
                  <h3 className="text-base font-bold">Message Transmitted!</h3>
                  <p className="text-xs sm:text-sm">Thank you for reaching out. We have opened WhatsApp to transmit your message directly to our desk.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold text-[#16A34A] underline pt-2 cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0F172A] mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0F172A] mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#0F172A] mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#0F172A] mb-1">Subject</label>
                      <input
                        type="text"
                        placeholder="General Inquiry / Treatment Cost"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0F172A] mb-1">Your Message *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="How can we help you today?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    icon={Send}
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Google Map Section */}
      <section className="py-12 bg-[#F8FAFC] border-t border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[#0F172A] text-center mb-6 tracking-tight">Find Us on Google Maps</h2>
          <div className="rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-saas min-h-[400px]">
            <iframe
              title="Kalpana Dental Clinic Map Location"
              src={clinicConfig.googleMapsEmbed}
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

