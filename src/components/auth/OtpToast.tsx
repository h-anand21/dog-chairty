import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Copy, Sparkles, X, Check } from 'lucide-react';
import { useAudio } from '../../context/AudioContext';

interface OtpToastProps {
  phone: string;
  code: string;
  onAutoFill: (code: string) => void;
  onClose: () => void;
}

export const OtpToast: React.FC<OtpToastProps> = ({ phone, code, onAutoFill, onClose }) => {
  const { playPawPop } = useAudio();
  const [copied, setCopied] = React.useState(false);

  const handleCopyAndFill = () => {
    playPawPop();
    onAutoFill(code);
    setCopied(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -80, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -80, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md bg-obsidian-950/95 text-white p-4 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-xl text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-coral-500 flex items-center justify-center text-white shadow-glow-coral text-lg shrink-0">
              💬
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black tracking-wide text-white uppercase">
                  Messages • Verification SMS
                </span>
                <span className="text-[10px] text-white/50">Just now</span>
              </div>
              <p className="text-xs text-white/90 mt-1 leading-relaxed">
                PawConnect OTP for <strong className="text-coral-400">{phone}</strong> is:{' '}
                <span className="text-base font-black tracking-widest text-amber-300 bg-black/40 px-2 py-0.5 rounded-lg border border-amber-300/30">
                  {code}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors cursor-pointer p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Instant Auto-Fill Button */}
        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
          <span className="text-[10px] text-white/60 font-medium">
            Tap below to fill code instantly:
          </span>

          <button
            onClick={handleCopyAndFill}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-extrabold text-xs shadow-glow-coral transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Auto-Filled!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Fill {code}</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
