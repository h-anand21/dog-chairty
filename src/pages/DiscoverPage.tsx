import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Dog } from '../types';
import { DogCard } from '../components/discover/DogCard';
import { PawMap } from '../components/map/PawMap';
import { CitySearchInput } from '../components/common/CitySearchInput';
import { PillarDetailModal, PillarType } from '../components/common/PillarDetailModal';
import { useApp } from '../context/AppContext';
import { useAudio } from '../context/AudioContext';
import {
  Search,
  Sparkles,
  MapPin,
  Heart,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  FileCheck,
  Volume2,
  Smile,
  Flame,
  Award,
  Plus,
  X,
  ChevronRight,
  Grid,
  Map as MapIcon,
} from 'lucide-react';

interface DiscoverPageProps {
  onSelectDog: (dog: Dog) => void;
}

// Common dog breed synonyms, phonetic variations & typo aliases
const BREED_SYNONYMS: Record<string, string[]> = {
  labrador: ['lab', 'labber', 'labra', 'labby', 'labs', 'retriever', 'labrado', 'black lab', 'yellow lab', 'chocolate lab'],
  golden: ['gold', 'goldan', 'retriver', 'retriever', 'goldie', 'goldy'],
  beagle: ['beagl', 'begal', 'beegal', 'begle', 'hound'],
  shepherd: ['german', 'germ', 'germon', 'germn', 'shep', 'gsd', 'shephard', 'alsatian', 'gshepherd'],
  indie: ['desi', 'indian', 'indi', 'indee', 'street', 'pariah', 'stray', 'mixed', 'desi dog', 'rescue'],
  shih: ['tzu', 'shitzu', 'shihtzu', 'toy', 'small dog', 'fluffy'],
  husky: ['husk', 'siberian'],
  rottweiler: ['rott', 'rotweiler'],
};

function checkFuzzyTokenMatch(token: string, targetText: string): boolean {
  if (!token || !targetText) return false;
  const t = token.toLowerCase().trim();
  const text = targetText.toLowerCase().trim();
  if (text.includes(t) || t.includes(text)) return true;

  // Prefix matching (>= 3 chars)
  if (t.length >= 3 && text.length >= 3) {
    if (text.startsWith(t.slice(0, 3)) || t.startsWith(text.slice(0, 3))) return true;
  }

  // Check breed synonyms dictionary
  for (const [canonical, aliases] of Object.entries(BREED_SYNONYMS)) {
    const isTokenInGroup = canonical.includes(t) || t.includes(canonical) || aliases.some(a => a.includes(t) || t.includes(a));
    const isTextInGroup = text.includes(canonical) || aliases.some(a => text.includes(a));
    if (isTokenInGroup && isTextInGroup) return true;
  }

  // Simple edit distance for typos (e.g. labber -> labrador)
  if (Math.abs(t.length - text.length) <= 3 && t.length >= 3 && text.length >= 3) {
    let diffs = 0;
    const minLen = Math.min(t.length, text.length);
    for (let i = 0; i < minLen; i++) {
      if (t[i] !== text[i]) diffs++;
    }
    if (diffs <= 2) return true;
  }

  return false;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({ onSelectDog }) => {
  const { dogs, setSelectedDog, setIsApplyModalOpen, setIsListDogOpen } = useApp();
  const { playPawPop, playDogBark } = useAudio();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPillar, setSelectedPillar] = useState<PillarType>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Click outside to dismiss search suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Dynamic Cities Filter List derived from active dogs
  const cityOptions = useMemo(() => {
    const dogCities = Array.from(new Set(dogs.map(d => d.city).filter(Boolean))) as string[];
    return dogCities.length > 0 ? ['All', ...dogCities] : ['All'];
  }, [dogs]);

  // Live Auto-Complete Suggestions (Dogs, Breeds, Traits)
  const searchSuggestions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    // 1. Matching dogs (name or breed)
    const matchingDogs = dogs.filter(d =>
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.breed.toLowerCase().includes(q) ||
      checkFuzzyTokenMatch(q, d.name) ||
      checkFuzzyTokenMatch(q, d.breed)
    ).slice(0, 4);

    // 2. Matching Breeds
    const allBreeds = Array.from(new Set(dogs.map(d => d.breed)));
    const matchingBreeds = allBreeds.filter(b =>
      !q || b.toLowerCase().includes(q) || checkFuzzyTokenMatch(q, b)
    ).slice(0, 4);

    // 3. Matching Traits & Categories
    const allTraits = ['Playful', 'Good with Kids', 'House-Trained', 'Water Lover', 'Gentle & Calm', 'Free Adoption'];
    const matchingTraits = allTraits.filter(t =>
      !q || t.toLowerCase().includes(q)
    ).slice(0, 4);

    return {
      matchingDogs,
      matchingBreeds,
      matchingTraits,
    };
  }, [dogs, searchQuery]);

  // Filtered Dogs Logic with Fuzzy & Alias Support
  const filteredDogs = useMemo(() => {
    return dogs.filter((dog: Dog) => {
      // 1. Comprehensive Smart Fuzzy & Alias text search
      const matchesSearch = (() => {
        if (!searchQuery.trim()) return true;
        const queryTokens = searchQuery.toLowerCase().trim().split(/\s+/);
        
        const haystack = [
          dog.name,
          dog.breed,
          dog.location,
          dog.city,
          dog.state,
          dog.bio,
          dog.gender,
          dog.size,
          dog.energy,
          dog.adoptionType,
          ...dog.favoriteThings,
          ...dog.personalityTraits,
        ].join(' ').toLowerCase();

        return queryTokens.every(token => {
          if (haystack.includes(token)) return true;
          const words = haystack.split(/\s+/);
          return words.some(w => checkFuzzyTokenMatch(token, w));
        });
      })();

      // 2. City filter
      const matchesCity =
        selectedCity === 'All' ||
        dog.location.toLowerCase().includes(selectedCity.toLowerCase()) ||
        (dog.city && dog.city.toLowerCase().includes(selectedCity.toLowerCase()));

      // 3. Status filter
      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'available' && dog.status === 'available') ||
        (selectedStatus === 'in_progress' && dog.status !== 'available' && dog.status !== 'adopted') ||
        (selectedStatus === 'adopted' && dog.status === 'adopted');

      // 4. Size filter
      const matchesSize = selectedSize === 'All' || dog.size === selectedSize;

      // 5. Category Chips
      let matchesCategory = true;
      if (selectedCategory === 'playful') {
        matchesCategory = dog.energy.includes('High') || dog.energy.includes('Zoomies');
      } else if (selectedCategory === 'gentle') {
        matchesCategory = dog.personalityTraits.some(t => t.toLowerCase().includes('gentle') || t.toLowerCase().includes('calm'));
      } else if (selectedCategory === 'kids') {
        matchesCategory = dog.personalityTraits.some(t => t.toLowerCase().includes('kid') || t.toLowerCase().includes('friendly'));
      } else if (selectedCategory === 'water') {
        matchesCategory = dog.personalityTraits.some(t => t.toLowerCase().includes('water')) || dog.favoriteThings.some(f => f.toLowerCase().includes('pool') || f.toLowerCase().includes('lake'));
      }

      return matchesSearch && matchesCity && matchesStatus && matchesSize && matchesCategory;
    });
  }, [dogs, searchQuery, selectedCity, selectedStatus, selectedSize, selectedCategory]);

  // Real adoption stories derived from actual adopted dogs in app state
  const realAdoptedDogs = dogs.filter(d => d.status === 'adopted');

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      
      {/* 🌟 1. HERO SECTION WITH SEARCH CARD */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 px-4 sm:px-6 lg:px-8">
        
        {/* Ambient Gradient Blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-coral-400/20 via-amber-300/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10 space-y-10">
          
          {/* Main Headline & Story */}
          <div className="text-center space-y-5 max-w-3xl mx-auto">
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-obsidian-900 dark:text-white font-extrabold text-xs tracking-wider uppercase shadow-xs">
              <span className="text-base">🐾</span>
              <span>100% Direct Pet Guardian Adoption Across India</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-obsidian-950 dark:text-white leading-[1.08]">
              Find Your Canine Friend. <br />
              <span className="text-gradient-coral">
                Give a Loving Forever Home.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-obsidian-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              Direct connection between pet parents and loving adopters. Verified vet clearances, interactive map pins, direct private chat, park meetups, and digital legal handovers.
            </p>

          </div>

          {/* 🔍 Hero Quick Match & Search Box */}
          <div className="glass-card rounded-4xl p-4 sm:p-6 max-w-4xl mx-auto shadow-elevated border border-white dark:border-white/10 space-y-4 relative z-30 overflow-visible">
            
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 relative z-30">
              
              {/* Search text */}
              <div ref={searchContainerRef} className="sm:col-span-7 relative z-40">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-coral-500 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search breed, name, traits (e.g. Labrador, Golden, Indie, Playful)..."
                  className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-white dark:bg-[#121A2B] border border-obsidian-200 dark:border-white/15 text-xs sm:text-sm font-semibold text-obsidian-900 dark:text-white placeholder:text-obsidian-400 dark:placeholder:text-slate-400 focus:border-coral-500 focus:ring-4 focus:ring-coral-100 dark:focus:ring-coral-500/20 outline-hidden transition-all shadow-xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      playPawPop();
                      setSearchQuery('');
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-obsidian-100 dark:bg-white/10 hover:bg-obsidian-200 dark:hover:bg-white/20 text-obsidian-600 dark:text-slate-300 flex items-center justify-center text-xs transition-colors cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* 🌟 Live Auto-Complete Suggestions Dropdown (100% Solid & High-Contrast) */}
                {isSearchFocused && (
                  <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 bg-[#FFFFFF] dark:bg-[#0E1526] rounded-3xl shadow-2xl border-2 border-coral-500/40 dark:border-coral-500/50 overflow-hidden max-h-84 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150 text-left divide-y divide-obsidian-200 dark:divide-white/10 ring-4 ring-black/10 dark:ring-black/50">
                    
                    {/* Matching Dog Names */}
                    {searchSuggestions.matchingDogs.length > 0 && (
                      <div className="p-2.5 bg-white dark:bg-[#0E1526]">
                        <div className="px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-coral-600 dark:text-coral-400 bg-coral-50/80 dark:bg-[#152035] rounded-xl mb-1.5 flex items-center justify-between">
                          <span>🐾 Available Puppies</span>
                          <span className="text-[10px] text-obsidian-500 dark:text-slate-400 font-bold">Direct Guardian Verified</span>
                        </div>
                        <div className="space-y-1">
                          {searchSuggestions.matchingDogs.map(d => (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => {
                                playPawPop();
                                setSearchQuery(d.name);
                                setIsSearchFocused(false);
                              }}
                              className="w-full px-3 py-2 rounded-2xl bg-white dark:bg-[#0E1526] hover:bg-coral-500/10 dark:hover:bg-coral-500/15 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer group border border-transparent hover:border-coral-500/30"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <img
                                  src={d.coverPhoto}
                                  alt={d.name}
                                  className="w-9 h-9 rounded-xl object-cover ring-2 ring-coral-400 shrink-0"
                                />
                                <div className="truncate">
                                  <div className="text-xs font-black text-obsidian-950 dark:text-white group-hover:text-coral-600 dark:group-hover:text-coral-400 truncate">
                                    {d.name}
                                  </div>
                                  <div className="text-[10px] text-obsidian-600 dark:text-slate-300 font-semibold truncate">
                                    {d.breed} • 📍 {d.location}
                                  </div>
                                </div>
                              </div>
                              <span className="text-[10px] font-black px-2.5 py-1 rounded-full bg-coral-100 dark:bg-coral-950 text-coral-700 dark:text-coral-300 shrink-0 border border-coral-200 dark:border-coral-800">
                                {d.age}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Matching Breeds */}
                    {searchSuggestions.matchingBreeds.length > 0 && (
                      <div className="p-2.5 bg-[#F8FAFC] dark:bg-[#111A2E]">
                        <div className="px-2 py-1 text-[11px] font-black uppercase tracking-wider text-obsidian-600 dark:text-slate-300 flex items-center gap-1 mb-1">
                          <span>🐕 Breeds</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 px-1">
                          {searchSuggestions.matchingBreeds.map((breed, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                playPawPop();
                                setSearchQuery(breed);
                                setIsSearchFocused(false);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#18243A] hover:bg-coral-500 hover:text-white text-obsidian-900 dark:text-white text-xs font-black transition-all cursor-pointer border border-obsidian-200 dark:border-white/15 shadow-xs"
                            >
                              🔍 {breed}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Popular Traits & Keywords */}
                    {searchSuggestions.matchingTraits.length > 0 && (
                      <div className="p-2.5 bg-white dark:bg-[#0E1526]">
                        <div className="px-2 py-1 text-[11px] font-black uppercase tracking-wider text-obsidian-600 dark:text-slate-300 mb-1">
                          <span>⚡ Traits & Categories</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 px-1">
                          {searchSuggestions.matchingTraits.map((trait, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                playPawPop();
                                setSearchQuery(trait);
                                setIsSearchFocused(false);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-[#F1F5F9] dark:bg-[#18243A] hover:bg-coral-500 hover:text-white text-obsidian-800 dark:text-slate-200 text-xs font-bold border border-obsidian-200 dark:border-white/10 cursor-pointer transition-colors shadow-xs"
                            >
                              ✨ {trait}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                )}
              </div>

              {/* Dynamic Indian City Search Input */}
              <div className="sm:col-span-5 relative z-40">
                <CitySearchInput
                  value={selectedCity}
                  onSelectCity={city => setSelectedCity(city)}
                  placeholder="Filter By City (e.g. Mumbai, Delhi, Kolkata)..."
                />
              </div>

            </div>

            {/* Quick Category Pills, View Mode Switcher & Count */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-obsidian-200/80 dark:border-white/10">
              
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-black uppercase text-obsidian-400 dark:text-slate-400 mr-1 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-coral-500" />
                  Filter:
                </span>

                {[
                  { id: 'all', label: '🐾 All Dogs' },
                  { id: 'playful', label: '⚡ Active & Playful' },
                  { id: 'gentle', label: '🧸 Gentle & Calm' },
                  { id: 'kids', label: '👶 Great with Kids' },
                  { id: 'water', label: '🏊 Water Lovers' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      playPawPop();
                      setSelectedCategory(cat.id);
                    }}
                    className={`px-3 py-1.5 rounded-full font-extrabold text-xs transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-coral-500 text-white shadow-glow-coral'
                        : 'bg-obsidian-100 dark:bg-white/5 hover:bg-obsidian-200 dark:hover:bg-white/15 text-obsidian-700 dark:text-slate-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                {/* 🗺️ Grid vs Map View Switcher */}
                <div className="p-0.5 bg-obsidian-100 dark:bg-white/10 rounded-xl flex items-center gap-0.5 border border-obsidian-200 dark:border-white/10 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => {
                      playPawPop();
                      setViewMode('grid');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-black flex items-center gap-1 transition-all cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-[#121A2B] text-obsidian-950 dark:text-white shadow-xs'
                        : 'text-obsidian-600 dark:text-slate-400 hover:text-obsidian-950 dark:hover:text-white'
                    }`}
                  >
                    <Grid className="w-3 h-3" />
                    <span>Grid</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playPawPop();
                      setViewMode('map');
                      setTimeout(() => {
                        document.getElementById('marketplace-grid')?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-black flex items-center gap-1 transition-all cursor-pointer ${
                      viewMode === 'map'
                        ? 'bg-coral-500 text-white shadow-glow-coral'
                        : 'text-obsidian-600 dark:text-slate-400 hover:text-coral-500'
                    }`}
                  >
                    <MapIcon className="w-3 h-3" />
                    <span>Map 🗺️</span>
                  </button>
                </div>

                <div className="text-xs font-bold text-obsidian-600 dark:text-slate-300">
                  <span className="text-coral-600 dark:text-coral-400 font-black">{filteredDogs.length}</span> pup{filteredDogs.length === 1 ? '' : 's'} available
                </div>
              </div>

            </div>

          </div>

          {/* 4 Trust & Safety Pillars (Interactive Feature Explanations) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-2">
            
            <button
              onClick={() => {
                playPawPop();
                setSelectedPillar('medicals');
              }}
              className="glass-card p-3.5 rounded-2xl text-left border border-white dark:border-white/10 hover:border-emerald-300 dark:hover:border-emerald-500/50 hover:shadow-card flex items-center gap-3 transition-all cursor-pointer group hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center text-lg shrink-0 transition-colors shadow-2xs">
                💉
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h4 className="text-xs font-black text-obsidian-950 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">100% Medicals</h4>
                </div>
                <p className="text-[10px] text-obsidian-500 dark:text-slate-400 font-medium truncate">Verified vet panels ➔</p>
              </div>
            </button>

            <button
              onClick={() => {
                playPawPop();
                setSelectedPillar('chat');
              }}
              className="glass-card p-3.5 rounded-2xl text-left border border-white dark:border-white/10 hover:border-coral-300 dark:hover:border-coral-500/50 hover:shadow-card flex items-center gap-3 transition-all cursor-pointer group hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-xl bg-coral-50 dark:bg-coral-950/60 text-coral-600 dark:text-coral-400 group-hover:bg-coral-500 group-hover:text-white flex items-center justify-center text-lg shrink-0 transition-colors shadow-2xs">
                💬
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h4 className="text-xs font-black text-obsidian-950 dark:text-white group-hover:text-coral-700 dark:group-hover:text-coral-400 transition-colors">Direct Chat</h4>
                </div>
                <p className="text-[10px] text-obsidian-500 dark:text-slate-400 font-medium truncate">Message real owners ➔</p>
              </div>
            </button>

            <button
              onClick={() => {
                playPawPop();
                setSelectedPillar('park_meetup');
              }}
              className="glass-card p-3.5 rounded-2xl text-left border border-white dark:border-white/10 hover:border-sky-300 dark:hover:border-sky-500/50 hover:shadow-card flex items-center gap-3 transition-all cursor-pointer group hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 group-hover:bg-sky-500 group-hover:text-white flex items-center justify-center text-lg shrink-0 transition-colors shadow-2xs">
                🌳
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h4 className="text-xs font-black text-obsidian-950 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors">Park Meetup</h4>
                </div>
                <p className="text-[10px] text-obsidian-500 dark:text-slate-400 font-medium truncate">Safe in-person meet ➔</p>
              </div>
            </button>

            <button
              onClick={() => {
                playPawPop();
                setSelectedPillar('dual_handover');
              }}
              className="glass-card p-3.5 rounded-2xl text-left border border-white dark:border-white/10 hover:border-amber-300 dark:hover:border-amber-500/50 hover:shadow-card flex items-center gap-3 transition-all cursor-pointer group hover:-translate-y-0.5"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:bg-amber-500 group-hover:text-white flex items-center justify-center text-lg shrink-0 transition-colors shadow-2xs">
                📜
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1">
                  <h4 className="text-xs font-black text-obsidian-950 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">Dual Handover</h4>
                </div>
                <p className="text-[10px] text-obsidian-500 dark:text-slate-400 font-medium truncate">Legal transfer cert ➔</p>
              </div>
            </button>

          </div>

        </div>
      </section>



      {/* 🐶 2. DIRECT DOG ADOPTION MARKETPLACE (GRID / MAP VIEW) */}
      <section id="marketplace-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28 space-y-6">
        
        {/* Sleek Direct Adoption Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-obsidian-200/80 dark:border-white/10">
          <div className="space-y-1 text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-500/10 text-coral-600 dark:text-coral-400 font-extrabold text-xs uppercase tracking-wider border border-coral-200 dark:border-coral-800/40">
              <Sparkles className="w-3.5 h-3.5 text-coral-500" />
              <span>Direct Adoption Marketplace</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-obsidian-950 dark:text-white">
              Adoptable Pups & Dogs 🐕
            </h2>
            <p className="text-xs sm:text-sm text-obsidian-600 dark:text-slate-300 font-normal">
              Verified dogs listed directly by real pet guardians. Click any dog card to view full details or apply for free adoption!
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
            {/* View Mode Switcher Pills */}
            <div className="p-1 bg-obsidian-100 dark:bg-white/10 rounded-2xl flex items-center gap-1 border border-obsidian-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'grid'
                    ? 'bg-coral-500 text-white shadow-glow-coral'
                    : 'text-obsidian-700 dark:text-slate-300 hover:text-obsidian-950 dark:hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Grid View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'map'
                    ? 'bg-coral-500 text-white shadow-glow-coral'
                    : 'text-obsidian-700 dark:text-slate-300 hover:text-obsidian-950 dark:hover:text-white'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Paw Map</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* VIEW 1: INTERACTIVE REAL MAP */}
        {viewMode === 'map' && (
          <div className="animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black text-obsidian-800 dark:text-slate-200">
                <MapPin className="w-4 h-4 text-coral-500" />
                <span>Interactive Paw Map: Click any pup pin to view details or apply</span>
              </div>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className="text-xs font-bold text-coral-600 dark:text-coral-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Switch to Grid View</span>
              </button>
            </div>
            <PawMap
              dogs={filteredDogs}
              onSelectDog={onSelectDog}
              height="620px"
            />
          </div>
        )}

        {/* VIEW 2: STANDARD GRID */}
        {viewMode === 'grid' && (
          <>
            {filteredDogs.length === 0 ? (
              <div className="glass-card rounded-4xl p-12 sm:p-16 text-center border border-white dark:border-white/10 shadow-card max-w-lg mx-auto space-y-4">
                <div className="w-20 h-20 rounded-full bg-coral-50 dark:bg-coral-950/60 text-coral-500 mx-auto flex items-center justify-center text-4xl shadow-glow-coral">
                  🐕✨
                </div>
                <h3 className="text-2xl font-black font-display text-obsidian-950 dark:text-white">
                  No Mock Pups Listed!
                </h3>
                <p className="text-xs sm:text-sm text-obsidian-600 dark:text-slate-300 leading-relaxed font-medium">
                  All initial fake/demo dog listings have been cleared. Be the first real pet parent to list a dog for adoption on PawConnect!
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      playPawPop();
                      setIsListDogOpen(true);
                    }}
                    className="btn-primary text-white px-6 py-3 rounded-full font-black text-xs cursor-pointer shadow-glow-coral flex items-center gap-2"
                  >
                    <span>🐾 List a Real Dog Now</span>
                  </button>
                  {(searchQuery || selectedCity !== 'All' || selectedCategory !== 'all') && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCity('All');
                        setSelectedStatus('all');
                        setSelectedSize('All');
                        setSelectedCategory('all');
                      }}
                      className="px-5 py-3 rounded-full bg-obsidian-100 dark:bg-white/10 text-obsidian-800 dark:text-slate-200 font-bold text-xs cursor-pointer hover:bg-obsidian-200 transition-colors"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredDogs.map((dog: Dog) => (
                  <DogCard
                    key={dog.id}
                    dog={dog}
                    onSelect={onSelectDog}
                  />
                ))}
              </div>
            )}
          </>
        )}

      </section>

      {/* 🎉 4. HAPPY TAILS & SUCCESS STORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-5xl p-6 sm:p-12 border border-white dark:border-white/10 shadow-elevated space-y-8 text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-black text-xs uppercase tracking-wider mb-2 border border-emerald-200 dark:border-emerald-800/60">
                <Smile className="w-3.5 h-3.5" />
                <span>Happy Tails</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black font-display text-obsidian-950 dark:text-white">
                Recent Adoption Success Stories 🎉
              </h2>
              <p className="text-xs sm:text-sm text-obsidian-600 dark:text-slate-300 mt-1">
                Real dogs and families united through PawConnect&apos;s verified handover system.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-black text-obsidian-700 dark:text-slate-300">
              <Award className="w-4 h-4 text-amber-500" />
              <span>100% Genuine Handover Verified</span>
            </div>
          </div>

          {realAdoptedDogs.length === 0 ? (
            <div className="glass-card rounded-4xl p-10 text-center border border-white dark:border-white/10 max-w-lg mx-auto space-y-3">
              <div className="text-4xl">🏆✨</div>
              <h3 className="text-lg font-black font-display text-obsidian-950 dark:text-white">
                No Real Adoption Handovers Yet
              </h3>
              <p className="text-xs text-obsidian-600 dark:text-slate-300 leading-relaxed font-medium">
                When real pet parents complete a verified 6-Stage Handover Protocol, their official Gold Certificate and Happy Tails story will automatically appear here!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {realAdoptedDogs.map(dog => (
                <div
                  key={dog.id}
                  className="bg-white dark:bg-[#121A2B] rounded-3xl p-6 border border-obsidian-200 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-4 relative hover:shadow-card transition-all"
                >
                  <div className="space-y-4">
                    <div className="relative h-48 rounded-2xl overflow-hidden bg-obsidian-100 dark:bg-white/5">
                      <img
                        src={dog.coverPhoto}
                        alt={dog.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-md">
                        ✓ Adopted
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-obsidian-950 dark:text-white">
                        {dog.name} ({dog.breed})
                      </h3>
                      <p className="text-xs font-semibold text-obsidian-500 dark:text-slate-400">
                        Adopted by <strong className="text-obsidian-900 dark:text-white">{dog.newOwnerName || 'Verified Parent'}</strong> • {dog.location}
                      </p>
                    </div>

                    <p className="text-xs text-obsidian-700 dark:text-slate-300 leading-relaxed italic font-normal">
                      &ldquo;Completed verified handover on PawConnect with full vet records.&rdquo;
                    </p>
                  </div>

                  <div className="pt-3 border-t border-obsidian-200 dark:border-white/10 flex items-center justify-between text-[11px] font-bold text-obsidian-500 dark:text-slate-400">
                    <span>{dog.adoptedDate || 'Recently Adopted'}</span>
                    <span className="text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800/60">
                      Gold Cert #{dog.certificateId || 'CERT-PAW'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 🐾 5. LIST A DOG / REHOMING SUPPORT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-5xl p-8 sm:p-14 bg-gradient-to-r from-obsidian-950 via-obsidian-900 to-obsidian-950 text-white overflow-hidden shadow-2xl border border-white/10 text-left">
          
          {/* Background Glow */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-coral-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-coral-300 font-black text-xs uppercase tracking-wider backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Safe Rehoming Guaranteed</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white leading-tight">
              Need to Find a Loving Home for Your Dog?
            </h2>

            <p className="text-xs sm:text-base text-white/80 leading-relaxed font-normal">
              Life circumstances change. Ensure your companion gets the best possible home with our verified adopter questionnaires, in-person park meets, and legal adoption agreements. 100% Free.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  playPawPop();
                  setIsListDogOpen(true);
                }}
                className="btn-primary text-white px-8 py-4 rounded-full font-black text-sm shadow-glow-coral flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Post Your Dog for Adoption (Free) 🚀</span>
              </button>

              <span className="text-xs text-white/60 font-semibold">
                ✓ Over 12,000+ happy Indian adoptions completed
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Trust Pillar Detail Modal */}
      <PillarDetailModal
        pillar={selectedPillar}
        onClose={() => setSelectedPillar(null)}
      />

    </div>
  );
};
