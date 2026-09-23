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
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 tracking-tight';
  
  const variants = {
    primary: 'bg-[#351275] hover:bg-[#4B168F] text-white shadow-[0_10px_24px_rgba(53,18,117,0.22)] hover:shadow-[0_14px_30px_rgba(53,18,117,0.3)] focus:ring-[#A96BFF]',
    secondary: 'bg-[#EDE3FF] dark:bg-[#32164D] hover:bg-[#E3D2FF] dark:hover:bg-[#45205d] text-[#351275] dark:text-[#E9DDFF] border border-[#DCC8FF] dark:border-[#5c3974] focus:ring-[#A96BFF]',
    outline: 'bg-white dark:bg-[#21113E] hover:bg-[#F8F2FF] dark:hover:bg-[#32164D] text-[#24153F] dark:text-white border border-[#E9E1F2] dark:border-[#5c3974] hover:border-[#CDB2F5] dark:hover:border-[#8055a0] shadow-sm focus:ring-[#A96BFF]',
    white: 'bg-white hover:bg-[#F8F2FF] text-[#351275] border border-white/50 shadow-sm hover:shadow-md focus:ring-white',
    dark: 'bg-[#24153F] dark:bg-white hover:bg-[#351275] dark:hover:bg-[#F3ECFF] text-white dark:text-[#24153F] shadow-sm focus:ring-[#351275]',
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

