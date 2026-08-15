import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mapService } from '../../services/mapService';
import { GeocodedLocation } from '../../types';
import { useAudio } from '../../context/AudioContext';
import { MapPin, Search, Navigation, CheckCircle2, Loader2 } from 'lucide-react';

interface LocationPickerProps {
  value: string;
  initialLat?: number;
  initialLng?: number;
  onChange: (location: {
    displayName: string;
    city: string;
    state: string;
    lat: number;
    lng: number;
    pincode?: string;
  }) => void;
  label?: string;
  placeholder?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  initialLat = 22.5867,
  initialLng = 88.4178,
  onChange,
  label = 'Location in India *',
  placeholder = 'Search area, city, pincode, or landmark...',
}) => {
  const { playPawPop } = useAudio();

  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<GeocodedLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng,
  });
  const [isLocating, setIsLocating] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(false);

  const miniMapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Sync incoming value
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Debounced Live Location Search
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setQuery(text);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (text.trim().length >= 2) {
      setIsSearching(true);
      setShowSuggestions(true);

      searchTimeoutRef.current = setTimeout(async () => {
        const results = await mapService.searchLocations(text);
        setSuggestions(results);
        setIsSearching(false);
      }, 350);
    } else {
      setSuggestions([]);
      setIsSearching(false);
    }
  };

  // Select a suggestion
  const handleSelectLocation = (loc: GeocodedLocation) => {
    playPawPop();
    setQuery(loc.displayName);
    setSelectedCoords({ lat: loc.lat, lng: loc.lng });
    setShowSuggestions(false);

    onChange({
      displayName: loc.displayName,
      city: loc.city,
      state: loc.state,
      lat: loc.lat,
      lng: loc.lng,
      pincode: loc.pincode,
    });

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([loc.lat, loc.lng], 15);
      if (markerRef.current) {
        markerRef.current.setLatLng([loc.lat, loc.lng]);
      }
    }
  };

  // Detect GPS
  const handleUseGps = async () => {
    playPawPop();
    setIsLocating(true);
    try {
      const loc = await mapService.getUserLocation();
      handleSelectLocation(loc);
    } finally {
      setIsLocating(false);
    }
  };

  // Initialize or update Mini Map
  useEffect(() => {
    if (!showMiniMap || !miniMapRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(miniMapRef.current, {
        center: [selectedCoords.lat, selectedCoords.lng],
        zoom: 14,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      const pinIcon = L.divIcon({
        className: 'location-pin-icon',
        html: `
          <div class="relative cursor-grab active:cursor-grabbing transform -translate-x-1/2 -translate-y-full">
            <div class="w-9 h-9 rounded-2xl bg-coral-500 text-white flex items-center justify-center text-base shadow-lg border-2 border-white">
              📍
            </div>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-coral-500 rotate-45"></div>
          </div>
        `,
        iconSize: [36, 44],
        iconAnchor: [18, 44],
      });

      const marker = L.marker([selectedCoords.lat, selectedCoords.lng], {
        icon: pinIcon,
        draggable: true,
      }).addTo(map);

      // Drag to adjust coordinates
      marker.on('dragend', async (e: any) => {
        const { lat, lng } = e.target.getLatLng();
        setSelectedCoords({ lat, lng });
        const rev = await mapService.reverseGeocode(lat, lng);
        setQuery(rev.displayName);
        onChange({
          displayName: rev.displayName,
          city: rev.city,
          state: rev.state,
          lat,
          lng,
          pincode: rev.pincode,
        });
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
    } else {
      mapInstanceRef.current.setView([selectedCoords.lat, selectedCoords.lng], 14);
      if (markerRef.current) {
        markerRef.current.setLatLng([selectedCoords.lat, selectedCoords.lng]);
      }
    }
  }, [showMiniMap, selectedCoords]);

  return (
    <div className="space-y-2 text-left relative">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-black text-obsidian-900 uppercase tracking-wider">
          {label}
        </label>
        
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMiniMap(!showMiniMap)}
            className="text-[11px] font-bold text-coral-600 hover:text-coral-700 underline cursor-pointer"
          >
            {showMiniMap ? 'Hide Map Pin' : '📍 Adjust Pin on Map'}
          </button>

          <button
            type="button"
            onClick={handleUseGps}
            disabled={isLocating}
            className="text-[11px] font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer"
          >
            <Navigation className={`w-3 h-3 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Use GPS'}</span>
          </button>
        </div>
      </div>

      {/* Input Field with Live Search Icon */}
      <div className="relative">
        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-coral-500" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-3 rounded-2xl bg-obsidian-100 border border-obsidian-200 focus:bg-white focus:border-coral-500 focus:ring-4 focus:ring-coral-100 text-xs sm:text-sm font-bold text-obsidian-950 outline-hidden transition-all shadow-inner"
        />

        {isSearching && (
          <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400 animate-spin" />
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white rounded-2xl shadow-2xl border border-obsidian-200 overflow-hidden max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
          <div className="p-2 text-[10px] uppercase font-black tracking-wider text-obsidian-400 border-b border-obsidian-100">
            Matching Locations in India:
          </div>
          {suggestions.map((loc, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectLocation(loc)}
              className="w-full px-4 py-2.5 text-left hover:bg-coral-50 transition-colors flex items-start gap-2.5 border-b border-obsidian-100 last:border-0 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-coral-500 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-xs font-bold text-obsidian-950 truncate">
                  {loc.displayName}
                </div>
                <div className="text-[10px] font-medium text-obsidian-500">
                  {loc.city}, {loc.state} {loc.pincode ? `• PIN: ${loc.pincode}` : ''}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Mini Interactive Map Pinpoint */}
      {showMiniMap && (
        <div className="rounded-3xl overflow-hidden border border-obsidian-200 shadow-md mt-2 animate-in fade-in duration-200">
          <div className="p-2 bg-obsidian-950 text-white text-[11px] font-bold flex items-center justify-between px-3">
            <span>📍 Drag the red marker to adjust your exact location</span>
            <span className="text-[10px] text-white/60">
              {selectedCoords.lat.toFixed(4)}, {selectedCoords.lng.toFixed(4)}
            </span>
          </div>
          <div ref={miniMapRef} style={{ height: '220px' }} className="w-full" />
        </div>
      )}
    </div>
  );
};
