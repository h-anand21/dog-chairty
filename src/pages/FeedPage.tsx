import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAudio } from '../context/AudioContext';
import { StoryTray } from '../components/feed/StoryTray';
import { PostCard } from '../components/feed/PostCard';
import { CreatePostModal } from '../components/feed/CreatePostModal';
import { Post } from '../types';
import { Camera, PlusCircle, Sparkles, TrendingUp, LogIn, Heart, ShieldCheck, Dog as DogIcon, Lock, Award, MessageCircle } from 'lucide-react';

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

  /* 🌟 1. GUEST VISITOR LANDING MOCKUP VIEW (When Logged Out) */
  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
        
        {/* HERO MOCKUP BANNER */}
        <div className="relative rounded-5xl p-8 sm:p-12 bg-gradient-to-r from-coral-600 via-amber-500 to-coral-600 text-white overflow-hidden shadow-elevated text-left space-y-6">
          <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-black text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Visitor Preview Mode • Welcome to PawFeed</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-display leading-tight">
              India&apos;s Verified Canine Social Community 🐕✨
            </h1>

            <p className="text-xs sm:text-base text-white/95 leading-relaxed font-medium max-w-2xl">
              Explore dog park adventures, vocal bark audio notes, agility runs, and verified adoption handover updates shared by pet parents across India!
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  playPawPop();
                  requireAuth('Log in with your mobile number to view live feed and post dog moments!');
                }}
                className="bg-white text-coral-600 hover:bg-coral-50 px-8 py-3.5 rounded-full font-black text-xs sm:text-sm shadow-soft transition-all cursor-pointer flex items-center gap-2 hover:scale-102"
              >
                <LogIn className="w-4 h-4" />
                <span>Log In / Register with Mobile OTP</span>
              </button>

              <button
                onClick={() => {
                  playPawPop();
                  setActiveTab('discover');
                }}
                className="bg-black/30 hover:bg-black/40 text-white border border-white/20 px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2"
              >
                <DogIcon className="w-4 h-4 text-coral-200" />
                <span>Browse Pups for Adoption ➔</span>
              </button>
            </div>
          </div>
        </div>

        {/* 📸 LANDING MOCKUP PREVIEW STREAM */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* MOCKUP FEED STREAM (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Locked Visitor Notice Bar */}
            <div className="glass-card rounded-3xl p-5 border border-coral-200 dark:border-coral-800/60 bg-coral-50/80 dark:bg-coral-950/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-coral-500 text-white flex items-center justify-center text-xl shrink-0 shadow-md">
                  🔒
                </div>
                <div>
                  <h4 className="text-sm font-black text-obsidian-950 dark:text-white">
                    Preview Landing Mode Active
                  </h4>
                  <p className="text-xs text-obsidian-600 dark:text-slate-300 font-medium">
                    Log in with mobile OTP to unlock live community posts, share photos, leave comments, and message guardians!
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  playPawPop();
                  requireAuth('Log in to unlock posting, liking, and direct messaging!');
                }}
                className="btn-primary text-white px-6 py-2.5 rounded-full font-black text-xs shadow-glow-coral shrink-0 cursor-pointer hover:scale-105 transition-transform"
              >
                Log In Now ➔
              </button>
            </div>

            {/* MOCKUP CARD 1 */}
            <div className="glass-card rounded-4xl border border-white dark:border-white/10 shadow-card overflow-hidden relative">
              <div className="p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-coral-100 dark:bg-coral-950/80 text-coral-500 flex items-center justify-center text-xl font-bold ring-2 ring-coral-300">
                      🐕
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-obsidian-950 dark:text-white">
                        Sample Canine Moment 🐾
                      </h3>
                      <p className="text-xs text-obsidian-500 dark:text-slate-400 font-semibold">
                        Golden Retriever • Eco Park Lakefront
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-coral-50 dark:bg-coral-950/60 text-coral-600 dark:text-coral-400 border border-coral-200 dark:border-coral-800/60">
                    Preview Post
                  </span>
                </div>

                <div className="relative rounded-3xl overflow-hidden bg-obsidian-900 h-64 sm:h-80">
                  <img
                    src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80"
                    alt="Sample Dog"
                    className="w-full h-full object-cover filter blur-[2px] opacity-80"
                  />
                  <div className="absolute inset-0 bg-obsidian-950/60 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center text-white space-y-3">
                    <div className="w-14 h-14 rounded-full bg-white/20 text-white flex items-center justify-center text-2xl backdrop-blur-md shadow-lg">
                      🔒
                    </div>
                    <h4 className="text-lg font-black font-display">Log In to View Live Community Feed</h4>
                    <p className="text-xs text-white/90 max-w-sm font-medium">
                      Join thousands of verified pet lovers sharing daily photos, vocal barks, and agility videos!
                    </p>
                    <button
                      onClick={() => {
                        playPawPop();
                        requireAuth('Log in to view live posts, likes, and comments!');
                      }}
                      className="btn-primary text-white px-6 py-2.5 rounded-full font-black text-xs shadow-glow-coral cursor-pointer"
                    >
                      Log In / Register with OTP ➔
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* MOCKUP CARD 2 */}
            <div className="glass-card rounded-4xl border border-white dark:border-white/10 shadow-card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 flex items-center justify-center text-xl font-bold">
                  🎾
                </div>
                <div>
                  <h3 className="text-sm font-black text-obsidian-950 dark:text-white">
                    Daily Park Agility Run 🏃‍♂️🐾
                  </h3>
                  <p className="text-xs text-obsidian-500 dark:text-slate-400 font-semibold">
                    Verified Pet Parent Update
                  </p>
                </div>
              </div>
              <p className="text-xs text-obsidian-600 dark:text-slate-300 leading-relaxed font-medium">
                “First beach trip of the month! Caught 14 tennis balls and gave 30 paw-shakes to passersby 🌊🐾”
              </p>
              <div className="pt-2 flex items-center justify-between border-t border-obsidian-100 dark:border-white/10 text-xs font-bold text-obsidian-500 dark:text-slate-400">
                <span className="flex items-center gap-1 text-coral-500">
                  <Heart className="w-4 h-4" /> 142 Likes
                </span>
                <button
                  onClick={() => requireAuth('Log in to like posts and leave comments!')}
                  className="text-coral-600 dark:text-coral-400 hover:underline cursor-pointer"
                >
                  Log In to Comment ➔
                </button>
              </div>
            </div>

          </div>

          {/* SIDEBAR HIGHLIGHTS (4 Cols) */}
          <div className="hidden lg:block lg:col-span-4 space-y-6">
            
            <div className="glass-card rounded-3xl p-6 border border-white dark:border-white/10 shadow-card space-y-4">
              <div className="flex items-center gap-2 text- coral-600 font-black text-xs uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-coral-500" />
                <span>Why Join PawConnect?</span>
              </div>
              
              <ul className="space-y-3 text-xs text-obsidian-700 dark:text-slate-300 font-medium">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-black">✓</span>
                  <span>100% Free Adoption Registry (Zero Breeder Fees)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-black">✓</span>
                  <span>Direct 1-on-1 Guardian Socket Messaging</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-500 font-black">✓</span>
                  <span>Official Gold Certificates & Digital Handover</span>
                </li>
              </ul>

              <button
                onClick={() => requireAuth('Create your free account now!')}
                className="w-full btn-primary text-white py-3 rounded-full font-black text-xs shadow-glow-coral cursor-pointer"
              >
                Join Community for Free
              </button>
            </div>

          </div>

        </div>

        <CreatePostModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
      </div>
    );
  }

  /* 🌟 2. AUTHENTICATED REAL USER LIVE FEED VIEW (When Logged In) */
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header Banner for Logged-In Users */}
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

      {/* Stories Tray */}
      <StoryTray />

      {/* Main Grid: Feed Posts + Community Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT / CENTER: Real Live Posts Stream (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
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
