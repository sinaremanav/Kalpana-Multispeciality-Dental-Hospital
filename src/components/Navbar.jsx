import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { clinicConfig } from '../config/clinicConfig';
import { Menu, X, Calendar, Stethoscope, PhoneCall } from 'lucide-react';
import Button from './Button';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Doctors', path: '/doctors' },
  { name: 'Services', path: '/services' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Testimonials', path: '/testimonials' },
  { name: 'FAQs', path: '/faqs' },
  { name: 'Contact', path: '/contact' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
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
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-sky-100'
          : 'bg-white/80 backdrop-blur-sm py-4 border-b border-sky-50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Clinic Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg md:text-xl font-bold tracking-tight text-slate-800 group-hover:text-sky-600 transition-colors block leading-tight">
                {clinicConfig.clinicName}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-600 block">
                Advanced Dental Care
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                    isActive
                      ? 'text-sky-600 bg-sky-50 font-semibold'
                      : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${clinicConfig.phone}`}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-sky-600 px-3 py-2 rounded-lg hover:bg-sky-50 transition-colors"
            >
              <PhoneCall className="w-4 h-4 text-sky-500" />
              <span>{clinicConfig.displayPhone}</span>
            </a>

            <Button
              to="/appointment"
              variant="primary"
              size="sm"
              icon={Calendar}
            >
              Book Appointment
            </Button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/appointment"
              className="p-2 text-sky-600 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors"
              aria-label="Book Appointment"
            >
              <Calendar className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:text-sky-600 hover:bg-sky-50 focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Out Drawer Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 pb-6 border-t border-sky-100 animate-fade-in">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-2.5 text-base font-medium rounded-xl transition-colors ${
                      isActive
                        ? 'text-sky-600 bg-sky-50 font-semibold'
                        : 'text-slate-700 hover:text-sky-600 hover:bg-slate-50'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}

              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                <a
                  href={`tel:${clinicConfig.phone}`}
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-700 bg-slate-100 py-3 rounded-xl"
                >
                  <PhoneCall className="w-4 h-4 text-sky-600" />
                  <span>Call Us: {clinicConfig.displayPhone}</span>
                </a>

                <Button
                  to="/appointment"
                  variant="primary"
                  size="md"
                  fullWidth
                  icon={Calendar}
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
