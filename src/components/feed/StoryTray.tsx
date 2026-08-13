import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { Story } from '../../types';
import { Plus, Sparkles, X, ChevronLeft, ChevronRight } from 'lucide-react';

export const StoryTray: React.FC = () => {
  const { stories, activeStory, setActiveStory } = useApp();
  const { playPawPop } = useAudio();

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-obsidian-400/50 shadow-soft">
      <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
        
        {/* Active Dog Stories List */}
        {stories.map(story => (
          <button
            key={story.id}
            onClick={() => {
              playPawPop();
              setActiveStory(story);
            }}
            className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-hidden"
          >
            <div className="relative p-1 rounded-full bg-gradient-to-tr from-coral-500 via-amber-400 to-sky-400 group-hover:scale-105 transition-transform duration-200 shadow-sm">
              <img
                src={story.dogAvatar}
                alt={story.dogName}
                className="w-16 h-16 rounded-full object-cover border-2 border-white"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-coral-500 text-white text-[9px] font-black flex items-center justify-center border-2 border-white shadow-xs">
                🐾
              </span>
            </div>
            <span className="text-xs font-bold text-obsidian-800 truncate max-w-[70px]">
              {story.dogName}
            </span>
          </button>
        ))}

      </div>

      {/* Full-Screen Story Viewer */}
      {activeStory && <StoryViewerModal />}
    </div>
  );
};

export const StoryViewerModal: React.FC = () => {
  const { activeStory, setActiveStory, stories } = useApp();
  const { playPawPop } = useAudio();
  const [progress, setProgress] = useState(0);

  const currentIndex = stories.findIndex(s => s.id === activeStory?.id);

  const handleNext = () => {
    playPawPop();
    if (currentIndex < stories.length - 1) {
      setActiveStory(stories[currentIndex + 1]);
      setProgress(0);
    } else {
      setActiveStory(null);
    }
  };

  const handlePrev = () => {
    playPawPop();
    if (currentIndex > 0) {
      setActiveStory(stories[currentIndex - 1]);
      setProgress(0);
    }
  };

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 2;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeStory?.id]);

  if (!activeStory) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-md h-[80vh] max-h-[700px] bg-obsidian-900 rounded-4xl overflow-hidden shadow-2xl flex flex-col justify-between text-white border border-obsidian-700 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Progress Bar Header */}
        <div className="absolute top-4 left-4 right-4 z-30 space-y-3">
          <div className="w-full bg-white/30 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-coral-500 h-full rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-left">
            <div className="flex items-center gap-2.5">
              <img
                src={activeStory.dogAvatar}
                alt={activeStory.dogName}
                className="w-10 h-10 rounded-full object-cover border-2 border-coral-400 shadow-md"
              />
              <div>
                <h4 className="text-sm font-black text-white">{activeStory.dogName} 🐾</h4>
                <span className="text-[10px] text-white/80">{activeStory.timestamp}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveStory(null)}
              className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Story Image */}
        <div className="relative w-full h-full">
          <img
            src={activeStory.mediaUrl}
            alt="Story"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* Navigation Click Areas */}
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 flex items-center justify-center text-white backdrop-blur-xs"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/60 flex items-center justify-center text-white backdrop-blur-xs"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Caption Overlay */}
        <div className="absolute bottom-6 left-6 right-6 z-20 text-left bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
          <p className="text-sm text-white font-medium leading-relaxed">
            {activeStory.caption}
          </p>
        </div>

      </div>
    </div>
  );
};
