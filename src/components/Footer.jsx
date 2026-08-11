import React from 'react';
import { Link } from 'react-router-dom';
import { clinicConfig } from '../config/clinicConfig';
import {
  Stethoscope,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-md">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold text-white tracking-tight group-hover:text-sky-400 transition-colors block">
                  {clinicConfig.clinicName}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-400 block">
                  Advanced Dental Clinic
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed">
              {clinicConfig.subTagline}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={clinicConfig.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-lg bg-slate-800 text-slate-400 hover:bg-sky-500 hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.14H6.8v4.13h2.7v11.86h5v-11.86h3.5l.77-4.13z"/>
                </svg>
              </a>
              <a
                href={clinicConfig.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-lg bg-slate-800 text-slate-400 hover:bg-sky-500 hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href={clinicConfig.socials.youtube}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-lg bg-slate-800 text-slate-400 hover:bg-sky-500 hover:text-white flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>


          {/* Col 2: Quick Links */}
          <div>
            <h3 className="text-white text-base font-bold mb-4 tracking-wide uppercase text-xs text-sky-400">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { name: 'Home', path: '/' },
                { name: 'About Us', path: '/about' },
                { name: 'Meet Doctors', path: '/doctors' },
                { name: 'Services', path: '/services' },
                { name: 'Photo Gallery', path: '/gallery' },
                { name: 'Testimonials', path: '/testimonials' },
                { name: 'FAQs', path: '/faqs' },
                { name: 'Contact Us', path: '/contact' },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-slate-400 hover:text-sky-400 flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-sky-500" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Treatments / Services */}
          <div>
            <h3 className="text-white text-base font-bold mb-4 tracking-wide uppercase text-xs text-sky-400">
              Our Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              {[
                'General Dentistry',
                'Teeth Cleaning & Scaling',
                'Root Canal Treatment',
                'Dental Implants',
                'Cosmetic Dentistry',
                'Teeth Whitening',
                'Clear Aligners & Braces',
                'Pediatric Dentistry'
              ].map((service, idx) => (
                <li key={idx}>
                  <Link
                    to={`/appointment?service=${encodeURIComponent(service)}`}
                    className="text-slate-400 hover:text-sky-400 flex items-center gap-1.5 transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
                    <span>{service}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact Info & Working Hours */}
          <div className="space-y-4">
            <h3 className="text-white text-base font-bold mb-4 tracking-wide uppercase text-xs text-sky-400">
              Contact & Hours
            </h3>
            
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <span>{clinicConfig.address}</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-sky-400 shrink-0" />
                <a href={`tel:${clinicConfig.phone}`} className="hover:text-white transition-colors">
                  {clinicConfig.displayPhone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${clinicConfig.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp: +{clinicConfig.whatsappNumber}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-sky-400 shrink-0" />
                <a href={`mailto:${clinicConfig.email}`} className="hover:text-white transition-colors">
                  {clinicConfig.email}
                </a>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">{clinicConfig.workingHours.weekdays}</p>
                    <p className="text-slate-400 mt-0.5">{clinicConfig.workingHours.sunday}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {currentYear} {clinicConfig.clinicName}. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/faqs" className="hover:text-slate-300">Privacy Policy</Link>
            <Link to="/faqs" className="hover:text-slate-300">Terms of Service</Link>
            <Link to="/contact" className="hover:text-slate-300">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
