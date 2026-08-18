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
  Sparkles,
  Award,
  LogOut,
  LogIn,
  Sun,
  Moon,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    allUsers,
    switchUser,
    logout,
    activeTab,
    setActiveTab,
    setIsListDogOpen,
    notifications,
    unreadNotifsCount,
    markNotificationAsRead,
    conversations,
    applications,
    setIsAuthModalOpen,
    requireAuth,
    theme,
    toggleTheme,
  } = useApp();

  const { soundEnabled, toggleSound, playPawPop } = useAudio();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);

  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  const activeAppsCount = applications.filter(
    a => (a.applicantId === currentUser?.id || currentUser?.role === 'owner') &&
      a.status !== 'completed' &&
      a.status !== 'declined'
  ).length;

  const handleTabClick = (tab: typeof activeTab) => {
    playPawPop();
    setShowMobileDrawer(false);

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

    if (tab === 'my_dogs') {
      requireAuth('Please log in to manage your dogs, applications, and certificates.', () => {
        setActiveTab('my_dogs');
      });
      return;
    }

    setActiveTab(tab);
  };

  const handlePostDog = () => {
    playPawPop();
    requireAuth('Please verify your mobile number to post a dog for adoption.', () => {
      setIsListDogOpen(true);
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-2">
      <div className="max-w-7xl mx-auto glass-nav rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all duration-300">
        
        {/* BRAND LOGO */}
        <div
          onClick={() => handleTabClick('discover')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-coral-600 via-coral-500 to-amber-400 flex items-center justify-center text-white shadow-glow-coral group-hover:scale-105 transition-all duration-300">
            <span className="text-xl">🐾</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black font-display tracking-tight text-obsidian-950">
                Paw<span className="text-coral-500">Connect</span>
              </span>
              <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full bg-coral-50 text-[10px] font-black text-coral-600 border border-coral-200">
                Verified Adoption
              </span>
            </div>
            <p className="hidden md:block text-[10px] font-semibold text-obsidian-500 -mt-0.5">
              Direct Dog Friendship & Adoption
            </p>
          </div>
        </div>

        {/* CENTER PRIMARY NAVIGATION (Clean, spacious, full words) */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-obsidian-100/90 dark:bg-white/10 p-1.5 rounded-full border border-obsidian-200 dark:border-white/10 shadow-inner">
          
          {/* Discover Dogs */}
          <button
            onClick={() => handleTabClick('discover')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold transition-all duration-200 cursor-pointer ${
              activeTab === 'discover'
                ? 'bg-white dark:bg-white/20 text-obsidian-950 dark:text-white shadow-sm'
                : 'text-obsidian-600 dark:text-slate-300 hover:text-obsidian-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10'
            }`}
          >
            <Compass className={`w-4 h-4 ${activeTab === 'discover' ? 'text-coral-500' : ''}`} />
            <span>Adopt Dogs</span>
          </button>

          {/* Adoption Pipeline */}
          <button
            onClick={() => handleTabClick('adopt_flow')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold transition-all duration-200 relative cursor-pointer ${
              activeTab === 'adopt_flow'
                ? 'bg-white dark:bg-white/20 text-obsidian-950 dark:text-white shadow-sm'
                : 'text-obsidian-600 dark:text-slate-300 hover:text-obsidian-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10'
            }`}
          >
            <HeartHandshake className={`w-4 h-4 ${activeTab === 'adopt_flow' ? 'text-coral-500' : ''}`} />
            <span>Adoption Pipeline</span>
            {activeAppsCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-black bg-coral-500 text-white rounded-full leading-tight animate-pulse">
                {activeAppsCount}
              </span>
            )}
          </button>

          {/* Live Chat */}
          <button
            onClick={() => handleTabClick('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold transition-all duration-200 relative cursor-pointer ${
              activeTab === 'chat'
                ? 'bg-white dark:bg-white/20 text-obsidian-950 dark:text-white shadow-sm'
                : 'text-obsidian-600 dark:text-slate-300 hover:text-obsidian-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10'
            }`}
          >
            <MessageCircle className={`w-4 h-4 ${activeTab === 'chat' ? 'text-coral-500' : ''}`} />
            <span>Messages</span>
            {unreadMessagesCount > 0 && (
              <span className="px-1.5 py-0.2 text-[10px] font-black bg-coral-500 text-white rounded-full leading-tight">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          {/* PawFeed */}
          <button
            onClick={() => handleTabClick('feed')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-extrabold transition-all duration-200 cursor-pointer ${
              activeTab === 'feed'
                ? 'bg-white dark:bg-white/20 text-obsidian-950 dark:text-white shadow-sm'
                : 'text-obsidian-600 dark:text-slate-300 hover:text-obsidian-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/10'
            }`}
          >
            <Camera className={`w-4 h-4 ${activeTab === 'feed' ? 'text-coral-500' : ''}`} />
            <span>PawFeed</span>
          </button>

        </nav>

        {/* RIGHT ACTION CONTROLS */}
        <div className="flex items-center gap-2">
          
          {/* Post Dog CTA Button */}
          <button
            onClick={handlePostDog}
            className="btn-primary text-white px-4 sm:px-5 py-2 rounded-full font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-glow-coral shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Post Dog for Adoption</span>
            <span className="sm:hidden">Post Dog</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowProfileMenu(false);
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/90 dark:bg-obsidian-900 border border-obsidian-200 dark:border-white/10 text-obsidian-700 dark:text-obsidian-200 hover:text-coral-500 transition-all shadow-xs cursor-pointer"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-coral-500 text-white text-[9px] font-black flex items-center justify-center animate-pulse ring-2 ring-white dark:ring-obsidian-900">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-dropdown rounded-3xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2.5 border-b border-obsidian-200">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-obsidian-900 flex items-center gap-1.5">
                    <span>🔔</span> Notifications & Updates
                  </h4>
                  <span className="text-[10px] font-bold text-coral-600 bg-coral-50 px-2 py-0.5 rounded-full">
                    {notifications.length}
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-obsidian-200/60 my-2 pr-1">
                  {notifications.length === 0 ? (
                    <p className="py-6 text-center text-xs text-obsidian-500 font-medium">
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
                        <p className="text-[11px] text-obsidian-600 mt-0.5 leading-relaxed font-normal">
                          {notif.message}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button (Light / Dark Mode) */}
          <button
            onClick={() => {
              playPawPop();
              toggleTheme();
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/90 dark:bg-obsidian-900 border border-obsidian-200 dark:border-white/10 text-obsidian-700 dark:text-amber-300 hover:text-coral-500 transition-all shadow-xs cursor-pointer hover:scale-105"
            title={theme === 'dark' ? 'Switch to Light Mode ☀️' : 'Switch to Dark Mode 🌙'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-obsidian-700 animate-in spin-in-180 duration-300" />
            )}
          </button>

          {/* User Account / Login Button */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => {
                  setShowProfileMenu(!showProfileMenu);
                  setShowNotifMenu(false);
                }}
                className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-white/90 dark:bg-[#121A2B] border border-obsidian-200 dark:border-white/15 hover:border-coral-400 dark:hover:border-coral-500 transition-all shadow-xs cursor-pointer"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-coral-400 dark:ring-coral-500 shadow-xs"
                />
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-extrabold text-obsidian-950 dark:text-white leading-none truncate max-w-[110px] flex items-center gap-1">
                    {currentUser.name.split(' ')[0]}
                    {currentUser.isVerified && <UserCheck className="w-3 h-3 text-emerald-500" />}
                  </div>
                  <div className="text-[9px] font-bold text-coral-600 dark:text-coral-400 capitalize truncate mt-0.5">
                    {currentUser.phone}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-obsidian-500 dark:text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180 text-coral-500' : ''}`} />
              </button>

              {/* Profile Dropdown Drawer */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-84 glass-dropdown rounded-3xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 text-left space-y-3 shadow-2xl border border-white/80 dark:border-white/15">
                  
                  {/* Active User Card Header */}
                  <div className="p-4 bg-gradient-to-br from-coral-50/90 via-amber-50/40 to-white dark:from-[#172238] dark:via-[#131B2C] dark:to-[#101726] rounded-2xl border border-coral-200/80 dark:border-coral-500/30 shadow-xs">
                    <div className="flex items-center gap-3.5">
                      <div className="relative shrink-0">
                        <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-coral-400 dark:ring-coral-500 shadow-md bg-obsidian-200">
                          <img
                            src={currentUser.avatar}
                            alt={currentUser.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-black ring-2 ring-white dark:ring-[#101726]" title="Verified Active Account">
                          ✓
                        </span>
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-black text-obsidian-950 dark:text-white truncate flex items-center gap-1.5">
                          <span>{currentUser.name}</span>
                          {currentUser.isVerified && <UserCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                        </div>
                        
                        <div className="text-xs font-bold text-coral-600 dark:text-coral-400 truncate mt-0.5 flex items-center gap-1">
                          <Phone className="w-3 h-3 shrink-0" />
                          <span>{currentUser.phone}</span>
                        </div>
                        
                        <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full bg-coral-500/10 dark:bg-coral-500/20 text-coral-600 dark:text-coral-300 text-[10px] font-black border border-coral-200 dark:border-coral-500/30 capitalize">
                            {currentUser.role === 'owner' ? '🐾 Dog Guardian' : '❤️ Pet Adopter'}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-[10px] font-black border border-emerald-200 dark:border-emerald-500/30">
                            🇮🇳 Verified
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        playPawPop();
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-coral-500/15 dark:bg-coral-500/20 hover:bg-coral-500/25 dark:hover:bg-coral-500/30 text-coral-600 dark:text-coral-300 border border-coral-400/30 dark:border-coral-500/40 text-xs font-black transition-all cursor-pointer text-left shadow-xs"
                    >
                      <UserCheck className="w-4 h-4 text-coral-500 shrink-0" />
                      <span>Edit Profile & Change Photo ✏️</span>
                    </button>

                    <button
                      onClick={() => {
                        handleTabClick('my_dogs');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-obsidian-100 dark:hover:bg-white/10 text-obsidian-900 dark:text-white text-xs font-extrabold transition-colors cursor-pointer text-left"
                    >
                      <DogIcon className="w-4 h-4 text-coral-500 shrink-0" />
                      <span>My Dogs & Certificates</span>
                    </button>

                    <button
                      onClick={() => {
                        handleTabClick('admin');
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-obsidian-100 dark:hover:bg-white/10 text-obsidian-900 dark:text-white text-xs font-extrabold transition-colors cursor-pointer text-left"
                    >
                      <ShieldCheck className="w-4 h-4 text-sky-500 shrink-0" />
                      <span>Trust & Safety Center</span>
                    </button>

                    <button
                      onClick={toggleSound}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-obsidian-100 dark:hover:bg-white/10 text-obsidian-900 dark:text-white text-xs font-extrabold transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        {soundEnabled ? (
                          <Volume2 className="w-4 h-4 text-coral-500 shrink-0" />
                        ) : (
                          <VolumeX className="w-4 h-4 text-obsidian-400 shrink-0" />
                        )}
                        <span>Sound Effects</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-obsidian-200 dark:bg-white/10 text-obsidian-800 dark:text-slate-200">
                        {soundEnabled ? 'ON' : 'OFF'}
                      </span>
                    </button>

                    <button
                      onClick={toggleTheme}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-obsidian-100 dark:hover:bg-white/10 text-obsidian-900 dark:text-white text-xs font-extrabold transition-colors cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-2.5">
                        {theme === 'dark' ? (
                          <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : (
                          <Moon className="w-4 h-4 text-obsidian-600 shrink-0" />
                        )}
                        <span>Theme Mode</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-obsidian-200 dark:bg-white/10 text-obsidian-800 dark:text-slate-200">
                        {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
                      </span>
                    </button>
                  </div>

                  {/* Switch to Another Mobile Number */}
                  <div className="pt-2 border-t border-obsidian-200 dark:border-white/10 space-y-2">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        playPawPop();
                        setIsAuthModalOpen(true);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-obsidian-100 dark:bg-white/5 hover:bg-coral-500/15 dark:hover:bg-coral-500/20 text-obsidian-800 dark:text-slate-200 hover:text-coral-600 dark:hover:text-coral-300 text-xs font-black border border-obsidian-200 dark:border-white/10 transition-all cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Log In with Another Phone Number</span>
                    </button>

                    {/* Real Logout */}
                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                        playPawPop();
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 dark:hover:bg-rose-500/20 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out of Session</span>
                    </button>
                  </div>

                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => {
                playPawPop();
                setIsAuthModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white dark:bg-obsidian-900 border border-coral-400 hover:bg-coral-50 text-coral-600 font-black text-xs transition-all shadow-xs cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Log In with OTP</span>
            </button>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setShowMobileDrawer(!showMobileDrawer)}
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center bg-obsidian-100 dark:bg-obsidian-900 border border-obsidian-200 dark:border-white/10 text-obsidian-800 dark:text-obsidian-200 hover:text-coral-500 transition-colors cursor-pointer"
          >
            {showMobileDrawer ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* MOBILE FULL DRAWER MENU */}
      {showMobileDrawer && (
        <div className="lg:hidden mt-2 max-w-7xl mx-auto glass-dropdown rounded-3xl p-4 shadow-2xl border border-white dark:border-white/10 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          
          {/* Mobile Theme & Sound Row */}
          <div className="flex items-center justify-between p-2.5 bg-obsidian-50 dark:bg-white/5 rounded-2xl border border-obsidian-200/60 dark:border-white/10">
            <button
              onClick={() => {
                playPawPop();
                toggleTheme();
              }}
              className="flex items-center gap-2 text-xs font-black text-obsidian-900 dark:text-obsidian-100 cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-obsidian-700" />}
              <span>{theme === 'dark' ? 'Dark Mode (Active)' : 'Light Mode (Active)'}</span>
            </button>

            <button
              onClick={toggleSound}
              className="p-1.5 rounded-xl bg-obsidian-200 dark:bg-white/10 text-xs font-bold text-obsidian-800 dark:text-obsidian-200 flex items-center gap-1 cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-coral-500" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span>{soundEnabled ? 'Sound ON' : 'Sound OFF'}</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'discover', label: 'Adopt Dogs', icon: Compass },
              { id: 'adopt_flow', label: 'Adoption Pipeline', icon: HeartHandshake, badge: activeAppsCount },
              { id: 'chat', label: 'Live Messages', icon: MessageCircle, badge: unreadMessagesCount },
              { id: 'feed', label: 'PawFeed Social', icon: Camera },
              { id: 'my_dogs', label: 'My Dogs & Certs', icon: DogIcon },
              { id: 'admin', label: 'Safety Admin', icon: ShieldCheck },
            ].map(link => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleTabClick(link.id as typeof activeTab)}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl text-xs font-black transition-all text-left cursor-pointer ${
                    isActive
                      ? 'bg-coral-500 text-white shadow-glow-coral'
                      : 'bg-obsidian-100 dark:bg-white/5 hover:bg-obsidian-200 dark:hover:bg-white/10 text-obsidian-800 dark:text-obsidian-200'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{link.label}</span>
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

          {!currentUser && (
            <div className="pt-2 border-t border-obsidian-200">
              <button
                onClick={() => {
                  setShowMobileDrawer(false);
                  playPawPop();
                  setIsAuthModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl btn-primary text-white text-xs font-black shadow-glow-coral cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                <span>Log In with Mobile Number / OTP</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
