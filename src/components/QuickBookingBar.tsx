import React, { useState } from 'react';
import { Calendar, Users, Home, Search, MessageSquare } from 'lucide-react';
import { Room, HotelSettings } from '../types';

interface QuickBookingBarProps {
  rooms: Room[];
  settings?: HotelSettings;
  onOpenBookingModal?: (initialData: {
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    roomId?: string;
  }) => void;
  onSearch?: (searchParams: {
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    roomType?: string;
  }) => void;
}

export const QuickBookingBar: React.FC<QuickBookingBarProps> = ({
  rooms,
  settings,
  onOpenBookingModal,
  onSearch,
}) => {
  // Today's and tomorrow's default dates
  const today = new Date().toISOString().split('T')[0];
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(today);
  const [checkOut, setCheckOut] = useState(tomorrow);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      checkIn,
      checkOut,
      adults,
      children,
      roomId: selectedRoomId || undefined,
      roomType: selectedRoomId || undefined,
    };
    if (onOpenBookingModal) {
      onOpenBookingModal(data);
    } else if (onSearch) {
      onSearch(data);
    }
  };

  const handleWhatsAppInquiry = () => {
    const chosenRoom = rooms.find(r => r.id === selectedRoomId);
    const roomName = chosenRoom ? chosenRoom.name : 'Any Available Room';
    const hotelName = settings?.name || 'Hotel Udika Palace';
    const waNumber = settings?.whatsappNumber || '919522001777';
    const message = `Hello ${hotelName}, I would like to inquire about room availability.\n\nDates: ${checkIn} to ${checkOut}\nGuests: ${adults} Adults, ${children} Children\nPreferred Room: ${roomName}`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-14 mb-16">
      <div className="bg-[#292524] rounded-xl shadow-2xl border border-[#d4af37]/30 p-4 sm:p-6 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          {/* Check-in */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#a8a29e] mb-1.5 flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Check-in</span>
            </label>
            <input
              type="date"
              id="quick-check-in"
              min={today}
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-[#1c1917] border border-[#44403c] rounded px-3 py-2.5 text-sm text-[#faf8f5] focus:border-[#d4af37] focus:outline-none"
              required
            />
          </div>

          {/* Check-out */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#a8a29e] mb-1.5 flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Check-out</span>
            </label>
            <input
              type="date"
              id="quick-check-out"
              min={checkIn || today}
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-[#1c1917] border border-[#44403c] rounded px-3 py-2.5 text-sm text-[#faf8f5] focus:border-[#d4af37] focus:outline-none"
              required
            />
          </div>

          {/* Guests: Adults & Children */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#a8a29e] mb-1.5 flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Guests</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                id="quick-adults"
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full bg-[#1c1917] border border-[#44403c] rounded px-2.5 py-2.5 text-xs text-[#faf8f5] focus:border-[#d4af37] focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Adult' : 'Adults'}
                  </option>
                ))}
              </select>

              <select
                id="quick-children"
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="w-full bg-[#1c1917] border border-[#44403c] rounded px-2.5 py-2.5 text-xs text-[#faf8f5] focus:border-[#d4af37] focus:outline-none"
              >
                {[0, 1, 2, 3].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Child' : 'Children'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Room Type */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#a8a29e] mb-1.5 flex items-center space-x-1.5">
              <Home className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Room Category</span>
            </label>
            <select
              id="quick-room-select"
              value={selectedRoomId}
              onChange={(e) => setSelectedRoomId(e.target.value)}
              className="w-full bg-[#1c1917] border border-[#44403c] rounded px-3 py-2.5 text-xs text-[#faf8f5] focus:border-[#d4af37] focus:outline-none"
            >
              <option value="">All Room Categories</option>
              {rooms.filter(r => r.isActive).map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} {room.ac ? '(AC)' : '(Non-AC)'}
                </option>
              ))}
            </select>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2">
            <button
              type="submit"
              id="quick-check-availability-btn"
              className="flex-1 bg-[#d4af37] hover:bg-[#c49b29] text-[#1c1917] font-semibold text-xs uppercase tracking-wider py-3 px-3 rounded transition-colors shadow-md flex items-center justify-center space-x-1.5"
            >
              <Search className="w-4 h-4" />
              <span>Check Rates</span>
            </button>

            <button
              type="button"
              id="quick-whatsapp-inquiry-btn"
              onClick={handleWhatsAppInquiry}
              title="Quick enquiry on WhatsApp"
              className="p-3 bg-[#15803d] hover:bg-[#166534] text-white rounded transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="mt-3 flex flex-wrap items-center justify-between text-[11px] text-[#a8a29e] pt-3 border-t border-[#44403c]/60">
          <span className="flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            <span>Direct booking requests received instantly at front desk</span>
          </span>
          <span className="mt-1 sm:mt-0 text-[#d4af37]/80">No advance payment required for inquiry</span>
        </div>
      </div>
    </div>
  );
};
