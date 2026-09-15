import React, { useState } from 'react';
import { useHotelData } from './lib/hotelContext';
import { Room } from './types';

// Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { QuickBookingBar } from './components/QuickBookingBar';
import { Introduction } from './components/Introduction';
import { RoomsSection } from './components/RoomsSection';
import { RoomDetailModal } from './components/RoomDetailModal';
import { RestaurantSection } from './components/RestaurantSection';
import { BanquetsSection } from './components/BanquetsSection';
import { GallerySection } from './components/GallerySection';
import { ExploreMap } from './components/ExploreMap';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  const hotelData = useHotelData();
  const {
    settings,
    rooms,
    menuItems,
    banquets,
    gallery,
    nearbyPlaces,
    addBooking,
    addEventEnquiry,
    addContactMessage,
  } = hotelData;

  // Modals & Active State
  const [selectedRoomForDetail, setSelectedRoomForDetail] = useState<Room | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingPrefillRoomId, setBookingPrefillRoomId] = useState<string | undefined>(undefined);
  const [bookingInitialDates, setBookingInitialDates] = useState<{
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
  }>({
    checkIn: new Date().toISOString().split('T')[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    adults: 2,
    children: 0,
  });

  // Admin Dashboard Modal
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Smooth scroll helper
  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open booking modal with prefilled room
  const handleOpenBookingForRoom = (room: Room) => {
    setBookingPrefillRoomId(room.id);
    setIsBookingModalOpen(true);
  };

  // Quick booking search trigger
  const handleSearchStay = (searchParams: {
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
    roomType?: string;
  }) => {
    setBookingInitialDates({
      checkIn: searchParams.checkIn,
      checkOut: searchParams.checkOut,
      adults: searchParams.adults,
      children: searchParams.children,
    });
    setBookingPrefillRoomId(searchParams.roomType);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#1c1917] font-sans antialiased selection:bg-[#d4af37] selection:text-black">
      {/* Top Navigation */}
      <Navbar
        settings={settings}
        onNavigate={handleNavigate}
        onOpenBooking={() => {
          setBookingPrefillRoomId(undefined);
          setIsBookingModalOpen(true);
        }}
      />

      {/* Main Content Sections */}
      <main>
        {/* 1. Hero Showcase */}
        <Hero
          settings={settings}
          onExploreRooms={() => handleNavigate('rooms')}
          onBookDirect={() => {
            setBookingPrefillRoomId(undefined);
            setIsBookingModalOpen(true);
          }}
        />

        {/* 2. Direct Booking Query Bar */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-10 sm:-mt-14 relative z-30">
          <QuickBookingBar
            rooms={rooms}
            settings={settings}
            onSearch={handleSearchStay}
            onOpenBookingModal={(data) => {
              setBookingInitialDates({
                checkIn: data.checkIn,
                checkOut: data.checkOut,
                adults: data.adults,
                children: data.children,
              });
              setBookingPrefillRoomId(data.roomId);
              setIsBookingModalOpen(true);
            }}
          />
        </div>

        {/* 3. Introduction & Heritage Story */}
        <Introduction settings={settings} />

        {/* 4. Rooms & Suites Grid */}
        <RoomsSection
          rooms={rooms}
          phone={settings.phone}
          onSelectRoom={(room) => setSelectedRoomForDetail(room)}
          onBookRoom={handleOpenBookingForRoom}
        />

        {/* 5. Restaurant Section */}
        <RestaurantSection
          restaurantName={settings.restaurantName}
          menuItems={menuItems}
        />

        {/* 6. Banquets & Celebrations */}
        <BanquetsSection
          banquets={banquets}
          whatsappNumber={settings.whatsappNumber}
          onSubmitEnquiry={addEventEnquiry}
        />

        {/* 7. Visual Gallery */}
        <GallerySection gallery={gallery} />

        {/* 8. 3D Heritage Map & Nearby Explorer */}
        <ExploreMap
          settings={settings}
          places={nearbyPlaces}
        />

        {/* 9. Contact Desk & Verification */}
        <ContactSection
          settings={settings}
          onSubmitMessage={addContactMessage}
        />
      </main>

      {/* Footer with Discreet Admin Entry */}
      <Footer
        settings={settings}
        onNavigate={handleNavigate}
        onOpenBooking={() => setIsBookingModalOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Room Detail Modal */}
      {selectedRoomForDetail && (
        <RoomDetailModal
          room={selectedRoomForDetail}
          onClose={() => setSelectedRoomForDetail(null)}
          onBookThisRoom={() => {
            const r = selectedRoomForDetail;
            setSelectedRoomForDetail(null);
            handleOpenBookingForRoom(r);
          }}
          whatsappNumber={settings.whatsappNumber}
        />
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        rooms={rooms}
        settings={settings}
        prefillRoomId={bookingPrefillRoomId}
        initialDates={bookingInitialDates}
        onSaveBooking={addBooking}
      />

      {/* Administrative Portal Modal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        hotelData={hotelData}
      />
    </div>
  );
}
