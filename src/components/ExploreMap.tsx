import React, { useState, useEffect, useRef } from 'react';
import { NearbyPlace, HotelSettings } from '../types';
import { 
  MapPin, Navigation, Compass, ExternalLink, Clock, 
  Sparkles, CheckCircle2, AlertCircle, Info, Layers, 
  Maximize2, Eye, Map as MapIcon, Route, Compass as CompassIcon
} from 'lucide-react';
import L from 'leaflet';

interface ExploreMapProps {
  settings: HotelSettings;
  places: NearbyPlace[];
}

// Calculate Haversine Distance in Kilometers
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export const ExploreMap: React.FC<ExploreMapProps> = ({ settings, places }) => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<'idle' | 'requesting' | 'granted' | 'denied'>('idle');
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(places[0]?.id || null);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  
  // Map View Mode:
  // 'google-live': Real-time Google Maps interactive live view with satellite / road / directions mode
  // 'interactive-osm': High-speed interactive multi-pin map with custom heritage markers
  // 'satellite': Real-time Esri world imagery satellite view
  const [mapMode, setMapMode] = useState<'google-live' | 'interactive-osm' | 'satellite'>('google-live');

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  const hotelCoords: [number, number] = [settings.coordinates.lat, settings.coordinates.lng];
  const activePlace = places.find((p) => p.id === selectedPlaceId) || places[0];

  // Initialize and update Leaflet Map when mode is 'interactive-osm' or 'satellite'
  useEffect(() => {
    if (mapMode === 'google-live') {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
      return;
    }

    if (!mapContainerRef.current) return;

    // Destroy existing instance if any
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    // Initialize Leaflet Map
    const initialCenter: [number, number] = activePlace 
      ? [activePlace.lat, activePlace.lng] 
      : hotelCoords;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 13,
      zoomControl: false,
      scrollWheelZoom: true,
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Pick tile layer based on map mode (crisp OpenStreetMap / Humanitarian or High-res Satellite)
    if (mapMode === 'satellite') {
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 18,
      }).addTo(map);

      // Add labels overlay
      L.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        attribution: '',
        maxZoom: 18,
      }).addTo(map);
    } else {
      // Crisp, free, high-contrast, fully reliable OpenStreetMap tiles (NO API KEY REQUIRED / NO WATERMARKS)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);
    }

    // Custom Hotel Marker Icon
    const hotelIcon = L.divIcon({
      className: 'custom-hotel-marker',
      html: `
        <div style="
          background: #1c1917;
          color: #d4af37;
          border: 2px solid #d4af37;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.5);
          font-family: serif;
          font-weight: bold;
          font-size: 16px;
        ">
          U
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });

    const hotelMarker = L.marker(hotelCoords, { icon: hotelIcon }).addTo(map);
    hotelMarker.bindPopup(`
      <div style="padding: 6px; font-family: sans-serif;">
        <span style="color: #c49b29; font-size: 10px; font-weight: bold; text-transform: uppercase;">Reference Base Hotel</span>
        <h4 style="font-size: 14px; font-weight: bold; margin: 2px 0 4px 0; color: #1c1917;">${settings.name}</h4>
        <p style="font-size: 11px; color: #57534e; margin: 0 0 6px 0;">${settings.address}, Waidhan, Singrauli</p>
        <span style="display: inline-block; padding: 2px 6px; background: #f5f0eb; border-radius: 4px; font-size: 10px; color: #1c1917; font-weight: 600;">Central Reference</span>
      </div>
    `);

    // Place Markers
    markersRef.current = {};
    places.forEach((place) => {
      const isSelected = place.id === selectedPlaceId;
      const placeIcon = L.divIcon({
        className: 'custom-place-marker',
        html: `
          <div style="
            background: ${isSelected ? '#c49b29' : '#1c1917'};
            color: ${isSelected ? '#1c1917' : '#faf8f5'};
            border: 2px solid #ffffff;
            width: ${isSelected ? '32px' : '28px'};
            height: ${isSelected ? '32px' : '28px'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.35);
            font-size: 13px;
            font-weight: bold;
            transition: all 0.2s ease;
          ">
            ★
          </div>
        `,
        iconSize: isSelected ? [32, 32] : [28, 28],
        iconAnchor: isSelected ? [16, 16] : [14, 14],
      });

      const marker = L.marker([place.lat, place.lng], { icon: placeIcon }).addTo(map);
      marker.bindPopup(`
        <div style="padding: 6px; font-family: sans-serif; max-width: 220px;">
          <span style="color: #c49b29; font-size: 10px; font-weight: bold; text-transform: uppercase;">${place.category}</span>
          <h4 style="font-size: 13px; font-weight: bold; margin: 2px 0 4px 0; color: #1c1917;">${place.name}</h4>
          <p style="font-size: 11px; color: #57534e; margin: 0 0 6px 0; line-height: 1.4;">${place.shortDescription}</p>
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 4px; border-top: 1px solid #e7e5e4;">
            <span style="font-size: 10px; color: #c49b29; font-weight: 700;">~${place.approxDistanceKm} km · ${place.approxDriveMinutes} min</span>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.googleMapsQuery || place.name + ' Singrauli')}" target="_blank" rel="noopener noreferrer" style="font-size: 10px; color: #2563eb; text-decoration: underline;">Directions &rarr;</a>
          </div>
        </div>
      `);

      marker.on('click', () => {
        setSelectedPlaceId(place.id);
      });

      markersRef.current[place.id] = marker;
    });

    // If a place is selected, open its popup
    if (selectedPlaceId && markersRef.current[selectedPlaceId]) {
      markersRef.current[selectedPlaceId].openPopup();
    }

    leafletMapRef.current = map;

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [places, settings, mapMode]);

  // Update Map when User Location is Granted
  useEffect(() => {
    if (!userLocation || !leafletMapRef.current || mapMode === 'google-live') return;

    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: `
        <div style="
          background: #2563eb;
          color: #ffffff;
          border: 2px solid #ffffff;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 0 8px rgba(37, 99, 235, 0.35);
        ">
          ●
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const userMarker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(leafletMapRef.current);
    userMarker.bindPopup('<b>Your Live Location</b><br>Distances calculated from your live coordinates.').openPopup();

    // Pan to include both User & Hotel
    const bounds = L.latLngBounds([hotelCoords, [userLocation.lat, userLocation.lng]]);
    leafletMapRef.current.fitBounds(bounds, { padding: [50, 50] });
  }, [userLocation, mapMode]);

  // Pan to selected place
  const handleSelectPlace = (place: NearbyPlace) => {
    setSelectedPlaceId(place.id);
    if (leafletMapRef.current && (mapMode === 'interactive-osm' || mapMode === 'satellite')) {
      leafletMapRef.current.flyTo([place.lat, place.lng], 14, { duration: 1.0 });
      const marker = markersRef.current[place.id];
      if (marker) {
        marker.openPopup();
      }
    }
  };

  // Browser Geolocation Flow
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your current browser.');
      return;
    }

    setLocationStatus('requesting');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationStatus('granted');
      },
      (err) => {
        console.warn('Location access denied or unavailable', err);
        setLocationStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const categories = ['ALL', 'Nature & Parks', 'Waterfalls & Lakes', 'Temples & Culture', 'Entertainment'];

  const filteredPlaces = places.filter((p) => {
    if (filterCategory === 'ALL') return true;
    return p.category === filterCategory;
  });

  // Dynamic Distance logic: if user has granted location, compute real-time distance from user; else from Hotel
  const computedDistanceFromUser = userLocation && activePlace
    ? calculateDistance(userLocation.lat, userLocation.lng, activePlace.lat, activePlace.lng)
    : null;

  // Real-time Google Maps Embed Query Construction
  const googleMapsSearchQuery = activePlace?.googleMapsQuery 
    ? encodeURIComponent(activePlace.googleMapsQuery)
    : activePlace 
      ? encodeURIComponent(`${activePlace.name} Singrauli Madhya Pradesh`)
      : encodeURIComponent(`Hotel Udika Palace Waidhan Singrauli`);

  const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${googleMapsSearchQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <section id="explore" className="py-20 lg:py-28 bg-[#faf8f5] border-t border-[#e7e5e4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest uppercase text-[#c49b29] mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>{settings.placesEyebrow || 'Singrauli & Waidhan Heritage Guide'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#1c1917] tracking-tight">
              {settings.placesHeading || `Explore Around ${settings.name}`}
            </h2>

            <p className="text-sm sm:text-base text-[#78716c] font-light mt-3 leading-relaxed">
              {settings.placesDescription || 'Discover famous tourist attractions, tranquil parks, dams, and temples in Waidhan & Singrauli with real-time live map views and seamless navigation directions directly from Hotel Udika Palace.'}
            </p>
          </div>

          {/* Location & Map Mode Controls */}
          <div className="shrink-0 flex flex-col sm:flex-row items-start sm:items-center gap-3">
            {/* View Mode Switcher */}
            <div className="inline-flex p-1 bg-[#e7e5e4] rounded-xl border border-[#d6d3d1]">
              <button
                id="mode-google-live"
                onClick={() => setMapMode('google-live')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  mapMode === 'google-live'
                    ? 'bg-[#1c1917] text-[#faf8f5] shadow-sm'
                    : 'text-[#57534e] hover:text-[#1c1917]'
                }`}
                title="Real-time Google Maps View"
              >
                <MapIcon className="w-3.5 h-3.5 text-[#c49b29]" />
                <span>Google Maps (Live)</span>
              </button>

              <button
                id="mode-interactive-osm"
                onClick={() => setMapMode('interactive-osm')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  mapMode === 'interactive-osm'
                    ? 'bg-[#1c1917] text-[#faf8f5] shadow-sm'
                    : 'text-[#57534e] hover:text-[#1c1917]'
                }`}
                title="Interactive Multi-Pin Map View"
              >
                <Layers className="w-3.5 h-3.5 text-[#c49b29]" />
                <span>All Landmarks</span>
              </button>

              <button
                id="mode-satellite"
                onClick={() => setMapMode('satellite')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  mapMode === 'satellite'
                    ? 'bg-[#1c1917] text-[#faf8f5] shadow-sm'
                    : 'text-[#57534e] hover:text-[#1c1917]'
                }`}
                title="Satellite View"
              >
                <Eye className="w-3.5 h-3.5 text-[#c49b29]" />
                <span>Satellite</span>
              </button>
            </div>

            {/* Geolocation Button */}
            {locationStatus !== 'granted' ? (
              <button
                id="use-my-location-btn"
                onClick={handleRequestLocation}
                disabled={locationStatus === 'requesting'}
                className="flex items-center space-x-2 px-4 py-2 bg-[#1c1917] hover:bg-[#292524] text-[#faf8f5] rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-md active:scale-95"
              >
                <Navigation className="w-4 h-4 text-[#c49b29]" />
                <span>
                  {locationStatus === 'requesting' ? 'Locating...' : 'My Live Distance'}
                </span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 px-3.5 py-2 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Live GPS Active</span>
              </div>
            )}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setFilterCategory(cat);
                const matching = places.filter((p) => cat === 'ALL' || p.category === cat);
                if (matching.length > 0 && !matching.some((m) => m.id === selectedPlaceId)) {
                  setSelectedPlaceId(matching[0].id);
                }
              }}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all uppercase ${
                filterCategory === cat
                  ? 'bg-[#1c1917] text-[#faf8f5] shadow-sm'
                  : 'bg-[#f5f0eb] text-[#78716c] hover:bg-[#e7e5e4] hover:text-[#1c1917]'
              }`}
            >
              {cat === 'ALL' ? 'All Attractions' : cat}
            </button>
          ))}
        </div>

        {/* Map & Interactive Drawer Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Map Container */}
          <div className="lg:col-span-8 relative rounded-2xl overflow-hidden shadow-xl border border-[#e7e5e4] bg-[#f5f0eb]">
            {/* Real-time Google Maps View */}
            {mapMode === 'google-live' && (
              <div className="relative h-[420px] sm:h-[540px] w-full bg-[#e7e5e4]">
                <iframe
                  id="google-maps-live-iframe"
                  title={`Live Google Map View - ${activePlace?.name || 'Hotel Udika Palace'}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={googleMapsEmbedUrl}
                  className="w-full h-full"
                />

                {/* Live Place Floating Tag */}
                <div className="absolute top-4 left-4 z-10 bg-[#1c1917]/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[#c49b29]/40 text-white shadow-xl max-w-xs">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#c49b29] animate-pulse"></span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#c49b29]">
                      Live Google Maps View
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white mt-1 line-clamp-1">
                    {activePlace?.name || 'Hotel Udika Palace'}
                  </h4>
                  <p className="text-[11px] text-[#d6d3d1] mt-0.5">
                    {activePlace?.address || 'Waidhan, Singrauli'}
                  </p>
                </div>
              </div>
            )}

            {/* Interactive Leaflet Map (Multi-pin and Satellite) */}
            {(mapMode === 'interactive-osm' || mapMode === 'satellite') && (
              <div className="relative">
                <div ref={mapContainerRef} className="h-[420px] sm:h-[540px] w-full z-10" />

                {/* Map Legend Overlay */}
                <div className="absolute top-4 left-4 z-20 bg-[#1c1917]/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-[#c49b29]/30 text-white text-xs space-y-1.5 shadow-lg hidden sm:block">
                  <div className="flex items-center space-x-2">
                    <span className="w-4 h-4 rounded-full bg-[#1c1917] border border-[#c49b29] text-[10px] text-[#c49b29] flex items-center justify-center font-bold">U</span>
                    <span className="font-semibold text-[11px]">{settings.name} (Hotel)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#c49b29] text-[9px] text-black flex items-center justify-center font-bold">★</span>
                    <span className="text-[11px] text-[#d6d3d1]">Selected Landmark</span>
                  </div>
                  {userLocation && (
                    <div className="flex items-center space-x-2">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#2563eb] text-[9px] text-white flex items-center justify-center font-bold">●</span>
                      <span className="text-[11px] text-[#d6d3d1]">Your Live Location</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Sub-bar: Status and Fast Direction Link */}
            <div className="bg-[#1c1917] text-[#a8a29e] px-4 py-2.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between border-t border-[#292524] gap-2">
              <span className="flex items-center space-x-2">
                <Info className="w-3.5 h-3.5 text-[#c49b29] shrink-0" />
                <span>
                  Showing <strong>{activePlace?.name}</strong> (~{activePlace?.approxDistanceKm} km from Hotel Udika Palace).
                </span>
              </span>

              <a
                href={`https://www.google.com/maps/dir/?api=1&origin=${hotelCoords[0]},${hotelCoords[1]}&destination=${encodeURIComponent(activePlace?.googleMapsQuery || activePlace?.name + ' Singrauli')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 text-[#c49b29] hover:text-white transition-colors font-semibold"
              >
                <Route className="w-3.5 h-3.5" />
                <span>Live Route on Google Maps &rarr;</span>
              </a>
            </div>
          </div>

          {/* Side Drawer: Selected Attraction & Places List */}
          <div className="lg:col-span-4 space-y-6">
            {/* Active Place Highlight Card */}
            {activePlace && (
              <div className="bg-[#f5f0eb] rounded-2xl overflow-hidden border border-[#e7e5e4] shadow-sm">
                <div className="h-44 relative">
                  <img
                    src={activePlace.heroImage}
                    alt={activePlace.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-[#1c1917]/85 backdrop-blur-sm rounded text-[10px] font-bold text-[#c49b29] uppercase">
                    {activePlace.category}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-serif font-bold text-[#1c1917] mb-1">
                    {activePlace.name}
                  </h3>
                  <p className="text-xs text-[#78716c] leading-relaxed mb-4">
                    {activePlace.shortDescription}
                  </p>

                  {/* Distance badges */}
                  <div className="p-3.5 bg-white rounded-xl border border-[#e7e5e4] mb-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#78716c]">From Hotel Udika Palace:</span>
                      <strong className="text-[#1c1917]">
                        Approx. {activePlace.approxDistanceKm} km · {activePlace.approxDriveMinutes} min drive
                      </strong>
                    </div>

                    {computedDistanceFromUser !== null && (
                      <div className="flex items-center justify-between text-blue-700 pt-1.5 border-t border-blue-50">
                        <span>From Your Live Location:</span>
                        <strong>Approx. {computedDistanceFromUser} km</strong>
                      </div>
                    )}

                    {activePlace.openingHours && (
                      <div className="flex items-center justify-between text-[#57534e] pt-1.5 border-t border-[#f5f0eb]">
                        <span>Timings:</span>
                        <span>{activePlace.openingHours}</span>
                      </div>
                    )}

                    {activePlace.travelTips && (
                      <div className="text-[11px] text-[#78716c] pt-1.5 border-t border-[#f5f0eb]">
                        <strong className="text-[#1c1917]">Travel Tip:</strong> {activePlace.travelTips}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons: Live Google Maps Directions & In-Map View */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&origin=${hotelCoords[0]},${hotelCoords[1]}&destination=${encodeURIComponent(activePlace.googleMapsQuery || activePlace.name + ' Singrauli')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#1c1917] hover:bg-[#292524] text-[#faf8f5] py-2.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-colors shadow-sm text-center"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#c49b29]" />
                      <span>Directions</span>
                    </a>

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activePlace.googleMapsQuery || activePlace.name + ' Singrauli')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white hover:bg-[#f5f0eb] text-[#1c1917] border border-[#d6d3d1] py-2.5 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-colors shadow-sm text-center"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#c49b29]" />
                      <span>Open in App</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Selector List of Nearby Landmarks */}
            <div className="bg-white rounded-2xl border border-[#e7e5e4] p-4 shadow-sm max-h-[360px] overflow-y-auto">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#1c1917]">
                  Tour & Sightseeing Places ({filteredPlaces.length})
                </h4>
                <span className="text-[10px] text-[#78716c]">Click to view on map</span>
              </div>

              <div className="space-y-2">
                {filteredPlaces.map((place) => (
                  <div
                    key={place.id}
                    onClick={() => handleSelectPlace(place)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedPlaceId === place.id
                        ? 'border-[#c49b29] bg-[#fdfbf7] shadow-sm'
                        : 'border-[#e7e5e4] hover:border-[#d6d3d1] hover:bg-[#faf8f5]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img src={place.heroImage} alt="thumb" className="w-11 h-11 rounded-lg object-cover" />
                      <div>
                        <h5 className="text-xs font-bold text-[#1c1917] line-clamp-1">{place.name}</h5>
                        <span className="text-[10px] text-[#78716c] block">{place.category}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-semibold text-[#c49b29] block">
                        ~{place.approxDistanceKm} km
                      </span>
                      <span className="text-[10px] text-[#a8a29e] flex items-center justify-end space-x-0.5">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>Live View</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
