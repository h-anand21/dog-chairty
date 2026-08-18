import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAudio } from '../context/AudioContext';
import { AdoptionJourneyTracker } from '../components/adoption/AdoptionJourneyTracker';
import { AdoptionApplication } from '../types';
import { HeartHandshake, Dog as DogIcon } from 'lucide-react';

export const AdoptFlowPage: React.FC = () => {
  const { applications, currentUser, setActiveTab } = useApp();
  const { playPawPop } = useAudio();

  const [activeFilter, setActiveFilter] = useState<'all' | 'my_requests' | 'incoming_requests'>('all');

  const userApplications = applications.filter((app: AdoptionApplication) => {
    if (activeFilter === 'my_requests') {
      return currentUser ? app.applicantId === currentUser.id : false;
    }
    if (activeFilter === 'incoming_requests') {
      return currentUser ? (currentUser.role === 'owner' || app.applicantId !== currentUser.id) : true;
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
            Track applications from questionnaire review to physical dual-confirmation transfer.
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-obsidian-200 dark:border-white/10 pb-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'all'
              ? 'bg-coral-500 text-white shadow-xs'
              : 'text-obsidian-600 dark:text-slate-300 hover:bg-obsidian-200 dark:hover:bg-white/10'
          }`}
        >
          All Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveFilter('my_requests')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'my_requests'
              ? 'bg-coral-500 text-white shadow-xs'
              : 'text-obsidian-600 dark:text-slate-300 hover:bg-obsidian-200 dark:hover:bg-white/10'
          }`}
        >
          My Submitted Requests
        </button>
        <button
          onClick={() => setActiveFilter('incoming_requests')}
          className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
            activeFilter === 'incoming_requests'
              ? 'bg-coral-500 text-white shadow-xs'
              : 'text-obsidian-600 dark:text-slate-300 hover:bg-obsidian-200 dark:hover:bg-white/10'
          }`}
        >
          Incoming Guardian Requests
        </button>
      </div>

      {/* Applications List */}
      <div className="space-y-6">
        {userApplications.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center border border-white dark:border-white/10 shadow-elevated max-w-md mx-auto space-y-4">
            <div className="text-4xl">🐾📝</div>
            <h3 className="text-lg font-bold text-obsidian-950 dark:text-white">No active adoption requests found</h3>
            <p className="text-xs text-obsidian-600 dark:text-slate-300 leading-relaxed font-normal">
              Browse dogs on the Discover page to submit a verified adoption application or post your dog to receive inquiries.
            </p>
            <button
              onClick={() => setActiveTab('discover')}
              className="btn-primary px-6 py-2.5 rounded-full text-white font-bold text-xs shadow-glow-coral cursor-pointer"
            >
              Go to Discover
            </button>
          </div>
        ) : (
          userApplications.map((app: AdoptionApplication) => (
            <AdoptionJourneyTracker key={app.id} application={app} />
          ))
        )}
      </div>

    </div>
  );
};
