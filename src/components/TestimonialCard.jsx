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
      className="bg-white p-7 rounded-2xl border border-sky-100 shadow-soft shadow-hover flex flex-col justify-between relative"
    >
      <Quote className="absolute top-6 right-6 w-10 h-10 text-sky-100/60 pointer-events-none" />

      <div>
        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
        </div>

        {/* Comment */}
        <p className="text-slate-700 text-sm leading-relaxed italic mb-6">
          "{testimonial.comment}"
        </p>
      </div>

      {/* Patient Meta */}
      <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-11 h-11 rounded-full object-cover border-2 border-sky-100"
        />
        <div>
          <h4 className="font-bold text-slate-800 text-sm">
            {testimonial.name}
          </h4>
          <p className="text-xs text-sky-600 font-medium">
            {testimonial.treatment}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;
