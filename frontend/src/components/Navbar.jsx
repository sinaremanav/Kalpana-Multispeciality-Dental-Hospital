import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { clinicConfig as fallbackConfig } from '../config/clinicConfig';
import { clinicService } from '../services/clinicService';
import { Menu, X, Calendar, Stethoscope, PhoneCall, ArrowRight, Sparkles, Sun, Moon, Lock, ShieldCheck } from 'lucide-react';
import Button from './Button';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../admin/context/AuthContext';

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
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs py-3.5 border-b border-[#E2E8F0] dark:border-slate-800'
          : 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xs py-4 border-b border-[#E2E8F0]/80 dark:border-slate-800/80'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11">
          {/* Logo & Clinic Name */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-[#059669] text-white flex items-center justify-center shadow-xs group-hover:bg-[#047857] dark-glow-shadow transition-colors">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-[#0F172A] dark:text-white group-hover:text-[#059669] dark:group-hover:text-emerald-400 transition-colors block leading-snug">
                {clinic.clinicName || fallbackConfig.clinicName}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] dark:text-slate-400 block">
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
                      ? 'text-[#059669] dark:text-emerald-400 bg-[#ECFDF5] dark:bg-slate-800 font-semibold'
                      : 'text-[#475569] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-slate-800'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-[#475569] hover:bg-[#F8FAFC] dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
            <a
              href={`tel:${clinic.phone || fallbackConfig.phone}`}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#475569] dark:text-slate-300 hover:text-[#059669] dark:hover:text-emerald-400 px-2.5 py-1.5 rounded-md hover:bg-[#F8FAFC] dark:hover:bg-slate-800 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#059669] dark:text-emerald-400" />
              <span>{clinic.displayPhone || fallbackConfig.displayPhone}</span>
            </a>

            {/* Admin Portal / Login Button */}
            {user ? (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#059669] dark:text-emerald-400 bg-[#ECFDF5] dark:bg-slate-800 border border-[#A7F3D0] dark:border-emerald-800 px-2.5 py-1.5 rounded-lg hover:bg-[#D1FAE5] dark:hover:bg-slate-700 transition-colors shadow-xs"
                title="Go to Admin Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#475569] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 transition-colors"
                title="Admin & Staff Login"
              >
                <Lock className="w-3.5 h-3.5 text-[#64748B] dark:text-slate-400" />
                <span>Admin Login</span>
              </Link>
            )}

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
            <button
              onClick={toggleTheme}
              className="p-2 text-[#475569] dark:text-slate-300 rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <Link
              to="/appointment"
              className="p-2 text-[#059669] dark:text-emerald-400 bg-[#ECFDF5] dark:bg-slate-800 rounded-lg hover:bg-[#D1FAE5] dark:hover:bg-slate-700 transition-colors"
              aria-label="Book Appointment"
            >
              <Calendar className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-[#0F172A] dark:text-white hover:bg-[#F8FAFC] dark:hover:bg-slate-800 focus:outline-none transition-colors border border-[#E2E8F0] dark:border-slate-700"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Out Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 pb-6 border-t border-[#E2E8F0] dark:border-slate-800 animate-fade-in bg-white dark:bg-slate-900 rounded-b-2xl shadow-xl px-2">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-[#059669] dark:text-emerald-400 bg-[#ECFDF5] dark:bg-slate-800 font-semibold'
                        : 'text-[#475569] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F8FAFC] dark:hover:bg-slate-800'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              <div className="pt-4 border-t border-[#E2E8F0] dark:border-slate-800 flex flex-col gap-2.5">
                <a
                  href={`tel:${clinic.phone || fallbackConfig.phone}`}
                  className="flex items-center justify-center gap-2 text-xs font-semibold text-[#0F172A] dark:text-slate-200 bg-[#F8FAFC] dark:bg-slate-800 py-2.5 rounded-lg border border-[#E2E8F0] dark:border-slate-700"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-[#059669] dark:text-emerald-400" />
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

                {/* Mobile Admin Portal Link */}
                <div className="pt-2 border-t border-[#E2E8F0] dark:border-slate-800">
                  {user ? (
                    <Link
                      to="/admin"
                      className="flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-[#059669] dark:text-emerald-400 bg-[#ECFDF5] dark:bg-slate-800 rounded-lg border border-[#A7F3D0] dark:border-emerald-800 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <Link
                      to="/admin/login"
                      className="flex items-center justify-between px-3.5 py-2.5 text-xs font-medium text-[#475569] dark:text-slate-300 hover:bg-[#F8FAFC] dark:hover:bg-slate-800 rounded-lg border border-[#E2E8F0] dark:border-slate-700 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-[#64748B] dark:text-slate-400" />
                        <span>Admin & Staff Login</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
