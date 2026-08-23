import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { LocationPicker } from '../map/LocationPicker';
import { X, ArrowRight, ArrowLeft, CheckCircle2, Sparkles } from 'lucide-react';

const POPULAR_DOG_BREEDS = [
  'Golden Retriever',
  'Labrador Retriever',
  'German Shepherd',
  'Beagle',
  'Pug',
  'Shih Tzu',
  'French Bulldog',
  'Siberian Husky',
  'Samoyed',
  'Rottweiler',
  'Doberman Pinscher',
  'Boxer',
  'Dachshund',
  'Poodle (Standard / Toy)',
  'Great Dane',
  'Cocker Spaniel',
  'Pomeranian',
  'Lhasa Apso',
  'Border Collie',
  'Chihuahua',
  'Bulldog (English)',
  'Australian Shepherd',
  'Saint Bernard',
  'Indie / Indian Pariah Dog',
  'Mudhol Hound',
  'Rajapalayam',
  'Gaddi Kutta',
  'Bakharwal Dog',
  'Kombai',
  'Kanni',
  'Chippiparai',
  'Indian Spitz',
  'Mixed Breed / Crossbreed',
  'Other Rescue Companion',
];

export const ListDogModal: React.FC = () => {
  const { isListDogOpen, setIsListDogOpen, addDog, setSelectedDog, setActiveTab } = useApp();
  const { playSuccessChime, playPawPop } = useAudio();

  const [step, setStep] = useState(1);

  // Form State
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [showBreedDropdown, setShowBreedDropdown] = useState(false);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [size, setSize] = useState<'Small' | 'Medium' | 'Large' | 'Extra Large'>('Large');
  const [energy, setEnergy] = useState<'Low (Couch Potato)' | 'Moderate' | 'High Energy' | 'Zoomies Master'>('Moderate');
  const [location, setLocation] = useState('Kolkata, Salt Lake');
  const [lat, setLat] = useState(22.5867);
  const [lng, setLng] = useState(88.4178);
  const [city, setCity] = useState('Kolkata');
  const [bio, setBio] = useState('');
  
  // Health & Care
  const [vaccinated, setVaccinated] = useState(true);
  const [neutered, setNeutered] = useState(true);
  const [microchipped, setMicrochipped] = useState(true);
  const [medicalNotes, setMedicalNotes] = useState('');
  const [favoriteInput, setFavoriteInput] = useState('');
  const [personalityInput, setPersonalityInput] = useState('');

  // Adoption Details
  const [reasonForAdoption, setReasonForAdoption] = useState('');
  const [adoptionType, setAdoptionType] = useState<'Free Adoption' | 'Adoption Fee'>('Free Adoption');

  // Photos
  const [coverPhoto, setCoverPhoto] = useState('https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80');
  const [additionalPhoto, setAdditionalPhoto] = useState('https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80');

  if (!isListDogOpen) return null;

  const handleNext = () => {
    playPawPop();
    setStep(prev => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    playPawPop();
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleClose = () => {
    setIsListDogOpen(false);
    setStep(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSuccessChime();

    const favList = favoriteInput.split(',').map(s => s.trim()).filter(Boolean);
    const traitList = personalityInput.split(',').map(s => s.trim()).filter(Boolean);

    const created = addDog({
      name: name || 'Buddy',
      breed: breed || 'Mixed Breed',
      age: age.trim() || '2 Years',
      gender,
      size,
      energy,
      location,
      lat,
      lng,
      city,
      coverPhoto: coverPhoto || 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800',
      photos: [coverPhoto, additionalPhoto].filter(Boolean),
      bio: bio || 'Loves belly rubs, outdoor walks, and is very friendly with everyone!',
      reasonForAdoption: reasonForAdoption.trim() || 'Seeking a loving, active forever home with attentive pet parents.',
      adoptionType,
      currentOwnerId: '',
      currentOwnerName: '',
      currentOwnerAvatar: '',
      isOwnerVerified: true,
      vaccinated,
      neutered,
      microchipped,
      medicalNotes: medicalNotes.trim() || 'Fully up to date on all vaccinations, clean health checkup.',
      favoriteThings: favList.length ? favList : ['🎾 Tennis Balls', '🍗 Chicken', '🛋️ Cuddles'],
      personalityTraits: traitList.length ? traitList : ['Playful', 'Gentle', 'House-Trained'],
    });

    handleClose();
    setSelectedDog(created);
    setActiveTab('discover');
  };

  const samplePhotoOptions = [
    { label: 'Golden Retriever', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80' },
    { label: 'Beagle', url: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=800&auto=format&fit=crop&q=80' },
    { label: 'Labrador', url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=800&auto=format&fit=crop&q=80' },
    { label: 'German Shepherd', url: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=800&auto=format&fit=crop&q=80' },
    { label: 'Frenchie', url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&auto=format&fit=crop&q=80' },
    { label: 'Husky / Samoyed', url: 'https://images.unsplash.com/photo-1529429617124-95b109e86bb8?w=800&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-900/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0E1524] rounded-4xl p-6 sm:p-8 shadow-2xl border border-obsidian-200 dark:border-white/10 my-8 animate-in fade-in zoom-in-95 duration-200 text-left">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-obsidian-300 hover:bg-obsidian-400 flex items-center justify-center text-obsidian-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Wizard Header */}
        <div className="text-left mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 text-coral-600 font-bold text-xs mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Owner Listing Wizard • Step {step} of 4</span>
          </div>
          <h2 className="text-2xl font-black font-display text-obsidian-900">
            {step === 1 && 'Basic Dog Information'}
            {step === 2 && 'Health, Vet Care & Personality'}
            {step === 3 && 'Adoption Details & Requirements'}
            {step === 4 && 'Photos & Review Listing'}
          </h2>
          <p className="text-xs text-obsidian-600 mt-1">
            Dogs listed on PawConnect are verified to ensure transparent communication & safe handovers.
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-obsidian-300 h-1.5 rounded-full mt-4 overflow-hidden">
            <div
              className="bg-coral-500 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Steps */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-obsidian-800 mb-1">
                    Dog&apos;s Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Bruno, Max, Daisy"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-obsidian-400/80 focus:border-coral-500 focus:ring-2 focus:ring-coral-200 text-sm outline-hidden"
                  />
                </div>

                <div className="relative">
                  <label className="block text-xs font-bold text-obsidian-800 dark:text-slate-200 mb-1">
                    Breed * <span className="text-[10px] text-coral-500 font-medium">(Type for suggestions)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={breed}
                    onFocus={() => setShowBreedDropdown(true)}
                    onBlur={() => setTimeout(() => setShowBreedDropdown(false), 200)}
                    onChange={e => {
                      setBreed(e.target.value);
                      setShowBreedDropdown(true);
                    }}
                    placeholder="e.g. Golden, Beagle, Indie..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-obsidian-400/80 dark:border-white/15 focus:border-coral-500 focus:ring-2 focus:ring-coral-200 text-sm outline-hidden dark:bg-[#121A2B] dark:text-white"
                  />

                  {/* 🐶 Interactive Breed Autocomplete Dropdown */}
                  {showBreedDropdown && breed.trim().length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-50 max-h-48 overflow-y-auto bg-white dark:bg-[#121A2B] border border-coral-300 dark:border-coral-500/40 rounded-2xl shadow-elevated divide-y divide-obsidian-100 dark:divide-white/10 animate-in fade-in zoom-in-95 duration-150">
                      {POPULAR_DOG_BREEDS.filter(b => b.toLowerCase().includes(breed.toLowerCase().trim())).map((b, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setBreed(b);
                            setShowBreedDropdown(false);
                            playPawPop();
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs font-bold text-obsidian-900 dark:text-white hover:bg-coral-50 dark:hover:bg-coral-950/60 hover:text-coral-600 dark:hover:text-coral-400 transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <span>🐕 {b}</span>
                          <span className="text-[10px] text-coral-500 font-semibold uppercase">Select ➔</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-obsidian-800 mb-1">Age</label>
                  <input
                    type="text"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    placeholder="e.g. 2 Years / 6 Months"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-obsidian-400/80 focus:border-coral-500 text-sm outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-obsidian-800 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as 'Male' | 'Female')}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-obsidian-400/80 focus:border-coral-500 text-sm outline-hidden bg-white"
                  >
                    <option value="Male">Male ♂</option>
                    <option value="Female">Female ♀</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-obsidian-800 mb-1">Size</label>
                  <select
                    value={size}
                    onChange={e => setSize(e.target.value as typeof size)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-obsidian-400/80 focus:border-coral-500 text-sm outline-hidden bg-white"
                  >
                    <option value="Small">Small (under 10kg)</option>
                    <option value="Medium">Medium (10-25kg)</option>
                    <option value="Large">Large (25-40kg)</option>
                    <option value="Extra Large">Extra Large (40kg+)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-obsidian-800 mb-1">
                    Energy Level
                  </label>
                  <select
                    value={energy}
                    onChange={e => setEnergy(e.target.value as typeof energy)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-obsidian-400/80 focus:border-coral-500 text-sm outline-hidden bg-white"
                  >
                    <option value="Low (Couch Potato)">Low (Couch Potato 🛋️)</option>
                    <option value="Moderate">Moderate (Regular Walks 🌳)</option>
                    <option value="High Energy">High Energy (Play & Run 🏃)</option>
                    <option value="Zoomies Master">Zoomies Master ⚡</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <LocationPicker
                    value={location}
                    initialLat={lat}
                    initialLng={lng}
                    onChange={loc => {
                      setLocation(loc.displayName);
                      setLat(loc.lat);
                      setLng(loc.lng);
                      setCity(loc.city);
                    }}
                    label="Current City & Area in India *"
                    placeholder="Search your area, landmark, or pincode..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-obsidian-800 mb-1">
                  About Dog (Bio & Habits)
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Describe your dog's temperament, favorite games, leash manners, and routine..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-obsidian-400/80 focus:border-coral-500 text-sm outline-hidden"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Health & Personality */}
          {step === 2 && (
            <div className="space-y-4 text-left">
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <p className="text-xs font-bold text-emerald-900 mb-3">
                  Veterinary & Medical Badges
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-obsidian-800">
                    <input
                      type="checkbox"
                      checked={vaccinated}
                      onChange={e => setVaccinated(e.target.checked)}
                      className="w-4 h-4 text-coral-500 rounded-sm focus:ring-coral-400"
                    />
                    <span>Vaccinated ✓</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-obsidian-800">
                    <input
                      type="checkbox"
                      checked={neutered}
                      onChange={e => setNeutered(e.target.checked)}
                      className="w-4 h-4 text-coral-500 rounded-sm focus:ring-coral-400"
                    />
                    <span>Spayed / Neutered ✓</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-obsidian-800">
                    <input
                      type="checkbox"
                      checked={microchipped}
                      onChange={e => setMicrochipped(e.target.checked)}
                      className="w-4 h-4 text-coral-500 rounded-sm focus:ring-coral-400"
                    />
                    <span>Microchipped ✓</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-obsidian-800 mb-1">
                  Medical Notes & Health History
                </label>
                <input
                  type="text"
                  value={medicalNotes}
                  onChange={e => setMedicalNotes(e.target.value)}
                  placeholder="e.g. Up to date on rabies & DHPP. Regular vet visits."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-obsidian-400/80 focus:border-coral-500 text-sm outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-obsidian-800 mb-1">
                  Favorite Things (Comma-separated)
                </label>
                <input
                  type="text"
                  value={favoriteInput}
                  onChange={e => setFavoriteInput(e.target.value)}
                  placeholder="e.g. 🎾 Tennis Balls, 🍗 Chicken, 🛋️ Sofa Naps"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-obsidian-400/80 focus:border-coral-500 text-sm outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-obsidian-800 mb-1">
                  Personality Traits (Comma-separated)
                </label>
                <input
                  type="text"
                  value={personalityInput}
                  onChange={e => setPersonalityInput(e.target.value)}
                  placeholder="e.g. Playful, Good with Kids, House-Trained"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-obsidian-400/80 focus:border-coral-500 text-sm outline-hidden"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Adoption Details */}
          {step === 3 && (
            <div className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-obsidian-800 mb-1">
                  Reason for Adoption / Rehoming *
                </label>
                <textarea
                  rows={3}
                  required
                  value={reasonForAdoption}
                  onChange={e => setReasonForAdoption(e.target.value)}
                  placeholder="Explain why you are seeking a new family for your dog (relocation, allergy, foster handover...)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-obsidian-400/80 focus:border-coral-500 text-sm outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-obsidian-800 mb-1">
                  Adoption Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAdoptionType('Free Adoption')}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                      adoptionType === 'Free Adoption'
                        ? 'border-coral-500 bg-coral-50 text-coral-700'
                        : 'border-obsidian-400/80 hover:bg-obsidian-300/40 text-obsidian-700'
                    }`}
                  >
                    <div>🎁 Free Adoption</div>
                    <p className="font-normal text-[11px] text-obsidian-600 mt-1">
                      No fee charged to adopter.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAdoptionType('Adoption Fee')}
                    className={`p-3 rounded-2xl border text-left text-xs font-bold transition-all ${
                      adoptionType === 'Adoption Fee'
                        ? 'border-coral-500 bg-coral-50 text-coral-700'
                        : 'border-obsidian-400/80 hover:bg-obsidian-300/40 text-obsidian-700'
                    }`}
                  >
                    <div>🏷️ Rehoming Support Fee</div>
                    <p className="font-normal text-[11px] text-obsidian-600 mt-1">
                      Nominal medical / vaccination fee.
                    </p>
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-sky-900 leading-relaxed">
                ℹ️ <strong>Safety Guarantee:</strong> Once an applicant applies, you will review their full living profile, work schedule, and pet experience before accepting. Chat unlocks only upon your approval.
              </div>
            </div>
          )}

          {/* STEP 4: Photos & Review */}
          {step === 4 && (
            <div className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-obsidian-800 mb-1">
                  Select Cover Photo Preset (or paste image URL)
                </label>
                
                {/* Presets */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-3">
                  {samplePhotoOptions.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCoverPhoto(opt.url)}
                      className={`relative rounded-xl overflow-hidden aspect-square border-2 transition-all ${
                        coverPhoto === opt.url
                          ? 'border-coral-500 scale-95 shadow-md'
                          : 'border-transparent hover:opacity-80'
                      }`}
                    >
                      <img src={opt.url} alt={opt.label} className="w-full h-full object-cover" />
                      {coverPhoto === opt.url && (
                        <div className="absolute inset-0 bg-coral-500/30 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-white drop-shadow-md" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                <input
                  type="url"
                  value={coverPhoto}
                  onChange={e => setCoverPhoto(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 rounded-xl border border-obsidian-400/80 text-xs outline-hidden"
                />
              </div>

              {/* Photo Preview Card */}
              <div className="p-3 bg-obsidian-300/60 rounded-2xl flex items-center gap-4">
                <img
                  src={coverPhoto}
                  alt="Preview"
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-coral-400"
                />
                <div>
                  <div className="text-sm font-black text-obsidian-900">
                    {name || 'Your Pup'} • {breed || 'Breed'}
                  </div>
                  <div className="text-xs text-obsidian-600">
                    {age} • {gender} • 📍 {location}
                  </div>
                  <span className="inline-block mt-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Will be LIVE on Marketplace instantly
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Wizard Footer Navigation */}
          <div className="pt-4 border-t border-obsidian-400/40 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-obsidian-400 text-xs font-bold text-obsidian-700 hover:bg-obsidian-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-coral-500 hover:bg-coral-600 text-white text-xs font-bold shadow-soft transition-all"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white text-xs font-black shadow-soft hover:shadow-soft-hover transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Publish Dog for Adoption 🐾</span>
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
