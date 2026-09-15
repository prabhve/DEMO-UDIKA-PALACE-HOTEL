import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, Menu, X, Calendar } from 'lucide-react';
import { HotelSettings } from '../types';

interface NavbarProps {
  settings: HotelSettings;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  activeSection,
  onNavigate,
  onOpenBooking,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', id: 'hero' },
    { label: 'Rooms', id: 'rooms' },
    { label: 'Restaurant', id: 'restaurant' },
    { label: 'Banquets', id: 'banquets' },
    { label: 'Gallery', id: 'gallery' },
    { label: 'Explore Waidhan', id: 'explore' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    onNavigate(id);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`Hello ${settings.name}, I would like to inquire about room availability.`);
    window.open(`https://wa.me/${settings.whatsappNumber}?text=${text}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:${settings.phone}`, '_self');
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#1c1917]/95 backdrop-blur-md shadow-lg border-b border-[#d4af37]/20 py-3'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <div 
              onClick={() => handleNavClick('hero')}
              className="cursor-pointer group flex items-center space-x-3 text-left"
              id="brand-logo-button"
            >
              <div className="w-10 h-10 rounded-full border border-[#d4af37]/60 flex items-center justify-center bg-[#292524] text-[#d4af37] font-serif font-bold text-xl shadow-inner group-hover:border-[#d4af37] transition-colors">
                U
              </div>
              <div>
                <span className="block text-lg sm:text-xl font-serif tracking-wider font-semibold text-[#faf8f5] group-hover:text-[#d4af37] transition-colors uppercase">
                  {settings.name}
                </span>
                <span className="block text-[10px] tracking-widest text-[#a8a29e] uppercase font-sans">
                  Waidhan · Singrauli
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <button
                    key={link.id}
                    id={`nav-link-${link.id}`}
                    onClick={() => handleNavClick(link.id)}
                    className={`px-3 py-2 text-sm tracking-wide transition-colors font-medium rounded-md ${
                      isActive
                        ? 'text-[#d4af37] font-semibold'
                        : 'text-[#e7e5e4] hover:text-[#d4af37] hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Desktop Quick Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              <button
                id="header-call-btn"
                onClick={handleCall}
                title={`Call ${settings.phoneDisplay}`}
                className="flex items-center space-x-2 text-xs uppercase tracking-wider text-[#e7e5e4] hover:text-[#d4af37] px-3 py-2 border border-[#78716c]/40 hover:border-[#d4af37]/60 rounded transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Call Now</span>
              </button>

              <button
                id="header-whatsapp-btn"
                onClick={handleWhatsApp}
                className="flex items-center space-x-2 text-xs uppercase tracking-wider text-white bg-[#15803d] hover:bg-[#166534] px-3 py-2 rounded transition-colors shadow-sm"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                id="header-book-now-btn"
                onClick={onOpenBooking}
                className="bg-[#d4af37] hover:bg-[#c49b29] text-[#1c1917] text-xs uppercase tracking-widest font-semibold px-4 py-2.5 rounded transition-all shadow-md active:scale-95"
              >
                Book Your Stay
              </button>
            </div>

            {/* Mobile Actions and Hamburger */}
            <div className="flex lg:hidden items-center space-x-2">
              <button
                onClick={onOpenBooking}
                id="mobile-header-book-btn"
                className="bg-[#d4af37] text-[#1c1917] text-xs font-semibold px-3 py-1.5 rounded tracking-wide shadow-sm"
              >
                Book Now
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                id="mobile-menu-toggle-btn"
                aria-label="Toggle navigation menu"
                className="p-2 rounded text-[#faf8f5] hover:text-[#d4af37] focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Panel */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#1c1917] border-b border-[#44403c] px-4 pt-3 pb-6 mt-2 shadow-2xl transition-all">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`block w-full text-left px-3 py-2.5 text-base font-medium rounded-md ${
                    activeSection === link.id
                      ? 'bg-[#292524] text-[#d4af37]'
                      : 'text-[#e7e5e4] hover:bg-[#292524] hover:text-[#d4af37]'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-[#292524] grid grid-cols-2 gap-2">
              <button
                onClick={handleCall}
                className="flex items-center justify-center space-x-2 py-2.5 px-3 border border-[#78716c]/50 rounded text-[#e7e5e4] text-xs uppercase tracking-wider"
              >
                <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Call Now</span>
              </button>
              <button
                onClick={handleWhatsApp}
                className="flex items-center justify-center space-x-2 py-2.5 px-3 bg-[#15803d] text-white rounded text-xs uppercase tracking-wider"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Sticky Bottom Bar for Mobile Devices */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#1c1917]/95 backdrop-blur-md border-t border-[#d4af37]/30 px-4 py-2.5 flex items-center justify-between lg:hidden shadow-2xl">
        <button
          onClick={handleCall}
          className="flex-1 flex items-center justify-center space-x-1.5 text-xs text-[#faf8f5] py-2 border-r border-[#44403c]"
        >
          <Phone className="w-4 h-4 text-[#d4af37]" />
          <span>Call</span>
        </button>

        <button
          onClick={handleWhatsApp}
          className="flex-1 flex items-center justify-center space-x-1.5 text-xs text-[#4ade80] py-2 border-r border-[#44403c]"
        >
          <MessageSquare className="w-4 h-4 text-[#4ade80]" />
          <span>WhatsApp</span>
        </button>

        <button
          onClick={onOpenBooking}
          className="flex-1.5 flex items-center justify-center space-x-1.5 text-xs font-semibold bg-[#d4af37] text-[#1c1917] py-2.5 px-3 rounded-md shadow-sm ml-2"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Stay</span>
        </button>
      </div>
    </>
  );
};
