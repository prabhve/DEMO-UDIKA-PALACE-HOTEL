import React from 'react';
import { ShieldCheck, Utensils, Award, Clock, MapPin, Sparkles } from 'lucide-react';
import { HotelSettings } from '../types';

interface IntroductionProps {
  settings: HotelSettings;
  onDiscoverRooms?: () => void;
}

export const Introduction: React.FC<IntroductionProps> = ({
  settings,
  onDiscoverRooms = () => {
    const el = document.getElementById('rooms');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  },
}) => {
  const pillars = settings.introPillars && settings.introPillars.length > 0 ? settings.introPillars : [
    {
      title: '24/7 Front Desk',
      description: 'Attentive staff ready to accommodate seamless check-ins and late arrivals.',
    },
    {
      title: settings.restaurantName || 'Zayka Restaurant',
      description: 'Wholesome North Indian delicacies, clay-oven tandoor, and quick room dining.',
    },
    {
      title: 'Grand Celebration Halls',
      description: 'Customizable venues for wedding receptions, sangeets, and corporate summits.',
    },
    {
      title: 'Heart of Waidhan',
      description: 'Close proximity to Singrauli Collectorate, bus depot, and retail high streets.',
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-[#faf8f5] text-[#1c1917]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Visual Image Side with editorial framing */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#e7e5e4]">
              <img
                src={settings.introImageUrl || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'}
                alt={`${settings.name} Hospitality`}
                className="w-full h-[420px] sm:h-[500px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Floating Verified Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#1c1917]/90 backdrop-blur-md p-4 rounded-xl border border-[#d4af37]/40 text-[#faf8f5]">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#d4af37]/20 rounded-lg text-[#d4af37]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold tracking-wide">
                      {settings.introBadgeTitle || 'Prime Location on Thana Road'}
                    </h4>
                    <p className="text-xs text-[#d6d3d1]">
                      {settings.introBadgeSubtitle || 'Seamless connectivity to Waidhan administrative center and NTPC/NCL zones.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Geometric Accent Border */}
            <div className="hidden sm:block absolute -top-4 -left-4 w-28 h-28 border-t-2 border-l-2 border-[#d4af37] rounded-tl-xl -z-10" />
            <div className="hidden sm:block absolute -bottom-4 -right-4 w-28 h-28 border-b-2 border-r-2 border-[#d4af37] rounded-br-xl -z-10" />
          </div>

          {/* Editorial Text Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest uppercase text-[#c49b29]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{settings.introEyebrow || 'Authentic Indian Hospitality'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#1c1917] tracking-tight leading-tight">
              {settings.introHeading || 'A Comfortable Stay in Waidhan'}
            </h2>

            <p className="text-base sm:text-lg text-[#57534e] font-light leading-relaxed">
              {settings.introParagraph1 || (
                <>
                  Situated conveniently along Thana Road, <strong className="font-semibold text-[#1c1917]">{settings.name}</strong> stands as a premier sanctuary for business executives, delegates, and families journeying to Singrauli’s renowned energy belt.
                </>
              )}
            </p>

            <p className="text-sm sm:text-base text-[#78716c] leading-relaxed">
              {settings.introParagraph2 || 'Whether you are arriving for high-level meetings, local ceremonies, or leisurely travels, our property pairs attentive, time-honored Indian hospitality with modern room conveniences, flavorsome multi-cuisine dining, and spacious banquet venues.'}
            </p>

            {/* Key Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#e7e5e4]">
              {pillars.map((pillar, idx) => (
                <div key={idx} className="flex items-start space-x-3">
                  {idx === 0 && <Clock className="w-5 h-5 text-[#c49b29] shrink-0 mt-0.5" />}
                  {idx === 1 && <Utensils className="w-5 h-5 text-[#c49b29] shrink-0 mt-0.5" />}
                  {idx === 2 && <Award className="w-5 h-5 text-[#c49b29] shrink-0 mt-0.5" />}
                  {idx >= 3 && <MapPin className="w-5 h-5 text-[#c49b29] shrink-0 mt-0.5" />}
                  <div>
                    <h4 className="text-sm font-semibold text-[#1c1917]">{pillar.title}</h4>
                    <p className="text-xs text-[#78716c]">{pillar.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button
                id="intro-discover-rooms-btn"
                onClick={onDiscoverRooms}
                className="inline-flex items-center space-x-2 px-8 py-3.5 bg-[#1c1917] hover:bg-[#292524] text-[#faf8f5] font-semibold text-xs uppercase tracking-widest rounded-md transition-all shadow-md active:scale-95"
              >
                <span>Discover Our Rooms</span>
                <span className="text-[#d4af37]">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
