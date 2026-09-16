import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Button from '../components/Button';
import { Home, ArrowLeft, Stethoscope, Users, Calendar, Phone, Search } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="pt-24 pb-20 min-h-[80vh] flex items-center justify-center bg-white dark:bg-slate-900">
      <SEO page="notFound" noIndex={true} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-[#ECFDF5] dark:bg-slate-800 text-[#059669] dark:text-emerald-400 flex items-center justify-center mb-6 border border-[#D1FAE5] dark:border-slate-700 shadow-saas">
          <Stethoscope className="w-10 h-10" />
        </div>

        <span className="inline-flex items-center px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#059669] dark:text-emerald-400 bg-[#ECFDF5] dark:bg-slate-800 rounded-full border border-[#D1FAE5] dark:border-slate-700">
          Error 404 • Page Not Found
        </span>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-4">
          Looking for Dental Care?
        </h1>

        <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg mt-3 max-w-lg mx-auto leading-relaxed">
          The page you are looking for may have been moved, renamed, or is temporarily unavailable. Let us help you find what you need.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
          <Button to="/" variant="primary" size="lg" icon={Home}>
            Return to Homepage
          </Button>

          <Button to="/appointment" variant="outline" size="lg" icon={Calendar}>
            Book Appointment
          </Button>
        </div>

        {/* Quick Links to Key Hospital Sections */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            Popular Hospital Destinations
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <Link
              to="/services"
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors group"
            >
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                <Stethoscope className="w-4 h-4 text-emerald-600" />
                <span>Services</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">RCT, Implants & more</p>
            </Link>

            <Link
              to="/doctors"
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors group"
            >
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Doctors</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Specialist surgeons</p>
            </Link>

            <Link
              to="/reviews-faqs"
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors group"
            >
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                <Search className="w-4 h-4 text-emerald-600" />
                <span>FAQs</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Common questions</p>
            </Link>

            <Link
              to="/contact"
              className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors group"
            >
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Contact</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Kopargaon Bet</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
