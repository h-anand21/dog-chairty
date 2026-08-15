import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { LocationPicker } from '../map/LocationPicker';
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
  const [lat, setLat] = useState(22.6033);
  const [lng, setLng] = useState(88.4658);
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
      lat,
      lng,
      notes,
    });

    onClose();
  };

  const sampleVenues = [
    { name: 'Eco Park Canine Playground', address: 'Major Arterial Road, New Town, Kolkata', lat: 22.6033, lng: 88.4658 },
    { name: 'Salt Lake Central Park', address: 'Sector 1, Salt Lake, Kolkata', lat: 22.5878, lng: 88.4140 },
    { name: 'Siri Fort Pet Walking Trail', address: 'August Kranti Marg, New Delhi', lat: 28.5526, lng: 77.2217 },
    { name: 'Cubbon Park Dog Section', address: 'Kasturba Road, Bengaluru', lat: 12.9779, lng: 77.5952 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-obsidian-950/80 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-5xl p-6 sm:p-8 shadow-2xl border border-obsidian-200 animate-in fade-in zoom-in-95 duration-200 text-left my-6">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-obsidian-100 hover:bg-obsidian-200 flex items-center justify-center text-obsidian-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 font-bold text-xs mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Adoption Stage 4 • Meet & Greet</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black font-display text-obsidian-950">
            Schedule Meet & Greet with {dogName} 🐾
          </h3>
          <p className="text-xs text-obsidian-600 mt-1">
            Choose a safe, neutral public dog park in India so the applicant and dog can get acquainted in a stress-free environment.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-obsidian-900 mb-1">
                Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400" />
                <input
                  type="text"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  placeholder="e.g. Sunday, 18 Aug"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-obsidian-300 text-xs font-bold outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-obsidian-900 mb-1">
                Time *
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400" />
                <input
                  type="text"
                  required
                  value={time}
                  onChange={e => setTime(e.target.value)}
                  placeholder="e.g. 5:00 PM"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-obsidian-300 text-xs font-bold outline-hidden"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-obsidian-900 mb-1.5">
              Quick Popular Park Suggestions:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              {sampleVenues.map((v, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    playPawPop();
                    setLocationName(v.name);
                    setLocationAddress(v.address);
                    setLat(v.lat);
                    setLng(v.lng);
                  }}
                  className={`text-left p-2.5 rounded-2xl border text-xs transition-all cursor-pointer ${
                    locationName === v.name
                      ? 'border-sky-500 bg-sky-50 text-sky-950 font-black shadow-xs'
                      : 'border-obsidian-200 text-obsidian-700 hover:bg-obsidian-50'
                  }`}
                >
                  <div className="font-extrabold truncate">{v.name}</div>
                  <div className="text-[10px] text-obsidian-500 truncate mt-0.5">{v.address}</div>
                </button>
              ))}
            </div>

            {/* Real Location Search & Map Pinpoint */}
            <LocationPicker
              value={locationAddress}
              initialLat={lat}
              initialLng={lng}
              onChange={loc => {
                setLocationAddress(loc.displayName);
                setLocationName(loc.city + ' Meetup Spot');
                setLat(loc.lat);
                setLng(loc.lng);
              }}
              label="Or Search Custom Park / Address on Map *"
              placeholder="Type park name, street, or landmark across India..."
            />
          </div>

          <div>
            <label className="block text-xs font-black text-obsidian-900 mb-1">
              Instructions & Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="What to bring, meeting spot landmark (e.g. near fountain)..."
              className="w-full p-2.5 rounded-xl border border-obsidian-300 text-xs outline-hidden font-medium"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-xs font-bold text-obsidian-600 hover:bg-obsidian-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-primary text-white px-6 py-2.5 rounded-full text-xs font-black shadow-glow-coral cursor-pointer"
            >
              Confirm & Send Invite 🐾
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
