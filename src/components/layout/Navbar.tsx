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
  PlusCircle,
  Volume2,
  VolumeX,
  Bell,
  Check,
  ChevronDown,
  UserCheck,
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

  // Unread messages count
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  // Active applications for current user
  const activeAppsCount = applications.filter(
    a => (a.applicantId === currentUser.id || currentUser.role === 'owner') && a.status !== 'completed' && a.status !== 'declined'
  ).length;

  const handleTabClick = (tab: typeof activeTab) => {
    playPawPop();
    setActiveTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-obsidian-400/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div
            onClick={() => handleTabClick('discover')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-coral-600 to-coral-400 flex items-center justify-center text-white shadow-soft group-hover:scale-105 transition-transform duration-200">
              <span className="text-2xl">🐾</span>
            </div>
            <div>
              <span className="text-2xl font-black font-display tracking-tight bg-gradient-to-r from-obsidian-900 via-coral-600 to-coral-500 bg-clip-text text-transparent">
                PawConnect
              </span>
              <span className="hidden sm:block text-[11px] font-semibold text-obsidian-600 tracking-wider uppercase">
                Adopt • Match • Transfer
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-obsidian-300/60 p-1.5 rounded-full border border-obsidian-400/50">
            
            <button
              onClick={() => handleTabClick('discover')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                activeTab === 'discover'
                  ? 'bg-white text-coral-600 shadow-sm'
                  : 'text-obsidian-700 hover:text-obsidian-900 hover:bg-white/50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Discover</span>
            </button>

            <button
              onClick={() => handleTabClick('adopt_flow')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 relative ${
                activeTab === 'adopt_flow'
                  ? 'bg-white text-coral-600 shadow-sm'
                  : 'text-obsidian-700 hover:text-obsidian-900 hover:bg-white/50'
              }`}
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Adoption Journey</span>
              {activeAppsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-coral-500 animate-pulse"></span>
              )}
            </button>

            <button
              onClick={() => handleTabClick('chat')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 relative ${
                activeTab === 'chat'
                  ? 'bg-white text-coral-600 shadow-sm'
                  : 'text-obsidian-700 hover:text-obsidian-900 hover:bg-white/50'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat</span>
              {unreadMessagesCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-extrabold bg-coral-500 text-white rounded-full">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            <button
              onClick={() => handleTabClick('feed')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                activeTab === 'feed'
                  ? 'bg-white text-coral-600 shadow-sm'
                  : 'text-obsidian-700 hover:text-obsidian-900 hover:bg-white/50'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>PawFeed</span>
            </button>

            <button
              onClick={() => handleTabClick('my_dogs')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                activeTab === 'my_dogs'
                  ? 'bg-white text-coral-600 shadow-sm'
                  : 'text-obsidian-700 hover:text-obsidian-900 hover:bg-white/50'
              }`}
            >
              <DogIcon className="w-4 h-4" />
              <span>My Dogs</span>
            </button>

            <button
              onClick={() => handleTabClick('admin')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                activeTab === 'admin'
                  ? 'bg-white text-sky-600 shadow-sm'
                  : 'text-obsidian-700 hover:text-obsidian-900 hover:bg-white/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Safety & Admin</span>
            </button>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            
            {/* List Dog Action */}
            <button
              onClick={() => {
                playPawPop();
                setIsListDogOpen(true);
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white px-4 py-2.5 rounded-full font-bold text-sm shadow-soft hover:shadow-soft-hover transition-all duration-200 hover:scale-102 active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">List Dog for Adoption</span>
              <span className="sm:hidden">List</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleSound}
              title={soundEnabled ? 'Mute playful sound effects' : 'Enable sound effects'}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-obsidian-400/60 text-obsidian-700 hover:text-coral-500 hover:border-coral-300 transition-colors shadow-xs"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-coral-500" />
              ) : (
                <VolumeX className="w-4 h-4 text-obsidian-500" />
              )}
            </button>

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-obsidian-400/60 text-obsidian-700 hover:text-coral-500 transition-colors relative shadow-xs"
              >
                <Bell className="w-4 h-4" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-coral-500 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                    {unreadNotifsCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-dropdown rounded-2xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-obsidian-400/40">
                    <h4 className="font-bold text-sm text-obsidian-900 flex items-center gap-2">
                      <span>🔔</span> Real-Time Notifications
                    </h4>
                    <span className="text-xs text-obsidian-600">
                      {notifications.length} updates
                    </span>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-obsidian-400/30 my-2">
                    {notifications.length === 0 ? (
                      <p className="py-6 text-center text-xs text-obsidian-600">
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
                          className={`p-3 text-left hover:bg-coral-50/50 rounded-xl transition-colors cursor-pointer ${
                            !notif.read ? 'bg-coral-50/80 font-medium' : 'opacity-80'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-obsidian-900">
                              {notif.title}
                            </span>
                            <span className="text-[10px] text-obsidian-500 whitespace-nowrap">
                              {notif.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-obsidian-700 mt-1 leading-relaxed">
                            {notif.message}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Persona Switcher Menu */}
            <div className="relative">
              <button
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-white border border-obsidian-400/80 hover:border-coral-400 transition-all shadow-xs"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-coral-400/40"
                />
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-obsidian-900 leading-tight flex items-center gap-1">
                    {currentUser.name}
                    {currentUser.isVerified && (
                      <UserCheck className="w-3 h-3 text-emerald-500" />
                    )}
                  </div>
                  <div className="text-[10px] font-semibold text-coral-600 capitalize">
                    {currentUser.role === 'owner' ? 'Dog Owner' : currentUser.role === 'adopter' ? 'Adopter' : currentUser.role}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-obsidian-600" />
              </button>

              {/* Persona Switcher Dropdown */}
              {showPersonaMenu && (
                <div className="absolute right-0 mt-3 w-72 glass-dropdown rounded-2xl shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-obsidian-400/40">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-obsidian-500">
                      Switch Active Persona
                    </p>
                    <p className="text-xs text-obsidian-700">
                      Test both sides of the adoption journey instantly:
                    </p>
                  </div>
                  <div className="mt-2 space-y-1">
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
                          className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all ${
                            isSelected
                              ? 'bg-coral-50 border border-coral-200 font-bold text-coral-800'
                              : 'hover:bg-obsidian-300/60 text-obsidian-800'
                          }`}
                        >
                          <div className="flex items-center gap-3 text-left">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-9 h-9 rounded-full object-cover"
                            />
                            <div>
                              <div className="text-xs font-bold flex items-center gap-1">
                                {user.name}
                                {user.isVerified && (
                                  <UserCheck className="w-3 h-3 text-emerald-500" />
                                )}
                              </div>
                              <div className="text-[10px] text-obsidian-600">
                                {user.role === 'owner'
                                  ? 'Current Owner (Bruno)'
                                  : user.role === 'adopter'
                                  ? 'Adopter Candidate'
                                  : user.role === 'shelter'
                                  ? 'Vet & Rescue Foster'
                                  : 'Safety Moderator'}
                              </div>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-coral-500" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
