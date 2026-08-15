import React, { useState, useEffect, useRef } from 'react';
import { mapService } from '../../services/mapService';
import { GeocodedLocation } from '../../types';
import { useAudio } from '../../context/AudioContext';
import { MapPin, Search, X, Loader2, Compass } from 'lucide-react';

interface CitySearchInputProps {
  value: string;
  onSelectCity: (city: string) => void;
  placeholder?: string;
}

export const CitySearchInput: React.FC<CitySearchInputProps> = ({
  value,
  onSelectCity,
  placeholder = 'Search Your City (e.g. Mumbai, Delhi, Kolkata, Pune)...',
}) => {
  const { playPawPop } = useAudio();
  const [query, setQuery] = useState(value === 'All' ? '' : value);
  const [suggestions, setSuggestions] = useState<GeocodedLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value === 'All' ? '' : value);
  }, [value]);

  // Click outside to dismiss dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setQuery(text);

    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

    if (text.trim().length >= 2) {
      setIsSearching(true);
      setIsOpen(true);
      searchTimeoutRef.current = setTimeout(async () => {
        const results = await mapService.searchLocations(text);
        setSuggestions(results);
        setIsSearching(false);
      }, 250);
    } else {
      setSuggestions([]);
      setIsSearching(false);
      if (text.trim().length === 0) {
        onSelectCity('All');
      }
    }
  };

  const handleSelect = (city: string) => {
    playPawPop();
    setQuery(city);
    onSelectCity(city);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPawPop();
    setQuery('');
    onSelectCity('All');
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full text-left z-40">
      
      {/* Search Input Box */}
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-coral-500 pointer-events-none" />
        
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white border border-obsidian-200 text-xs sm:text-sm font-bold text-obsidian-900 placeholder:text-obsidian-400 focus:border-coral-500 focus:ring-4 focus:ring-coral-100 outline-hidden transition-all shadow-xs"
        />

        {isSearching && (
          <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400 animate-spin pointer-events-none" />
        )}

        {!isSearching && query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-obsidian-100 hover:bg-obsidian-200 text-obsidian-600 hover:text-obsidian-950 flex items-center justify-center text-xs transition-colors cursor-pointer"
            title="Clear city filter"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Clean Floating Suggestions Dropdown (Sits directly beneath the input) */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 bg-white/98 backdrop-blur-2xl rounded-3xl shadow-2xl border border-obsidian-200/90 overflow-hidden max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150 ring-1 ring-black/5">
          
          {/* Dropdown Header */}
          <div className="px-4 py-2.5 bg-obsidian-50/80 border-b border-obsidian-100 flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-obsidian-500">
            <span>Matching Indian Cities / Areas</span>
            <button
              type="button"
              onClick={() => handleSelect('All')}
              className="text-coral-600 hover:text-coral-700 font-extrabold hover:underline cursor-pointer"
            >
              Show All India 🇮🇳
            </button>
          </div>

          {/* List of Suggestions */}
          <div className="py-1">
            {suggestions.map((loc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(loc.city || loc.displayName.split(',')[0])}
                className="w-full px-4 py-3 text-left hover:bg-coral-50/80 transition-colors flex items-start gap-3 border-b border-obsidian-100/70 last:border-0 cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-xl bg-coral-50 text-coral-600 group-hover:bg-coral-500 group-hover:text-white flex items-center justify-center shrink-0 transition-colors mt-0.5 shadow-2xs">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-black text-obsidian-950 group-hover:text-coral-600 transition-colors truncate">
                    {loc.city || loc.displayName.split(',')[0]}
                  </div>
                  <div className="text-[11px] font-medium text-obsidian-500 truncate mt-0.5">
                    {loc.displayName}
                  </div>
                </div>
              </button>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};
