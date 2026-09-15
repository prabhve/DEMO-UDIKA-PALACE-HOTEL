import React, { useState } from 'react';
import { 
  HotelSettings, Room, BookingRequest, MenuItem, BanquetHall, 
  EventEnquiry, GalleryItem, NearbyPlace, ContactMessage, SpecialOffer 
} from '../types';
import { 
  LayoutDashboard, Calendar, BedDouble, UtensilsCrossed, Award, 
  Image, MapPin, Mail, Tag, Settings, LogOut, Search, Check, 
  X, MessageSquare, Phone, RefreshCw, Plus, Trash2, Edit3, Eye, ShieldCheck,
  Globe, ExternalLink, Menu
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  hotelData: {
    settings: HotelSettings;
    updateSettings: (s: HotelSettings) => Promise<void>;
    rooms: Room[];
    updateRooms: (r: Room[]) => Promise<void>;
    bookings: BookingRequest[];
    updateBookingStatus: (id: string, status: BookingRequest['status'], notes?: string) => Promise<void>;
    menuItems: MenuItem[];
    updateMenu: (m: MenuItem[]) => Promise<void>;
    banquets: BanquetHall[];
    updateBanquets: (b: BanquetHall[]) => Promise<void>;
    eventEnquiries: EventEnquiry[];
    gallery: GalleryItem[];
    updateGallery: (g: GalleryItem[]) => Promise<void>;
    nearbyPlaces: NearbyPlace[];
    updateNearbyPlaces: (p: NearbyPlace[]) => Promise<void>;
    messages: ContactMessage[];
    offers: SpecialOffer[];
    updateOffers: (o: SpecialOffer[]) => Promise<void>;
    isSyncing: boolean;
  };
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  hotelData,
}) => {
  // Simple administrative authentication session simulation
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('udika_admin_auth') === 'true';
  });
  const [adminPin, setAdminPin] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    'DASHBOARD' | 'BOOKINGS' | 'ROOMS' | 'RESTAURANT' | 'BANQUETS' | 'GALLERY' | 'PLACES' | 'MESSAGES' | 'SETTINGS'
  >('DASHBOARD');

  // Mobile navigation drawer toggle
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Booking search & filters
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('ALL');
  const [bookingSearchTerm, setBookingSearchTerm] = useState('');

  // Editing States
  const [editingSettings, setEditingSettings] = useState<HotelSettings>(hotelData.settings);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default master PIN for administrative demo access (configurable in production)
    if (adminPin === '9522' || adminPin === 'admin' || adminPin === 'udika2026') {
      setIsAuthenticated(true);
      sessionStorage.setItem('udika_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid Admin Passcode. (Try PIN: 9522 or admin)');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('udika_admin_auth');
  };

  // KPIs
  const totalBookings = hotelData.bookings.length;
  const pendingBookings = hotelData.bookings.filter(b => b.status === 'Pending').length;
  const confirmedBookings = hotelData.bookings.filter(b => b.status === 'Confirmed').length;
  const totalEvents = hotelData.eventEnquiries.length;
  const unreadMessages = hotelData.messages.filter(m => m.status === 'Unread').length;

  const filteredBookings = hotelData.bookings.filter((b) => {
    const matchesStatus = bookingFilterStatus === 'ALL' || b.status === bookingFilterStatus;
    const matchesSearch = 
      b.fullName.toLowerCase().includes(bookingSearchTerm.toLowerCase()) ||
      b.referenceId.toLowerCase().includes(bookingSearchTerm.toLowerCase()) ||
      b.mobileNumber.includes(bookingSearchTerm);
    return matchesStatus && matchesSearch;
  });

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      await hotelData.updateSettings(editingSettings);
      setSaveSuccessMsg('Property Settings successfully updated and synchronized to live website!');
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      alert('Error updating settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-[#1c1917]/90 backdrop-blur-md overflow-y-auto text-[#1c1917] p-4 sm:p-6">
      {/* Login Screen if not authenticated */}
      {!isAuthenticated ? (
        <div className="m-auto w-full max-w-md bg-[#faf8f5] rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#e7e5e4] my-auto">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full border border-[#d4af37] bg-[#1c1917] text-[#d4af37] font-serif font-bold text-xl flex items-center justify-center mx-auto mb-3">
              U
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#1c1917]">Hotel Udika Palace</h3>
            <p className="text-xs text-[#78716c] uppercase tracking-wider mt-1">Management Portal Login</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#78716c] mb-1 font-semibold">
                Admin Passcode / PIN
              </label>
              <input
                type="password"
                required
                placeholder="Enter access code (e.g. 9522 or admin)"
                value={adminPin}
                onChange={(e) => setAdminPin(e.target.value)}
                className="w-full bg-white border border-[#d6d3d1] rounded-lg px-3 py-2.5 text-sm focus:border-[#c49b29] focus:outline-none"
              />
              {authError && <p className="text-xs text-rose-600 mt-1.5">{authError}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-[#1c1917] hover:bg-[#292524] text-[#faf8f5] py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
            >
              Access Dashboard
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs text-[#78716c] hover:text-[#1c1917] uppercase tracking-wider text-center"
            >
              Back to Public Website
            </button>
          </form>
        </div>
      ) : (
        /* Authenticated Admin Portal */
        <div className="flex w-full h-full bg-[#f5f0eb]">
          {/* Admin Sidebar (Desktop persistent, Mobile off-canvas drawer) */}
          {mobileNavOpen && (
            <div 
              className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
              onClick={() => setMobileNavOpen(false)}
            />
          )}

          <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-[#1c1917] text-[#e7e5e4] flex flex-col justify-between shrink-0 border-r border-[#292524] transition-transform duration-200 ease-in-out ${
            mobileNavOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}>
            <div>
              {/* Brand Header */}
              <div className="p-5 border-b border-[#292524] flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full border border-[#d4af37] bg-[#292524] text-[#d4af37] font-serif font-bold flex items-center justify-center">
                    U
                  </div>
                  <div>
                    <h4 className="text-sm font-serif font-bold text-white tracking-wide uppercase">Udika Palace</h4>
                    <span className="text-[10px] text-[#d4af37] uppercase tracking-wider block">Admin Control Center</span>
                  </div>
                </div>

                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="p-1 rounded text-[#78716c] hover:text-white md:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="p-3 space-y-1">
                <button
                  onClick={() => {
                    setActiveTab('DASHBOARD');
                    setMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
                    activeTab === 'DASHBOARD' ? 'bg-[#d4af37] text-[#1c1917] font-bold shadow-sm' : 'hover:bg-white/5 text-[#a8a29e] hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('BOOKINGS');
                    setMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
                    activeTab === 'BOOKINGS' ? 'bg-[#d4af37] text-[#1c1917] font-bold shadow-sm' : 'hover:bg-white/5 text-[#a8a29e] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4" />
                    <span>Bookings</span>
                  </div>
                  {pendingBookings > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500 text-black font-bold">
                      {pendingBookings}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveTab('ROOMS');
                    setMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
                    activeTab === 'ROOMS' ? 'bg-[#d4af37] text-[#1c1917] font-bold shadow-sm' : 'hover:bg-white/5 text-[#a8a29e] hover:text-white'
                  }`}
                >
                  <BedDouble className="w-4 h-4" />
                  <span>Rooms & Rates</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('RESTAURANT');
                    setMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
                    activeTab === 'RESTAURANT' ? 'bg-[#d4af37] text-[#1c1917] font-bold shadow-sm' : 'hover:bg-white/5 text-[#a8a29e] hover:text-white'
                  }`}
                >
                  <UtensilsCrossed className="w-4 h-4" />
                  <span>Restaurant CMS</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('BANQUETS');
                    setMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
                    activeTab === 'BANQUETS' ? 'bg-[#d4af37] text-[#1c1917] font-bold shadow-sm' : 'hover:bg-white/5 text-[#a8a29e] hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Banquets & Events</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('GALLERY');
                    setMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
                    activeTab === 'GALLERY' ? 'bg-[#d4af37] text-[#1c1917] font-bold shadow-sm' : 'hover:bg-white/5 text-[#a8a29e] hover:text-white'
                  }`}
                >
                  <Image className="w-4 h-4" />
                  <span>Gallery CMS</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('PLACES');
                    setMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
                    activeTab === 'PLACES' ? 'bg-[#d4af37] text-[#1c1917] font-bold shadow-sm' : 'hover:bg-white/5 text-[#a8a29e] hover:text-white'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Nearby Places</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab('MESSAGES');
                    setMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
                    activeTab === 'MESSAGES' ? 'bg-[#d4af37] text-[#1c1917] font-bold shadow-sm' : 'hover:bg-white/5 text-[#a8a29e] hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4" />
                    <span>Inquiries</span>
                  </div>
                  {unreadMessages > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-500 text-white font-bold">
                      {unreadMessages}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => {
                    setActiveTab('SETTINGS');
                    setMobileNavOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-colors ${
                    activeTab === 'SETTINGS' ? 'bg-[#d4af37] text-[#1c1917] font-bold shadow-sm' : 'hover:bg-white/5 text-[#a8a29e] hover:text-white'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Hotel CMS Settings</span>
                </button>
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-[#292524] space-y-2">
              <button
                onClick={onClose}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 bg-[#292524] hover:bg-[#332f2c] rounded-lg text-xs text-[#faf8f5]"
              >
                <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>View Public Site</span>
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center space-x-2 py-2 px-3 text-xs text-[#78716c] hover:text-rose-400"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout Session</span>
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Top Bar */}
            <header className="h-16 bg-white border-b border-[#e7e5e4] px-4 sm:px-6 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2 sm:space-x-3">
                {/* Mobile Menu Toggle Button */}
                <button
                  onClick={() => setMobileNavOpen(!mobileNavOpen)}
                  className="p-1.5 rounded-lg border border-[#d6d3d1] text-[#1c1917] hover:bg-[#faf8f5] md:hidden"
                  aria-label="Toggle admin navigation"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <h2 className="text-sm sm:text-lg font-serif font-bold text-[#1c1917] line-clamp-1">
                  {activeTab === 'DASHBOARD' && 'Operations Overview'}
                  {activeTab === 'BOOKINGS' && 'Reservation Requests'}
                  {activeTab === 'ROOMS' && 'Room Inventory & Pricing'}
                  {activeTab === 'RESTAURANT' && 'Restaurant & Menu CMS'}
                  {activeTab === 'BANQUETS' && 'Banquets & Event Enquiries'}
                  {activeTab === 'GALLERY' && 'Visual Media & Gallery CMS'}
                  {activeTab === 'PLACES' && 'Nearby Heritage & Attractions'}
                  {activeTab === 'MESSAGES' && 'Guest Messages'}
                  {activeTab === 'SETTINGS' && 'Hotel CMS Settings'}
                </h2>
                {hotelData.isSyncing && (
                  <span className="text-[10px] sm:text-[11px] text-[#c49b29] flex items-center space-x-1 shrink-0">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span className="hidden sm:inline">Syncing...</span>
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-2 sm:space-x-3">
                <button
                  onClick={onClose}
                  className="px-2.5 sm:px-3 py-1.5 border border-[#d6d3d1] hover:bg-[#faf8f5] rounded-lg text-xs font-semibold uppercase tracking-wider text-[#1c1917]"
                >
                  Exit
                </button>
              </div>
            </header>

            {/* Mobile Tab Navigation Bar (Horizontally scrollable for fast mobile access) */}
            <div className="flex md:hidden bg-[#1c1917] text-[#faf8f5] px-3 py-2 overflow-x-auto space-x-1 border-b border-[#292524] shrink-0 no-scrollbar">
              {[
                { id: 'DASHBOARD', label: 'Dashboard' },
                { id: 'BOOKINGS', label: `Bookings ${pendingBookings > 0 ? `(${pendingBookings})` : ''}` },
                { id: 'ROOMS', label: 'Rooms' },
                { id: 'RESTAURANT', label: 'Menu' },
                { id: 'BANQUETS', label: 'Banquets' },
                { id: 'GALLERY', label: 'Gallery' },
                { id: 'PLACES', label: 'Places' },
                { id: 'MESSAGES', label: `Inquiries ${unreadMessages > 0 ? `(${unreadMessages})` : ''}` },
                { id: 'SETTINGS', label: 'Settings' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#d4af37] text-[#1c1917] font-bold'
                      : 'text-[#a8a29e] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Viewport Content */}
            <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
              {/* TAB 1: DASHBOARD */}
              {activeTab === 'DASHBOARD' && (
                <div className="space-y-6">
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-xl border border-[#e7e5e4] shadow-sm">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#78716c] block mb-1">
                        Pending Reservations
                      </span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-3xl font-serif font-bold text-amber-600">{pendingBookings}</span>
                        <span className="text-xs text-[#78716c]">Action required</span>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-[#e7e5e4] shadow-sm">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#78716c] block mb-1">
                        Confirmed Bookings
                      </span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-3xl font-serif font-bold text-emerald-600">{confirmedBookings}</span>
                        <span className="text-xs text-[#78716c]">Active stays</span>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-[#e7e5e4] shadow-sm">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#78716c] block mb-1">
                        Event & Banquet Leads
                      </span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-3xl font-serif font-bold text-[#1c1917]">{totalEvents}</span>
                        <span className="text-xs text-[#78716c]">Weddings / Galas</span>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-[#e7e5e4] shadow-sm">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#78716c] block mb-1">
                        Active Room Categories
                      </span>
                      <div className="flex items-baseline justify-between">
                        <span className="text-3xl font-serif font-bold text-[#c49b29]">
                          {hotelData.rooms.filter(r => r.isActive).length}
                        </span>
                        <span className="text-xs text-[#78716c]">Configured in CMS</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Bookings Queue */}
                  <div className="bg-white rounded-xl border border-[#e7e5e4] p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-serif font-bold text-[#1c1917]">Latest Reservation Requests</h3>
                      <button
                        onClick={() => setActiveTab('BOOKINGS')}
                        className="text-xs text-[#c49b29] hover:underline font-semibold"
                      >
                        View all bookings →
                      </button>
                    </div>

                    {hotelData.bookings.length === 0 ? (
                      <div className="text-center py-8 text-[#78716c] text-xs">
                        No bookings received yet. Submit a test booking from the website hero bar.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#f5f0eb] text-[#78716c] uppercase tracking-wider">
                            <tr>
                              <th className="p-3">Ref ID</th>
                              <th className="p-3">Guest Name</th>
                              <th className="p-3">Room Category</th>
                              <th className="p-3">Dates</th>
                              <th className="p-3">Status</th>
                              <th className="p-3">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#e7e5e4]">
                            {hotelData.bookings.slice(0, 5).map((b) => (
                              <tr key={b.id} className="hover:bg-[#faf8f5]">
                                <td className="p-3 font-mono font-bold text-[#1c1917]">{b.referenceId}</td>
                                <td className="p-3 font-semibold">{b.fullName}<br/><span className="text-[10px] text-[#78716c]">{b.mobileNumber}</span></td>
                                <td className="p-3">{b.roomName}</td>
                                <td className="p-3">{b.checkInDate} to {b.checkOutDate}</td>
                                <td className="p-3">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                    b.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {b.status}
                                  </span>
                                </td>
                                <td className="p-3">
                                  <button
                                    onClick={() => hotelData.updateBookingStatus(b.id, 'Confirmed')}
                                    className="text-xs text-emerald-700 font-semibold hover:underline mr-2"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => {
                                      const text = encodeURIComponent(`Hello ${b.fullName}, regarding your booking request ${b.referenceId} at Hotel Udika Palace...`);
                                      window.open(`https://wa.me/${b.mobileNumber.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
                                    }}
                                    className="text-xs text-[#15803d] font-semibold hover:underline"
                                  >
                                    WhatsApp
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: BOOKINGS MANAGEMENT */}
              {activeTab === 'BOOKINGS' && (
                <div className="bg-white rounded-xl border border-[#e7e5e4] p-6 shadow-sm space-y-4">
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e7e5e4]">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="w-4 h-4 text-[#78716c] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search by Guest, Phone, or Ref ID..."
                        value={bookingSearchTerm}
                        onChange={(e) => setBookingSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-[#d6d3d1] rounded-lg focus:outline-none focus:border-[#c49b29]"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#78716c]">Filter:</span>
                      {['ALL', 'Pending', 'Confirmed', 'Cancelled'].map((st) => (
                        <button
                          key={st}
                          onClick={() => setBookingFilterStatus(st)}
                          className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                            bookingFilterStatus === st
                              ? 'bg-[#1c1917] text-white'
                              : 'bg-[#f5f0eb] text-[#78716c] hover:bg-[#e7e5e4]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bookings Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#f5f0eb] text-[#78716c] uppercase tracking-wider">
                        <tr>
                          <th className="p-3">Reference</th>
                          <th className="p-3">Guest Contact</th>
                          <th className="p-3">Stay Details</th>
                          <th className="p-3">Guests & Rooms</th>
                          <th className="p-3">Est. Total</th>
                          <th className="p-3">Current Status</th>
                          <th className="p-3">Action Controls</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#e7e5e4]">
                        {filteredBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-[#faf8f5]">
                            <td className="p-3">
                              <span className="font-mono font-bold text-[#1c1917] block">{b.referenceId}</span>
                              <span className="text-[10px] text-[#78716c]">{new Date(b.createdAt).toLocaleDateString()}</span>
                            </td>
                            <td className="p-3">
                              <strong className="block text-[#1c1917]">{b.fullName}</strong>
                              <span className="text-[11px] text-[#57534e]">{b.mobileNumber}</span>
                              {b.email && <span className="block text-[10px] text-[#78716c]">{b.email}</span>}
                            </td>
                            <td className="p-3">
                              <span className="font-semibold block text-[#1c1917]">{b.roomName}</span>
                              <span className="text-[11px] text-[#78716c]">{b.checkInDate} → {b.checkOutDate}</span>
                            </td>
                            <td className="p-3">
                              <span>{b.numberOfRooms} Room(s)</span>
                              <span className="block text-[10px] text-[#78716c]">{b.adults} Adults, {b.children} Kids</span>
                            </td>
                            <td className="p-3 font-semibold text-[#c49b29]">
                              {b.estimatedTotal ? `₹${b.estimatedTotal.toLocaleString('en-IN')}` : 'Contact for rate'}
                            </td>
                            <td className="p-3">
                              <select
                                value={b.status}
                                onChange={(e) => hotelData.updateBookingStatus(b.id, e.target.value as BookingRequest['status'])}
                                className="bg-white border border-[#d6d3d1] rounded px-2 py-1 text-xs font-semibold"
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Checked In">Checked In</option>
                                <option value="Checked Out">Checked Out</option>
                                <option value="Cancelled">Cancelled</option>
                                <option value="Rejected">Rejected</option>
                              </select>
                            </td>
                            <td className="p-3 space-x-2">
                              <button
                                onClick={() => {
                                  const text = encodeURIComponent(`Hello ${b.fullName}, regarding your booking request ${b.referenceId} at Hotel Udika Palace, Waidhan: We are pleased to connect with you.`);
                                  window.open(`https://wa.me/${b.mobileNumber.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
                                }}
                                className="p-1.5 bg-[#15803d] text-white rounded hover:bg-[#166534]"
                                title="Contact on WhatsApp"
                              >
                                <MessageSquare className="w-3.5 h-3.5" />
                              </button>
                              <a
                                href={`tel:${b.mobileNumber}`}
                                className="p-1.5 bg-[#1c1917] text-white rounded hover:bg-[#292524] inline-block"
                                title="Call Guest"
                              >
                                <Phone className="w-3.5 h-3.5 text-[#d4af37]" />
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {filteredBookings.length === 0 && (
                      <div className="text-center py-12 text-[#78716c]">
                        No bookings match the search or filter criteria.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: ROOMS CMS */}
              {activeTab === 'ROOMS' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[#78716c]">
                      Configure room pricing, dimensions, and descriptions. Changes reflect immediately on public site.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {hotelData.rooms.map((room) => (
                      <div key={room.id} className="bg-white rounded-xl border border-[#e7e5e4] p-5 shadow-sm space-y-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#c49b29]">{room.category}</span>
                            <h4 className="text-lg font-serif font-bold text-[#1c1917]">{room.name}</h4>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${room.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-700'}`}>
                            {room.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <label className="block text-[#78716c] text-[10px] uppercase">Base Rate (₹ / night)</label>
                            <input
                              type="number"
                              value={room.baseRatePerNight || 0}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                const updated = hotelData.rooms.map(r => r.id === room.id ? { ...r, baseRatePerNight: val } : r);
                                hotelData.updateRooms(updated);
                              }}
                              className="w-full border border-[#d6d3d1] rounded px-2.5 py-1.5 font-bold text-[#1c1917]"
                            />
                          </div>

                          <div>
                            <label className="block text-[#78716c] text-[10px] uppercase">Approx Size (sq.ft)</label>
                            <input
                              type="number"
                              value={room.roomSizeSqFt || 0}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                const updated = hotelData.rooms.map(r => r.id === room.id ? { ...r, roomSizeSqFt: val } : r);
                                hotelData.updateRooms(updated);
                              }}
                              className="w-full border border-[#d6d3d1] rounded px-2.5 py-1.5"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[#78716c] text-[10px] uppercase mb-1">Short Description</label>
                          <textarea
                            rows={2}
                            value={room.shortDescription}
                            onChange={(e) => {
                              const updated = hotelData.rooms.map(r => r.id === room.id ? { ...r, shortDescription: e.target.value } : r);
                              hotelData.updateRooms(updated);
                            }}
                            className="w-full border border-[#d6d3d1] rounded px-2.5 py-1.5 text-xs text-[#57534e]"
                          />
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#e7e5e4] text-xs">
                          <label className="inline-flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={room.showPrice}
                              onChange={(e) => {
                                const updated = hotelData.rooms.map(r => r.id === room.id ? { ...r, showPrice: e.target.checked } : r);
                                hotelData.updateRooms(updated);
                              }}
                              className="rounded text-[#c49b29]"
                            />
                            <span>Display Price Publicly</span>
                          </label>

                          <label className="inline-flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={room.isActive}
                              onChange={(e) => {
                                const updated = hotelData.rooms.map(r => r.id === room.id ? { ...r, isActive: e.target.checked } : r);
                                hotelData.updateRooms(updated);
                              }}
                              className="rounded text-emerald-600"
                            />
                            <span>Active in Booking Engine</span>
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: RESTAURANT CMS */}
              {activeTab === 'RESTAURANT' && (
                <div className="bg-white rounded-xl border border-[#e7e5e4] p-6 shadow-sm space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b border-[#e7e5e4]">
                    <div>
                      <h3 className="text-base font-serif font-bold text-[#1c1917]">
                        Restaurant & Culinary Items
                      </h3>
                      <p className="text-xs text-[#78716c]">
                        Manage items, pricing, and chef recommendations for {hotelData.settings.restaurantName}.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hotelData.menuItems.map((item) => (
                      <div key={item.id} className="p-4 rounded-xl border border-[#e7e5e4] bg-[#faf8f5] flex items-start justify-between space-x-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className={`w-2.5 h-2.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                            <h5 className="text-sm font-bold text-[#1c1917]">{item.name}</h5>
                            {item.isChefSpecial && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">
                                Chef Special
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#78716c] line-clamp-2">{item.description}</p>
                          <span className="text-[10px] text-[#a8a29e] block mt-1">{item.category}</span>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-[#1c1917] text-sm">₹{item.price}</span>
                          <div className="mt-2">
                            <button
                              onClick={() => {
                                const updated = hotelData.menuItems.map(m => m.id === item.id ? { ...m, isAvailable: !m.isAvailable } : m);
                                hotelData.updateMenu(updated);
                              }}
                              className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                                item.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {item.isAvailable ? 'Available' : 'Sold Out'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: BANQUETS & EVENTS */}
              {activeTab === 'BANQUETS' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-xl border border-[#e7e5e4] p-6 shadow-sm">
                    <h3 className="text-base font-serif font-bold text-[#1c1917] mb-4">
                      Wedding & Banquet Enquiries Received
                    </h3>

                    {hotelData.eventEnquiries.length === 0 ? (
                      <p className="text-xs text-[#78716c]">No event enquiries logged yet.</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#f5f0eb] text-[#78716c] uppercase tracking-wider">
                            <tr>
                              <th className="p-3">Ref Code</th>
                              <th className="p-3">Contact</th>
                              <th className="p-3">Event Type</th>
                              <th className="p-3">Target Date</th>
                              <th className="p-3">Guests</th>
                              <th className="p-3">Notes</th>
                              <th className="p-3">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#e7e5e4]">
                            {hotelData.eventEnquiries.map((ev) => (
                              <tr key={ev.id}>
                                <td className="p-3 font-mono font-bold text-[#1c1917]">{ev.referenceId}</td>
                                <td className="p-3">
                                  <strong>{ev.name}</strong><br/>
                                  <span className="text-[#57534e]">{ev.phone}</span>
                                </td>
                                <td className="p-3 font-medium text-[#c49b29]">{ev.eventType}</td>
                                <td className="p-3">{ev.eventDate}</td>
                                <td className="p-3">{ev.guestCount}</td>
                                <td className="p-3 max-w-xs truncate text-[#78716c]">{ev.message || '—'}</td>
                                <td className="p-3">
                                  <button
                                    onClick={() => {
                                      const text = encodeURIComponent(`Hello ${ev.name}, regarding your event enquiry ${ev.referenceId} for ${ev.eventType} at Hotel Udika Palace...`);
                                      window.open(`https://wa.me/${ev.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
                                    }}
                                    className="p-1.5 bg-[#15803d] text-white rounded"
                                    title="Connect on WhatsApp"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 6: SETTINGS & WEBSITE CMS */}
              {activeTab === 'SETTINGS' && (
                <div className="bg-white rounded-xl border border-[#e7e5e4] p-6 shadow-sm">
                  <div className="mb-6 pb-4 border-b border-[#e7e5e4]">
                    <h3 className="text-base font-serif font-bold text-[#1c1917]">
                      Master Hotel & CMS Configuration
                    </h3>
                    <p className="text-xs text-[#78716c]">
                      Update core contact details, restaurant branding, WhatsApp numbers, and homepage copy.
                    </p>
                  </div>

                  {saveSuccessMsg && (
                    <div className="p-3 mb-4 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-xs font-semibold">
                      {saveSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#78716c] uppercase tracking-wider mb-1 font-semibold">Hotel Official Name</label>
                        <input
                          type="text"
                          value={editingSettings.name}
                          onChange={(e) => setEditingSettings({ ...editingSettings, name: e.target.value })}
                          className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-sm text-[#1c1917]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#78716c] uppercase tracking-wider mb-1 font-semibold">Restaurant Branding (e.g. Zayka / Jaika)</label>
                        <input
                          type="text"
                          value={editingSettings.restaurantName}
                          onChange={(e) => setEditingSettings({ ...editingSettings, restaurantName: e.target.value })}
                          className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-sm text-[#1c1917]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[#78716c] uppercase tracking-wider mb-1 font-semibold">Public Phone Display</label>
                        <input
                          type="text"
                          value={editingSettings.phoneDisplay}
                          onChange={(e) => setEditingSettings({ ...editingSettings, phoneDisplay: e.target.value, phone: e.target.value.replace(/[^0-9+]/g, '') })}
                          className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-sm text-[#1c1917]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#78716c] uppercase tracking-wider mb-1 font-semibold">WhatsApp Number (with Country Code)</label>
                        <input
                          type="text"
                          value={editingSettings.whatsappNumber}
                          onChange={(e) => setEditingSettings({ ...editingSettings, whatsappNumber: e.target.value, whatsappDisplay: e.target.value })}
                          className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-sm text-[#1c1917]"
                        />
                      </div>

                      <div>
                        <label className="block text-[#78716c] uppercase tracking-wider mb-1 font-semibold">Booking Desk Email</label>
                        <input
                          type="email"
                          value={editingSettings.bookingEmail}
                          onChange={(e) => setEditingSettings({ ...editingSettings, bookingEmail: e.target.value })}
                          className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-sm text-[#1c1917]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[#78716c] uppercase tracking-wider mb-1 font-semibold">Hero Tagline</label>
                      <input
                        type="text"
                        value={editingSettings.tagline}
                        onChange={(e) => setEditingSettings({ ...editingSettings, tagline: e.target.value })}
                        className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-sm text-[#1c1917]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#78716c] uppercase tracking-wider mb-1 font-semibold">Supporting Intro Copy</label>
                      <textarea
                        rows={3}
                        value={editingSettings.supportingText}
                        onChange={(e) => setEditingSettings({ ...editingSettings, supportingText: e.target.value })}
                        className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-sm text-[#1c1917]"
                      />
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        disabled={isSavingSettings}
                        className="bg-[#1c1917] hover:bg-[#292524] text-[#faf8f5] py-3 px-6 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
                      >
                        {isSavingSettings ? 'Synchronizing with Live Database...' : 'Save & Publish Changes'}
                      </button>
                    </div>
                  </form>

                  {/* SEO & Sitemap Engine Management */}
                  <div className="mt-8 pt-6 border-t border-[#e7e5e4]">
                    <div className="flex items-center space-x-2 mb-2">
                      <Globe className="w-4 h-4 text-[#c49b29]" />
                      <h4 className="text-sm font-serif font-bold text-[#1c1917]">
                        Search Engine Optimization & Sitemap XML
                      </h4>
                    </div>
                    <p className="text-xs text-[#78716c] mb-4">
                      A dynamic XML sitemap is generated and indexed for Hotel Udika Palace, encompassing all rooms, culinary menu divisions, and banquet halls.
                    </p>

                    <div className="bg-[#faf8f5] p-4 rounded-xl border border-[#e7e5e4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-[#1c1917] block">
                          Public XML Sitemap Index
                        </span>
                        <span className="text-[11px] text-[#78716c] font-mono">
                          /sitemap.xml · Conformant to Sitemaps.org Protocol
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <a
                          href="/sitemap.xml"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-[#f5f0eb] border border-[#d6d3d1] rounded-lg text-xs font-semibold text-[#1c1917] transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#c49b29]" />
                          <span>Inspect Live Sitemap</span>
                        </a>

                        <a
                          href="/robots.txt"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-white hover:bg-[#f5f0eb] border border-[#d6d3d1] rounded-lg text-xs font-semibold text-[#1c1917] transition-colors"
                        >
                          <span>robots.txt</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7 & 8: Fallback for Gallery, Places, Messages */}
              {(activeTab === 'GALLERY' || activeTab === 'PLACES' || activeTab === 'MESSAGES') && (
                <div className="bg-white rounded-xl border border-[#e7e5e4] p-6 shadow-sm">
                  <h3 className="text-base font-serif font-bold text-[#1c1917] mb-2">
                    {activeTab === 'GALLERY' && 'Gallery Photos Management'}
                    {activeTab === 'PLACES' && 'Nearby Places & Attractions Management'}
                    {activeTab === 'MESSAGES' && 'Guest Messages & Contacts'}
                  </h3>
                  <p className="text-xs text-[#78716c] mb-4">
                    Direct live synchronization active with Firestore database.
                  </p>
                  
                  {activeTab === 'MESSAGES' && (
                    <div className="space-y-3">
                      {hotelData.messages.length === 0 ? (
                        <p className="text-xs text-[#78716c]">No guest inquiries logged yet.</p>
                      ) : (
                        hotelData.messages.map((m) => (
                          <div key={m.id} className="p-3 bg-[#faf8f5] rounded-lg border border-[#e7e5e4]">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-bold text-xs text-[#1c1917]">{m.name} ({m.phone})</h5>
                                <p className="text-[11px] text-[#78716c]">{m.subject}</p>
                              </div>
                              <span className="text-[10px] text-[#a8a29e]">{new Date(m.createdAt).toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-[#57534e] mt-2 bg-white p-2.5 rounded border border-[#e7e5e4]">{m.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {activeTab === 'PLACES' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {hotelData.nearbyPlaces.map((p) => (
                        <div key={p.id} className="p-3 rounded-lg border border-[#e7e5e4] flex space-x-3 items-center">
                          <img src={p.heroImage} alt="thumb" className="w-12 h-12 rounded object-cover" />
                          <div>
                            <h5 className="text-xs font-bold text-[#1c1917]">{p.name}</h5>
                            <span className="text-[11px] text-[#c49b29]">Approx. {p.approxDistanceKm} km · {p.category}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'GALLERY' && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {hotelData.gallery.map((g) => (
                        <div key={g.id} className="rounded-lg overflow-hidden border border-[#e7e5e4]">
                          <img src={g.imageUrl} alt={g.title} className="h-28 w-full object-cover" />
                          <div className="p-2 bg-white text-[11px] truncate font-medium">{g.title}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </main>
          </div>
        </div>
      )}
    </div>
  );
};
