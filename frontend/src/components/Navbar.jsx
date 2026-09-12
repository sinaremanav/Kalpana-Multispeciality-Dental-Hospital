import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { clinicConfig as fallbackConfig } from '../config/clinicConfig';
import { clinicService } from '../services/clinicService';
import { Menu, X, Calendar, ChevronDown, ArrowRight, Lock, ShieldCheck } from 'lucide-react';
import Button from './Button';
import { useAuth } from '../admin/context/AuthContext';
import logoImage from '../assets/logo.png';

const mainLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Doctors', path: '/doctors' },
  { name: 'Gallery', path: '/gallery' },
];

const moreLinks = [
  { name: 'Events & Camps', path: '/events' },
  { name: 'Reviews & FAQs', path: '/reviews-faqs' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [clinic, setClinic] = useState(fallbackConfig);
  const location = useLocation();
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
          ? 'bg-white/95 backdrop-blur-md shadow-xs py-3.5 border-b border-[#E2E8F0]'
          : 'bg-white/90 backdrop-blur-xs py-4 border-b border-[#E2E8F0]/80'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-11">
          {/* Logo & Clinic Name */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <img src={logoImage} alt="Clinic Logo" className="w-10 h-10 object-contain transition-transform group-hover:scale-105" />
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-[#0F172A] group-hover:text-[#059669] transition-colors block leading-snug">
                {clinic.clinicName || fallbackConfig.clinicName}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#64748B] block">
                Multispeciality Care • Kopargaon
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-1.5">
            {mainLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-2.5 py-1.5 text-xs xl:text-sm font-medium rounded-md transition-all duration-150 ${
                    isActive
                      ? 'text-[#059669] bg-[#ECFDF5] font-semibold'
                      : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            
            {/* More Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-2.5 py-1.5 text-xs xl:text-sm font-medium text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-md transition-all duration-150 focus:outline-none">
                More <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-[#E2E8F0] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-1">
                {moreLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `block px-4 py-2 text-sm transition-colors ${
                        isActive
                          ? 'text-[#059669] bg-[#ECFDF5] font-semibold'
                          : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>
            </div>
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {/* Admin Portal / Login Button */}
            {user ? (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-1.5 rounded-lg hover:bg-[#D1FAE5] transition-colors shadow-xs"
                title="Go to Admin Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#475569] hover:text-[#0F172A] px-3 py-1.5 rounded-lg hover:bg-[#F8FAFC] border border-[#E2E8F0] transition-colors"
                title="Admin & Staff Login"
              >
                <Lock className="w-3.5 h-3.5 text-[#64748B]" />
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

          {/* Mobile Menu Toggle Buttons */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/appointment"
              className="p-2 text-[#059669] bg-[#ECFDF5] rounded-lg hover:bg-[#D1FAE5] transition-colors"
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
              {[...mainLinks, ...moreLinks].map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-[#059669] bg-[#ECFDF5] font-semibold'
                        : 'text-[#475569] hover:text-[#0F172A] hover:bg-[#F8FAFC]'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              <div className="pt-4 border-t border-[#E2E8F0] flex flex-col gap-2.5">
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
                <div className="pt-2 border-t border-[#E2E8F0]">
                  {user ? (
                    <Link
                      to="/admin"
                      className="flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-[#059669] bg-[#ECFDF5] rounded-lg border border-[#A7F3D0] transition-colors"
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
                      className="flex items-center justify-between px-3.5 py-2.5 text-xs font-medium text-[#475569] hover:bg-[#F8FAFC] rounded-lg border border-[#E2E8F0] transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <Lock className="w-3.5 h-3.5 text-[#64748B]" />
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
