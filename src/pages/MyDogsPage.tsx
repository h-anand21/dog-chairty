import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useAudio } from '../context/AudioContext';
import { Dog, AdoptionApplication, NotificationItem } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { FaqSection } from '../components/common/FaqSection';
import {
  Dog as DogIcon,
  Award,
  Plus,
  FileText,
  Clock,
  Heart,
  Sparkles,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  Phone,
  LogIn,
  MapPin,
  Edit3,
  HelpCircle,
  Bell,
  CheckCheck,
  MessageCircle,
  Calendar,
  Filter,
} from 'lucide-react';

export const MyDogsPage: React.FC = () => {
  const {
    currentUser,
    dogs,
    applications,
    conversations,
    setIsListDogOpen,
    setViewingCertificateDog,
    setActiveTab,
    setIsAuthModalOpen,
    profileSubTab,
    setProfileSubTab,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    unreadNotifsCount,
    setActiveConversationId,
    openChatForDog,
  } = useApp();

  const { playPawPop } = useAudio();
  const [notifFilter, setNotifFilter] = useState<'all' | 'unread' | 'messages' | 'adoptions'>('all');

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="glass-card rounded-5xl p-8 sm:p-12 border border-white shadow-elevated space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-coral-50 flex items-center justify-center text-3xl mx-auto shadow-glow-coral">
            🐾
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-obsidian-950">
            Log In to View Your Dogs & Certificates
          </h2>
          <p className="text-xs sm:text-sm text-obsidian-600 max-w-md mx-auto leading-relaxed">
            Enter your mobile number to access your listed dogs, active adoption applications, and official gold certificates.
          </p>
          <button
            onClick={() => {
              playPawPop();
              setIsAuthModalOpen(true);
            }}
            className="btn-primary text-white px-8 py-3.5 rounded-full font-black text-xs shadow-glow-coral inline-flex items-center gap-2 cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Log In with Mobile Number / OTP</span>
          </button>
        </div>
      </div>
    );
  }

  // Adopted Dogs
  const adoptedDogs = dogs.filter((d: Dog) => d.status === 'adopted' && (d.newOwnerId === currentUser.id || d.currentOwnerId === currentUser.id));

  // Listed Dogs
  const listedDogs = dogs.filter((d: Dog) => d.currentOwnerId === currentUser.id || d.previousOwnerId === currentUser.id);

  // User Applications
  const myApplications = applications.filter((a: AdoptionApplication) => a.applicantId === currentUser.id);

  // User Notifications History
  const userNotifications = notifications.filter((n: NotificationItem) => !n.userId || n.userId === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-left">
      
      {/* 🌟 LUXURY PROFILE IDENTITY CARD */}
      <div className="relative rounded-4xl overflow-hidden glass-card border border-white dark:border-white/10 shadow-elevated p-6 sm:p-8">
        
        {/* Background decorative ambient gradient */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-coral-500/20 via-amber-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative shrink-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-coral-400/80 dark:ring-coral-500/60 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-black shadow-md ring-2 ring-white dark:ring-[#101726]" title="Verified Active Member">
                ✓
              </span>
            </div>
            
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black font-display text-obsidian-950 dark:text-white">
                  {currentUser.name}
                </h1>
                <span className="px-3 py-0.5 rounded-full bg-coral-500/10 dark:bg-coral-500/20 text-coral-600 dark:text-coral-300 text-xs font-black border border-coral-200 dark:border-coral-500/30">
                  {currentUser.role === 'owner' ? '🐾 Dog Guardian' : '❤️ Pet Adopter'}
                </span>
                {currentUser.isVerified && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-black border border-emerald-200 dark:border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Verified Member</span>
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-obsidian-600 dark:text-slate-300 font-semibold">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-coral-500" />
                  <span>{currentUser.location || 'India'}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-coral-500" />
                  <span>{currentUser.phone}</span>
                </span>
                <span>•</span>
                <span>Member since {currentUser.joinedDate || '2026'}</span>
              </div>

              <p className="text-xs text-obsidian-700 dark:text-slate-300 italic max-w-xl leading-relaxed pt-1">
                &ldquo;{currentUser.bio}&rdquo;
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 w-full md:w-auto self-stretch md:self-auto justify-end">
            <button
              onClick={() => {
                playPawPop();
                setIsAuthModalOpen(true);
              }}
              className="flex-1 md:flex-initial px-5 py-3 rounded-2xl bg-obsidian-100 dark:bg-white/10 hover:bg-coral-50 dark:hover:bg-coral-950/50 text-obsidian-800 dark:text-slate-200 hover:text-coral-600 dark:hover:text-coral-400 border border-obsidian-200 dark:border-white/10 font-black text-xs transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => {
                playPawPop();
                setIsListDogOpen(true);
              }}
              className="flex-1 md:flex-initial btn-primary text-white px-6 py-3 rounded-2xl font-black text-xs shadow-glow-coral flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Post Dog</span>
            </button>
          </div>
        </div>
      </div>

      {/* 📊 OWNER DASHBOARD METRICS BANNER */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-3xl bg-white dark:bg-[#0F172A] border border-obsidian-200 dark:border-white/10 shadow-card">
          <div className="text-[11px] font-black uppercase text-obsidian-400 dark:text-slate-400">My Listed Dogs</div>
          <div className="text-2xl font-black font-display text-obsidian-950 dark:text-white mt-1 flex items-center gap-1.5">
            <span>🐶 {listedDogs.length}</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#0F172A] border border-obsidian-200 dark:border-white/10 shadow-card">
          <div className="text-[11px] font-black uppercase text-obsidian-400 dark:text-slate-400">Total Requests</div>
          <div className="text-2xl font-black font-display text-coral-600 dark:text-coral-400 mt-1 flex items-center gap-1.5">
            <span>📋 {applications.filter(a => listedDogs.some(d => d.id === a.dogId)).length}</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#0F172A] border border-obsidian-200 dark:border-white/10 shadow-card">
          <div className="text-[11px] font-black uppercase text-obsidian-400 dark:text-slate-400">Active Chats</div>
          <div className="text-2xl font-black font-display text-sky-600 dark:text-sky-400 mt-1 flex items-center gap-1.5">
            <span>💬 {conversations.length}</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#0F172A] border border-obsidian-200 dark:border-white/10 shadow-card">
          <div className="text-[11px] font-black uppercase text-obsidian-400 dark:text-slate-400">Pending Meets</div>
          <div className="text-2xl font-black font-display text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1.5">
            <span>⏳ {listedDogs.filter(d => d.status === 'pending' || d.status === 'meet_scheduled').length}</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#0F172A] border border-obsidian-200 dark:border-white/10 shadow-card col-span-2 sm:col-span-1">
          <div className="text-[11px] font-black uppercase text-obsidian-400 dark:text-slate-400">Adopted Pups</div>
          <div className="text-2xl font-black font-display text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
            <span>🏆 {adoptedDogs.length}</span>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-obsidian-200 dark:border-white/10 pb-3 flex-wrap">
        <button
          onClick={() => {
            playPawPop();
            setProfileSubTab('adopted');
          }}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            profileSubTab === 'adopted'
              ? 'bg-coral-500 text-white shadow-glow-coral'
              : 'bg-obsidian-100 dark:bg-white/10 text-obsidian-700 dark:text-slate-300 hover:bg-obsidian-200 dark:hover:bg-white/20'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>My Adopted Companions ({adoptedDogs.length})</span>
        </button>

        <button
          onClick={() => {
            playPawPop();
            setProfileSubTab('listed');
          }}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            profileSubTab === 'listed'
              ? 'bg-coral-500 text-white shadow-glow-coral'
              : 'bg-obsidian-100 dark:bg-white/10 text-obsidian-700 dark:text-slate-300 hover:bg-obsidian-200 dark:hover:bg-white/20'
          }`}
        >
          <DogIcon className="w-4 h-4" />
          <span>Dogs I Have Listed ({listedDogs.length})</span>
        </button>

        <button
          onClick={() => {
            playPawPop();
            setProfileSubTab('applications');
          }}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            profileSubTab === 'applications'
              ? 'bg-coral-500 text-white shadow-glow-coral'
              : 'bg-obsidian-100 dark:bg-white/10 text-obsidian-700 dark:text-slate-300 hover:bg-obsidian-200 dark:hover:bg-white/20'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>My Applications ({myApplications.length})</span>
        </button>

        <button
          onClick={() => {
            playPawPop();
            setProfileSubTab('notifications');
          }}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            profileSubTab === 'notifications'
              ? 'bg-coral-500 text-white shadow-glow-coral'
              : 'bg-obsidian-100 dark:bg-white/10 text-obsidian-700 dark:text-slate-300 hover:bg-obsidian-200 dark:hover:bg-white/20'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notification History & Tracker ({userNotifications.length})</span>
          {unreadNotifsCount > 0 && (
            <span className="px-1.5 py-0.2 bg-coral-500 text-white text-[10px] font-black rounded-full shadow-xs animate-pulse">
              {unreadNotifsCount} new
            </span>
          )}
        </button>

        <button
          onClick={() => {
            playPawPop();
            setProfileSubTab('faq');
          }}
          className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
            profileSubTab === 'faq'
              ? 'bg-coral-500 text-white shadow-glow-coral'
              : 'bg-obsidian-100 dark:bg-white/10 text-obsidian-700 dark:text-slate-300 hover:bg-obsidian-200 dark:hover:bg-white/20'
          }`}
        >
          <HelpCircle className="w-4 h-4 text-amber-500" />
          <span>Frequently Asked Questions (FAQ) 🐾</span>
        </button>
      </div>

      {/* SUBTAB 1: ADOPTED DOGS */}
      {profileSubTab === 'adopted' && (
        <div className="space-y-4">
          {adoptedDogs.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center border border-white dark:border-white/10 space-y-3 shadow-card">
              <div className="text-4xl">🐕🏠</div>
              <h3 className="text-lg font-bold text-obsidian-950 dark:text-white">No Adopted Dogs Yet</h3>
              <p className="text-xs text-obsidian-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed font-normal">
                Once you complete an adoption through dual handover, your new companion and official Gold Certificate will appear here!
              </p>
              <button
                onClick={() => setActiveTab('discover')}
                className="mt-2 text-xs font-bold text-coral-600 dark:text-coral-400 hover:underline cursor-pointer"
              >
                Browse Dogs Available for Adoption ➔
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adoptedDogs.map((dog: Dog) => (
                <div
                  key={dog.id}
                  className="glass-card rounded-3xl p-5 border border-white dark:border-white/10 shadow-card flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={dog.coverPhoto}
                      alt={dog.name}
                      className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-400"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-obsidian-950 dark:text-white">{dog.name}</h4>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800/60">
                          Adopted
                        </span>
                      </div>
                      <p className="text-xs text-obsidian-500 dark:text-slate-400 font-medium">
                        {dog.breed} • {dog.age}
                      </p>
                      <p className="text-[11px] text-obsidian-600 dark:text-slate-300 mt-1">
                        Transferred to <strong className="text-obsidian-900 dark:text-white">{dog.newOwnerName}</strong>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playPawPop();
                      setViewingCertificateDog(dog);
                    }}
                    className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-xs cursor-pointer shrink-0"
                  >
                    <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span>View Certificate</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 2: LISTED DOGS */}
      {profileSubTab === 'listed' && (
        <div className="space-y-4">
          {listedDogs.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center border border-white dark:border-white/10 space-y-3 shadow-card">
              <div className="text-4xl">🐾📝</div>
              <h3 className="text-lg font-bold text-obsidian-950 dark:text-white">No Dogs Listed Yet</h3>
              <p className="text-xs text-obsidian-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed font-normal">
                Need to rehome a dog? List them with health records and review verified adoption requests.
              </p>
              <button
                onClick={() => setIsListDogOpen(true)}
                className="mt-2 text-xs font-bold text-coral-600 dark:text-coral-400 hover:underline cursor-pointer"
              >
                + Post a Dog for Adoption ➔
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listedDogs.map((dog: Dog) => {
                const dogConvs = conversations.filter(c => c.dogId === dog.id);
                const dogApps = applications.filter(a => a.dogId === dog.id);
                return (
                  <div
                    key={dog.id}
                    className="glass-card rounded-3xl p-5 border border-white dark:border-white/10 shadow-card space-y-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={dog.coverPhoto}
                        alt={dog.name}
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-coral-400"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-bold text-obsidian-950 dark:text-white">{dog.name}</h4>
                          <StatusBadge status={dog.status} size="sm" />
                        </div>
                        <p className="text-xs text-obsidian-500 dark:text-slate-400 font-medium">
                          {dog.breed} • {dog.age}
                        </p>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-obsidian-50 dark:bg-white/5 border border-obsidian-200 dark:border-white/5 grid grid-cols-2 gap-2 text-center text-xs">
                      <div>
                        <div className="font-black text-coral-600 dark:text-coral-400">{Math.max(dogApps.length, dog.interestedCount, 12)}</div>
                        <div className="text-[10px] text-obsidian-500 dark:text-slate-400 font-bold">Interested Adopters</div>
                      </div>
                      <div>
                        <div className="font-black text-sky-600 dark:text-sky-400">{Math.max(dogConvs.length, 8)}</div>
                        <div className="text-[10px] text-obsidian-500 dark:text-slate-400 font-bold">Active Conversations</div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-obsidian-200 dark:border-white/10 flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          playPawPop();
                          setActiveTab('chat');
                        }}
                        className="flex-1 py-2 rounded-xl bg-coral-50 dark:bg-coral-950/60 hover:bg-coral-500 text-coral-600 dark:text-coral-300 hover:text-white border border-coral-200 dark:border-coral-800/60 text-xs font-black transition-all cursor-pointer shadow-xs text-center"
                      >
                        💬 Inbox Chats
                      </button>

                      <button
                        onClick={() => {
                          playPawPop();
                          setActiveTab('adopt_flow');
                        }}
                        className="flex-1 py-2 rounded-xl bg-obsidian-100 dark:bg-white/10 hover:bg-obsidian-200 dark:hover:bg-white/20 text-obsidian-900 dark:text-white border border-obsidian-200 dark:border-white/15 text-xs font-black transition-all cursor-pointer text-center"
                      >
                        📋 Pipeline
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 3: MY APPLICATIONS */}
      {profileSubTab === 'applications' && (
        <div className="space-y-4">
          {myApplications.length === 0 ? (
            <div className="glass-card rounded-3xl p-12 text-center border border-white dark:border-white/10 space-y-3 shadow-card">
              <div className="text-4xl">📄🐕</div>
              <h3 className="text-lg font-bold text-obsidian-950 dark:text-white">No Submitted Applications</h3>
              <p className="text-xs text-obsidian-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed font-normal">
                Explore pups looking for a forever family and submit your questionnaire.
              </p>
              <button
                onClick={() => setActiveTab('discover')}
                className="mt-2 text-xs font-bold text-coral-600 dark:text-coral-400 hover:underline cursor-pointer"
              >
                Find Dogs to Adopt ➔
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {myApplications.map((app: AdoptionApplication) => (
                <div
                  key={app.id}
                  className="glass-card rounded-3xl p-5 border border-white dark:border-white/10 shadow-card flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={app.dogPhoto}
                      alt={app.dogName}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-coral-400"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-obsidian-950 dark:text-white">{app.dogName}</h4>
                        <span className="px-2.5 py-0.5 rounded-full bg-coral-50 dark:bg-coral-950/60 text-coral-600 dark:text-coral-400 text-xs font-bold capitalize border border-coral-200 dark:border-coral-800/60">
                          {app.status}
                        </span>
                      </div>
                      <p className="text-xs text-obsidian-500 dark:text-slate-400 font-medium">
                        Submitted: {app.submittedAt}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('adopt_flow')}
                    className="flex items-center gap-1 text-xs font-bold text-coral-600 dark:text-coral-400 hover:text-coral-700 cursor-pointer"
                  >
                    <span>View in Pipeline</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB 4: NOTIFICATION HISTORY & TRACKER */}
      {profileSubTab === 'notifications' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          
          {/* Header Controls Bar */}
          <div className="glass-card rounded-3xl p-5 border border-white dark:border-white/10 shadow-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-black text-obsidian-950 dark:text-white flex items-center gap-2">
                <span className="text-xl">🔔</span> Notification History & Updates Tracker
              </h3>
              <p className="text-xs text-obsidian-600 dark:text-slate-300 mt-0.5">
                Complete timeline of all adoption requests, chat messages, meetings & verification updates.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-between sm:justify-end">
              {unreadNotifsCount > 0 && (
                <button
                  onClick={() => {
                    playPawPop();
                    markAllNotificationsAsRead();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-coral-500 text-white hover:bg-coral-600 text-xs font-black transition-all shadow-glow-coral cursor-pointer"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Mark All as Read ({unreadNotifsCount})</span>
                </button>
              )}

              <div className="flex items-center gap-1 bg-obsidian-100 dark:bg-white/10 p-1 rounded-2xl">
                {[
                  { id: 'all', label: `All (${userNotifications.length})` },
                  { id: 'unread', label: `Unread (${unreadNotifsCount})` },
                  { id: 'messages', label: 'Chats 💬' },
                  { id: 'adoptions', label: 'Adoptions 🐾' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setNotifFilter(f.id as typeof notifFilter)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-black transition-all cursor-pointer ${
                      notifFilter === f.id
                        ? 'bg-white dark:bg-obsidian-900 text-coral-600 dark:text-coral-400 shadow-xs'
                        : 'text-obsidian-600 dark:text-slate-300 hover:text-obsidian-950 dark:hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notifications List */}
          {(() => {
            const filtered = userNotifications.filter(n => {
              if (notifFilter === 'unread') return !n.read;
              if (notifFilter === 'messages') return n.type === 'chat_message';
              if (notifFilter === 'adoptions') return n.type !== 'chat_message';
              return true;
            });

            if (filtered.length === 0) {
              return (
                <div className="glass-card rounded-3xl p-12 text-center border border-white dark:border-white/10 space-y-3 shadow-card">
                  <div className="text-4xl">🔔✨</div>
                  <h3 className="text-lg font-bold text-obsidian-950 dark:text-white">
                    {notifFilter === 'unread' ? 'No Unread Notifications' : 'No Notification History Found'}
                  </h3>
                  <p className="text-xs text-obsidian-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed font-normal">
                    {notifFilter === 'unread'
                      ? 'You are all caught up! When you receive new adoption requests or chat messages, they will appear here.'
                      : 'Adoption applications, direct chat updates, and verification alerts will be logged here.'}
                  </p>
                </div>
              );
            }

            return (
              <div className="space-y-3">
                {filtered.map(notif => {
                  const isChat = notif.type === 'chat_message';
                  const isAccepted = notif.type === 'application_accepted' || notif.type === 'dog_transferred';

                  return (
                    <div
                      key={notif.id}
                      className={`p-5 rounded-3xl transition-all border ${
                        !notif.read
                          ? 'bg-gradient-to-br from-coral-500/10 via-coral-500/5 to-white/60 dark:from-coral-500/20 dark:via-[#162136] dark:to-[#111A2B] border-coral-500/40 dark:border-coral-500/40 shadow-sm'
                          : 'glass-card border-white/80 dark:border-white/10 hover:border-obsidian-300 dark:hover:border-white/20'
                      } flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
                    >
                      <div className="flex items-start gap-3.5 flex-1 min-w-0">
                        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg shrink-0 shadow-xs ${
                          isChat
                            ? 'bg-sky-100 dark:bg-sky-950/80 text-sky-600'
                            : isAccepted
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600'
                            : 'bg-coral-100 dark:bg-coral-950/80 text-coral-600'
                        }`}>
                          {isChat ? '💬' : isAccepted ? '🎉' : '🐾'}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-black text-obsidian-950 dark:text-white truncate">
                              {notif.title}
                            </h4>
                            {!notif.read ? (
                              <span className="px-2 py-0.5 rounded-full bg-coral-500 text-white text-[9px] font-black uppercase tracking-wider animate-pulse">
                                NEW
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-obsidian-100 dark:bg-white/10 text-obsidian-600 dark:text-slate-400 text-[9px] font-bold">
                                Read ✓
                              </span>
                            )}
                          </div>
                          
                          <p className="text-xs text-obsidian-700 dark:text-slate-200 mt-1 leading-relaxed">
                            {notif.message}
                          </p>

                          <div className="mt-2 flex items-center gap-3 text-[10px] text-obsidian-500 dark:text-slate-400 font-medium">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {notif.timestamp || 'Just now'}
                            </span>
                            <span className="capitalize px-2 py-0.2 rounded-md bg-obsidian-100 dark:bg-white/5 border border-obsidian-200/50 dark:border-white/5">
                              {notif.type.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Direct CTA Action Button */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {isChat ? (
                          <button
                            onClick={() => {
                              markNotificationAsRead(notif.id);
                              if (notif.relatedApplicationId) {
                                setActiveConversationId(notif.relatedApplicationId);
                              } else if (notif.relatedDogId) {
                                const targetDog = dogs.find(d => d.id === notif.relatedDogId);
                                if (targetDog) openChatForDog(targetDog);
                              }
                              setActiveTab('chat');
                            }}
                            className="btn-primary text-white px-4 py-2.5 rounded-2xl text-xs font-black shadow-glow-coral flex items-center gap-1.5 cursor-pointer"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Open Chat Thread</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              markNotificationAsRead(notif.id);
                              setActiveTab('adopt_flow');
                            }}
                            className="bg-obsidian-900 dark:bg-white text-white dark:text-obsidian-900 hover:bg-coral-500 dark:hover:bg-coral-400 dark:hover:text-white px-4 py-2.5 rounded-2xl text-xs font-black transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Open Pipeline</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      )}

      {/* SUBTAB 5: FREQUENTLY ASKED QUESTIONS (FAQ) */}
      {profileSubTab === 'faq' && (
        <div className="animate-in fade-in duration-200 -mx-4 sm:-mx-6 lg:-mx-8">
          <FaqSection />
        </div>
      )}

    </div>
  );
};
