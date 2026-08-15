import React, { useState, useEffect, useRef } from 'react';
import { mapService } from '../../services/mapService';
import { GeocodedLocation } from '../../types';
import { useAudio } from '../../context/AudioContext';
import { MapPin, Search, X, Loader2 } from 'lucide-react';

interface CitySearchInputProps {
  value: string;
  onSelectCity: (city: string) => void;
  placeholder?: string;
}

export const CitySearchInput: React.FC<CitySearchInputProps> = ({
  value,
  onSelectCity,
  placeholder = 'Search Your City (e.g. Delhi, Kolkata, Mumbai, Pune, Patna)...',
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

  // Click outside to close dropdown
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
      }, 300);
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

  const handleClear = () => {
    playPawPop();
    setQuery('');
    onSelectCity('All');
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full text-left">
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-coral-500" />
        
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
          <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400 animate-spin" />
        )}

        {!isSearching && query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-obsidian-100 hover:bg-obsidian-200 text-obsidian-600 flex items-center justify-center text-xs transition-colors cursor-pointer"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Autocomplete Suggestions */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1.5 bg-white rounded-2xl shadow-2xl border border-obsidian-200 overflow-hidden max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
          
          <div className="px-4 py-2 bg-obsidian-50 border-b border-obsidian-100 flex items-center justify-between text-[10px] font-black uppercase text-obsidian-500">
            <span>Select Indian City / Area</span>
            <button
              onClick={() => handleSelect('All')}
              className="text-coral-600 hover:underline cursor-pointer"
            >
              Show All India 🇮🇳
            </button>
          </div>

          {suggestions.map((loc, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelect(loc.city || loc.displayName.split(',')[0])}
              className="w-full px-4 py-2.5 text-left hover:bg-coral-50 transition-colors flex items-start gap-2.5 border-b border-obsidian-100 last:border-0 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-coral-500 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-xs font-black text-obsidian-950 truncate">
                  {loc.city || loc.displayName.split(',')[0]}
                </div>
                <div className="text-[10px] font-medium text-obsidian-500 truncate">
                  {loc.displayName}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
