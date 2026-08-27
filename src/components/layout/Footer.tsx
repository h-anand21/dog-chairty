import React from 'react';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-[#080C14] text-obsidian-600 dark:text-slate-400 pt-16 pb-28 lg:pb-16 mt-20 border-t border-obsidian-200 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-left">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-coral-600 to-amber-400 flex items-center justify-center text-white text-xl shadow-glow-coral">
                🐾
              </div>
              <span className="text-2xl font-black font-display text-obsidian-950 dark:text-white tracking-tight">
                Paw<span className="text-coral-500">Connect</span>
              </span>
            </div>
            <p className="text-sm text-obsidian-600 dark:text-slate-400 max-w-md leading-relaxed font-normal">
              The modern canine social & verified adoption platform. Connecting loving families, rescue fosters, and dogs with transparent 6-stage tracking, digital agreements, and verified ownership handovers.
            </p>
            <div className="flex items-center gap-3 pt-2 flex-wrap">
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
          <div>
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
          <div>
            <h4 className="text-obsidian-950 dark:text-white font-black text-sm mb-4 tracking-wider uppercase">
              Trust & Safety
            </h4>
            <ul className="space-y-2.5 text-sm font-semibold">
              <li className="hover:text-coral-500 transition-colors cursor-pointer">Owner Verification</li>
              <li className="hover:text-coral-500 transition-colors cursor-pointer">Adopter Home Screening</li>
              <li className="hover:text-coral-500 transition-colors cursor-pointer">Anti-Scam Guidelines</li>
              <li className="hover:text-coral-500 transition-colors cursor-pointer">Veterinary Health Panels</li>
              <li className="hover:text-coral-500 transition-colors cursor-pointer">Adoption Certificate Archive</li>
            </ul>
          </div>

        </div>

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
