import React from 'react';
import { motion } from 'framer-motion';

const SectionTitle = ({ badge, title, subtitle, center = true, light = false }) => {
  return (
    <div className={`mb-12 md:mb-16 ${center ? 'text-center max-w-3xl mx-auto' : 'max-w-2xl'}`}>
      {badge && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className={`inline-flex items-center px-3.5 py-1 mb-4 text-xs font-semibold tracking-wider rounded-full uppercase ${
            light
              ? 'bg-white/10 text-white border border-white/20'
              : 'bg-[#EDE3FF] dark:bg-[#32164D] text-[#4B168F] dark:text-[#E9DDFF] border border-[#DCC8FF] dark:border-[#5c3974]'
          }`}
        >
          {badge}
        </motion.span>
      )}
      
      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`text-3xl sm:text-4xl md:text-[44px] font-extrabold tracking-[-0.03em] leading-[1.18] ${
          light ? 'text-white' : 'text-[#24153F] dark:text-white'
        }`}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`mt-4 text-base md:text-lg font-normal leading-relaxed ${
            light ? 'text-[#E9DDFF]' : 'text-[#5D5271] dark:text-[#E9DDFF]'
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};

export default SectionTitle;

