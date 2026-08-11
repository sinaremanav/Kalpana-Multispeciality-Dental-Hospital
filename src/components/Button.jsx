import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({
  children,
  to,
  href,
  onClick,
  variant = 'primary', // primary, secondary, outline, white, whatsapp
  size = 'md', // sm, md, lg
  className = '',
  icon: Icon,
  type = 'button',
  fullWidth = false,
  target,
  rel
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98]';
  
  const variants = {
    primary: 'bg-sky-500 hover:bg-sky-600 text-white shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30 focus:ring-sky-500',
    secondary: 'bg-sky-100 hover:bg-sky-200 text-sky-800 focus:ring-sky-300',
    outline: 'border-2 border-sky-500 text-sky-600 hover:bg-sky-50 focus:ring-sky-500',
    white: 'bg-white hover:bg-slate-50 text-sky-700 shadow-md focus:ring-white',
    dark: 'bg-slate-900 hover:bg-slate-800 text-white shadow-md focus:ring-slate-900',
    whatsapp: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 focus:ring-emerald-500'
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm font-medium gap-1.5',
    md: 'px-5 py-2.5 text-base font-semibold gap-2',
    lg: 'px-7 py-3.5 text-lg font-semibold gap-2.5'
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

  const content = (
    <>
      {children}
      {Icon && <Icon className={`w-5 h-5 ${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : ''}`} />}
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
