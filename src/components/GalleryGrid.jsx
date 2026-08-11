import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryData } from '../data/gallery';
import { X, ZoomIn } from 'lucide-react';

const categories = ['All', 'Clinic', 'Treatments', 'Equipment', 'Smiles'];

const GalleryGrid = ({ limit }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredItems = activeCategory === 'All'
    ? galleryData
    : galleryData.filter(item => item.category === activeCategory);

  const displayedItems = limit ? filteredItems.slice(0, limit) : filteredItems;

  return (
    <div>
      {/* Category Tabs */}
      {!limit && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                  : 'bg-white text-slate-600 hover:bg-sky-50 border border-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {displayedItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-soft border border-sky-100 bg-sky-50 aspect-video"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                <span className="text-xs font-semibold uppercase tracking-wider text-sky-300">
                  {item.category}
                </span>
                <h4 className="text-lg font-bold mt-1">{item.title}</h4>
                <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{item.desc}</p>
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                  <ZoomIn className="w-5 h-5 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="max-h-[75vh] overflow-hidden bg-slate-900">
                <img
                  src={selectedImage.image}
                  alt={selectedImage.title}
                  className="w-full h-full object-contain max-h-[75vh] mx-auto"
                />
              </div>

              <div className="p-6 bg-white">
                <span className="text-xs font-semibold px-3 py-1 bg-sky-100 text-sky-800 rounded-full">
                  {selectedImage.category}
                </span>
                <h3 className="text-2xl font-bold text-slate-800 mt-2">
                  {selectedImage.title}
                </h3>
                <p className="text-slate-600 mt-1">{selectedImage.desc}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryGrid;
