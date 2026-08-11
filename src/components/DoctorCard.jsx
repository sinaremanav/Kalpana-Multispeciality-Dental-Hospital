import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { Calendar, CheckCircle2, Clock, Languages } from 'lucide-react';

const DoctorCard = ({ doctor, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white rounded-3xl overflow-hidden border border-sky-100 shadow-soft shadow-hover flex flex-col md:flex-row"
    >
      <div className="md:w-5/12 relative min-h-[300px] overflow-hidden bg-sky-50">
        <img
          src={doctor.image}
          alt={doctor.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-sky-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">
          {doctor.experience}
        </div>
      </div>

      <div className="md:w-7/12 p-6 md:p-8 flex flex-col justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-sky-600 bg-sky-50 px-3 py-1 rounded-md">
            {doctor.role}
          </span>
          <h3 className="text-2xl font-bold text-slate-800 mt-2 mb-1">
            {doctor.name}
          </h3>
          <p className="text-sm font-medium text-slate-500 mb-4">
            {doctor.qualification}
          </p>

          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            {doctor.bio}
          </p>

          <div className="space-y-3 mb-6">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Specializations
              </h4>
              <div className="flex flex-wrap gap-2">
                {doctor.specialties.map((spec, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-xs font-medium bg-slate-50 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-100"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-500" />
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-500" />
                <span>{doctor.schedule}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-sky-500" />
                <span>{doctor.languages.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <Button
            to={`/appointment?doctor=${encodeURIComponent(doctor.name)}`}
            variant="primary"
            size="sm"
            icon={Calendar}
          >
            Book Appointment with {doctor.name.split(' ')[1]}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
