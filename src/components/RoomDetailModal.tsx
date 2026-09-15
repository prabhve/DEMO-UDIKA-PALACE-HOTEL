import React, { useState } from 'react';
import { Room } from '../types';
import { X, Check, Users, Bed, Maximize2, Shield, Calendar, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';

interface RoomDetailModalProps {
  room: Room | null;
  onClose: () => void;
  onRequestBooking?: (room: Room) => void;
  onBookThisRoom?: (room: Room) => void;
  whatsappNumber: string;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  room,
  onClose,
  onRequestBooking,
  onBookThisRoom,
  whatsappNumber,
}) => {
  if (!room) return null;

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  const images = room.images && room.images.length > 0 ? room.images : [room.featuredImage];

  const handlePrevImage = () => {
    setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleWhatsAppBooking = () => {
    const text = encodeURIComponent(
      `Hello Hotel Udika Palace, I am interested in booking the "${room.name}" (${room.category}). Please share current availability and booking procedure.`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#faf8f5] rounded-2xl overflow-hidden shadow-2xl border border-[#e7e5e4] my-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          id="close-room-modal-btn"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-[#faf8f5] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-6 bg-[#1c1917] relative flex flex-col justify-between">
            <div className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden">
              <img
                src={images[activeImageIdx]}
                alt={`${room.name} - View ${activeImageIdx + 1}`}
                className="w-full h-full object-cover transition-all duration-300"
              />

              {/* Navigation Chevrons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    aria-label="Previous image"
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    aria-label="Next image"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              {/* AC Indicator */}
              <div className="absolute top-4 left-4 px-2.5 py-1 bg-[#1c1917]/80 backdrop-blur-md rounded text-xs text-[#d4af37] font-semibold border border-[#d4af37]/30">
                {room.ac ? 'Climate Controlled (AC)' : 'Standard Non-AC'}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="p-3 bg-[#1c1917] flex items-center space-x-2 overflow-x-auto border-t border-[#292524]">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`relative w-16 h-12 rounded overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIdx === idx ? 'border-[#d4af37] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Detailed Specifications */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between max-h-[85vh] overflow-y-auto">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold tracking-widest text-[#c49b29] uppercase">
                  {room.category} Category
                </span>
                {room.showPrice && room.baseRatePerNight && (
                  <div className="text-right">
                    <span className="text-2xl font-serif font-bold text-[#1c1917]">
                      ₹{room.baseRatePerNight.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[#78716c] block">per night + tax</span>
                  </div>
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1c1917] mb-3">
                {room.name}
              </h3>

              <p className="text-sm text-[#57534e] leading-relaxed mb-6 font-light">
                {room.detailedDescription || room.shortDescription}
              </p>

              {/* Room Meta Badges */}
              <div className="grid grid-cols-3 gap-3 p-3.5 bg-[#f5f0eb] rounded-xl border border-[#e7e5e4] mb-6 text-center">
                <div className="flex flex-col items-center justify-center">
                  <Bed className="w-4 h-4 text-[#c49b29] mb-1" />
                  <span className="text-[10px] uppercase text-[#78716c]">Bedding</span>
                  <span className="text-xs font-semibold text-[#1c1917] line-clamp-1">{room.bedType}</span>
                </div>
                <div className="flex flex-col items-center justify-center border-x border-[#e7e5e4]">
                  <Users className="w-4 h-4 text-[#c49b29] mb-1" />
                  <span className="text-[10px] uppercase text-[#78716c]">Occupancy</span>
                  <span className="text-xs font-semibold text-[#1c1917]">{room.maxAdults} Adults, {room.maxChildren} Child</span>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <Maximize2 className="w-4 h-4 text-[#c49b29] mb-1" />
                  <span className="text-[10px] uppercase text-[#78716c]">Room Size</span>
                  <span className="text-xs font-semibold text-[#1c1917]">{room.roomSizeSqFt ? `~${room.roomSizeSqFt} sq.ft` : 'Spacious'}</span>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c1917] mb-3">
                  Room Amenities
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs text-[#57534e]">
                  {room.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Policies & Notes */}
              {room.policies && room.policies.length > 0 && (
                <div className="mb-6 pt-4 border-t border-[#e7e5e4]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c1917] mb-2 flex items-center space-x-1.5">
                    <Shield className="w-3.5 h-3.5 text-[#c49b29]" />
                    <span>Important Policies</span>
                  </h4>
                  <ul className="text-xs text-[#78716c] space-y-1 list-disc list-inside">
                    {room.policies.map((pol, idx) => (
                      <li key={idx}>{pol}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* CTAs */}
            <div className="pt-4 border-t border-[#e7e5e4] flex flex-col sm:flex-row gap-2.5">
              <button
                id="modal-request-booking-btn"
                onClick={() => {
                  onClose();
                  if (onBookThisRoom) {
                    onBookThisRoom(room);
                  } else if (onRequestBooking) {
                    onRequestBooking(room);
                  }
                }}
                className="flex-1 bg-[#1c1917] hover:bg-[#292524] text-[#faf8f5] py-3 px-4 rounded-lg font-semibold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md transition-colors"
              >
                <Calendar className="w-4 h-4 text-[#d4af37]" />
                <span>Request Booking</span>
              </button>

              <button
                id="modal-whatsapp-booking-btn"
                onClick={handleWhatsAppBooking}
                className="flex-1 bg-[#15803d] hover:bg-[#166534] text-white py-3 px-4 rounded-lg font-semibold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Book via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
