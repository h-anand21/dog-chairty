import React from 'react';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-obsidian-900 text-obsidian-400 pt-16 pb-28 lg:pb-16 mt-20 border-t border-obsidian-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-coral-500 flex items-center justify-center text-white text-xl">
                🐾
              </div>
              <span className="text-2xl font-black font-display text-white tracking-tight">
                PawConnect
              </span>
            </div>
            <p className="text-sm text-obsidian-500 max-w-md leading-relaxed">
              The modern canine social & verified adoption platform. Connecting loving families, rescue fosters, and dogs with transparent 6-stage tracking, digital agreements, and verified ownership handovers.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-obsidian-800 border border-obsidian-700 text-xs text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Verified Pet Profiles</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-obsidian-800 border border-obsidian-700 text-xs text-coral-400 font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>Real-Time Handover</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wider uppercase">
              Adoption Journey
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="hover:text-coral-400 transition-colors cursor-pointer">1. Application Review</li>
              <li className="hover:text-coral-400 transition-colors cursor-pointer">2. Real-Time Chat</li>
              <li className="hover:text-coral-400 transition-colors cursor-pointer">3. Meet & Greet Protocol</li>
              <li className="hover:text-coral-400 transition-colors cursor-pointer">4. Digital Adoption Contract</li>
              <li className="hover:text-coral-400 transition-colors cursor-pointer">5. Dual-Confirm Handover</li>
            </ul>
          </div>

          {/* Community & Safety */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wider uppercase">
              Trust & Safety
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li className="hover:text-coral-400 transition-colors cursor-pointer">Owner Verification</li>
              <li className="hover:text-coral-400 transition-colors cursor-pointer">Adopter Home Screening</li>
              <li className="hover:text-coral-400 transition-colors cursor-pointer">Anti-Scam Guidelines</li>
              <li className="hover:text-coral-400 transition-colors cursor-pointer">Veterinary Health Panels</li>
              <li className="hover:text-coral-400 transition-colors cursor-pointer">Adoption Certificate Archive</li>
            </ul>
          </div>

        </div>

        <div className="border-t border-obsidian-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-obsidian-600 gap-4">
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
