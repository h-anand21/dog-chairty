import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Dog } from '../types';
import { DogCard } from '../components/discover/DogCard';
import { PawMap } from '../components/map/PawMap';
import { CitySearchInput } from '../components/common/CitySearchInput';
import { PillarDetailModal, PillarType } from '../components/common/PillarDetailModal';
import { FaqSection } from '../components/common/FaqSection';
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

// Curated High-Resolution Clean Hero Dogs (Without flowers in mouth) for 3-Second Slider
const HERO_DOG_SLIDES = [
  {
    name: 'Bruno',
    breed: 'Labrador Retriever',
    url: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?w=1000&auto=format&fit=crop&q=80',
    tag: 'Friendly & Playful 🐾'
  },
  {
    name: 'Simba',
    breed: 'Golden Retriever',
    url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=1000&auto=format&fit=crop&q=80',
    tag: 'Gentle & Loving 💛'
  },
  {
    name: 'Chiku',
    breed: 'Indian Indie Rescue',
    url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1000&auto=format&fit=crop&q=80',
    tag: 'Smart & Active ⚡'
  },
  {
    name: 'Max',
    breed: 'German Shepherd',
    url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=1000&auto=format&fit=crop&q=80',
    tag: 'Loyal Guardian 🛡️'
  },
  {
    name: 'Rocky',
    breed: 'Beagle',
    url: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=1000&auto=format&fit=crop&q=80',
    tag: 'Curious Explorer 🔍'
  }
];

export const DiscoverPage: React.FC<DiscoverPageProps> = ({ onSelectDog }) => {
  const {
    dogs,
    setSelectedDog,
    setIsApplyModalOpen,
    setIsListDogOpen,
    currentUser,
    requireAuth,
    successStories,
    likeSuccessStory,
    setIsShareStoryOpen,
  } = useApp();
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

  // 🐾 3-Second Auto-Rotating Hero Dog Slider State
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlideIndex(prev => (prev + 1) % HERO_DOG_SLIDES.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const currentHeroSlide = HERO_DOG_SLIDES[heroSlideIndex];

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
      
      {/* 🌟 1. HERO SECTION WITH HIGH-IMPACT TWO-COLUMN LAYOUT & SEARCH BOX */}
      <section className="relative overflow-hidden pt-6 sm:pt-10 pb-10 px-4 sm:px-6 lg:px-8">
        
        {/* Ambient Gradient Blobs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] bg-gradient-to-tr from-coral-500/15 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10 space-y-10">
          
          {/* TWO COLUMN HERO GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Headlines & Pillars */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              {/* Top Tag Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-coral-50 dark:bg-[#1A2333] border border-coral-200 dark:border-white/10 text-coral-700 dark:text-white font-extrabold text-xs tracking-wider uppercase shadow-xs">
                <span className="text-coral-500">🐾</span>
                <span>100% Direct Pet Guardian Adoption Across India</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-obsidian-950 dark:text-white leading-[1.05]">
                Find Your Canine <br />
                Friend. <br />
                <span className="text-gradient-coral inline-flex items-center gap-2">
                  Give a Loving Forever Home.
                  <span className="text-coral-500 text-3xl font-normal inline-block transform rotate-6">♡</span>
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-obsidian-600 dark:text-slate-300 max-w-xl leading-relaxed font-normal">
                Direct connection between pet parents and loving adopters. Verified vet clearances, interactive map pins, direct private chat, park meetups, and digital legal handovers.
              </p>

              {/* 4 Feature Pills Row */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    playPawPop();
                    setSelectedPillar('chat');
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-white dark:bg-[#131B2A] border border-obsidian-200 dark:border-white/10 text-obsidian-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 hover:border-coral-500 transition-colors cursor-pointer shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                  <span>Verified Guardians</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playPawPop();
                    setSelectedPillar('medicals');
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-white dark:bg-[#131B2A] border border-obsidian-200 dark:border-white/10 text-obsidian-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 hover:border-coral-500 transition-colors cursor-pointer shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                  <span>Vet Cleared</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playPawPop();
                    setSelectedPillar('park_meetup');
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-white dark:bg-[#131B2A] border border-obsidian-200 dark:border-white/10 text-obsidian-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 hover:border-coral-500 transition-colors cursor-pointer shadow-xs"
                >
                  <Heart className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
                  <span>Safe Meets</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playPawPop();
                    setSelectedPillar('dual_handover');
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-white dark:bg-[#131B2A] border border-obsidian-200 dark:border-white/10 text-obsidian-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 hover:border-coral-500 transition-colors cursor-pointer shadow-xs"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
                  <span>Legal Handover</span>
                </button>
              </div>

            </div>

            {/* Right Column: Seamless Blended Hero Dog & Floating Card */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              
              {/* Warm Bokeh Light Blobs behind Dog */}
              <div className="absolute -top-10 -right-10 w-[380px] h-[380px] bg-amber-500/20 rounded-full blur-[90px] pointer-events-none" />
              <div className="absolute top-20 right-10 w-[260px] h-[260px] bg-coral-500/25 rounded-full blur-[70px] pointer-events-none" />

              <div className="relative w-full max-w-md">
                
                {/* Floating Orange Accent Doodle Lines فوق Dog Head */}
                <div className="absolute -top-6 right-20 z-20 flex items-center gap-1 text-coral-500 dark:text-coral-400 font-bold text-lg pointer-events-none select-none tracking-widest opacity-90 animate-pulse">
                  \ | /
                </div>

                {/* Main Hero Dog Photo Slider with Smooth Fade Transition */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl group border border-obsidian-200 dark:border-white/10 bg-slate-900 dark:bg-[#0B0F19]">
                  <img
                    key={currentHeroSlide.url}
                    src={currentHeroSlide.url}
                    alt={currentHeroSlide.name}
                    className="w-full h-[440px] sm:h-[460px] object-cover object-center group-hover:scale-105 transition-all duration-700 ease-out animate-in fade-in zoom-in-95"
                  />
                  
                  {/* Seamless Vignette Fades to blend into website background */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 dark:from-[#0B0F19] via-transparent to-black/30 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/30 dark:from-[#0B0F19]/40 via-transparent to-slate-950/30 dark:to-[#0B0F19]/40 pointer-events-none" />

                  {/* Live Breed Badge Overlay at top left of hero photo */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-xs font-black border border-white/20 shadow-md animate-in fade-in duration-300">
                      🐶 {currentHeroSlide.name} ({currentHeroSlide.breed})
                    </span>
                  </div>

                  {/* Slider Pagination Dots at bottom left */}
                  <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/15">
                    {HERO_DOG_SLIDES.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          playPawPop();
                          setHeroSlideIndex(idx);
                        }}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          idx === heroSlideIndex ? 'w-6 bg-coral-500' : 'w-2 bg-white/40 hover:bg-white'
                        }`}
                        title={`Show ${HERO_DOG_SLIDES[idx].breed}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Floating Card on Bottom Right */}
                <div className="absolute bottom-6 -right-3 p-4 rounded-3xl bg-white/95 dark:bg-[#101726]/95 border border-obsidian-200 dark:border-white/15 shadow-2xl backdrop-blur-xl max-w-[200px] text-left space-y-1.5 z-20 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-8 h-8 rounded-xl bg-coral-500/20 text-coral-500 flex items-center justify-center text-base font-black border border-coral-500/30">
                    ♡
                  </div>
                  <p className="text-xs font-bold text-obsidian-900 dark:text-slate-200 leading-snug">
                    Every adoption writes a new <span className="text-coral-600 dark:text-coral-400 font-extrabold">happy story.</span>
                  </p>
                </div>

              </div>
            </div>

          </div>

          {/* 🔍 SEARCH & FILTER CONTAINER BOX */}
          <div className="bg-white dark:bg-[#101726] rounded-3xl p-4 sm:p-6 border border-obsidian-200 dark:border-white/10 shadow-elevated space-y-4 text-left">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
              
              {/* Input 1: Search Breed/Name */}
              <div ref={searchContainerRef} className="lg:col-span-6 relative z-40">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-coral-500 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => {
                    setSearchQuery(e.target.value);
                    setIsSearchFocused(true);
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search breed, name, traits (e.g. Labrador, Golden, Indie)..."
                  className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-obsidian-50 dark:bg-[#162033] border border-obsidian-200 dark:border-white/10 text-xs sm:text-sm font-semibold text-obsidian-950 dark:text-white placeholder:text-obsidian-400 dark:placeholder:text-slate-400 focus:border-coral-500 focus:ring-2 focus:ring-coral-500/20 outline-hidden transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      playPawPop();
                      setSearchQuery('');
                    }}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-obsidian-200 dark:bg-white/10 hover:bg-obsidian-300 dark:hover:bg-white/20 text-obsidian-700 dark:text-slate-300 flex items-center justify-center text-xs transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                {/* Live Auto-Complete Dropdown */}
                {isSearchFocused && (
                  <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 bg-white dark:bg-[#0E1526] rounded-3xl shadow-2xl border-2 border-coral-500/50 overflow-hidden max-h-84 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150 text-left divide-y divide-obsidian-100 dark:divide-white/10 ring-4 ring-black/10 dark:ring-black/50">
                    {searchSuggestions.matchingDogs.length > 0 && (
                      <div className="p-2.5 bg-white dark:bg-[#0E1526]">
                        <div className="px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-coral-600 dark:text-coral-400 bg-coral-50 dark:bg-[#152035] rounded-xl mb-1.5 flex items-center justify-between">
                          <span>🐾 Available Puppies</span>
                          <span className="text-[10px] text-obsidian-500 dark:text-slate-400 font-bold">Guardian Verified</span>
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
                              className="w-full px-3 py-2 rounded-2xl bg-white dark:bg-[#0E1526] hover:bg-coral-50 dark:hover:bg-coral-500/15 flex items-center justify-between gap-3 text-left transition-colors cursor-pointer group border border-transparent hover:border-coral-500/30"
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
                  </div>
                )}
              </div>

              {/* Input 2: Filter by City */}
              <div className="lg:col-span-3 relative z-30">
                <CitySearchInput
                  value={selectedCity}
                  onSelectCity={city => setSelectedCity(city)}
                  placeholder="Filter by City (e.g. Mumbai, Delhi, Kolkata)..."
                />
              </div>

              {/* Action Button: Search Dogs */}
              <div className="lg:col-span-3">
                <button
                  type="button"
                  onClick={() => {
                    playPawPop();
                    document.getElementById('marketplace-grid')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-coral-500 to-orange-500 hover:from-coral-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm shadow-glow-coral flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <span>Search Dogs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Category Chips & View Switches Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-obsidian-200/80 dark:border-white/10">
              
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-obsidian-500 dark:text-slate-400 mr-1">Filter by:</span>

                {[
                  { id: 'all', label: '🐾 All Dogs' },
                  { id: 'playful', label: '⚡ Active & Playful' },
                  { id: 'gentle', label: '🤎 Gentle & Calm' },
                  { id: 'kids', label: '😀 Great with Kids' },
                  { id: 'water', label: '💧 Water Lovers' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      playPawPop();
                      setSelectedCategory(cat.id);
                    }}
                    className={`px-3.5 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-coral-500 text-white shadow-glow-coral'
                        : 'bg-obsidian-100 dark:bg-[#162033] hover:bg-obsidian-200 dark:hover:bg-white/10 text-obsidian-800 dark:text-slate-300 border border-obsidian-200/80 dark:border-white/10'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4">
                {/* View Mode Switcher */}
                <div className="p-1 bg-obsidian-100 dark:bg-[#162033] rounded-xl flex items-center gap-1 border border-obsidian-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      viewMode === 'grid'
                        ? 'bg-coral-500 text-white shadow-xs'
                        : 'text-obsidian-600 dark:text-slate-400 hover:text-obsidian-950 dark:hover:text-white'
                    }`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>Grid</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('map')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      viewMode === 'map'
                        ? 'bg-coral-500 text-white shadow-xs'
                        : 'text-obsidian-600 dark:text-slate-400 hover:text-obsidian-950 dark:hover:text-white'
                    }`}
                  >
                    <MapIcon className="w-3.5 h-3.5" />
                    <span>Map</span>
                  </button>
                </div>

                <div className="text-xs font-extrabold text-coral-600 dark:text-coral-400 flex items-center gap-1">
                  <span>{filteredDogs.length}+ pups available 🐾</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* 🐶 2. DIRECT DOG ADOPTION MARKETPLACE (GRID / MAP VIEW) */}
      <section id="marketplace-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28 space-y-6">
        
        {/* Sleek Direct Adoption Header matching mockup */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-obsidian-200 dark:border-white/10">
          <div className="space-y-1 text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display text-obsidian-950 dark:text-white flex items-center gap-2">
              <span>Meet Your New Best Friend</span>
              <span className="text-coral-500">🐾</span>
            </h2>
            <p className="text-xs sm:text-sm text-obsidian-600 dark:text-slate-300 font-normal">
              Lovable dogs waiting for their forever homes
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                playPawPop();
                setSelectedCategory('all');
                setSelectedCity('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-white dark:bg-[#162033] hover:bg-obsidian-100 dark:hover:bg-white/10 border border-obsidian-200 dark:border-white/10 text-obsidian-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <span>View All Dogs</span>
              <ArrowRight className="w-3.5 h-3.5 text-coral-500" />
            </button>
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

            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  playPawPop();
                  requireAuth("Log in with your mobile number to share your dog's Happy Tails adoption story!", () => {
                    setIsShareStoryOpen(true);
                  });
                }}
                className="btn-primary text-white px-5 py-2.5 rounded-full text-xs font-black shadow-glow-coral flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Share My Story 🐾</span>
              </button>

              <div className="hidden sm:flex items-center gap-1.5 text-xs font-black px-3.5 py-2 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-amber-800 dark:text-amber-300">
                <Award className="w-4 h-4 text-amber-500" />
                <span>100% Genuine Handover Verified</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {successStories.map(story => (
              <div
                key={story.id}
                className="bg-white dark:bg-[#121A2B] rounded-3xl p-6 border border-obsidian-200 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-4 relative hover:shadow-card transition-all group"
              >
                <div className="space-y-4">
                  <div className="relative h-52 rounded-2xl overflow-hidden bg-obsidian-100 dark:bg-white/5">
                    <img
                      src={story.dogPhoto}
                      alt={story.dogName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-[11px] font-black shadow-md flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Adopted</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-obsidian-950 dark:text-white">
                        {story.dogName} ({story.dogBreed})
                      </h3>
                      <span className="text-[10px] font-bold text-obsidian-400 dark:text-slate-500">
                        {story.date}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      {story.adopterAvatar ? (
                        <img
                          src={story.adopterAvatar}
                          alt={story.adopterName}
                          className="w-5 h-5 rounded-full object-cover ring-1 ring-coral-300"
                        />
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-coral-100 dark:bg-coral-900/60 text-coral-600 dark:text-coral-400 text-[10px] font-black flex items-center justify-center">
                          {story.adopterName.charAt(0)}
                        </span>
                      )}
                      <p className="text-xs font-semibold text-obsidian-600 dark:text-slate-300 truncate">
                        Adopted by <strong className="text-obsidian-900 dark:text-white">{story.adopterName}</strong> • {story.location}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-obsidian-700 dark:text-slate-300 leading-relaxed italic font-normal bg-obsidian-50 dark:bg-white/5 p-3.5 rounded-2xl border border-obsidian-100 dark:border-white/5">
                    &ldquo;{story.story}&rdquo;
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-obsidian-100 dark:border-white/10 text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-[11px]">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Verified Protocol Handover</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      playPawPop();
                      likeSuccessStory(story.id);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                      story.isLiked
                        ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 border border-rose-200 dark:border-rose-800/80'
                        : 'bg-obsidian-100 dark:bg-white/10 text-obsidian-700 dark:text-slate-300 hover:text-rose-600'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${story.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{story.likesCount}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ❓ FAQ SECTION */}
      <FaqSection />

      {/* 🐾 5. LIST A DOG / REHOMING SUPPORT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-4xl sm:rounded-5xl p-8 sm:p-12 bg-gradient-to-br from-white via-[#FFF7F4] to-amber-50/80 dark:bg-gradient-to-r dark:from-obsidian-950 dark:via-[#131C2E] dark:to-obsidian-950 text-obsidian-950 dark:text-white overflow-hidden shadow-elevated border border-coral-200/70 dark:border-white/15 text-left transition-colors duration-300">
          
          {/* Ambient Background Glow Blobs */}
          <div className="absolute right-0 top-0 w-96 h-96 bg-coral-400/15 dark:bg-coral-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-0 bottom-0 w-80 h-80 bg-amber-400/15 dark:bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Column: Headline & Action */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-coral-100/90 dark:bg-white/10 text-coral-700 dark:text-coral-300 font-black text-xs uppercase tracking-wider backdrop-blur-md border border-coral-200 dark:border-white/15 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Safe Rehoming Guaranteed</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-obsidian-950 dark:text-white leading-tight">
                Need to Find a Loving Home for Your Dog?
              </h2>

              <p className="text-xs sm:text-base text-obsidian-600 dark:text-slate-200 leading-relaxed font-normal max-w-xl">
                Life circumstances change. Ensure your companion gets the best possible home with our verified adopter questionnaires, in-person park meets, and legal adoption agreements. 100% Free.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    playPawPop();
                    setIsListDogOpen(true);
                  }}
                  className="btn-primary text-white px-8 py-4 rounded-full font-black text-sm shadow-glow-coral flex items-center gap-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Post Your Dog for Adoption (Free) 🚀</span>
                </button>

                <span className="text-xs text-obsidian-600 dark:text-slate-300 font-semibold flex items-center gap-1.5 bg-white/80 dark:bg-white/5 px-3 py-2 rounded-full border border-obsidian-200/60 dark:border-white/10 shadow-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>12,000+ happy Indian adoptions</span>
                </span>
              </div>
            </div>

            {/* Right Column: Dog Photo Feature Card */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-white/20 w-full max-w-sm group">
                <img
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&auto=format&fit=crop&q=80"
                  alt="Happy adoption dogs"
                  className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3.5 left-4 right-4 text-white text-left">
                  <span className="text-[11px] font-black px-3 py-1 rounded-full bg-coral-500 text-white shadow-md inline-block mb-1">
                    🐾 100% Verified Pet Guardians
                  </span>
                  <p className="text-xs text-slate-200 font-medium">
                    Zero fees • Free legal contract • Vet clearance
                  </p>
                </div>
              </div>
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
