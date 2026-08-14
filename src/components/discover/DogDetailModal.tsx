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
  Flag,
  Share2,
  Sparkles,
  Info,
  ArrowRight,
} from 'lucide-react';

interface DogDetailModalProps {
  dog: Dog | null;
  onClose: () => void;
}

export const DogDetailModal: React.FC<DogDetailModalProps> = ({ dog, onClose }) => {
  const { toggleLikeDog, setIsApplyModalOpen, setIsReportModalOpen, setSelectedDog, requireAuth } = useApp();
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
    requireAuth(`Please verify your mobile number with OTP to apply for adopting ${dog.name}.`, () => {
      setSelectedDog(dog);
      setIsApplyModalOpen(true);
      onClose();
    });
  };

  const handleReport = () => {
    playPawPop();
    requireAuth('Please verify your mobile number to report a listing.', () => {
      setSelectedDog(dog);
      setIsReportModalOpen(true);
    });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-obsidian-950/80 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-5xl shadow-2xl border border-obsidian-200 my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-30 w-11 h-11 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-md flex items-center justify-center transition-all shadow-md cursor-pointer hover:scale-105"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* LEFT: Photography Column (5 cols) */}
          <div className="lg:col-span-5 bg-obsidian-950 flex flex-col justify-between relative min-h-[380px] lg:min-h-full">
            
            {/* Active Image */}
            <div className="relative w-full h-80 sm:h-96 lg:h-full overflow-hidden">
              <img
                src={currentPhoto}
                alt={dog.name}
                className="w-full h-full object-cover transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />

              {/* Status Badge */}
              <div className="absolute top-5 left-5 z-10">
                <StatusBadge status={dog.status} size="md" />
              </div>

              {/* Action Bar over Image */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                <button
                  onClick={handleHearBark}
                  className="flex items-center gap-2 bg-white text-obsidian-950 px-4 py-2 rounded-full text-xs font-black shadow-elevated hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-coral-500 animate-bounce" />
                  <span>Hear Bark 🐾</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLike}
                    className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-md cursor-pointer ${
                      dog.isLiked ? 'bg-rose-500 text-white shadow-glow-coral' : 'bg-white/80 text-obsidian-950 hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${dog.isLiked ? 'fill-white' : ''}`} />
                  </button>
                  
                  <button
                    onClick={handleShare}
                    title="Share Profile"
                    className="w-10 h-10 rounded-full bg-white/80 hover:bg-white text-obsidian-950 flex items-center justify-center backdrop-blur-md shadow-md transition-all cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {photos.length > 1 && (
              <div className="p-3 bg-black/90 border-t border-white/10 flex items-center gap-2 overflow-x-auto">
                {photos.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIdx(idx)}
                    className={`relative rounded-2xl overflow-hidden w-14 h-14 shrink-0 border-2 transition-all cursor-pointer ${
                      activePhotoIdx === idx ? 'border-coral-500 scale-105 shadow-glow-coral' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={p} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Profile Content (7 cols) */}
          <div className="lg:col-span-7 p-6 sm:p-10 space-y-6 text-left bg-white">
            
            {/* Header: Name, Breed, Location */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl sm:text-4xl font-black font-display text-obsidian-950">
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
                  <div className="text-xs text-obsidian-500 font-bold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-coral-500" />
                    <span>{dog.location}</span>
                  </div>
                  <div className="text-[11px] text-obsidian-500 mt-1 font-semibold">
                    ❤️ {dog.likesCount} Likes • 🐾 {dog.interestedCount} Inquiries
                  </div>
                </div>
              </div>

              {copiedLink && (
                <div className="mt-2 text-xs text-emerald-700 font-bold bg-emerald-50 p-2 rounded-xl text-center border border-emerald-200">
                  ✓ Profile link copied to clipboard!
                </div>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-obsidian-100 border border-obsidian-200 text-center">
                <div className="text-[10px] uppercase font-bold text-obsidian-400">Size</div>
                <div className="text-xs font-black text-obsidian-900 mt-0.5">{dog.size}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-obsidian-100 border border-obsidian-200 text-center">
                <div className="text-[10px] uppercase font-bold text-obsidian-400">Energy</div>
                <div className="text-xs font-black text-obsidian-900 mt-0.5">{dog.energy.split(' ')[0]}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-obsidian-100 border border-obsidian-200 text-center">
                <div className="text-[10px] uppercase font-bold text-obsidian-400">Adoption Type</div>
                <div className="text-xs font-black text-coral-600 mt-0.5">{dog.adoptionType}</div>
              </div>
            </div>

            {/* About Bio */}
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-obsidian-400 mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-coral-500" />
                <span>About {dog.name}</span>
              </h4>
              <p className="text-xs sm:text-sm text-obsidian-800 leading-relaxed bg-obsidian-100/80 p-4 rounded-2xl border border-obsidian-200">
                {dog.bio}
              </p>
            </div>

            {/* Reason for Rehoming */}
            {dog.reasonForAdoption && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                <h4 className="text-xs font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-600" />
                  <span>Reason for Rehoming</span>
                </h4>
                <p className="text-xs text-amber-900/90 leading-relaxed font-medium">
                  &ldquo;{dog.reasonForAdoption}&rdquo;
                </p>
              </div>
            )}

            {/* Favorite Things & Personality */}
            <div className="space-y-2">
              <div>
                <span className="text-[11px] font-bold text-obsidian-400 uppercase tracking-wider">
                  Favorite Things:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {dog.favoriteThings.map((fav, i) => (
                    <span
                      key={i}
                      className="text-xs font-bold px-3 py-1 rounded-full bg-coral-50 text-coral-700 border border-coral-200"
                    >
                      {fav}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-obsidian-400 uppercase tracking-wider">
                  Personality & Traits:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {dog.personalityTraits.map((trait, i) => (
                    <span
                      key={i}
                      className="text-xs font-bold px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-200"
                    >
                      ✨ {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Health & Veterinary Clearance Panel */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Verified Medical & Vet Clearance</span>
                </span>
                <span className="text-[10px] font-black bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                  100% Cleared
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs font-bold text-emerald-900 pt-1">
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
                <p className="text-[11px] text-emerald-900 pt-1 border-t border-emerald-200 leading-relaxed">
                  Notes: {dog.medicalNotes}
                </p>
              )}
            </div>

            {/* Guardian Footer */}
            <div className="p-4 rounded-2xl bg-obsidian-100 border border-obsidian-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={dog.currentOwnerAvatar}
                  alt={dog.currentOwnerName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-coral-300"
                />
                <div>
                  <div className="text-xs font-black text-obsidian-950 flex items-center gap-1">
                    <span>Listed by {dog.currentOwnerName}</span>
                    {dog.isOwnerVerified && (
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-sm">
                        ✓ Verified Guardian
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-obsidian-500">
                    Kolkata Verified Member • 24h Response Rate
                  </div>
                </div>
              </div>

              <button
                onClick={handleReport}
                className="text-obsidian-500 hover:text-rose-600 text-xs font-bold flex items-center gap-1 p-1 rounded-lg transition-colors cursor-pointer"
                title="Report this listing for safety review"
              >
                <Flag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Report</span>
              </button>
            </div>

            {/* Adoption CTA */}
            <div className="pt-2">
              {dog.status === 'available' ? (
                <button
                  onClick={handleApply}
                  className="w-full btn-primary text-white py-4 px-6 rounded-2xl font-black text-base shadow-glow-coral flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  <span>🐾 I Want to Adopt {dog.name}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                  <span className="text-xs font-bold text-amber-900">
                    This pup currently has an active adoption in pipeline ({dog.status.replace('_', ' ')}).
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
