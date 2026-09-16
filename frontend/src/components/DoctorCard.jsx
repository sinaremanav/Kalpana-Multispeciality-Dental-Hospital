import React from 'react';
import { motion } from 'framer-motion';
import Button from './Button';
import { ArrowRight, CheckCircle2, Clock, Languages } from 'lucide-react';

const DoctorCard = ({ doctor, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white dark:bg-[#21113E] rounded-[28px] overflow-hidden border border-[#E9E1F2] dark:border-[#5c3974] shadow-[0_14px_40px_rgba(53,18,117,0.08)] hover:shadow-[0_20px_50px_rgba(53,18,117,0.16)] hover:-translate-y-1 transition-all duration-300 flex flex-col md:flex-row"
    >
      <div className="md:w-5/12 relative min-h-[280px] md:min-h-[340px] overflow-hidden bg-[#F7F1FF] dark:bg-[#120C22]">
        <img
          src={doctor.image}
          alt={`${doctor.name} - ${doctor.role || 'Dental Specialist'} at Kalpana Multispeciality Dental Hospital`}
          loading="lazy"
          width="600"
          height="600"
          className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-4 left-4 bg-[#351275]/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20">
          {doctor.experience}
        </div>
      </div>

      <div className="md:w-7/12 p-6 sm:p-8 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#4B168F] dark:text-[#D9BFFF] bg-[#EDE3FF] dark:bg-[#32164D] px-2.5 py-1 rounded-lg border border-[#DCC8FF] dark:border-[#5c3974]">
            {doctor.role}
          </span>
          <h3 className="text-2xl font-extrabold text-[#24153F] dark:text-white mt-3 mb-1 tracking-tight">
            {doctor.name}
          </h3>
          <p className="text-xs font-semibold text-[#81758F] dark:text-[#D9BFFF] mb-4">
            {doctor.qualification}
          </p>

          <p className="text-[#5D5271] dark:text-[#E9DDFF] text-sm leading-relaxed mb-6">
            {doctor.bio}
          </p>

          <div className="space-y-3 mb-6">
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#81758F] dark:text-[#D9BFFF] mb-2">
                Specializations
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {doctor.specialties.map((spec, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 text-xs font-medium bg-[#FCFAF8] dark:bg-[#120C22] text-[#24153F] dark:text-[#E9DDFF] px-2.5 py-1 rounded-lg border border-[#E9E1F2] dark:border-[#5c3974]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#A96BFF] dark:text-[#C6A0FF]" />
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-[#81758F] dark:text-[#D9BFFF] pt-3 border-t border-[#E9E1F2] dark:border-[#5c3974]">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#A96BFF] dark:text-[#C6A0FF]" />
                <span>{doctor.schedule}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-[#A96BFF] dark:text-[#C6A0FF]" />
                <span>{doctor.languages.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E9E1F2] dark:border-[#5c3974]">
          <Button
            to={`/appointment?doctor=${encodeURIComponent(doctor.name)}`}
            variant="primary"
            size="sm"
            icon={ArrowRight}
          >
            Book Appointment with {doctor.name.split(' ')[1]}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorCard;

