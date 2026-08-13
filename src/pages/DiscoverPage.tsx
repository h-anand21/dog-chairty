import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { DogCard } from '../components/discover/DogCard';
import { Dog, DogStatus } from '../types';
import {
  Search,
  SlidersHorizontal,
  PlusCircle,
  ShieldCheck,
  Heart,
  Sparkles,
  MapPin,
  Flame,
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

  // Cities list from active dogs
  const cities = useMemo(() => {
    const set = new Set<string>();
    dogs.forEach(d => {
      const city = d.location.split(',')[0].trim();
      if (city) set.add(city);
    });
    return ['All', ...Array.from(set)];
  }, [dogs]);

  // Filtered dogs
  const filteredDogs = useMemo(() => {
    return dogs.filter(dog => {
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
    <div className="space-y-12 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8">
        
        {/* Background decorative glowing circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-coral-300/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-sky-300/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          
          {/* Top pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-coral-50 border border-coral-200 text-coral-600 font-extrabold text-xs tracking-wider uppercase shadow-xs animate-bounce-short">
            <span className="text-sm">🐾</span>
            <span>Real-Time Canine Adoption & Friendship</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display text-obsidian-900 tracking-tight leading-[1.1]">
            Every Dog Deserves <br />
            <span className="bg-gradient-to-r from-coral-500 via-coral-600 to-amber-500 bg-clip-text text-transparent">
              a Loving Family.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-obsidian-700 max-w-2xl mx-auto leading-relaxed">
            Direct owner listings, verified veterinary panels, real-time chat, and safe dual-confirmation ownership handovers.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                playPawPop();
                const el = document.getElementById('marketplace-grid');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white px-8 py-3.5 rounded-full font-bold text-base shadow-soft hover:shadow-soft-hover transition-all hover:scale-102"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>Explore Dogs to Adopt</span>
            </button>

            <button
              onClick={() => {
                playPawPop();
                setIsListDogOpen(true);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-obsidian-300/80 text-obsidian-900 border-2 border-obsidian-400/80 px-8 py-3.5 rounded-full font-bold text-base shadow-xs transition-all hover:scale-102"
            >
              <PlusCircle className="w-5 h-5 text-coral-500" />
              <span>Post a Dog for Adoption</span>
            </button>
          </div>

          {/* Live Trust Metrics */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <div className="glass-panel p-3.5 rounded-2xl text-center shadow-xs">
              <div className="text-2xl font-black text-coral-600">100%</div>
              <div className="text-[11px] font-bold text-obsidian-600">Verified Profiles</div>
            </div>
            <div className="glass-panel p-3.5 rounded-2xl text-center shadow-xs">
              <div className="text-2xl font-black text-sky-600">6-Stage</div>
              <div className="text-[11px] font-bold text-obsidian-600">Tracked Journey</div>
            </div>
            <div className="glass-panel p-3.5 rounded-2xl text-center shadow-xs">
              <div className="text-2xl font-black text-amber-500">Live Chat</div>
              <div className="text-[11px] font-bold text-obsidian-600">Owner Direct</div>
            </div>
            <div className="glass-panel p-3.5 rounded-2xl text-center shadow-xs">
              <div className="text-2xl font-black text-emerald-600">Dual Sign</div>
              <div className="text-[11px] font-bold text-obsidian-600">Handover Transfer</div>
            </div>
          </div>

        </div>
      </section>

      {/* SEARCH & FILTER BAR */}
      <section id="marketplace-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-soft border border-obsidian-400/40 space-y-4">
          
          {/* Main Search Row */}
          <div className="flex flex-col md:flex-row gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-obsidian-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by dog name, breed (e.g. Golden Retriever, Beagle) or location..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-obsidian-300/50 border border-obsidian-400/60 focus:bg-white focus:border-coral-500 focus:ring-2 focus:ring-coral-200 text-sm font-medium outline-hidden transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-obsidian-500 hover:text-obsidian-800"
                >
                  Clear
                </button>
              )}
            </div>

            {/* City Dropdown */}
            <div className="flex items-center gap-2">
              <div className="relative min-w-[150px]">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-coral-500" />
                <select
                  value={selectedCity}
                  onChange={e => setSelectedCity(e.target.value)}
                  className="w-full pl-9 pr-8 py-3.5 rounded-2xl bg-obsidian-300/50 border border-obsidian-400/60 text-xs font-bold text-obsidian-800 outline-hidden bg-white cursor-pointer"
                >
                  {cities.map(c => (
                    <option key={c} value={c}>
                      {c === 'All' ? 'All Cities' : `📍 ${c}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter Dropdown */}
              <div className="relative min-w-[170px]">
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value as typeof selectedStatus)}
                  className="w-full px-4 py-3.5 rounded-2xl bg-obsidian-300/50 border border-obsidian-400/60 text-xs font-bold text-obsidian-800 outline-hidden bg-white cursor-pointer"
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

          {/* Quick Filter Chips Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-obsidian-400/30 text-xs">
            
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-obsidian-600 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Filters:</span>
              </span>

              {/* Size Chips */}
              {['All', 'Small', 'Medium', 'Large'].map(size => (
                <button
                  key={size}
                  onClick={() => {
                    playPawPop();
                    setSelectedSize(size);
                  }}
                  className={`px-3 py-1 rounded-full font-bold transition-all ${
                    selectedSize === size
                      ? 'bg-coral-500 text-white shadow-xs'
                      : 'bg-obsidian-300/80 text-obsidian-700 hover:bg-obsidian-400'
                  }`}
                >
                  {size === 'All' ? 'All Sizes' : `${size}`}
                </button>
              ))}

              <span className="text-obsidian-400">|</span>

              {/* Energy Chips */}
              {['All', 'Low', 'Moderate', 'High'].map(energy => (
                <button
                  key={energy}
                  onClick={() => {
                    playPawPop();
                    setSelectedEnergy(energy);
                  }}
                  className={`px-3 py-1 rounded-full font-bold transition-all ${
                    selectedEnergy === energy
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'bg-obsidian-300/80 text-obsidian-700 hover:bg-obsidian-400'
                  }`}
                >
                  {energy === 'All' ? 'All Energy' : `${energy} Energy`}
                </button>
              ))}
            </div>

            {/* Total Results Count */}
            <div className="text-xs font-bold text-obsidian-600">
              Showing <span className="text-coral-600 font-black">{filteredDogs.length}</span> pup{filteredDogs.length === 1 ? '' : 's'}
            </div>

          </div>

        </div>

      </section>

      {/* DOGS MARKETPLACE GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredDogs.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-obsidian-300 shadow-soft max-w-lg mx-auto space-y-4">
            <div className="text-5xl">🐶🔍</div>
            <h3 className="text-xl font-bold text-obsidian-900">No pups match your filter criteria</h3>
            <p className="text-xs text-obsidian-600">
              Try adjusting your search query, location filter, or energy setting to discover other available dogs.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCity('All');
                setSelectedStatus('all');
                setSelectedSize('All');
                setSelectedEnergy('All');
              }}
              className="px-5 py-2.5 rounded-full bg-coral-500 text-white font-bold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredDogs.map(dog => (
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
