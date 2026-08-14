import React from 'react';
import { Dog } from '../../types';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { StatusBadge } from '../common/StatusBadge';
import { Heart, MapPin, Sparkles, UserCheck, Flame, ArrowUpRight } from 'lucide-react';

interface DogCardProps {
  dog: Dog;
  onSelect: (dog: Dog) => void;
}

export const DogCard: React.FC<DogCardProps> = ({ dog, onSelect }) => {
  const { toggleLikeDog, setIsApplyModalOpen, setSelectedDog, requireAuth } = useApp();
  const { playPawPop } = useAudio();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPawPop();
    toggleLikeDog(dog.id);
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
      onClick={() => onSelect(dog)}
      className="group relative bg-white rounded-4xl overflow-hidden border border-obsidian-200/90 shadow-card hover:shadow-card-hover transition-all duration-400 hover:-translate-y-2 cursor-pointer flex flex-col justify-between"
    >
      {/* Dog Photo Container with Gradient Edge */}
      <div className="relative w-full h-72 sm:h-80 overflow-hidden bg-obsidian-200">
        <img
          src={dog.coverPhoto}
          alt={dog.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Ambient Dark Gradient for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        {/* Top Badges Floating Bar */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto">
            <StatusBadge status={dog.status} size="sm" />
          </div>

          <button
            onClick={handleLike}
            className={`pointer-events-auto w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 hover:scale-115 active:scale-90 shadow-md ${
              dog.isLiked
                ? 'bg-rose-500 text-white shadow-glow-coral'
                : 'bg-white/80 hover:bg-white text-obsidian-900 hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${dog.isLiked ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Bottom Info Floating Over Image */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white drop-shadow-md">
                  {dog.name}
                </h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white border border-white/20">
                  {dog.age}
                </span>
              </div>
              <p className="text-xs text-white/90 font-medium drop-shadow-sm flex items-center gap-1.5 mt-0.5">
                <span>{dog.breed}</span>
                <span>•</span>
                <span>{dog.gender}</span>
              </p>
            </div>

            {dog.interestedCount > 0 && (
              <div className="flex items-center gap-1.5 bg-coral-500/95 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-black shadow-md">
                <Flame className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-pulse" />
                <span>{dog.interestedCount} active</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Location & Energy */}
        <div className="flex items-center justify-between text-xs font-medium text-obsidian-600">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-4 h-4 text-coral-500 shrink-0" />
            <span className="truncate font-semibold">{dog.location}</span>
          </div>
          <div className="flex items-center gap-1 text-sky-700 font-bold bg-sky-50 border border-sky-100 px-2.5 py-0.5 rounded-full shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>{dog.energy.split(' ')[0]}</span>
          </div>
        </div>

        {/* Bio Snippet */}
        <p className="text-xs text-obsidian-700 line-clamp-2 leading-relaxed font-normal">
          &ldquo;{dog.bio}&rdquo;
        </p>

        {/* Favorite Tags */}
        <div className="flex flex-wrap gap-1.5">
          {dog.favoriteThings.slice(0, 3).map((item, idx) => (
            <span
              key={idx}
              className="text-[11px] font-bold bg-obsidian-200/80 text-obsidian-800 px-3 py-1 rounded-full border border-obsidian-300/60"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Guardian Footer Card */}
        <div className="pt-4 border-t border-obsidian-200 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={dog.currentOwnerAvatar}
              alt={dog.currentOwnerName}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-coral-300 shrink-0"
            />
            <div className="min-w-0 text-left">
              <div className="text-xs font-black text-obsidian-900 truncate flex items-center gap-1">
                {dog.currentOwnerName}
                {dog.isOwnerVerified && <UserCheck className="w-3 h-3 text-emerald-500 shrink-0" />}
              </div>
              <div className="text-[10px] font-semibold text-obsidian-500 truncate">Guardian</div>
            </div>
          </div>

          {dog.status === 'available' ? (
            <button
              onClick={handleAdoptClick}
              className="bg-coral-50 hover:bg-coral-500 text-coral-600 hover:text-white border border-coral-200 hover:border-coral-500 px-4 py-2 rounded-full text-xs font-black transition-all shrink-0 hover:shadow-glow-coral flex items-center gap-1 cursor-pointer"
            >
              <span>I Want to Adopt</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="text-[11px] font-bold text-obsidian-500 bg-obsidian-200/80 px-3 py-1.5 rounded-full shrink-0">
              {dog.status === 'adopted' ? 'Adopted 🎉' : 'In Pipeline'}
            </span>
          )}

        </div>

      </div>
    </div>
  );
};
