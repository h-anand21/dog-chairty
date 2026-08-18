import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { Compass, HeartHandshake, MessageCircle, Camera, LucideIcon } from 'lucide-react';

interface NavItem {
  id: 'discover' | 'adopt_flow' | 'chat' | 'feed';
  label: string;
  icon: LucideIcon;
  badge?: number;
}

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, conversations, applications, currentUser, requireAuth } = useApp();
  const { playPawPop } = useAudio();

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const activeAppsCount = applications.filter(
    a => (a.applicantId === currentUser?.id || currentUser?.role === 'owner') &&
      a.status !== 'completed' &&
      a.status !== 'declined'
  ).length;

  const handleTab = (tab: NavItem['id']) => {
    playPawPop();

    if (tab === 'adopt_flow') {
      requireAuth('Please log in with your mobile number to access the Adoption Pipeline.', () => {
        setActiveTab('adopt_flow');
      });
      return;
    }

    if (tab === 'chat') {
      requireAuth('Please log in with your mobile number to view your private adoption chats.', () => {
        setActiveTab('chat');
      });
      return;
    }

    setActiveTab(tab);
  };

  const navItems: NavItem[] = [
    { id: 'discover', label: 'Adopt Pups', icon: Compass },
    { id: 'adopt_flow', label: 'Pipeline', icon: HeartHandshake, badge: activeAppsCount },
    { id: 'chat', label: 'Messages', icon: MessageCircle, badge: unreadMessagesCount },
    { id: 'feed', label: 'PawFeed', icon: Camera },
  ];

  return (
    <div className="lg:hidden fixed bottom-3 left-3 right-3 z-40">
      <div className="max-w-md mx-auto glass-dropdown rounded-full px-4 py-2.5 shadow-2xl border border-white/90 dark:border-white/10 flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTab(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3.5 rounded-full transition-all relative cursor-pointer ${
                isActive
                  ? 'text-coral-600 dark:text-coral-400 scale-105 font-black'
                  : 'text-obsidian-600 dark:text-slate-300 font-bold hover:text-obsidian-900 dark:hover:text-white'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 w-4.5 h-4.5 rounded-full bg-coral-500 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white dark:ring-[#0B0F19] animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-coral-500 -mt-0.5 shadow-glow-coral"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
