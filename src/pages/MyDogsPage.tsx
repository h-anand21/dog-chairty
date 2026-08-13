import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { Dog } from '../../types';
import {
  Dog as DogIcon,
  Award,
  PlusCircle,
  HeartHandshake,
  CheckCircle2,
  Calendar,
  FileText,
  Sparkles,
} from 'lucide-react';

export const MyDogsPage: React.FC = () => {
  const {
    currentUser,
    dogs,
    applications,
    setIsListDogOpen,
    setSelectedDog,
    setViewingCertificateDog,
    setActiveTab,
  } = useApp();

  const { playPawPop } = useAudio();

  const [activeSubTab, setActiveSubTab] = useState<'adopted' | 'listed' | 'applications'>('adopted');

  // Adopted Dogs (where current user is newOwnerId or currentOwnerId and status is adopted)
  const adoptedDogs = dogs.filter(d => d.status === 'adopted' && (d.newOwnerId === currentUser.id || d.currentOwnerId === currentUser.id));

  // Listed Dogs (where current user listed them)
  const listedDogs = dogs.filter(d => d.currentOwnerId === currentUser.id || d.previousOwnerId === currentUser.id);

  // User Applications
  const myApplications = applications.filter(a => a.applicantId === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-left">
      
      {/* Header Profile Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-obsidian-400/50 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-20 h-20 rounded-3xl object-cover ring-4 ring-coral-400 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black font-display text-obsidian-900">
                {currentUser.name}
              </h1>
              {currentUser.isVerified && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  ✓ Verified Guardian
                </span>
              )}
            </div>
            <p className="text-xs text-obsidian-600 mt-1">
              📍 {currentUser.location} • Member since {currentUser.joinedDate}
            </p>
            <p className="text-xs text-obsidian-700 mt-1 italic max-w-lg">
              &ldquo;{currentUser.bio}&rdquo;
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playPawPop();
            setIsListDogOpen(true);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white px-6 py-3 rounded-full font-bold text-xs shadow-soft transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ List Another Dog</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-obsidian-400/40 pb-2">
        <button
          onClick={() => setActiveSubTab('adopted')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeSubTab === 'adopted'
              ? 'bg-coral-500 text-white shadow-xs'
              : 'text-obsidian-600 hover:bg-obsidian-300/60'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Adopted Dogs ({adoptedDogs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('listed')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeSubTab === 'listed'
              ? 'bg-coral-500 text-white shadow-xs'
              : 'text-obsidian-600 hover:bg-obsidian-300/60'
          }`}
        >
          <DogIcon className="w-4 h-4" />
          <span>My Listed Dogs ({listedDogs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('applications')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
            activeSubTab === 'applications'
              ? 'bg-coral-500 text-white shadow-xs'
              : 'text-obsidian-600 hover:bg-obsidian-300/60'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>My Applications ({myApplications.length})</span>
        </button>
      </div>

      {/* SUBTAB 1: ADOPTED DOGS */}
      {activeSubTab === 'adopted' && (
        <div className="space-y-6">
          {adoptedDogs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-obsidian-300 shadow-soft max-w-md mx-auto space-y-4">
              <div className="text-4xl">🐕🏡</div>
              <h3 className="text-lg font-bold text-obsidian-900">No Adopted Dogs Yet</h3>
              <p className="text-xs text-obsidian-600">
                When you complete an adoption and dual handover, your dog and official Adoption Certificate will appear here!
              </p>
              <button
                onClick={() => setActiveTab('adopt_flow')}
                className="px-6 py-2.5 rounded-full bg-coral-500 text-white font-bold text-xs"
              >
                Track Active Adoption
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adoptedDogs.map(dog => (
                <div
                  key={dog.id}
                  className="bg-white rounded-3xl overflow-hidden border border-amber-300 shadow-soft flex flex-col justify-between"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={dog.coverPhoto}
                      alt={dog.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-black shadow-md flex items-center gap-1">
                        <Award className="w-3.5 h-3.5" />
                        <span>Adopted</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-black font-display text-obsidian-900">
                        {dog.name} 🐾
                      </h3>
                      <p className="text-xs text-obsidian-600 mt-0.5">
                        {dog.breed} • {dog.age} • Adopted on {dog.adoptedDate || '18 Aug 2026'}
                      </p>
                      
                      <div className="mt-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                        <div className="flex items-center justify-between font-bold">
                          <span>Certificate #{dog.certificateId || 'CERT-PAW-78192'}</span>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                        <p className="text-[11px] text-amber-800 mt-1">
                          Previous Guardian: {dog.previousOwnerName || 'Alex Rivera'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        playPawPop();
                        setViewingCertificateDog(dog);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-soft transition-all"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View Official Certificate</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: LISTED DOGS */}
      {activeSubTab === 'listed' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listedDogs.map(dog => (
            <div
              key={dog.id}
              className="bg-white rounded-3xl overflow-hidden border border-obsidian-400/50 shadow-soft p-5 space-y-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={dog.coverPhoto}
                  alt={dog.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-coral-400 shrink-0"
                />
                <div>
                  <h3 className="text-lg font-black text-obsidian-900">{dog.name}</h3>
                  <p className="text-xs text-obsidian-600">{dog.breed} • {dog.age}</p>
                  <div className="mt-1">
                    <StatusBadge status={dog.status} size="sm" />
                  </div>
                </div>
              </div>

              <div className="text-xs text-obsidian-700 bg-obsidian-300/40 p-3 rounded-2xl">
                <div className="flex justify-between font-semibold">
                  <span>Interested Inquiries:</span>
                  <span className="font-bold text-coral-600">{dog.interestedCount} applicants</span>
                </div>
                <div className="flex justify-between font-semibold mt-1">
                  <span>Community Likes:</span>
                  <span>{dog.likesCount} ❤️</span>
                </div>
              </div>

              <button
                onClick={() => {
                  playPawPop();
                  setActiveTab('adopt_flow');
                }}
                className="w-full py-2 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs shadow-xs"
              >
                Manage Inquiries & Applications ➔
              </button>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 3: MY APPLICATIONS */}
      {activeSubTab === 'applications' && (
        <div className="space-y-4">
          {myApplications.map(app => (
            <div
              key={app.id}
              className="bg-white rounded-3xl p-5 border border-obsidian-400/50 shadow-soft flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={app.dogPhoto}
                  alt={app.dogName}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-coral-300"
                />
                <div>
                  <h4 className="text-base font-black text-obsidian-900">{app.dogName}</h4>
                  <p className="text-xs text-obsidian-600">{app.dogBreed} • Status: {app.status}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  playPawPop();
                  setActiveTab('adopt_flow');
                }}
                className="px-4 py-2 rounded-full bg-coral-50 text-coral-700 hover:bg-coral-100 font-bold text-xs border border-coral-200"
              >
                View Pipeline ➔
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
