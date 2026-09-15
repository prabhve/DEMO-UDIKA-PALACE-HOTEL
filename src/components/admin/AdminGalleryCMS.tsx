import React, { useState } from 'react';
import { GalleryItem } from '../../types';
import { Plus, Edit2, Trash2, Image as ImageIcon, Sparkles, X, Check } from 'lucide-react';

interface AdminGalleryCMSProps {
  gallery: GalleryItem[];
  onUpdateGallery: (items: GalleryItem[]) => Promise<void>;
}

export const AdminGalleryCMS: React.FC<AdminGalleryCMSProps> = ({
  gallery,
  onUpdateGallery,
}) => {
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', 'Hotel', 'Rooms', 'Restaurant', 'Food', 'Banquet', 'Exterior', 'Interior'];

  const emptyItem: GalleryItem = {
    id: `photo-${Date.now()}`,
    title: 'Udika Palace Grand View',
    category: 'Hotel',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    caption: 'Architectural elegance and serene ambiance at Waidhan.',
    isFeatured: false,
    order: gallery.length + 1,
  };

  const filteredGallery = gallery.filter((item) => {
    if (selectedCategory === 'ALL') return true;
    return item.category === selectedCategory;
  });

  const handleSavePhoto = async () => {
    if (!editingItem) return;
    const updated = isAddingNew
      ? [editingItem, ...gallery]
      : gallery.map((g) => (g.id === editingItem.id ? editingItem : g));
    await onUpdateGallery(updated);
    setEditingItem(null);
    setIsAddingNew(false);
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (confirm('Are you sure you want to remove this photo from the gallery?')) {
      const updated = gallery.filter((g) => g.id !== photoId);
      await onUpdateGallery(updated);
      if (editingItem?.id === photoId) {
        setEditingItem(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Photo CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#e7e5e4] shadow-sm">
        <div>
          <h3 className="text-base font-serif font-bold text-[#1c1917]">
            Visual Gallery Photo CMS
          </h3>
          <p className="text-xs text-[#78716c]">
            Upload, update, or remove showcase pictures, suites, banquet decors, and restaurant shots.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingItem({ ...emptyItem, id: `photo-${Date.now()}` });
            setIsAddingNew(true);
          }}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#1c1917] hover:bg-[#292524] text-[#faf8f5] rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4 text-[#d4af37]" />
          <span>Add New Photo</span>
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5 bg-white p-3 rounded-xl border border-[#e7e5e4]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              selectedCategory === cat
                ? 'bg-[#1c1917] text-[#faf8f5]'
                : 'bg-[#faf8f5] text-[#78716c] hover:text-[#1c1917]'
            }`}
          >
            {cat} {cat === 'ALL' ? `(${gallery.length})` : ''}
          </button>
        ))}
      </div>

      {/* Photo Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredGallery.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl border border-[#e7e5e4] overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
          >
            <div className="relative h-40 bg-gray-100 overflow-hidden">
              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                {item.category}
              </div>
              {item.isFeatured && (
                <div className="absolute top-2 right-2 bg-[#c49b29] text-white px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center space-x-0.5">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Featured</span>
                </div>
              )}
            </div>

            <div className="p-3">
              <h5 className="text-xs font-serif font-bold text-[#1c1917] truncate">{item.title}</h5>
              {item.caption && <p className="text-[10px] text-[#78716c] truncate mt-0.5">{item.caption}</p>}
            </div>

            <div className="p-2.5 bg-[#faf8f5] border-t border-[#e7e5e4] flex items-center justify-between">
              <button
                onClick={() => {
                  setEditingItem({ ...item });
                  setIsAddingNew(false);
                }}
                className="p-1 px-2 text-[11px] font-semibold text-[#1c1917] bg-white border border-[#d6d3d1] hover:bg-[#f5f0eb] rounded inline-flex items-center space-x-1"
              >
                <Edit2 className="w-3 h-3 text-[#c49b29]" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => handleDeletePhoto(item.id)}
                className="p-1 text-red-600 hover:bg-red-50 rounded"
                title="Delete Photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Photo Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 my-8 shadow-2xl border border-[#e7e5e4]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e7e5e4]">
              <div>
                <h3 className="text-base font-serif font-bold text-[#1c1917]">
                  {isAddingNew ? 'Add New Gallery Picture' : `Edit: ${editingItem.title}`}
                </h3>
                <p className="text-xs text-[#78716c]">
                  Configure photo URL, category tag, and caption.
                </p>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">Photo Title</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs font-bold text-[#1c1917]"
                />
              </div>

              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">Category</label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                  className="w-full border border-[#d6d3d1] rounded-lg px-2.5 py-2 text-xs text-[#1c1917]"
                >
                  <option value="Hotel">Hotel</option>
                  <option value="Rooms">Rooms</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Food">Food</option>
                  <option value="Banquet">Banquet</option>
                  <option value="Exterior">Exterior</option>
                  <option value="Interior">Interior</option>
                </select>
              </div>

              {/* Photo URL & Live Preview */}
              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">
                  High-Resolution Picture URL
                </label>
                <input
                  type="url"
                  value={editingItem.imageUrl}
                  onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                />
                {editingItem.imageUrl && (
                  <div className="mt-2 h-36 w-full rounded-lg overflow-hidden border border-[#d6d3d1] bg-gray-100 relative">
                    <img src={editingItem.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-2 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">
                      Live Preview
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">Caption / Subtext</label>
                <input
                  type="text"
                  value={editingItem.caption || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, caption: e.target.value })}
                  placeholder="e.g. Captured during evening dusk"
                  className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                />
              </div>

              <div className="pt-2 border-t border-[#e7e5e4]">
                <label className="inline-flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isFeatured}
                    onChange={(e) => setEditingItem({ ...editingItem, isFeatured: e.target.checked })}
                    className="rounded text-[#c49b29]"
                  />
                  <span className="font-semibold text-[#1c1917]">Feature on Homepage Gallery</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-[#e7e5e4]">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 border border-[#d6d3d1] rounded-lg text-xs font-semibold text-[#78716c] hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePhoto}
                className="px-5 py-2 bg-[#1c1917] hover:bg-[#292524] text-[#faf8f5] rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
              >
                Save Photo Live
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
