import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { Compass, HeartHandshake, MessageCircle, Camera, Dog as DogIcon, LucideIcon } from 'lucide-react';

interface NavItem {
  id: 'discover' | 'adopt_flow' | 'feed' | 'chat' | 'my_dogs';
  label: string;
  icon: LucideIcon;
  badge?: number;
}

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, conversations, applications, currentUser } = useApp();
  const { playPawPop } = useAudio();

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const activeAppsCount = applications.filter(
    a => (a.applicantId === currentUser.id || currentUser.role === 'owner') && a.status !== 'completed' && a.status !== 'declined'
  ).length;

  const handleTab = (tab: NavItem['id']) => {
    playPawPop();
    setActiveTab(tab);
  };

  const navItems: NavItem[] = [
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'adopt_flow', label: 'Pipeline', icon: HeartHandshake, badge: activeAppsCount },
    { id: 'chat', label: 'Chat', icon: MessageCircle, badge: unreadMessagesCount },
    { id: 'feed', label: 'PawFeed', icon: Camera },
    { id: 'my_dogs', label: 'My Dogs', icon: DogIcon },
  ];

  return (
    <div className="lg:hidden fixed bottom-3 left-3 right-3 z-40">
      <div className="max-w-md mx-auto glass-dropdown rounded-full px-3 py-2 shadow-2xl border border-white/90 flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTab(item.id)}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-full transition-all relative cursor-pointer ${
                isActive
                  ? 'text-coral-600 scale-105 font-black'
                  : 'text-obsidian-600 font-bold hover:text-obsidian-900'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-coral-500 text-white text-[9px] font-black flex items-center justify-center ring-2 ring-white">
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
