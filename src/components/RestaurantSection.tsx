import React, { useState } from 'react';
import { MenuItem, HotelSettings } from '../types';
import { Utensils, Sparkles, Flame, Clock, Coffee, ShieldCheck } from 'lucide-react';

interface RestaurantSectionProps {
  restaurantName: string;
  menuItems: MenuItem[];
  settings?: HotelSettings;
  onBookDiningTable?: () => void;
}

export const RestaurantSection: React.FC<RestaurantSectionProps> = ({
  restaurantName,
  menuItems,
  settings,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [vegOnly, setVegOnly] = useState<boolean>(false);

  const categories = [
    'ALL',
    'Soups & Starters',
    'Main Course',
    'Biryani & Rice',
    'Chinese & Tandoor',
    'Breads',
    'Desserts & Beverages',
  ];

  const filteredMenu = menuItems.filter((item) => {
    if (!item.isAvailable) return false;
    if (vegOnly && !item.isVeg) return false;
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    return true;
  });

  const chefSpecials = menuItems.filter((item) => item.isChefSpecial && item.isAvailable);

  const breakfastTime = settings?.restaurantTimings?.breakfast || '07:30 - 10:30 AM';
  const lunchTime = settings?.restaurantTimings?.lunch || '12:30 - 03:30 PM';
  const dinnerTime = settings?.restaurantTimings?.dinner || '07:30 - 11:00 PM';
  const img1 = settings?.restaurantImage1Url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80';
  const img2 = settings?.restaurantImage2Url || 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80';

  return (
    <section id="restaurant" className="py-20 lg:py-28 bg-[#1c1917] text-[#faf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest uppercase text-[#d4af37]">
              <Utensils className="w-3.5 h-3.5" />
              <span>{settings?.restaurantEyebrow || 'Culinary Excellence'}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-serif tracking-tight leading-tight">
              {settings?.restaurantHeading || (
                <>Dine at <span className="text-[#d4af37] italic">{restaurantName}</span></>
              )}
            </h2>

            <p className="text-sm sm:text-base text-[#d6d3d1] font-light leading-relaxed">
              {settings?.restaurantDescription || 'Serving a rich repertoire of aromatic North Indian gravies, slow-cooked clay oven tandoor delicacies, and crisp wok-tossed Indo-Chinese dishes. We take pride in freshly ground spices, pure clarified butter (desi ghee), and uncompromised culinary hygiene.'}
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#44403c] text-center">
              <div className="p-3 bg-[#292524] rounded-lg border border-[#44403c]">
                <Coffee className="w-4 h-4 text-[#d4af37] mx-auto mb-1" />
                <span className="text-[10px] uppercase text-[#a8a29e] block">Breakfast</span>
                <span className="text-xs font-semibold">{breakfastTime}</span>
              </div>
              <div className="p-3 bg-[#292524] rounded-lg border border-[#44403c]">
                <Clock className="w-4 h-4 text-[#d4af37] mx-auto mb-1" />
                <span className="text-[10px] uppercase text-[#a8a29e] block">Lunch</span>
                <span className="text-xs font-semibold">{lunchTime}</span>
              </div>
              <div className="p-3 bg-[#292524] rounded-lg border border-[#44403c]">
                <Sparkles className="w-4 h-4 text-[#d4af37] mx-auto mb-1" />
                <span className="text-[10px] uppercase text-[#a8a29e] block">Dinner</span>
                <span className="text-xs font-semibold">{dinnerTime}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs text-[#a8a29e]">
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span>{settings?.restaurantRoomServiceNotice || 'In-room dining service available 24/7 for resident hotel guests.'}</span>
            </div>
          </div>

          {/* Right Image Composition */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="rounded-xl overflow-hidden shadow-xl h-64 sm:h-80 border border-white/10">
              <img
                src={img1}
                alt={`${restaurantName} Dish`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="rounded-xl overflow-hidden shadow-xl h-64 sm:h-80 mt-8 border border-white/10">
              <img
                src={img2}
                alt={`${restaurantName} Specialty`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>

        {/* Chef's Curated Selection Highlights */}
        {chefSpecials.length > 0 && (
          <div className="mb-14 p-6 sm:p-8 bg-[#292524] rounded-2xl border border-[#d4af37]/30">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#d4af37] font-semibold flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Signature Repertoire</span>
                </span>
                <h3 className="text-2xl font-serif font-bold text-[#faf8f5]">Chef’s Handcrafted Specialities</h3>
              </div>
              <span className="hidden sm:block text-xs text-[#a8a29e] italic">Prepared with traditional clay tandoors & dum pots</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {chefSpecials.slice(0, 3).map((item) => (
                <div key={item.id} className="bg-[#1c1917] p-4 rounded-xl border border-[#44403c] flex flex-col justify-between group">
                  <div>
                    {item.imageUrl && (
                      <div className="h-40 rounded-lg overflow-hidden mb-3">
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      </div>
                    )}
                    <div className="flex items-center justify-between mb-1">
                      <span className="flex items-center space-x-1.5">
                        <span className={`w-2.5 h-2.5 rounded-full border ${item.isVeg ? 'border-emerald-500 bg-emerald-500' : 'border-red-500 bg-red-500'}`} />
                        <h4 className="text-sm font-semibold text-[#faf8f5] group-hover:text-[#d4af37] transition-colors">{item.name}</h4>
                      </span>
                      <span className="text-sm font-bold text-[#d4af37]">₹{item.price}</span>
                    </div>
                    <p className="text-xs text-[#a8a29e] line-clamp-2 leading-relaxed mb-3">{item.description}</p>
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-medium">Speciality of {restaurantName}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CMS-Driven Interactive Menu Section */}
        <div className="border-t border-[#44403c] pt-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#faf8f5]">A La Carte Dining Menu</h3>
              <p className="text-xs sm:text-sm text-[#a8a29e]">Explore authentic culinary creations managed fresh by our kitchen</p>
            </div>

            {/* Veg toggle */}
            <div className="flex items-center space-x-2">
              <label className="cursor-pointer inline-flex items-center space-x-2 bg-[#292524] px-3.5 py-1.5 rounded-lg border border-[#44403c] text-xs">
                <input
                  type="checkbox"
                  checked={vegOnly}
                  onChange={(e) => setVegOnly(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-0 w-3.5 h-3.5"
                />
                <span className="text-emerald-400 font-medium">Vegetarian Only</span>
              </label>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all uppercase ${
                  selectedCategory === cat
                    ? 'bg-[#d4af37] text-[#1c1917] shadow-md'
                    : 'bg-[#292524] text-[#d6d3d1] hover:text-[#faf8f5] hover:bg-[#332f2c]'
                }`}
              >
                {cat === 'ALL' ? 'All Dishes' : cat}
              </button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                className="bg-[#292524]/60 hover:bg-[#292524] border border-[#44403c]/60 hover:border-[#d4af37]/40 p-4 rounded-xl transition-colors flex items-start justify-between space-x-4"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      title={item.isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
                      className={`w-2.5 h-2.5 rounded-full inline-block ${
                        item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}
                    />
                    <h4 className="text-sm sm:text-base font-semibold text-[#faf8f5]">
                      {item.name}
                    </h4>
                    {item.spicyLevel && item.spicyLevel !== 'Mild' && (
                      <span className="flex items-center text-[10px] text-amber-400">
                        <Flame className="w-3 h-3 ml-1" />
                        <span className="hidden sm:inline">{item.spicyLevel}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#a8a29e] line-clamp-2 leading-relaxed mb-2">
                    {item.description}
                  </p>
                  <span className="text-[10px] uppercase tracking-wider text-[#78716c]">
                    {item.cuisine} · {item.category}
                  </span>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-base font-bold text-[#d4af37]">
                    ₹{item.price}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredMenu.length === 0 && (
            <div className="text-center py-12 bg-[#292524]/40 rounded-xl border border-[#44403c]">
              <p className="text-sm text-[#a8a29e]">No dishes available matching this selection.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
