import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { clinicConfig as fallbackConfig } from '../config/clinicConfig';
import { clinicService } from '../services/clinicService';
import logo from '../assets/logo.png';
import {
  Menu,
  X,
  Calendar,
  Stethoscope,
  ArrowRight,
  Lock,
  Sun,
  Moon,
  Home as HomeIcon,
  Info,
  Users,
  Sparkles,
  CalendarDays,
  Images,
  MessageSquareQuote,
  MapPin,
} from 'lucide-react';
import Button from './Button';
import { useTheme } from '../context/ThemeContext';

const navLinks = [
  { name: 'Home', path: '/', icon: HomeIcon },
  { name: 'About', path: '/about', icon: Info },
  { name: 'Doctors', path: '/doctors', icon: Users },
  { name: 'Services', path: '/services', icon: Sparkles },
  { name: 'Events & Camps', path: '/events', icon: CalendarDays },
  { name: 'Gallery', path: '/gallery', icon: Images },
  { name: 'Reviews & FAQs', path: '/reviews-faqs', icon: MessageSquareQuote },
  { name: 'Contact', path: '/contact', icon: MapPin },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState(() => localStorage.getItem('site-language') || 'en');
  const [clinic, setClinic] = useState(fallbackConfig);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const handleLanguageChange = () => {
    const nextLanguage = language === 'mr' ? 'en' : 'mr';
    setLanguage(nextLanguage);
    localStorage.setItem('site-language', nextLanguage);
    document.documentElement.lang = nextLanguage;

    if (nextLanguage === 'en') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    } else {
      document.cookie = `googtrans=/en/${nextLanguage}; path=/;`;
    }

    const translateSelect = document.querySelector('.goog-te-combo');
    if (translateSelect) {
      translateSelect.value = nextLanguage === 'en' ? '' : nextLanguage;
      translateSelect.dispatchEvent(new Event('change'));
    } else {
      window.location.reload();
    }
  };

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

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <header
      className={`public-navbar fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-[#120C22]/95 backdrop-blur-md shadow-[0_8px_28px_rgba(53,18,117,0.08)] py-3.5 border-b border-[#E9E1F2] dark:border-[#5c3974]'
          : 'bg-white/90 dark:bg-[#120C22]/90 backdrop-blur-xs py-4 border-b border-[#E9E1F2]/80 dark:border-[#5c3974]/80'
      }`}
    >
      <div className="max-w-[1320px] mx-auto px-3 sm:px-5 lg:px-6">
        <div className="flex items-center gap-3 h-11">
          {/* Logo & Clinic Name */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0 min-w-0 lg:w-[250px]">
            <div className="w-9 h-9 flex items-center justify-center">
              <img src={logo} alt="Kalpana Multispeciality Dental Hospital logo" className="object-contain w-full h-full" />
            </div>
            <div>
              <span className="text-sm sm:text-base font-bold tracking-tight text-[#24153F] dark:text-white group-hover:text-[#4B168F] dark:group-hover:text-[#C6A0FF] transition-colors block leading-tight whitespace-normal">
                {clinic.clinicName || fallbackConfig.clinicName}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#81758F] dark:text-[#D9BFFF] block">
                Multispeciality Care • Kopargaon
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex flex-1 items-center justify-center gap-0.5 min-w-0 overflow-hidden">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                    `inline-flex shrink-0 items-center justify-center gap-1.5 px-1.5 xl:px-2 py-1.5 text-[11px] xl:text-xs font-semibold tracking-normal rounded-md transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? 'text-[#4B168F] dark:text-[#E9DDFF] bg-[#EDE3FF] dark:bg-[#32164D] font-semibold'
                      : 'text-[#5D5271] dark:text-[#D9BFFF] hover:text-[#24153F] dark:hover:text-white hover:bg-[#F8F2FF] dark:hover:bg-[#32164D]'
                  }`
                }
              >
                <link.icon className="w-3.5 h-3.5" aria-hidden="true" />
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden lg:flex items-center gap-1.5 shrink-0 whitespace-nowrap">
            <button
              type="button"
              onClick={handleLanguageChange}
              className="medium-optional px-2.5 py-1.5 text-xs font-semibold text-[#4B168F] dark:text-[#E9DDFF] hover:bg-[#EDE3FF] dark:hover:bg-[#32164D] rounded-lg transition-colors border border-[#DCC8FF] dark:border-[#5c3974]"
              aria-label={language === 'mr' ? 'Switch to English' : 'Switch to Marathi'}
              title={language === 'mr' ? 'English' : 'मराठी'}
            >
              {language === 'mr' ? 'English' : 'मराठी'}
            </button>

            <button
              type="button"
              onClick={toggleTheme}
              className="medium-optional p-2 text-[#5D5271] dark:text-[#E9DDFF] hover:bg-[#EDE3FF] dark:hover:bg-[#32164D] rounded-lg transition-colors border border-[#E9E1F2] dark:border-[#5c3974]"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-[#5D5271] dark:text-[#D9BFFF] hover:text-[#24153F] dark:hover:text-white px-2 py-1.5 rounded-lg hover:bg-[#F8F2FF] dark:hover:bg-[#32164D] border border-[#E9E1F2] dark:border-[#5c3974] transition-colors whitespace-nowrap"
              title="Login"
            >
              <Lock className="w-3 h-3 text-[#64748B]" />
              <span>Login</span>
            </Link>

            <Button
              to="/appointment"
              variant="primary"
              size="sm"
              className="shrink-0 whitespace-nowrap"
              icon={ArrowRight}
            >
              Book Appointment
            </Button>
          </div>

          {/* Mobile Menu Toggle Buttons */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/appointment"
              className="p-2 text-[#4B168F] bg-[#EDE3FF] rounded-lg hover:bg-[#E3D2FF] transition-colors"
              aria-label="Book Appointment"
            >
              <Calendar className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-[#24153F] dark:text-white hover:bg-[#F8F2FF] dark:hover:bg-[#32164D] focus:outline-none transition-colors border border-[#E9E1F2] dark:border-[#5c3974]"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Out Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 pb-6 border-t border-[#E9E1F2] dark:border-[#5c3974] animate-fade-in bg-white dark:bg-[#120C22] rounded-b-2xl shadow-xl px-2">
            <div className="flex flex-col space-y-1">
              <button
                type="button"
                onClick={handleLanguageChange}
                className="self-start px-3 py-1.5 text-xs font-semibold text-[#4B168F] dark:text-[#E9DDFF] hover:bg-[#EDE3FF] dark:hover:bg-[#32164D] rounded-lg transition-colors border border-[#DCC8FF] dark:border-[#5c3974]"
                aria-label={language === 'mr' ? 'Switch to English' : 'Switch to Marathi'}
              >
                {language === 'mr' ? 'English' : 'मराठी'}
              </button>

              <button
                type="button"
                onClick={toggleTheme}
                className="self-start inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-[#5D5271] dark:text-[#E9DDFF] hover:bg-[#EDE3FF] dark:hover:bg-[#32164D] rounded-lg transition-colors border border-[#E9E1F2] dark:border-[#5c3974]"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>

              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-[#4B168F] dark:text-[#E9DDFF] bg-[#EDE3FF] dark:bg-[#32164D] font-semibold'
                        : 'text-[#5D5271] dark:text-[#D9BFFF] hover:text-[#24153F] dark:hover:text-white hover:bg-[#F8F2FF] dark:hover:bg-[#32164D]'
                    }`
                  }
                >
                  <link.icon className="w-4 h-4" aria-hidden="true" />
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
                  <Link
                    to="/admin/login"
                    className="flex items-center justify-between px-3.5 py-2.5 text-xs font-medium text-[#5D5271] dark:text-[#D9BFFF] hover:bg-[#F8F2FF] dark:hover:bg-[#32164D] rounded-lg border border-[#E9E1F2] dark:border-[#5c3974] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-[#A96BFF]" />
                      <span>Login</span>
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#A96BFF]" />
                  </Link>
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
