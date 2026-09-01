import React from 'react';
import { Dog } from '../../types';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { StatusBadge } from '../common/StatusBadge';
import { Heart, MapPin, Sparkles, UserCheck, Flame, ArrowUpRight, MessageSquare } from 'lucide-react';

interface DogCardProps {
  dog: Dog;
  onSelect: (dog: Dog) => void;
}

export const DogCard: React.FC<DogCardProps> = ({ dog, onSelect }) => {
  const { currentUser, toggleLikeDog, setIsApplyModalOpen, setSelectedDog, requireAuth, openChatForDog } = useApp();
  const { playPawPop } = useAudio();

  const handleCardClick = () => {
    playPawPop();
    if (!currentUser) {
      requireAuth(`Log in with your mobile number to view full details, vet records, and contact ${dog.name}'s guardian!`, () => {
        onSelect(dog);
      });
      return;
    }
    onSelect(dog);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPawPop();
    if (!currentUser) {
      requireAuth(`Log in with your mobile number to save ${dog.name} to your favorites!`, () => {
        toggleLikeDog(dog.id);
      });
      return;
    }
    toggleLikeDog(dog.id);
  };

  const handleChatClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPawPop();
    requireAuth(`Please verify your mobile number to message ${dog.currentOwnerName} about ${dog.name}.`, () => {
      openChatForDog(dog);
    });
  };

  const handleAdoptClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPawPop();
    requireAuth(`Please verify your mobile number with OTP to apply for adopting ${dog.name}.`, () => {
      setSelectedDog(dog);
      setIsApplyModalOpen(true);
    });
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white dark:bg-[#121927] rounded-3xl overflow-hidden border border-obsidian-200 dark:border-white/10 shadow-card hover:shadow-card-hover transition-all duration-400 hover:-translate-y-2 cursor-pointer flex flex-col justify-between"
    >
      {/* Dog Photo Container with Gradient Overlay */}
      <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-obsidian-100 dark:bg-[#0B0F19]">
        <img
          src={dog.coverPhoto}
          alt={dog.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Dark Gradient Overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30" />

        {/* Top Badges Floating Bar */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none z-10">
          <div className="pointer-events-auto flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-extrabold border border-white/20 shadow-xs">
              📍 2 km away
            </span>
            <StatusBadge status={dog.status} size="sm" />
          </div>

          <button
            type="button"
            onClick={handleLike}
            className={`pointer-events-auto w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 hover:scale-110 active:scale-90 shadow-md ${
              dog.isLiked
                ? 'bg-rose-500 text-white shadow-glow-coral'
                : 'bg-black/50 hover:bg-black/80 text-white border border-white/20'
            }`}
          >
            <Heart className={`w-4 h-4 ${dog.isLiked ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Bottom Info Floating Over Image */}
        <div className="absolute bottom-3 left-4 right-4 text-white z-10">
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xl sm:text-2xl font-black font-display text-white drop-shadow-md">
                  {dog.name}
                </h3>
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black shrink-0">
                  ✓
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                {dog.breed}
              </p>
            </div>

            {/* Age & Gender Pill */}
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-200 bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20">
              <span>📅 {dog.age}</span>
              <span>•</span>
              <span>{dog.gender === 'Male' ? '♂ Male' : '♀ Female'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5 text-left">
        
        {/* Location & Energy */}
        <div className="flex items-center justify-between text-xs font-medium text-obsidian-600 dark:text-slate-300">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-coral-500 shrink-0" />
            <span className="truncate font-semibold text-obsidian-700 dark:text-slate-300">{dog.location}</span>
          </div>
          <div className="flex items-center gap-1 text-sky-700 dark:text-sky-400 font-bold bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/30 px-2 py-0.5 rounded-full shrink-0 text-[11px]">
            <Sparkles className="w-3 h-3 text-sky-500 dark:text-sky-400" />
            <span>{dog.energy.split(' ')[0]}</span>
          </div>
        </div>

        {/* Bio Snippet */}
        <p className="text-xs text-obsidian-700 dark:text-obsidian-300 line-clamp-2 leading-relaxed font-normal">
          &ldquo;{dog.bio}&rdquo;
        </p>

        {/* Favorite Tags */}
        <div className="flex flex-wrap gap-1.5">
          {dog.favoriteThings.slice(0, 3).map((item, idx) => (
            <span
              key={idx}
              className="text-[11px] font-bold bg-obsidian-100 dark:bg-white/5 text-obsidian-800 dark:text-obsidian-200 px-3 py-1 rounded-full border border-obsidian-200/80 dark:border-white/10"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Guardian Footer Card */}
        <div className="pt-4 border-t border-obsidian-200 dark:border-white/10 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={dog.currentOwnerAvatar}
              alt={dog.currentOwnerName}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-coral-300 shrink-0"
            />
            <div className="min-w-0 text-left">
              <div className="text-xs font-black text-obsidian-900 dark:text-white truncate flex items-center gap-1">
                {dog.currentOwnerName}
                {dog.isOwnerVerified && <UserCheck className="w-3 h-3 text-emerald-500 shrink-0" />}
              </div>
              <div className="text-[10px] font-semibold text-obsidian-500 dark:text-obsidian-400 truncate">Guardian</div>
            </div>
          </div>

          {dog.status !== 'adopted' ? (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleChatClick}
                className="bg-obsidian-100 hover:bg-sky-50 dark:bg-white/10 dark:hover:bg-sky-950/80 text-obsidian-800 hover:text-sky-600 dark:text-slate-200 dark:hover:text-sky-300 border border-obsidian-200/80 dark:border-white/10 hover:border-sky-300 dark:hover:border-sky-700/80 px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                title={`Chat directly with ${dog.currentOwnerName} about ${dog.name}`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
                <span>Chat</span>
              </button>

              <button
                type="button"
                onClick={handleAdoptClick}
                className="bg-gradient-to-r from-coral-500 via-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white px-4 py-1.5 rounded-full text-xs font-black tracking-wide transition-all shrink-0 shadow-glow-coral hover:shadow-lg flex items-center gap-1.5 cursor-pointer active:scale-95 hover:scale-105"
                title={`Apply to adopt ${dog.name}`}
              >
                <span>Adopt</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-white stroke-[2.5]" />
              </button>
            </div>
          ) : (
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-3 py-1.5 rounded-full shrink-0">
              Adopted 🎉
            </span>
          )}

        </div>

      </div>
    </div>
  );
};
