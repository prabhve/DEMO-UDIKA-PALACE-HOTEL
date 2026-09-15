import React, { useState, useEffect } from 'react';
import { Room, HotelSettings, BookingRequest } from '../types';
import { X, Calendar, Users, Home, MessageSquare, Send, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  settings: HotelSettings;
  prefillRoomId?: string;
  initialDates?: { checkIn: string; checkOut: string; adults: number; children: number };
  onSaveBooking: (booking: Omit<BookingRequest, 'id' | 'referenceId' | 'createdAt' | 'status'>) => Promise<BookingRequest>;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  rooms,
  settings,
  prefillRoomId,
  initialDates,
  onSaveBooking,
}) => {
  if (!isOpen) return null;

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [checkInDate, setCheckInDate] = useState(initialDates?.checkIn || today);
  const [checkOutDate, setCheckOutDate] = useState(initialDates?.checkOut || tomorrow);
  const [adults, setAdults] = useState(initialDates?.adults || 2);
  const [children, setChildren] = useState(initialDates?.children || 0);
  const [roomId, setRoomId] = useState(prefillRoomId || (rooms[0]?.id ?? ''));
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingRequest | null>(null);

  // Sync state when prefillRoomId or initialDates updates
  useEffect(() => {
    if (prefillRoomId) {
      setRoomId(prefillRoomId);
    }
    if (initialDates?.checkIn) {
      setCheckInDate(initialDates.checkIn);
    }
    if (initialDates?.checkOut) {
      setCheckOutDate(initialDates.checkOut);
    }
    if (initialDates?.adults !== undefined) {
      setAdults(initialDates.adults);
    }
    if (initialDates?.children !== undefined) {
      setChildren(initialDates.children);
    }
  }, [prefillRoomId, initialDates]);

  const selectedRoom = rooms.find((r) => r.id === roomId);

  // Validate dates
  const isValidDateRange = new Date(checkOutDate) > new Date(checkInDate);

  // Calculate estimated total nights & amount
  const nights = Math.max(1, Math.round((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24)));
  const estimatedAmount = selectedRoom?.baseRatePerNight ? selectedRoom.baseRatePerNight * nights * numberOfRooms : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !mobileNumber || !checkInDate || !checkOutDate) return;
    if (!isValidDateRange) {
      alert('Check-out date must be strictly after check-in date.');
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await onSaveBooking({
        fullName,
        mobileNumber,
        email: email || undefined,
        checkInDate,
        checkOutDate,
        adults,
        children,
        roomId: selectedRoom?.id,
        roomName: selectedRoom?.name || 'Standard Room',
        roomCategory: selectedRoom?.category || 'Standard',
        numberOfRooms,
        specialRequests: specialRequests || undefined,
        estimatedTotal: estimatedAmount,
        source: 'website_direct',
      });

      setConfirmedBooking(created);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error(err);
      alert('An error occurred submitting your booking request. Please try WhatsApp booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppShare = () => {
    const ref = confirmedBooking?.referenceId || 'New Enquiry';
    const room = selectedRoom?.name || 'Selected Room';
    const message = `Hello ${settings.name},\nI would like to confirm my booking request.\n\n*Reference ID:* ${ref}\n*Guest Name:* ${fullName}\n*Check-in:* ${checkInDate}\n*Check-out:* ${checkOutDate}\n*Room Category:* ${room}\n*No. of Rooms:* ${numberOfRooms}\n*Guests:* ${adults} Adults, ${children} Children\n*Contact:* ${mobileNumber}\n\nPlease verify availability and guide with confirmation.`;
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Booking Enquiry: ${confirmedBooking?.referenceId || fullName} - Hotel Udika Palace`);
    const body = encodeURIComponent(
      `Dear Hotel Udika Palace Reservations Desk,\n\nI have submitted a booking request via your website.\n\nBooking Reference: ${confirmedBooking?.referenceId || 'Pending'}\nGuest Name: ${fullName}\nPhone: ${mobileNumber}\nCheck-in: ${checkInDate}\nCheck-out: ${checkOutDate}\nRoom: ${selectedRoom?.name}\nGuests: ${adults} Adults, ${children} Children\nSpecial Requests: ${specialRequests || 'None'}\n\nPlease confirm availability.`
    );
    window.open(`mailto:${settings.bookingEmail}?subject=${subject}&body=${body}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#faf8f5] rounded-2xl overflow-hidden shadow-2xl border border-[#e7e5e4] my-auto">
        {/* Header Bar */}
        <div className="bg-[#1c1917] text-[#faf8f5] px-6 py-4 flex items-center justify-between border-b border-[#d4af37]/30">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4af37]">
              Hotel Udika Palace · Reservations
            </span>
            <h3 className="text-xl font-serif font-bold text-white">
              {confirmedBooking ? 'Booking Request Submitted' : 'Book Your Stay'}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-full hover:bg-white/10 text-[#a8a29e] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Confirmation State */}
        {confirmedBooking ? (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="p-6 bg-[#f5f0eb] rounded-2xl border border-[#e7e5e4] text-center space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-2xl font-serif font-bold text-[#1c1917]">
                Request Registered: {confirmedBooking.referenceId}
              </h4>
              <p className="text-xs sm:text-sm text-[#57534e] max-w-md mx-auto">
                Your direct booking request has been securely logged into our hotel reservation system with status <strong className="text-amber-700 font-semibold">Pending Confirmation</strong>.
              </p>
            </div>

            {/* Summary details */}
            <div className="p-4 bg-white rounded-xl border border-[#e7e5e4] space-y-2 text-xs text-[#1c1917]">
              <div className="flex justify-between py-1 border-b border-[#f5f0eb]">
                <span className="text-[#78716c]">Guest Name:</span>
                <strong className="font-semibold">{confirmedBooking.fullName}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f5f0eb]">
                <span className="text-[#78716c]">Dates:</span>
                <strong>{confirmedBooking.checkInDate} to {confirmedBooking.checkOutDate} ({nights} {nights === 1 ? 'night' : 'nights'})</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f5f0eb]">
                <span className="text-[#78716c]">Room Category:</span>
                <strong>{confirmedBooking.roomName} ({confirmedBooking.numberOfRooms} Room)</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-[#f5f0eb]">
                <span className="text-[#78716c]">Guests:</span>
                <span>{confirmedBooking.adults} Adults, {confirmedBooking.children} Children</span>
              </div>
              {confirmedBooking.estimatedTotal && (
                <div className="flex justify-between py-1 pt-2 font-bold text-sm text-[#c49b29]">
                  <span>Estimated Tariff:</span>
                  <span>₹{confirmedBooking.estimatedTotal.toLocaleString('en-IN')} + applicable taxes</span>
                </div>
              )}
            </div>

            {/* Expedited Action Buttons */}
            <div className="space-y-3">
              <span className="block text-xs font-semibold text-[#78716c] uppercase tracking-wider text-center">
                For Instant Confirmation
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleWhatsAppShare}
                  className="bg-[#15803d] hover:bg-[#166534] text-white py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send to WhatsApp Desk</span>
                </button>

                <button
                  onClick={handleEmailShare}
                  className="bg-[#1c1917] hover:bg-[#292524] text-white py-3 px-4 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors shadow-md"
                >
                  <Mail className="w-4 h-4 text-[#d4af37]" />
                  <span>Email to Hotel</span>
                </button>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={onClose}
                className="text-xs font-semibold text-[#78716c] hover:text-[#1c1917] underline uppercase tracking-wider"
              >
                Close Window & Return to Website
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="p-3 bg-[#f5f0eb] rounded-xl border border-[#e7e5e4] flex items-center space-x-3 text-xs text-[#57534e]">
              <ShieldCheck className="w-5 h-5 text-[#c49b29] shrink-0" />
              <span>Direct hotel booking. No booking charges or platform surcharges.</span>
            </div>

            {/* Guest details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#78716c] mb-1 font-semibold">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Singh"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white border border-[#d6d3d1] rounded-lg px-3 py-2.5 text-sm text-[#1c1917] focus:border-[#c49b29] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#78716c] mb-1 font-semibold">
                  Contact Mobile *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98260 12345"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full bg-white border border-[#d6d3d1] rounded-lg px-3 py-2.5 text-sm text-[#1c1917] focus:border-[#c49b29] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#78716c] mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="for booking confirmation voucher"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-[#d6d3d1] rounded-lg px-3 py-2.5 text-sm text-[#1c1917] focus:border-[#c49b29] focus:outline-none"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#78716c] mb-1 font-semibold flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-[#c49b29]" />
                  <span>Check-In Date *</span>
                </label>
                <input
                  type="date"
                  required
                  min={today}
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full bg-white border border-[#d6d3d1] rounded-lg px-3 py-2.5 text-sm text-[#1c1917] focus:border-[#c49b29] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#78716c] mb-1 font-semibold flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-[#c49b29]" />
                  <span>Check-Out Date *</span>
                </label>
                <input
                  type="date"
                  required
                  min={checkInDate || today}
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full bg-white border border-[#d6d3d1] rounded-lg px-3 py-2.5 text-sm text-[#1c1917] focus:border-[#c49b29] focus:outline-none"
                />
              </div>
            </div>

            {/* Room selection & Count */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#78716c] mb-1 font-semibold flex items-center space-x-1">
                  <Home className="w-3.5 h-3.5 text-[#c49b29]" />
                  <span>Room Preference</span>
                </label>
                <select
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full bg-white border border-[#d6d3d1] rounded-lg px-3 py-2.5 text-xs text-[#1c1917] focus:border-[#c49b29] focus:outline-none"
                >
                  {rooms.filter(r => r.isActive).map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name} {room.ac ? '(AC)' : '(Non-AC)'} {room.baseRatePerNight ? `· ₹${room.baseRatePerNight}/night` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#78716c] mb-1 font-semibold">
                  Number of Rooms
                </label>
                <select
                  value={numberOfRooms}
                  onChange={(e) => setNumberOfRooms(Number(e.target.value))}
                  className="w-full bg-white border border-[#d6d3d1] rounded-lg px-3 py-2.5 text-xs text-[#1c1917] focus:border-[#c49b29] focus:outline-none"
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Room' : 'Rooms'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Guests */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#78716c] mb-1 font-semibold flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5 text-[#c49b29]" />
                  <span>Adults (12+ yrs)</span>
                </label>
                <select
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="w-full bg-white border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917] focus:border-[#c49b29] focus:outline-none"
                >
                  {[1, 2, 3, 4, 6, 8, 10].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Adult' : 'Adults'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#78716c] mb-1 font-semibold">
                  Children (under 12)
                </label>
                <select
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                  className="w-full bg-white border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917] focus:border-[#c49b29] focus:outline-none"
                >
                  {[0, 1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? 'Child' : 'Children'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#78716c] mb-1">
                Special Requests
              </label>
              <textarea
                rows={2}
                placeholder="Early check-in timing, airport/station transfer inquiry, food preference..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full bg-white border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917] focus:border-[#c49b29] focus:outline-none"
              />
            </div>

            {/* Estimated rate summary if applicable */}
            {estimatedAmount && (
              <div className="p-3 bg-[#f5f0eb] rounded-xl border border-[#e7e5e4] flex items-center justify-between text-xs">
                <span className="text-[#78716c]">Estimated Stay Total ({nights} nights · {numberOfRooms} room):</span>
                <span className="font-bold text-[#1c1917] text-sm">
                  ₹{estimatedAmount.toLocaleString('en-IN')} <span className="text-[10px] text-[#78716c] font-normal">+ taxes</span>
                </span>
              </div>
            )}

            {/* Submit CTA */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={isSubmitting}
                id="submit-booking-request-btn"
                className="w-full bg-[#d4af37] hover:bg-[#c49b29] text-[#1c1917] py-3.5 px-6 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting Request...' : 'Submit Booking Request'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
