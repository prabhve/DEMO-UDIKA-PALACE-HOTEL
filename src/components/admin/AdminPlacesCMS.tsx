import React, { useState } from 'react';
import { NearbyPlace } from '../../types';
import { Plus, Edit2, Trash2, MapPin, Navigation, Clock, Image as ImageIcon, X, Check } from 'lucide-react';

interface AdminPlacesCMSProps {
  places: NearbyPlace[];
  onUpdatePlaces: (places: NearbyPlace[]) => Promise<void>;
}

export const AdminPlacesCMS: React.FC<AdminPlacesCMSProps> = ({
  places,
  onUpdatePlaces,
}) => {
  const [editingPlace, setEditingPlace] = useState<NearbyPlace | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const emptyPlace: NearbyPlace = {
    id: `place-${Date.now()}`,
    name: 'Govind Ballabh Pant Sagar Dam',
    category: 'Waterfalls & Lakes',
    approxDistanceKm: 28,
    approxDriveMinutes: 45,
    shortDescription: 'One of the largest artificial reservoirs in India offering scenic sunset vistas.',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    lat: 24.18,
    lng: 82.8,
    address: 'Rihand Dam Reservoir, Near Singrauli',
    travelTips: 'Car rental recommended from hotel desk. Wear sun protection.',
    googleMapsQuery: 'Govind Ballabh Pant Sagar Singrauli',
    isFeatured: true,
  };

  const handleSavePlace = async () => {
    if (!editingPlace) return;
    const updated = isAddingNew
      ? [...places, editingPlace]
      : places.map((p) => (p.id === editingPlace.id ? editingPlace : p));
    await onUpdatePlaces(updated);
    setEditingPlace(null);
    setIsAddingNew(false);
  };

  const handleDeletePlace = async (placeId: string) => {
    if (confirm('Are you sure you want to delete this attraction from the guide?')) {
      const updated = places.filter((p) => p.id !== placeId);
      await onUpdatePlaces(updated);
      if (editingPlace?.id === placeId) {
        setEditingPlace(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Place CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#e7e5e4] shadow-sm">
        <div>
          <h3 className="text-base font-serif font-bold text-[#1c1917]">
            Nearby Attractions & Heritage Guide CMS
          </h3>
          <p className="text-xs text-[#78716c]">
            Update local places, scenic photos, driving distances, and interactive map targets.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingPlace({ ...emptyPlace, id: `place-${Date.now()}` });
            setIsAddingNew(true);
          }}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#1c1917] hover:bg-[#292524] text-[#faf8f5] rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4 text-[#d4af37]" />
          <span>Add Attraction</span>
        </button>
      </div>

      {/* Places Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {places.map((place) => (
          <div
            key={place.id}
            className="bg-white rounded-xl border border-[#e7e5e4] overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="relative h-44 bg-gray-100 overflow-hidden">
                <img src={place.heroImage} alt={place.name} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                  {place.category}
                </div>
                <div className="absolute bottom-3 right-3 bg-black/75 text-[#d4af37] px-2 py-0.5 rounded text-xs font-bold">
                  {place.approxDistanceKm} km · {place.approxDriveMinutes} mins
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h4 className="text-base font-serif font-bold text-[#1c1917] truncate">{place.name}</h4>
                <p className="text-xs text-[#78716c] line-clamp-2">{place.shortDescription}</p>
                {place.address && (
                  <div className="pt-2 border-t border-[#e7e5e4] flex items-center justify-between text-[11px] text-[#57534e]">
                    <span className="truncate">{place.address}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 bg-[#faf8f5] border-t border-[#e7e5e4] flex items-center justify-end space-x-2">
              <button
                onClick={() => {
                  setEditingPlace({ ...place });
                  setIsAddingNew(false);
                }}
                className="px-3 py-1.5 bg-white border border-[#d6d3d1] hover:bg-[#f5f0eb] text-[#1c1917] rounded-lg text-xs font-semibold inline-flex items-center space-x-1"
              >
                <Edit2 className="w-3.5 h-3.5 text-[#c49b29]" />
                <span>Edit Details & Photo</span>
              </button>
              <button
                onClick={() => handleDeletePlace(place.id)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                title="Delete Place"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Place Modal */}
      {editingPlace && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 my-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e7e5e4]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e7e5e4]">
              <div>
                <h3 className="text-base font-serif font-bold text-[#1c1917]">
                  {isAddingNew ? 'Add New Landmark' : `Edit: ${editingPlace.name}`}
                </h3>
                <p className="text-xs text-[#78716c]">
                  Configure photo, distance, travel guide, and GPS target.
                </p>
              </div>
              <button
                onClick={() => setEditingPlace(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Place Name</label>
                  <input
                    type="text"
                    value={editingPlace.name}
                    onChange={(e) => setEditingPlace({ ...editingPlace, name: e.target.value })}
                    className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs font-bold text-[#1c1917]"
                  />
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    value={editingPlace.category}
                    onChange={(e) => setEditingPlace({ ...editingPlace, category: e.target.value })}
                    placeholder="Nature & Parks, Waterfalls, Temples..."
                    className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                  />
                </div>
              </div>

              {/* Image URL & Live Preview */}
              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">
                  Featured Picture URL
                </label>
                <div className="flex gap-3 items-start">
                  <input
                    type="url"
                    value={editingPlace.heroImage}
                    onChange={(e) => setEditingPlace({ ...editingPlace, heroImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                  />
                  {editingPlace.heroImage && (
                    <img src={editingPlace.heroImage} alt="Preview" className="w-16 h-12 object-cover rounded border border-[#d6d3d1] shrink-0" />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Distance (km)</label>
                  <input
                    type="number"
                    value={editingPlace.approxDistanceKm}
                    onChange={(e) => setEditingPlace({ ...editingPlace, approxDistanceKm: Number(e.target.value) })}
                    className="w-full border border-[#d6d3d1] rounded px-2.5 py-1.5 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Drive Time (mins)</label>
                  <input
                    type="number"
                    value={editingPlace.approxDriveMinutes}
                    onChange={(e) => setEditingPlace({ ...editingPlace, approxDriveMinutes: Number(e.target.value) })}
                    className="w-full border border-[#d6d3d1] rounded px-2.5 py-1.5"
                  />
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={editingPlace.lat}
                    onChange={(e) => setEditingPlace({ ...editingPlace, lat: Number(e.target.value) })}
                    className="w-full border border-[#d6d3d1] rounded px-2.5 py-1.5"
                  />
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={editingPlace.lng}
                    onChange={(e) => setEditingPlace({ ...editingPlace, lng: Number(e.target.value) })}
                    className="w-full border border-[#d6d3d1] rounded px-2.5 py-1.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={editingPlace.shortDescription}
                  onChange={(e) => setEditingPlace({ ...editingPlace, shortDescription: e.target.value })}
                  className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Address / Landmark</label>
                  <input
                    type="text"
                    value={editingPlace.address || ''}
                    onChange={(e) => setEditingPlace({ ...editingPlace, address: e.target.value })}
                    className="w-full border border-[#d6d3d1] rounded-lg px-3 py-1.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Travel Tips</label>
                  <input
                    type="text"
                    value={editingPlace.travelTips || ''}
                    onChange={(e) => setEditingPlace({ ...editingPlace, travelTips: e.target.value })}
                    className="w-full border border-[#d6d3d1] rounded-lg px-3 py-1.5 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">Google Maps Query</label>
                <input
                  type="text"
                  value={editingPlace.googleMapsQuery || ''}
                  onChange={(e) => setEditingPlace({ ...editingPlace, googleMapsQuery: e.target.value })}
                  className="w-full border border-[#d6d3d1] rounded-lg px-3 py-1.5 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#e7e5e4]">
              <button
                type="button"
                onClick={() => setEditingPlace(null)}
                className="px-4 py-2 border border-[#d6d3d1] rounded-lg text-xs font-semibold text-[#78716c] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePlace}
                className="px-5 py-2 bg-[#1c1917] hover:bg-[#292524] text-[#faf8f5] rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
              >
                Save Landmark Live
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
