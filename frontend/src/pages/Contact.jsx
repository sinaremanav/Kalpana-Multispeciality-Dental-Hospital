import React, { useState, useEffect } from 'react';
import { clinicConfig as fallbackConfig } from '../config/clinicConfig';
import { clinicService } from '../services/clinicService';
import Button from '../components/Button';
import apiService from '../services/api';
import SEO from '../components/SEO';
import { getLocalBusinessSchema } from '../config/seoConfig';
import {
  MapPin,
  Phone,
  MessageCircle,
  Mail,
  Clock,
  ExternalLink,
  Send,
  CheckCircle2,
} from 'lucide-react';

const Contact = () => {
  const [clinic, setClinic] = useState(fallbackConfig);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [contactResult, setContactResult] = useState(null);

  useEffect(() => {
    clinicService.getClinicSettings().then((data) => {
      if (data) setClinic(data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      alert('Please fill in your name, phone number, and query message.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await apiService.sendContactMessage(formData);
      setContactResult(response);
      setSubmitted(true);
    } catch (err) {
      console.warn('API contact submission error:', err);
      alert('Unable to submit inquiry. Please call us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappUrl = `https://wa.me/${clinic.whatsappNumber || fallbackConfig.whatsappNumber}`;

  return (
    <div className="pt-20">
      <SEO
        page="contact"
        schema={getLocalBusinessSchema()}
        breadcrumbs={[
          { name: "Home", url: "/" },
          { name: "Contact Us", url: "/contact" },
        ]}
      />

      {/* Header Banner */}
      <section className="hero-gradient py-16 md:py-20 border-b border-[#E2E8F0]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#059669] bg-[#ECFDF5] rounded-full border border-[#D1FAE5]">
            Contact & Patient Support • Kopargaon Bet
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-[-0.03em] mt-4">
            Contact Kalpana Multispeciality Dental Hospital
          </h1>
          <p className="text-[#475569] text-base sm:text-lg max-w-2xl mx-auto mt-4 leading-relaxed font-normal">
            We are here to assist you with inquiries, appointment scheduling, treatment quotes, and emergency patient support.
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
                    href={clinic.googleMapsUrl || fallbackConfig.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3.5 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] group-hover:bg-[#059669] group-hover:text-white flex items-center justify-center shrink-0 border border-[#D1FAE5] transition-colors">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0F172A] group-hover:text-[#059669] text-sm transition-colors">Clinic Address</h4>
                      <p className="text-[#475569] text-xs sm:text-sm mt-0.5 leading-snug">{clinic.address || fallbackConfig.address}</p>
                      <p className="text-xs text-[#059669] font-semibold mt-1">{clinic.landmark || fallbackConfig.landmark}</p>
                    </div>
                  </a>

                  {/* Phone */}
                  <a
                    href={`tel:${clinic.phone || fallbackConfig.phone}`}
                    className="flex items-start gap-3.5 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] group-hover:bg-[#059669] group-hover:text-white flex items-center justify-center shrink-0 border border-[#D1FAE5] transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0F172A] group-hover:text-[#059669] text-sm transition-colors">Call Us Directly</h4>
                      <p className="text-[#475569] text-xs sm:text-sm mt-0.5">{clinic.displayPhone || fallbackConfig.displayPhone}</p>
                      <p className="text-xs text-[#64748B] mt-0.5">Mon to Sat: 9:00 AM to 8:00 PM</p>
                    </div>
                  </a>

                  {/* Email */}
                  <a
                    href={`mailto:${clinic.email || fallbackConfig.email}`}
                    className="flex items-start gap-3.5 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] group-hover:bg-[#059669] group-hover:text-white flex items-center justify-center shrink-0 border border-[#D1FAE5] transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0F172A] group-hover:text-[#059669] text-sm transition-colors">Email Inquiries</h4>
                      <p className="text-[#475569] text-xs sm:text-sm mt-0.5">{clinic.email || fallbackConfig.email}</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <Button
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="whatsapp"
                  size="md"
                  fullWidth
                  icon={MessageCircle}
                >
                  Chat with Doctor on WhatsApp
                </Button>

                <Button
                  href={`tel:${clinic.phone || fallbackConfig.phone}`}
                  variant="outline"
                  size="md"
                  fullWidth
                  icon={Phone}
                >
                  Call Clinic Directly
                </Button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="peak-card p-8 sm:p-10">
                {submitted ? (
                  <div className="text-center py-10 space-y-4">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#0F172A]">Message Recorded in System!</h3>
                    <p className="text-[#475569] text-sm max-w-md mx-auto leading-relaxed">
                      Thank you for contacting us. Your message has been saved into our clinic database and displayed on our administration dashboard. Our staff will respond to you promptly.
                    </p>
                    <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-xl text-xs text-[#166534] max-w-md mx-auto font-medium">
                      ✓ Inquiry saved directly. No WhatsApp message is required for this inquiry to reach clinic staff.
                    </div>
                    {contactResult?.whatsappUrl && (
                      <div className="pt-2">
                        <Button
                          href={contactResult.whatsappUrl}
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
                    <div className="pt-2">
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
                        }}
                        className="text-xs font-bold text-[#059669] hover:underline cursor-pointer"
                      >
                        Send Another Query
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h3 className="text-xl font-bold text-[#0F172A] tracking-tight mb-2">
                      Send Us a Message
                    </h3>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rameshwar Shinde"
                        className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="e.g. 7447226136"
                          className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
                          Email (Optional)
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="you@example.com"
                          className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
                        Subject
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Treatment Inquiry / Appointment Reschedule"
                        className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0F172A] mb-1.5">
                        Your Query Message *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="How can we help you? Describe your questions or symptoms..."
                        className="w-full px-3.5 py-2.5 text-sm border border-[#CBD5E1] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      fullWidth
                      icon={Send}
                      disabled={submitting}
                    >
                      {submitting ? 'Sending Message...' : 'Send Inquiry Message'}
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

export default Contact;
