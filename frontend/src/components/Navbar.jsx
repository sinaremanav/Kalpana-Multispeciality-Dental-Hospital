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
  { code: 'en', label: 'English', native: 'English', short: 'EN' },
  { code: 'mr', label: 'Marathi', native: 'मराठी', short: 'मरा' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी', short: 'हिं' },
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
    const onSettingsChange = (e) => {
      if (e.detail) setClinic(e.detail);
      else clinicService.getClinicSettings().then((d) => d && setClinic(d));
    };
    window.addEventListener('clinic_settings_updated', onSettingsChange);
    return () => window.removeEventListener('clinic_settings_updated', onSettingsChange);
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
          ? 'bg-white/95 dark:bg-[#120C22]/95 backdrop-blur-md shadow-[0_4px_24px_rgba(53,18,117,0.08)] py-2.5 border-b border-[#E9E1F2] dark:border-[#49315F]'
          : 'bg-white/95 dark:bg-[#120C22]/95 backdrop-blur-md py-3 border-b border-[#E9E1F2]/80 dark:border-[#49315F]/80'
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-8 2xl:px-12 mx-auto">
        <div className="flex items-center justify-between gap-3 xl:gap-4 2xl:gap-6 h-12">
          {/* Section 1: Brand (Hospital logo & clinic name) */}
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0 max-w-[260px] xl:max-w-[280px] 2xl:max-w-[340px]"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center">
              <img
                src={logo}
                alt="Kalpana Multispeciality Dental Hospital logo"
                className="object-contain w-full h-full"
              />
            </div>
            <div className="min-w-0">
              <span className="text-sm sm:text-[15px] font-bold tracking-tight text-[#24153F] dark:text-[#F8F5FF] group-hover:text-[#4B168F] dark:group-hover:text-[#A96BFF] transition-colors block leading-tight truncate">
                {clinic.clinicName || fallbackConfig.clinicName}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#81758F] dark:text-[#C7BBD9] block leading-tight mt-0.5 truncate">
                Multispeciality Care • Kopargaon
              </span>
            </div>
          </Link>

          {/* Section 2: Desktop Navigation Links */}
          <nav className="hidden xl:flex flex-1 items-center justify-center gap-1 xl:gap-1.5 2xl:gap-2.5 min-w-0 px-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `inline-flex shrink-0 items-center justify-center gap-1.5 px-2 xl:px-2 2xl:px-3 py-1.5 text-xs 2xl:text-[13px] font-semibold tracking-normal rounded-lg transition-all duration-150 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#A96BFF] ${
                    isActive
                      ? 'text-[#4B168F] dark:text-[#F8F5FF] bg-[#EDE3FF] dark:bg-[#291943] font-bold shadow-xs'
                      : 'text-[#5D5271] dark:text-[#C7BBD9] hover:text-[#24153F] dark:hover:text-[#F8F5FF] hover:bg-[#F8F2FF] dark:hover:bg-[#211438]'
                  }`
                }
              >
                <link.icon className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 shrink-0" aria-hidden="true" />
                <span>{link.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Section 3: Desktop Right Controls & CTA */}
          <div className="hidden xl:flex items-center gap-2 xl:gap-2 2xl:gap-2.5 shrink-0 whitespace-nowrap pl-2 xl:pl-3 ml-1 xl:ml-2 border-l border-[#E9E1F2] dark:border-[#49315F]">
            {/* Desktop Language Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-[#4B168F] dark:text-[#F8F5FF] hover:bg-[#EDE3FF] dark:hover:bg-[#211438] rounded-lg transition-colors border border-[#DCC8FF] dark:border-[#49315F]"
                aria-label="Change language"
                title="Change language / भाषा बदला"
              >
                <Languages className="w-3.5 h-3.5 text-[#4B168F] dark:text-[#A96BFF] shrink-0" />
                <span>{languages.find((l) => l.code === language)?.native || 'English'}</span>
                <ChevronDown
                  className={`w-3 h-3 text-[#81758F] dark:text-[#C7BBD9] transition-transform duration-200 ${
                    isLangDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white dark:bg-[#211438] border border-[#E9E1F2] dark:border-[#49315F] rounded-xl shadow-lg py-1.5 z-50 animate-fade-in">
                  {languages.map((l) => {
                    const isSelected = language === l.code;
                    return (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => applyLanguage(l.code)}
                        className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium text-left transition-colors ${
                          isSelected
                            ? 'text-[#4B168F] dark:text-[#F8F5FF] bg-[#F4EDFF] dark:bg-[#291943] font-bold'
                            : 'text-[#475569] dark:text-[#C7BBD9] hover:bg-[#F8F2FF] dark:hover:bg-[#291943] dark:hover:text-[#F8F5FF]'
                        }`}
                      >
                        <span>
                          {l.native} <span className="text-[10px] text-[#94A3B8]">({l.label})</span>
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#A96BFF] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 text-[#5D5271] dark:text-[#F8F5FF] hover:bg-[#EDE3FF] dark:hover:bg-[#211438] rounded-lg transition-colors border border-[#E9E1F2] dark:border-[#49315F] shrink-0"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              to="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#5D5271] dark:text-[#C7BBD9] hover:text-[#24153F] dark:hover:text-[#F8F5FF] px-2.5 py-1.5 rounded-lg hover:bg-[#F8F2FF] dark:hover:bg-[#211438] border border-[#E9E1F2] dark:border-[#49315F] transition-colors whitespace-nowrap shrink-0"
              title="Admin Login"
            >
              <Lock className="w-3.5 h-3.5 text-[#81758F] dark:text-[#A96BFF]" />
              <span>Login</span>
            </Link>

            <Button
              to="/appointment"
              variant="primary"
              size="sm"
              className="shrink-0 whitespace-nowrap shadow-sm hover:shadow-md"
              icon={ArrowRight}
            >
              Book Appointment
            </Button>
          </div>

          {/* Mobile / Tablet Menu Toggle Buttons */}
          <div className="flex items-center gap-2 xl:hidden">
            <Link
              to="/appointment"
              className="p-2 text-[#4B168F] bg-[#EDE3FF] dark:bg-[#291943] dark:text-[#F8F5FF] rounded-lg hover:bg-[#E3D2FF] dark:hover:bg-[#32164D] transition-colors"
              aria-label="Book Appointment"
            >
              <Calendar className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-[#24153F] dark:text-[#F8F5FF] hover:bg-[#F8F2FF] dark:hover:bg-[#211438] focus:outline-none transition-colors border border-[#E9E1F2] dark:border-[#49315F]"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-Out Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden mt-3 pt-3 pb-6 border-t border-[#E9E1F2] dark:border-[#49315F] animate-fade-in bg-white dark:bg-[#1A1030] rounded-b-2xl shadow-xl px-2 max-h-[calc(100vh-75px)] overflow-y-auto">
            <div className="flex flex-col space-y-2">
              {/* Mobile Language & Theme Switcher */}
              <div className="flex flex-col gap-1.5 pb-2 border-b border-[#E9E1F2] dark:border-[#49315F] px-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#81758F] dark:text-[#C7BBD9] flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-[#4B168F] dark:text-[#A96BFF]" /> Language / भाषा
                  </span>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-[#5D5271] dark:text-[#F8F5FF] hover:bg-[#EDE3FF] dark:hover:bg-[#291943] rounded-lg transition-colors border border-[#E9E1F2] dark:border-[#49315F]"
                    aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  >
                    {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                    <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1 bg-[#F1E8FD] dark:bg-[#211438] p-1 rounded-xl">
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
                            ? 'bg-white dark:bg-[#1A1030] text-[#4B168F] dark:text-[#F8F5FF] shadow-xs font-bold'
                            : 'text-[#5D5271] dark:text-[#C7BBD9] hover:text-[#24153F] dark:hover:text-[#F8F5FF]'
                        }`}
                      >
                        {l.native}
                      </button>
                    );
                  })}
                </div>
              </div>

              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2.5 px-3.5 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-[#4B168F] dark:text-[#F8F5FF] bg-[#EDE3FF] dark:bg-[#291943] font-semibold'
                        : 'text-[#5D5271] dark:text-[#C7BBD9] hover:text-[#24153F] dark:hover:text-[#F8F5FF] hover:bg-[#F8F2FF] dark:hover:bg-[#211438]'
                    }`
                  }
                >
                  <link.icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{link.mobileName || link.name}</span>
                </NavLink>
              ))}

              <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#49315F] flex flex-col gap-2.5">
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
                <div className="pt-2 border-t border-[#E2E8F0] dark:border-[#49315F]">
                  <Link
                    to="/admin/login"
                    className="flex items-center justify-between px-3.5 py-2.5 text-xs font-medium text-[#5D5271] dark:text-[#C7BBD9] hover:bg-[#F8F2FF] dark:hover:bg-[#211438] rounded-lg border border-[#E9E1F2] dark:border-[#49315F] transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-[#A96BFF]" />
                      <span>Admin Login</span>
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
