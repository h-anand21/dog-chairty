import React from 'react';
import { useAudio } from '../../context/AudioContext';
import { useApp } from '../../context/AppContext';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  MessageSquare,
  Trees,
  Award,
  ArrowRight,
  Sparkles,
  HeartHandshake,
  MapPin,
} from 'lucide-react';

export type PillarType = 'medicals' | 'chat' | 'park_meetup' | 'dual_handover' | null;

interface PillarDetailModalProps {
  pillar: PillarType;
  onClose: () => void;
}

export const PillarDetailModal: React.FC<PillarDetailModalProps> = ({ pillar, onClose }) => {
  const { playPawPop } = useAudio();
  const { setActiveTab, requireAuth } = useApp();

  if (!pillar) return null;

  const content = {
    medicals: {
      badge: 'Certified Health Standards',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: '💉',
      title: '100% Medical & Vet Clearances',
      subtitle: 'Every dog listed on PawConnect undergoes verified health checks to eliminate sick puppy sales and scams.',
      features: [
        {
          title: 'Full Vaccination Panel',
          desc: 'Rabies, DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza) & Bordetella up-to-date.',
        },
        {
          title: 'Spay / Neuter & Microchipped',
          desc: 'Preventing unauthorized breeding and ensuring permanent companion safety.',
        },
        {
          title: 'Vet Booklets Uploaded',
          desc: 'Original signed clinic records and deworming charts reviewed prior to approval.',
        },
      ],
      ctaText: 'Explore Medically Cleared Dogs 🐾',
      action: () => {
        onClose();
        const el = document.getElementById('marketplace-grid');
        el?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    chat: {
      badge: 'Direct Communication',
      badgeColor: 'bg-coral-50 text-coral-700 border-coral-200',
      icon: '💬',
      title: 'Direct Private Chat with Pet Parents',
      subtitle: 'Connect directly with current guardians without middleman agents or shelter bureaucracy.',
      features: [
        {
          title: 'Real-Time Direct Messaging',
          desc: 'Ask about the dog’s daily food routine, behavioral habits, quirks, and likes.',
        },
        {
          title: 'Photo & Video Sharing',
          desc: 'Receive live unedited playtime videos directly inside the conversation.',
        },
        {
          title: 'Safe In-App Coordination',
          desc: 'Schedule park meetups and review questionnaires seamlessly in one thread.',
        },
      ],
      ctaText: 'Open Live Messages 💬',
      action: () => {
        onClose();
        requireAuth('Please verify your mobile number to message dog guardians.', () => {
          setActiveTab('chat');
        });
      },
    },
    park_meetup: {
      badge: 'Safe Bonding Stage',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: '🌳',
      title: 'Neutral Public Park Meetups',
      subtitle: 'Never meet at private unverified locations. Meet at trusted public canine parks across India.',
      features: [
        {
          title: 'Neutral Territory Play',
          desc: 'Allows the dog and adopter to interact in an open, low-stress environment.',
        },
        {
          title: 'Compatible with Existing Pets',
          desc: 'Bring your current dog for a friendly park walk to verify mutual bonding.',
        },
        {
          title: 'GPS-Verified Public Venues',
          desc: 'Pre-mapped dog parks in Kolkata, Delhi, Bengaluru, Mumbai, and Hyderabad.',
        },
      ],
      ctaText: 'Explore Dogs on Live Map 🗺️',
      action: () => {
        onClose();
        const el = document.getElementById('marketplace-grid');
        el?.scrollIntoView({ behavior: 'smooth' });
      },
    },
    dual_handover: {
      badge: 'Legal Animal Custody',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: '📜',
      title: 'Dual-Confirmation Handover & Gold Certificate',
      subtitle: 'Official digital adoption contract protecting the dog and legally transferring pet parenting rights.',
      features: [
        {
          title: 'Digital Legal Agreement',
          desc: 'Standardized terms ensuring humane care, non-commercial use, and lifetime protection.',
        },
        {
          title: '2-Sided Confirmation',
          desc: 'Both current guardian and new adopter must confirm physical handover in person.',
        },
        {
          title: 'Official Gold Certificate',
          desc: 'Instant generation of verified Certificate with unique ID (e.g. #CERT-PAW-849201).',
        },
      ],
      ctaText: 'View Adoption Pipeline 🚀',
      action: () => {
        onClose();
        setActiveTab('adopt_flow');
      },
    },
  };

  const active = content[pillar];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-obsidian-950/80 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-5xl p-6 sm:p-8 shadow-2xl border border-obsidian-200 animate-in fade-in zoom-in-95 duration-200 text-left my-6">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-obsidian-100 hover:bg-obsidian-200 flex items-center justify-center text-obsidian-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-3 pb-4 border-b border-obsidian-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-obsidian-100 flex items-center justify-center text-2xl shadow-inner">
              {active.icon}
            </div>
            <div>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${active.badgeColor}`}>
                {active.badge}
              </span>
              <h3 className="text-xl sm:text-2xl font-black font-display text-obsidian-950 mt-0.5">
                {active.title}
              </h3>
            </div>
          </div>
          <p className="text-xs text-obsidian-600 leading-relaxed font-medium">
            {active.subtitle}
          </p>
        </div>

        {/* Feature List */}
        <div className="py-4 space-y-3">
          {active.features.map((f, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-2xl bg-obsidian-50 border border-obsidian-200/80">
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                ✓
              </div>
              <div>
                <h4 className="text-xs font-black text-obsidian-950">{f.title}</h4>
                <p className="text-[11px] text-obsidian-600 mt-0.5 leading-relaxed font-medium">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              playPawPop();
              active.action();
            }}
            className="w-full btn-primary text-white py-3.5 rounded-2xl font-black text-xs shadow-glow-coral flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{active.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
