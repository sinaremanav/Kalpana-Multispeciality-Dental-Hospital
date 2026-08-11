import React, { useState } from 'react';
import { clinicConfig } from '../config/clinicConfig';
import SectionTitle from '../components/SectionTitle';
import Button from '../components/Button';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // WhatsApp format redirect for quick response
    const text = `Hello Doctor,

I have a query from your website contact page.

Name: ${formData.name}
Phone: ${formData.phone}
Email: ${formData.email}
Subject: ${formData.subject || 'General Inquiry'}
Message: ${formData.message}`;

    const waUrl = `https://wa.me/${clinicConfig.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const whatsappUrl = `https://wa.me/${clinicConfig.whatsappNumber}`;

  return (
    <div className="pt-24 pb-16">
      {/* Header Banner */}
      <section className="bg-sky-50 py-16 border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-sky-800 bg-sky-100 rounded-full">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-800 mt-4">
            Contact Kalpana Dental Clinic
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto mt-4">
            We are here to answer your questions and assist you with your dental health needs.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact Information & Action Buttons */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Clinic Information</h2>
                <div className="space-y-6">
                  
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Clinic Address</h4>
                      <p className="text-slate-600 text-sm mt-1">{clinicConfig.address}</p>
                      <p className="text-xs text-sky-600 font-medium mt-0.5">{clinicConfig.landmark}</p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Phone Number</h4>
                      <a href={`tel:${clinicConfig.phone}`} className="text-slate-600 hover:text-sky-600 text-sm mt-1 block font-semibold">
                        {clinicConfig.displayPhone}
                      </a>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">WhatsApp Care Line</h4>
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:underline text-sm mt-1 block font-semibold"
                      >
                        +{clinicConfig.whatsappNumber}
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Email Address</h4>
                      <a href={`mailto:${clinicConfig.email}`} className="text-slate-600 hover:text-sky-600 text-sm mt-1 block">
                        {clinicConfig.email}
                      </a>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-start gap-4 pt-4 border-t border-slate-100">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Working Hours</h4>
                      <p className="text-slate-600 text-sm mt-1 font-semibold">{clinicConfig.workingHours.weekdays}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{clinicConfig.workingHours.sunday}</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
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

            {/* Quick Contact / Inquiry Form */}
            <div className="lg:col-span-7 bg-sky-50/50 p-8 sm:p-10 rounded-3xl border border-sky-100 shadow-soft">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Send Us a Message</h2>
              <p className="text-slate-600 text-sm mb-6">
                Fill out the form below to send an instant inquiry to our clinic desk.
              </p>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h3 className="text-lg font-bold">Message Sent!</h3>
                  <p className="text-sm">Thank you for reaching out. We have opened WhatsApp to transmit your message directly to our desk.</p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-bold text-emerald-700 underline pt-2"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                      <input
                        type="text"
                        placeholder="General Inquiry / Treatment Cost"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Message *</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="How can we help you today?"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
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
      <section className="py-12 bg-sky-50/50 border-t border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">Find Us on Map</h2>
          <div className="rounded-3xl overflow-hidden shadow-lg border-2 border-white min-h-[400px]">
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
