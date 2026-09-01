import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { X, Heart, Sparkles, Upload, Camera, CheckCircle2, MapPin, Smile } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ShareStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareStoryModal: React.FC<ShareStoryModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, addSuccessStory, dogs } = useApp();
  const { playSuccessChime, playPawPop } = useAudio();

  const [dogName, setDogName] = useState('');
  const [dogBreed, setDogBreed] = useState('');
  const [location, setLocation] = useState(currentUser?.location || 'Kolkata, Salt Lake');
  const [story, setStory] = useState('');
  const [photo, setPhoto] = useState('https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!dogName.trim()) {
      setErrorMsg('Please enter the name of your adopted dog.');
      return;
    }
    if (!story.trim() || story.trim().length < 15) {
      setErrorMsg('Please write a brief story or experience (at least 15 characters).');
      return;
    }

    setIsSubmitting(true);
    playPawPop();

    const newStory = {
      id: `story_${Date.now()}`,
      dogName: dogName.trim(),
      dogBreed: dogBreed.trim() || 'Loving Dog',
      dogPhoto: photo,
      adopterName: currentUser?.name || 'Verified Pet Parent',
      adopterAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
      location: location.trim() || 'India',
      story: story.trim(),
      date: 'Just now',
      likesCount: 1,
      isLiked: true,
    };

    addSuccessStory(newStory);
    playSuccessChime();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#121A2B] rounded-4xl p-6 sm:p-8 border border-obsidian-200 dark:border-white/10 shadow-2xl space-y-6 text-left max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-obsidian-200 dark:border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-black text-xs uppercase tracking-wider mb-1">
              <Smile className="w-3.5 h-3.5" />
              <span>Happy Tails</span>
            </div>
            <h2 className="text-2xl font-black font-display text-obsidian-950 dark:text-white">
              Share Adoption Story 🎉
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-obsidian-100 dark:bg-white/10 hover:bg-obsidian-200 text-obsidian-600 dark:text-slate-300 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-bold text-rose-700 dark:text-rose-300 rounded-2xl">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Photo Preview & Upload */}
          <div>
            <label className="block text-xs font-black text-obsidian-800 dark:text-slate-200 mb-1.5">
              Happy Dog & Family Photo 📸
            </label>
            <div className="relative h-44 rounded-2xl overflow-hidden bg-obsidian-100 dark:bg-white/5 border border-obsidian-200 dark:border-white/10 group">
              <img src={photo} alt="Story preview" className="w-full h-full object-cover" />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center text-white text-xs font-black gap-2 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Change Photo</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Dog Name & Breed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-obsidian-800 dark:text-slate-200 mb-1">
                Dog&apos;s Name *
              </label>
              <input
                type="text"
                value={dogName}
                onChange={e => setDogName(e.target.value)}
                placeholder="e.g. Pogo"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-obsidian-50 dark:bg-white/5 border border-obsidian-200 dark:border-white/10 text-xs font-bold text-obsidian-950 dark:text-white outline-hidden focus:border-coral-500"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-obsidian-800 dark:text-slate-200 mb-1">
                Breed / Type
              </label>
              <input
                type="text"
                value={dogBreed}
                onChange={e => setDogBreed(e.target.value)}
                placeholder="e.g. Labrador Retriever"
                className="w-full px-4 py-2.5 rounded-xl bg-obsidian-50 dark:bg-white/5 border border-obsidian-200 dark:border-white/10 text-xs font-bold text-obsidian-950 dark:text-white outline-hidden focus:border-coral-500"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-black text-obsidian-800 dark:text-slate-200 mb-1">
              Your City & Area *
            </label>
            <div className="relative">
              <MapPin className="w-3.5 h-3.5 absolute left-3.5 top-3 text-coral-500" />
              <input
                type="text"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="e.g. Kolkata, Salt Lake"
                required
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-obsidian-50 dark:bg-white/5 border border-obsidian-200 dark:border-white/10 text-xs font-bold text-obsidian-950 dark:text-white outline-hidden focus:border-coral-500"
              />
            </div>
          </div>

          {/* Story Text */}
          <div>
            <label className="block text-xs font-black text-obsidian-800 dark:text-slate-200 mb-1">
              Your Happy Adoption Experience & Story *
            </label>
            <textarea
              rows={3}
              value={story}
              onChange={e => setStory(e.target.value)}
              placeholder="Tell others how bringing this pup home transformed your life and how smooth the PawConnect handover was..."
              required
              className="w-full px-4 py-2.5 rounded-xl bg-obsidian-50 dark:bg-white/5 border border-obsidian-200 dark:border-white/10 text-xs font-normal text-obsidian-950 dark:text-white outline-hidden focus:border-coral-500 leading-relaxed"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary text-white py-3.5 rounded-2xl font-black text-xs shadow-glow-coral flex items-center justify-center gap-2 cursor-pointer hover:scale-102 active:scale-98 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Publish Happy Tails Story 🐾</span>
          </button>
        </form>

      </div>
    </div>
  );
};
