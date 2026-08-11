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
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative bg-white p-7 rounded-2xl border border-sky-100 shadow-soft shadow-hover flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-500 group-hover:text-white transition-colors duration-300">
            <IconComponent className="w-7 h-7" />
          </div>
          {service.badge && (
            <span className="text-xs font-semibold px-3 py-1 bg-sky-50 text-sky-700 rounded-full border border-sky-100">
              {service.badge}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-sky-600 transition-colors">
          {service.title}
        </h3>

        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          {service.shortDesc}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <Link
          to={`/appointment?service=${encodeURIComponent(service.title)}`}
          className="inline-flex items-center text-sm font-semibold text-sky-600 hover:text-sky-700 gap-1 group/link"
        >
          <span>Book Treatment</span>
          <Icons.ArrowRight className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
        </Link>
        
        <Link
          to="/services"
          className="text-xs font-medium text-slate-400 hover:text-slate-600"
        >
          Details
        </Link>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
