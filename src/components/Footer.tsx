import React from 'react';
import { HotelSettings } from '../types';
import { Phone, Mail, MapPin, MessageSquare, Shield, Lock, Heart } from 'lucide-react';

interface FooterProps {
  settings: HotelSettings;
  onNavigate: (sectionId: string) => void;
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  onOpenBooking,
  onOpenAdmin,
}) => {
  const currentYear = new Date().getFullYear();

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${settings.whatsappNumber}`, '_blank');
  };

  return (
    <footer className="bg-[#1c1917] text-[#e7e5e4] pt-16 pb-24 lg:pb-12 border-t border-[#44403c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#292524]">
          {/* Column 1: Brand / Hotel */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full border border-[#d4af37] flex items-center justify-center bg-[#292524] text-[#d4af37] font-serif font-bold text-lg">
                U
              </div>
              <span className="text-xl font-serif font-bold text-[#faf8f5] tracking-wider uppercase">
                {settings.name}
              </span>
            </div>
            
            <p className="text-xs text-[#a8a29e] leading-relaxed max-w-sm">
              {settings.supportingText} Providing refined accommodations, curated North Indian dining at {settings.restaurantName}, and landmark celebration venues in Waidhan, Singrauli.
            </p>

            <div className="pt-2 text-xs text-[#d6d3d1] space-y-1">
              <p className="flex items-center space-x-2">
                <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                <span>{settings.address}, {settings.city}, {settings.state} {settings.pincode}</span>
              </p>
              <p className="flex items-center space-x-2">
                <Phone className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                <span>{settings.phoneDisplay}</span>
              </p>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-4">
              Property Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('hero')} className="hover:text-[#d4af37] transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('rooms')} className="hover:text-[#d4af37] transition-colors">
                  Rooms & Suites
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('restaurant')} className="hover:text-[#d4af37] transition-colors">
                  {settings.restaurantName}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('banquets')} className="hover:text-[#d4af37] transition-colors">
                  Banquets & Events
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-[#d4af37] transition-colors">
                  Gallery Showcase
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-[#d4af37] transition-colors">
                  Explore Waidhan
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-[#d4af37] transition-colors">
                  Contact Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Guest Services */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-4">
              Guest Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={onOpenBooking} className="hover:text-[#d4af37] transition-colors font-semibold text-white">
                  Book a Stay
                </button>
              </li>
              <li>
                <button onClick={onOpenBooking} className="hover:text-[#d4af37] transition-colors">
                  Direct Tariff Inquiry
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('banquets')} className="hover:text-[#d4af37] transition-colors">
                  Wedding & Banquet Booking
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('restaurant')} className="hover:text-[#d4af37] transition-colors">
                  Dining & Room Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('explore')} className="hover:text-[#d4af37] transition-colors">
                  Sightseeing & Maps
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Information & Policies */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#d4af37] mb-4">
              Guest Policies
            </h4>
            <ul className="space-y-2 text-xs text-[#a8a29e]">
              <li className="flex items-center space-x-1.5">
                <Shield className="w-3 h-3 text-[#d4af37]" />
                <span>Check-in: {settings.checkInTime}</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Shield className="w-3 h-3 text-[#d4af37]" />
                <span>Check-out: {settings.checkOutTime}</span>
              </li>
              <li>Valid Government ID proof required</li>
              <li>Couple & family friendly</li>
              <li>CCTV & 24/7 guarded security</li>
              <li className="pt-2">
                <button onClick={handleWhatsApp} className="inline-flex items-center space-x-1 text-emerald-400 hover:underline">
                  <MessageSquare className="w-3 h-3" />
                  <span>WhatsApp Concierge</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with subtle, discreet Admin Login link as requested */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-[#78716c] gap-4 text-center md:text-left">
          <p className="order-1 md:order-1">
            © {currentYear} {settings.name}, Waidhan, Singrauli. All rights reserved.
          </p>

          {/* Attribution: Designed with love by VYUVIK LABS */}
          <div className="order-2 md:order-2 flex items-center justify-center space-x-1.5 text-xs text-[#a8a29e] py-1">
            <span>Designed with love</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline-block animate-pulse" />
            <span>by</span>
            <span className="font-bold tracking-wider text-[#faf8f5] hover:text-[#d4af37] transition-colors">
              VYUVIK LABS
            </span>
          </div>
          
          <div className="order-3 md:order-3 flex items-center justify-center space-x-5">
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#78716c] hover:text-[#d4af37] transition-colors py-1"
            >
              XML Sitemap
            </a>
            
            {/* Subtle, discreet Admin Login link in footer as required by specification */}
            <button
              id="footer-admin-login-link"
              onClick={onOpenAdmin}
              className="text-[#78716c] hover:text-[#faf8f5] bg-[#292524] md:bg-transparent px-3 py-1.5 md:p-0 rounded-md border border-[#44403c] md:border-0 transition-colors flex items-center space-x-1.5 text-xs md:text-[11px] font-medium"
              title="Hotel Management Portal"
            >
              <Lock className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
