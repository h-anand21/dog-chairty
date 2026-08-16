import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { MeetAndGreetModal } from '../adoption/MeetAndGreetModal';
import {
  Send,
  Image as ImageIcon,
  Volume2,
  Calendar,
  ShieldCheck,
  CheckCheck,
  Sparkles,
  MapPin,
  Clock,
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const {
    currentUser,
    conversations,
    messages,
    activeConversationId,
    sendMessage,
    meetups,
    acceptMeetup,
    applications,
    dogs,
    setSelectedDog,
    setIsApplyModalOpen,
  } = useApp();

  const { playDogBark, playPawPop } = useAudio();

  const [inputMessage, setInputMessage] = useState('');
  const [isMeetModalOpen, setIsMeetModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConversationId) || conversations[0];
  const activeMessages = activeConv ? messages[activeConv.id] || [] : [];
  
  const targetDog = dogs.find(d => d.id === activeConv?.dogId);
  const relatedApp = applications.find(a => a.dogId === activeConv?.dogId);
  const activeMeet = meetups.find(m => m.dogId === activeConv?.dogId && m.status === 'scheduled');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeMessages.length, activeConversationId]);

  if (!activeConv) {
    return (
      <div className="glass-card rounded-4xl p-16 text-center border border-white shadow-card h-[680px] flex flex-col items-center justify-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-coral-50 flex items-center justify-center text-4xl shadow-glow-coral">
          🔒
        </div>
        <h3 className="text-2xl font-black font-display text-obsidian-950">No Active Chat Unlocked</h3>
        <p className="text-xs text-obsidian-600 max-w-sm leading-relaxed font-medium">
          Select any pup from the sidebar or click &ldquo;Message Guardian&rdquo; on any dog to start chatting!
        </p>
      </div>
    );
  }

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    playPawPop();
    sendMessage(activeConv.id, inputMessage.trim());
    setInputMessage('');
  };

  const handleSendDogBark = () => {
    playDogBark();
    sendMessage(activeConv.id, `🐾 *Woof Woof!* (${activeConv.dogName} says hi!)`, undefined, true);
  };

  const handleSendSamplePhoto = () => {
    playPawPop();
    const photos = [
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80'
    ];
    const randomPhoto = targetDog?.coverPhoto || photos[Math.floor(Math.random() * photos.length)];
    sendMessage(activeConv.id, `Here is a recent photo of ${activeConv.dogName}!`, randomPhoto);
  };

  const handleDirectAdopt = () => {
    if (targetDog) {
      playPawPop();
      setSelectedDog(targetDog);
      setIsApplyModalOpen(true);
    }
  };

  const quickPrompts = [
    `🎾 Ask about ${activeConv.dogName}'s routine`,
    '📍 Is a weekend park meet convenient?',
    '🍖 What are the favorite treats & food brand?',
    '💉 Can you confirm latest vaccination booklet?'
  ];

  return (
    <div className="glass-card rounded-4xl border border-white dark:border-white/10 shadow-elevated flex flex-col h-[700px] overflow-hidden">
      
      {/* CHAT HEADER WITH SPECIFIC DOG CONTEXT */}
      <div className="p-4 sm:px-6 bg-white/95 dark:bg-[#0F172A]/95 border-b border-obsidian-200 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 backdrop-blur-md">
        <div className="flex items-center gap-3 text-left">
          <div className="relative shrink-0">
            <img
              src={activeConv.dogAvatar}
              alt={activeConv.dogName}
              className="w-13 h-13 rounded-2xl object-cover ring-2 ring-coral-400 shadow-sm"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-obsidian-900 rounded-full ring-1 ring-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-black text-obsidian-950 dark:text-white leading-tight">
                {activeConv.dogName}&apos;s Dedicated Adoption Chat
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-black border border-emerald-200 dark:border-emerald-800/60">
                🟢 Direct Thread
              </span>
            </div>
            <p className="text-[11px] text-obsidian-500 dark:text-slate-400 font-medium mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span>{targetDog ? `${targetDog.breed} • ${targetDog.age} • 📍 ${targetDog.location}` : 'Verified Companion'}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓ 100% Medical Clear</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          {targetDog && (
            <button
              onClick={handleDirectAdopt}
              className="btn-primary text-white px-3.5 py-2 rounded-full text-xs font-black shadow-glow-coral flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>🐾 Adopt {activeConv.dogName}</span>
            </button>
          )}

          <button
            onClick={() => {
              playPawPop();
              setIsMeetModalOpen(true);
            }}
            className="flex items-center gap-1.5 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-500 text-sky-700 dark:text-sky-300 hover:text-white border border-sky-200 dark:border-sky-800/60 hover:border-sky-500 px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Park Meetup</span>
            <span className="sm:hidden">Meet</span>
          </button>
        </div>
      </div>

      {/* SAFETY & DOG DETAIL STRIP */}
      <div className="bg-amber-50/90 dark:bg-amber-950/40 px-4 py-2 border-b border-amber-200 dark:border-amber-800/60 text-left flex items-center justify-between gap-2 text-xs text-amber-900 dark:text-amber-200 shrink-0 font-medium">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Verified Direct Thread for {activeConv.dogName}:</strong> Coordinate daily routine & schedule park meets safely.
          </span>
        </div>

        <button
          onClick={handleSendDogBark}
          className="text-[11px] font-black text-coral-700 dark:text-coral-300 hover:text-coral-900 flex items-center gap-1 bg-coral-100/80 dark:bg-coral-950/60 px-2 py-0.5 rounded-full cursor-pointer hover:bg-coral-200 transition-colors border border-coral-200 dark:border-coral-800/60"
        >
          <Volume2 className="w-3 h-3" />
          <span>Hear {activeConv.dogName} Bark 🔊</span>
        </button>
      </div>

      {/* MESSAGES FEED */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF9F6] dark:bg-[#090E1A] text-left">
        
        {/* Active Meet & Greet Status Card */}
        {activeMeet && (
          <div className="max-w-md mx-auto bg-gradient-to-r from-sky-50 to-sky-100/90 dark:from-sky-950/60 dark:to-sky-900/60 rounded-3xl p-5 border border-sky-200 dark:border-sky-800/60 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-sky-900 dark:text-sky-200 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Upcoming Meet & Greet</span>
              </span>
              <span className="text-[10px] font-black bg-sky-200 dark:bg-sky-800 text-sky-900 dark:text-sky-100 px-2.5 py-0.5 rounded-full">
                Scheduled
              </span>
            </div>
            
            <div className="space-y-1 text-xs text-obsidian-800 dark:text-slate-300">
              <div className="flex items-center gap-2 font-black text-obsidian-950 dark:text-white text-sm">
                <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>{activeMeet.date} • {activeMeet.time}</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <MapPin className="w-3.5 h-3.5 text-coral-500" />
                <span>{activeMeet.locationName}</span>
              </div>
              {activeMeet.notes && (
                <p className="text-[11px] text-obsidian-600 dark:text-slate-400 italic pt-1">
                  &ldquo;{activeMeet.notes}&rdquo;
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  playPawPop();
                  acceptMeetup(activeMeet.id);
                }}
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs shadow-xs transition-all text-center cursor-pointer"
              >
                ✓ Mark Meet & Greet Completed
              </button>
            </div>
          </div>
        )}

        {/* Message Bubbles */}
        {activeMessages.map(msg => {
          const isMine = msg.senderId === currentUser?.id;
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${isMine ? 'justify-end' : 'justify-start'}`}
            >
              {!isMine && (
                <img
                  src={msg.senderAvatar}
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-coral-300 shrink-0 mb-1"
                />
              )}

              <div
                className={`max-w-xs sm:max-w-md rounded-3xl p-4 shadow-card text-left ${
                  isMine
                    ? 'bg-gradient-to-tr from-coral-600 to-coral-500 text-white rounded-br-xs shadow-glow-coral'
                    : 'bg-white dark:bg-[#152033] text-obsidian-900 dark:text-white border border-obsidian-200 dark:border-white/10 rounded-bl-xs'
                }`}
              >
                {!isMine && (
                  <div className="text-[10px] font-black text-obsidian-400 dark:text-slate-400 mb-1 uppercase tracking-wider">
                    {msg.senderName}
                  </div>
                )}

                {msg.isDogBark ? (
                  <div className={`flex items-center gap-2 py-1 px-3 rounded-full font-black text-xs ${
                    isMine ? 'bg-white/20 text-white' : 'bg-coral-50 dark:bg-coral-950/60 text-coral-700 dark:text-coral-300'
                  }`}>
                    <Volume2 className="w-4 h-4 animate-bounce" />
                    <span>🐾 Playful Dog Bark (0:03)</span>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm leading-relaxed font-medium">{msg.text}</p>
                )}

                {msg.image && (
                  <div className="mt-2.5 rounded-2xl overflow-hidden max-h-56 shadow-sm">
                    <img src={msg.image} alt="Attachment" className="w-full h-full object-cover" />
                  </div>
                )}

                <div
                  className={`flex items-center justify-end gap-1 mt-1.5 text-[10px] font-semibold ${
                    isMine ? 'text-white/80' : 'text-obsidian-400 dark:text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {isMine && <CheckCheck className="w-3.5 h-3.5" />}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* QUICK SUGGESTIONS */}
      <div className="px-4 py-2 bg-white dark:bg-[#0F172A] border-t border-obsidian-200 dark:border-white/10 flex items-center gap-2 overflow-x-auto shrink-0">
        <span className="text-[10px] font-black uppercase tracking-wider text-obsidian-400 dark:text-slate-400 shrink-0">
          Quick Prompts:
        </span>
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => {
              playPawPop();
              sendMessage(activeConv.id, p);
            }}
            className="text-xs font-bold px-3.5 py-1 rounded-full bg-obsidian-100 dark:bg-white/5 hover:bg-coral-50 dark:hover:bg-coral-950/50 text-obsidian-700 dark:text-slate-300 hover:text-coral-600 border border-obsidian-200 dark:border-white/10 shrink-0 transition-colors cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* INPUT TOOLBAR */}
      <form
        onSubmit={handleSend}
        className="p-3 sm:p-4 bg-white dark:bg-[#0F172A] border-t border-obsidian-200 dark:border-white/10 flex items-center gap-2 shrink-0"
      >
        <button
          type="button"
          onClick={handleSendSamplePhoto}
          title="Share photo"
          className="w-11 h-11 rounded-2xl flex items-center justify-center bg-obsidian-100 dark:bg-white/5 hover:bg-coral-50 dark:hover:bg-coral-950/50 text-obsidian-700 dark:text-slate-300 hover:text-coral-500 transition-colors cursor-pointer border border-obsidian-200 dark:border-white/10"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleSendDogBark}
          title="Send dog bark audio note"
          className="w-11 h-11 rounded-2xl flex items-center justify-center bg-coral-50 dark:bg-coral-950/60 hover:bg-coral-100 text-coral-600 dark:text-coral-400 transition-colors cursor-pointer border border-coral-200 dark:border-coral-800/60"
        >
          <Volume2 className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          placeholder={`Type a message to ${activeConv.dogName}'s guardian...`}
          className="flex-1 px-4 py-3 rounded-2xl bg-obsidian-100 dark:bg-[#152033] border border-obsidian-200 dark:border-white/15 focus:bg-white dark:focus:bg-[#152033] focus:border-coral-500 focus:ring-4 focus:ring-coral-100 dark:focus:ring-coral-500/20 text-obsidian-900 dark:text-white placeholder:text-obsidian-400 dark:placeholder:text-slate-400 text-xs sm:text-sm outline-hidden font-semibold"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim()}
          className="w-12 h-11 rounded-2xl btn-primary disabled:opacity-50 text-white flex items-center justify-center cursor-pointer shadow-glow-coral"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Meetup Modal */}
      {relatedApp && (
        <MeetAndGreetModal
          isOpen={isMeetModalOpen}
          onClose={() => setIsMeetModalOpen(false)}
          dogId={relatedApp.dogId}
          dogName={relatedApp.dogName}
          applicationId={relatedApp.id}
          adopterId={relatedApp.applicantId}
        />
      )}

    </div>
  );
};
