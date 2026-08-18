import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAudio } from '../context/AudioContext';
import { Dog, AdoptionApplication } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  Dog as DogIcon,
  Award,
  Plus,
  FileText,
  Clock,
  Heart,
  Sparkles,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  Phone,
  LogIn,
} from 'lucide-react';

export const MyDogsPage: React.FC = () => {
  const {
    currentUser,
    dogs,
    applications,
    setIsListDogOpen,
    setViewingCertificateDog,
    setActiveTab,
    setIsAuthModalOpen,
  } = useApp();

  const { playPawPop } = useAudio();
  const [activeSubTab, setActiveSubTab] = useState<'adopted' | 'listed' | 'applications'>('adopted');

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="glass-card rounded-5xl p-8 sm:p-12 border border-white shadow-elevated space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-coral-50 flex items-center justify-center text-3xl mx-auto shadow-glow-coral">
            🐾
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-obsidian-950">
            Log In to View Your Dogs & Certificates
          </h2>
          <p className="text-xs sm:text-sm text-obsidian-600 max-w-md mx-auto leading-relaxed">
            Enter your mobile number to access your listed dogs, active adoption applications, and official gold certificates.
          </p>
          <button
            onClick={() => {
              playPawPop();
              setIsAuthModalOpen(true);
            }}
            className="btn-primary text-white px-8 py-3.5 rounded-full font-black text-xs shadow-glow-coral inline-flex items-center gap-2 cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Log In with Mobile Number / OTP</span>
          </button>
        </div>
      </div>
    );
  }

  // Adopted Dogs
  const adoptedDogs = dogs.filter((d: Dog) => d.status === 'adopted' && (d.newOwnerId === currentUser.id || d.currentOwnerId === currentUser.id));

  // Listed Dogs
  const listedDogs = dogs.filter((d: Dog) => d.currentOwnerId === currentUser.id || d.previousOwnerId === currentUser.id);

  // User Applications
  const myApplications = applications.filter((a: AdoptionApplication) => a.applicantId === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-left">
      
      {/* Header Profile Section */}
      <div className="glass-card rounded-4xl p-6 sm:p-8 border border-white dark:border-white/10 shadow-elevated flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-20 h-20 rounded-3xl object-cover ring-4 ring-coral-400 dark:ring-coral-500/40 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black font-display text-obsidian-950 dark:text-white">
                {currentUser.name}
              </h1>
              {currentUser.isVerified && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800/60">
                  ✓ Verified Guardian
                </span>
              )}
            </div>
            <p className="text-xs text-obsidian-600 dark:text-slate-300 mt-1">
              📍 {currentUser.location} • 📱 {currentUser.phone} • Member since {currentUser.joinedDate}
            </p>
            <p className="text-xs text-obsidian-700 dark:text-slate-300 mt-1 italic max-w-lg">
              &ldquo;{currentUser.bio}&rdquo;
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playPawPop();
            setIsListDogOpen(true);
          }}
          className="btn-primary text-white px-6 py-3 rounded-full font-black text-xs shadow-glow-coral flex items-center gap-2 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Dog for Adoption</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-obsidian-200 dark:border-white/10 pb-3">
        <button
          onClick={() => {
            playPawPop();
            setActiveSubTab('adopted');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            activeSubTab === 'adopted'
              ? 'bg-coral-500 text-white shadow-glow-coral'
              : 'bg-obsidian-100 dark:bg-white/10 text-obsidian-700 dark:text-slate-300 hover:bg-obsidian-200 dark:hover:bg-white/20'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>My Adopted Companions ({adoptedDogs.length})</span>
        </button>

        <button
          onClick={() => {
            playPawPop();
            setActiveSubTab('listed');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            activeSubTab === 'listed'
              ? 'bg-coral-500 text-white shadow-glow-coral'
              : 'bg-obsidian-100 dark:bg-white/10 text-obsidian-700 dark:text-slate-300 hover:bg-obsidian-200 dark:hover:bg-white/20'
          }`}
        >
          <DogIcon className="w-4 h-4" />
          <span>Dogs I Have Listed ({listedDogs.length})</span>
        </button>

        <button
          onClick={() => {
            playPawPop();
            setActiveSubTab('applications');
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            activeSubTab === 'applications'
              ? 'bg-coral-500 text-white shadow-glow-coral'
              : 'bg-obsidian-100 dark:bg-white/10 text-obsidian-700 dark:text-slate-300 hover:bg-obsidian-200 dark:hover:bg-white/20'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Applications ({myApplications.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: ADOPTED DOGS */}
      {activeSubTab === 'adopted' && (
        <div className="space-y-4">
          {adoptedDogs.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center border border-white dark:border-white/10 space-y-3 shadow-card">
              <div className="text-4xl">🐕🏠</div>
              <h3 className="text-lg font-bold text-obsidian-950 dark:text-white">No Adopted Dogs Yet</h3>
              <p className="text-xs text-obsidian-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed font-normal">
                Once you complete an adoption through dual handover, your new companion and official Gold Certificate will appear here!
              </p>
              <button
                onClick={() => setActiveTab('discover')}
                className="mt-2 text-xs font-bold text-coral-600 dark:text-coral-400 hover:underline cursor-pointer"
              >
                Browse Dogs Available for Adoption ➔
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adoptedDogs.map((dog: Dog) => (
                <div
                  key={dog.id}
                  className="glass-card rounded-3xl p-5 border border-white dark:border-white/10 shadow-card flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={dog.coverPhoto}
                      alt={dog.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-400"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-obsidian-950 dark:text-white">{dog.name}</h4>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800/60">
                          Adopted
                        </span>
                      </div>
                      <p className="text-xs text-obsidian-500 dark:text-slate-400 font-medium">
                        {dog.breed} • {dog.age}
                      </p>
                      <p className="text-[11px] text-obsidian-600 dark:text-slate-300 mt-1">
                        Transferred to <strong className="text-obsidian-900 dark:text-white">{dog.newOwnerName}</strong>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playPawPop();
                      setViewingCertificateDog(dog);
                    }}
                    className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>View Certificate</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: LISTED DOGS */}
      {activeSubTab === 'listed' && (
        <div className="space-y-4">
          {listedDogs.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center border border-white dark:border-white/10 space-y-3 shadow-card">
              <div className="text-4xl">🐾📝</div>
              <h3 className="text-lg font-bold text-obsidian-950 dark:text-white">No Dogs Listed Yet</h3>
              <p className="text-xs text-obsidian-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed font-normal">
                Need to rehome a dog? List them with health records and review verified adoption requests.
              </p>
              <button
                onClick={() => setIsListDogOpen(true)}
                className="mt-2 text-xs font-bold text-coral-600 dark:text-coral-400 hover:underline cursor-pointer"
              >
                + Post a Dog for Adoption ➔
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listedDogs.map((dog: Dog) => (
                <div
                  key={dog.id}
                  className="glass-card rounded-3xl p-5 border border-white dark:border-white/10 shadow-card space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={dog.coverPhoto}
                      alt={dog.name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-coral-400"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-obsidian-950 dark:text-white">{dog.name}</h4>
                        <StatusBadge status={dog.status} size="sm" />
                      </div>
                      <p className="text-xs text-obsidian-500 dark:text-slate-400 font-medium">
                        {dog.breed} • {dog.age}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-obsidian-200 dark:border-white/10 flex items-center justify-between text-xs text-obsidian-600 dark:text-slate-300">
                    <span>❤️ {dog.likesCount} Likes</span>
                    <span>🐾 {dog.interestedCount} Inquiries</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: MY APPLICATIONS */}
      {activeSubTab === 'applications' && (
        <div className="space-y-4">
          {myApplications.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center border border-white dark:border-white/10 space-y-3 shadow-card">
              <div className="text-4xl">📄🐕</div>
              <h3 className="text-lg font-bold text-obsidian-950 dark:text-white">No Submitted Applications</h3>
              <p className="text-xs text-obsidian-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed font-normal">
                Explore pups looking for a forever family and submit your questionnaire.
              </p>
              <button
                onClick={() => setActiveTab('discover')}
                className="mt-2 text-xs font-bold text-coral-600 dark:text-coral-400 hover:underline cursor-pointer"
              >
                Find Dogs to Adopt ➔
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myApplications.map((app: AdoptionApplication) => (
                <div
                  key={app.id}
                  className="glass-card rounded-3xl p-5 border border-white dark:border-white/10 shadow-card flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={app.dogPhoto}
                      alt={app.dogName}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-coral-400"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-obsidian-950 dark:text-white">{app.dogName}</h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-coral-50 dark:bg-coral-950/60 text-coral-600 dark:text-coral-400 text-xs font-bold capitalize border border-coral-200 dark:border-coral-800/60">
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-obsidian-500 dark:text-slate-400 font-medium">
                        Submitted: {app.submittedAt}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('adopt_flow')}
                    className="flex items-center gap-1 text-xs font-bold text-coral-600 dark:text-coral-400 hover:text-coral-700 cursor-pointer"
                  >
                    <span>View in Pipeline</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
