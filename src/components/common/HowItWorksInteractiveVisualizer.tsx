import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Heart,
  MessageSquare,
  Trees,
  FileCheck,
  Award,
  Smartphone,
} from 'lucide-react';
import { useAudio } from '../../context/AudioContext';
import confetti from 'canvas-confetti';

interface WorkflowStep {
  stepNumber: number;
  badge: string;
  badgeColor: string;
  title: string;
  shortDesc: string;
  guardianAction: string;
  adopterAction: string;
  cost: string;
  icon: React.ReactNode;
  visualCard: {
    tag: string;
    illustration: string;
    actionText: string;
    verifiedProof: string;
  };
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    stepNumber: 1,
    badge: 'Stage 1: Verified Listing',
    badgeColor: 'bg-coral-100 text-coral-700 dark:bg-coral-950/60 dark:text-coral-300',
    title: 'Guardian Posts Dog for Free',
    shortDesc: 'Guardian authenticates via phone OTP and uploads dog photos, medical history & habits.',
    guardianAction: 'Uploads vaccination card & details in 2 mins',
    adopterAction: 'Discovers verified nearby dogs on map',
    cost: '₹0 Listing Fee',
    icon: <Smartphone className="w-5 h-5 text-coral-500" />,
    visualCard: {
      tag: '📱 Step 1 • Dog Profile Live',
      illustration: '🐕',
      actionText: 'Listing Verified with Phone OTP',
      verifiedProof: 'Vaccination & Rabies Card Attached',
    },
  },
  {
    stepNumber: 2,
    badge: 'Stage 2: Application & Chat',
    badgeColor: 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300',
    title: 'Direct Chat & Screening',
    shortDesc: 'Adopter sends home details, and both parties chat directly in real-time.',
    guardianAction: 'Reviews adopter home & fenced yard',
    adopterAction: 'Asks questions & schedules video meet',
    cost: '₹0 Application Fee',
    icon: <MessageSquare className="w-5 h-5 text-sky-500" />,
    visualCard: {
      tag: '💬 Step 2 • Real-Time Chat',
      illustration: '💬',
      actionText: 'Guardian & Adopter Connected',
      verifiedProof: 'End-to-End Direct Messaging',
    },
  },
  {
    stepNumber: 3,
    badge: 'Stage 3: Park Meet & Greet',
    badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300',
    title: 'In-Person Chemistry Walk',
    shortDesc: 'Meet in a public dog park or vet clinic to test temperament, leash walking & family compatibility.',
    guardianAction: 'Brings dog on familiar leash with treats',
    adopterAction: 'Walks dog & evaluates temperament',
    cost: '₹0 Meeting Fee',
    icon: <Trees className="w-5 h-5 text-emerald-500" />,
    visualCard: {
      tag: '🌳 Step 3 • Park Meet',
      illustration: '🐾',
      actionText: 'Tail Wagging & Vibe Match: 100%',
      verifiedProof: 'Zero Pressure Neutral Ground',
    },
  },
  {
    stepNumber: 4,
    badge: 'Stage 4: Free Legal Agreement',
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300',
    title: 'Digital Contract Signing',
    shortDesc: 'Both parties sign the humane non-breeding, lifetime welfare adoption agreement online.',
    guardianAction: 'Signs digital transfer of care',
    adopterAction: 'Accepts lifelong care responsibility',
    cost: '₹0 Legal Contract Fee',
    icon: <FileCheck className="w-5 h-5 text-amber-500" />,
    visualCard: {
      tag: '📜 Step 4 • Digital Contract',
      illustration: '✍️',
      actionText: 'Dual-Signed Legal Transfer',
      verifiedProof: 'Archived Permanently with OTP Signatures',
    },
  },
  {
    stepNumber: 5,
    badge: 'Stage 5: Official Handover',
    badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300',
    title: 'Forever Home Celebration 🎉',
    shortDesc: 'Physical vet passbook handed over, OTP confirmed, and official Gold Certificate issued.',
    guardianAction: 'Hands over passbook & favourite toy',
    adopterAction: 'Welcomes new family member home',
    cost: 'Total Paid: ₹0.00 (Pure Love)',
    icon: <Award className="w-5 h-5 text-purple-500" />,
    visualCard: {
      tag: '🏆 Step 5 • Handover Complete',
      illustration: '🎉',
      actionText: 'Gold Adoption Certificate Issued',
      verifiedProof: '100% Free • Verified Forever Home',
    },
  },
];

export const HowItWorksInteractiveVisualizer: React.FC = () => {
  const { playPawPop, playSuccessChime } = useAudio();
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const activeStep = WORKFLOW_STEPS[activeStepIndex];

  // Auto-playing timer every 3.5 seconds
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setActiveStepIndex(prev => {
        const next = (prev + 1) % WORKFLOW_STEPS.length;
        if (next === WORKFLOW_STEPS.length - 1) {
          try {
            confetti({
              particleCount: 40,
              spread: 60,
              origin: { y: 0.7 },
            });
          } catch (e) {}
        }
        return next;
      });
    }, 3500);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleStepClick = (index: number) => {
    playPawPop();
    setActiveStepIndex(index);
    if (index === WORKFLOW_STEPS.length - 1) {
      playSuccessChime();
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.7 },
        });
      } catch (e) {}
    }
  };

  return (
    <div className="rounded-4xl p-6 sm:p-8 bg-gradient-to-br from-white via-[#FFFBF9] to-coral-50/40 dark:from-[#101726] dark:via-[#131E33] dark:to-[#101726] border border-coral-200/80 dark:border-white/10 shadow-xl space-y-6 text-left">
      
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-obsidian-200/70 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-500/10 text-coral-600 dark:text-coral-400 font-black text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Live Simulation</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black font-display text-obsidian-950 dark:text-white">
            Watch How Verified Adoption Works in Real-Time 🎬🐾
          </h3>
        </div>

        {/* Play / Pause / Reset Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              playPawPop();
              setIsPlaying(!isPlaying);
            }}
            className="px-3.5 py-1.5 rounded-full bg-obsidian-900 text-white dark:bg-white/10 dark:hover:bg-white/20 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Demo</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Play Auto-Demo</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              playPawPop();
              setActiveStepIndex(0);
            }}
            className="w-8 h-8 rounded-full bg-obsidian-100 dark:bg-white/10 text-obsidian-700 dark:text-slate-300 flex items-center justify-center hover:bg-obsidian-200 dark:hover:bg-white/20 transition-all cursor-pointer"
            title="Restart simulation from Step 1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5-Step Animated Progress Timeline */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
        {WORKFLOW_STEPS.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          const isPassed = idx < activeStepIndex;

          return (
            <button
              key={step.stepNumber}
              type="button"
              onClick={() => handleStepClick(idx)}
              className={`p-2 sm:p-3 rounded-2xl border text-left transition-all duration-300 cursor-pointer relative overflow-hidden ${
                isActive
                  ? 'bg-coral-500 text-white border-coral-500 shadow-glow-coral scale-102 ring-2 ring-coral-400/40'
                  : isPassed
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300'
                  : 'bg-white dark:bg-white/5 border-obsidian-200/70 dark:border-white/10 text-obsidian-600 dark:text-slate-400 hover:border-coral-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-white' : 'text-obsidian-400 dark:text-slate-400'}`}>
                  Step {step.stepNumber}
                </span>
                {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
              </div>
              <div className={`text-xs font-black truncate hidden sm:block ${isActive ? 'text-white' : 'text-obsidian-900 dark:text-white'}`}>
                {step.title.split(' ')[0]} {step.title.split(' ')[1] || ''}
              </div>

              {/* Progress fill bar if active */}
              {isActive && isPlaying && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/40 overflow-hidden">
                  <div className="h-full bg-white animate-pulse" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Step Detailed Animated Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left Info Column */}
        <div className="lg:col-span-7 space-y-4 animate-in fade-in slide-in-from-left-2 duration-300 key={activeStep.stepNumber}">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${activeStep.badgeColor}`}>
              {activeStep.badge}
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-black shadow-xs">
              {activeStep.cost}
            </span>
          </div>

          <h4 className="text-2xl sm:text-3xl font-black font-display text-obsidian-950 dark:text-white">
            {activeStep.title}
          </h4>

          <p className="text-xs sm:text-sm text-obsidian-700 dark:text-slate-300 leading-relaxed font-normal">
            {activeStep.shortDesc}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-obsidian-200/80 dark:border-white/10 shadow-2xs space-y-1">
              <span className="text-[10px] font-black text-coral-600 dark:text-coral-400 uppercase tracking-wider">
                👤 Current Guardian:
              </span>
              <p className="text-xs font-bold text-obsidian-900 dark:text-white">
                {activeStep.guardianAction}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white dark:bg-white/5 border border-obsidian-200/80 dark:border-white/10 shadow-2xs space-y-1">
              <span className="text-[10px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-wider">
                🏡 Prospective Adopter:
              </span>
              <p className="text-xs font-bold text-obsidian-900 dark:text-white">
                {activeStep.adopterAction}
              </p>
            </div>
          </div>
        </div>

        {/* Right Animated Live Visual Mockup Box */}
        <div className="lg:col-span-5 animate-in fade-in zoom-in-95 duration-300 key={`visual_${activeStep.stepNumber}`}>
          <div className="relative rounded-3xl p-6 bg-gradient-to-tr from-obsidian-900 via-[#182338] to-obsidian-900 text-white shadow-2xl border border-obsidian-700 dark:border-white/20 text-center space-y-4 overflow-hidden">
            
            {/* Ambient background glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-coral-500/30 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <span className="text-[11px] font-black px-3 py-1 rounded-full bg-white/15 text-coral-300 border border-white/20 inline-block backdrop-blur-md">
                {activeStep.visualCard.tag}
              </span>

              {/* Animated Giant Emoji / Graphic */}
              <div className="text-6xl sm:text-7xl py-2 transform transition-transform duration-500 animate-bounce">
                {activeStep.visualCard.illustration}
              </div>

              <div className="space-y-1">
                <div className="text-base font-black text-white">
                  {activeStep.visualCard.actionText}
                </div>
                <div className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{activeStep.visualCard.verifiedProof}</span>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-center gap-1 text-[11px] text-slate-300 font-semibold">
                <span>Direct Verified Protocol</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">100% Safe</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Step Controller Buttons */}
      <div className="flex items-center justify-between pt-3 border-t border-obsidian-200/60 dark:border-white/10 text-xs">
        <button
          type="button"
          disabled={activeStepIndex === 0}
          onClick={() => handleStepClick(Math.max(0, activeStepIndex - 1))}
          className={`px-4 py-2 rounded-full font-bold transition-all cursor-pointer ${
            activeStepIndex === 0
              ? 'opacity-40 cursor-not-allowed bg-obsidian-100 dark:bg-white/5 text-obsidian-400'
              : 'bg-obsidian-100 hover:bg-obsidian-200 dark:bg-white/10 text-obsidian-800 dark:text-white'
          }`}
        >
          ← Previous Step
        </button>

        <span className="text-xs font-black text-obsidian-500 dark:text-slate-400">
          Stage {activeStep.stepNumber} of 5
        </span>

        <button
          type="button"
          disabled={activeStepIndex === WORKFLOW_STEPS.length - 1}
          onClick={() => handleStepClick(Math.min(WORKFLOW_STEPS.length - 1, activeStepIndex + 1))}
          className={`btn-primary text-white px-5 py-2 rounded-full font-black flex items-center gap-1.5 transition-all cursor-pointer ${
            activeStepIndex === WORKFLOW_STEPS.length - 1 ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
          }`}
        >
          <span>Next Step</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
