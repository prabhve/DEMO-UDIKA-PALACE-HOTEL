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
import { AdminSettingsCMS } from './admin/AdminSettingsCMS';
import { AdminRoomsCMS } from './admin/AdminRoomsCMS';
import { AdminRestaurantCMS } from './admin/AdminRestaurantCMS';
import { AdminBanquetsCMS } from './admin/AdminBanquetsCMS';
import { AdminGalleryCMS } from './admin/AdminGalleryCMS';
import { AdminPlacesCMS } from './admin/AdminPlacesCMS';

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
    updateEnquiryStatus?: (id: string, status: EventEnquiry['status']) => Promise<void>;
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

  const handleSaveSettings = async (newSettings: HotelSettings) => {
    setIsSavingSettings(true);
    try {
      await hotelData.updateSettings(newSettings);
      setEditingSettings(newSettings);
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
    <div className="fixed inset-0 z-50 flex bg-[#1c1917]/95 backdrop-blur-md overflow-hidden text-[#1c1917]">
      {/* Login Screen if not authenticated */}
      {!isAuthenticated ? (
        <div className="m-auto w-full max-w-md bg-[#faf8f5] rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#e7e5e4] my-auto mx-4 max-h-[90vh] overflow-y-auto">
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
        <div className="flex flex-col md:flex-row w-full h-full bg-[#f5f0eb] overflow-hidden">
          {/* Admin Sidebar (Desktop persistent, Mobile off-canvas drawer) */}
          {mobileNavOpen && (
            <div 
              className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
              onClick={() => setMobileNavOpen(false)}
            />
          )}

          <aside className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-[#1c1917] text-[#e7e5e4] flex flex-col justify-between shrink-0 border-r border-[#292524] transition-transform duration-200 ease-in-out h-full ${
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
            <main className="flex-1 p-3 sm:p-6 overflow-y-auto pb-28 md:pb-8">
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
                <AdminRoomsCMS
                  rooms={hotelData.rooms}
                  onUpdateRooms={hotelData.updateRooms}
                />
              )}

              {/* TAB 4: RESTAURANT CMS */}
              {activeTab === 'RESTAURANT' && (
                <AdminRestaurantCMS
                  menuItems={hotelData.menuItems}
                  onUpdateMenu={hotelData.updateMenu}
                />
              )}

              {/* TAB 5: BANQUETS & EVENTS CMS */}
              {activeTab === 'BANQUETS' && (
                <AdminBanquetsCMS
                  banquets={hotelData.banquets}
                  enquiries={hotelData.eventEnquiries}
                  onUpdateBanquets={hotelData.updateBanquets}
                  onUpdateEnquiryStatus={hotelData.updateEnquiryStatus || (async () => {})}
                  whatsappNumber={hotelData.settings.whatsappNumber}
                />
              )}

              {/* TAB 6: MASTER SETTINGS & WEBSITE CMS */}
              {activeTab === 'SETTINGS' && (
                <AdminSettingsCMS
                  settings={hotelData.settings}
                  onSave={handleSaveSettings}
                  isSaving={isSavingSettings}
                  saveSuccessMsg={saveSuccessMsg || null}
                />
              )}

              {/* TAB 7: VISUAL MEDIA & GALLERY CMS */}
              {activeTab === 'GALLERY' && (
                <AdminGalleryCMS
                  gallery={hotelData.gallery}
                  onUpdateGallery={hotelData.updateGallery}
                />
              )}

              {/* TAB 8: NEARBY PLACES & ATTRACTIONS CMS */}
              {activeTab === 'PLACES' && (
                <AdminPlacesCMS
                  places={hotelData.nearbyPlaces}
                  onUpdatePlaces={hotelData.updateNearbyPlaces}
                />
              )}

              {/* TAB 9: GUEST MESSAGES & INQUIRIES */}
              {activeTab === 'MESSAGES' && (
                <div className="bg-white rounded-xl border border-[#e7e5e4] p-4 sm:p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#e7e5e4] gap-2">
                    <div>
                      <h3 className="text-base font-serif font-bold text-[#1c1917]">
                        Guest Inquiries & Direct Messages
                      </h3>
                      <p className="text-xs text-[#78716c]">
                        Messages submitted by guests from the public website contact section.
                      </p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-800 rounded-full self-start sm:self-auto border border-amber-200">
                      {hotelData.messages.length} Total Messages
                    </span>
                  </div>

                  {hotelData.messages.length === 0 ? (
                    <div className="text-center py-12 text-[#78716c]">
                      <Mail className="w-8 h-8 mx-auto mb-2 text-[#a8a29e]" />
                      <p className="text-sm">No guest inquiries received yet.</p>
                      <p className="text-xs text-[#a8a29e] mt-1">New contact form submissions will appear here instantly.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {hotelData.messages.map((m) => (
                        <div key={m.id} className="p-4 bg-[#faf8f5] rounded-xl border border-[#e7e5e4] space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <h5 className="font-serif font-bold text-sm text-[#1c1917]">{m.name}</h5>
                              <div className="flex items-center space-x-3 text-xs text-[#78716c] mt-0.5">
                                <span>{m.phone}</span>
                                {m.email && <span>· {m.email}</span>}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] text-[#a8a29e] mr-2">
                                {new Date(m.createdAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              <a
                                href={`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${m.name}, thank you for contacting Hotel Udika Palace regarding: "${m.subject}".`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 bg-[#15803d] hover:bg-[#166534] text-white rounded-lg inline-flex items-center justify-center transition-colors"
                                title="Reply on WhatsApp"
                              >
                                <MessageSquare className="w-4 h-4" />
                              </a>
                              <a
                                href={`tel:${m.phone}`}
                                className="p-1.5 bg-[#1c1917] hover:bg-[#292524] text-white rounded-lg inline-flex items-center justify-center transition-colors"
                                title="Call Guest"
                              >
                                <Phone className="w-4 h-4 text-[#d4af37]" />
                              </a>
                            </div>
                          </div>

                          <div className="bg-white p-3 rounded-lg border border-[#e7e5e4]">
                            <span className="text-[10px] uppercase font-bold text-[#c49b29] block mb-1">
                              Subject: {m.subject}
                            </span>
                            <p className="text-xs text-[#44403c] leading-relaxed whitespace-pre-line">{m.message}</p>
                          </div>
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
