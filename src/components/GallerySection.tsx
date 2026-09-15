import React, { useState } from 'react';
import { GalleryItem, HotelSettings } from '../types';
import { X, ChevronLeft, ChevronRight, Eye, Sparkles, Filter } from 'lucide-react';

interface GallerySectionProps {
  gallery: GalleryItem[];
  settings?: HotelSettings;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ gallery, settings }) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    'ALL',
    'Hotel',
    'Rooms',
    'Restaurant',
    'Food',
    'Banquet',
    'Exterior',
    'Interior',
  ];

  const filteredItems = gallery.filter((item) => {
    if (activeCategory === 'ALL') return true;
    return item.category === activeCategory;
  });

  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === 0 ? filteredItems.length - 1 : (prev ?? 0) - 1));
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev === filteredItems.length - 1 ? 0 : (prev ?? 0) + 1));
  };

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-[#faf8f5] border-t border-[#e7e5e4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest uppercase text-[#c49b29] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{settings?.galleryEyebrow || 'Visual Glimpse'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#1c1917] tracking-tight mb-4">
            {settings?.galleryHeading || 'The Udika Gallery'}
          </h2>

          <p className="text-sm sm:text-base text-[#78716c] font-light leading-relaxed">
            {settings?.galleryDescription || 'Experience our refined architectural appointments, tastefully furnished suites, banqueting halls, and aromatic dining scenes.'}
          </p>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setLightboxIndex(null);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase transition-all ${
                  activeCategory === cat
                    ? 'bg-[#1c1917] text-[#faf8f5] shadow-md'
                    : 'bg-[#f5f0eb] text-[#78716c] hover:bg-[#e7e5e4] hover:text-[#1c1917]'
                }`}
              >
                {cat === 'ALL' ? 'All Glimpses' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onClick={() => setLightboxIndex(index)}
              className="group relative h-64 sm:h-72 rounded-xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 bg-[#292524] border border-[#e7e5e4]"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-[#faf8f5]">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37]">
                  {item.category}
                </span>
                <h4 className="text-sm font-serif font-bold text-white mt-0.5">
                  {item.title}
                </h4>
                {item.caption && (
                  <p className="text-xs text-[#d6d3d1] line-clamp-2 mt-1">
                    {item.caption}
                  </p>
                )}
                <div className="mt-2 flex items-center space-x-1 text-[11px] text-[#d4af37]">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Click to expand</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 bg-[#f5f0eb] rounded-xl border border-[#e7e5e4]">
            <p className="text-sm text-[#78716c]">No gallery images under this category yet.</p>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
          {/* Close Button */}
          <button
            onClick={() => setLightboxIndex(null)}
            aria-label="Close Lightbox"
            className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev button */}
          <button
            onClick={handlePrev}
            aria-label="Previous Image"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors hidden sm:block"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Next button */}
          <button
            onClick={handleNext}
            aria-label="Next Image"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors hidden sm:block"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Active Image and Caption */}
          <div className="max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center">
            <div className="relative max-h-[75vh] overflow-hidden rounded-lg shadow-2xl">
              <img
                src={filteredItems[lightboxIndex].imageUrl}
                alt={filteredItems[lightboxIndex].title}
                className="max-h-[75vh] w-auto max-w-full object-contain mx-auto"
              />
            </div>

            <div className="mt-4 text-center text-white px-4">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-semibold">
                {filteredItems[lightboxIndex].category} · {lightboxIndex + 1} of {filteredItems.length}
              </span>
              <h3 className="text-xl font-serif font-bold mt-1">
                {filteredItems[lightboxIndex].title}
              </h3>
              {filteredItems[lightboxIndex].caption && (
                <p className="text-xs sm:text-sm text-[#a8a29e] mt-1 max-w-lg mx-auto">
                  {filteredItems[lightboxIndex].caption}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
