import React, { useState, useEffect, useRef } from 'react';
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
  Languages,
  ChevronDown,
  Check,
} from 'lucide-react';
import Button from './Button';
import { useTheme } from '../context/ThemeContext';

const languages = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
];

const navLinks = [
  { name: 'Home', path: '/', icon: HomeIcon },
  { name: 'About', path: '/about', icon: Info },
  { name: 'Doctors', path: '/doctors', icon: Users },
  { name: 'Services', path: '/services', icon: Sparkles },
  { name: 'Events', mobileName: 'Events & Camps', path: '/events', icon: CalendarDays },
  { name: 'Gallery', path: '/gallery', icon: Images },
  { name: 'Reviews', mobileName: 'Reviews & FAQs', path: '/reviews-faqs', icon: MessageSquareQuote },
  { name: 'Contact', path: '/contact', icon: MapPin },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState(() => localStorage.getItem('site-language') || 'en');
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [clinic, setClinic] = useState(fallbackConfig);
  const langDropdownRef = useRef(null);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const applyLanguage = (nextLang) => {
    if (!['en', 'mr', 'hi'].includes(nextLang)) return;
    setIsLangDropdownOpen(false);
    setLanguage(nextLang);
    localStorage.setItem('site-language', nextLang);
    document.documentElement.lang = nextLang;

    const hostname = window.location.hostname;
    const cookieDomains = ['', `; domain=${hostname}`, `; domain=.${hostname}`];

    if (nextLang === 'en') {
      // Clear googtrans cookies across paths & domains
      cookieDomains.forEach((dom) => {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${dom}`;
        document.cookie = `googtrans=/en/en; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/${dom}`;
      });
      document.cookie = 'googtrans=/en/en; path=/;';
    } else {
      cookieDomains.forEach((dom) => {
        document.cookie = `googtrans=/en/${nextLang}; path=/${dom}`;
      });
    }

    const translateSelect = document.querySelector('.goog-te-combo');
    if (translateSelect) {
      const hasOption = Array.from(translateSelect.options || []).some((o) => o.value === nextLang);
      translateSelect.value = nextLang === 'en' ? (hasOption ? 'en' : '') : nextLang;
      translateSelect.dispatchEvent(new Event('change'));

      if (nextLang === 'en') {
        setTimeout(() => {
          if (
            document.documentElement.classList.contains('translated-ltr') ||
            document.querySelector('font')
          ) {
            window.location.reload();
          }
        }, 150);
      }
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
        <div className="flex items-center justify-between gap-2 xl:gap-3 h-12">
          {/* Logo & Clinic Name */}
          <Link to="/" className="flex items-center gap-2 group shrink-0 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0">
              <img src={logo} alt="Kalpana Multispeciality Dental Hospital logo" className="object-contain w-full h-full" />
            </div>
            <div className="min-w-0">
              <span className="text-xs sm:text-sm xl:text-base font-bold tracking-tight text-[#24153F] dark:text-white group-hover:text-[#4B168F] dark:group-hover:text-[#C6A0FF] transition-colors block leading-tight whitespace-nowrap">
                {clinic.clinicName || fallbackConfig.clinicName}
              </span>
              <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-[#81758F] dark:text-[#D9BFFF] block leading-none mt-0.5 whitespace-nowrap">
                Multispeciality Care • Kopargaon
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center justify-end xl:justify-center gap-1 xl:gap-2 flex-1 min-w-0 pr-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `inline-flex items-center justify-center px-2 xl:px-2.5 py-1.5 text-xs xl:text-sm font-semibold tracking-normal rounded-lg transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? 'text-[#4B168F] dark:text-[#E9DDFF] bg-[#EDE3FF] dark:bg-[#32164D] font-bold shadow-2xs'
                      : 'text-[#5D5271] dark:text-[#D9BFFF] hover:text-[#24153F] dark:hover:text-white hover:bg-[#F8F2FF] dark:hover:bg-[#32164D]'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Right CTA (Language, Theme, Login, Book) */}
          <div className="hidden lg:flex items-center gap-1.5 xl:gap-2.5 shrink-0 whitespace-nowrap pl-3.5 xl:pl-5 ml-2 xl:ml-3 border-l border-[#E9E1F2] dark:border-[#5c3974]">
            {/* Desktop Language Switcher */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="inline-flex items-center gap-1 px-2 xl:px-2.5 py-1.5 text-xs font-semibold text-[#4B168F] dark:text-[#E9DDFF] hover:bg-[#EDE3FF] dark:hover:bg-[#32164D] rounded-lg transition-colors border border-[#DCC8FF] dark:border-[#5c3974]"
                aria-label="Change language"
                title="Change language / भाषा बदला"
              >
                <Languages className="w-3.5 h-3.5 text-[#4B168F] dark:text-[#C6A0FF]" />
                <span className="hidden xl:inline">{languages.find((l) => l.code === language)?.native || 'English'}</span>
                <span className="xl:hidden">{languages.find((l) => l.code === language)?.short || 'EN'}</span>
                <ChevronDown
                  className={`w-3 h-3 text-[#81758F] dark:text-[#D9BFFF] transition-transform duration-200 ${
                    isLangDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white dark:bg-[#1E1235] border border-[#E9E1F2] dark:border-[#5c3974] rounded-xl shadow-lg py-1.5 z-50 animate-fade-in">
                  {languages.map((l) => {
                    const isSelected = language === l.code;
                    return (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => applyLanguage(l.code)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium text-left transition-colors ${
                          isSelected
                            ? 'text-[#4B168F] dark:text-[#E9DDFF] bg-[#F4EDFF] dark:bg-[#32164D] font-bold'
                            : 'text-[#475569] dark:text-[#D9BFFF] hover:bg-[#F8F2FF] dark:hover:bg-[#2A1647]'
                        }`}
                      >
                        <span>
                          {l.native} <span className="text-[10px] text-[#94A3B8]">({l.label})</span>
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#059669] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="p-1.5 xl:p-2 text-[#5D5271] dark:text-[#E9DDFF] hover:bg-[#EDE3FF] dark:hover:bg-[#32164D] rounded-lg transition-colors border border-[#E9E1F2] dark:border-[#5c3974]"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1 text-xs font-medium text-[#5D5271] dark:text-[#D9BFFF] hover:text-[#24153F] dark:hover:text-white px-2 py-1.5 rounded-lg hover:bg-[#F8F2FF] dark:hover:bg-[#32164D] border border-[#E9E1F2] dark:border-[#5c3974] transition-colors whitespace-nowrap"
              title="Login"
            >
              <Lock className="w-3 h-3 text-[#64748B]" />
              <span className="hidden xl:inline">Login</span>
            </Link>

            <Button
              to="/appointment"
              variant="primary"
              size="sm"
              className="shrink-0 whitespace-nowrap text-xs xl:text-sm px-2.5 xl:px-4 py-1.5"
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
          <div className="lg:hidden mt-3 pt-3 pb-6 border-t border-[#E9E1F2] dark:border-[#5c3974] animate-fade-in bg-white dark:bg-[#120C22] rounded-b-2xl shadow-xl px-2 max-h-[calc(100vh-75px)] overflow-y-auto">
            <div className="flex flex-col space-y-2">
              {/* Mobile Language Switcher */}
              <div className="flex flex-col gap-1.5 pb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#81758F] dark:text-[#D9BFFF] flex items-center gap-1.5 px-1">
                  <Languages className="w-3.5 h-3.5 text-[#4B168F] dark:text-[#C6A0FF]" /> Language / भाषा
                </span>
                <div className="grid grid-cols-3 gap-1 bg-[#F1E8FD] dark:bg-[#2A1647] p-1 rounded-xl">
                  {languages.map((l) => {
                    const isSelected = language === l.code;
                    return (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => {
                          applyLanguage(l.code);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`py-1.5 text-xs font-semibold rounded-lg transition-all text-center ${
                          isSelected
                            ? 'bg-white dark:bg-[#120C22] text-[#4B168F] dark:text-[#E9DDFF] shadow-xs font-bold'
                            : 'text-[#5D5271] dark:text-[#D9BFFF] hover:text-[#24153F]'
                        }`}
                      >
                        {l.native}
                      </button>
                    );
                  })}
                </div>
              </div>

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
                  {link.mobileName || link.name}
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
