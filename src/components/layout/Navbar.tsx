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
  Phone,
  Menu,
  X,
  LucideIcon,
} from 'lucide-react';

interface NavLinkItem {
  id: 'discover' | 'adopt_flow' | 'chat' | 'feed' | 'my_dogs' | 'admin';
  label: string;
  icon: LucideIcon;
  badge?: number;
}

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
    setIsAuthModalOpen,
  } = useApp();

  const { soundEnabled, toggleSound, playPawPop } = useAudio();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const activeAppsCount = applications.filter(
    a => (a.applicantId === currentUser.id || currentUser.role === 'owner') && a.status !== 'completed' && a.status !== 'declined'
  ).length;

  const handleTabClick = (tab: typeof activeTab) => {
    playPawPop();
    setActiveTab(tab);
    setShowMobileMenu(false);
  };

  const navLinks: NavLinkItem[] = [
    { id: 'discover', label: 'Discover Dogs', icon: Compass },
    { id: 'adopt_flow', label: 'Adoption Pipeline', icon: HeartHandshake, badge: activeAppsCount },
    { id: 'chat', label: 'Live Chat', icon: MessageCircle, badge: unreadMessagesCount },
    { id: 'feed', label: 'PawFeed Social', icon: Camera },
    { id: 'my_dogs', label: 'My Dogs & Certificates', icon: DogIcon },
    { id: 'admin', label: 'Trust & Safety Admin', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-2">
      <div className="max-w-7xl mx-auto glass-nav rounded-3xl sm:rounded-full px-3 sm:px-6 py-2 flex items-center justify-between transition-all duration-300">
        
        {/* BRAND LOGO */}
        <div
          onClick={() => handleTabClick('discover')}
          className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-coral-600 via-coral-500 to-amber-400 flex items-center justify-center text-white shadow-glow-coral group-hover:scale-105 transition-all duration-300">
            <span className="text-lg sm:text-xl">🐾</span>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-xl sm:text-2xl font-black font-display tracking-tight text-obsidian-950">
                Paw<span className="text-coral-500">Connect</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-coral-500 animate-pulse hidden sm:block" />
            </div>
            <p className="hidden md:block text-[9px] font-bold text-obsidian-500 uppercase tracking-widest -mt-1">
              Verified Adoption & Social
            </p>
          </div>
        </div>

        {/* DESKTOP NAVIGATION PILLS */}
        <nav className="hidden lg:flex items-center gap-1 bg-obsidian-200/60 p-1.5 rounded-full border border-obsidian-300/60 shadow-inner">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleTabClick(link.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer relative ${
                  isActive
                    ? 'bg-white text-obsidian-950 shadow-sm'
                    : 'text-obsidian-600 hover:text-obsidian-900 hover:bg-white/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-coral-500' : ''}`} />
                <span>{link.label.split(' ')[0]}</span>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="px-1.5 py-0.2 text-[9px] font-black bg-coral-500 text-white rounded-full leading-tight">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* Post Dog Action Button */}
          <button
            onClick={() => {
              playPawPop();
              setIsListDogOpen(true);
            }}
            className="btn-primary text-white px-3 sm:px-4 py-2 rounded-full font-black text-xs flex items-center gap-1 cursor-pointer shadow-glow-coral shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Post Dog</span>
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute sound FX' : 'Enable sound FX'}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-white/90 border border-obsidian-300/80 text-obsidian-700 hover:text-coral-500 transition-all shadow-xs cursor-pointer"
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
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowPersonaMenu(false);
              }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-white/90 border border-obsidian-300/80 text-obsidian-700 hover:text-coral-500 transition-all relative shadow-xs cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-coral-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse ring-2 ring-white">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-3 w-72 sm:w-88 glass-dropdown rounded-3xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2.5 border-b border-obsidian-200">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-obsidian-900 flex items-center gap-1.5">
                    <span>🔔</span> Notifications
                  </h4>
                  <span className="text-[10px] font-bold text-coral-600 bg-coral-50 px-2 py-0.5 rounded-full">
                    {notifications.length}
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-obsidian-200/60 my-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="py-6 text-center text-xs text-obsidian-500">
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
                        className={`p-2.5 text-left hover:bg-coral-50/60 rounded-2xl transition-colors cursor-pointer ${
                          !notif.read ? 'bg-coral-50/70 font-semibold' : 'opacity-80'
                        }`}
                      >
                        <div className="text-xs font-bold text-obsidian-950">
                          {notif.title}
                        </div>
                        <p className="text-[11px] text-obsidian-600 mt-0.5 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Account / Persona Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowPersonaMenu(!showPersonaMenu);
                setShowNotifMenu(false);
              }}
              className="flex items-center gap-1.5 pl-1 pr-2 sm:pr-3 py-1 rounded-full bg-white/90 border border-obsidian-300 hover:border-coral-400 transition-all shadow-xs cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-coral-400"
              />
              <div className="hidden sm:block text-left">
                <div className="text-xs font-extrabold text-obsidian-950 leading-none truncate max-w-[90px]">
                  {currentUser.name}
                </div>
                <div className="text-[9px] font-bold text-coral-600 truncate mt-0.5">
                  {currentUser.phone}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-obsidian-500" />
            </button>

            {showPersonaMenu && (
              <div className="absolute right-0 mt-3 w-72 sm:w-80 glass-dropdown rounded-3xl p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-left">
                
                {/* Active User Card */}
                <div className="p-3 bg-coral-50/80 rounded-2xl border border-coral-200 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser.avatar}
                      alt=""
                      className="w-10 h-10 rounded-2xl object-cover ring-2 ring-coral-400 shadow-xs"
                    />
                    <div>
                      <div className="text-xs font-black text-obsidian-950 flex items-center gap-1">
                        {currentUser.name}
                        {currentUser.isVerified && <UserCheck className="w-3.5 h-3.5 text-emerald-600" />}
                      </div>
                      <div className="text-[11px] font-bold text-coral-700">{currentUser.phone}</div>
                      <div className="text-[10px] text-obsidian-500 capitalize">Role: {currentUser.role}</div>
                    </div>
                  </div>
                </div>

                {/* Login with New Mobile Number */}
                <button
                  onClick={() => {
                    setShowPersonaMenu(false);
                    playPawPop();
                    setIsAuthModalOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 p-2.5 rounded-2xl btn-primary text-white text-xs font-black shadow-glow-coral mb-3 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Log in with New Mobile Number 📲</span>
                </button>

                <div className="px-1 py-1 border-t border-obsidian-200">
                  <p className="text-[10px] font-black uppercase tracking-wider text-obsidian-400 mb-1.5">
                    Switch Test Account:
                  </p>
                  <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
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
                          className={`w-full flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-obsidian-900 text-white font-bold'
                              : 'hover:bg-obsidian-100 text-obsidian-800'
                          }`}
                        >
                          <div className="flex items-center gap-2 text-left">
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <div>
                              <div className="text-xs font-bold leading-tight truncate max-w-[150px]">{user.name}</div>
                              <div className={`text-[10px] ${isSelected ? 'text-white/70' : 'text-obsidian-500'}`}>
                                {user.phone}
                              </div>
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 text-coral-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Mobile Drawer Hamburger Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center bg-obsidian-100 border border-obsidian-300 text-obsidian-800 hover:text-coral-500 transition-colors cursor-pointer"
          >
            {showMobileMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

        </div>

      </div>

      {/* MOBILE SLIDE-DOWN DRAWER MENU */}
      {showMobileMenu && (
        <div className="lg:hidden mt-2 max-w-7xl mx-auto glass-dropdown rounded-3xl p-4 shadow-2xl border border-white space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleTabClick(link.id)}
                  className={`flex items-center gap-2 p-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-coral-500 text-white shadow-glow-coral'
                      : 'bg-obsidian-100 hover:bg-obsidian-200 text-obsidian-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <div className="truncate">
                    <div className="truncate">{link.label}</div>
                  </div>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className={`ml-auto px-1.5 py-0.2 text-[9px] font-black rounded-full ${
                      isActive ? 'bg-white text-coral-600' : 'bg-coral-500 text-white'
                    }`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
