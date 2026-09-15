import React from 'react';
import { MapPin, ChevronDown, Sparkles } from 'lucide-react';
import { HotelSettings } from '../types';

interface HeroProps {
  settings: HotelSettings;
  onBookClick?: () => void;
  onExploreClick?: () => void;
  onBookDirect?: () => void;
  onExploreRooms?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  settings,
  onBookClick,
  onExploreClick,
  onBookDirect,
  onExploreRooms,
}) => {
  const handleBook = onBookClick || onBookDirect || (() => {});
  const handleExplore = onExploreClick || onExploreRooms || (() => {});

  const badges = settings.heroBadges && settings.heroBadges.length > 0
    ? settings.heroBadges
    : ['Air Conditioned Comfort', 'Zayka Fine Dining', 'Royal Banquets', 'Central Thana Road'];

  return (
    <section id="hero" className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#1c1917]">
      {/* Background Image with Dark Vignette */}
      <div className="absolute inset-0 z-0">
        <img
          src={settings.heroImageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=85'}
          alt={settings.name}
          className="w-full h-full object-cover object-center scale-105 transform motion-safe:animate-subtle-zoom filter brightness-[0.65]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1917] via-black/40 to-black/70" />
        <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/80" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
        {/* Subtle Location Indicator */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#d4af37]/30 text-[#e7e5e4] text-xs sm:text-sm mb-6 tracking-wider">
          <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{settings.heroLocationTag || 'Waidhan · Singrauli · Madhya Pradesh'}</span>
        </div>

        {/* Cinematic Typography */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif text-[#faf8f5] tracking-wide font-normal uppercase mb-4 leading-tight">
          {settings.name}
        </h1>

        {/* Tagline */}
        <p className="text-xl sm:text-2xl md:text-3xl font-serif italic text-[#d4af37] mb-6 font-light tracking-widest">
          “{settings.tagline}”
        </p>

        {/* Supporting Copy */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[#d6d3d1] font-light leading-relaxed mb-10 px-4">
          {settings.supportingText}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          <button
            id="hero-book-stay-btn"
            onClick={handleBook}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#d4af37] hover:bg-[#c49b29] text-[#1c1917] font-semibold text-sm uppercase tracking-widest rounded transition-all transform hover:-translate-y-0.5 shadow-xl active:translate-y-0"
          >
            {settings.heroCtaBookText || 'Book Your Stay'}
          </button>

          <button
            id="hero-explore-btn"
            onClick={handleExplore}
            className="w-full sm:w-auto px-8 py-3.5 bg-transparent hover:bg-white/10 border border-[#e7e5e4]/40 hover:border-[#d4af37] text-[#faf8f5] font-medium text-sm uppercase tracking-widest rounded transition-all backdrop-blur-sm"
          >
            {settings.heroCtaExploreText || `Explore ${settings.name}`}
          </button>
        </div>

        {/* Micro hospitality amenities highlight */}
        <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-[#a8a29e] text-xs uppercase tracking-wider">
          {badges.map((badge, idx) => (
            <div key={idx} className="flex items-center justify-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
              <span className="truncate">{badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Elegant Scroll Indicator */}
      <div 
        onClick={handleExplore}
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer text-[#a8a29e] hover:text-[#d4af37] transition-colors flex flex-col items-center group hidden sm:flex"
      >
        <span className="text-[10px] uppercase tracking-widest mb-1 group-hover:tracking-widest">Scroll to explore</span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  );
};
