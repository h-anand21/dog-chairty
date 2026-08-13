import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { ChatView } from '../components/chat/ChatView';
import { MessageCircle, ShieldCheck, Search, Sparkles } from 'lucide-react';

export const ChatPage: React.FC = () => {
  const { conversations, activeConversationId, setActiveConversationId, currentUser } = useApp();
  const { playPawPop } = useAudio();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Encrypted Direct Canine Communications</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-obsidian-900">
            Adoption Messages & Coordination
          </h1>
          <p className="text-xs sm:text-sm text-obsidian-600 mt-1">
            Private conversations unlock once an owner accepts an adoption application.
          </p>
        </div>
      </div>

      {/* Main Grid: Sidebar + Chat Window */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT SIDEBAR: Active Conversations List */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-4 sm:p-5 border border-obsidian-400/50 shadow-soft h-[700px] flex flex-col">
          
          <div className="flex items-center justify-between pb-3 border-b border-obsidian-400/40">
            <h3 className="font-bold text-sm text-obsidian-900 flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-coral-500" />
              <span>Active Chats</span>
            </h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-coral-50 text-coral-600">
              {conversations.length} total
            </span>
          </div>

          <div className="mt-3 flex-1 overflow-y-auto space-y-2">
            {conversations.length === 0 ? (
              <div className="text-center py-12 text-xs text-obsidian-500 space-y-2">
                <div className="text-3xl">🐾💬</div>
                <p>No active chats yet.</p>
                <p className="text-[11px] text-obsidian-400">
                  Submit an application on the Discover page to get started!
                </p>
              </div>
            ) : (
              conversations.map(conv => {
                const isActive = conv.id === activeConversationId;
                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      playPawPop();
                      setActiveConversationId(conv.id);
                    }}
                    className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center gap-3 text-left ${
                      isActive
                        ? 'bg-coral-50 border-2 border-coral-400 shadow-xs'
                        : 'hover:bg-obsidian-300/50 border border-transparent'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={conv.dogAvatar}
                        alt={conv.dogName}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-coral-300"
                      />
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-obsidian-900 truncate">
                          {conv.dogName}
                        </h4>
                        <span className="text-[10px] text-obsidian-400 shrink-0">
                          {conv.lastMessageTimestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-obsidian-600 truncate mt-0.5 font-medium">
                        {conv.lastMessage || 'Say hi to the owner!'}
                      </p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-coral-500 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* RIGHT MAIN PANEL: Active Chat Window */}
        <div className="lg:col-span-8">
          <ChatView />
        </div>

      </div>

    </div>
  );
};
