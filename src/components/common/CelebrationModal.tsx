import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { HeartHandshake, MessageCircle, Award, Sparkles, X, CheckCircle } from 'lucide-react';

export const CelebrationModal: React.FC = () => {
  const { celebrationData, setCelebrationData, setActiveTab, setViewingCertificateDog } = useApp();
  const { playMatchFanfare, playDogBark } = useAudio();

  useEffect(() => {
    if (celebrationData?.isOpen) {
      playMatchFanfare();
      setTimeout(() => playDogBark(), 400);

      // Trigger Confetti blast
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF6B4A', '#56B3EE', '#FBBF24', '#34D399', '#A78BFA']
      });
    }
  }, [celebrationData?.isOpen]);

  if (!celebrationData || !celebrationData.isOpen) return null;

  const { dog, adopter, type } = celebrationData;
  const isTransfer = type === 'transfer';

  const handleClose = () => {
    setCelebrationData(null);
  };

  const handleGoToChat = () => {
    setCelebrationData(null);
    setActiveTab('chat');
  };

  const handleGoToJourney = () => {
    setCelebrationData(null);
    setActiveTab('adopt_flow');
  };

  const handleViewCertificate = () => {
    setCelebrationData(null);
    if (dog) {
      setViewingCertificateDog(dog);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-900/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', damping: 22, stiffness: 300 }}
          className="relative w-full max-w-lg bg-white rounded-4xl p-6 sm:p-8 text-center shadow-2xl border-4 border-coral-200 overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-obsidian-300/80 hover:bg-obsidian-400 flex items-center justify-center text-obsidian-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Sparkle badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-coral-50 border border-coral-200 text-coral-600 text-xs font-black tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isTransfer ? 'Official Handover Complete!' : 'Adoption Application Accepted!'}</span>
          </div>

          {/* Animated Avatars Hero */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 my-6">
            {/* Dog Avatar */}
            <motion.div
              initial={{ x: -40, opacity: 0, rotate: -8 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="relative"
            >
              <img
                src={dog?.coverPhoto || dog?.photos[0] || 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=400'}
                alt={dog?.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-coral-400 shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-coral-400 flex items-center justify-center text-sm shadow-xs">
                🐶
              </div>
            </motion.div>

            {/* Heart / Sparkle connector */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.3, 1] }}
              transition={{ delay: 0.25, duration: 0.4 }}
              className="w-12 h-12 rounded-full bg-gradient-to-tr from-coral-500 to-amber-400 text-white flex items-center justify-center shadow-glow text-xl"
            >
              {isTransfer ? '🏆' : '❤️'}
            </motion.div>

            {/* Adopter Avatar */}
            <motion.div
              initial={{ x: 40, opacity: 0, rotate: 8 }}
              animate={{ x: 0, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.1, type: 'spring' }}
              className="relative"
            >
              <img
                src={adopter?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'}
                alt={adopter?.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-sky-400 shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-sky-400 flex items-center justify-center text-sm shadow-xs">
                👤
              </div>
            </motion.div>
          </div>

          {/* Heading */}
          <h3 className="text-2xl sm:text-3xl font-black font-display text-obsidian-900 leading-tight">
            {isTransfer ? (
              <>
                <span className="text-coral-600">{dog?.name}</span> is officially with{' '}
                <span className="text-sky-600">{adopter?.name}</span>!
              </>
            ) : (
              <>
                <span className="text-coral-600">{dog?.name}</span> ×{' '}
                <span className="text-sky-600">{adopter?.name}</span>
              </>
            )}
          </h3>

          {/* Subtitle description */}
          <p className="text-sm text-obsidian-700 mt-2 max-w-md mx-auto leading-relaxed">
            {isTransfer ? (
              <>
                Both the original owner and new adopter have confirmed handover! {dog?.name} has been transferred to {adopter?.name}&apos;s account with an official adoption certificate.
              </>
            ) : (
              <>
                Application has been approved by the owner! Real-time private chat and Meet & Greet scheduling are now fully unlocked.
              </>
            )}
          </p>

          {/* Transfer Info Pill (if transfer) */}
          {isTransfer && dog?.certificateId && (
            <div className="mt-4 p-3 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between text-xs text-amber-900 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Certificate: <strong>#{dog.certificateId}</strong>
                </span>
              </div>
              <span className="font-bold text-coral-600">Verified Transfer</span>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            {isTransfer ? (
              <>
                <button
                  onClick={handleViewCertificate}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3 px-5 rounded-2xl font-bold text-sm shadow-soft hover:shadow-soft-hover transition-all"
                >
                  <Award className="w-4 h-4" />
                  <span>View Official Certificate</span>
                </button>
                <button
                  onClick={() => {
                    setCelebrationData(null);
                    setActiveTab('my_dogs');
                  }}
                  className="flex-1 flex items-center justify-center gap-2 bg-obsidian-200 hover:bg-obsidian-300 text-obsidian-800 py-3 px-5 rounded-2xl font-bold text-sm transition-all"
                >
                  <span>Go to My Dogs 🐕</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleGoToChat}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-700 text-white py-3 px-5 rounded-2xl font-bold text-sm shadow-soft hover:shadow-soft-hover transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open Chat Room</span>
                </button>
                <button
                  onClick={handleGoToJourney}
                  className="flex-1 flex items-center justify-center gap-2 bg-obsidian-200 hover:bg-obsidian-300 text-obsidian-800 py-3 px-5 rounded-2xl font-bold text-sm transition-all"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>View Adoption Timeline</span>
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
