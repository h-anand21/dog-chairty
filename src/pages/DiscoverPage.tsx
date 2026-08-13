import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useAudio } from '../context/AudioContext';
import { DogCard } from '../components/discover/DogCard';
import { Dog, DogStatus } from '../types';
import {
  Search,
  SlidersHorizontal,
  Plus,
  ShieldCheck,
  Heart,
  Sparkles,
  MapPin,
  Flame,
  Award,
  ArrowRight,
} from 'lucide-react';

interface DiscoverPageProps {
  onSelectDog: (dog: Dog) => void;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({ onSelectDog }) => {
  const { dogs, setIsListDogOpen } = useApp();
  const { playPawPop } = useAudio();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<DogStatus | 'all'>('all');
  const [selectedSize, setSelectedSize] = useState('All');
  const [selectedEnergy, setSelectedEnergy] = useState('All');

  // Cities list
  const cities = useMemo(() => {
    const set = new Set<string>();
    dogs.forEach((d: Dog) => {
      const city = d.location.split(',')[0].trim();
      if (city) set.add(city);
    });
    return ['All', ...Array.from(set)];
  }, [dogs]);

  // Filtered dogs
  const filteredDogs = useMemo(() => {
    return dogs.filter((dog: Dog) => {
      const matchesSearch =
        dog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dog.breed.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dog.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCity =
        selectedCity === 'All' || dog.location.toLowerCase().includes(selectedCity.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || dog.status === selectedStatus;

      const matchesSize =
        selectedSize === 'All' || dog.size === selectedSize;

      const matchesEnergy =
        selectedEnergy === 'All' || dog.energy.includes(selectedEnergy);

      return matchesSearch && matchesCity && matchesStatus && matchesSize && matchesEnergy;
    });
  }, [dogs, searchQuery, selectedCity, selectedStatus, selectedSize, selectedEnergy]);

  return (
    <div className="space-y-16 pb-20">
      
      {/* 🌟 HERO SHOWCASE SECTION */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-16 px-4 sm:px-6 lg:px-8">
        
        {/* Ambient Glowing Blobs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-coral-400/20 via-amber-300/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-12 right-12 w-80 h-80 bg-sky-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          
          {/* Main Hero Container */}
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-obsidian-900 font-extrabold text-xs tracking-wider uppercase shadow-xs">
              <span className="text-base">🐾</span>
              <span>Direct Canine Adoption & Friendship Platform</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-obsidian-950 leading-[1.08]">
              Every Dog Deserves <br />
              <span className="text-gradient-coral">
                a Loving Forever Home.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-obsidian-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Direct guardian listings, verified veterinary panels, real-time encrypted chat, and safe dual-confirmation digital handovers.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button
                onClick={() => {
                  playPawPop();
                  const el = document.getElementById('marketplace-grid');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto btn-primary text-white px-8 py-4 rounded-full font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-glow-coral"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Explore Dogs to Adopt</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  playPawPop();
                  setIsListDogOpen(true);
                }}
                className="w-full sm:w-auto glass-card hover:bg-white text-obsidian-900 px-8 py-4 rounded-full font-extrabold text-sm flex items-center justify-center gap-2 transition-all hover:scale-102 cursor-pointer border border-obsidian-300"
              >
                <Plus className="w-4 h-4 text-coral-500" />
                <span>List a Dog for Adoption</span>
              </button>
            </div>

          </div>

          {/* 🐾 Floating Visual Cards Composition */}
          <div className="relative mt-12 max-w-5xl mx-auto hidden md:block">
            <div className="grid grid-cols-3 gap-6 items-center">
              
              {/* Left Floating Card */}
              <div className="glass-card p-4 rounded-3xl animate-float-slow shadow-card border border-white/80 text-left space-y-2">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=200"
                    alt="Bruno"
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-coral-400"
                  />
                  <div>
                    <h4 className="text-sm font-black text-obsidian-950">Bruno 🐶</h4>
                    <span className="text-[11px] text-obsidian-500 font-bold">Golden • 2 Yrs</span>
                  </div>
                </div>
                <div className="text-[11px] font-bold text-coral-600 bg-coral-50 px-2.5 py-1 rounded-xl">
                  🎾 Professional Ball Chaser
                </div>
              </div>

              {/* Center Main Highlight Card */}
              <div className="bg-gradient-to-tr from-coral-500 to-amber-400 p-6 rounded-4xl shadow-glow-coral text-white text-center space-y-3 transform scale-105">
                <div className="text-3xl">🏆✨</div>
                <h3 className="text-xl font-black font-display">100% Verified Transfers</h3>
                <p className="text-xs text-white/90 leading-relaxed font-medium">
                  Both guardian & adopter digitally confirm handover before official ownership certificate issuance.
                </p>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>PawConnect Trust Registry</span>
                </div>
              </div>

              {/* Right Floating Card */}
              <div className="glass-card p-4 rounded-3xl animate-float-reverse shadow-card border border-white/80 text-left space-y-2">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=200"
                    alt="Luna"
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-sky-400"
                  />
                  <div>
                    <h4 className="text-sm font-black text-obsidian-950">Luna 🐕</h4>
                    <span className="text-[11px] text-obsidian-500 font-bold">Labrador • 1.5 Yrs</span>
                  </div>
                </div>
                <div className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-xl">
                  🏊 Water Lover & Gentle Soul
                </div>
              </div>

            </div>
          </div>

          {/* 4 Stats Cards */}
          <div className="pt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-card p-4 rounded-3xl text-center shadow-card border border-white">
              <div className="text-2xl sm:text-3xl font-black text-coral-600 font-display">100%</div>
              <div className="text-xs font-bold text-obsidian-600 mt-0.5">Verified Medicals</div>
            </div>
            <div className="glass-card p-4 rounded-3xl text-center shadow-card border border-white">
              <div className="text-2xl sm:text-3xl font-black text-sky-600 font-display">6-Stage</div>
              <div className="text-xs font-bold text-obsidian-600 mt-0.5">Tracked Handover</div>
            </div>
            <div className="glass-card p-4 rounded-3xl text-center shadow-card border border-white">
              <div className="text-2xl sm:text-3xl font-black text-amber-500 font-display">Live Chat</div>
              <div className="text-xs font-bold text-obsidian-600 mt-0.5">Direct Communication</div>
            </div>
            <div className="glass-card p-4 rounded-3xl text-center shadow-card border border-white">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 font-display">Dual Sign</div>
              <div className="text-xs font-bold text-obsidian-600 mt-0.5">Legal Agreement</div>
            </div>
          </div>

        </div>
      </section>

      {/* 🔍 SEARCH & FILTER ISLAND */}
      <section id="marketplace-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28">
        
        <div className="glass-card rounded-4xl p-5 sm:p-7 shadow-elevated border border-white space-y-5">
          
          {/* Main Search Row */}
          <div className="flex flex-col md:flex-row gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-obsidian-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search dog name, breed (e.g. Golden Retriever, Beagle) or location..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-obsidian-200 focus:border-coral-500 focus:ring-4 focus:ring-coral-100 text-sm font-semibold outline-hidden transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-obsidian-400 hover:text-obsidian-800"
                >
                  Clear
                </button>
              )}
            </div>

            {/* City Dropdown */}
            <div className="flex items-center gap-2">
              <div className="relative min-w-[160px]">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-coral-500" />
                <select
                  value={selectedCity}
                  onChange={e => setSelectedCity(e.target.value)}
                  className="w-full pl-9 pr-8 py-3.5 rounded-2xl bg-white border border-obsidian-200 text-xs font-extrabold text-obsidian-900 outline-hidden cursor-pointer shadow-inner"
                >
                  {cities.map(c => (
                    <option key={c} value={c}>
                      {c === 'All' ? 'All Cities' : `📍 ${c}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative min-w-[180px]">
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value as typeof selectedStatus)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-white border border-obsidian-200 text-xs font-extrabold text-obsidian-900 outline-hidden cursor-pointer shadow-inner"
                >
                  <option value="all">Status: All Dogs</option>
                  <option value="available">🟢 Available for Adoption</option>
                  <option value="pending">🟡 Adoption Pending</option>
                  <option value="meet_scheduled">🔵 Meet Scheduled</option>
                  <option value="adopted">🔴 Adopted & Transferred</option>
                </select>
              </div>
            </div>

          </div>

          {/* Filter Chips Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-obsidian-200 text-xs">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-obsidian-500 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters:</span>
              </span>

              {['All', 'Small', 'Medium', 'Large'].map(size => (
                <button
                  key={size}
                  onClick={() => {
                    playPawPop();
                    setSelectedSize(size);
                  }}
                  className={`px-3.5 py-1.5 rounded-full font-extrabold transition-all cursor-pointer ${
                    selectedSize === size
                      ? 'bg-coral-500 text-white shadow-glow-coral'
                      : 'bg-obsidian-200/80 text-obsidian-700 hover:bg-obsidian-300'
                  }`}
                >
                  {size === 'All' ? 'All Sizes' : `${size}`}
                </button>
              ))}

              <span className="text-obsidian-300">|</span>

              {['All', 'Low', 'Moderate', 'High'].map(energy => (
                <button
                  key={energy}
                  onClick={() => {
                    playPawPop();
                    setSelectedEnergy(energy);
                  }}
                  className={`px-3.5 py-1.5 rounded-full font-extrabold transition-all cursor-pointer ${
                    selectedEnergy === energy
                      ? 'bg-sky-500 text-white shadow-glow-sky'
                      : 'bg-obsidian-200/80 text-obsidian-700 hover:bg-obsidian-300'
                  }`}
                >
                  {energy === 'All' ? 'All Energy' : `${energy} Energy`}
                </button>
              ))}
            </div>

            <div className="text-xs font-bold text-obsidian-600">
              Showing <span className="text-coral-600 font-black">{filteredDogs.length}</span> pup{filteredDogs.length === 1 ? '' : 's'} available
            </div>

          </div>

        </div>

      </section>

      {/* 🐶 DOGS MARKETPLACE GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredDogs.length === 0 ? (
          <div className="glass-card rounded-4xl p-16 text-center border border-white shadow-card max-w-md mx-auto space-y-4">
            <div className="text-5xl animate-bounce">🐶🔍</div>
            <h3 className="text-xl font-black font-display text-obsidian-950">No pups match your search</h3>
            <p className="text-xs text-obsidian-600 leading-relaxed font-medium">
              Try adjusting your query or resetting filters to discover more adorable furry companions.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCity('All');
                setSelectedStatus('all');
                setSelectedSize('All');
                setSelectedEnergy('All');
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
      </section>

    </div>
  );
};
