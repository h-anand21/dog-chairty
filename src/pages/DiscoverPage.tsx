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
  CheckCircle2,
  Calendar,
  MessageCircle,
  FileText,
  HeartHandshake,
  UserCheck,
  Smile,
} from 'lucide-react';

interface DiscoverPageProps {
  onSelectDog: (dog: Dog) => void;
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({ onSelectDog }) => {
  const { dogs, setIsListDogOpen, setActiveTab } = useApp();
  const { playPawPop } = useAudio();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState<DogStatus | 'all'>('all');
  const [selectedSize, setSelectedSize] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

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
        dog.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dog.bio.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCity =
        selectedCity === 'All' || dog.location.toLowerCase().includes(selectedCity.toLowerCase());

      const matchesStatus =
        selectedStatus === 'all' || dog.status === selectedStatus;

      const matchesSize =
        selectedSize === 'All' || dog.size === selectedSize;

      let matchesCategory = true;
      if (selectedCategory === 'gentle') {
        matchesCategory = dog.energy.includes('Low') || dog.personalityTraits.includes('Gentle');
      } else if (selectedCategory === 'playful') {
        matchesCategory = dog.energy.includes('High') || dog.energy.includes('Zoomies');
      } else if (selectedCategory === 'kids') {
        matchesCategory = dog.personalityTraits.some(t => t.toLowerCase().includes('kids') || t.toLowerCase().includes('family'));
      } else if (selectedCategory === 'water') {
        matchesCategory = dog.personalityTraits.some(t => t.toLowerCase().includes('water')) || dog.favoriteThings.some(f => f.toLowerCase().includes('pool') || f.toLowerCase().includes('swim'));
      }

      return matchesSearch && matchesCity && matchesStatus && matchesSize && matchesCategory;
    });
  }, [dogs, searchQuery, selectedCity, selectedStatus, selectedSize, selectedCategory]);

  const successStories = [
    {
      id: 'story_1',
      dogName: 'Cooper (Golden Retriever)',
      adoptedBy: 'Ananya & Rohan',
      location: 'Kolkata',
      image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80',
      quote: 'PawConnect made meeting Cooper’s previous guardian so smooth and transparent. He has brought infinite joy to our family!',
      date: 'Adopted July 2026',
      badge: 'Gold Certificate #CERT-PAW-849201'
    },
    {
      id: 'story_2',
      dogName: 'Daisy (Beagle)',
      adoptedBy: 'Kabir Verma',
      location: 'Delhi',
      image: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=600&auto=format&fit=crop&q=80',
      quote: 'The dual-confirmation handover and verified vet records gave us 100% peace of mind. Daisy is our sweetest companion!',
      date: 'Adopted June 2026',
      badge: 'Gold Certificate #CERT-PAW-739182'
    },
    {
      id: 'story_3',
      dogName: 'Max (Indie Rescue)',
      adoptedBy: 'Pooja Nair',
      location: 'Bengaluru',
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
            
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-obsidian-900 font-extrabold text-xs tracking-wider uppercase shadow-xs">
              <span className="text-base">🐾</span>
              <span>100% Direct Pet Guardian Adoption</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-obsidian-950 leading-[1.08]">
              Find Your Canine Friend. <br />
              <span className="text-gradient-coral">
                Give a Loving Forever Home.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-obsidian-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Direct connection between pet parents and loving adopters. Verified vet clearances, direct private chat, park meetups, and digital legal handovers.
            </p>

          </div>

          {/* 🔍 Hero Quick Match & Search Box */}
          <div className="glass-card rounded-4xl p-4 sm:p-6 max-w-4xl mx-auto shadow-elevated border border-white space-y-4">
            
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              
              {/* Search text */}
              <div className="sm:col-span-5 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search breed, name or personality..."
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-obsidian-200 focus:border-coral-500 focus:ring-4 focus:ring-coral-100 text-xs sm:text-sm font-semibold outline-hidden shadow-inner"
                />
              </div>

              {/* City selector */}
              <div className="sm:col-span-3 relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-coral-500" />
                <select
                  value={selectedCity}
                  onChange={e => setSelectedCity(e.target.value)}
                  className="w-full pl-9 pr-8 py-3 rounded-2xl bg-white border border-obsidian-200 text-xs font-black text-obsidian-900 outline-hidden cursor-pointer shadow-inner"
                >
                  {cities.map(c => (
                    <option key={c} value={c}>
                      {c === 'All' ? 'All Locations' : `📍 ${c}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dog Size selector */}
              <div className="sm:col-span-2 relative">
                <select
                  value={selectedSize}
                  onChange={e => setSelectedSize(e.target.value)}
                  className="w-full px-3 py-3 rounded-2xl bg-white border border-obsidian-200 text-xs font-black text-obsidian-900 outline-hidden cursor-pointer shadow-inner"
                >
                  <option value="All">All Sizes</option>
                  <option value="Small">Small (Puppy)</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </select>
              </div>

              {/* Search button */}
              <div className="sm:col-span-2">
                <button
                  onClick={() => {
                    playPawPop();
                    const el = document.getElementById('marketplace-grid');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full h-full btn-primary text-white py-3 px-4 rounded-2xl font-black text-xs shadow-glow-coral flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Find Dogs</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>

            {/* Quick Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-obsidian-200 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-bold text-obsidian-500 mr-1 text-[11px] uppercase tracking-wider">
                  Quick Filters:
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
                        : 'bg-obsidian-100 hover:bg-obsidian-200 text-obsidian-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="text-xs font-bold text-obsidian-600">
                <span className="text-coral-600 font-black">{filteredDogs.length}</span> pup{filteredDogs.length === 1 ? '' : 's'} available
              </div>
            </div>

          </div>

          {/* 4 Trust & Safety Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto pt-2">
            
            <div className="glass-card p-3.5 rounded-2xl text-left border border-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0">
                💉
              </div>
              <div>
                <h4 className="text-xs font-black text-obsidian-950">100% Medicals</h4>
                <p className="text-[10px] text-obsidian-500 font-medium">Verified vet panels</p>
              </div>
            </div>

            <div className="glass-card p-3.5 rounded-2xl text-left border border-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-coral-50 text-coral-600 flex items-center justify-center text-lg shrink-0">
                💬
              </div>
              <div>
                <h4 className="text-xs font-black text-obsidian-950">Direct Chat</h4>
                <p className="text-[10px] text-obsidian-500 font-medium">Message real owners</p>
              </div>
            </div>

            <div className="glass-card p-3.5 rounded-2xl text-left border border-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center text-lg shrink-0">
                🌳
              </div>
              <div>
                <h4 className="text-xs font-black text-obsidian-950">Park Meetup</h4>
                <p className="text-[10px] text-obsidian-500 font-medium">Safe in-person meet</p>
              </div>
            </div>

            <div className="glass-card p-3.5 rounded-2xl text-left border border-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg shrink-0">
                📜
              </div>
              <div>
                <h4 className="text-xs font-black text-obsidian-950">Dual Handover</h4>
                <p className="text-[10px] text-obsidian-500 font-medium">Legal transfer cert</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 🐾 2. HOW PAWCONNECT WORKS (Interactive 4-Step Visual Journey) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-5xl p-6 sm:p-12 border border-white shadow-card space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 text-coral-600 font-black text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simple & Transparent Process</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-obsidian-950">
              How Adoption Works on PawConnect
            </h2>
            <p className="text-xs sm:text-sm text-obsidian-600 font-normal">
              We eliminated adoption scams, shelter bureaucracy, and commercial breeders with our 4-step verified flow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-white border border-obsidian-200 shadow-sm text-left space-y-3 relative group hover:border-coral-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-coral-50 text-coral-600 flex items-center justify-center text-xl font-black shadow-xs">
                1
              </div>
              <h3 className="text-base font-black text-obsidian-950">
                Browse & Hear Bark
              </h3>
              <p className="text-xs text-obsidian-600 leading-relaxed font-normal">
                Check high-res galleries, temperament traits, verified medicals, and hear real playful audio barks.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-white border border-obsidian-200 shadow-sm text-left space-y-3 relative group hover:border-coral-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-xl font-black shadow-xs">
                2
              </div>
              <h3 className="text-base font-black text-obsidian-950">
                Submit Adoption Form
              </h3>
              <p className="text-xs text-obsidian-600 leading-relaxed font-normal">
                Share your home setup, fenced yard details, daily routine, and canine parenting experience.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-white border border-obsidian-200 shadow-sm text-left space-y-3 relative group hover:border-coral-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl font-black shadow-xs">
                3
              </div>
              <h3 className="text-base font-black text-obsidian-950">
                Live Chat & Park Meet
              </h3>
              <p className="text-xs text-obsidian-600 leading-relaxed font-normal">
                Once guardian approves, direct chat unlocks to coordinate questions and schedule a park Meet & Greet.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-6 rounded-3xl bg-white border border-obsidian-200 shadow-sm text-left space-y-3 relative group hover:border-coral-300 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl font-black shadow-xs">
                4
              </div>
              <h3 className="text-base font-black text-obsidian-950">
                Dual Handover & Cert
              </h3>
              <p className="text-xs text-obsidian-600 leading-relaxed font-normal">
                Both confirm physical handover on their phone; dog profile & gold adoption certificate transfer instantly.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 🐶 3. DOGS MARKETPLACE GRID */}
      <section id="marketplace-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-28 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
          <div>
            <h2 className="text-3xl sm:text-4xl font-black font-display text-obsidian-950">
              Dogs Waiting for a Home 🐕
            </h2>
            <p className="text-xs sm:text-sm text-obsidian-600 mt-1">
              Click on any pup to hear their bark, view health records, or submit an adoption request.
            </p>
          </div>

          <button
            onClick={() => {
              playPawPop();
              setIsListDogOpen(true);
            }}
            className="self-start sm:self-auto px-5 py-2.5 rounded-full bg-coral-50 hover:bg-coral-100 text-coral-700 font-black text-xs border border-coral-200 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Post a Dog for Adoption</span>
          </button>
        </div>

        {filteredDogs.length === 0 ? (
          <div className="glass-card rounded-4xl p-16 text-center border border-white shadow-card max-w-md mx-auto space-y-4">
            <div className="text-5xl animate-bounce">🐶🔍</div>
            <h3 className="text-xl font-black font-display text-obsidian-950">No pups match this filter</h3>
            <p className="text-xs text-obsidian-600 leading-relaxed font-medium">
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
      </section>

      {/* 🎉 4. HAPPY TAILS & SUCCESS STORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-5xl p-6 sm:p-12 border border-white shadow-elevated space-y-8 text-left">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black text-xs uppercase tracking-wider mb-2">
                <Smile className="w-3.5 h-3.5" />
                <span>Happy Tails</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black font-display text-obsidian-950">
                Recent Adoption Success Stories 🎉
              </h2>
              <p className="text-xs sm:text-sm text-obsidian-600 mt-1">
                Real dogs and families united through PawConnect&apos;s verified handover system.
              </p>
            </div>

            <button
              onClick={() => {
                playPawPop();
                setActiveTab('feed');
              }}
              className="self-start sm:self-auto text-xs font-black text-coral-600 hover:text-coral-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Explore More in PawFeed</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {successStories.map(story => (
              <div
                key={story.id}
                className="bg-white rounded-3xl p-5 border border-obsidian-200 shadow-card flex flex-col justify-between space-y-4 hover:-translate-y-1 transition-all"
              >
                <div className="space-y-3">
                  <div className="relative h-48 rounded-2xl overflow-hidden">
                    <img
                      src={story.image}
                      alt={story.dogName}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/70 text-white text-[10px] font-black backdrop-blur-md">
                      {story.date}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-black text-obsidian-950">
                      {story.dogName}
                    </h4>
                    <p className="text-xs text-obsidian-500 font-semibold">
                      Adopted by {story.adoptedBy} • {story.location}
                    </p>
                  </div>

                  <p className="text-xs text-obsidian-700 leading-relaxed italic font-normal">
                    &ldquo;{story.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-obsidian-200 flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-700">
                  <Award className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{story.badge}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 🐾 5. REHOMING / LISTING CALLOUT BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-coral-600 via-coral-500 to-amber-500 rounded-5xl p-8 sm:p-14 text-white shadow-glow-coral relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 text-left">
          
          <div className="space-y-3 max-w-xl">
            <span className="inline-block text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full backdrop-blur-md">
              Are You a Dog Guardian?
            </span>
            <h3 className="text-2xl sm:text-4xl font-black font-display leading-tight">
              Need to Rehome Your Dog Safely & Responsibly?
            </h3>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-medium">
              List for free, review verified adopter questionnaires, chat directly, and conduct a safe dual-confirmed transfer.
            </p>
          </div>

          <button
            onClick={() => {
              playPawPop();
              setIsListDogOpen(true);
            }}
            className="w-full md:w-auto bg-white hover:bg-obsidian-100 text-obsidian-950 font-black text-sm px-8 py-4 rounded-full shadow-2xl transition-all hover:scale-105 shrink-0 cursor-pointer"
          >
            + Post Dog for Adoption
          </button>

        </div>
      </section>

    </div>
  );
};
