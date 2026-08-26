import React from 'react';
import { Link } from 'react-router-dom';

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
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.99] tracking-tight';
  
  const variants = {
    primary: 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 focus:ring-[#2563EB]',
    secondary: 'bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#1E40AF] border border-[#BFDBFE] focus:ring-[#2563EB]',
    outline: 'bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] hover:border-[#CBD5E1] shadow-xs hover:-translate-y-0.5 focus:ring-[#2563EB]',
    white: 'bg-white hover:bg-[#F8FAFC] text-[#0F172A] border border-[#E2E8F0] shadow-sm hover:shadow-md focus:ring-white',
    dark: 'bg-[#0F172A] hover:bg-[#1E293B] text-white shadow-sm hover:-translate-y-0.5 focus:ring-[#0F172A]',
    whatsapp: 'bg-[#16A34A] hover:bg-[#15803D] text-white shadow-sm hover:-translate-y-0.5 focus:ring-[#16A34A]'
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

  if (to) {
    return (
      <Link to={to} className={combinedClasses}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={combinedClasses}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combinedClasses}>
      {content}
    </button>
  );
};

export default Button;

