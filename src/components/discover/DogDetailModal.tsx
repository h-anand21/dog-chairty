import React, { useState } from 'react';
import { Dog } from '../../types';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { StatusBadge } from '../common/StatusBadge';
import {
  X,
  MapPin,
  Heart,
  Volume2,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Flag,
  Share2,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react';

interface DogDetailModalProps {
  dog: Dog | null;
  onClose: () => void;
}

export const DogDetailModal: React.FC<DogDetailModalProps> = ({ dog, onClose }) => {
  const { toggleLikeDog, setIsApplyModalOpen, setIsReportModalOpen, setSelectedDog } = useApp();
  const { playDogBark, playPawPop } = useAudio();

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!dog) return null;

  const handleLike = () => {
    playPawPop();
    toggleLikeDog(dog.id);
  };

  const handleHearBark = () => {
    playDogBark();
  };

  const handleApply = () => {
    playPawPop();
    setSelectedDog(dog);
    setIsApplyModalOpen(true);
  };

  const handleReport = () => {
    playPawPop();
    setSelectedDog(dog);
    setIsReportModalOpen(true);
  };

  const handleShare = () => {
    playPawPop();
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const photos = dog.photos.length > 0 ? dog.photos : [dog.coverPhoto];
  const currentPhoto = photos[activePhotoIdx] || dog.coverPhoto;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-obsidian-900/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-4xl shadow-2xl border border-obsidian-300 my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-colors shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* LEFT: Photo Gallery Column (5 cols) */}
          <div className="lg:col-span-5 bg-obsidian-900 flex flex-col justify-between relative min-h-[340px] lg:min-h-full">
            
            {/* Main Active Photo */}
            <div className="relative w-full h-80 sm:h-96 lg:h-full overflow-hidden">
              <img
                src={currentPhoto}
                alt={dog.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-900/90 via-transparent to-black/20" />

              {/* Status Badge in Photo */}
              <div className="absolute top-4 left-4 z-10">
                <StatusBadge status={dog.status} size="md" />
              </div>

              {/* Hear My Bark Floating Button */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <button
                  onClick={handleHearBark}
                  className="flex items-center gap-2 bg-white/90 hover:bg-white text-obsidian-900 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black shadow-lg hover:scale-105 transition-all"
                >
                  <Volume2 className="w-4 h-4 text-coral-500 animate-pulse" />
                  <span>Hear My Bark! 🐾</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLike}
                    className={`w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md ${
                      dog.isLiked ? 'bg-rose-500 text-white' : 'bg-white/80 text-obsidian-900 hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${dog.isLiked ? 'fill-white' : ''}`} />
                  </button>
                  
                  <button
                    onClick={handleShare}
                    title="Share Dog Profile"
                    className="w-9 h-9 rounded-full bg-white/80 hover:bg-white text-obsidian-900 flex items-center justify-center backdrop-blur-md shadow-md transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnails Tray */}
            {photos.length > 1 && (
              <div className="p-3 bg-obsidian-900/90 border-t border-obsidian-800 flex items-center gap-2 overflow-x-auto">
                {photos.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative rounded-xl overflow-hidden w-14 h-14 shrink-0 border-2 transition-all ${
                      activePhotoIdx === idx ? 'border-coral-500 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={p} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Dog Details & Actions (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 text-left">
            
            {/* Header: Name, Breed, Location */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl sm:text-4xl font-black font-display text-obsidian-900">
                      {dog.name}
                    </h2>
                    <span className="px-3 py-1 rounded-full bg-coral-50 border border-coral-200 text-coral-600 font-extrabold text-xs">
                      {dog.adoptionType}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-obsidian-600 mt-1">
                    {dog.breed} • {dog.age} • {dog.gender}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-xs text-obsidian-500 font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-coral-500" />
                    <span>{dog.location}</span>
                  </div>
                  <div className="text-[11px] text-obsidian-500 mt-1 font-semibold">
                    ❤️ {dog.likesCount} Likes • 🐾 {dog.interestedCount} Inquiries
                  </div>
                </div>
              </div>

              {copiedLink && (
                <div className="mt-2 text-xs text-emerald-600 font-bold bg-emerald-50 p-1.5 rounded-lg text-center">
                  ✓ Profile link copied to clipboard!
                </div>
              )}
            </div>

            {/* Key Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 rounded-2xl bg-obsidian-300/60 text-center">
                <div className="text-[10px] uppercase font-bold text-obsidian-500">Size</div>
                <div className="text-xs font-black text-obsidian-900 mt-0.5">{dog.size}</div>
              </div>
              <div className="p-3 rounded-2xl bg-obsidian-300/60 text-center">
                <div className="text-[10px] uppercase font-bold text-obsidian-500">Energy</div>
                <div className="text-xs font-black text-obsidian-900 mt-0.5">{dog.energy.split(' ')[0]}</div>
              </div>
              <div className="p-3 rounded-2xl bg-obsidian-300/60 text-center">
                <div className="text-[10px] uppercase font-bold text-obsidian-500">Adoption Type</div>
                <div className="text-xs font-black text-coral-600 mt-0.5">{dog.adoptionType}</div>
              </div>
            </div>

            {/* About / Bio Section */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-obsidian-500 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-coral-500" />
                <span>About {dog.name}</span>
              </h4>
              <p className="text-xs sm:text-sm text-obsidian-800 leading-relaxed bg-obsidian-300/30 p-3.5 rounded-2xl border border-obsidian-400/40">
                {dog.bio}
              </p>
            </div>

            {/* Reason for Rehoming */}
            {dog.reasonForAdoption && (
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                <h4 className="text-xs font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-600" />
                  <span>Reason for Rehoming</span>
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  &ldquo;{dog.reasonForAdoption}&rdquo;
                </p>
              </div>
            )}

            {/* Favorite Things & Personality Traits */}
            <div className="space-y-2">
              <div>
                <span className="text-[11px] font-bold text-obsidian-500 uppercase tracking-wider">
                  Favorite Things:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {dog.favoriteThings.map((fav, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold px-3 py-1 rounded-full bg-coral-50 text-coral-700 border border-coral-200"
                    >
                      {fav}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-obsidian-500 uppercase tracking-wider">
                  Personality & Quirks:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {dog.personalityTraits.map((trait, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200"
                    >
                      ✨ {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Health, Vaccination & Veterinary Panel */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Medical & Vet Panel</span>
                </span>
                <span className="text-[10px] font-extrabold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                  100% Cleared
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-semibold text-emerald-800">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Vaccinated</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Neutered</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Microchipped</span>
                </div>
              </div>

              {dog.medicalNotes && (
                <p className="text-[11px] text-emerald-800/90 pt-1 border-t border-emerald-200/60 leading-relaxed">
                  Notes: {dog.medicalNotes}
                </p>
              )}
            </div>

            {/* Current Owner Profile Footnote */}
            <div className="p-3.5 rounded-2xl bg-obsidian-300/60 border border-obsidian-400/50 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={dog.currentOwnerAvatar}
                  alt={dog.currentOwnerName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-coral-300"
                />
                <div>
                  <div className="text-xs font-bold text-obsidian-900 flex items-center gap-1">
                    <span>Listed by {dog.currentOwnerName}</span>
                    {dog.isOwnerVerified && (
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-100 px-1.5 py-0.2 rounded-sm">
                        ✓ Verified Owner
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-obsidian-500">
                    Kolkata Community Member • 24h Response Rate
                  </div>
                </div>
              </div>

              <button
                onClick={handleReport}
                className="text-obsidian-500 hover:text-rose-600 text-[11px] font-bold flex items-center gap-1 p-1 rounded-lg transition-colors"
                title="Report this listing for safety review"
              >
                <Flag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Report</span>
              </button>
            </div>

            {/* Adoption Call to Action Bar */}
            <div className="pt-2">
              {dog.status === 'available' ? (
                <button
                  onClick={handleApply}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-coral-500 via-coral-600 to-coral-700 hover:from-coral-600 hover:to-coral-800 text-white py-4 px-6 rounded-2xl font-black text-base shadow-soft hover:shadow-soft-hover transition-all hover:scale-[1.01]"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  <span>🐾 I Want to Adopt {dog.name}</span>
                </button>
              ) : (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                  <span className="text-xs font-bold text-amber-800">
                    This dog currently has an active adoption in progress ({dog.status.replace('_', ' ')}).
                  </span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
