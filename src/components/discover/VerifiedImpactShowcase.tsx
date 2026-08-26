import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import {
  ShieldCheck,
  Heart,
  Sparkles,
  MapPin,
  CheckCircle2,
  PhoneCall,
  Flame,
  Award,
  Users,
  Search,
  ArrowRight,
  Stethoscope,
  FileCheck,
  Building2,
  Activity,
} from 'lucide-react';

interface VerifiedImpactShowcaseProps {
  onSelectCategory?: (category: string) => void;
  onSelectCity?: (city: string) => void;
}

export const VerifiedImpactShowcase: React.FC<VerifiedImpactShowcaseProps> = ({
  onSelectCategory,
  onSelectCity,
}) => {
  const { dogs, setIsListDogOpen, requireAuth } = useApp();
  const { playPawPop } = useAudio();

  const totalDogsCount = dogs.length;
  const citiesCount = new Set(dogs.map(d => d.city).filter(Boolean)).size || 12;

  const quickCategories = [
    {
      id: 'indie',
      title: 'Desi / Indie Pups 🐕',
      subtitle: 'High immunity & loyal companions',
      badge: 'Most Loved in India',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40',
      bgGradient: 'from-emerald-500/10 to-teal-500/5',
      icon: '🐕',
    },
    {
      id: 'family',
      title: 'Family & Kid Friendly 👶',
      subtitle: 'Gentle, calm & well-trained',
      badge: 'Great with Children',
      badgeColor: 'bg-coral-500/10 text-coral-600 dark:text-coral-400 border-coral-200 dark:border-coral-800/40',
      bgGradient: 'from-coral-500/10 to-amber-500/5',
      icon: '🧸',
    },
    {
      id: 'apartment',
      title: 'Apartment Friendly 🏢',
      subtitle: 'Small/Medium size, gentle routine',
      badge: 'Perfect for Flats',
      badgeColor: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/40',
      bgGradient: 'from-sky-500/10 to-indigo-500/5',
      icon: '🛋️',
    },
    {
      id: 'active',
      title: 'High Energy & Playful ⚡',
      subtitle: 'Loves running, fetch & swimming',
      badge: 'Outdoor Adventurers',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40',
      bgGradient: 'from-amber-500/10 to-yellow-500/5',
      icon: '🎾',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* 🌟 1. PAWCONNECT VERIFIED SAFETY & IMPACT HIGHLIGHTS */}
      <div className="glass-card rounded-5xl p-6 sm:p-12 border border-white dark:border-white/10 shadow-elevated space-y-10 text-left relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-coral-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-obsidian-200/80 dark:border-white/10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs uppercase tracking-wider border border-emerald-200 dark:border-emerald-800/40">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>India&apos;s Verified Canine Safety Network</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-obsidian-950 dark:text-white">
              Why 12,000+ Indian Pet Families Trust PawConnect
            </h2>
            <p className="text-xs sm:text-sm text-obsidian-600 dark:text-slate-300 font-normal leading-relaxed">
              Direct guardian handovers without shelter middleman fees, 100% verified vet health cards, in-person park meets, and legal digital adoption agreements.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              playPawPop();
              requireAuth('Log in to list your dog for adoption on PawConnect.', () => {
                setIsListDogOpen(true);
              });
            }}
            className="btn-primary text-white px-6 py-3 rounded-full font-black text-xs shadow-glow-coral flex items-center gap-2 cursor-pointer self-start sm:self-auto shrink-0"
          >
            <span>🐾 Post a Dog for Adoption</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* 📊 4 LIVE IMPACT METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121A2B] border border-obsidian-200/80 dark:border-white/10 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-coral-500/10 text-coral-500 flex items-center justify-center text-2xl font-black">
              🎁
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black font-display text-obsidian-950 dark:text-white">
                100% Free
              </div>
              <p className="text-xs font-bold text-coral-600 dark:text-coral-400 mt-0.5">
                Zero Brokerage or Listing Fees
              </p>
              <p className="text-[11px] text-obsidian-500 dark:text-slate-400 mt-1 leading-relaxed">
                Direct guardian-to-adopter adoption without commercial markups or shelter fees.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#121A2B] border border-obsidian-200/80 dark:border-white/10 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-2xl font-black">
              💉
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black font-display text-obsidian-950 dark:text-white">
                100% Vet Cleared
              </div>
              <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                Vaccinated & Health Verified
              </p>
              <p className="text-[11px] text-obsidian-500 dark:text-slate-400 mt-1 leading-relaxed">
                Rabies, DHPP, and medical records verified before handover.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#121A2B] border border-obsidian-200/80 dark:border-white/10 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center text-2xl font-black">
              🌳
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black font-display text-obsidian-950 dark:text-white">
                Park Meetups
              </div>
              <p className="text-xs font-bold text-sky-600 dark:text-sky-400 mt-0.5">
                Safe Public In-Person Meet
              </p>
              <p className="text-[11px] text-obsidian-500 dark:text-slate-400 mt-1 leading-relaxed">
                Meet the dog in a nearby park to test bonding before finalizing adoption.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#121A2B] border border-obsidian-200/80 dark:border-white/10 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl font-black">
              📜
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black font-display text-obsidian-950 dark:text-white">
                Gold Certificate
              </div>
              <p className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                Legal Custody Handover Cert
              </p>
              <p className="text-[11px] text-obsidian-500 dark:text-slate-400 mt-1 leading-relaxed">
                Official digital ownership transfer certificate issued upon physical handover.
              </p>
            </div>
          </div>

        </div>

        {/* 🐕 2. POPULAR ADOPTION CATEGORIES & BREED EXPLORER */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl sm:text-2xl font-black font-display text-obsidian-950 dark:text-white">
                Explore Popular Adoption Categories 🐾
              </h3>
              <p className="text-xs text-obsidian-500 dark:text-slate-400">
                Find your companion based on your apartment size, lifestyle, and family needs.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickCategories.map(cat => (
              <div
                key={cat.id}
                className="bg-white dark:bg-[#121A2B] p-6 rounded-3xl border border-obsidian-200/80 dark:border-white/10 hover:border-coral-500/50 hover:shadow-card transition-all duration-300 space-y-3 text-left group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-3xl p-2.5 rounded-2xl bg-obsidian-50 dark:bg-white/5 border border-obsidian-200/60 dark:border-white/10 group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${cat.badgeColor}`}>
                    {cat.badge}
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-black text-obsidian-950 dark:text-white group-hover:text-coral-500 transition-colors">
                    {cat.title}
                  </h4>
                  <p className="text-xs text-obsidian-500 dark:text-slate-400 mt-1 font-medium leading-relaxed">
                    {cat.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </section>
  );
};
