import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';

const ServiceCard = ({ service, index = 0 }) => {
  const IconComponent = Icons[service.icon] || Icons.Activity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white dark:bg-[#21113E] p-7 sm:p-8 rounded-[24px] border border-[#E9E1F2] dark:border-[#5c3974] shadow-[0_14px_40px_rgba(53,18,117,0.07)] hover:shadow-[0_20px_50px_rgba(53,18,117,0.15)] hover:-translate-y-1 hover:border-[#CDB2F5] transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#EDE3FF] dark:bg-[#32164D] text-[#4B168F] dark:text-[#D9BFFF] flex items-center justify-center group-hover:bg-[#351275] group-hover:text-white transition-colors duration-300 border border-[#DCC8FF] dark:border-[#5c3974]">
            <IconComponent className="w-6 h-6" />
          </div>
          {service.badge && (
            <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 bg-[#FCFAF8] dark:bg-[#120C22] text-[#5D5271] dark:text-[#E9DDFF] rounded-lg border border-[#E9E1F2] dark:border-[#5c3974]">
              {service.badge}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-[#24153F] dark:text-white mb-3 group-hover:text-[#4B168F] dark:group-hover:text-[#C6A0FF] transition-colors leading-snug tracking-tight">
          {service.title}
        </h3>

        <p className="text-[#5D5271] dark:text-[#E9DDFF] text-sm leading-relaxed mb-6">
          {service.shortDesc}
        </p>
      </div>

      <div className="pt-4 border-t border-[#E9E1F2] dark:border-[#5c3974] flex items-center justify-between">
        <Link
          to={`/appointment?service=${encodeURIComponent(service.title)}`}
          className="inline-flex items-center text-xs font-bold text-[#4B168F] dark:text-[#C6A0FF] hover:text-[#351275] dark:hover:text-white gap-1 group/link"
        >
          <span>Book Treatment</span>
          <Icons.ArrowRight className="w-3.5 h-3.5 transform group-hover/link:translate-x-1 transition-transform" />
        </Link>
        
        <Link
          to="/services"
          className="text-xs font-semibold text-[#81758F] dark:text-[#D9BFFF] hover:text-[#24153F] dark:hover:text-white transition-colors"
        >
          Details →
        </Link>
      </div>
    </motion.div>
  );
};

export default ServiceCard;

