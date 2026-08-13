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
  const [homeType, setHomeType] = useState<'House' | 'Apartment' | 'Villa' | 'Farm'>(currentUser.homeType || 'House');
  const [hasYard, setHasYard] = useState(currentUser.hasYard ?? true);
  const [otherPets, setOtherPets] = useState(currentUser.otherPets || '1 friendly Golden Retriever (Luna)');
  const [experienceWithDogs, setExperienceWithDogs] = useState(
    'Over 10+ years raising and training dogs with positive reinforcement.'
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

    submitApplication({
      dogId: selectedDog.id,
      dogName: selectedDog.name,
      dogPhoto: selectedDog.coverPhoto,
      dogBreed: selectedDog.breed,
      applicantId: currentUser.id,
      applicantName: currentUser.name,
      applicantAvatar: currentUser.avatar,
      applicantLocation: currentUser.location,
      applicantPhone: currentUser.phone,
      applicantEmail: currentUser.email,
      reason,
      homeType,
      hasYard,
      otherPets,
      experienceWithDogs,
      vetCareAgreement,
      workSchedule,
      preferredMeetDate,
    });

    handleClose();
    setActiveTab('adopt_flow');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-obsidian-900/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-4xl p-6 sm:p-8 shadow-2xl border border-obsidian-300 my-6 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-obsidian-300 hover:bg-obsidian-400 flex items-center justify-center text-obsidian-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header with Dog Preview */}
        <div className="flex items-center gap-4 pb-5 border-b border-obsidian-400/40 text-left">
          <img
            src={selectedDog.coverPhoto}
            alt={selectedDog.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-coral-400 shrink-0"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-coral-50 text-coral-600 font-bold text-[11px] mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Official Adoption Application</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-display text-obsidian-900 leading-tight">
              Adoption Request for {selectedDog.name} 🐾
            </h2>
            <p className="text-xs text-obsidian-600">
              {selectedDog.breed} • {selectedDog.age} • Listed by {selectedDog.currentOwnerName}
            </p>
          </div>
        </div>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-left">
          
          {/* Question 1: Why adopt */}
          <div>
            <label className="block text-xs font-bold text-obsidian-900 mb-1">
              1. Why do you want to adopt {selectedDog.name}? *
            </label>
            <textarea
              rows={2}
              required
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Tell the owner about your home environment, motivation, and care plan..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-obsidian-400/80 focus:border-coral-500 text-xs outline-hidden leading-relaxed"
            />
          </div>

          {/* Question 2: Home Type & Yard */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-obsidian-900 mb-1">
                2. Home Type
              </label>
              <select
                value={homeType}
                onChange={e => setHomeType(e.target.value as typeof homeType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-obsidian-400/80 focus:border-coral-500 text-xs outline-hidden bg-white"
              >
                <option value="House">Independent House</option>
                <option value="Apartment">Apartment / Flat</option>
                <option value="Villa">Villa with Garden</option>
                <option value="Farm">Farmhouse / Acreage</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-obsidian-900 mb-1">
                Fenced Yard Available?
              </label>
              <div className="flex items-center gap-3 pt-2">
                <label className="flex items-center gap-1.5 text-xs font-bold text-obsidian-800 cursor-pointer">
                  <input
                    type="radio"
                    name="hasYard"
                    checked={hasYard}
                    onChange={() => setHasYard(true)}
                    className="text-coral-500 focus:ring-coral-400"
                  />
                  <span>Yes, Secure Yard ✓</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs font-bold text-obsidian-800 cursor-pointer">
                  <input
                    type="radio"
                    name="hasYard"
                    checked={!hasYard}
                    onChange={() => setHasYard(false)}
                    className="text-coral-500 focus:ring-coral-400"
                  />
                  <span>No (Walks only)</span>
                </label>
              </div>
            </div>
          </div>

          {/* Question 3: Other Pets & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-obsidian-900 mb-1">
                3. Other Pets in the Household
              </label>
              <input
                type="text"
                value={otherPets}
                onChange={e => setOtherPets(e.target.value)}
                placeholder="e.g. 1 dog, 2 cats, or None"
                className="w-full px-3.5 py-2.5 rounded-xl border border-obsidian-400/80 focus:border-coral-500 text-xs outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-obsidian-900 mb-1">
                4. Dog Experience Level
              </label>
              <input
                type="text"
                value={experienceWithDogs}
                onChange={e => setExperienceWithDogs(e.target.value)}
                placeholder="e.g. Lifelong dog owner, First time..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-obsidian-400/80 focus:border-coral-500 text-xs outline-hidden"
              />
            </div>
          </div>

          {/* Question 5: Schedule & Preferred Meetup */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-obsidian-900 mb-1">
                5. Daily Routine / Work Hours
              </label>
              <input
                type="text"
                value={workSchedule}
                onChange={e => setWorkSchedule(e.target.value)}
                placeholder="e.g. Work from home, 4h away..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-obsidian-400/80 focus:border-coral-500 text-xs outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-obsidian-900 mb-1">
                Preferred Meet & Greet Time
              </label>
              <input
                type="text"
                value={preferredMeetDate}
                onChange={e => setPreferredMeetDate(e.target.value)}
                placeholder="e.g. This Saturday 4:00 PM"
                className="w-full px-3.5 py-2.5 rounded-xl border border-obsidian-400/80 focus:border-coral-500 text-xs outline-hidden"
              />
            </div>
          </div>

          {/* Verification / Legal Checkbox */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs font-bold text-emerald-950">
              <input
                type="checkbox"
                required
                checked={vetCareAgreement}
                onChange={e => setVetCareAgreement(e.target.checked)}
                className="w-4 h-4 text-coral-500 rounded-sm focus:ring-coral-400 mt-0.5"
              />
              <span>
                I promise to provide regular veterinary care, nutritious food, unconditional affection, and a safe home for {selectedDog.name}.
              </span>
            </label>
          </div>

          {/* Submit CTA */}
          <div className="pt-3 border-t border-obsidian-400/40 flex items-center justify-between">
            <div className="text-[11px] text-obsidian-500">
              🔒 Chat unlocks immediately once owner accepts.
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-coral-500 via-coral-600 to-coral-700 hover:from-coral-600 hover:to-coral-800 text-white px-7 py-3 rounded-full font-black text-xs shadow-soft hover:shadow-soft-hover transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Adoption Request 🐾</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
