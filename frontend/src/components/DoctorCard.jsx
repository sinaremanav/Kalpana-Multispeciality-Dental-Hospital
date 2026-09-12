import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { ArrowRight, CheckCircle2, Clock, Languages } from 'lucide-react';

const DoctorCard = ({ doctor, index = 0 }) => {
  if (!doctor) return null;

  const image = doctor.image || doctor.image_url || '/dr-nikhil-mahanubhav.png';
  const role = doctor.role || doctor.specialization || 'Dental Specialist';
  const name = doctor.name || 'Doctor';
  const shortName = name.split(' ')[1] || name;
  const specialties = Array.isArray(doctor.specialties)
    ? doctor.specialties
    : (doctor.specialization ? [doctor.specialization] : []);
  const languages = Array.isArray(doctor.languages) ? doctor.languages : [];
  const schedule = doctor.schedule || 'Mon - Sat (9:00 AM - 8:00 PM)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-[#E2E8F0] dark:border-slate-700 shadow-saas dark-glow-shadow hover:shadow-saas-hover transition-all duration-300 flex flex-col md:flex-row"
    >
      <div className="md:w-5/12 relative min-h-[280px] md:min-h-[340px] overflow-hidden bg-[#F8FAFC] dark:bg-slate-900">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-[#0F172A]/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-md border border-white/20">
          {doctor.experience || 'Experienced'}
        </div>
      </div>

      <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#059669] dark:text-emerald-400 bg-[#ECFDF5] dark:bg-slate-900 px-2.5 py-1 rounded-md border border-[#D1FAE5]/80 dark:border-slate-700">
            {role}
          </span>
          <h3 className="text-2xl font-extrabold text-[#0F172A] dark:text-white mt-3 mb-1 tracking-tight">
            {name}
          </h3>
          <p className="text-xs font-semibold text-[#64748B] dark:text-slate-400 mb-4">
            {doctor.qualification}
          </p>

          <p className="text-[#475569] dark:text-slate-300 text-sm leading-relaxed mb-6">
            {doctor.bio}
          </p>

          <div className="space-y-3 mb-6">
            {Array.isArray(specialties) && specialties.length > 0 && (
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] dark:text-slate-400 mb-2">
                  Specializations
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 text-xs font-medium bg-[#F8FAFC] dark:bg-slate-900 text-[#0F172A] dark:text-slate-300 px-2.5 py-1 rounded-md border border-[#E2E8F0] dark:border-slate-700"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] dark:text-emerald-400" />
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-[#64748B] dark:text-slate-400 pt-3 border-t border-[#E2E8F0]/80 dark:border-slate-700">
              {schedule && (
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#059669] dark:text-emerald-400" />
                  <span>{schedule}</span>
                </div>
              )}
              {Array.isArray(languages) && languages.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5 text-[#059669] dark:text-emerald-400" />
                  <span>{languages.join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E2E8F0]/80 dark:border-slate-700">
          <Button
            to={`/appointment?doctor=${encodeURIComponent(name)}`}
            variant="primary"
            size="sm"
            icon={ArrowRight}
          >
            Book Appointment with {shortName}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorCard;

