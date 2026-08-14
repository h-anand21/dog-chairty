import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import {
  X,
  Phone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  UserCheck,
  CheckCircle2,
  Lock,
  Heart,
  Dog as DogIcon,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const {
    allUsers,
    sendOtp,
    verifyOtp,
    completeRegistration,
    activeOtpSession,
    authPromptReason,
  } = useApp();

  const { playSuccessChime, playPawPop, playDogBark } = useAudio();

  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneDigits, setPhoneDigits] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  // New Profile Data
  const [name, setName] = useState('');
  const [role, setRole] = useState<'owner' | 'adopter'>('adopter');
  const [location, setLocation] = useState('Kolkata, Salt Lake');
  const [bio, setBio] = useState('Dog lover seeking a furry companion to give a loving forever home!');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  if (!isOpen) return null;

  const fullPhone = `${countryCode} ${phoneDigits.trim()}`;

  const handleSendOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    const cleaned = phoneDigits.replace(/\D/g, '');
    if (cleaned.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    playPawPop();
    sendOtp(fullPhone);
    setStep('otp');
    setResendTimer(30);
    setOtpDigits(['', '', '', '']);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = val.slice(-1);
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    if (pasted.length > 0) {
      const newDigits = ['', '', '', ''];
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i];
      }
      setOtpDigits(newDigits);
    }
  };

  const handleVerifyOtp = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    const code = otpDigits.join('');
    if (code.length !== 4) {
      setErrorMsg('Please enter the 4-digit OTP sent to your phone.');
      return;
    }

    playPawPop();
    const result = verifyOtp(fullPhone, code);
    if (!result.success) {
      setErrorMsg(result.message);
      return;
    }

    if (result.isNewUser) {
      setStep('profile');
    } else {
      playSuccessChime();
      onClose();
    }
  };

  const handleCompleteProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    playSuccessChime();
    completeRegistration({
      name: name.trim(),
      phone: fullPhone,
      role,
      location,
      bio,
      avatar,
      isVerified: true,
      homeType: 'House',
      hasYard: true,
      otherPets: 'None',
      experienceLevel: 'Intermediate',
    });

    onClose();
  };

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=400',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-obsidian-950/80 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-md bg-white rounded-4xl p-6 sm:p-8 shadow-2xl border border-obsidian-200 animate-in fade-in zoom-in-95 duration-200 text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-obsidian-100 hover:bg-obsidian-200 flex items-center justify-center text-obsidian-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* STEP 1: ENTER PHONE NUMBER */}
        {step === 'phone' && (
          <div className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 text-coral-600 font-black text-[11px] mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Mobile Login</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black font-display text-obsidian-950">
                Log In to PawConnect 🐾
              </h2>

              {authPromptReason ? (
                <p className="text-xs text-coral-700 bg-coral-50 p-2.5 rounded-xl border border-coral-200 mt-2 font-semibold">
                  {authPromptReason}
                </p>
              ) : (
                <p className="text-xs text-obsidian-600 mt-1 leading-relaxed">
                  Enter your mobile number to log in or create a verified pet guardian profile.
                </p>
              )}
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-obsidian-900 uppercase tracking-wider mb-1.5">
                  Mobile Number *
                </label>
                
                <div className="flex items-center gap-2">
                  <select
                    value={countryCode}
                    onChange={e => setCountryCode(e.target.value)}
                    className="px-3 py-3 rounded-2xl bg-obsidian-100 border border-obsidian-200 text-xs font-black outline-hidden bg-white cursor-pointer"
                  >
                    <option value="+91">🇮🇳 +91 (India)</option>
                    <option value="+1">🇺🇸 +1 (USA)</option>
                    <option value="+44">🇬🇧 +44 (UK)</option>
                    <option value="+971">🇦🇪 +971 (UAE)</option>
                    <option value="+1">🇨🇦 +1 (Canada)</option>
                    <option value="+61">🇦🇺 +61 (Australia)</option>
                  </select>

                  <div className="relative flex-1">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400" />
                    <input
                      type="tel"
                      required
                      autoFocus
                      value={phoneDigits}
                      onChange={e => setPhoneDigits(e.target.value)}
                      placeholder="Enter 10-digit number"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl bg-obsidian-100 border border-obsidian-200 focus:bg-white focus:border-coral-500 focus:ring-4 focus:ring-coral-100 text-sm font-extrabold outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="text-xs font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full btn-primary text-white py-3.5 rounded-2xl font-black text-xs shadow-glow-coral flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Send OTP Verification Code 📲</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-3 border-t border-obsidian-200 text-center">
              <p className="text-[11px] text-obsidian-500 font-medium">
                🔒 We protect pet parents and adopters with 100% verified mobile numbers. No spam or commercial breeding allowed.
              </p>
            </div>

          </div>
        )}

        {/* STEP 2: ENTER OTP */}
        {step === 'otp' && (
          <div className="space-y-5">
            <button
              onClick={() => setStep('phone')}
              className="flex items-center gap-1 text-xs font-bold text-obsidian-500 hover:text-obsidian-900 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change Mobile Number</span>
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black text-[11px] mb-2">
                <Lock className="w-3.5 h-3.5" />
                <span>Verification Code Dispatched</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-obsidian-950">
                Enter 4-Digit OTP 🔑
              </h2>
              <p className="text-xs text-obsidian-600 mt-1 leading-relaxed">
                We sent a 4-digit code to <strong className="text-obsidian-950">{fullPhone}</strong>. Check the SMS notification banner at the top of your screen.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              
              {/* 4 Digit Inputs */}
              <div className="flex items-center justify-center gap-3 py-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onPaste={handleOtpPaste}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    className="w-14 h-14 text-center text-2xl font-black rounded-2xl bg-obsidian-100 border-2 border-obsidian-300 focus:border-coral-500 focus:bg-white focus:ring-4 focus:ring-coral-100 outline-hidden transition-all shadow-inner"
                  />
                ))}
              </div>

              {/* Active OTP Session hint / Helper */}
              {activeOtpSession && (
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                  <span>SMS Code: <strong>{activeOtpSession.code}</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      const digits = activeOtpSession.code.split('');
                      setOtpDigits(digits);
                    }}
                    className="px-3 py-1 rounded-lg bg-amber-500 text-white font-black text-xs shadow-xs cursor-pointer"
                  >
                    Auto-Fill Code ⚡
                  </button>
                </div>
              )}

              {errorMsg && (
                <div className="text-xs font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full btn-primary text-white py-3.5 rounded-2xl font-black text-xs shadow-glow-coral flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Verify OTP & Log In 🐾</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>

              <div className="text-center">
                {resendTimer > 0 ? (
                  <span className="text-xs text-obsidian-400 font-semibold">
                    Resend code in <strong className="text-obsidian-700">{resendTimer}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    className="text-xs font-extrabold text-coral-600 hover:underline cursor-pointer"
                  >
                    Resend OTP Code
                  </button>
                )}
              </div>
            </form>

          </div>
        )}

        {/* STEP 3: NEW USER PROFILE ONBOARDING */}
        {step === 'profile' && (
          <div className="space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 text-coral-600 font-black text-[11px] mb-2">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Create Your Profile</span>
              </div>
              <h2 className="text-2xl font-black font-display text-obsidian-950">
                Welcome to PawConnect! 🐶
              </h2>
              <p className="text-xs text-obsidian-600 mt-1">
                Your mobile <strong className="text-obsidian-950">{fullPhone}</strong> is verified! Tell us your name and role to finalize registration.
              </p>
            </div>

            <form onSubmit={handleCompleteProfile} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-black text-obsidian-900 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-obsidian-300 text-xs font-bold outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-obsidian-900 mb-1">
                  Account Purpose / Role
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('adopter')}
                    className={`p-2.5 rounded-2xl border text-left text-xs font-extrabold transition-all cursor-pointer ${
                      role === 'adopter' ? 'border-coral-500 bg-coral-50 text-coral-800' : 'border-obsidian-300 text-obsidian-700'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-coral-500" />
                      <span>Adopter / Parent</span>
                    </div>
                    <div className="font-normal text-[10px] text-obsidian-500 mt-0.5">Looking to adopt a dog</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('owner')}
                    className={`p-2.5 rounded-2xl border text-left text-xs font-extrabold transition-all cursor-pointer ${
                      role === 'owner' ? 'border-coral-500 bg-coral-50 text-coral-800' : 'border-obsidian-300 text-obsidian-700'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <DogIcon className="w-3.5 h-3.5 text-coral-500" />
                      <span>Dog Guardian</span>
                    </div>
                    <div className="font-normal text-[10px] text-obsidian-500 mt-0.5">Looking to rehome a dog</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-obsidian-900 mb-1">
                  City / Location *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Kolkata, Salt Lake"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-obsidian-300 text-xs font-bold outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-obsidian-900 mb-1">
                  Choose Avatar / Photo
                </label>
                <div className="flex items-center gap-2">
                  {sampleAvatars.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt=""
                      onClick={() => setAvatar(url)}
                      className={`w-9 h-9 rounded-full object-cover cursor-pointer border-2 transition-all ${
                        avatar === url ? 'border-coral-500 scale-110 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-obsidian-900 mb-1">
                  Short Bio
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell other dog parents about yourself..."
                  className="w-full px-3.5 py-2 rounded-xl border border-obsidian-300 text-xs outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-primary text-white py-3 rounded-2xl font-black text-xs shadow-glow-coral cursor-pointer"
              >
                Complete Registration & Log In 🚀
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
