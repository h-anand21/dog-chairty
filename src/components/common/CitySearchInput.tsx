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
          className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white dark:bg-[#121A2B] border border-obsidian-200 dark:border-white/15 text-xs sm:text-sm font-bold text-obsidian-900 dark:text-white placeholder:text-obsidian-400 dark:placeholder:text-slate-400 focus:border-coral-500 focus:ring-4 focus:ring-coral-100 dark:focus:ring-coral-500/20 outline-hidden transition-all shadow-xs"
        />

        {isSearching && (
          <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400 dark:text-slate-400 animate-spin pointer-events-none" />
        )}

        {!isSearching && query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-obsidian-100 dark:bg-white/10 hover:bg-obsidian-200 dark:hover:bg-white/20 text-obsidian-600 dark:text-slate-300 hover:text-obsidian-950 dark:hover:text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
            title="Clear city filter"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Clean Floating Suggestions Dropdown (100% Solid & High Contrast) */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-[100] bg-[#FFFFFF] dark:bg-[#0E1526] rounded-3xl shadow-2xl border-2 border-coral-500/40 dark:border-coral-500/50 overflow-hidden max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150 ring-4 ring-black/10 dark:ring-black/50 text-left divide-y divide-obsidian-100 dark:divide-white/10">
          
          {/* Dropdown Header */}
          <div className="px-4 py-2.5 bg-[#F1F5F9] dark:bg-[#141E33] border-b border-obsidian-200 dark:border-white/10 flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-coral-600 dark:text-coral-400">
            <span>Matching Indian Cities / Areas</span>
            <button
              type="button"
              onClick={() => handleSelect('All')}
              className="text-coral-600 dark:text-coral-400 hover:text-coral-700 font-extrabold hover:underline cursor-pointer"
            >
              Show All India 🇮🇳
            </button>
          </div>

          {/* List of Suggestions */}
          <div className="py-1 bg-[#FFFFFF] dark:bg-[#0E1526]">
            {suggestions.map((loc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelect(loc.city || loc.displayName.split(',')[0])}
                className="w-full px-4 py-3 text-left bg-[#FFFFFF] dark:bg-[#0E1526] hover:bg-coral-50 dark:hover:bg-[#162238] transition-colors flex items-start gap-3 border-b border-obsidian-100 dark:border-white/10 last:border-0 cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-xl bg-coral-50 dark:bg-coral-950/60 text-coral-600 dark:text-coral-400 group-hover:bg-coral-500 group-hover:text-white flex items-center justify-center shrink-0 transition-colors mt-0.5 shadow-2xs">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-black text-obsidian-950 dark:text-white group-hover:text-coral-600 dark:group-hover:text-coral-400 transition-colors truncate">
                    {loc.city || loc.displayName.split(',')[0]}
                  </div>
                  <div className="text-[11px] font-medium text-obsidian-600 dark:text-slate-300 truncate mt-0.5">
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
