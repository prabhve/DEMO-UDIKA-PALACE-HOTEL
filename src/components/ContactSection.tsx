import React, { useState } from 'react';
import { HotelSettings, ContactMessage } from '../types';
import { MapPin, Phone, Mail, MessageSquare, Send, CheckCircle2, Clock } from 'lucide-react';

interface ContactSectionProps {
  settings: HotelSettings;
  onSubmitMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => Promise<ContactMessage>;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  onSubmitMessage,
}) => {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.message) return;

    setLoading(true);
    try {
      await onSubmitMessage({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        subject: form.subject || 'General Hotel Inquiry',
        message: form.message,
      });
      setSubmitted(true);
      setForm({ name: '', phone: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hello ${settings.name}, I am contacting you via your website.`);
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${text}`, '_blank');
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-[#faf8f5] border-t border-[#e7e5e4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details & Location Card */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <span className="text-xs font-semibold tracking-widest text-[#c49b29] uppercase">
                Find Us & Connect
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-[#1c1917] tracking-tight mt-1 mb-4">
                Hospitality Concierge Desk
              </h2>
              <p className="text-sm text-[#78716c] font-light leading-relaxed">
                Whether you require custom corporate billing, banquet walkthroughs, or immediate room assistance, our reception desk in Waidhan is at your service 24 hours a day.
              </p>
            </div>

            {/* Core Verified Identifiers */}
            <div className="space-y-4">
              <div className="p-4 bg-[#f5f0eb] rounded-xl border border-[#e7e5e4] flex items-start space-x-3.5">
                <MapPin className="w-5 h-5 text-[#c49b29] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                    Property Location
                  </h4>
                  <p className="text-sm font-medium text-[#1c1917] mt-0.5">{settings.name}</p>
                  <p className="text-xs text-[#57534e]">{settings.address}, {settings.city}</p>
                  <p className="text-xs text-[#57534e]">{settings.state} {settings.pincode}, {settings.country}</p>
                </div>
              </div>

              <div className="p-4 bg-[#f5f0eb] rounded-xl border border-[#e7e5e4] flex items-start space-x-3.5">
                <Phone className="w-5 h-5 text-[#c49b29] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                    Public Direct Phone
                  </h4>
                  <a
                    href={`tel:${settings.phone}`}
                    className="text-sm font-semibold text-[#1c1917] hover:text-[#c49b29] block mt-0.5"
                  >
                    {settings.phoneDisplay}
                  </a>
                  <span className="text-xs text-[#78716c]">Available 24 hours for reservations & queries</span>
                </div>
              </div>

              <div className="p-4 bg-[#f5f0eb] rounded-xl border border-[#e7e5e4] flex items-start space-x-3.5">
                <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                    WhatsApp Booking Desk
                  </h4>
                  <button
                    onClick={handleWhatsApp}
                    className="text-sm font-semibold text-emerald-700 hover:text-emerald-800 block mt-0.5 text-left"
                  >
                    {settings.whatsappDisplay} (Chat Now)
                  </button>
                  <span className="text-xs text-[#78716c]">Fastest channel for room quotes and photo requests</span>
                </div>
              </div>

              <div className="p-4 bg-[#f5f0eb] rounded-xl border border-[#e7e5e4] flex items-start space-x-3.5">
                <Mail className="w-5 h-5 text-[#c49b29] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                    Official Correspondence
                  </h4>
                  <p className="text-sm font-medium text-[#1c1917] mt-0.5">{settings.email}</p>
                  <p className="text-xs text-[#78716c]">For vendor tie-ups and group reservations</p>
                </div>
              </div>

              <div className="p-4 bg-[#f5f0eb] rounded-xl border border-[#e7e5e4] flex items-start space-x-3.5">
                <Clock className="w-5 h-5 text-[#c49b29] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                    Operating Hours
                  </h4>
                  <p className="text-xs text-[#57534e] mt-0.5">Check-in: {settings.checkInTime} · Check-out: {settings.checkOutTime}</p>
                  <p className="text-xs text-[#57534e]">Front Desk: 24/7 All Days</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Message Form */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 rounded-2xl border border-[#e7e5e4] shadow-lg">
            <div className="mb-8">
              <span className="text-xs font-semibold tracking-widest text-[#c49b29] uppercase">
                Send a Message
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#1c1917] mt-1 mb-2">
                We Welcome Your Inquiries
              </h3>
              <p className="text-xs sm:text-sm text-[#78716c]">
                Our management team monitors incoming messages continuously and will get back to you promptly.
              </p>
            </div>

            {submitted ? (
              <div className="text-center py-10 bg-[#f5f0eb] rounded-xl border border-emerald-500/30 p-6 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-xl font-serif font-bold text-[#1c1917]">Message Delivered</h4>
                <p className="text-xs sm:text-sm text-[#57534e] max-w-md mx-auto">
                  Thank you for reaching out to Hotel Udika Palace. A member of our hospitality team will contact you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#1c1917] border border-[#d6d3d1] rounded-md hover:bg-white"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#78716c] mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anand Verma"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-[#faf8f5] border border-[#d6d3d1] rounded-lg px-3.5 py-2.5 text-sm text-[#1c1917] focus:border-[#c49b29] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#78716c] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 00000"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-[#faf8f5] border border-[#d6d3d1] rounded-lg px-3.5 py-2.5 text-sm text-[#1c1917] focus:border-[#c49b29] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#78716c] mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-[#faf8f5] border border-[#d6d3d1] rounded-lg px-3.5 py-2.5 text-sm text-[#1c1917] focus:border-[#c49b29] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#78716c] mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Corporate Rates / Group Stay"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full bg-[#faf8f5] border border-[#d6d3d1] rounded-lg px-3.5 py-2.5 text-sm text-[#1c1917] focus:border-[#c49b29] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#78716c] mb-1">
                    Message Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us how we can assist your stay, dining, or event requirements..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-[#faf8f5] border border-[#d6d3d1] rounded-lg px-3.5 py-2 text-sm text-[#1c1917] focus:border-[#c49b29] focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    id="submit-contact-form-btn"
                    className="w-full bg-[#1c1917] hover:bg-[#292524] text-[#faf8f5] py-3 px-6 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors shadow-md active:scale-95"
                  >
                    <Send className="w-4 h-4 text-[#d4af37]" />
                    <span>{loading ? 'Transmitting...' : 'Send Message to Hotel'}</span>
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
