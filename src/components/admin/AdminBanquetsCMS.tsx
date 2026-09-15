import React, { useState } from 'react';
import { BanquetHall, EventEnquiry } from '../../types';
import { 
  Plus, Edit2, Trash2, Users, Car, Sparkles, 
  MessageSquare, Image as ImageIcon, Calendar, 
  CheckCircle2, X, Eye, EyeOff 
} from 'lucide-react';

interface AdminBanquetsCMSProps {
  banquets: BanquetHall[];
  enquiries: EventEnquiry[];
  onUpdateBanquets: (halls: BanquetHall[]) => Promise<void>;
  onUpdateEnquiryStatus: (id: string, status: EventEnquiry['status']) => Promise<void>;
  whatsappNumber: string;
}

export const AdminBanquetsCMS: React.FC<AdminBanquetsCMSProps> = ({
  banquets,
  enquiries,
  onUpdateBanquets,
  onUpdateEnquiryStatus,
  whatsappNumber,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'halls' | 'enquiries'>('halls');
  const [editingHall, setEditingHall] = useState<BanquetHall | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');

  const emptyHall: BanquetHall = {
    id: `hall-${Date.now()}`,
    name: 'Imperial Grand Ballroom',
    tagline: 'Singrauli’s Premier Wedding & Conference Venue',
    description: 'A pillarless, acoustically designed banquet sanctuary with regal chandeliers.',
    seatingCapacity: '250 - 350 Guests',
    floatingCapacity: 'Up to 700 Guests',
    parkingCapacity: 'Dedicated parking for 60+ vehicles',
    cateringInfo: 'Pure Vegetarian & Multi-Cuisine Live Buffets managed in-house.',
    features: ['Central High-Tonnage Air Conditioning', 'Integrated JBL Line-Array Sound', 'Bridal Green Room', 'Valet Parking Support'],
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
    ],
    suitableFor: ['Grand Weddings & Sangeet', 'Corporate Conferences & AGMs', 'Anniversary Galas'],
    isActive: true,
  };

  const handleSaveHall = async () => {
    if (!editingHall) return;
    const updated = isAddingNew
      ? [...banquets, editingHall]
      : banquets.map((h) => (h.id === editingHall.id ? editingHall : h));
    await onUpdateBanquets(updated);
    setEditingHall(null);
    setIsAddingNew(false);
  };

  const handleDeleteHall = async (hallId: string) => {
    if (confirm('Are you sure you want to delete this banquet hall?')) {
      const updated = banquets.filter((h) => h.id !== hallId);
      await onUpdateBanquets(updated);
      if (editingHall?.id === hallId) {
        setEditingHall(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#e7e5e4] shadow-sm">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveSubTab('halls')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors ${
              activeSubTab === 'halls'
                ? 'bg-[#1c1917] text-[#faf8f5]'
                : 'bg-[#faf8f5] text-[#78716c] hover:text-[#1c1917]'
            }`}
          >
            Banquet Halls & Photos ({banquets.length})
          </button>
          <button
            onClick={() => setActiveSubTab('enquiries')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider uppercase transition-colors ${
              activeSubTab === 'enquiries'
                ? 'bg-[#1c1917] text-[#faf8f5]'
                : 'bg-[#faf8f5] text-[#78716c] hover:text-[#1c1917]'
            }`}
          >
            Received Enquiries ({enquiries.length})
          </button>
        </div>

        {activeSubTab === 'halls' && (
          <button
            onClick={() => {
              setEditingHall({ ...emptyHall, id: `hall-${Date.now()}` });
              setIsAddingNew(true);
            }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-[#1c1917] hover:bg-[#292524] text-[#faf8f5] rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-md shrink-0"
          >
            <Plus className="w-4 h-4 text-[#d4af37]" />
            <span>Add Banquet Hall</span>
          </button>
        )}
      </div>

      {/* SUB TAB 1: BANQUET HALLS CMS */}
      {activeSubTab === 'halls' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banquets.map((hall) => (
            <div
              key={hall.id}
              className="bg-white rounded-xl border border-[#e7e5e4] overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                  <img
                    src={hall.images[0] || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80'}
                    alt={hall.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-sm text-white px-2.5 py-1 rounded text-xs font-serif font-bold">
                    {hall.name}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-[#c49b29] text-white px-2.5 py-1 rounded text-[11px] font-semibold">
                    {hall.images.length} Photos
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <p className="text-xs text-[#c49b29] font-medium">{hall.tagline}</p>
                  <p className="text-xs text-[#78716c] line-clamp-2">{hall.description}</p>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#e7e5e4] text-center text-xs">
                    <div className="p-2 bg-[#faf8f5] rounded border border-[#e7e5e4]">
                      <span className="text-[10px] text-[#78716c] block">Seated</span>
                      <span className="font-bold text-[#1c1917]">{hall.seatingCapacity || 'N/A'}</span>
                    </div>
                    <div className="p-2 bg-[#faf8f5] rounded border border-[#e7e5e4]">
                      <span className="text-[10px] text-[#78716c] block">Floating</span>
                      <span className="font-bold text-[#1c1917]">{hall.floatingCapacity || 'N/A'}</span>
                    </div>
                    <div className="p-2 bg-[#faf8f5] rounded border border-[#e7e5e4]">
                      <span className="text-[10px] text-[#78716c] block">Parking</span>
                      <span className="font-bold text-[#1c1917]">{hall.parkingCapacity || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-[#faf8f5] border-t border-[#e7e5e4] flex items-center justify-end space-x-2">
                <button
                  onClick={() => {
                    setEditingHall({ ...hall });
                    setIsAddingNew(false);
                  }}
                  className="px-3 py-1.5 bg-white border border-[#d6d3d1] hover:bg-[#f5f0eb] text-[#1c1917] rounded-lg text-xs font-semibold inline-flex items-center space-x-1"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#c49b29]" />
                  <span>Edit Venue & Photos</span>
                </button>
                <button
                  onClick={() => handleDeleteHall(hall.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Delete Hall"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUB TAB 2: RECEIVED ENQUIRIES */}
      {activeSubTab === 'enquiries' && (
        <div className="bg-white rounded-xl border border-[#e7e5e4] overflow-hidden shadow-sm">
          {enquiries.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#78716c]">
              No event or banquet inquiries received yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#faf8f5] text-[#78716c] uppercase border-b border-[#e7e5e4]">
                  <tr>
                    <th className="p-3 font-semibold">Ref ID</th>
                    <th className="p-3 font-semibold">Organizer</th>
                    <th className="p-3 font-semibold">Event Details</th>
                    <th className="p-3 font-semibold">Guests</th>
                    <th className="p-3 font-semibold">Status</th>
                    <th className="p-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e7e5e4]">
                  {enquiries.map((ev) => (
                    <tr key={ev.id} className="hover:bg-[#faf8f5]/50">
                      <td className="p-3 font-mono font-bold text-[#c49b29]">{ev.referenceId}</td>
                      <td className="p-3">
                        <div className="font-bold text-[#1c1917]">{ev.name}</div>
                        <div className="text-[11px] text-[#78716c]">{ev.phone}</div>
                      </td>
                      <td className="p-3">
                        <span className="font-medium text-[#1c1917]">{ev.eventType}</span>
                        <div className="text-[11px] text-[#78716c]">{ev.eventDate}</div>
                      </td>
                      <td className="p-3 font-semibold">{ev.guestCount}</td>
                      <td className="p-3">
                        <select
                          value={ev.status}
                          onChange={(e) => onUpdateEnquiryStatus(ev.id, e.target.value as any)}
                          className="border border-[#d6d3d1] rounded px-2 py-1 text-[11px] bg-white font-medium"
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Booked">Booked</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            const text = encodeURIComponent(
                              `Hello ${ev.name}, regarding your event enquiry ${ev.referenceId} for ${ev.eventType} on ${ev.eventDate} at Hotel Udika Palace...`
                            );
                            window.open(`https://wa.me/${ev.phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
                          }}
                          className="p-1.5 bg-[#15803d] text-white rounded hover:bg-emerald-700"
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
      )}

      {/* Edit / Add Hall Modal */}
      {editingHall && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 my-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e7e5e4]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e7e5e4]">
              <div>
                <h3 className="text-base font-serif font-bold text-[#1c1917]">
                  {isAddingNew ? 'Add New Banquet Hall' : `Edit Venue: ${editingHall.name}`}
                </h3>
                <p className="text-xs text-[#78716c]">
                  Configure capacities, photos, and banquet descriptions.
                </p>
              </div>
              <button
                onClick={() => setEditingHall(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">Venue Name</label>
                <input
                  type="text"
                  value={editingHall.name}
                  onChange={(e) => setEditingHall({ ...editingHall, name: e.target.value })}
                  className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs font-bold text-[#1c1917]"
                />
              </div>

              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">Tagline</label>
                <input
                  type="text"
                  value={editingHall.tagline}
                  onChange={(e) => setEditingHall({ ...editingHall, tagline: e.target.value })}
                  className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Seated Capacity</label>
                  <input
                    type="text"
                    value={editingHall.seatingCapacity || ''}
                    placeholder="e.g. 250 - 350 Guests"
                    onChange={(e) => setEditingHall({ ...editingHall, seatingCapacity: e.target.value })}
                    className="w-full border border-[#d6d3d1] rounded-lg px-2.5 py-1.5 font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Floating Capacity</label>
                  <input
                    type="text"
                    value={editingHall.floatingCapacity || ''}
                    placeholder="e.g. Up to 700 Guests"
                    onChange={(e) => setEditingHall({ ...editingHall, floatingCapacity: e.target.value })}
                    className="w-full border border-[#d6d3d1] rounded-lg px-2.5 py-1.5 font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Parking Capacity</label>
                  <input
                    type="text"
                    value={editingHall.parkingCapacity || ''}
                    placeholder="e.g. Parking for 60+ Cars"
                    onChange={(e) => setEditingHall({ ...editingHall, parkingCapacity: e.target.value })}
                    className="w-full border border-[#d6d3d1] rounded-lg px-2.5 py-1.5 font-bold text-xs"
                  />
                </div>
              </div>

              {/* Photo URLs with Previews */}
              <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#e7e5e4] space-y-3">
                <label className="block text-[#78716c] uppercase font-semibold">
                  Banquet Photos ({editingHall.images.length})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {editingHall.images.map((imgUrl, idx) => (
                    <div key={idx} className="relative rounded-lg overflow-hidden border border-[#d6d3d1] group h-20 bg-gray-100">
                      <img src={imgUrl} alt={`Hall ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const filtered = editingHall.images.filter((_, i) => i !== idx);
                          setEditingHall({ ...editingHall, images: filtered });
                        }}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                    placeholder="Add high-res photo URL..."
                    className="w-full border border-[#d6d3d1] rounded-lg px-3 py-1.5 text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newPhotoUrl.trim()) {
                        setEditingHall({
                          ...editingHall,
                          images: [...editingHall.images, newPhotoUrl.trim()],
                        });
                        setNewPhotoUrl('');
                      }
                    }}
                    className="px-3 py-1.5 bg-[#1c1917] text-white rounded-lg text-xs font-semibold shrink-0"
                  >
                    Add Photo
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingHall.description}
                  onChange={(e) => setEditingHall({ ...editingHall, description: e.target.value })}
                  className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">Key Features (comma-separated)</label>
                <input
                  type="text"
                  value={editingHall.features.join(', ')}
                  onChange={(e) => {
                    const list = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                    setEditingHall({ ...editingHall, features: list });
                  }}
                  className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">Suitable For (comma-separated)</label>
                <input
                  type="text"
                  value={editingHall.suitableFor.join(', ')}
                  onChange={(e) => {
                    const list = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                    setEditingHall({ ...editingHall, suitableFor: list });
                  }}
                  className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">Catering Policy / Info</label>
                <input
                  type="text"
                  value={editingHall.cateringInfo || ''}
                  onChange={(e) => setEditingHall({ ...editingHall, cateringInfo: e.target.value })}
                  className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#e7e5e4]">
              <button
                type="button"
                onClick={() => setEditingHall(null)}
                className="px-4 py-2 border border-[#d6d3d1] rounded-lg text-xs font-semibold text-[#78716c] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveHall}
                className="px-5 py-2 bg-[#1c1917] hover:bg-[#292524] text-[#faf8f5] rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
              >
                Save Banquet Live
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
