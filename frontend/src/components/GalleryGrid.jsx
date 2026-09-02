import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galleryService } from '../services/galleryService';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import EmptyState from './EmptyState';
import { X, ZoomIn, Image as ImageIcon } from 'lucide-react';

const categories = ['All', 'Clinic', 'Treatments', 'Equipment', 'Smiles'];

const GalleryGrid = ({ limit }) => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchGallery = async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await galleryService.getGallery(true);
      setGalleryItems(items);
    } catch (err) {
      console.error('Failed to load gallery items:', err);
      setError(err.message || 'Unable to load gallery');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const filteredItems =
    activeCategory === 'All'
      ? galleryItems
      : galleryItems.filter((item) => item.category?.toLowerCase() === activeCategory.toLowerCase());

  const displayedItems = limit ? filteredItems.slice(0, limit) : filteredItems;

  if (loading) {
    return <LoadingState message="Loading clinic facilities & treatment gallery..." minHeight="min-h-[250px]" />;
  }

  if (error) {
    return <ErrorState title="Unable to load gallery" message={error} onRetry={fetchGallery} />;
  }

  return (
    <div>
      {/* Category Tabs */}
      {!limit && (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                activeCategory === category
                  ? 'bg-[#059669] text-white shadow-xs'
                  : 'bg-white text-[#475569] hover:bg-[#F8FAFC] border border-[#E2E8F0]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {displayedItems.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No Photos in this Category"
          description="Photos for this clinical category will appear here soon."
        />
      ) : (
        /* Grid */
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {displayedItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                key={item.id}
                onClick={() => setSelectedImage(item)}
                className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-saas hover:shadow-saas-hover border border-[#E2E8F0] bg-[#F8FAFC] aspect-video"
              >
                <img
                  src={item.image_url || item.image}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6EE7B7]">
                    {item.category}
                  </span>
                  <h4 className="text-base font-bold mt-1 tracking-tight text-white">{item.title}</h4>
                  <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">{item.description || item.desc}</p>
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-[#0F172A]/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#E2E8F0]"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-lg bg-[#0F172A]/70 hover:bg-[#0F172A] text-white flex items-center justify-center transition-colors border border-white/20 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="max-h-[70vh] overflow-hidden bg-[#0F172A]">
                <img
                  src={selectedImage.image_url || selectedImage.image}
                  alt={selectedImage.title}
                  className="w-full h-full object-contain max-h-[70vh] mx-auto"
                />
              </div>

              <div className="p-6 bg-white">
                <span className="text-xs font-semibold px-2.5 py-1 bg-[#ECFDF5] text-[#059669] rounded-md border border-[#D1FAE5]">
                  {selectedImage.category}
                </span>
                <h3 className="text-xl font-bold text-[#0F172A] mt-2 tracking-tight">
                  {selectedImage.title}
                </h3>
                <p className="text-[#475569] text-sm mt-1">{selectedImage.description || selectedImage.desc}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryGrid;
