import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionLink = motion.create ? motion.create(Link) : motion(Link);

const Button = ({
  children,
  to,
  href,
  onClick,
  variant = 'primary', // primary, secondary, outline, white, dark, whatsapp
  size = 'md', // sm, md, lg
  className = '',
  icon: Icon,
  type = 'button',
  fullWidth = false,
  target,
  rel
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 tracking-tight';
  
  const variants = {
    primary: 'bg-[#059669] hover:bg-[#047857] text-white shadow-sm hover:shadow-md focus:ring-[#059669]',
    secondary: 'bg-[#ECFDF5] dark:bg-slate-800 hover:bg-[#D1FAE5] dark:hover:bg-slate-700 text-[#065F46] dark:text-emerald-400 border border-[#A7F3D0] dark:border-slate-700 focus:ring-[#059669]',
    outline: 'bg-white dark:bg-slate-800 hover:bg-[#F8FAFC] dark:hover:bg-slate-700 text-[#0F172A] dark:text-white border border-[#E2E8F0] dark:border-slate-700 hover:border-[#CBD5E1] dark:hover:border-slate-600 shadow-xs focus:ring-[#059669]',
    white: 'bg-white dark:bg-slate-800 hover:bg-[#F8FAFC] dark:hover:bg-slate-700 text-[#0F172A] dark:text-white border border-[#E2E8F0] dark:border-slate-700 shadow-sm hover:shadow-md focus:ring-white dark:focus:ring-slate-600',
    dark: 'bg-[#0F172A] dark:bg-white hover:bg-[#1E293B] dark:hover:bg-slate-200 text-white dark:text-slate-900 shadow-sm focus:ring-[#0F172A]',
    whatsapp: 'bg-[#16A34A] hover:bg-[#15803D] text-white shadow-sm focus:ring-[#16A34A]'
  };

  const sizes = {
    sm: 'px-3.5 py-2 text-xs font-semibold gap-1.5',
    md: 'px-5 py-2.5 text-sm font-semibold gap-2',
    lg: 'px-6 py-3.5 text-base font-semibold gap-2.5'
  };

  const combinedClasses = `${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

  const content = (
    <>
      <span>{children}</span>
      {Icon && <Icon className={`shrink-0 ${size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'}`} />}
    </>
  );

  const motionProps = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.97 },
    transition: { type: 'spring', stiffness: 400, damping: 17 }
  };

  if (to) {
    return (
      <MotionLink to={to} className={combinedClasses} {...motionProps}>
        {content}
      </MotionLink>
    );
  }

  if (href) {
    return (
      <motion.a href={href} target={target} rel={rel} className={combinedClasses} {...motionProps}>
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button type={type} onClick={onClick} className={combinedClasses} {...motionProps}>
      {content}
    </motion.button>
  );
};

export default Button;

