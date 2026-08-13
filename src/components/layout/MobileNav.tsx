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
  const { activeTab, setActiveTab, conversations } = useApp();
  const { playPawPop } = useAudio();

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const handleTab = (tab: NavItem['id']) => {
    playPawPop();
    setActiveTab(tab);
  };

  const navItems: NavItem[] = [
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'adopt_flow', label: 'Journey', icon: HeartHandshake },
    { id: 'feed', label: 'PawFeed', icon: Camera },
    { id: 'chat', label: 'Chat', icon: MessageCircle, badge: unreadMessagesCount },
    { id: 'my_dogs', label: 'My Dogs', icon: DogIcon },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-obsidian-400/50 px-3 py-2 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-2xl transition-all relative ${
                isActive ? 'text-coral-600 scale-105 font-bold' : 'text-obsidian-600 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 w-4 h-4 rounded-full bg-coral-500 text-white text-[9px] font-black flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px]">{item.label}</span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-coral-500 -mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
