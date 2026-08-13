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
  } = useApp();

  const { playDogBark, playPawPop } = useAudio();

  const [inputMessage, setInputMessage] = useState('');
  const [isMeetModalOpen, setIsMeetModalOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConversationId) || conversations[0];
  const activeMessages = activeConv ? messages[activeConv.id] || [] : [];
  
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
          Adoption chats unlock automatically once a guardian approves an application. Head to the <strong>Adoption Pipeline</strong> to track requests.
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
    sendMessage(activeConv.id, '🐾 *Woof Woof!* (Playful greeting from pup)', undefined, true);
  };

  const handleSendSamplePhoto = () => {
    playPawPop();
    const photos = [
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&auto=format&fit=crop&q=80'
    ];
    const randomPhoto = photos[Math.floor(Math.random() * photos.length)];
    sendMessage(activeConv.id, 'Here is a recent photo enjoying play time!', randomPhoto);
  };

  const quickPrompts = [
    '🎾 Bruno is so excited to meet!',
    '📍 Is Eco Park convenient for you?',
    '🍖 What are his favorite treats?',
    '💉 Can you confirm his vaccination schedule?'
  ];

  return (
    <div className="glass-card rounded-4xl border border-white shadow-elevated flex flex-col h-[700px] overflow-hidden">
      
      {/* CHAT HEADER */}
      <div className="p-4 sm:px-6 bg-white/95 border-b border-obsidian-200 flex items-center justify-between gap-3 shrink-0 backdrop-blur-md">
        <div className="flex items-center gap-3 text-left">
          <div className="relative">
            <img
              src={activeConv.dogAvatar}
              alt={activeConv.dogName}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-coral-400 shadow-sm"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full ring-1 ring-emerald-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-obsidian-950 leading-tight">
                {activeConv.dogName}&apos;s Adoption Chat
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black border border-emerald-200">
                🟢 Live Active
              </span>
            </div>
            <p className="text-[11px] text-obsidian-500 font-medium">
              Encrypted direct messaging with verified guardian
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playPawPop();
            setIsMeetModalOpen(true);
          }}
          className="flex items-center gap-1.5 bg-sky-50 hover:bg-sky-500 text-sky-700 hover:text-white border border-sky-200 hover:border-sky-500 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
        >
          <Calendar className="w-4 h-4" />
          <span className="hidden sm:inline">Schedule Meet & Greet</span>
          <span className="sm:hidden">Meet & Greet</span>
        </button>
      </div>

      {/* SAFETY BANNER */}
      <div className="bg-amber-50/90 px-4 py-2 border-b border-amber-200 text-left flex items-center gap-2 text-xs text-amber-900 shrink-0 font-medium">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong>PawConnect Verified Safety:</strong> Coordinate freely here. Physical handover confirmation will securely transfer dog ownership.
        </span>
      </div>

      {/* MESSAGES FEED */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#FAF9F6] text-left">
        
        {/* Active Meet & Greet Status Card */}
        {activeMeet && (
          <div className="max-w-md mx-auto bg-gradient-to-r from-sky-50 to-sky-100/90 rounded-3xl p-5 border border-sky-200 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-sky-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-sky-600" />
                <span>Upcoming Meet & Greet</span>
              </span>
              <span className="text-[10px] font-black bg-sky-200 text-sky-900 px-2.5 py-0.5 rounded-full">
                Scheduled
              </span>
            </div>
            
            <div className="space-y-1 text-xs text-obsidian-800">
              <div className="flex items-center gap-2 font-black text-obsidian-950 text-sm">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>{activeMeet.date} • {activeMeet.time}</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <MapPin className="w-3.5 h-3.5 text-coral-500" />
                <span>{activeMeet.locationName}</span>
              </div>
              {activeMeet.notes && (
                <p className="text-[11px] text-obsidian-600 italic pt-1">
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
          const isMine = msg.senderId === currentUser.id;
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
                    : 'bg-white text-obsidian-900 border border-obsidian-200 rounded-bl-xs'
                }`}
              >
                {!isMine && (
                  <div className="text-[10px] font-black text-obsidian-400 mb-1 uppercase tracking-wider">
                    {msg.senderName}
                  </div>
                )}

                {msg.isDogBark ? (
                  <div className={`flex items-center gap-2 py-1 px-3 rounded-full font-black text-xs ${
                    isMine ? 'bg-white/20 text-white' : 'bg-coral-50 text-coral-700'
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
                    isMine ? 'text-white/80' : 'text-obsidian-400'
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
      <div className="px-4 py-2 bg-white border-t border-obsidian-200 flex items-center gap-2 overflow-x-auto shrink-0">
        <span className="text-[10px] font-black uppercase tracking-wider text-obsidian-400 shrink-0">
          Quick Prompts:
        </span>
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            onClick={() => {
              playPawPop();
              sendMessage(activeConv.id, p);
            }}
            className="text-xs font-bold px-3.5 py-1 rounded-full bg-obsidian-100 hover:bg-coral-50 text-obsidian-700 hover:text-coral-600 border border-obsidian-200 shrink-0 transition-colors cursor-pointer"
          >
            {p}
          </button>
        ))}
      </div>

      {/* INPUT TOOLBAR */}
      <form
        onSubmit={handleSend}
        className="p-3 sm:p-4 bg-white border-t border-obsidian-200 flex items-center gap-2 shrink-0"
      >
        <button
          type="button"
          onClick={handleSendSamplePhoto}
          title="Share photo"
          className="w-11 h-11 rounded-2xl flex items-center justify-center bg-obsidian-100 hover:bg-coral-50 text-obsidian-700 hover:text-coral-500 transition-colors cursor-pointer"
        >
          <ImageIcon className="w-5 h-5" />
        </button>

        <button
          type="button"
          onClick={handleSendDogBark}
          title="Send dog bark audio note"
          className="w-11 h-11 rounded-2xl flex items-center justify-center bg-coral-50 hover:bg-coral-100 text-coral-600 transition-colors cursor-pointer"
        >
          <Volume2 className="w-5 h-5" />
        </button>

        <input
          type="text"
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          placeholder={`Type a message to ${activeConv.dogName}'s guardian...`}
          className="flex-1 px-4 py-3 rounded-2xl bg-obsidian-100 border border-obsidian-200 focus:bg-white focus:border-coral-500 focus:ring-4 focus:ring-coral-100 text-xs sm:text-sm outline-hidden font-semibold"
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
