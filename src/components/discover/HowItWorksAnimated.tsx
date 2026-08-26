import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../../context/AudioContext';
import confetti from 'canvas-confetti';
import {
  Volume2,
  FileCheck,
  MessageSquare,
  Award,
  Sparkles,
  CheckCircle2,
  Send,
  Calendar,
  ShieldCheck,
  ArrowRight,
  Play,
  Pause,
  MapPin,
  Heart,
  Home,
  UserCheck,
  Dog as DogIcon,
  HelpCircle,
  Clock,
  FileText,
  Lock,
} from 'lucide-react';

export const HowItWorksAnimated: React.FC = () => {
  const { playDogBark, playPawPop, playSuccessChime } = useAudio();

  const [activeStep, setActiveStep] = useState(0);
  const [isPlayingBark, setIsPlayingBark] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [userRoleMode, setUserRoleMode] = useState<'adopter' | 'owner'>('adopter');

  // Simulator Interactive States
  const [demoHomeType, setDemoHomeType] = useState('House with Fenced Yard');
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [demoSigned, setDemoSigned] = useState(false);

  // Auto-advance steps every 6 seconds if auto-play is on
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 4);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const adopterSteps = [
    {
      id: 0,
      stepNum: '1',
      icon: '🐶',
      badge: 'Step 1 • Search & Listen',
      badgeColor: 'bg-coral-500/10 text-coral-600 dark:text-coral-400 border-coral-200 dark:border-coral-800/40',
      title: 'Browse Verified Dogs & Bark Notes',
      titleHindi: '1. Verified Dogs aur Sound Suno',
      desc: 'Explore real dog listings, filter by breed or city, view verified vet health records, and hear live audio bark notes.',
      glowColor: 'from-coral-500/20 to-amber-500/20',
      accentColor: 'text-coral-500',
    },
    {
      id: 1,
      stepNum: '2',
      icon: '📋',
      badge: 'Step 2 • 2-Min Application',
      badgeColor: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/40',
      title: 'Fill Transparent Questionnaire',
      titleHindi: '2. Aasan 2-Minute Form Bharo',
      desc: 'Share your home environment, yard setup, and pet experience directly with the dog guardian without lengthy paperwork.',
      glowColor: 'from-sky-500/20 to-indigo-500/20',
      accentColor: 'text-sky-500',
    },
    {
      id: 2,
      stepNum: '3',
      icon: '💬',
      badge: 'Step 3 • Chat & Meetup',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40',
      title: 'Private Chat & Park Meet & Greet',
      titleHindi: '3. Chat Karo & Park Me Milna',
      desc: 'Connect in encrypted 1-on-1 chat, ask lifestyle questions, and schedule a safe public park meet to test dog bonding.',
      glowColor: 'from-emerald-500/20 to-teal-500/20',
      accentColor: 'text-emerald-500',
    },
    {
      id: 3,
      stepNum: '4',
      icon: '📜',
      badge: 'Step 4 • Gold Certificate',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40',
      title: 'Digital Custody & Gold Certificate',
      titleHindi: '4. Legal Certificate & Handover',
      desc: 'Sign legal digital transfer agreements and dual-confirm physical handover to receive official Gold Ownership Certificate.',
      glowColor: 'from-amber-500/20 to-yellow-500/20',
      accentColor: 'text-amber-500',
    },
  ];

  const ownerSteps = [
    {
      id: 0,
      stepNum: '1',
      icon: '📸',
      badge: 'Step 1 • List Your Dog',
      badgeColor: 'bg-coral-500/10 text-coral-600 dark:text-coral-400 border-coral-200 dark:border-coral-800/40',
      title: 'Post Free Dog Listing',
      titleHindi: '1. Apne Dog Ko List Karo',
      desc: 'Upload photos, record audio bark note, add vet vaccination status, and share reason for rehoming in 3 simple steps.',
      glowColor: 'from-coral-500/20 to-amber-500/20',
      accentColor: 'text-coral-500',
    },
    {
      id: 1,
      stepNum: '2',
      icon: '🔍',
      badge: 'Step 2 • Review Applicants',
      badgeColor: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/40',
      title: 'Review Verified Adopters',
      titleHindi: '2. Adopter Profiles Check Karo',
      desc: 'Inspect living setup, yard photos, and pet experience of interested adopters to choose the best matching family.',
      glowColor: 'from-sky-500/20 to-indigo-500/20',
      accentColor: 'text-sky-500',
    },
    {
      id: 2,
      stepNum: '3',
      icon: '🌳',
      badge: 'Step 3 • Park Meetup',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/40',
      title: 'Schedule Safe Meet & Greet',
      titleHindi: '3. Park Me Safe Meetup Rakho',
      desc: 'Chat with applicant, answer routine questions, and meet at a nearby pet park to observe how your dog interacts with them.',
      glowColor: 'from-emerald-500/20 to-teal-500/20',
      accentColor: 'text-emerald-500',
    },
    {
      id: 3,
      stepNum: '4',
      icon: '🏆',
      badge: 'Step 4 • Safe Custody Transfer',
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/40',
      title: 'Sign Agreement & Complete Transfer',
      titleHindi: '4. Agreement Sign karke Handover',
      desc: 'Sign the legal rehoming terms on phone, confirm physical handover, and transfer ownership with 100% peace of mind.',
      glowColor: 'from-amber-500/20 to-yellow-500/20',
      accentColor: 'text-amber-500',
    },
  ];

  const steps = userRoleMode === 'adopter' ? adopterSteps : ownerSteps;

  const handleStepClick = (idx: number) => {
    playPawPop();
    setActiveStep(idx);
    setIsAutoPlay(false);
  };

  const handlePlayBarkDemo = () => {
    playDogBark();
    setIsPlayingBark(true);
    setTimeout(() => setIsPlayingBark(false), 1200);
  };

  const handleFormDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSuccessChime();
    setDemoSubmitted(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
    });
    setTimeout(() => setDemoSubmitted(false), 3500);
  };

  const handleSignDemo = () => {
    playSuccessChime();
    setDemoSigned(true);
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="glass-card rounded-5xl p-6 sm:p-12 border border-white dark:border-white/10 shadow-elevated space-y-10 text-left relative overflow-hidden">
        
        {/* Ambient Top Background Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-coral-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header with Dual Perspective Mode Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-4 border-b border-obsidian-200/80 dark:border-white/10">
          
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-coral-500/10 text-coral-600 dark:text-coral-400 font-extrabold text-xs uppercase tracking-wider border border-coral-200 dark:border-coral-800/40">
              <Sparkles className="w-4 h-4 text-coral-500" />
              <span>Simple 4-Step Verified Adoption Protocol</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-obsidian-950 dark:text-white leading-tight">
              How Adoption Works on PawConnect
            </h2>
            
            <p className="text-xs sm:text-sm text-obsidian-600 dark:text-slate-300 font-normal leading-relaxed">
              No shelter delays, no commercial breeders, no adoption scams. Just a transparent, direct connection between pet guardians and loving adopters. Select your perspective below to see how it works!
            </p>
          </div>

          {/* Perspective Switcher & Auto-Play Controls */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            
            {/* Mode Switcher Buttons */}
            <div className="p-1 bg-obsidian-100 dark:bg-white/10 rounded-2xl flex items-center gap-1 border border-obsidian-200 dark:border-white/10 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  playPawPop();
                  setUserRoleMode('adopter');
                  setActiveStep(0);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  userRoleMode === 'adopter'
                    ? 'bg-coral-500 text-white shadow-glow-coral'
                    : 'text-obsidian-700 dark:text-slate-300 hover:text-obsidian-950 dark:hover:text-white'
                }`}
              >
                <span>🙋‍♂️ I Want to Adopt</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playPawPop();
                  setUserRoleMode('owner');
                  setActiveStep(0);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                  userRoleMode === 'owner'
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-obsidian-700 dark:text-slate-300 hover:text-obsidian-950 dark:hover:text-white'
                }`}
              >
                <span>🐕 I Need to Rehome</span>
              </button>
            </div>

            {/* Walkthrough Auto-Play Toggle */}
            <button
              type="button"
              onClick={() => {
                playPawPop();
                setIsAutoPlay(!isAutoPlay);
              }}
              className="px-3.5 py-2 rounded-2xl glass-card border border-obsidian-200 dark:border-white/10 text-xs font-bold text-obsidian-700 dark:text-slate-200 hover:text-obsidian-950 dark:hover:text-white flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
            >
              {isAutoPlay ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-coral-500" />
                  <span>Pause Demo</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                  <span>Auto-Play</span>
                </>
              )}
            </button>

          </div>

        </div>

        {/* 4 VISUAL STEP CARDS GRID WITH CONNECTING PROGRESS BEAM */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
          {steps.map((s, idx) => {
            const isActive = activeStep === idx;
            return (
              <motion.div
                key={s.id}
                onClick={() => handleStepClick(idx)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded-3xl border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-4 ${
                  isActive
                    ? 'bg-white dark:bg-[#131C2E] border-coral-500 shadow-xl ring-4 ring-coral-500/20 -translate-y-1'
                    : 'bg-white/80 dark:bg-white/5 border-obsidian-200/80 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 shadow-sm opacity-85 hover:opacity-100'
                }`}
              >
                {/* Active Step Beam Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeStepBeam"
                    className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-coral-500 via-amber-400 to-coral-500"
                  />
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black shadow-inner ${
                      isActive ? 'bg-coral-500/10 text-coral-600 dark:text-coral-400 scale-110' : 'bg-obsidian-100 dark:bg-white/10 text-obsidian-700 dark:text-slate-300'
                    } transition-transform`}>
                      {s.stepNum} {s.icon}
                    </div>

                    <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${s.badgeColor}`}>
                      {isActive ? 'Active Step' : `Step ${s.stepNum}`}
                    </span>
                  </div>

                  <div>
                    <h3 className={`text-base font-black transition-colors ${isActive ? 'text-obsidian-950 dark:text-white' : 'text-obsidian-800 dark:text-slate-200'}`}>
                      {s.title}
                    </h3>
                    <p className="text-[11px] font-bold text-coral-600 dark:text-coral-400 mt-0.5">
                      {s.titleHindi}
                    </p>
                    <p className="text-xs text-obsidian-600 dark:text-slate-400 mt-1.5 leading-relaxed font-normal line-clamp-3">
                      {s.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] font-bold border-t border-obsidian-100 dark:border-white/5">
                  <span className={isActive ? 'text-coral-600 dark:text-coral-400 font-black' : 'text-obsidian-400 dark:text-slate-500'}>
                    {isActive ? '⚡ Live Preview Active' : 'Click to preview'}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'translate-x-1 text-coral-500' : 'text-obsidian-300 dark:text-slate-600'}`} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 🎬 LIVE INTERACTIVE SIMULATOR (STEP DEMO BOX) */}
        <div className="rounded-4xl bg-white dark:bg-[#080D18] text-obsidian-950 dark:text-white p-6 sm:p-10 border border-obsidian-200/90 dark:border-white/10 shadow-elevated relative overflow-hidden">
          
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-coral-500/10 dark:bg-coral-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            
            {/* Left: Step Context Description */}
            <div className="space-y-4 max-w-md text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral-500/10 text-coral-600 dark:text-coral-400 border border-coral-200 dark:border-coral-800/40 text-xs font-black uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-coral-500" />
                <span>Live Interactive Simulator • Step {activeStep + 1} of 4</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black font-display text-obsidian-950 dark:text-white">
                {steps[activeStep].title}
              </h3>
              <p className="text-xs font-bold text-coral-600 dark:text-coral-400">
                {steps[activeStep].titleHindi}
              </p>

              <p className="text-xs sm:text-sm text-obsidian-600 dark:text-slate-300 leading-relaxed font-normal">
                {steps[activeStep].desc}
              </p>

              <div className="flex items-center gap-2 pt-2">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleStepClick(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeStep === i ? 'w-8 bg-coral-500' : 'w-2 bg-obsidian-200 dark:bg-white/30 hover:bg-obsidian-400 dark:hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right: Dynamic Interactive Simulation Widget */}
            <div className="w-full lg:max-w-lg bg-obsidian-50/70 dark:bg-[#101726] text-obsidian-950 dark:text-white rounded-3xl p-5 sm:p-6 shadow-card border border-obsidian-200/80 dark:border-white/10 min-h-[270px] flex flex-col justify-center">
              
              <AnimatePresence mode="wait">
                
                {/* STEP 1 SIMULATOR: BROWSE & HEAR BARK */}
                {activeStep === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-coral-500/10 text-coral-500 flex items-center justify-center text-2xl ring-2 ring-coral-400 shadow-md shrink-0">
                        🐕✨
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-black text-obsidian-950 dark:text-white">Pogo (Golden Mix)</h4>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-black border border-emerald-200 dark:border-emerald-800/60">
                            ✓ Vet Cleared
                          </span>
                        </div>
                        <p className="text-xs text-obsidian-500 dark:text-slate-400 font-semibold">📍 Kolkata, Salt Lake • 2 Years</p>
                      </div>
                    </div>

                    {/* Audio Bark Player Simulation */}
                    <div className="p-3.5 rounded-2xl bg-coral-500/10 border border-coral-200 dark:border-coral-800/60 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center gap-1">
                          <div className={`w-1 bg-coral-500 rounded-full transition-all ${isPlayingBark ? 'h-6 animate-bounce' : 'h-3'}`} />
                          <div className={`w-1 bg-coral-500 rounded-full transition-all ${isPlayingBark ? 'h-8 animate-bounce delay-75' : 'h-4'}`} />
                          <div className={`w-1 bg-coral-500 rounded-full transition-all ${isPlayingBark ? 'h-5 animate-bounce delay-150' : 'h-2'}`} />
                          <div className={`w-1 bg-coral-500 rounded-full transition-all ${isPlayingBark ? 'h-7 animate-bounce delay-100' : 'h-3'}`} />
                        </div>
                        <span className="text-xs font-black text-coral-950 dark:text-coral-200">
                          {isPlayingBark ? 'Barking! 🐾' : 'Audio Note: Pogo Greeting Bark'}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handlePlayBarkDemo}
                        className="btn-primary text-white px-3.5 py-1.5 rounded-xl text-xs font-black shadow-glow-coral flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-all"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Hear Bark 🔊</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-obsidian-500 dark:text-slate-400">
                      💡 Click <strong>&ldquo;Hear Bark 🔊&rdquo;</strong> to test live audio bark notes before applying!
                    </p>
                  </motion.div>
                )}

                {/* STEP 2 SIMULATOR: 2-MIN APPLICATION */}
                {activeStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-obsidian-950 dark:text-white uppercase tracking-wider">
                        2-Minute Direct Questionnaire
                      </span>
                      <span className="text-[10px] font-bold text-sky-600 dark:text-sky-300 bg-sky-500/10 border border-sky-200 dark:border-sky-800/60 px-2 py-0.5 rounded-full">
                        100% Free
                      </span>
                    </div>

                    <form onSubmit={handleFormDemoSubmit} className="space-y-2.5">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setDemoHomeType('House with Fenced Yard')}
                          className={`p-2 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                            demoHomeType === 'House with Fenced Yard'
                              ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                              : 'bg-obsidian-50 dark:bg-white/5 border-obsidian-200 dark:border-white/10 text-obsidian-700 dark:text-slate-300'
                          }`}
                        >
                          🏡 Fenced Yard
                        </button>
                        <button
                          type="button"
                          onClick={() => setDemoHomeType('Apartment')}
                          className={`p-2 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                            demoHomeType === 'Apartment'
                              ? 'bg-sky-500 text-white border-sky-500 shadow-sm'
                              : 'bg-obsidian-50 dark:bg-white/5 border-obsidian-200 dark:border-white/10 text-obsidian-700 dark:text-slate-300'
                          }`}
                        >
                          🏢 Apartment
                        </button>
                      </div>

                      <div className="p-2 rounded-xl bg-obsidian-50 dark:bg-white/5 border border-obsidian-200 dark:border-white/10 text-xs font-medium text-obsidian-700 dark:text-slate-300">
                        ✓ Commitment: Daily park walks, vet care & loving home
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{demoSubmitted ? '✓ Application Submitted to Guardian!' : 'Test Submit Application 🚀'}</span>
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* STEP 3 SIMULATOR: CHAT & PARK MEETUP */}
                {activeStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3 text-left"
                  >
                    <div className="p-2.5 rounded-2xl bg-obsidian-50 dark:bg-white/5 border border-obsidian-200 dark:border-white/10 space-y-2 text-xs">
                      
                      {/* Message 1 */}
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-coral-500 text-white flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                          D
                        </div>
                        <div className="bg-white dark:bg-[#152033] p-2 rounded-2xl shadow-xs border border-obsidian-200 dark:border-white/10 text-obsidian-900 dark:text-white">
                          Hi! Dipu Anand here. Pogo is super friendly and loves playing with tennis balls! 🎾
                        </div>
                      </div>

                      {/* Message 2 */}
                      <div className="flex items-start gap-2 justify-end">
                        <div className="bg-emerald-500 text-white p-2 rounded-2xl shadow-xs">
                          Can we meet at Eco Park Salt Lake this Sunday at 5 PM? 🌳
                        </div>
                      </div>

                    </div>

                    {/* Park Meetup Badge */}
                    <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <span className="font-black text-emerald-950 dark:text-emerald-200">Park Meetup Confirmed</span>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-900 dark:text-emerald-100 px-2 py-0.5 rounded-full">
                        Sun 5:00 PM
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4 SIMULATOR: GOLD CERTIFICATE & HANDOVER */}
                {activeStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3 text-left"
                  >
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-200 dark:border-amber-800/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-black text-amber-950 dark:text-amber-200">
                          <Award className="w-4 h-4 text-amber-500" />
                          <span>Official Adoption Gold Certificate</span>
                        </div>
                        <span className="text-[10px] font-black text-amber-800 dark:text-amber-200 bg-amber-500/20 px-2 py-0.5 rounded-md">
                          #CERT-PAW-8252
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-amber-200 dark:border-amber-800/60 font-semibold text-amber-900 dark:text-amber-200">
                        <div>Guardian: <strong>Dipu Anand ✓</strong></div>
                        <div>Adopter: <strong>{demoSigned ? 'Sarah Jenkins ✓' : 'Pending Sign'}</strong></div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleSignDemo}
                      disabled={demoSigned}
                      className={`w-full py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer ${
                        demoSigned
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-500 hover:bg-amber-600 text-white'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{demoSigned ? '🎉 Handover Complete & Transferred!' : 'Sign Digital Handover & Receive Cert'}</span>
                    </button>
                  </motion.div>
                )}

              </AnimatePresence>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
