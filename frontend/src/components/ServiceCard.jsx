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
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative bg-white p-7 sm:p-8 rounded-[16px] border border-[#E2E8F0] shadow-saas hover:shadow-saas-hover hover:border-[#CBD5E1] transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 rounded-xl bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center group-hover:bg-[#2563EB] group-hover:text-white transition-colors duration-300 border border-[#DBEAFE]/60">
            <IconComponent className="w-6 h-6" />
          </div>
          {service.badge && (
            <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 bg-[#F8FAFC] text-[#475569] rounded-md border border-[#E2E8F0]">
              {service.badge}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-[#0F172A] mb-3 group-hover:text-[#2563EB] transition-colors leading-snug tracking-tight">
          {service.title}
        </h3>

        <p className="text-[#475569] text-sm leading-relaxed mb-6">
          {service.shortDesc}
        </p>
      </div>

      <div className="pt-4 border-t border-[#E2E8F0]/80 flex items-center justify-between">
        <Link
          to={`/appointment?service=${encodeURIComponent(service.title)}`}
          className="inline-flex items-center text-xs font-bold text-[#2563EB] hover:text-[#1D4ED8] gap-1 group/link"
        >
          <span>Book Treatment</span>
          <Icons.ArrowRight className="w-3.5 h-3.5 transform group-hover/link:translate-x-1 transition-transform" />
        </Link>
        
        <Link
          to="/services"
          className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
        >
          Details →
        </Link>
      </div>
    </motion.div>
  );
};

export default ServiceCard;

