import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Dog } from '../../types';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { mapService } from '../../services/mapService';
import {
  MapPin,
  Heart,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Navigation,
  CheckCircle2,
} from 'lucide-react';

interface PawMapProps {
  dogs: Dog[];
  onSelectDog: (dog: Dog) => void;
  height?: string;
  initialUserGps?: { lat: number; lng: number } | null;
}

export const PawMap: React.FC<PawMapProps> = ({
  dogs,
  onSelectDog,
  height = '580px',
  initialUserGps = null,
}) => {
  const { setSelectedDog, setIsApplyModalOpen, theme } = useApp();
  const { playPawPop } = useAudio();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [activeDog, setActiveDog] = useState<Dog | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; name: string } | null>(
    initialUserGps ? { lat: initialUserGps.lat, lng: initialUserGps.lng, name: 'My Location' } : null
  );
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Remove old instance if exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Default to first dog's coordinates or India center (Kolkata/Delhi)
    const defaultLat = initialUserGps?.lat || dogs[0]?.lat || 22.5867;
    const defaultLng = initialUserGps?.lng || dogs[0]?.lng || 88.4178;

    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: initialUserGps ? 13 : 11,
      zoomControl: false,
      attributionControl: false,
    });

    // High quality Voyager tiles
    const tileUrl = theme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    mapInstanceRef.current = map;

    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when dogs change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const bounds = L.latLngBounds([]);

    dogs.forEach(dog => {
      if (!dog.lat || !dog.lng) return;

      bounds.extend([dog.lat, dog.lng]);

      // Custom Paw Marker Icon with Dog Photo
      const customIcon = L.divIcon({
        className: 'custom-paw-marker',
        html: `
          <div class="relative group cursor-pointer transform -translate-x-1/2 -translate-y-full hover:scale-115 transition-transform duration-300">
            <div class="w-12 h-12 rounded-2xl bg-white dark:bg-[#152033] p-1 shadow-card-hover border-2 border-coral-500 flex items-center justify-center relative">
              <img src="${dog.coverPhoto}" alt="${dog.name}" class="w-full h-full object-cover rounded-xl" />
              <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-coral-500 rounded-full flex items-center justify-center text-[10px] text-white shadow-xs">
                🐾
              </div>
            </div>
            <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-coral-500 rotate-45 rounded-xs"></div>
            <div class="bg-obsidian-950/90 text-white text-[10px] font-black px-2 py-0.5 rounded-full mt-2 text-center whitespace-nowrap shadow-md opacity-90 group-hover:opacity-100">
              ${dog.name}
            </div>
          </div>
        `,
        iconSize: [48, 56],
        iconAnchor: [24, 56],
      });

      const marker = L.marker([dog.lat, dog.lng], { icon: customIcon }).addTo(map);

      marker.on('click', () => {
        playPawPop();
        setActiveDog(dog);
        map.flyTo([dog.lat, dog.lng], 14, { duration: 0.8 });

        if (userLocation) {
          const dist = mapService.calculateDistance(userLocation.lat, userLocation.lng, dog.lat, dog.lng);
          setDistanceKm(dist);
        }
      });

      markersRef.current.push(marker);
    });

    if (dogs.length > 1 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    } else if (dogs.length === 1 && dogs[0].lat && dogs[0].lng) {
      map.setView([dogs[0].lat, dogs[0].lng], 13);
    }

    return () => clearTimeout(timer);
  }, [dogs, userLocation]);

  // Detect and Fly to User GPS Location
  const handleLocateMe = async () => {
    playPawPop();
    setIsLocating(true);
    try {
      const loc = await mapService.getUserLocation();
      setUserLocation({ lat: loc.lat, lng: loc.lng, name: loc.displayName });

      const map = mapInstanceRef.current;
      if (map) {
        if (userMarkerRef.current) userMarkerRef.current.remove();

        const userIcon = L.divIcon({
          className: 'user-gps-marker',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="w-8 h-8 rounded-full bg-sky-500/30 animate-ping absolute"></div>
              <div class="w-6 h-6 rounded-full bg-sky-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs">
                📍
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        userMarkerRef.current = L.marker([loc.lat, loc.lng], { icon: userIcon }).addTo(map);
        map.flyTo([loc.lat, loc.lng], 13, { duration: 1.5 });
      }
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="relative w-full rounded-4xl overflow-hidden shadow-elevated border border-obsidian-200 dark:border-white/10 bg-white dark:bg-[#101726] text-left">
      
      {/* MAP CANVAS CONTAINER */}
      <div
        ref={mapContainerRef}
        style={{ height, minHeight: '480px' }}
        className="w-full z-0 relative"
      />

      {/* TOP CONTROLS OVERLAY */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        
        {/* Active Location Badge */}
        <div className="pointer-events-auto bg-white dark:bg-[#0E1526] px-4 py-2 rounded-full shadow-lg border-2 border-obsidian-200 dark:border-white/15 flex items-center gap-2 text-xs font-black text-obsidian-950 dark:text-white">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Map: {dogs.length} Pups Pinned Across India</span>
        </div>

        {/* GPS Locate Me Button */}
        <button
          onClick={handleLocateMe}
          disabled={isLocating}
          className="pointer-events-auto btn-primary text-white px-4 py-2 rounded-full text-xs font-black shadow-glow-coral flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-all"
        >
          <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'Detecting GPS...' : '📍 Near Me'}</span>
        </button>

      </div>

      {/* BOTTOM SELECTED DOG POPUP CARD OVERLAY */}
      {activeDog && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-30 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-white dark:bg-[#0E1526] p-4 sm:p-5 rounded-3xl shadow-2xl border-2 border-coral-500/30 dark:border-coral-500/40 space-y-3 text-left">
            
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={activeDog.coverPhoto}
                  alt={activeDog.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-coral-400 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-lg font-black text-obsidian-950 dark:text-white">
                      {activeDog.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-coral-50 dark:bg-coral-950/60 text-coral-600 dark:text-coral-300 text-[10px] font-black border border-coral-200 dark:border-coral-800/60">
                      {activeDog.age}
                    </span>
                  </div>
                  <p className="text-xs text-obsidian-600 dark:text-slate-300 font-semibold mt-0.5">
                    {activeDog.breed} • {activeDog.gender}
                  </p>
                  <div className="flex items-center gap-1 text-[11px] text-coral-600 dark:text-coral-400 font-bold mt-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{activeDog.location}</span>
                    {distanceKm !== null && (
                      <span className="text-obsidian-500 dark:text-slate-400 font-medium">
                        ({distanceKm} km away)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveDog(null)}
                className="w-7 h-7 rounded-full bg-obsidian-100 dark:bg-white/10 hover:bg-obsidian-200 dark:hover:bg-white/20 flex items-center justify-center text-obsidian-700 dark:text-slate-300 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-obsidian-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
              &ldquo;{activeDog.bio}&rdquo;
            </p>

            <div className="flex items-center gap-2 pt-1 border-t border-obsidian-200 dark:border-white/10">
              <button
                onClick={() => {
                  playPawPop();
                  onSelectDog(activeDog);
                }}
                className="flex-1 py-2.5 rounded-xl bg-obsidian-100 dark:bg-white/10 hover:bg-obsidian-200 dark:hover:bg-white/20 text-obsidian-950 dark:text-white font-black text-xs transition-all cursor-pointer text-center"
              >
                View Full Profile
              </button>

              <button
                onClick={() => {
                  playPawPop();
                  setSelectedDog(activeDog);
                  setIsApplyModalOpen(true);
                }}
                className="flex-1 py-2.5 rounded-xl btn-primary text-white font-black text-xs shadow-glow-coral transition-all cursor-pointer flex items-center justify-center gap-1"
              >
                <span>Adopt {activeDog.name}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
