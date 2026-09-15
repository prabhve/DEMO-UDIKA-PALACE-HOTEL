import React, { useState } from 'react';
import { Room, HotelSettings } from '../types';
import { Check, Users, Bed, Eye, Calendar, Sparkles, Wind, Maximize2 } from 'lucide-react';

interface RoomsSectionProps {
  rooms: Room[];
  settings?: HotelSettings;
  phone?: string;
  onSelectRoomDetails?: (room: Room) => void;
  onSelectRoom?: (room: Room) => void;
  onBookRoom: (room: Room) => void;
}

export const RoomsSection: React.FC<RoomsSectionProps> = ({
  rooms,
  settings,
  phone,
  onSelectRoomDetails,
  onSelectRoom,
  onBookRoom,
}) => {
  const handleViewDetails = (room: Room) => {
    if (onSelectRoomDetails) onSelectRoomDetails(room);
    else if (onSelectRoom) onSelectRoom(room);
  };
  const [filter, setFilter] = useState<'ALL' | 'AC' | 'NON_AC'>('ALL');

  const filteredRooms = rooms.filter((room) => {
    if (!room.isActive) return false;
    if (filter === 'AC') return room.ac;
    if (filter === 'NON_AC') return !room.ac;
    return true;
  });

  return (
    <section id="rooms" className="py-20 lg:py-28 bg-[#f5f0eb] border-t border-[#e7e5e4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header and Filter */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest uppercase text-[#c49b29] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{settings?.roomsEyebrow || 'Accommodation & Stays'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#1c1917] tracking-tight mb-4">
            {settings?.roomsHeading || 'Curated Rooms & Suites'}
          </h2>

          <p className="text-sm sm:text-base text-[#78716c] font-light leading-relaxed">
            {settings?.roomsDescription || 'Every room at Hotel Udika Palace is tailored to offer tranquility, ergonomic comfort, and genuine warmth after a full day in Singrauli.'}
          </p>

          {/* AC / Non-AC Filters */}
          <div className="mt-8 inline-flex p-1 bg-[#e7e5e4] rounded-lg border border-[#d6d3d1]">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${
                filter === 'ALL'
                  ? 'bg-[#1c1917] text-[#faf8f5] shadow-sm'
                  : 'text-[#78716c] hover:text-[#1c1917]'
              }`}
            >
              All Rooms
            </button>
            <button
              onClick={() => setFilter('AC')}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${
                filter === 'AC'
                  ? 'bg-[#1c1917] text-[#faf8f5] shadow-sm'
                  : 'text-[#78716c] hover:text-[#1c1917]'
              }`}
            >
              Air-Conditioned
            </button>
            <button
              onClick={() => setFilter('NON_AC')}
              className={`px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${
                filter === 'NON_AC'
                  ? 'bg-[#1c1917] text-[#faf8f5] shadow-sm'
                  : 'text-[#78716c] hover:text-[#1c1917]'
              }`}
            >
              Standard Non-AC
            </button>
          </div>
        </div>

        {/* Room Showcase Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              id={`room-${room.id}`}
              className="bg-[#faf8f5] rounded-xl overflow-hidden border border-[#e7e5e4] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Room Image Container */}
              <div className="relative h-56 sm:h-64 overflow-hidden bg-[#292524]">
                <img
                  src={room.featuredImage}
                  alt={room.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* AC / Non-AC tag */}
                <div className="absolute top-3 left-3 flex items-center space-x-1.5 px-2.5 py-1 bg-[#1c1917]/85 backdrop-blur-sm rounded text-[11px] font-semibold text-[#faf8f5] border border-white/10">
                  <Wind className="w-3 h-3 text-[#d4af37]" />
                  <span>{room.ac ? 'AC Room' : 'Non-AC'}</span>
                </div>

                {/* Featured Badge if applicable */}
                {room.isFeatured && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 bg-[#d4af37] text-[#1c1917] rounded text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    Popular
                  </div>
                )}

                {/* Pricing Overlay if configured */}
                {room.showPrice && room.baseRatePerNight && (
                  <div className="absolute bottom-3 right-3 px-3 py-1 bg-[#1c1917]/90 backdrop-blur-md rounded text-right border border-[#d4af37]/30 text-[#faf8f5]">
                    <span className="text-[10px] text-[#d6d3d1] block leading-none">Starting from</span>
                    <span className="text-base font-bold text-[#d4af37]">₹{room.baseRatePerNight.toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-[#a8a29e] block leading-none">/ night + taxes</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold tracking-widest text-[#c49b29] uppercase">
                      {room.category} Category
                    </span>
                    {room.roomSizeSqFt && (
                      <span className="text-xs text-[#78716c] flex items-center space-x-1">
                        <Maximize2 className="w-3 h-3" />
                        <span>~{room.roomSizeSqFt} sq.ft</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-serif font-bold text-[#1c1917] mb-2 group-hover:text-[#c49b29] transition-colors">
                    {room.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#78716c] line-clamp-2 leading-relaxed mb-4">
                    {room.shortDescription}
                  </p>

                  {/* Bed & Occupancy meta */}
                  <div className="py-3 border-y border-[#e7e5e4] grid grid-cols-2 gap-2 text-xs text-[#57534e] mb-4">
                    <div className="flex items-center space-x-1.5">
                      <Bed className="w-3.5 h-3.5 text-[#c49b29]" />
                      <span className="truncate">{room.bedType}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Users className="w-3.5 h-3.5 text-[#c49b29]" />
                      <span>Up to {room.maxAdults} Adults</span>
                    </div>
                  </div>

                  {/* Amenities highlights */}
                  <div className="space-y-1.5 mb-6">
                    {room.amenities.slice(0, 3).map((amenity, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-[#57534e]">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">{amenity}</span>
                      </div>
                    ))}
                    {room.amenities.length > 3 && (
                      <span className="text-[11px] text-[#c49b29] italic block pl-5">
                        +{room.amenities.length - 3} more amenities
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#e7e5e4]">
                  <button
                    id={`view-details-${room.id}`}
                    onClick={() => handleViewDetails(room)}
                    className="flex items-center justify-center space-x-1 text-xs font-semibold py-2.5 px-2 rounded border border-[#d6d3d1] hover:border-[#1c1917] text-[#1c1917] hover:bg-[#1c1917] hover:text-[#faf8f5] transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>

                  <button
                    id={`book-room-${room.id}`}
                    onClick={() => onBookRoom(room)}
                    className="flex items-center justify-center space-x-1 text-xs font-semibold py-2.5 px-2 rounded bg-[#d4af37] hover:bg-[#c49b29] text-[#1c1917] transition-colors shadow-sm"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book Room</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Informative Note regarding inventory verification */}
        <div className="mt-12 text-center text-xs text-[#78716c] max-w-xl mx-auto">
          Rates and inventory are updated directly through hotel management. For custom corporate group blocks or wedding allocations, contact our reservations desk directly.
        </div>
      </div>
    </section>
  );
};
