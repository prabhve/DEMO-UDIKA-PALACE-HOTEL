import React, { useState } from 'react';
import { MenuItem } from '../../types';
import { 
  Plus, Edit2, Trash2, Check, X, Flame, Sparkles, 
  Utensils, Image as ImageIcon, Search, Filter 
} from 'lucide-react';

interface AdminRestaurantCMSProps {
  menuItems: MenuItem[];
  onUpdateMenu: (items: MenuItem[]) => Promise<void>;
}

export const AdminRestaurantCMS: React.FC<AdminRestaurantCMSProps> = ({
  menuItems,
  onUpdateMenu,
}) => {
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'ALL',
    'Soups & Starters',
    'Main Course',
    'Biryani & Rice',
    'Chinese & Tandoor',
    'Breads',
    'Desserts & Beverages',
  ];

  const emptyItem: MenuItem = {
    id: `dish-${Date.now()}`,
    name: 'Special Dal Makhani',
    category: 'Main Course',
    cuisine: 'Indian',
    price: 240,
    isVeg: true,
    isChefSpecial: false,
    spicyLevel: 'Medium',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80',
    description: 'Slow simmered black lentils finished with fresh churned butter and cream.',
    isAvailable: true,
  };

  const filteredItems = menuItems.filter((item) => {
    if (filterCategory !== 'ALL' && item.category !== filterCategory) return false;
    if (searchQuery.trim() && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleSaveEdit = async () => {
    if (!editingItem) return;
    const updated = isAddingNew
      ? [...menuItems, editingItem]
      : menuItems.map((m) => (m.id === editingItem.id ? editingItem : m));
    await onUpdateMenu(updated);
    setEditingItem(null);
    setIsAddingNew(false);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (confirm('Are you sure you want to delete this dish from the menu?')) {
      const updated = menuItems.filter((m) => m.id !== itemId);
      await onUpdateMenu(updated);
      if (editingItem?.id === itemId) {
        setEditingItem(null);
      }
    }
  };

  const handleToggleAvailable = async (itemId: string, current: boolean) => {
    const updated = menuItems.map((m) => (m.id === itemId ? { ...m, isAvailable: !current } : m));
    await onUpdateMenu(updated);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Search / Add */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#e7e5e4] shadow-sm">
        <div>
          <h3 className="text-base font-serif font-bold text-[#1c1917]">
            Restaurant Dishes & Menu Visual CMS
          </h3>
          <p className="text-xs text-[#78716c]">
            Update dish photos, prices, availability, spicy levels, or add new culinary creations.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingItem({ ...emptyItem, id: `dish-${Date.now()}` });
            setIsAddingNew(true);
          }}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#1c1917] hover:bg-[#292524] text-[#faf8f5] rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-md shrink-0"
        >
          <Plus className="w-4 h-4 text-[#d4af37]" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3.5 rounded-xl border border-[#e7e5e4]">
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                filterCategory === cat
                  ? 'bg-[#1c1917] text-[#faf8f5]'
                  : 'bg-[#faf8f5] text-[#78716c] hover:text-[#1c1917]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 text-[#78716c] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search dish by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 border border-[#d6d3d1] rounded-lg text-xs"
          />
        </div>
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((dish) => (
          <div
            key={dish.id}
            className="bg-white rounded-xl border border-[#e7e5e4] p-4 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              <div className="flex items-start space-x-3">
                {/* Dish Picture with Preview */}
                <div className="w-20 h-20 rounded-lg overflow-hidden border border-[#e7e5e4] shrink-0 bg-gray-100 relative">
                  {dish.imageUrl ? (
                    <img src={dish.imageUrl} alt={dish.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Utensils className="w-6 h-6" />
                    </div>
                  )}
                  <span
                    className={`absolute bottom-0 inset-x-0 text-[8px] font-bold text-center py-0.5 ${
                      dish.isVeg ? 'bg-emerald-700 text-white' : 'bg-red-700 text-white'
                    }`}
                  >
                    {dish.isVeg ? 'VEG' : 'NON-VEG'}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-sm font-serif font-bold text-[#1c1917] truncate">{dish.name}</h4>
                    <span className="text-xs font-bold text-[#c49b29] shrink-0">₹{dish.price}</span>
                  </div>

                  <span className="text-[10px] text-[#78716c] block">{dish.category} · {dish.cuisine}</span>

                  <p className="text-[11px] text-[#57534e] line-clamp-2 mt-1">
                    {dish.description}
                  </p>

                  <div className="flex items-center space-x-2 mt-2">
                    {dish.isChefSpecial && (
                      <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 bg-[#d4af37]/20 text-[#c49b29] rounded text-[9px] font-bold">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Chef Special</span>
                      </span>
                    )}
                    {dish.spicyLevel && (
                      <span className="inline-flex items-center space-x-1 text-[9px] text-orange-600 font-medium">
                        <Flame className="w-2.5 h-2.5" />
                        <span>{dish.spicyLevel}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="mt-4 pt-3 border-t border-[#e7e5e4] flex items-center justify-between text-xs">
              <label className="inline-flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={dish.isAvailable}
                  onChange={() => handleToggleAvailable(dish.id, dish.isAvailable)}
                  className="rounded text-[#c49b29]"
                />
                <span className={`text-[11px] font-semibold ${dish.isAvailable ? 'text-emerald-700' : 'text-gray-400'}`}>
                  {dish.isAvailable ? 'In Stock' : 'Sold Out'}
                </span>
              </label>

              <div className="flex items-center space-x-1.5">
                <button
                  onClick={() => {
                    setEditingItem({ ...dish });
                    setIsAddingNew(false);
                  }}
                  className="p-1.5 bg-white border border-[#d6d3d1] hover:bg-[#f5f0eb] text-[#1c1917] rounded-lg text-xs font-semibold inline-flex items-center space-x-1"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#c49b29]" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteItem(dish.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Delete Dish"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Add Dish Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 my-8 max-h-[90vh] overflow-y-auto shadow-2xl border border-[#e7e5e4]">
            <div className="flex items-center justify-between pb-3 border-b border-[#e7e5e4]">
              <div>
                <h3 className="text-base font-serif font-bold text-[#1c1917]">
                  {isAddingNew ? 'Add New Dish to Menu' : `Edit: ${editingItem.name}`}
                </h3>
                <p className="text-xs text-[#78716c]">
                  Configure photo, price, category, and spice rating.
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
                <label className="block text-[#78716c] uppercase font-semibold mb-1">Dish Name</label>
                <input
                  type="text"
                  value={editingItem.name}
                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                  className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs font-bold text-[#1c1917]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    className="w-full border border-[#d6d3d1] rounded-lg px-2.5 py-1.5 text-xs text-[#1c1917]"
                  >
                    <option value="Soups & Starters">Soups & Starters</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Biryani & Rice">Biryani & Rice</option>
                    <option value="Chinese & Tandoor">Chinese & Tandoor</option>
                    <option value="Breads">Breads</option>
                    <option value="Desserts & Beverages">Desserts & Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                    className="w-full border border-[#d6d3d1] rounded-lg px-2.5 py-1.5 font-bold"
                  />
                </div>
              </div>

              {/* Dish Image URL & Preview */}
              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">
                  Dish Photo Picture URL
                </label>
                <div className="flex gap-2 items-start">
                  <input
                    type="url"
                    value={editingItem.imageUrl || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full border border-[#d6d3d1] rounded-lg px-3 py-1.5 text-xs"
                  />
                  {editingItem.imageUrl && (
                    <img
                      src={editingItem.imageUrl}
                      alt="Dish Preview"
                      className="w-12 h-10 rounded object-cover border border-[#d6d3d1] shrink-0"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full border border-[#d6d3d1] rounded-lg px-3 py-1.5 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Cuisine</label>
                  <select
                    value={editingItem.cuisine}
                    onChange={(e) => setEditingItem({ ...editingItem, cuisine: e.target.value as any })}
                    className="w-full border border-[#d6d3d1] rounded-lg px-2.5 py-1.5 text-xs bg-white"
                  >
                    <option value="Indian">Indian</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Continental">Continental</option>
                    <option value="Beverages">Beverages</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Spicy Level</label>
                  <select
                    value={editingItem.spicyLevel || 'Mild'}
                    onChange={(e) => setEditingItem({ ...editingItem, spicyLevel: e.target.value as any })}
                    className="w-full border border-[#d6d3d1] rounded-lg px-2.5 py-1.5 text-xs"
                  >
                    <option value="Mild">Mild</option>
                    <option value="Medium">Medium</option>
                    <option value="Spicy">Spicy</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-[#e7e5e4]">
                <label className="inline-flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isVeg}
                    onChange={(e) => setEditingItem({ ...editingItem, isVeg: e.target.checked })}
                    className="rounded text-emerald-600"
                  />
                  <span className="font-semibold text-emerald-800">Pure Vegetarian</span>
                </label>

                <label className="inline-flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isChefSpecial}
                    onChange={(e) => setEditingItem({ ...editingItem, isChefSpecial: e.target.checked })}
                    className="rounded text-[#c49b29]"
                  />
                  <span className="font-semibold text-[#1c1917]">Chef Special</span>
                </label>

                <label className="inline-flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.isAvailable}
                    onChange={(e) => setEditingItem({ ...editingItem, isAvailable: e.target.checked })}
                    className="rounded text-sky-600"
                  />
                  <span className="font-semibold text-[#1c1917]">Available (In Stock)</span>
                </label>
              </div>
            </div>

            {/* Modal Actions */}
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
                onClick={handleSaveEdit}
                className="px-5 py-2 bg-[#1c1917] hover:bg-[#292524] text-[#faf8f5] rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors shadow-md"
              >
                Save Dish Live
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
