import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { X, Calendar, MapPin, Clock, Sparkles } from 'lucide-react';

interface MeetAndGreetModalProps {
  isOpen: boolean;
  onClose: () => void;
  dogId: string;
  dogName: string;
  applicationId: string;
  adopterId: string;
}

export const MeetAndGreetModal: React.FC<MeetAndGreetModalProps> = ({
  isOpen,
  onClose,
  dogId,
  dogName,
  applicationId,
  adopterId,
}) => {
  const { currentUser, scheduleMeetup } = useApp();
  const { playSuccessChime, playPawPop } = useAudio();

  const [date, setDate] = useState('Tomorrow (Sunday)');
  const [time, setTime] = useState('5:00 PM');
  const [locationName, setLocationName] = useState('Eco Park Canine Playground');
  const [locationAddress, setLocationAddress] = useState('Major Arterial Road, Action Area II, New Town, Kolkata');
  const [notes, setNotes] = useState('Bring some tennis balls & treats! Excited for the dogs to interact.');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSuccessChime();

    scheduleMeetup({
      applicationId,
      dogId,
      dogName,
      ownerId: currentUser?.id || 'user_guest',
      adopterId,
      date,
      time,
      locationName,
      locationAddress,
      notes,
    });

    onClose();
  };

  const sampleVenues = [
    { name: 'Eco Park Canine Playground', address: 'Major Arterial Road, New Town, Kolkata' },
    { name: 'Salt Lake Central Dog Park', address: 'Sector 1, Salt Lake, Kolkata' },
    { name: 'Rabindra Sarobar Lakefront Trail', address: 'Southern Avenue, Kolkata' },
    { name: 'South City Pet Green', address: 'Prince Anwar Shah Rd, Kolkata' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-900/75 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-white rounded-4xl p-6 sm:p-8 shadow-2xl border border-obsidian-300 animate-in fade-in zoom-in-95 duration-200 text-left">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-obsidian-300 hover:bg-obsidian-400 flex items-center justify-center text-obsidian-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 font-bold text-xs mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Adoption Stage 4 • Meet & Greet</span>
          </div>
          <h3 className="text-2xl font-black font-display text-obsidian-900">
            Schedule Meet & Greet with {dogName} 🐾
          </h3>
          <p className="text-xs text-obsidian-600 mt-1">
            Choose a safe, neutral public dog park so the applicant and dog can get acquainted in a stress-free environment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-obsidian-900 mb-1">
                Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-500" />
                <input
                  type="text"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  placeholder="e.g. Sunday, 18 Aug"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-obsidian-400 text-xs outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-obsidian-900 mb-1">
                Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-500" />
                <input
                  type="text"
                  required
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  placeholder="e.g. 5:00 PM"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-obsidian-400 text-xs outline-hidden"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-obsidian-900 mb-1">
              Select Public Dog Park / Venue *
            </label>
            <div className="space-y-1.5 mb-2">
              {sampleVenues.map((v, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    playPawPop();
                    setLocationName(v.name);
                    setLocationAddress(v.address);
                  }}
                  className={`w-full text-left p-2 rounded-xl border text-xs transition-all ${
                    locationName === v.name
                      ? 'border-sky-500 bg-sky-50 text-sky-950 font-bold'
                      : 'border-obsidian-300 hover:bg-obsidian-200 text-obsidian-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-coral-500 shrink-0" />
                    <span>{v.name}</span>
                  </div>
                  <div className="text-[10px] text-obsidian-500 pl-5 font-normal">
                    {v.address}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-obsidian-900 mb-1">
              Meeting Notes & Dog Essentials
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Bring favorite toys, leash, leash-reactive info..."
              className="w-full px-3 py-2 rounded-xl border border-obsidian-400 text-xs outline-hidden"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-full border border-obsidian-400 text-xs font-bold text-obsidian-700 hover:bg-obsidian-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-soft transition-all"
            >
              Send Meeting Request 📅
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
