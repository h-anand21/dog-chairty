import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAudio } from '../context/AudioContext';
import { ChatView } from '../components/chat/ChatView';
import { Conversation } from '../types';
import { MessageCircle, ShieldCheck, ArrowLeft } from 'lucide-react';

export const ChatPage: React.FC = () => {
  const { conversations, activeConversationId, setActiveConversationId, dogs, currentUser, allUsers } = useApp();
  const { playPawPop } = useAudio();

  // Mobile navigation state: 'list' or 'chat'
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');

  const handleSelectConv = (convId: string) => {
    playPawPop();
    setActiveConversationId(convId);
    setMobileView('chat');
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
      
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4 text-left">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Encrypted Direct Messaging</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display text-obsidian-950">
            Adoption Messages & Chats
          </h1>
          <p className="text-xs text-obsidian-600 font-medium">
            Dedicated private threads for each dog connecting you directly with their verified pet guardian.
          </p>
        </div>

        {/* Mobile Back to List Button */}
        {mobileView === 'chat' && (
          <button
            onClick={() => setMobileView('list')}
            className="lg:hidden flex items-center gap-1 px-3 py-1.5 rounded-full bg-obsidian-200 text-obsidian-900 font-bold text-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Chats</span>
          </button>
        )}
      </div>

      {/* Main Grid: Sidebar + Chat Window */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CONVERSATIONS SIDEBAR (Visible on Desktop OR when mobileView === 'list') */}
        <div className={`lg:col-span-4 bg-white dark:bg-[#0F172A] rounded-4xl p-4 sm:p-5 border border-obsidian-200 dark:border-white/10 shadow-card h-[600px] sm:h-[700px] flex flex-col ${
          mobileView === 'chat' ? 'hidden lg:flex' : 'flex'
        }`}>
          
          <div className="flex items-center justify-between pb-3 border-b border-obsidian-200 dark:border-white/10">
            <h3 className="font-black text-sm text-obsidian-950 dark:text-white flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-coral-500" />
              <span>Dog Threads ({conversations.length})</span>
            </h3>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-coral-50 dark:bg-coral-950/60 text-coral-600 dark:text-coral-400 border border-coral-200 dark:border-coral-800/60">
              1-on-1 Chats
            </span>
          </div>

          <div className="mt-3 flex-1 overflow-y-auto space-y-2 pr-1">
            {conversations.length === 0 ? (
              <div className="text-center py-16 text-xs text-obsidian-500 dark:text-slate-400 space-y-2">
                <div className="text-4xl">🐾💬</div>
                <p className="font-bold text-obsidian-800 dark:text-slate-200">No active chats yet.</p>
                <p className="text-[11px] text-obsidian-500 dark:text-slate-400">
                  Click &ldquo;Message Guardian&rdquo; or &ldquo;I&apos;m Interested in Adopting&rdquo; on any dog in Discover to start a chat!
                </p>
              </div>
            ) : (
              conversations.map((conv: Conversation) => {
                const isActive = conv.id === activeConversationId;
                const matchingDog = dogs.find(d => d.id === conv.dogId);
                const otherParticipantId = conv.participants.find(p => p !== currentUser?.id) || conv.participants[0];
                const otherUser = allUsers.find(u => u.id === otherParticipantId);
                
                const displayName = otherUser?.name || (currentUser?.role === 'owner' ? 'Interested Adopter' : matchingDog?.currentOwnerName || 'Pet Guardian');
                const displayAvatar = otherUser?.avatar || (currentUser?.role === 'owner' ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400' : conv.dogAvatar);

                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConv(conv.id)}
                    className={`p-3.5 rounded-2xl cursor-pointer transition-all flex items-center gap-3 text-left ${
                      isActive
                        ? 'bg-coral-50 dark:bg-coral-950/60 border-2 border-coral-400 shadow-xs ring-2 ring-coral-100 dark:ring-coral-500/20'
                        : 'hover:bg-obsidian-100 dark:hover:bg-white/5 border border-obsidian-100 dark:border-white/5'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={displayAvatar}
                        alt={displayName}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-coral-400 shadow-2xs"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-obsidian-900 rounded-full" title="Online now" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-obsidian-950 dark:text-white truncate flex items-center gap-1">
                          <span>{displayName}</span>
                        </h4>
                        <span className="text-[10px] text-obsidian-400 dark:text-slate-500 shrink-0 font-medium">
                          {conv.lastMessageTimestamp}
                        </span>
                      </div>

                      <div className="text-[10px] font-extrabold text-coral-600 dark:text-coral-400 truncate mt-0.5">
                        Interested in adopting {conv.dogName} 🐶
                      </div>

                      <p className="text-[11px] text-obsidian-600 dark:text-slate-300 truncate mt-0.5 font-normal">
                        &ldquo;{conv.lastMessage}&rdquo;
                      </p>

                      <div className="flex items-center justify-between mt-1 pt-1 border-t border-obsidian-100 dark:border-white/5">
                        <span className="text-[9px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.2 rounded-sm border border-emerald-200 dark:border-emerald-800/60">
                          {matchingDog?.breed || 'Pup'} • {matchingDog?.city || 'Kolkata'}
                        </span>
                        {conv.unreadCount > 0 && (
                          <span className="px-1.5 py-0.2 text-[9px] font-black bg-coral-500 text-white rounded-full">
                            {conv.unreadCount} new
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* RIGHT CHAT WINDOW (Visible on Desktop OR when mobileView === 'chat') */}
        <div className={`lg:col-span-8 ${mobileView === 'list' ? 'hidden lg:block' : 'block'}`}>
          <ChatView />
        </div>

      </div>

    </div>
  );
};
