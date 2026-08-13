import React from 'react';
import { Dog } from '../../types';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { StatusBadge } from '../common/StatusBadge';
import { Heart, MapPin, Sparkles, UserCheck, Flame } from 'lucide-react';

interface DogCardProps {
  dog: Dog;
  onSelect: (dog: Dog) => void;
}

export const DogCard: React.FC<DogCardProps> = ({ dog, onSelect }) => {
  const { toggleLikeDog, setIsApplyModalOpen, setSelectedDog } = useApp();
  const { playPawPop } = useAudio();

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPawPop();
    toggleLikeDog(dog.id);
  };

  const handleAdoptClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPawPop();
    setSelectedDog(dog);
    setIsApplyModalOpen(true);
  };

  return (
    <div
      onClick={() => onSelect(dog)}
      className="group relative bg-white rounded-3xl overflow-hidden border border-obsidian-400/50 shadow-soft hover:shadow-soft-hover transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
    >
      {/* Dog Photo Container */}
      <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-obsidian-300">
        <img
          src={dog.coverPhoto}
          alt={dog.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/80 via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto">
            <StatusBadge status={dog.status} size="sm" />
          </div>

          <button
            onClick={handleLike}
            className={`pointer-events-auto w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-transform duration-200 hover:scale-110 active:scale-95 shadow-sm ${
              dog.isLiked
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 text-obsidian-800 hover:bg-white hover:text-rose-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${dog.isLiked ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Bottom Info over Image */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-end justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-black font-display tracking-tight text-white drop-shadow-sm">
                  {dog.name}
                </h3>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/20">
                  {dog.age}
                </span>
              </div>
              <p className="text-xs text-white/90 font-medium drop-shadow-sm flex items-center gap-1 mt-0.5">
                <span>{dog.breed}</span>
                <span>•</span>
                <span>{dog.gender}</span>
              </p>
            </div>

            {dog.interestedCount > 0 && (
              <div className="flex items-center gap-1 bg-coral-500/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-bold shadow-xs">
                <Flame className="w-3 h-3 fill-amber-300 text-amber-300" />
                <span>{dog.interestedCount} interested</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Content & Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Location & Energy */}
        <div className="flex items-center justify-between text-xs text-obsidian-600">
          <div className="flex items-center gap-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-coral-500 shrink-0" />
            <span className="truncate">{dog.location}</span>
          </div>
          <div className="flex items-center gap-1 text-sky-600 font-semibold bg-sky-50 px-2 py-0.5 rounded-md shrink-0">
            <Sparkles className="w-3 h-3" />
            <span>{dog.energy.split(' ')[0]}</span>
          </div>
        </div>

        {/* Bio Snippet */}
        <p className="text-xs text-obsidian-700 line-clamp-2 leading-relaxed italic">
          &ldquo;{dog.bio}&rdquo;
        </p>

        {/* Favorite Tags Preview */}
        <div className="flex flex-wrap gap-1.5">
          {dog.favoriteThings.slice(0, 3).map((item, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium bg-obsidian-300/80 text-obsidian-700 px-2.5 py-0.5 rounded-full"
            >
              {item}
            </span>
          ))}
        </div>

        {/* Owner Card & CTA */}
        <div className="pt-3 border-t border-obsidian-400/40 flex items-center justify-between gap-3">
          
          <div className="flex items-center gap-2 min-w-0">
            <img
              src={dog.currentOwnerAvatar}
              alt={dog.currentOwnerName}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-coral-300 shrink-0"
            />
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-obsidian-900 truncate flex items-center gap-1">
                {dog.currentOwnerName}
                {dog.isOwnerVerified && <UserCheck className="w-3 h-3 text-emerald-500 shrink-0" />}
              </div>
              <div className="text-[10px] text-obsidian-500 truncate">Current Guardian</div>
            </div>
          </div>

          {dog.status === 'available' ? (
            <button
              onClick={handleAdoptClick}
              className="bg-coral-50 hover:bg-coral-500 text-coral-600 hover:text-white border border-coral-200 hover:border-coral-500 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 hover:shadow-sm"
            >
              🐾 I Want to Adopt
            </button>
          ) : (
            <span className="text-[11px] font-bold text-obsidian-500 bg-obsidian-300/60 px-2.5 py-1 rounded-full shrink-0">
              In Progress
            </span>
          )}

        </div>

      </div>
    </div>
  );
};
