import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const TestimonialCard = ({ testimonial, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="bg-white dark:bg-[#21113E] p-7 rounded-[24px] border border-[#E9E1F2] dark:border-[#5c3974] shadow-[0_14px_40px_rgba(53,18,117,0.07)] hover:shadow-[0_20px_50px_rgba(53,18,117,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between relative"
    >
      <Quote className="absolute top-6 right-6 w-8 h-8 text-[#EDE3FF] dark:text-[#45205D] pointer-events-none" />

      <div>
        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
          ))}
        </div>

        {/* Comment */}
        <p className="text-[#24153F] dark:text-white text-sm leading-relaxed mb-6 font-normal">
          "{testimonial.comment}"
        </p>
      </div>

      {/* Patient Meta */}
      <div className="flex items-center gap-3 pt-4 border-t border-[#E9E1F2] dark:border-[#5c3974]">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-10 h-10 rounded-full object-cover border border-[#E2E8F0]"
        />
        <div>
          <h4 className="font-bold text-[#24153F] dark:text-white text-sm">
            {testimonial.name}
          </h4>
          <p className="text-xs text-[#4B168F] dark:text-[#C6A0FF] font-medium">
            {testimonial.treatment}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;

