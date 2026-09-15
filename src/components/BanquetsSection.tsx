import React, { useState } from 'react';
import { BanquetHall, EventEnquiry } from '../types';
import { Users, Car, Sparkles, Check, Calendar, MessageSquare, Send, Award } from 'lucide-react';

interface BanquetsSectionProps {
  banquets: BanquetHall[];
  whatsappNumber: string;
  onSubmitEnquiry: (enquiry: Omit<EventEnquiry, 'id' | 'referenceId' | 'createdAt' | 'status'>) => Promise<EventEnquiry>;
}

export const BanquetsSection: React.FC<BanquetsSectionProps> = ({
  banquets,
  whatsappNumber,
  onSubmitEnquiry,
}) => {
  const [selectedHall, setSelectedHall] = useState<string>(banquets[0]?.id || '');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedRef, setGeneratedRef] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    eventType: 'Wedding' as EventEnquiry['eventType'],
    eventDate: '',
    guestCount: '',
    message: '',
  });

  const activeHall = banquets.find((h) => h.id === selectedHall) || banquets[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.eventDate) return;

    setIsSubmitting(true);
    try {
      const created = await onSubmitEnquiry({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || undefined,
        eventType: formData.eventType,
        eventDate: formData.eventDate,
        guestCount: formData.guestCount || '50-100',
        message: formData.message ? `Selected Venue: ${activeHall?.name}. ${formData.message}` : `Selected Venue: ${activeHall?.name}`,
      });
      setGeneratedRef(created.referenceId);
      setFormSubmitted(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppEnquiry = () => {
    const text = encodeURIComponent(
      `Hello Hotel Udika Palace, I would like to inquire about hosting an event.\n\nEvent Type: ${formData.eventType}\nDate: ${formData.eventDate || 'To be finalized'}\nGuest Count: ${formData.guestCount || 'Approximate'}\nPreferred Venue: ${activeHall ? activeHall.name : 'Banquet Hall'}\nName: ${formData.name || 'Guest'}`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <section id="banquets" className="py-20 lg:py-28 bg-[#faf8f5] border-t border-[#e7e5e4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest uppercase text-[#c49b29] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Celebrations & Banqueting</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#1c1917] tracking-tight mb-4">
            Celebrate at Udika Palace
          </h2>

          <p className="text-sm sm:text-base text-[#78716c] font-light leading-relaxed">
            From regal wedding receptions and sangeet celebrations to high-profile corporate mining seminars, our customizable venues transform gatherings into indelible milestones.
          </p>
        </div>

        {/* Hall Selection Tabs */}
        {banquets.length > 1 && (
          <div className="flex justify-center mb-10">
            <div className="inline-flex p-1 bg-[#e7e5e4] rounded-xl border border-[#d6d3d1]">
              {banquets.map((hall) => (
                <button
                  key={hall.id}
                  onClick={() => setSelectedHall(hall.id)}
                  className={`px-5 py-2 text-xs sm:text-sm font-semibold tracking-wide rounded-lg transition-all ${
                    selectedHall === hall.id
                      ? 'bg-[#1c1917] text-[#faf8f5] shadow-md'
                      : 'text-[#78716c] hover:text-[#1c1917]'
                  }`}
                >
                  {hall.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Venue Feature Grid */}
        {activeHall && (
          <div id={`banquet-${activeHall.id}`} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
            {/* Hall Imagery */}
            <div className="lg:col-span-7 space-y-4">
              <div className="h-80 sm:h-96 rounded-2xl overflow-hidden shadow-xl border border-[#e7e5e4]">
                <img
                  src={activeHall.images[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80'}
                  alt={activeHall.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Sub-images thumbnail row */}
              {activeHall.images.length > 1 && (
                <div className="grid grid-cols-3 gap-3">
                  {activeHall.images.slice(1, 4).map((img, idx) => (
                    <div key={idx} className="h-28 rounded-xl overflow-hidden border border-[#e7e5e4]">
                      <img src={img} alt="detail" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Hall Details */}
            <div className="lg:col-span-5 bg-[#f5f0eb] p-6 sm:p-8 rounded-2xl border border-[#e7e5e4] shadow-sm">
              <span className="text-xs font-bold tracking-widest text-[#c49b29] uppercase">
                Venue Overview
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#1c1917] mt-1 mb-2">
                {activeHall.name}
              </h3>
              <p className="text-xs text-[#c49b29] font-medium italic mb-4">
                {activeHall.tagline}
              </p>

              <p className="text-xs sm:text-sm text-[#57534e] leading-relaxed mb-6 font-light">
                {activeHall.description}
              </p>

              {/* Capacity & Highlights */}
              <div className="space-y-3 mb-6 p-4 bg-white rounded-xl border border-[#e7e5e4]">
                {activeHall.seatingCapacity && (
                  <div className="flex items-center space-x-3 text-xs text-[#1c1917]">
                    <Users className="w-4 h-4 text-[#c49b29] shrink-0" />
                    <span className="font-semibold">Seating:</span>
                    <span className="text-[#57534e]">{activeHall.seatingCapacity}</span>
                  </div>
                )}

                {activeHall.floatingCapacity && (
                  <div className="flex items-center space-x-3 text-xs text-[#1c1917]">
                    <Sparkles className="w-4 h-4 text-[#c49b29] shrink-0" />
                    <span className="font-semibold">Floating:</span>
                    <span className="text-[#57534e]">{activeHall.floatingCapacity}</span>
                  </div>
                )}

                {activeHall.parkingCapacity && (
                  <div className="flex items-center space-x-3 text-xs text-[#1c1917]">
                    <Car className="w-4 h-4 text-[#c49b29] shrink-0" />
                    <span className="font-semibold">Parking:</span>
                    <span className="text-[#57534e]">{activeHall.parkingCapacity}</span>
                  </div>
                )}
              </div>

              {/* Hall Features */}
              <div className="space-y-2 mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                  Venue Inclusions
                </h4>
                {activeHall.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-[#57534e]">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Suitable For Tags */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-[#e7e5e4]">
                {activeHall.suitableFor.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-white text-[#78716c] text-[11px] rounded-md border border-[#e7e5e4]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Event Enquiry Form */}
        <div className="bg-[#1c1917] text-[#faf8f5] rounded-2xl p-6 sm:p-10 border border-[#d4af37]/30 shadow-2xl">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-semibold tracking-widest text-[#d4af37] uppercase">
                Reserve Your Date
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif text-[#faf8f5] mt-1 mb-2">
                Plan Your Event with Us
              </h3>
              <p className="text-xs sm:text-sm text-[#a8a29e] font-light">
                Submit an enquiry to speak with our dedicated banqueting manager for customized catering menus, decor arrangements, and special package rates.
              </p>
            </div>

            {formSubmitted ? (
              <div className="text-center py-8 bg-[#292524] rounded-xl border border-emerald-500/40 p-6 space-y-4">
                <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-serif font-bold text-[#faf8f5]">Event Enquiry Received</h4>
                <p className="text-xs sm:text-sm text-[#d6d3d1] max-w-md mx-auto">
                  Thank you! Your reference code is <strong className="text-[#d4af37]">{generatedRef}</strong>. Our events manager will contact you promptly.
                </p>
                <div className="pt-2">
                  <button
                    onClick={handleWhatsAppEnquiry}
                    className="inline-flex items-center space-x-2 bg-[#15803d] hover:bg-[#166534] text-white px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Connect Immediately on WhatsApp</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#a8a29e] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ramesh Chandra"
                      className="w-full bg-[#292524] border border-[#44403c] rounded-lg px-3 py-2.5 text-sm text-[#faf8f5] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#a8a29e] mb-1">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full bg-[#292524] border border-[#44403c] rounded-lg px-3 py-2.5 text-sm text-[#faf8f5] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#a8a29e] mb-1">
                      Event Category
                    </label>
                    <select
                      value={formData.eventType}
                      onChange={(e) => setFormData({ ...formData, eventType: e.target.value as EventEnquiry['eventType'] })}
                      className="w-full bg-[#292524] border border-[#44403c] rounded-lg px-3 py-2.5 text-xs text-[#faf8f5] focus:border-[#d4af37] focus:outline-none"
                    >
                      <option value="Wedding">Wedding & Reception</option>
                      <option value="Family Celebration">Family Celebration / Sangeet</option>
                      <option value="Corporate Gathering">Corporate / Mining Conference</option>
                      <option value="Private Event">Private Banquet</option>
                      <option value="Birthday / Anniversary">Birthday / Anniversary</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#a8a29e] mb-1">
                      Tentative Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.eventDate}
                      onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                      className="w-full bg-[#292524] border border-[#44403c] rounded-lg px-3 py-2.5 text-xs text-[#faf8f5] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#a8a29e] mb-1">
                      Estimated Guests
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 150 - 200"
                      value={formData.guestCount}
                      onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                      className="w-full bg-[#292524] border border-[#44403c] rounded-lg px-3 py-2.5 text-xs text-[#faf8f5] focus:border-[#d4af37] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#a8a29e] mb-1">
                    Special Inquiries & Catering Preferences
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details about food menus, stage requirements, or guest accommodation needs..."
                    className="w-full bg-[#292524] border border-[#44403c] rounded-lg px-3 py-2 text-xs text-[#faf8f5] focus:border-[#d4af37] focus:outline-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    id="submit-event-enquiry-btn"
                    className="flex-1 bg-[#d4af37] hover:bg-[#c49b29] text-[#1c1917] font-semibold text-xs uppercase tracking-wider py-3.5 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-md"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Submitting Enquiry...' : 'Submit Event Enquiry'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppEnquiry}
                    id="whatsapp-event-enquiry-btn"
                    className="flex-1 bg-[#15803d] hover:bg-[#166534] text-white font-semibold text-xs uppercase tracking-wider py-3.5 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-md"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Enquiry on WhatsApp</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
