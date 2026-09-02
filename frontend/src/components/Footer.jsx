import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clinicConfig as fallbackConfig } from '../config/clinicConfig';
import { clinicService } from '../services/clinicService';
import {
  Stethoscope,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Lock,
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [clinic, setClinic] = useState(fallbackConfig);

  useEffect(() => {
    clinicService.getClinicSettings().then((data) => {
      if (data) setClinic(data);
    });
  }, []);

  return (
    <footer className="bg-[#0F172A] text-slate-300 pt-16 pb-8 border-t border-[#1E293B]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#1E293B]">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-xl bg-[#059669] text-white flex items-center justify-center shadow-xs">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-white tracking-tight group-hover:text-[#6EE7B7] transition-colors block leading-tight">
                  {clinic.clinicName || fallbackConfig.clinicName}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6EE7B7] block">
                  Advanced Dental Care • Kopargaon
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
              {clinic.subTagline || fallbackConfig.subTagline}
            </p>

            <div className="flex items-center gap-2.5 pt-2">
              {clinic.socials?.facebook && (
                <a
                  href={clinic.socials.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-lg bg-[#1E293B] text-slate-400 hover:bg-[#059669] hover:text-white flex items-center justify-center transition-colors border border-[#334155]"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.14H6.8v4.13h2.7v11.86h5v-11.86h3.5l.77-4.13z" />
                  </svg>
                </a>
              )}
              {clinic.socials?.instagram && (
                <a
                  href={clinic.socials.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-lg bg-[#1E293B] text-slate-400 hover:bg-[#059669] hover:text-white flex items-center justify-center transition-colors border border-[#334155]"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-wider text-[#6EE7B7]">
              Hospital Links
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Doctors', path: '/doctors' },
                { name: 'Services', path: '/services' },
                { name: 'Events & Camps', path: '/events' },
                { name: 'Gallery', path: '/gallery' },
                { name: 'Testimonials', path: '/testimonials' },
                { name: 'FAQs', path: '/faqs' },
                { name: 'Contact', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 text-[#059669]" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Operating Hours */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-wider text-[#6EE7B7]">
              Working Hours
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2 text-slate-400">
                <Clock className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Mon – Sat:</strong>
                  <span>{clinic.workingHours?.weekdays || fallbackConfig.workingHours.weekdays}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-slate-400">
                <Clock className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Sunday:</strong>
                  <span>{clinic.workingHours?.sunday || fallbackConfig.workingHours.sunday}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Emergency */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-wider text-[#6EE7B7]">
              Contact & Emergency
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-slate-400">
              <a
                href={clinic.googleMapsUrl || fallbackConfig.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 hover:text-white transition-colors group"
              >
                <MapPin className="w-4 h-4 text-[#059669] shrink-0 mt-0.5 group-hover:text-[#6EE7B7]" />
                <span>{clinic.address || fallbackConfig.address}</span>
              </a>

              <a
                href={`tel:${clinic.phone || fallbackConfig.phone}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-[#059669] shrink-0" />
                <span>{clinic.displayPhone || fallbackConfig.displayPhone}</span>
              </a>

              <a
                href={`mailto:${clinic.email || fallbackConfig.email}`}
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-[#059669] shrink-0" />
                <span>{clinic.email || fallbackConfig.email}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {currentYear} {clinic.clinicName || fallbackConfig.clinicName}. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Staff Login</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
