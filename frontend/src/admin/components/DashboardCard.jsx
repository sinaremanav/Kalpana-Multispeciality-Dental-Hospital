import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const DashboardCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  linkTo,
  index = 0,
}) => {
  const colorMap = {
    blue: 'bg-blue-50 text-emerald-600 border-emerald-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    purple: 'bg-purple-50 text-purple-600 border-purple-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
  };

  const CardContent = (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-saas hover:shadow-saas-hover transition-all group flex flex-col justify-between"
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block mb-1">
            {title}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            {value}
          </div>
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center border shrink-0 ${
            colorMap[color] || colorMap.blue
          }`}
        >
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
        <span className="text-[#64748B] font-medium">{subtitle}</span>
        {linkTo && (
          <span className="text-[#059669] font-bold group-hover:translate-x-1 transition-transform inline-flex items-center gap-0.5">
            Manage <ChevronRight className="w-3.5 h-3.5" />
          </span>
        )}
      </div>
    </motion.div>
  );

  if (linkTo) {
    return <Link to={linkTo}>{CardContent}</Link>;
  }

  return CardContent;
};

export default DashboardCard;
