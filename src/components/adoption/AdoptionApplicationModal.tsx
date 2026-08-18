import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import {
  X,
  Heart,
  Home,
  CheckCircle2,
  ShieldCheck,
  Send,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const AdoptionApplicationModal: React.FC = () => {
  const { isApplyModalOpen, setIsApplyModalOpen, selectedDog, currentUser, submitApplication, setActiveTab } = useApp();
  const { playSuccessChime, playPawPop } = useAudio();

  // Form Fields
  const [reason, setReason] = useState(
    'We have a secure, fenced green yard and plenty of free time. We want to give this pup an active, loving forever home with daily walks!'
  );
  const [homeType, setHomeType] = useState<'House' | 'Apartment' | 'Villa' | 'Farm'>(currentUser?.homeType || 'House');
  const [hasYard, setHasYard] = useState(currentUser?.hasYard ?? true);
  const [otherPets, setOtherPets] = useState(currentUser?.otherPets || 'None');
  const [experienceWithDogs, setExperienceWithDogs] = useState(
    'Experienced pet parent trained in positive reinforcement.'
  );
  const [workSchedule, setWorkSchedule] = useState('Remote / Work from home (someone is always around)');
  const [preferredMeetDate, setPreferredMeetDate] = useState('Tomorrow around 5:00 PM at the park');
  const [vetCareAgreement, setVetCareAgreement] = useState(true);

  if (!isApplyModalOpen || !selectedDog) return null;

  const handleClose = () => {
    setIsApplyModalOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vetCareAgreement) return;

    playSuccessChime();

    const applicantId = currentUser?.id || `user_${Date.now()}`;
    const applicantName = currentUser?.name || 'Applicant';
    const applicantAvatar = currentUser?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400';
    const applicantLocation = currentUser?.location || 'Kolkata';
    const applicantPhone = currentUser?.phone || '+91 98765 00000';
    const applicantEmail = currentUser?.email || '';

    submitApplication({
      dogId: selectedDog.id,
      dogName: selectedDog.name,
      dogPhoto: selectedDog.coverPhoto,
      dogBreed: selectedDog.breed,
      applicantId,
      applicantName,
      applicantAvatar,
      applicantLocation,
      applicantPhone,
      applicantEmail,
      reason,
      homeType,
      hasYard,
      otherPets,
      experienceWithDogs,
      vetCareAgreement,
      workSchedule,
      preferredMeetDate
    });

    setIsApplyModalOpen(false);
    setActiveTab('adopt_flow');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-obsidian-950/80 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0E1524] rounded-5xl shadow-2xl border border-obsidian-200 dark:border-white/10 my-6 p-6 sm:p-10 animate-in fade-in zoom-in-95 duration-200 text-left">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-obsidian-100 dark:bg-white/10 hover:bg-obsidian-200 dark:hover:bg-white/20 flex items-center justify-center text-obsidian-700 dark:text-slate-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Dog Thumbnail */}
        <div className="flex items-center gap-4 pb-5 border-b border-obsidian-200 dark:border-white/10">
          <img
            src={selectedDog.coverPhoto}
            alt={selectedDog.name}
            className="w-16 h-16 rounded-3xl object-cover ring-4 ring-coral-300 dark:ring-coral-500/40 shadow-md shrink-0"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-coral-50 dark:bg-coral-950/60 text-coral-600 dark:text-coral-300 font-extrabold text-[11px] mb-1 border border-coral-200 dark:border-coral-800/60">
              <Sparkles className="w-3 h-3" />
              <span>Direct Guardian Application</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-obsidian-950 dark:text-white">
              Apply to Adopt {selectedDog.name} 🐾
            </h2>
            <p className="text-xs text-obsidian-500 dark:text-slate-400 font-medium mt-0.5">
              Listed by <strong className="text-obsidian-900 dark:text-white">{selectedDog.currentOwnerName}</strong> • {selectedDog.location}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          
          {/* Question 1: Reason */}
          <div>
            <label className="block text-xs font-black text-obsidian-900 dark:text-white uppercase tracking-wider mb-1.5">
              1. Why do you want to adopt {selectedDog.name}? *
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Tell the current owner about your family, lifestyle, and love for dogs..."
              className="w-full p-4 rounded-2xl bg-obsidian-100 dark:bg-white/5 border border-obsidian-200 dark:border-white/15 focus:bg-white dark:focus:bg-[#121A2B] focus:border-coral-500 focus:ring-4 focus:ring-coral-100 dark:focus:ring-coral-500/20 text-xs sm:text-sm outline-hidden font-medium leading-relaxed text-obsidian-900 dark:text-white transition-all shadow-inner"
            />
          </div>

          {/* Question 2: Home Type & Yard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-obsidian-900 dark:text-white uppercase tracking-wider mb-1.5">
                2. Home Type *
              </label>
              <select
                value={homeType}
                onChange={e => setHomeType(e.target.value as typeof homeType)}
                className="w-full px-4 py-3 rounded-2xl bg-obsidian-100 dark:bg-[#121A2B] border border-obsidian-200 dark:border-white/15 text-xs font-extrabold text-obsidian-900 dark:text-white outline-hidden cursor-pointer"
              >
                <option value="House" className="bg-white dark:bg-[#121A2B] text-obsidian-950 dark:text-white">House (Private Property)</option>
                <option value="Apartment" className="bg-white dark:bg-[#121A2B] text-obsidian-950 dark:text-white">Apartment / Flat</option>
                <option value="Villa" className="bg-white dark:bg-[#121A2B] text-obsidian-950 dark:text-white">Villa / Bungalow</option>
                <option value="Farm" className="bg-white dark:bg-[#121A2B] text-obsidian-950 dark:text-white">Farm / Acreage</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-obsidian-900 dark:text-white uppercase tracking-wider mb-1.5">
                3. Do you have a secure yard? *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playPawPop();
                    setHasYard(true);
                  }}
                  className={`py-2.5 rounded-2xl text-xs font-black border transition-all cursor-pointer ${
                    hasYard
                      ? 'bg-coral-500 text-white border-coral-500 shadow-glow-coral'
                      : 'bg-obsidian-100 dark:bg-white/5 border-obsidian-200 dark:border-white/15 text-obsidian-700 dark:text-slate-300 hover:bg-obsidian-200 dark:hover:bg-white/10'
                  }`}
                >
                  Yes, Fenced Yard ✓
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playPawPop();
                    setHasYard(false);
                  }}
                  className={`py-2.5 rounded-2xl text-xs font-black border transition-all cursor-pointer ${
                    !hasYard
                      ? 'bg-coral-500 text-white border-coral-500 shadow-glow-coral'
                      : 'bg-obsidian-100 dark:bg-white/5 border-obsidian-200 dark:border-white/15 text-obsidian-700 dark:text-slate-300 hover:bg-obsidian-200 dark:hover:bg-white/10'
                  }`}
                >
                  No Yard / Park Walks
                </button>
              </div>
            </div>
          </div>

          {/* Question 3: Other Pets */}
          <div>
            <label className="block text-xs font-black text-obsidian-900 dark:text-white uppercase tracking-wider mb-1.5">
              4. Other pets currently in your home *
            </label>
            <input
              type="text"
              required
              value={otherPets}
              onChange={e => setOtherPets(e.target.value)}
              placeholder="e.g. 1 friendly Golden Retriever (Luna, 3 yrs old) or 'None'"
              className="w-full px-4 py-3 rounded-2xl bg-obsidian-100 dark:bg-white/5 border border-obsidian-200 dark:border-white/15 focus:bg-white dark:focus:bg-[#121A2B] focus:border-coral-500 text-xs sm:text-sm font-semibold outline-hidden text-obsidian-900 dark:text-white transition-all shadow-inner"
            />
          </div>

          {/* Question 4: Experience & Schedule */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-obsidian-900 dark:text-white uppercase tracking-wider mb-1.5">
                5. Dog Care Experience *
              </label>
              <input
                type="text"
                required
                value={experienceWithDogs}
                onChange={e => setExperienceWithDogs(e.target.value)}
                placeholder="e.g. 10+ years pet parenting experience"
                className="w-full px-4 py-3 rounded-2xl bg-obsidian-100 dark:bg-white/5 border border-obsidian-200 dark:border-white/15 focus:bg-white dark:focus:bg-[#121A2B] focus:border-coral-500 text-xs sm:text-sm font-semibold outline-hidden text-obsidian-900 dark:text-white transition-all shadow-inner"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-obsidian-900 dark:text-white uppercase tracking-wider mb-1.5">
                6. Work Routine / Day Care *
              </label>
              <input
                type="text"
                required
                value={workSchedule}
                onChange={e => setWorkSchedule(e.target.value)}
                placeholder="e.g. Remote / Hybrid work from home"
                className="w-full px-4 py-3 rounded-2xl bg-obsidian-100 dark:bg-white/5 border border-obsidian-200 dark:border-white/15 focus:bg-white dark:focus:bg-[#121A2B] focus:border-coral-500 text-xs sm:text-sm font-semibold outline-hidden text-obsidian-900 dark:text-white transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Question 5: Preferred Meetup */}
          <div>
            <label className="block text-xs font-black text-obsidian-900 dark:text-white uppercase tracking-wider mb-1.5">
              7. Preferred Time for Park Meet & Greet
            </label>
            <input
              type="text"
              value={preferredMeetDate}
              onChange={e => setPreferredMeetDate(e.target.value)}
              placeholder="e.g. Tomorrow 5:00 PM at Eco Park"
              className="w-full px-4 py-3 rounded-2xl bg-obsidian-100 dark:bg-white/5 border border-obsidian-200 dark:border-white/15 focus:bg-white dark:focus:bg-[#121A2B] focus:border-coral-500 text-xs sm:text-sm font-semibold outline-hidden text-obsidian-900 dark:text-white transition-all shadow-inner"
            />
          </div>

          {/* Vet Care Legal Agreement Checkbox */}
          <div className="p-4 rounded-3xl bg-coral-50/70 dark:bg-coral-950/40 border border-coral-200 dark:border-coral-800/50 flex items-start gap-3">
            <input
              type="checkbox"
              id="vet-agree"
              checked={vetCareAgreement}
              onChange={e => setVetCareAgreement(e.target.checked)}
              className="w-5 h-5 rounded-lg text-coral-600 focus:ring-coral-500 mt-0.5 cursor-pointer accent-coral-500"
            />
            <label htmlFor="vet-agree" className="text-xs text-obsidian-800 dark:text-slate-200 leading-relaxed font-semibold cursor-pointer">
              I commit to providing lifelong loving care, annual veterinary vaccinations, high quality nutrition, and daily exercise for {selectedDog.name}.
            </label>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!vetCareAgreement}
              className="w-full btn-primary disabled:opacity-50 text-white py-4 px-6 rounded-2xl font-black text-base shadow-glow-coral flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-5 h-5" />
              <span>Submit Adoption Application to {selectedDog.currentOwnerName} 🚀</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
