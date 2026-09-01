import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { clinicConfig as fallbackConfig } from '../config/clinicConfig';
import { clinicService } from '../services/clinicService';
import { Menu, X, Calendar, Stethoscope, PhoneCall, ArrowRight, Sparkles } from 'lucide-react';
import Button from './Button';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Doctors', path: '/doctors' },
  { name: 'Services', path: '/services' },
  { name: 'Events & Camps', path: '/events' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Testimonials', path: '/testimonials' },
  { name: 'FAQs', path: '/faqs' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [clinic, setClinic] = useState(fallbackConfig);
  const location = useLocation();

  useEffect(() => {
    clinicService.getClinicSettings().then((data) => {
      if (data) setClinic(data);
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs py-3.5 border-b border-[#E2E8F0]'
          : 'bg-white/90 backdrop-blur-xs py-4 border-b border-[#E2E8F0]/80'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11">
          {/* Logo & Clinic Name */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shadow-xs group-hover:bg-[#1D4ED8] transition-colors">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-[#0F172A] group-hover:text-[#2563EB] transition-colors block leading-snug">
                {clinic.clinicName || fallbackConfig.clinicName}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] block">
                Multispeciality Care • Kopargaon
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-2.5 py-1.5 text-xs xl:text-sm font-medium rounded-md transition-all duration-150 ${
                    isActive
                      ? 'text-[#2563EB] bg-[#EFF6FF] font-semibold'
                      : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <a
              href={`tel:${clinic.phone || fallbackConfig.phone}`}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#475569] hover:text-[#2563EB] px-2.5 py-1.5 rounded-md hover:bg-[#F8FAFC] transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>{clinic.displayPhone || fallbackConfig.displayPhone}</span>
            </a>

            <Button
              to="/appointment"
              variant="primary"
              size="sm"
              icon={ArrowRight}
            >
              Book Appointment
            </Button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/appointment"
              className="p-2 text-[#2563EB] bg-[#EFF6FF] rounded-lg hover:bg-[#DBEAFE] transition-colors"
              aria-label="Book Appointment"
            >
              <Calendar className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-[#0F172A] hover:bg-[#F8FAFC] focus:outline-none transition-colors border border-[#E2E8F0]"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Out Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 pb-6 border-t border-[#E2E8F0] animate-fade-in bg-white rounded-b-2xl shadow-xl px-2">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-[#2563EB] bg-[#EFF6FF] font-semibold'
                        : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              <div className="pt-4 border-t border-[#E2E8F0] flex flex-col gap-2.5">
                <a
                  href={`tel:${clinic.phone || fallbackConfig.phone}`}
                  className="flex items-center justify-center gap-2 text-xs font-semibold text-[#0F172A] bg-[#F8FAFC] py-2.5 rounded-lg border border-[#E2E8F0]"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Call Us: {clinic.displayPhone || fallbackConfig.displayPhone}</span>
                </a>

                <Button
                  to="/appointment"
                  variant="primary"
                  size="md"
                  fullWidth
                  icon={ArrowRight}
                >
                  Book Appointment
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
