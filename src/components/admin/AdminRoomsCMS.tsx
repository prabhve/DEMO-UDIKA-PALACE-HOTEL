import React, { useState } from 'react';
import { Room } from '../../types';
import { 
  Plus, Edit2, Trash2, Check, X, Image as ImageIcon, 
  BedDouble, Users, Maximize2, ShieldCheck, Eye, EyeOff
} from 'lucide-react';

interface AdminRoomsCMSProps {
  rooms: Room[];
  onUpdateRooms: (rooms: Room[]) => Promise<void>;
}

export const AdminRoomsCMS: React.FC<AdminRoomsCMSProps> = ({ rooms, onUpdateRooms }) => {
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  const emptyRoom: Room = {
    id: `room-${Date.now()}`,
    name: 'New Luxury Suite',
    category: 'Deluxe',
    ac: true,
    baseRatePerNight: 2800,
    showPrice: true,
    roomSizeSqFt: 300,
    bedType: 'King Size Bed',
    maxAdults: 2,
    maxChildren: 1,
    featuredImage: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80',
    ],
    shortDescription: 'Spacious air-conditioned room with king-size bedding and modern bath.',
    detailedDescription: 'Designed for discerning travelers seeking comfort and elegance.',
    amenities: ['High-speed Wi-Fi', 'Flat-screen TV', '24/7 Room Service', 'Hot & Cold Water', 'Complimentary Bottled Water'],
    policies: ['Check-in: 12:00 PM', 'Check-out: 11:00 AM', 'Government ID required at check-in'],
    isActive: true,
    isFeatured: true,
    order: rooms.length + 1,
  };

  const handleSaveEdit = async () => {
    if (!editingRoom) return;
    const updated = isAddingNew
      ? [...rooms, editingRoom]
      : rooms.map((r) => (r.id === editingRoom.id ? editingRoom : r));
    await onUpdateRooms(updated);
    setEditingRoom(null);
    setIsAddingNew(false);
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (confirm('Are you sure you want to delete this room? This action will remove it from the public site.')) {
      const updated = rooms.filter((r) => r.id !== roomId);
      await onUpdateRooms(updated);
      if (editingRoom?.id === roomId) {
        setEditingRoom(null);
      }
    }
  };

  const handleToggleActive = async (roomId: string, current: boolean) => {
    const updated = rooms.map((r) => (r.id === roomId ? { ...r, isActive: !current } : r));
    await onUpdateRooms(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Room CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#e7e5e4] shadow-sm">
        <div>
          <h3 className="text-base font-serif font-bold text-[#1c1917]">
            Rooms & Suites Visual CMS
          </h3>
          <p className="text-xs text-[#78716c]">
            Update photos, pricing, amenities, room dimensions, or add new room categories.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingRoom({ ...emptyRoom, id: `room-${Date.now()}` });
            setIsAddingNew(true);
          }}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#1c1917] hover:bg-[#292524] text-[#faf8f5] rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4 text-[#d4af37]" />
          <span>Add New Room</span>
        </button>
      </div>

      {/* Room List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-xl border border-[#e7e5e4] overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              {/* Featured Image with Badges */}
              <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                <img
                  src={room.featuredImage}
                  alt={room.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white backdrop-blur-sm">
                    {room.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${room.isActive ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
                    {room.isActive ? 'Live' : 'Hidden'}
                  </span>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-[#d4af37] px-2.5 py-1 rounded text-xs font-bold">
                  ₹{(room.baseRatePerNight ?? 0).toLocaleString('en-IN')}{' '}
                  <span className="text-[10px] text-gray-300 font-normal">/ night</span>
                </div>
              </div>

              {/* Room Content Details */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <h4 className="text-base font-serif font-bold text-[#1c1917]">{room.name}</h4>
                </div>

                <p className="text-xs text-[#78716c] line-clamp-2">
                  {room.shortDescription}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-[#57534e] pt-2 border-t border-[#e7e5e4]">
                  <div className="flex items-center space-x-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-[#c49b29]" />
                    <span>{room.roomSizeSqFt || 0} sq.ft</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <BedDouble className="w-3.5 h-3.5 text-[#c49b29]" />
                    <span>{room.bedType}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Users className="w-3.5 h-3.5 text-[#c49b29]" />
                    <span>Up to {room.maxAdults} Adults</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-[#c49b29]" />
                    <span>{(room.images || []).length} Photos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Action Controls */}
            <div className="p-3 bg-[#faf8f5] border-t border-[#e7e5e4] flex items-center justify-between">
              <button
                onClick={() => handleToggleActive(room.id, room.isActive)}
                className="text-[11px] font-semibold text-[#78716c] hover:text-[#1c1917] inline-flex items-center space-x-1"
              >
                {room.isActive ? <Eye className="w-3.5 h-3.5 text-emerald-600" /> : <EyeOff className="w-3.5 h-3.5 text-red-500" />}
                <span>{room.isActive ? 'Active' : 'Disabled'}</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEditingRoom({ ...room });
                    setIsAddingNew(false);
                  }}
                  className="p-1.5 bg-white border border-[#d6d3d1] hover:bg-[#f5f0eb] text-[#1c1917] rounded-lg text-xs font-semibold inline-flex items-center space-x-1"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#c49b29]" />
                  <span>Edit Room & Photos</span>
                </button>
                <button
                  onClick={() => handleDeleteRoom(room.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Delete Room"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Room Modal Dialog */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 my-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e7e5e4]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e7e5e4]">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#1c1917]">
                  {isAddingNew ? 'Add New Room or Suite' : `Edit: ${editingRoom.name}`}
                </h3>
                <p className="text-xs text-[#78716c]">
                  Configure content, high-res photos, rates, and amenities.
                </p>
              </div>
              <button
                onClick={() => setEditingRoom(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Room Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Room Name</label>
                  <input
                    type="text"
                    value={editingRoom.name}
                    onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                    className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs font-bold text-[#1c1917]"
                  />
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Category</label>
                  <select
                    value={editingRoom.category}
                    onChange={(e) => setEditingRoom({ ...editingRoom, category: e.target.value as any })}
                    className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917] bg-white"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Super Deluxe">Super Deluxe</option>
                    <option value="Executive">Executive</option>
                  </select>
                </div>
              </div>

              {/* Price, Size, Bed, Capacity */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Base Rate (₹/Night)</label>
                  <input
                    type="number"
                    value={editingRoom.baseRatePerNight}
                    onChange={(e) => setEditingRoom({ ...editingRoom, baseRatePerNight: Number(e.target.value) })}
                    className="w-full border border-[#d6d3d1] rounded-lg px-2.5 py-1.5 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Approx Size (Sq.Ft)</label>
                  <input
                    type="number"
                    value={editingRoom.roomSizeSqFt}
                    onChange={(e) => setEditingRoom({ ...editingRoom, roomSizeSqFt: Number(e.target.value) })}
                    className="w-full border border-[#d6d3d1] rounded-lg px-2.5 py-1.5"
                  />
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Bedding Type</label>
                  <input
                    type="text"
                    value={editingRoom.bedType}
                    onChange={(e) => setEditingRoom({ ...editingRoom, bedType: e.target.value })}
                    className="w-full border border-[#d6d3d1] rounded-lg px-2.5 py-1.5"
                  />
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Max Adults</label>
                  <input
                    type="number"
                    value={editingRoom.maxAdults}
                    onChange={(e) => setEditingRoom({ ...editingRoom, maxAdults: Number(e.target.value) })}
                    className="w-full border border-[#d6d3d1] rounded-lg px-2.5 py-1.5"
                  />
                </div>
              </div>

              {/* Featured Image URL & Preview */}
              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">
                  Main Featured Picture URL
                </label>
                <div className="flex gap-3 items-start">
                  <input
                    type="url"
                    value={editingRoom.featuredImage}
                    onChange={(e) => setEditingRoom({ ...editingRoom, featuredImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs"
                  />
                  {editingRoom.featuredImage && (
                    <img
                      src={editingRoom.featuredImage}
                      alt="Room Preview"
                      className="w-16 h-12 rounded object-cover border border-[#d6d3d1] shrink-0"
                    />
                  )}
                </div>
              </div>

              {/* Gallery Images Collection */}
              <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#e7e5e4] space-y-3">
                <label className="block text-[#78716c] uppercase font-semibold">
                  Additional Gallery Photos ({(editingRoom.images || []).length})
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(editingRoom.images || []).map((imgUrl, idx) => (
                    <div key={idx} className="relative rounded-lg overflow-hidden border border-[#d6d3d1] group h-20 bg-gray-100">
                      <img src={imgUrl} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const filtered = (editingRoom.images || []).filter((_, i) => i !== idx);
                          setEditingRoom({ ...editingRoom, images: filtered });
                        }}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newGalleryUrl}
                    onChange={(e) => setNewGalleryUrl(e.target.value)}
                    placeholder="Add another photo URL..."
                    className="w-full border border-[#d6d3d1] rounded-lg px-3 py-1.5 text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newGalleryUrl.trim()) {
                        setEditingRoom({
                          ...editingRoom,
                          images: [...(editingRoom.images || []), newGalleryUrl.trim()],
                        });
                        setNewGalleryUrl('');
                      }
                    }}
                    className="px-3 py-1.5 bg-[#1c1917] text-white rounded-lg text-xs font-semibold shrink-0"
                  >
                    Add Photo
                  </button>
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingRoom.shortDescription}
                  onChange={(e) => setEditingRoom({ ...editingRoom, shortDescription: e.target.value })}
                  className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">Detailed Description</label>
                <textarea
                  rows={3}
                  value={editingRoom.detailedDescription}
                  onChange={(e) => setEditingRoom({ ...editingRoom, detailedDescription: e.target.value })}
                  className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs"
                />
              </div>

              {/* Amenities (Comma separated for easy editing) */}
              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">
                  Amenities (comma-separated)
                </label>
                <input
                  type="text"
                  value={editingRoom.amenities.join(', ')}
                  onChange={(e) => {
                    const list = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                    setEditingRoom({ ...editingRoom, amenities: list });
                  }}
                  className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-[#e7e5e4]">
                <label className="inline-flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingRoom.showPrice}
                    onChange={(e) => setEditingRoom({ ...editingRoom, showPrice: e.target.checked })}
                    className="rounded text-[#c49b29]"
                  />
                  <span className="font-semibold text-[#1c1917]">Display Price Publicly</span>
                </label>

                <label className="inline-flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingRoom.isActive}
                    onChange={(e) => setEditingRoom({ ...editingRoom, isActive: e.target.checked })}
                    className="rounded text-emerald-600"
                  />
                  <span className="font-semibold text-[#1c1917]">Active in Booking Engine</span>
                </label>

                <label className="inline-flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingRoom.ac}
                    onChange={(e) => setEditingRoom({ ...editingRoom, ac: e.target.checked })}
                    className="rounded text-sky-600"
                  />
                  <span className="font-semibold text-[#1c1917]">Air Conditioned (AC)</span>
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#e7e5e4]">
              <button
                type="button"
                onClick={() => setEditingRoom(null)}
                className="px-4 py-2 border border-[#d6d3d1] rounded-lg text-xs font-semibold text-[#78716c] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2 bg-[#1c1917] hover:bg-[#292524] text-[#faf8f5] rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
              >
                Save Room & Update Live
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
