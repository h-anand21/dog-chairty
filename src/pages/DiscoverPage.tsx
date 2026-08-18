import React, { useState, useMemo } from 'react';
import { Dog } from '../types';
import { DogCard } from '../components/discover/DogCard';
import { PawMap } from '../components/map/PawMap';
import { CitySearchInput } from '../components/common/CitySearchInput';
import { HowItWorksAnimated } from '../components/discover/HowItWorksAnimated';
import { PillarDetailModal, PillarType } from '../components/common/PillarDetailModal';
import { useApp } from '../context/AppContext';
import { useAudio } from '../context/AudioContext';
import { mapService } from '../services/mapService';
import {
  Search,
  Filter,
  Sparkles,
  MapPin,
  Heart,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  MessageSquare,
  FileCheck,
  Volume2,
  Compass,
  Smile,
  SlidersHorizontal,
  Flame,
  Award,
  Navigation,
  Grid,
  Map as MapIcon,
  Plus,
} from 'lucide-react';

interface DiscoverPageProps {
  onSelectDog: (dog: Dog) => void;
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
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [userGps, setUserGps] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedPillar, setSelectedPillar] = useState<PillarType>(null);

  // Dynamic Cities Filter List derived from active dogs
  const cityOptions = useMemo(() => {
    const dogCities = Array.from(new Set(dogs.map(d => d.city).filter(Boolean))) as string[];
    return dogCities.length > 0 ? ['All', ...dogCities] : ['All'];
  }, [dogs]);

  // Filtered Dogs Logic
  const filteredDogs = useMemo(() => {
    return dogs.filter((dog: Dog) => {
      // 1. Text search on name, breed, location, bio
      const matchesSearch =
        searchQuery === '' ||
        dog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dog.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dog.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dog.bio.toLowerCase().includes(searchQuery.toLowerCase());

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

  const handleGpsDetect = async () => {
    playPawPop();
    const loc = await mapService.getUserLocation();
    setUserGps({ lat: loc.lat, lng: loc.lng });
    if (loc.city) {
      const match = cityOptions.find(c => loc.city.toLowerCase().includes(c.toLowerCase()));
      if (match) setSelectedCity(match);
    }
  };

  const successStories = [
    {
      id: 'story_1',
      dogName: 'Cooper (Golden Retriever)',
      adoptedBy: 'Ananya & Rohan',
      location: 'Kolkata, Salt Lake',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
      quote: 'PawConnect made meeting Cooper’s previous guardian so smooth and transparent. He has brought infinite joy to our family!',
      date: 'Adopted July 2026',
      badge: 'Gold Certificate #CERT-PAW-849201'
    },
    {
      id: 'story_2',
      dogName: 'Daisy (Beagle)',
      adoptedBy: 'Kabir Verma',
      location: 'Delhi NCR, GK-2',
      image: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=600&auto=format&fit=crop&q=80',
      quote: 'The dual-confirmation handover and verified vet records gave us 100% peace of mind. Daisy is our sweetest companion!',
      date: 'Adopted June 2026',
      badge: 'Gold Certificate #CERT-PAW-739182'
    },
    {
      id: 'story_3',
      dogName: 'Max (Indie Rescue)',
      adoptedBy: 'Pooja Nair',
      location: 'Bengaluru, Indiranagar',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&auto=format&fit=crop&q=80',
      quote: 'We scheduled a park meet & greet through PawConnect chat first. Max bonded with us instantly on the grass!',
      date: 'Adopted May 2026',
      badge: 'Gold Certificate #CERT-PAW-992140'
    }
  ];

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
              <div className="sm:col-span-5 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400 dark:text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search breed, name, area, traits..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white dark:bg-[#121A2B] border border-obsidian-200 dark:border-white/15 text-xs sm:text-sm font-semibold text-obsidian-900 dark:text-white placeholder:text-obsidian-400 dark:placeholder:text-slate-400 focus:border-coral-500 focus:ring-4 focus:ring-coral-100 dark:focus:ring-coral-500/20 outline-hidden transition-all shadow-xs"
                />
              </div>

              {/* Dynamic Indian City Search Input */}
              <div className="sm:col-span-4 relative z-40">
                <CitySearchInput
                  value={selectedCity}
                  onSelectCity={city => setSelectedCity(city)}
                  placeholder="Search Your City (e.g. Mumbai, Delhi, Kolkata)..."
                />
              </div>

              {/* GPS Near Me Button */}
              <div className="sm:col-span-3">
                <button
                  type="button"
                  onClick={handleGpsDetect}
                  className="w-full h-full py-3.5 px-4 rounded-2xl bg-obsidian-100 dark:bg-white/10 hover:bg-obsidian-200 dark:hover:bg-white/20 text-obsidian-900 dark:text-white border border-obsidian-300 dark:border-white/10 font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <Navigation className="w-3.5 h-3.5 text-coral-500" />
                  <span>Use My GPS</span>
                </button>
              </div>

            </div>

            {/* Quick Category Pills & Count */}
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

              <div className="text-xs font-bold text-obsidian-600 dark:text-slate-300">
                <span className="text-coral-600 dark:text-coral-400 font-black">{filteredDogs.length}</span> pup{filteredDogs.length === 1 ? '' : 's'} available
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

      {/* 🐾 2. HOW PAWCONNECT WORKS (Interactive Animated Journey & Live Simulator) */}
      <HowItWorksAnimated />

      {/* 🐶 3. DOGS MARKETPLACE (GRID / INTERACTIVE MAP SWITCHER) */}
      <section id="marketplace-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-obsidian-950 dark:text-white">
              Dogs Waiting for a Home 🐕
            </h2>
            <p className="text-xs sm:text-sm text-obsidian-600 dark:text-slate-400 mt-1">
              Click on any pup to hear their bark, view health records, or submit an adoption request.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            
            {/* View Mode Toggle: Grid vs Interactive Map */}
            <div className="p-1 bg-obsidian-100 dark:bg-white/10 rounded-2xl flex items-center gap-1 shadow-inner border border-obsidian-200 dark:border-white/10">
              <button
                onClick={() => {
                  playPawPop();
                  setViewMode('grid');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-[#121A2B] text-obsidian-950 dark:text-white shadow-md'
                    : 'text-obsidian-600 dark:text-slate-400 hover:text-obsidian-950 dark:hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Grid</span>
              </button>

              <button
                onClick={() => {
                  playPawPop();
                  setViewMode('map');
                }}
                className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'map'
                    ? 'bg-white dark:bg-[#121A2B] text-obsidian-950 dark:text-white shadow-md'
                    : 'text-obsidian-600 dark:text-slate-400 hover:text-obsidian-950 dark:hover:text-white'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Live Map 🗺️</span>
              </button>
            </div>

            <button
              onClick={() => {
                playPawPop();
                setIsListDogOpen(true);
              }}
              className="px-5 py-2.5 rounded-2xl bg-coral-50 dark:bg-coral-950/60 hover:bg-coral-100 dark:hover:bg-coral-900/60 text-coral-700 dark:text-coral-300 font-black text-xs border border-coral-200 dark:border-coral-800/60 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post Dog</span>
            </button>

          </div>
        </div>

        {/* VIEW 1: INTERACTIVE REAL MAP */}
        {viewMode === 'map' && (
          <div className="animate-in fade-in zoom-in-95 duration-200">
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
              <div className="glass-card rounded-4xl p-16 text-center border border-white dark:border-white/10 shadow-card max-w-md mx-auto space-y-4">
                <div className="text-5xl animate-bounce">🐶🔍</div>
                <h3 className="text-xl font-black font-display text-obsidian-950 dark:text-white">No pups match this filter</h3>
                <p className="text-xs text-obsidian-600 dark:text-slate-300 leading-relaxed font-medium">
                  Try resetting your filters or search keywords to see all available furry companions.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCity('All');
                    setSelectedStatus('all');
                    setSelectedSize('All');
                    setSelectedCategory('all');
                  }}
                  className="btn-primary text-white px-6 py-2.5 rounded-full font-extrabold text-xs cursor-pointer shadow-glow-coral"
                >
                  Reset All Filters
                </button>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {successStories.map(story => (
              <div
                key={story.id}
                className="bg-white dark:bg-[#121A2B] rounded-3xl p-6 border border-obsidian-200 dark:border-white/10 shadow-sm flex flex-col justify-between space-y-4 relative hover:shadow-card transition-all"
              >
                <div className="space-y-4">
                  <div className="relative h-48 rounded-2xl overflow-hidden bg-obsidian-100 dark:bg-white/5">
                    <img
                      src={story.image}
                      alt={story.dogName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2.5 py-0.5 rounded-full text-[10px] font-black shadow-md">
                      ✓ Adopted
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-black text-obsidian-950 dark:text-white">
                      {story.dogName}
                    </h3>
                    <p className="text-xs font-semibold text-obsidian-500 dark:text-slate-400">
                      Adopted by <strong className="text-obsidian-900 dark:text-white">{story.adoptedBy}</strong> • {story.location}
                    </p>
                  </div>

                  <p className="text-xs text-obsidian-700 dark:text-slate-300 leading-relaxed italic font-normal">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-obsidian-200 dark:border-white/10 flex items-center justify-between text-[11px] font-bold text-obsidian-500 dark:text-slate-400">
                  <span>{story.date}</span>
                  <span className="text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800/60">
                    {story.badge.split(' ')[0]} {story.badge.split(' ')[1]}
                  </span>
                </div>
              </div>
            ))}
          </div>

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
