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
} from 'lucide-react';

export const HowItWorksAnimated: React.FC = () => {
  const { playDogBark, playPawPop, playSuccessChime } = useAudio();

  const [activeStep, setActiveStep] = useState(0);
  const [isPlayingBark, setIsPlayingBark] = useState(false);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [demoHomeType, setDemoHomeType] = useState('House with Yard');
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [demoSigned, setDemoSigned] = useState(false);

  // Auto-advance steps every 6 seconds if auto-play is on
  useEffect(() => {
    if (!isAutoPlay) return;
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % 4);
    }, 6500);
    return () => clearInterval(interval);
  }, [isAutoPlay]);

  const steps = [
    {
      id: 0,
      stepNum: '1',
      icon: '🐶',
      badge: 'Step 1 • Discovery',
      badgeColor: 'bg-coral-50 text-coral-700 border-coral-200',
      title: 'Browse & Hear Bark',
      desc: 'Explore real dog photos, listen to audio bark notes, review size, energy, and verified health clearances.',
      glowColor: 'from-coral-500/20 to-orange-500/20',
      accentColor: 'text-coral-600',
    },
    {
      id: 1,
      stepNum: '2',
      icon: '📄',
      badge: 'Step 2 • Transparency',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      title: 'Submit Simple Form',
      desc: 'Tell the guardian about your home, yard, and family routine in a transparent, 2-minute questionnaire.',
      glowColor: 'from-sky-500/20 to-indigo-500/20',
      accentColor: 'text-sky-600',
    },
    {
      id: 2,
      stepNum: '3',
      icon: '💬',
      badge: 'Step 3 • Connection',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      title: 'Chat & Park Meetup',
      desc: 'Connect via private chat, ask lifestyle questions, and schedule a public park meet & greet to test bonding.',
      glowColor: 'from-emerald-500/20 to-teal-500/20',
      accentColor: 'text-emerald-600',
    },
    {
      id: 3,
      stepNum: '4',
      icon: '📜',
      badge: 'Step 4 • Official Handover',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      title: 'Dual Handover & Cert',
      desc: 'Sign legal digital custody terms and dual-confirm physical handover to receive official Gold Certificate.',
      glowColor: 'from-amber-500/20 to-yellow-500/20',
      accentColor: 'text-amber-600',
    },
  ];

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
    setTimeout(() => setDemoSubmitted(false), 3000);
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
        
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-coral-400/15 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 dark:bg-coral-950/60 text-coral-600 dark:text-coral-400 font-black text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Adoption Journey</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-obsidian-950 dark:text-white">
              How Adoption Works on PawConnect
            </h2>
            <p className="text-xs sm:text-sm text-obsidian-600 dark:text-slate-300 font-normal leading-relaxed">
              We eliminated adoption scams, shelter bureaucracy, and commercial breeders with our 4-step verified flow. Click any step to test the live interactive preview!
            </p>
          </div>

          {/* Auto-Play Simulator Toggle */}
          <button
            onClick={() => {
              playPawPop();
              setIsAutoPlay(!isAutoPlay);
            }}
            className="self-start sm:self-auto px-4 py-2 rounded-full glass-card border border-obsidian-200 dark:border-white/10 text-xs font-bold text-obsidian-700 dark:text-slate-200 hover:text-obsidian-950 dark:hover:text-white flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            {isAutoPlay ? (
              <>
                <Pause className="w-3.5 h-3.5 text-coral-500" />
                <span>Auto-Playing Demo (Pause)</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-emerald-500 fill-emerald-500" />
                <span>Play Auto Walkthrough</span>
              </>
            )}
          </button>
        </div>

        {/* 4 INTERACTIVE STEP CARDS (With Animated Indicator) */}
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
                    ? 'bg-white dark:bg-[#131C2E] border-coral-500 shadow-xl ring-4 ring-coral-100/80 dark:ring-coral-500/20 -translate-y-1'
                    : 'bg-white/80 dark:bg-white/5 border-obsidian-200/80 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 shadow-sm opacity-80 hover:opacity-100'
                }`}
              >
                {/* Step Active Progress Beam */}
                {isActive && (
                  <motion.div
                    layoutId="activeStepBeam"
                    className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-coral-500 via-amber-400 to-coral-500"
                  />
                )}

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black shadow-inner ${
                      isActive ? 'bg-coral-50 dark:bg-coral-950/80 text-coral-600 dark:text-coral-400 scale-110' : 'bg-obsidian-100 dark:bg-white/10 text-obsidian-700 dark:text-slate-300'
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
                    <p className="text-xs text-obsidian-600 dark:text-slate-400 mt-1 leading-relaxed font-normal line-clamp-3">
                      {s.desc}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] font-bold">
                  <span className={isActive ? 'text-coral-600 dark:text-coral-400 font-black' : 'text-obsidian-400 dark:text-slate-500'}>
                    {isActive ? '⚡ Testing in Simulator' : 'Click to preview'}
                  </span>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'translate-x-1 text-coral-500' : 'text-obsidian-300 dark:text-slate-600'}`} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* 🎬 LIVE INTERACTIVE MICRO-DEMO SIMULATOR */}
        <div className="rounded-4xl bg-white dark:bg-[#080D18] text-obsidian-950 dark:text-white p-6 sm:p-10 border border-obsidian-200/90 dark:border-white/10 shadow-elevated relative overflow-hidden">
          
          {/* Background Ambient Glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-coral-500/10 dark:bg-coral-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            
            {/* Left: Step Context */}
            <div className="space-y-4 max-w-md text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral-50 dark:bg-white/10 text-coral-600 dark:text-coral-400 border border-coral-200 dark:border-white/10 text-xs font-black uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-coral-500" />
                <span>Live Interactive Simulator • Step {activeStep + 1}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black font-display text-obsidian-950 dark:text-white">
                {steps[activeStep].title}
              </h3>

              <p className="text-xs sm:text-sm text-obsidian-600 dark:text-white/80 leading-relaxed font-normal">
                {steps[activeStep].desc}
              </p>

              <div className="flex items-center gap-2 pt-2">
                {steps.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handleStepClick(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      activeStep === i ? 'w-8 bg-coral-500' : 'w-2 bg-obsidian-200 dark:bg-white/30 hover:bg-obsidian-400 dark:hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right: Dynamic Interactive Simulation Box */}
            <div className="w-full lg:max-w-lg bg-obsidian-50/70 dark:bg-[#101726] text-obsidian-950 dark:text-white rounded-3xl p-5 sm:p-6 shadow-card border border-obsidian-200/80 dark:border-white/10 min-h-[260px] flex flex-col justify-center">
              
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
                      <img
                        src="https://images.unsplash.com/photo-1552053831-71594a27632d?w=200"
                        alt="Bruno"
                        className="w-14 h-14 rounded-2xl object-cover ring-2 ring-coral-400 shadow-md shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-base font-black text-obsidian-950 dark:text-white">Bruno (2 Yrs)</h4>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-black border border-emerald-200 dark:border-emerald-800/60">
                            ✓ 100% Vaccinated
                          </span>
                        </div>
                        <p className="text-xs text-obsidian-500 dark:text-slate-400 font-semibold">Golden Retriever • Kolkata, Salt Lake</p>
                      </div>
                    </div>

                    {/* Audio Bark Player */}
                    <div className="p-3.5 rounded-2xl bg-coral-50 dark:bg-coral-950/60 border border-coral-200 dark:border-coral-800/60 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex items-center gap-1">
                          <div className={`w-1 bg-coral-500 rounded-full transition-all ${isPlayingBark ? 'h-6 animate-bounce' : 'h-3'}`} />
                          <div className={`w-1 bg-coral-500 rounded-full transition-all ${isPlayingBark ? 'h-8 animate-bounce delay-75' : 'h-4'}`} />
                          <div className={`w-1 bg-coral-500 rounded-full transition-all ${isPlayingBark ? 'h-5 animate-bounce delay-150' : 'h-2'}`} />
                          <div className={`w-1 bg-coral-500 rounded-full transition-all ${isPlayingBark ? 'h-7 animate-bounce delay-100' : 'h-3'}`} />
                        </div>
                        <span className="text-xs font-black text-coral-900 dark:text-coral-200">
                          {isPlayingBark ? 'Barking! 🐾' : 'Audio Note: Bruno Greeting'}
                        </span>
                      </div>

                      <button
                        onClick={handlePlayBarkDemo}
                        className="btn-primary text-white px-3.5 py-1.5 rounded-xl text-xs font-black shadow-glow-coral flex items-center gap-1.5 cursor-pointer hover:scale-105 transition-all"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Hear Bark 🔊</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-obsidian-500 dark:text-slate-400">
                      💡 Every dog profile includes real vocal audio notes and vet records so you understand their personality before applying.
                    </p>
                  </motion.div>
                )}

                {/* STEP 2 SIMULATOR: SUBMIT SIMPLE FORM */}
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
                        2-Minute Direct Application
                      </span>
                      <span className="text-[10px] font-bold text-sky-600 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/60 px-2 py-0.5 rounded-full">
                        Fast & Transparent
                      </span>
                    </div>

                    <form onSubmit={handleFormDemoSubmit} className="space-y-2.5">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setDemoHomeType('House with Yard')}
                          className={`p-2 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                            demoHomeType === 'House with Yard'
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
                        ✓ Commitment: Lifelong veterinary care & daily walks
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{demoSubmitted ? '✓ Application Dispatched to Alex!' : 'Test Submit Application 🚀'}</span>
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
                        <img
                          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                          alt="Alex"
                          className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5"
                        />
                        <div className="bg-white dark:bg-[#152033] p-2 rounded-2xl shadow-xs border border-obsidian-200 dark:border-white/10 text-obsidian-900 dark:text-white">
                          Hi Sarah! Bruno loves swimming and tennis balls. He’s excited to meet you! 🎾
                        </div>
                      </div>

                      {/* Message 2 */}
                      <div className="flex items-start gap-2 justify-end">
                        <div className="bg-emerald-500 text-white p-2 rounded-2xl shadow-xs">
                          Can we meet this Sunday at Eco Park Canine Playground at 5 PM? 🌳
                        </div>
                      </div>

                    </div>

                    {/* Park Meetup Badge */}
                    <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-emerald-600" />
                        <span className="font-black text-emerald-950 dark:text-emerald-200">Eco Park Meetup Confirmed</span>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100 px-2 py-0.5 rounded-full">
                        Sun 5:00 PM
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4 SIMULATOR: DUAL HANDOVER & CERTIFICATE */}
                {activeStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-3 text-left"
                  >
                    <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-black text-amber-950 dark:text-amber-200">
                          <Award className="w-4 h-4 text-amber-600" />
                          <span>Official Adoption Gold Certificate</span>
                        </div>
                        <span className="text-[10px] font-black text-amber-800 dark:text-amber-200 bg-amber-200/80 dark:bg-amber-900/60 px-2 py-0.5 rounded-md">
                          #CERT-PAW-849201
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-amber-200 dark:border-amber-800/60 font-semibold text-amber-900 dark:text-amber-200">
                        <div>Guardian: <strong>Alex Rivera ✓</strong></div>
                        <div>Adopter: <strong>{demoSigned ? 'Sarah Jenkins ✓' : 'Pending Sign'}</strong></div>
                      </div>
                    </div>

                    <button
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
