import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAudio } from '../context/AudioContext';
import { StoryTray } from '../components/feed/StoryTray';
import { PostCard } from '../components/feed/PostCard';
import { CreatePostModal } from '../components/feed/CreatePostModal';
import { Post } from '../types';
import { Camera, PlusCircle, Sparkles, TrendingUp, LogIn, Heart, ShieldCheck, Dog as DogIcon } from 'lucide-react';

export const FeedPage: React.FC = () => {
  const { posts, currentUser, requireAuth, setActiveTab } = useApp();
  const { playPawPop } = useAudio();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCreateClick = () => {
    playPawPop();
    if (!currentUser) {
      requireAuth('Log in to share your dog moments, post photos, and connect with pet parents!', () => {
        setIsCreateOpen(true);
      });
      return;
    }
    setIsCreateOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* 🌟 GUEST VISITOR LANDING HERO BANNER (When Not Logged In) */}
      {!currentUser ? (
        <div className="relative rounded-4xl p-6 sm:p-10 bg-gradient-to-r from-coral-600 via-amber-500 to-coral-600 text-white overflow-hidden shadow-elevated text-left space-y-6">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-black text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Visitor Preview Mode • Welcome to PawFeed</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black font-display leading-tight">
              India&apos;s Verified Canine Social Community 🐕✨
            </h1>

            <p className="text-xs sm:text-base text-white/95 leading-relaxed font-medium max-w-2xl">
              Explore real dog park adventures, vocal bark notes, agility clips, and verified adoption handover milestones shared by pet parents across the nation!
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  playPawPop();
                  requireAuth('Log in with your mobile number to post photos and connect with pet guardians!');
                }}
                className="bg-white text-coral-600 hover:bg-coral-50 px-6 py-3 rounded-full font-black text-xs sm:text-sm shadow-soft transition-all cursor-pointer flex items-center gap-2 hover:scale-102"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In / Register with Mobile OTP</span>
              </button>

              <button
                onClick={() => {
                  playPawPop();
                  setActiveTab('discover');
                }}
                className="bg-black/30 hover:bg-black/40 text-white border border-white/20 px-6 py-3 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2"
              >
                <DogIcon className="w-4 h-4 text-coral-200" />
                <span>Browse Dogs for Adoption ➔</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Header Banner for Logged-In Users */
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 dark:bg-coral-950/60 text-coral-600 dark:text-coral-400 font-bold text-xs mb-1.5 border border-coral-200 dark:border-coral-800/60">
              <Camera className="w-3.5 h-3.5" />
              <span>Canine Social Moments & Stories</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-display text-obsidian-950 dark:text-white">
              Welcome back, {currentUser.name}! 🐾
            </h1>
            <p className="text-xs sm:text-sm text-obsidian-600 dark:text-slate-300 mt-1">
              Share and celebrate daily dog adventures, agility runs, funny moments, and adoption updates.
            </p>
          </div>

          <button
            onClick={handleCreateClick}
            className="flex items-center gap-2 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white px-6 py-3 rounded-full font-bold text-xs shadow-soft transition-all shrink-0 hover:scale-102 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Share Dog Moment</span>
          </button>
        </div>
      )}

      {/* Stories Tray */}
      <StoryTray />

      {/* Main Grid: Feed Posts + Community Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT / CENTER: Posts Stream (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Unauthenticated Guest Reminder Strip in Feed Stream */}
          {!currentUser && (
            <div className="glass-card rounded-3xl p-4 sm:p-5 border border-amber-200 dark:border-amber-500/30 bg-amber-50/80 dark:bg-amber-950/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-lg shrink-0 shadow-sm">
                  🔓
                </div>
                <div>
                  <h4 className="text-xs font-black text-amber-950 dark:text-amber-200">
                    Visitor Preview Mode Active
                  </h4>
                  <p className="text-[11px] text-amber-900/80 dark:text-amber-300 font-medium">
                    Log in with mobile OTP to post photo updates of your dog, like posts, and chat with guardians!
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  playPawPop();
                  requireAuth('Log in to unlock posting, liking, and direct messaging!');
                }}
                className="btn-primary text-white px-5 py-2 rounded-full font-black text-xs shadow-glow-coral shrink-0 cursor-pointer"
              >
                Log In Now ➔
              </button>
            </div>
          )}

          {posts.length === 0 ? (
            <div className="glass-card rounded-4xl p-12 text-center border border-white dark:border-white/10 shadow-elevated max-w-md mx-auto space-y-4">
              <div className="text-4xl">🐾📸</div>
              <h3 className="text-lg font-black text-obsidian-950 dark:text-white">Be the First to Share a Moment!</h3>
              <p className="text-xs text-obsidian-600 dark:text-slate-300 leading-relaxed">
                Post photos or videos of your pup to inspire the PawConnect community.
              </p>
              <button
                onClick={handleCreateClick}
                className="btn-primary text-white px-6 py-2.5 rounded-full font-bold text-xs shadow-glow-coral cursor-pointer"
              >
                + Share Dog Moment
              </button>
            </div>
          ) : (
            posts.map((post: Post) => (
              <PostCard key={post.id} post={post} />
            ))
          )}
        </div>

        {/* RIGHT: Community Trends Sidebar (4 cols) */}
        <div className="hidden lg:block lg:col-span-4 space-y-6 text-left">
          
          <div className="bg-white dark:bg-[#121A2B] rounded-3xl p-5 border border-obsidian-200 dark:border-white/10 shadow-soft space-y-3">
            <h3 className="font-bold text-sm text-obsidian-950 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-coral-500" />
              <span>Trending Paws</span>
            </h3>
            
            <div className="space-y-2">
              {[
                { tag: '#GoldenRetriever', posts: '1.4k posts' },
                { tag: '#AdoptDontShop', posts: '3.8k posts' },
                { tag: '#ZoomiesChampion', posts: '890 posts' },
                { tag: '#LakeParkDogs', posts: '620 posts' },
                { tag: '#GoodBoyMilestones', posts: '450 posts' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-obsidian-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-bold text-coral-600 dark:text-coral-400">{item.tag}</span>
                  <span className="text-[10px] text-obsidian-500 dark:text-slate-400 font-medium">{item.posts}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 via-coral-500 to-coral-600 text-white rounded-3xl p-6 shadow-soft space-y-3">
            <div className="inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Happy Tails Spotlight</span>
            </div>
            <h4 className="text-lg font-black font-display leading-tight">
              Adopted Rescue Companion&apos;s New Journey
            </h4>
            <p className="text-xs text-white/90 leading-relaxed">
              After a successful 6-stage verified handover, our rescued pup is thriving in their loving forever home!
            </p>
          </div>

        </div>

      </div>

      <CreatePostModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

    </div>
  );
};
