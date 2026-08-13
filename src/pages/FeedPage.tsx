import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAudio } from '../context/AudioContext';
import { StoryTray } from '../components/feed/StoryTray';
import { PostCard } from '../components/feed/PostCard';
import { CreatePostModal } from '../components/feed/CreatePostModal';
import { Post } from '../types';
import { Camera, PlusCircle, Sparkles, TrendingUp } from 'lucide-react';

export const FeedPage: React.FC = () => {
  const { posts } = useApp();
  const { playPawPop } = useAudio();

  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 text-coral-600 font-bold text-xs mb-1.5">
            <Camera className="w-3.5 h-3.5" />
            <span>Canine Social Moments & Stories</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-obsidian-900">
            PawFeed Social
          </h1>
          <p className="text-xs sm:text-sm text-obsidian-600 mt-1">
            Share and celebrate daily dog adventures, agility runs, funny moments, and adoption updates.
          </p>
        </div>

        <button
          onClick={() => {
            playPawPop();
            setIsCreateOpen(true);
          }}
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
        
        {/* LEFT / CENTER: Posts Stream (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {posts.map((post: Post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {/* RIGHT: Community Trends Sidebar (4 cols) */}
        <div className="hidden lg:block lg:col-span-4 space-y-6 text-left">
          
          <div className="bg-white rounded-3xl p-5 border border-obsidian-400/50 shadow-soft space-y-3">
            <h3 className="font-bold text-sm text-obsidian-900 flex items-center gap-2">
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
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-obsidian-300/50 transition-colors cursor-pointer"
                >
                  <span className="text-xs font-bold text-coral-600">{item.tag}</span>
                  <span className="text-[10px] text-obsidian-500">{item.posts}</span>
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
              Bruno & Sarah&apos;s New Journey
            </h4>
            <p className="text-xs text-white/90 leading-relaxed">
              After a successful 6-stage handover, Bruno is enjoying his new 2000 sq ft garden with sister Luna!
            </p>
          </div>

        </div>

      </div>

      <CreatePostModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

    </div>
  );
};
