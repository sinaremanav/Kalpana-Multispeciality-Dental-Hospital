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
      className="bg-white p-7 rounded-[16px] border border-[#E2E8F0] shadow-saas hover:shadow-saas-hover hover:border-[#CBD5E1] transition-all duration-300 flex flex-col justify-between relative"
    >
      <Quote className="absolute top-6 right-6 w-8 h-8 text-[#E2E8F0] pointer-events-none" />

      <div>
        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
          ))}
        </div>

        {/* Comment */}
        <p className="text-[#0F172A] text-sm leading-relaxed mb-6 font-normal">
          "{testimonial.comment}"
        </p>
      </div>

      {/* Patient Meta */}
      <div className="flex items-center gap-3 pt-4 border-t border-[#E2E8F0]">
        <img
          src={testimonial.avatar}
          alt={`Patient review by ${testimonial.name} - ${testimonial.treatment}`}
          loading="lazy"
          width="40"
          height="40"
          className="w-10 h-10 rounded-full object-cover border border-[#E2E8F0]"
        />
        <div>
          <h4 className="font-bold text-[#0F172A] text-sm">
            {testimonial.name}
          </h4>
          <p className="text-xs text-[#059669] font-medium">
            {testimonial.treatment}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;

