import React, { useState } from 'react';
import {
  ShieldCheck,
  Heart,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { openFaq } = useApp();
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryContact, setInquiryContact] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryContact.trim() || !inquiryMessage.trim()) return;

    setIsSubmitted(true);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (err) {}

    setTimeout(() => {
      setInquiryName('');
      setInquiryContact('');
      setInquiryMessage('');
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <footer className="bg-white dark:bg-[#080C14] text-obsidian-600 dark:text-slate-400 pt-16 pb-28 lg:pb-16 mt-20 border-t border-obsidian-200 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 text-left">
          
          {/* Brand Col */}
          <div className="space-y-4 lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-coral-600 to-amber-400 flex items-center justify-center text-white text-xl shadow-glow-coral">
                🐾
              </div>
              <span className="text-2xl font-black font-display text-obsidian-950 dark:text-white tracking-tight">
                Paw<span className="text-coral-500">Connect</span>
              </span>
            </div>
            <p className="text-sm text-obsidian-600 dark:text-slate-400 leading-relaxed font-normal">
              The modern canine social & verified adoption platform. Connecting loving families, rescue fosters, and dogs with transparent 6-stage tracking, digital agreements, and verified ownership handovers.
            </p>
            <div className="flex items-center gap-2.5 pt-2 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-700 dark:text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>100% Verified Pet Profiles</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-coral-50 dark:bg-coral-950/60 border border-coral-200 dark:border-coral-800/60 text-xs text-coral-600 dark:text-coral-400 font-bold">
                <Sparkles className="w-4 h-4 text-coral-500" />
                <span>Real-Time Handover</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-obsidian-950 dark:text-white font-black text-sm mb-4 tracking-wider uppercase">
              Adoption Journey
            </h4>
            <ul className="space-y-2.5 text-sm font-semibold">
              <li className="hover:text-coral-500 transition-colors cursor-pointer">1. Application Review</li>
              <li className="hover:text-coral-500 transition-colors cursor-pointer">2. Real-Time Chat</li>
              <li className="hover:text-coral-500 transition-colors cursor-pointer">3. Meet & Greet Protocol</li>
              <li className="hover:text-coral-500 transition-colors cursor-pointer">4. Digital Adoption Contract</li>
              <li className="hover:text-coral-500 transition-colors cursor-pointer">5. Dual-Confirm Handover</li>
            </ul>
          </div>

          {/* Community & Safety */}
          <div className="lg:col-span-2">
            <h4 className="text-obsidian-950 dark:text-white font-black text-sm mb-4 tracking-wider uppercase">
              Trust & Safety
            </h4>
            <ul className="space-y-2.5 text-sm font-semibold">
              <li className="hover:text-coral-500 transition-colors cursor-pointer">Owner Verification</li>
              <li className="hover:text-coral-500 transition-colors cursor-pointer">Adopter Screening</li>
              <li className="hover:text-coral-500 transition-colors cursor-pointer">Anti-Scam Guidelines</li>
              <li className="hover:text-coral-500 transition-colors cursor-pointer">Veterinary Health Panels</li>
              <li className="hover:text-coral-500 transition-colors cursor-pointer">Gold Adoption Certificate</li>
              <li
                onClick={openFaq}
                className="text-coral-600 dark:text-coral-400 font-bold hover:underline transition-colors cursor-pointer flex items-center gap-1 pt-1"
              >
                <span>Frequently Asked Questions (FAQ) 🐾</span>
              </li>
            </ul>
          </div>

          {/* 📧 Contact & Support Widget (Email Only) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-obsidian-950 dark:text-white font-black text-sm tracking-wider uppercase flex items-center gap-2">
                <span>Contact & Support</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h4>
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                Active Inbox
              </span>
            </div>

            {/* Official Support Email Card */}
            <a
              href="mailto:work.himu2020@gmail.com?subject=PawConnect%20Adoption%20Inquiry"
              className="p-3.5 rounded-2xl bg-obsidian-50 dark:bg-white/5 hover:bg-coral-50 dark:hover:bg-coral-950/40 border border-obsidian-200/80 dark:border-white/10 hover:border-coral-300 dark:hover:border-coral-700 text-obsidian-800 dark:text-slate-200 hover:text-coral-600 dark:hover:text-coral-400 transition-all flex items-center gap-3 group cursor-pointer shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-coral-100 dark:bg-coral-900/40 text-coral-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-obsidian-500 dark:text-slate-400">Official Support Email</div>
                <div className="font-black text-sm text-obsidian-950 dark:text-white truncate">work.himu2020@gmail.com</div>
              </div>
            </a>

            {/* Quick Message Box */}
            <div className="p-3.5 rounded-2xl bg-obsidian-50/80 dark:bg-white/5 border border-obsidian-200/80 dark:border-white/10">
              <div className="text-[11px] font-black text-obsidian-900 dark:text-white uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Quick Support Message 💬</span>
                <Clock className="w-3 h-3 text-obsidian-400" />
              </div>

              {isSubmitted ? (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Thank you! Our adoption support team will connect with you shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Your Name"
                      value={inquiryName}
                      onChange={e => setInquiryName(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-[#0A0E18] border border-obsidian-200 dark:border-white/10 text-obsidian-900 dark:text-white outline-hidden focus:border-coral-500"
                    />
                    <input
                      type="text"
                      placeholder="Mobile / Email *"
                      value={inquiryContact}
                      onChange={e => setInquiryContact(e.target.value)}
                      required
                      className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-[#0A0E18] border border-obsidian-200 dark:border-white/10 text-obsidian-900 dark:text-white outline-hidden focus:border-coral-500"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type your question or query..."
                      value={inquiryMessage}
                      onChange={e => setInquiryMessage(e.target.value)}
                      required
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-[#0A0E18] border border-obsidian-200 dark:border-white/10 text-obsidian-900 dark:text-white outline-hidden focus:border-coral-500"
                    />
                    <button
                      type="submit"
                      className="btn-primary text-white px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-xs"
                    >
                      <span>Send</span>
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-obsidian-200 dark:border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-obsidian-500 dark:text-slate-400 gap-4">
          <p>© 2026 PawConnect Social & Adoption Network. Built with unconditional puppy love.</p>
          <div className="flex items-center gap-2">
            <span>Every dog deserves a safe, loving forever home</span>
            <Heart className="w-3.5 h-3.5 text-coral-500 fill-coral-500" />
          </div>
        </div>
      </div>
    </footer>
  );
};

