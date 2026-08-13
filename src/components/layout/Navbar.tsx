import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import {
  Compass,
  HeartHandshake,
  MessageCircle,
  Camera,
  Dog as DogIcon,
  ShieldCheck,
  Plus,
  Volume2,
  VolumeX,
  Bell,
  Check,
  ChevronDown,
  UserCheck,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    allUsers,
    switchUser,
    activeTab,
    setActiveTab,
    setIsListDogOpen,
    notifications,
    unreadNotifsCount,
    markNotificationAsRead,
    conversations,
    applications,
  } = useApp();

  const { soundEnabled, toggleSound, playPawPop } = useAudio();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const activeAppsCount = applications.filter(
    a => (a.applicantId === currentUser.id || currentUser.role === 'owner') && a.status !== 'completed' && a.status !== 'declined'
  ).length;

  const handleTabClick = (tab: typeof activeTab) => {
    playPawPop();
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 w-full px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="max-w-7xl mx-auto glass-nav rounded-3xl sm:rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all duration-300">
        
        {/* BRAND LOGO */}
        <div
          onClick={() => handleTabClick('discover')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-coral-600 via-coral-500 to-amber-400 flex items-center justify-center text-white shadow-glow-coral group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
            <span className="text-xl">🐾</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black font-display tracking-tight text-obsidian-950">
                Paw<span className="text-coral-500">Connect</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-coral-500 animate-pulse hidden sm:block" />
            </div>
            <p className="hidden md:block text-[10px] font-bold text-obsidian-500 uppercase tracking-widest -mt-1">
              Verified Adoption & Social
            </p>
          </div>
        </div>

        {/* CENTER NAVIGATION PILLS */}
        <nav className="hidden lg:flex items-center gap-1 bg-obsidian-200/60 p-1.5 rounded-full border border-obsidian-300/60 shadow-inner">
          
          <button
            onClick={() => handleTabClick('discover')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'discover'
                ? 'bg-white text-obsidian-950 shadow-sm'
                : 'text-obsidian-600 hover:text-obsidian-900 hover:bg-white/50'
            }`}
          >
            <Compass className={`w-4 h-4 ${activeTab === 'discover' ? 'text-coral-500' : ''}`} />
            <span>Discover</span>
          </button>

          <button
            onClick={() => handleTabClick('adopt_flow')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 relative cursor-pointer ${
              activeTab === 'adopt_flow'
                ? 'bg-white text-obsidian-950 shadow-sm'
                : 'text-obsidian-600 hover:text-obsidian-900 hover:bg-white/50'
            }`}
          >
            <HeartHandshake className={`w-4 h-4 ${activeTab === 'adopt_flow' ? 'text-coral-500' : ''}`} />
            <span>Adoption Pipeline</span>
            {activeAppsCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-coral-500 ring-2 ring-white animate-pulse"></span>
            )}
          </button>

          <button
            onClick={() => handleTabClick('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 relative cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-white text-obsidian-950 shadow-sm'
                : 'text-obsidian-600 hover:text-obsidian-900 hover:bg-white/50'
            }`}
          >
            <MessageCircle className={`w-4 h-4 ${activeTab === 'chat' ? 'text-coral-500' : ''}`} />
            <span>Live Chat</span>
            {unreadMessagesCount > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-black bg-coral-500 text-white rounded-full leading-none">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleTabClick('feed')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'feed'
                ? 'bg-white text-obsidian-950 shadow-sm'
                : 'text-obsidian-600 hover:text-obsidian-900 hover:bg-white/50'
            }`}
          >
            <Camera className={`w-4 h-4 ${activeTab === 'feed' ? 'text-coral-500' : ''}`} />
            <span>PawFeed</span>
          </button>

          <button
            onClick={() => handleTabClick('my_dogs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'my_dogs'
                ? 'bg-white text-obsidian-950 shadow-sm'
                : 'text-obsidian-600 hover:text-obsidian-900 hover:bg-white/50'
            }`}
          >
            <DogIcon className={`w-4 h-4 ${activeTab === 'my_dogs' ? 'text-coral-500' : ''}`} />
            <span>My Dogs</span>
          </button>

          <button
            onClick={() => handleTabClick('admin')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              activeTab === 'admin'
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-obsidian-600 hover:text-obsidian-900 hover:bg-white/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-sky-500" />
            <span>Safety & Admin</span>
          </button>
        </nav>

        {/* RIGHT ACTION CONTROLS */}
        <div className="flex items-center gap-2.5">
          
          {/* Post Dog Button */}
          <button
            onClick={() => {
              playPawPop();
              setIsListDogOpen(true);
            }}
            className="btn-primary text-white px-4 sm:px-5 py-2 rounded-full font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Post Dog for Adoption</span>
            <span className="sm:hidden">Post Dog</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute playful sound FX' : 'Enable playful sound FX'}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/90 border border-obsidian-300/80 text-obsidian-700 hover:text-coral-500 hover:border-coral-300 transition-all shadow-xs cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-coral-500" />
            ) : (
              <VolumeX className="w-4 h-4 text-obsidian-400" />
            )}
          </button>

          {/* Notifications Tray */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/90 border border-obsidian-300/80 text-obsidian-700 hover:text-coral-500 transition-all relative shadow-xs cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-coral-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse ring-2 ring-white">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-dropdown rounded-3xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-obsidian-200">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-obsidian-900 flex items-center gap-1.5">
                    <span>🔔</span> Real-Time Notifications
                  </h4>
                  <span className="text-[11px] font-semibold text-coral-600 bg-coral-50 px-2 py-0.5 rounded-full">
                    {notifications.length} updates
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-obsidian-200/60 my-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="py-8 text-center text-xs text-obsidian-500">
                      No notifications yet.
                    </p>
                  ) : (
                    notifications.map(notif => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationAsRead(notif.id);
                          if (notif.type === 'application_received' || notif.type === 'application_accepted') {
                            setActiveTab('adopt_flow');
                          }
                          setShowNotifMenu(false);
                        }}
                        className={`p-3 text-left hover:bg-coral-50/60 rounded-2xl transition-colors cursor-pointer ${
                          !notif.read ? 'bg-coral-50/70 font-semibold' : 'opacity-80'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-obsidian-950">
                            {notif.title}
                          </span>
                          <span className="text-[10px] text-obsidian-500 shrink-0">
                            {notif.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-obsidian-600 mt-1 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPersonaMenu(!showPersonaMenu)}
              className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-white/90 border border-obsidian-300 hover:border-coral-400 transition-all shadow-xs cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover ring-2 ring-coral-400"
              />
              <div className="hidden md:block text-left">
                <div className="text-xs font-extrabold text-obsidian-950 leading-none flex items-center gap-1">
                  {currentUser.name}
                  {currentUser.isVerified && (
                    <UserCheck className="w-3 h-3 text-emerald-500 shrink-0" />
                  )}
                </div>
                <div className="text-[10px] font-bold text-coral-600 capitalize mt-0.5">
                  {currentUser.role === 'owner' ? 'Dog Guardian' : currentUser.role === 'adopter' ? 'Adopter' : currentUser.role}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-obsidian-500" />
            </button>

            {showPersonaMenu && (
              <div className="absolute right-0 mt-3 w-72 glass-dropdown rounded-3xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
                <div className="px-3 py-2 border-b border-obsidian-200">
                  <p className="text-[10px] font-black uppercase tracking-wider text-obsidian-400">
                    Switch Test Account
                  </p>
                  <p className="text-xs text-obsidian-700 font-medium mt-0.5">
                    Experience both sides of adoption:
                  </p>
                </div>
                <div className="mt-2 space-y-1.5">
                  {allUsers.map(user => {
                    const isSelected = user.id === currentUser.id;
                    return (
                      <button
                        key={user.id}
                        onClick={() => {
                          switchUser(user.id);
                          setShowPersonaMenu(false);
                          playPawPop();
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-2xl transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-coral-500 text-white font-bold shadow-soft'
                            : 'hover:bg-obsidian-200/80 text-obsidian-800'
                        }`}
                      >
                        <div className="flex items-center gap-3 text-left">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className={`w-9 h-9 rounded-full object-cover ring-2 ${
                              isSelected ? 'ring-white' : 'ring-obsidian-300'
                            }`}
                          />
                          <div>
                            <div className="text-xs font-black flex items-center gap-1">
                              {user.name}
                            </div>
                            <div className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-obsidian-500'}`}>
                              {user.role === 'owner'
                                ? 'Bruno\'s Guardian (Owner)'
                                : user.role === 'adopter'
                                ? 'Adopter Candidate'
                                : user.role === 'shelter'
                                ? 'Rescue Volunteer'
                                : 'Safety Admin'}
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
