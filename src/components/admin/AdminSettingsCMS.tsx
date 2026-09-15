import React, { useState } from 'react';
import { HotelSettings } from '../../types';
import { 
  Building2, Image, Sparkles, Utensils, Award, 
  MapPin, Phone, Mail, Globe, Save, CheckCircle2, 
  ExternalLink, ChevronDown, ChevronRight, Eye
} from 'lucide-react';

interface AdminSettingsCMSProps {
  settings: HotelSettings;
  onSave: (settings: HotelSettings) => Promise<void>;
  isSaving: boolean;
  saveSuccessMsg: string | null;
}

export const AdminSettingsCMS: React.FC<AdminSettingsCMSProps> = ({
  settings,
  onSave,
  isSaving,
  saveSuccessMsg,
}) => {
  const [formData, setFormData] = useState<HotelSettings>({ ...settings });
  const [openSection, setOpenSection] = useState<string>('hero');

  const toggleSection = (sec: string) => {
    setOpenSection(openSection === sec ? '' : sec);
  };

  const handleFieldChange = (field: keyof HotelSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <div className="bg-white rounded-xl border border-[#e7e5e4] p-5 sm:p-7 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e7e5e4]">
        <div>
          <h3 className="text-lg font-serif font-bold text-[#1c1917]">
            Complete Website Content & Visual CMS
          </h3>
          <p className="text-xs text-[#78716c]">
            Edit all website copy, background images, section banners, timings, and contact details.
          </p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          className="inline-flex items-center space-x-2 bg-[#1c1917] hover:bg-[#292524] text-[#faf8f5] px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95 shrink-0"
        >
          <Save className="w-3.5 h-3.5 text-[#d4af37]" />
          <span>{isSaving ? 'Saving Changes...' : 'Save & Publish Live'}</span>
        </button>
      </div>

      {saveSuccessMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-xs font-semibold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* SECTION 1: HERO SECTION & PICTURE */}
        <div className="border border-[#e7e5e4] rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('hero')}
            className="w-full p-4 bg-[#faf8f5] hover:bg-[#f5f0eb] flex items-center justify-between text-left transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#d4af37]/20 rounded-lg text-[#c49b29]">
                <Image className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-bold text-[#1c1917]">
                  1. Hero Banner, Picture & Badges
                </h4>
                <p className="text-[11px] text-[#78716c]">
                  Homepage main background picture, headline, tagline, and badges.
                </p>
              </div>
            </div>
            {openSection === 'hero' ? <ChevronDown className="w-4 h-4 text-[#78716c]" /> : <ChevronRight className="w-4 h-4 text-[#78716c]" />}
          </button>

          {openSection === 'hero' && (
            <div className="p-5 space-y-4 text-xs border-t border-[#e7e5e4] bg-white">
              {/* Hero Image URL & Preview */}
              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">
                  Hero Background Picture URL
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  <input
                    type="url"
                    value={formData.heroImageUrl || ''}
                    onChange={(e) => handleFieldChange('heroImageUrl', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                  />
                  {formData.heroImageUrl && (
                    <div className="shrink-0 w-28 h-16 rounded-lg overflow-hidden border border-[#d6d3d1] bg-gray-100 relative group">
                      <img src={formData.heroImageUrl} alt="Hero Preview" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center py-0.5">Preview</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Hotel Name / Main Display</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs font-bold text-[#1c1917]"
                  />
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Hero Location Chip</label>
                  <input
                    type="text"
                    value={formData.heroLocationTag || ''}
                    onChange={(e) => handleFieldChange('heroLocationTag', e.target.value)}
                    placeholder="Waidhan · Singrauli · Madhya Pradesh"
                    className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">Hero Tagline</label>
                <input
                  type="text"
                  value={formData.tagline || ''}
                  onChange={(e) => handleFieldChange('tagline', e.target.value)}
                  className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                />
              </div>

              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">Hero Supporting Copy</label>
                <textarea
                  rows={2}
                  value={formData.supportingText || ''}
                  onChange={(e) => handleFieldChange('supportingText', e.target.value)}
                  className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Primary CTA Button Label</label>
                  <input
                    type="text"
                    value={formData.heroCtaBookText || ''}
                    onChange={(e) => handleFieldChange('heroCtaBookText', e.target.value)}
                    placeholder="Book Your Stay"
                    className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                  />
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Secondary CTA Button Label</label>
                  <input
                    type="text"
                    value={formData.heroCtaExploreText || ''}
                    onChange={(e) => handleFieldChange('heroCtaExploreText', e.target.value)}
                    placeholder="Explore Udika Palace"
                    className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                  />
                </div>
              </div>

              {/* 4 Badges */}
              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">
                  Hero 4 Highlight Badges (one per input)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {[0, 1, 2, 3].map((idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={formData.heroBadges?.[idx] || ''}
                      onChange={(e) => {
                        const nextBadges = [...(formData.heroBadges || ['', '', '', ''])];
                        nextBadges[idx] = e.target.value;
                        handleFieldChange('heroBadges', nextBadges);
                      }}
                      placeholder={`Badge ${idx + 1}`}
                      className="border border-[#d6d3d1] rounded px-2.5 py-1.5 text-xs text-[#1c1917]"
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: ABOUT / INTRODUCTION & PICTURE */}
        <div className="border border-[#e7e5e4] rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('intro')}
            className="w-full p-4 bg-[#faf8f5] hover:bg-[#f5f0eb] flex items-center justify-between text-left transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#d4af37]/20 rounded-lg text-[#c49b29]">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-bold text-[#1c1917]">
                  2. About & Introduction Section & Featured Picture
                </h4>
                <p className="text-[11px] text-[#78716c]">
                  Hospitality story, featured photo, floating badge, and 4 pillars.
                </p>
              </div>
            </div>
            {openSection === 'intro' ? <ChevronDown className="w-4 h-4 text-[#78716c]" /> : <ChevronRight className="w-4 h-4 text-[#78716c]" />}
          </button>

          {openSection === 'intro' && (
            <div className="p-5 space-y-4 text-xs border-t border-[#e7e5e4] bg-white">
              {/* Intro Image URL & Preview */}
              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">
                  About Section Featured Picture URL
                </label>
                <div className="flex flex-col sm:flex-row gap-3 items-start">
                  <input
                    type="url"
                    value={formData.introImageUrl || ''}
                    onChange={(e) => handleFieldChange('introImageUrl', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                  />
                  {formData.introImageUrl && (
                    <div className="shrink-0 w-28 h-16 rounded-lg overflow-hidden border border-[#d6d3d1] bg-gray-100 relative">
                      <img src={formData.introImageUrl} alt="Intro Preview" className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-[9px] text-white text-center py-0.5">Preview</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Section Eyebrow</label>
                  <input
                    type="text"
                    value={formData.introEyebrow || ''}
                    onChange={(e) => handleFieldChange('introEyebrow', e.target.value)}
                    placeholder="Authentic Indian Hospitality"
                    className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                  />
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Section Main Heading</label>
                  <input
                    type="text"
                    value={formData.introHeading || ''}
                    onChange={(e) => handleFieldChange('introHeading', e.target.value)}
                    placeholder="A Comfortable Stay in Waidhan"
                    className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Floating Badge Title</label>
                  <input
                    type="text"
                    value={formData.introBadgeTitle || ''}
                    onChange={(e) => handleFieldChange('introBadgeTitle', e.target.value)}
                    placeholder="Prime Location on Thana Road"
                    className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                  />
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Floating Badge Subtitle</label>
                  <input
                    type="text"
                    value={formData.introBadgeSubtitle || ''}
                    onChange={(e) => handleFieldChange('introBadgeSubtitle', e.target.value)}
                    placeholder="Seamless connectivity to Waidhan administrative center..."
                    className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">Paragraph 1 (Main Intro)</label>
                <textarea
                  rows={2}
                  value={formData.introParagraph1 || ''}
                  onChange={(e) => handleFieldChange('introParagraph1', e.target.value)}
                  className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                />
              </div>

              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">Paragraph 2 (Services & Comfort)</label>
                <textarea
                  rows={2}
                  value={formData.introParagraph2 || ''}
                  onChange={(e) => handleFieldChange('introParagraph2', e.target.value)}
                  className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                />
              </div>

              {/* 4 Pillars */}
              <div className="pt-2 border-t border-[#e7e5e4]">
                <label className="block text-[#78716c] uppercase font-semibold mb-2">
                  4 Key Hospitality Pillars (Title & Description)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[0, 1, 2, 3].map((idx) => {
                    const pillar = formData.introPillars?.[idx] || { title: '', description: '' };
                    return (
                      <div key={idx} className="p-3 bg-[#faf8f5] rounded-lg border border-[#e7e5e4] space-y-2">
                        <span className="text-[10px] font-bold text-[#c49b29] uppercase">Pillar {idx + 1}</span>
                        <input
                          type="text"
                          value={pillar.title}
                          onChange={(e) => {
                            const next = [...(formData.introPillars || [
                              { title: '', description: '' },
                              { title: '', description: '' },
                              { title: '', description: '' },
                              { title: '', description: '' },
                            ])];
                            next[idx] = { ...next[idx], title: e.target.value };
                            handleFieldChange('introPillars', next);
                          }}
                          placeholder="Pillar Title"
                          className="w-full border border-[#d6d3d1] rounded px-2.5 py-1 text-xs font-semibold"
                        />
                        <textarea
                          rows={2}
                          value={pillar.description}
                          onChange={(e) => {
                            const next = [...(formData.introPillars || [
                              { title: '', description: '' },
                              { title: '', description: '' },
                              { title: '', description: '' },
                              { title: '', description: '' },
                            ])];
                            next[idx] = { ...next[idx], description: e.target.value };
                            handleFieldChange('introPillars', next);
                          }}
                          placeholder="Pillar Description"
                          className="w-full border border-[#d6d3d1] rounded px-2.5 py-1 text-xs"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: RESTAURANT SECTION & DUAL PICTURES */}
        <div className="border border-[#e7e5e4] rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('restaurant')}
            className="w-full p-4 bg-[#faf8f5] hover:bg-[#f5f0eb] flex items-center justify-between text-left transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#d4af37]/20 rounded-lg text-[#c49b29]">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-bold text-[#1c1917]">
                  3. Restaurant Section, Dual Pictures & Meal Timings
                </h4>
                <p className="text-[11px] text-[#78716c]">
                  Restaurant branding, dual photos, meal hours, and room dining notice.
                </p>
              </div>
            </div>
            {openSection === 'restaurant' ? <ChevronDown className="w-4 h-4 text-[#78716c]" /> : <ChevronRight className="w-4 h-4 text-[#78716c]" />}
          </button>

          {openSection === 'restaurant' && (
            <div className="p-5 space-y-4 text-xs border-t border-[#e7e5e4] bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Restaurant Branding Name</label>
                  <input
                    type="text"
                    value={formData.restaurantName || ''}
                    onChange={(e) => handleFieldChange('restaurantName', e.target.value)}
                    placeholder="Zayka Restaurant"
                    className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs font-bold text-[#1c1917]"
                  />
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Section Eyebrow</label>
                  <input
                    type="text"
                    value={formData.restaurantEyebrow || ''}
                    onChange={(e) => handleFieldChange('restaurantEyebrow', e.target.value)}
                    placeholder="Culinary Excellence"
                    className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">Section Heading</label>
                <input
                  type="text"
                  value={formData.restaurantHeading || ''}
                  onChange={(e) => handleFieldChange('restaurantHeading', e.target.value)}
                  placeholder="Dine at Zayka Restaurant"
                  className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                />
              </div>

              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">Section Description</label>
                <textarea
                  rows={2}
                  value={formData.restaurantDescription || ''}
                  onChange={(e) => handleFieldChange('restaurantDescription', e.target.value)}
                  className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                />
              </div>

              {/* Dual Pictures */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#e7e5e4]">
                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">
                    Restaurant Photo 1 URL (Left / Top)
                  </label>
                  <div className="flex gap-2 items-start">
                    <input
                      type="url"
                      value={formData.restaurantImage1Url || ''}
                      onChange={(e) => handleFieldChange('restaurantImage1Url', e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                    />
                    {formData.restaurantImage1Url && (
                      <img src={formData.restaurantImage1Url} alt="Dish 1" className="w-12 h-10 object-cover rounded border border-[#d6d3d1] shrink-0" />
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">
                    Restaurant Photo 2 URL (Right / Bottom)
                  </label>
                  <div className="flex gap-2 items-start">
                    <input
                      type="url"
                      value={formData.restaurantImage2Url || ''}
                      onChange={(e) => handleFieldChange('restaurantImage2Url', e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                    />
                    {formData.restaurantImage2Url && (
                      <img src={formData.restaurantImage2Url} alt="Dish 2" className="w-12 h-10 object-cover rounded border border-[#d6d3d1] shrink-0" />
                    )}
                  </div>
                </div>
              </div>

              {/* Timings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#e7e5e4]">
                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Breakfast Hours</label>
                  <input
                    type="text"
                    value={formData.restaurantTimings?.breakfast || ''}
                    onChange={(e) => handleFieldChange('restaurantTimings', {
                      ...formData.restaurantTimings,
                      breakfast: e.target.value,
                    })}
                    placeholder="07:30 - 10:30 AM"
                    className="w-full border border-[#d6d3d1] rounded px-3 py-1.5 text-xs text-[#1c1917]"
                  />
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Lunch Hours</label>
                  <input
                    type="text"
                    value={formData.restaurantTimings?.lunch || ''}
                    onChange={(e) => handleFieldChange('restaurantTimings', {
                      ...formData.restaurantTimings,
                      lunch: e.target.value,
                    })}
                    placeholder="12:30 - 03:30 PM"
                    className="w-full border border-[#d6d3d1] rounded px-3 py-1.5 text-xs text-[#1c1917]"
                  />
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Dinner Hours</label>
                  <input
                    type="text"
                    value={formData.restaurantTimings?.dinner || ''}
                    onChange={(e) => handleFieldChange('restaurantTimings', {
                      ...formData.restaurantTimings,
                      dinner: e.target.value,
                    })}
                    placeholder="07:30 - 11:00 PM"
                    className="w-full border border-[#d6d3d1] rounded px-3 py-1.5 text-xs text-[#1c1917]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">Room Dining Service Notice</label>
                <input
                  type="text"
                  value={formData.restaurantRoomServiceNotice || ''}
                  onChange={(e) => handleFieldChange('restaurantRoomServiceNotice', e.target.value)}
                  placeholder="In-room dining service available 24/7 for resident hotel guests."
                  className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                />
              </div>
            </div>
          )}
        </div>

        {/* SECTION 4: OTHER SECTION BANNERS & HEADERS */}
        <div className="border border-[#e7e5e4] rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('sections')}
            className="w-full p-4 bg-[#faf8f5] hover:bg-[#f5f0eb] flex items-center justify-between text-left transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#d4af37]/20 rounded-lg text-[#c49b29]">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-bold text-[#1c1917]">
                  4. Rooms, Banquets, Gallery, Places & Contact Section Banners
                </h4>
                <p className="text-[11px] text-[#78716c]">
                  Custom Eyebrows, Headings, and Descriptions for remaining pages.
                </p>
              </div>
            </div>
            {openSection === 'sections' ? <ChevronDown className="w-4 h-4 text-[#78716c]" /> : <ChevronRight className="w-4 h-4 text-[#78716c]" />}
          </button>

          {openSection === 'sections' && (
            <div className="p-5 space-y-6 text-xs border-t border-[#e7e5e4] bg-white">
              {/* Rooms Header */}
              <div className="space-y-2 p-3 bg-[#faf8f5] rounded-lg border border-[#e7e5e4]">
                <span className="font-bold text-[#1c1917] block">Rooms Section Header</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.roomsEyebrow || ''}
                    onChange={(e) => handleFieldChange('roomsEyebrow', e.target.value)}
                    placeholder="Eyebrow (e.g. Accommodation & Stays)"
                    className="border border-[#d6d3d1] rounded px-2.5 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    value={formData.roomsHeading || ''}
                    onChange={(e) => handleFieldChange('roomsHeading', e.target.value)}
                    placeholder="Heading (e.g. Curated Rooms & Suites)"
                    className="border border-[#d6d3d1] rounded px-2.5 py-1.5 text-xs font-semibold"
                  />
                </div>
                <textarea
                  rows={2}
                  value={formData.roomsDescription || ''}
                  onChange={(e) => handleFieldChange('roomsDescription', e.target.value)}
                  placeholder="Rooms Section Description"
                  className="w-full border border-[#d6d3d1] rounded px-2.5 py-1.5 text-xs"
                />
              </div>

              {/* Banquets Header */}
              <div className="space-y-2 p-3 bg-[#faf8f5] rounded-lg border border-[#e7e5e4]">
                <span className="font-bold text-[#1c1917] block">Banquets & Celebrations Section Header</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.banquetsEyebrow || ''}
                    onChange={(e) => handleFieldChange('banquetsEyebrow', e.target.value)}
                    placeholder="Eyebrow (e.g. Celebrations & Banqueting)"
                    className="border border-[#d6d3d1] rounded px-2.5 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    value={formData.banquetsHeading || ''}
                    onChange={(e) => handleFieldChange('banquetsHeading', e.target.value)}
                    placeholder="Heading (e.g. Celebrate at Udika Palace)"
                    className="border border-[#d6d3d1] rounded px-2.5 py-1.5 text-xs font-semibold"
                  />
                </div>
                <textarea
                  rows={2}
                  value={formData.banquetsDescription || ''}
                  onChange={(e) => handleFieldChange('banquetsDescription', e.target.value)}
                  placeholder="Banquets Section Description"
                  className="w-full border border-[#d6d3d1] rounded px-2.5 py-1.5 text-xs"
                />
              </div>

              {/* Gallery Header */}
              <div className="space-y-2 p-3 bg-[#faf8f5] rounded-lg border border-[#e7e5e4]">
                <span className="font-bold text-[#1c1917] block">Visual Gallery Section Header</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.galleryEyebrow || ''}
                    onChange={(e) => handleFieldChange('galleryEyebrow', e.target.value)}
                    placeholder="Eyebrow (e.g. Visual Glimpse)"
                    className="border border-[#d6d3d1] rounded px-2.5 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    value={formData.galleryHeading || ''}
                    onChange={(e) => handleFieldChange('galleryHeading', e.target.value)}
                    placeholder="Heading (e.g. The Udika Gallery)"
                    className="border border-[#d6d3d1] rounded px-2.5 py-1.5 text-xs font-semibold"
                  />
                </div>
                <textarea
                  rows={2}
                  value={formData.galleryDescription || ''}
                  onChange={(e) => handleFieldChange('galleryDescription', e.target.value)}
                  placeholder="Gallery Section Description"
                  className="w-full border border-[#d6d3d1] rounded px-2.5 py-1.5 text-xs"
                />
              </div>

              {/* Places Header */}
              <div className="space-y-2 p-3 bg-[#faf8f5] rounded-lg border border-[#e7e5e4]">
                <span className="font-bold text-[#1c1917] block">Explore Nearby Attractions Section Header</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.placesEyebrow || ''}
                    onChange={(e) => handleFieldChange('placesEyebrow', e.target.value)}
                    placeholder="Eyebrow (e.g. Singrauli & Waidhan Heritage)"
                    className="border border-[#d6d3d1] rounded px-2.5 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    value={formData.placesHeading || ''}
                    onChange={(e) => handleFieldChange('placesHeading', e.target.value)}
                    placeholder="Heading (e.g. Attractions & Regional Landmarks)"
                    className="border border-[#d6d3d1] rounded px-2.5 py-1.5 text-xs font-semibold"
                  />
                </div>
                <textarea
                  rows={2}
                  value={formData.placesDescription || ''}
                  onChange={(e) => handleFieldChange('placesDescription', e.target.value)}
                  placeholder="Places Section Description"
                  className="w-full border border-[#d6d3d1] rounded px-2.5 py-1.5 text-xs"
                />
              </div>

              {/* Contact Header */}
              <div className="space-y-2 p-3 bg-[#faf8f5] rounded-lg border border-[#e7e5e4]">
                <span className="font-bold text-[#1c1917] block">Contact & Concierge Section Header</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.contactEyebrow || ''}
                    onChange={(e) => handleFieldChange('contactEyebrow', e.target.value)}
                    placeholder="Eyebrow (e.g. Find Us & Connect)"
                    className="border border-[#d6d3d1] rounded px-2.5 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    value={formData.contactHeading || ''}
                    onChange={(e) => handleFieldChange('contactHeading', e.target.value)}
                    placeholder="Heading (e.g. Hospitality Concierge Desk)"
                    className="border border-[#d6d3d1] rounded px-2.5 py-1.5 text-xs font-semibold"
                  />
                </div>
                <textarea
                  rows={2}
                  value={formData.contactDescription || ''}
                  onChange={(e) => handleFieldChange('contactDescription', e.target.value)}
                  placeholder="Contact Section Description"
                  className="w-full border border-[#d6d3d1] rounded px-2.5 py-1.5 text-xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* SECTION 5: CONTACT NUMBERS, ADDRESS & SOCIAL CHANNELS */}
        <div className="border border-[#e7e5e4] rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('contact')}
            className="w-full p-4 bg-[#faf8f5] hover:bg-[#f5f0eb] flex items-center justify-between text-left transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#d4af37]/20 rounded-lg text-[#c49b29]">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-serif font-bold text-[#1c1917]">
                  5. Contact Numbers, Address, Check-in & GPS Coordinates
                </h4>
                <p className="text-[11px] text-[#78716c]">
                  Phone lines, WhatsApp, email, physical address, timings, and social links.
                </p>
              </div>
            </div>
            {openSection === 'contact' ? <ChevronDown className="w-4 h-4 text-[#78716c]" /> : <ChevronRight className="w-4 h-4 text-[#78716c]" />}
          </button>

          {openSection === 'contact' && (
            <div className="p-5 space-y-4 text-xs border-t border-[#e7e5e4] bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Public Phone Display</label>
                  <input
                    type="text"
                    value={formData.phoneDisplay || ''}
                    onChange={(e) => {
                      handleFieldChange('phoneDisplay', e.target.value);
                      handleFieldChange('phone', e.target.value.replace(/[^0-9+]/g, ''));
                    }}
                    className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                  />
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">WhatsApp Number (with Country Code)</label>
                  <input
                    type="text"
                    value={formData.whatsappNumber || ''}
                    onChange={(e) => {
                      handleFieldChange('whatsappNumber', e.target.value);
                      handleFieldChange('whatsappDisplay', e.target.value);
                    }}
                    className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                  />
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Reservation Email</label>
                  <input
                    type="email"
                    value={formData.bookingEmail || ''}
                    onChange={(e) => handleFieldChange('bookingEmail', e.target.value)}
                    className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#78716c] uppercase font-semibold mb-1">Street Address</label>
                <input
                  type="text"
                  value={formData.address || ''}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  className="w-full border border-[#d6d3d1] rounded-lg px-3 py-2 text-xs text-[#1c1917]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">City</label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => handleFieldChange('city', e.target.value)}
                    className="w-full border border-[#d6d3d1] rounded px-2.5 py-1.5 text-xs text-[#1c1917]"
                  />
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">State</label>
                  <input
                    type="text"
                    value={formData.state || ''}
                    onChange={(e) => handleFieldChange('state', e.target.value)}
                    className="w-full border border-[#d6d3d1] rounded px-2.5 py-1.5 text-xs text-[#1c1917]"
                  />
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Check-in Time</label>
                  <input
                    type="text"
                    value={formData.checkInTime || ''}
                    onChange={(e) => handleFieldChange('checkInTime', e.target.value)}
                    placeholder="12:00 PM"
                    className="w-full border border-[#d6d3d1] rounded px-2.5 py-1.5 text-xs text-[#1c1917]"
                  />
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Check-out Time</label>
                  <input
                    type="text"
                    value={formData.checkOutTime || ''}
                    onChange={(e) => handleFieldChange('checkOutTime', e.target.value)}
                    placeholder="11:00 AM"
                    className="w-full border border-[#d6d3d1] rounded px-2.5 py-1.5 text-xs text-[#1c1917]"
                  />
                </div>
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#e7e5e4]">
                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">GPS Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.coordinates?.lat || 24.0628}
                    onChange={(e) => handleFieldChange('coordinates', {
                      ...formData.coordinates,
                      lat: parseFloat(e.target.value),
                    })}
                    className="w-full border border-[#d6d3d1] rounded px-3 py-1.5 text-xs text-[#1c1917]"
                  />
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">GPS Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.coordinates?.lng || 82.6322}
                    onChange={(e) => handleFieldChange('coordinates', {
                      ...formData.coordinates,
                      lng: parseFloat(e.target.value),
                    })}
                    className="w-full border border-[#d6d3d1] rounded px-3 py-1.5 text-xs text-[#1c1917]"
                  />
                </div>
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#e7e5e4]">
                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Instagram Profile URL</label>
                  <input
                    type="url"
                    value={formData.socialLinks?.instagram || ''}
                    onChange={(e) => handleFieldChange('socialLinks', {
                      ...formData.socialLinks,
                      instagram: e.target.value,
                    })}
                    className="w-full border border-[#d6d3d1] rounded px-2.5 py-1.5 text-xs text-[#1c1917]"
                  />
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Facebook Page URL</label>
                  <input
                    type="url"
                    value={formData.socialLinks?.facebook || ''}
                    onChange={(e) => handleFieldChange('socialLinks', {
                      ...formData.socialLinks,
                      facebook: e.target.value,
                    })}
                    className="w-full border border-[#d6d3d1] rounded px-2.5 py-1.5 text-xs text-[#1c1917]"
                  />
                </div>

                <div>
                  <label className="block text-[#78716c] uppercase font-semibold mb-1">Google Maps Business Listing</label>
                  <input
                    type="url"
                    value={formData.socialLinks?.googleBusiness || ''}
                    onChange={(e) => handleFieldChange('socialLinks', {
                      ...formData.socialLinks,
                      googleBusiness: e.target.value,
                    })}
                    className="w-full border border-[#d6d3d1] rounded px-2.5 py-1.5 text-xs text-[#1c1917]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Save Action */}
        <div className="pt-4 flex items-center justify-between">
          <p className="text-xs text-[#78716c]">
            All updates sync automatically to live Firestore database and reflect instantly on the public website.
          </p>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center space-x-2 bg-[#1c1917] hover:bg-[#292524] text-[#faf8f5] px-6 py-3 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95"
          >
            <Save className="w-4 h-4 text-[#d4af37]" />
            <span>{isSaving ? 'Saving Changes...' : 'Save & Publish Live'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
