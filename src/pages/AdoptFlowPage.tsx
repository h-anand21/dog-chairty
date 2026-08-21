import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAudio } from '../context/AudioContext';
import { AdoptionJourneyTracker } from '../components/adoption/AdoptionJourneyTracker';
import { AdoptionApplication } from '../types';
import { HeartHandshake, Dog as DogIcon } from 'lucide-react';

export const AdoptFlowPage: React.FC = () => {
  const { applications, currentUser, setActiveTab } = useApp();
  const { playPawPop } = useAudio();

  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [selectedDogId, setSelectedDogId] = useState<string>('all');

  const filteredApplications = applications.filter((app: AdoptionApplication) => {
    if (selectedDogId !== 'all' && app.dogId !== selectedDogId) return false;

    if (activeFilter === 'active') {
      return app.status !== 'completed';
    }
    if (activeFilter === 'completed') {
      return app.status === 'completed';
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 dark:bg-coral-950/60 text-coral-600 dark:text-coral-400 border border-coral-200 dark:border-coral-800/60 font-bold text-xs mb-1.5">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Real-Time Adoption Handover Pipeline</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-obsidian-950 dark:text-white">
            Adoption Journey Tracker
          </h1>
          <p className="text-xs sm:text-sm text-obsidian-600 dark:text-slate-300 mt-1">
            Select any pup below to track their live journey from application review to final certificate handover.
          </p>
        </div>

        <button
          onClick={() => {
            playPawPop();
            setActiveTab('discover');
          }}
          className="flex items-center gap-2 bg-obsidian-900 dark:bg-white/10 hover:bg-obsidian-800 dark:hover:bg-white/20 text-white border border-transparent dark:border-white/15 px-5 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer shadow-sm"
        >
          <DogIcon className="w-4 h-4 text-coral-400" />
          <span>Browse More Dogs</span>
        </button>
      </div>

      {/* Filter Tabs & Dog Select Chips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-obsidian-200 dark:border-white/10 pb-3">
        
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => {
              playPawPop();
              setActiveFilter('all');
            }}
            className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-coral-500 text-white shadow-xs'
                : 'text-obsidian-600 dark:text-slate-300 hover:bg-obsidian-200 dark:hover:bg-white/10'
            }`}
          >
            All Journeys ({applications.length})
          </button>

          <button
            onClick={() => {
              playPawPop();
              setActiveFilter('active');
            }}
            className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
              activeFilter === 'active'
                ? 'bg-coral-500 text-white shadow-xs'
                : 'text-obsidian-600 dark:text-slate-300 hover:bg-obsidian-200 dark:hover:bg-white/10'
            }`}
          >
            Active Pipelines ({applications.filter(a => a.status !== 'completed').length})
          </button>

          <button
            onClick={() => {
              playPawPop();
              setActiveFilter('completed');
            }}
            className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer ${
              activeFilter === 'completed'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-obsidian-600 dark:text-slate-300 hover:bg-obsidian-200 dark:hover:bg-white/10'
            }`}
          >
            Completed Adoptions 🎉 ({applications.filter(a => a.status === 'completed').length})
          </button>
        </div>

        {/* Dog Chips Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] font-black uppercase text-obsidian-400 dark:text-slate-400 mr-1 shrink-0">
            Pup Filter:
          </span>
          <button
            onClick={() => setSelectedDogId('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedDogId === 'all'
                ? 'bg-obsidian-900 dark:bg-white text-white dark:text-obsidian-950'
                : 'bg-obsidian-100 dark:bg-white/10 text-obsidian-700 dark:text-slate-300'
            }`}
          >
            All Pups
          </button>

          {applications.map((app) => (
            <button
              key={app.id}
              onClick={() => {
                playPawPop();
                setSelectedDogId(app.dogId);
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                selectedDogId === app.dogId
                  ? 'bg-coral-500 text-white ring-2 ring-coral-300'
                  : 'bg-obsidian-100 dark:bg-white/10 text-obsidian-800 dark:text-slate-200 hover:bg-obsidian-200 dark:hover:bg-white/20'
              }`}
            >
              <img src={app.dogPhoto} alt={app.dogName} className="w-4 h-4 rounded-full object-cover" />
              <span>{app.dogName}</span>
            </button>
          ))}
        </div>

      </div>

      {/* Applications List */}
      <div className="space-y-6">
        {filteredApplications.length === 0 ? (
          <div className="glass-card rounded-4xl p-12 sm:p-16 text-center border border-white dark:border-white/10 shadow-elevated max-w-lg mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-coral-50 dark:bg-coral-950/60 text-coral-500 mx-auto flex items-center justify-center text-3xl shadow-glow-coral">
              🐾📋
            </div>
            <h3 className="text-xl font-black font-display text-obsidian-950 dark:text-white">
              No Active Adoption Journeys
            </h3>
            <p className="text-xs sm:text-sm text-obsidian-600 dark:text-slate-300 leading-relaxed font-medium">
              No demo journey pipelines are active. When a real user submits an adoption request for a listed dog, their 6-Stage Handover Tracker will appear here in real time!
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  playPawPop();
                  setActiveTab('discover');
                }}
                className="btn-primary px-6 py-3 rounded-full text-white font-black text-xs shadow-glow-coral cursor-pointer"
              >
                Browse & List Real Dogs ➔
              </button>
            </div>
          </div>
        ) : (
          filteredApplications.map((app: AdoptionApplication) => (
            <AdoptionJourneyTracker key={app.id} application={app} />
          ))
        )}
      </div>

    </div>
  );
};
