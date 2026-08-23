import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { smsGatewayService, SmsProviderType } from '../../services/smsGatewayService';
import { firebaseAuthService } from '../../services/firebaseAuthService';
import { mapService } from '../../services/mapService';
import { LocationPicker } from '../map/LocationPicker';
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
  Settings,
  Radio,
  Flame,
  HelpCircle,
  Clipboard,
  Loader2,
  Upload,
  Camera,
  Check,
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: 'phone' | 'otp' | 'profile';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialStep = 'phone' }) => {
  const {
    currentUser,
    allUsers,
    sendOtp,
    verifyOtp,
    completeRegistration,
    authPromptReason,
  } = useApp();

  const { playSuccessChime, playPawPop } = useAudio();

  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>(initialStep);
  const countryCode = '+91';
  const [phoneDigits, setPhoneDigits] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // New Profile Data for Indian Cities
  const [name, setName] = useState('');
  const [role, setRole] = useState<'owner' | 'adopter'>('adopter');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('Loving dog parent seeking a furry companion to give a caring home!');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchLiveLocation = async () => {
    try {
      const loc = await mapService.getUserLocation();
      if (loc && loc.displayName) {
        setLocation(loc.displayName);
      }
    } catch (e) {
      console.warn('Could not auto-fetch live location:', e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (currentUser) {
        // Logged in user editing profile
        setStep('profile');
        setName(currentUser.name || '');
        setPhoneDigits(currentUser.phone ? currentUser.phone.replace(/\D/g, '').slice(-10) : '');
        setBio(currentUser.bio || 'Loving dog parent seeking a furry companion to give a caring home!');
        setAvatar(currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400');
        setRole(currentUser.role === 'owner' ? 'owner' : 'adopter');
        if (currentUser.location && currentUser.location !== 'Kolkata, Salt Lake' && currentUser.location !== 'India') {
          setLocation(currentUser.location);
        } else {
          fetchLiveLocation();
        }
      } else {
        setStep('phone');
        fetchLiveLocation();
      }
    }
  }, [isOpen, currentUser]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  useEffect(() => {
    if (isOpen && step === 'phone') {
      const timer = setTimeout(() => {
        const verifier = firebaseAuthService.setupRecaptcha('recaptcha-box');
        if (verifier) {
          verifier.render().catch(() => {});
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, step]);

  if (!isOpen) return null;

  const fullPhone = `${countryCode} ${phoneDigits.trim()}`;

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneDigits(digits);
    if (errorMsg) setErrorMsg('');
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    const cleaned = phoneDigits.replace(/\D/g, '');

    // Strict Indian mobile validation: 10 digits starting with 6, 7, 8, or 9
    if (cleaned.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (!/^[6-9]/.test(cleaned)) {
      setErrorMsg('Indian mobile numbers must begin with 6, 7, 8, or 9.');
      return;
    }

    playPawPop();
    setIsSendingOtp(true);

    try {
      const result = await sendOtp(fullPhone);
      if (!result.success) {
        setErrorMsg(result.message || 'Failed to dispatch SMS OTP. Check your connection.');
        setIsSendingOtp(false);
        return;
      }

      setStep('otp');
      setResendTimer(30);
      setOtpDigits(['', '', '', '', '', '']);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to send SMS OTP.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, '');
    if (!cleanVal && val !== '') return;

    const digit = cleanVal.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    // Auto-focus next input when digit is entered
    if (digit && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otpDigits[index]) {
        // Clear current digit
        const newDigits = [...otpDigits];
        newDigits[index] = '';
        setOtpDigits(newDigits);
      } else if (index > 0) {
        // Clear previous digit and move focus to previous input box
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        prevInput?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    } else if (e.key === 'Enter') {
      handleVerifyOtp(e);
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newDigits = ['', '', '', '', '', ''];
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i];
      }
      setOtpDigits(newDigits);
      const targetIdx = Math.min(pasted.length, 5);
      const targetInput = document.getElementById(`otp-input-${targetIdx}`);
      targetInput?.focus();
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    const code = otpDigits.join('').trim();
    if (code.length < 4) {
      setErrorMsg('Please enter the 6-digit OTP sent to your Indian mobile phone.');
      return;
    }

    playPawPop();
    setIsVerifying(true);

    try {
      if (firebaseAuthService.isConfigured()) {
        const fbResult = await firebaseAuthService.verifyOtp(code);
        if (!fbResult.success) {
          setErrorMsg(fbResult.message);
          setIsVerifying(false);
          return;
        }
      }

      const result = verifyOtp(fullPhone, code);
      if (!result.success && !firebaseAuthService.isConfigured()) {
        setErrorMsg(result.message);
        setIsVerifying(false);
        return;
      }

      if (result.isNewUser) {
        setStep('profile');
      } else {
        playSuccessChime();
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'OTP verification failed.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCompleteProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const finalPhone = phoneDigits.trim() ? `+91 ${phoneDigits.trim()}` : (currentUser?.phone || '+91 98765 00000');

    playSuccessChime();
    completeRegistration({
      name: name.trim(),
      phone: finalPhone,
      role,
      location,
      bio,
      avatar,
      isVerified: true,
      homeType: currentUser?.homeType || 'House',
      hasYard: currentUser?.hasYard ?? true,
      otherPets: currentUser?.otherPets || 'None',
      experienceLevel: currentUser?.experienceLevel || 'Intermediate',
    });

    onClose();
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Image size should be less than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setAvatar(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const sampleAvatars = [
    { label: 'Girl 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
    { label: 'Boy 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
    { label: 'Girl 2', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80' },
    { label: 'Boy 2', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
    { label: 'Girl 3', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80' },
    { label: 'Boy 3', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80' },
    { label: 'Dog Lover', url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400&auto=format&fit=crop&q=80' },
    { label: 'Puppy Fan', url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&auto=format&fit=crop&q=80' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-obsidian-950/85 backdrop-blur-xl overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-[#0C1220] rounded-4xl p-6 sm:p-8 shadow-2xl border border-obsidian-200 dark:border-white/10 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200 text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-obsidian-100 dark:bg-white/10 hover:bg-obsidian-200 dark:hover:bg-white/20 flex items-center justify-center text-obsidian-700 dark:text-slate-300 transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* STEP 1: ENTER INDIAN MOBILE NUMBER */}
        {step === 'phone' && (
          <div className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 dark:bg-coral-950/60 text-coral-600 dark:text-coral-400 font-black text-[11px] mb-2 border border-coral-200 dark:border-coral-800/60">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>🇮🇳 Verified Mobile OTP Login</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black font-display text-obsidian-950 dark:text-white">
                Log In to PawConnect
              </h2>

              {authPromptReason ? (
                <p className="text-xs text-coral-700 dark:text-coral-300 bg-coral-50 dark:bg-coral-950/60 p-2.5 rounded-xl border border-coral-200 dark:border-coral-800/60 mt-2 font-semibold">
                  {authPromptReason}
                </p>
              ) : (
                <p className="text-xs text-obsidian-600 dark:text-slate-300 mt-1 leading-relaxed">
                  Enter your 10-digit Indian mobile number to receive a secure SMS verification code on your handset.
                </p>
              )}
            </div>

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-obsidian-900 dark:text-white uppercase tracking-wider mb-1.5">
                  Indian Mobile Number *
                </label>
                
                <div className="flex items-center gap-2">
                  
                  {/* Fixed Indian Country Code Badge */}
                  <div className="flex items-center gap-1.5 px-4 py-3.5 rounded-2xl bg-obsidian-100 dark:bg-white/5 border border-obsidian-300 dark:border-white/15 font-black text-xs text-obsidian-900 dark:text-white select-none shrink-0 shadow-inner">
                    <span className="text-base">🇮🇳</span>
                    <span>+91</span>
                  </div>

                  <div className="relative flex-1">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400 dark:text-slate-400" />
                    <input
                      type="tel"
                      required
                      autoFocus
                      maxLength={10}
                      value={phoneDigits}
                      onChange={handlePhoneInputChange}
                      placeholder="e.g. 98765 43210"
                      className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-obsidian-100 dark:bg-white/5 border border-obsidian-200 dark:border-white/15 focus:bg-white dark:focus:bg-[#121A2B] focus:border-coral-500 focus:ring-4 focus:ring-coral-100 dark:focus:ring-coral-500/20 text-sm font-extrabold outline-hidden shadow-inner tracking-wider text-obsidian-900 dark:text-white placeholder:text-obsidian-400 dark:placeholder:text-slate-400"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-obsidian-500 dark:text-slate-400 mt-1">
                  Must be 10 digits starting with 6, 7, 8, or 9
                </p>
              </div>

              {/* Google reCAPTCHA Verification Checkbox Widget */}
              <div id="recaptcha-box" className="flex justify-center my-3 min-h-[78px]"></div>

              {errorMsg && (
                <div className="text-xs font-bold text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 p-2.5 rounded-xl border border-rose-200 dark:border-rose-800/60">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isSendingOtp || phoneDigits.length !== 10}
                className="w-full btn-primary disabled:opacity-50 text-white py-3.5 rounded-2xl font-black text-xs shadow-glow-coral flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] transition-transform"
              >
                {isSendingOtp ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Connecting Google Telecom & Sending SMS...</span>
                  </>
                ) : (
                  <>
                    <span>Send Real OTP to My Phone 📲</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-3 border-t border-obsidian-200 dark:border-white/10 text-center">
              <p className="text-[11px] text-obsidian-500 dark:text-slate-400 font-medium">
                🔒 PawConnect verifies that the OTP entered belongs to the owner of the physical mobile phone.
              </p>
            </div>

          </div>
        )}

        {/* STEP 2: ENTER OTP */}
        {step === 'otp' && (
          <div className="space-y-5">
            <button
              onClick={() => setStep('phone')}
              className="flex items-center gap-1 text-xs font-bold text-obsidian-500 dark:text-slate-400 hover:text-obsidian-900 dark:hover:text-white cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change Mobile Number</span>
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-black text-[11px] mb-2 border border-emerald-200 dark:border-emerald-800/60">
                <Lock className="w-3.5 h-3.5" />
                <span>SMS Dispatched to Phone</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-obsidian-950 dark:text-white">
                Enter 6-Digit OTP 🔑
              </h2>
              <p className="text-xs text-obsidian-600 dark:text-slate-300 mt-1 leading-relaxed">
                We sent a verification code to <strong className="text-obsidian-950 dark:text-white">+91 {phoneDigits}</strong>. Please check the SMS message on your mobile phone.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              
              {/* 6 Digit Inputs */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 py-2">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    autoFocus={idx === 0}
                    onPaste={handleOtpPaste}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    onKeyDown={e => handleKeyDown(idx, e)}
                    className="w-11 sm:w-13 h-12 sm:h-14 text-center text-xl sm:text-2xl font-black rounded-2xl bg-obsidian-100 dark:bg-white/5 border-2 border-obsidian-300 dark:border-white/15 focus:border-coral-500 focus:bg-white dark:focus:bg-[#121A2B] focus:ring-4 focus:ring-coral-100 dark:focus:ring-coral-500/20 text-obsidian-950 dark:text-white outline-hidden transition-all shadow-inner"
                  />
                ))}
              </div>

              <div className="text-center">
                <p className="text-[11px] text-obsidian-500 dark:text-slate-400 font-medium">
                  💬 A real SMS notification with your verification code was sent to <strong className="text-obsidian-900 dark:text-white">+91 {phoneDigits}</strong>.
                </p>
              </div>

              {errorMsg && (
                <div className="text-xs font-bold text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 p-2.5 rounded-xl border border-rose-200 dark:border-rose-800/60">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying || otpDigits.join('').trim().length < 4}
                className="w-full btn-primary disabled:opacity-50 text-white py-3.5 rounded-2xl font-black text-xs shadow-glow-coral flex items-center justify-center gap-2 cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying with Google Firebase...</span>
                  </>
                ) : (
                  <>
                    <span>Verify OTP & Enter PawConnect 🐾</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </>
                )}
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

        {/* STEP 3: USER PROFILE SETUP & EDIT */}
        {step === 'profile' && (
          <div className="space-y-5">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-black text-[11px] mb-2 border border-emerald-200 dark:border-emerald-800/60">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Verified Mobile: +91 {phoneDigits || (currentUser?.phone ? currentUser.phone.replace(/\D/g, '').slice(-10) : '')}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-obsidian-950 dark:text-white">
                {currentUser ? 'Edit Profile & Photo ✏️' : 'Set Up Your Profile 🐶'}
              </h2>
              <p className="text-xs text-obsidian-600 dark:text-slate-300 mt-1 leading-relaxed">
                {currentUser ? 'Update your name, avatar, bio and city location.' : 'Your mobile number is verified! Personalize your community profile.'}
              </p>
            </div>

            <form onSubmit={handleCompleteProfile} className="space-y-4 text-left">
              
              {/* 📸 Enhanced Profile Photo Selection & Device Upload */}
              <div className="p-4 rounded-3xl bg-obsidian-50 dark:bg-white/5 border border-obsidian-200/80 dark:border-white/10 space-y-3.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-obsidian-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-coral-500" />
                    <span>Choose Profile Photo</span>
                  </span>
                  
                  {/* Upload Custom Photo Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-500/10 dark:bg-coral-500/20 text-[11px] font-extrabold text-coral-600 dark:text-coral-300 hover:bg-coral-500/20 transition-colors border border-coral-200 dark:border-coral-500/30 cursor-pointer"
                  >
                    <Upload className="w-3 h-3" />
                    <span>Upload from Device</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>

                {/* Main Avatar Preview + Avatars List */}
                <div className="flex items-center gap-4">
                  {/* Selected Preview */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative shrink-0 cursor-pointer group"
                    title="Click to upload custom photo"
                  >
                    <img
                      src={avatar}
                      alt="Selected Profile"
                      className="w-16 h-16 rounded-2xl object-cover ring-3 ring-coral-500 dark:ring-coral-400 shadow-md group-hover:opacity-90 transition-opacity"
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-coral-500 text-white flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform ring-2 ring-white dark:ring-[#0C1220]">
                      <Camera className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Curated Avatars Horizontal Carousel */}
                  <div className="flex-1 overflow-x-auto pb-1 no-scrollbar">
                    <div className="flex items-center gap-2.5">
                      {sampleAvatars.map((item, i) => {
                        const isSelected = avatar === item.url;
                        return (
                          <div
                            key={i}
                            onClick={() => setAvatar(item.url)}
                            className={`relative shrink-0 cursor-pointer transition-all rounded-full p-0.5 ${
                              isSelected ? 'ring-2 ring-coral-500 scale-110' : 'opacity-60 hover:opacity-100 hover:scale-105'
                            }`}
                            title={item.label}
                          >
                            <img
                              src={item.url}
                              alt={item.label}
                              className="w-10 h-10 rounded-full object-cover shadow-xs"
                            />
                            {isSelected && (
                              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-coral-500 text-white flex items-center justify-center text-[9px] font-black ring-1 ring-white dark:ring-[#0C1220]">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-black text-obsidian-900 dark:text-white uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Anand Kumar"
                  className="w-full px-4 py-3 rounded-2xl bg-obsidian-100 dark:bg-white/5 border border-obsidian-200 dark:border-white/15 focus:bg-white dark:focus:bg-[#121A2B] focus:border-coral-500 focus:ring-4 focus:ring-coral-100 dark:focus:ring-coral-500/20 text-xs sm:text-sm font-extrabold outline-hidden shadow-inner text-obsidian-900 dark:text-white transition-all"
                />
              </div>

              {/* Account Purpose / Role */}
              <div>
                <label className="block text-xs font-black text-obsidian-900 dark:text-white uppercase tracking-wider mb-1.5">
                  Your Primary Intent:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      playPawPop();
                      setRole('adopter');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      role === 'adopter'
                        ? 'border-coral-500 bg-coral-500/15 dark:bg-coral-500/20 text-obsidian-950 dark:text-white ring-2 ring-coral-500/50 shadow-md'
                        : 'border-obsidian-200 dark:border-white/10 bg-obsidian-100/60 dark:bg-white/5 text-obsidian-700 dark:text-slate-300 hover:bg-obsidian-200 dark:hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-black text-xs">
                      <Heart className={`w-4 h-4 shrink-0 ${role === 'adopter' ? 'text-coral-500 fill-coral-500' : 'text-obsidian-400 dark:text-slate-400'}`} />
                      <span className={role === 'adopter' ? 'text-coral-600 dark:text-coral-300 font-black' : 'text-obsidian-900 dark:text-white font-extrabold'}>
                        Adopt a Dog
                      </span>
                    </div>
                    <div className="font-medium text-[10px] text-obsidian-600 dark:text-slate-300 mt-1 leading-normal">
                      Looking to give a caring home
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      playPawPop();
                      setRole('owner');
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      role === 'owner'
                        ? 'border-coral-500 bg-coral-500/15 dark:bg-coral-500/20 text-obsidian-950 dark:text-white ring-2 ring-coral-500/50 shadow-md'
                        : 'border-obsidian-200 dark:border-white/10 bg-obsidian-100/60 dark:bg-white/5 text-obsidian-700 dark:text-slate-300 hover:bg-obsidian-200 dark:hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-black text-xs">
                      <DogIcon className={`w-4 h-4 shrink-0 ${role === 'owner' ? 'text-coral-500' : 'text-obsidian-400 dark:text-slate-400'}`} />
                      <span className={role === 'owner' ? 'text-coral-600 dark:text-coral-300 font-black' : 'text-obsidian-900 dark:text-white font-extrabold'}>
                        Rehome / Guardian
                      </span>
                    </div>
                    <div className="font-medium text-[10px] text-obsidian-600 dark:text-slate-300 mt-1 leading-normal">
                      List dog for safe adoption
                    </div>
                  </button>
                </div>
              </div>

              {/* City / Area in India */}
              <div>
                <LocationPicker
                  value={location}
                  onChange={loc => {
                    setLocation(loc.displayName);
                  }}
                  label="City / Location in India *"
                  placeholder="Type your Indian city or area (e.g. Patna, Delhi, Mumbai)..."
                />
              </div>

              {/* Short Bio */}
              <div>
                <label className="block text-xs font-black text-obsidian-900 dark:text-white uppercase tracking-wider mb-1.5">
                  Bio / About You
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Tell other dog parents and adopters a little about yourself..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-obsidian-100 dark:bg-white/5 border border-obsidian-200 dark:border-white/15 focus:bg-white dark:focus:bg-[#121A2B] focus:border-coral-500 focus:ring-4 focus:ring-coral-100 dark:focus:ring-coral-500/20 text-xs font-medium outline-hidden shadow-inner text-obsidian-900 dark:text-white resize-none transition-all"
                />
              </div>

              {errorMsg && (
                <div className="text-xs font-bold text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 p-2.5 rounded-xl border border-rose-200 dark:border-rose-800/60">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full btn-primary text-white py-3.5 rounded-2xl font-black text-xs shadow-glow-coral flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01] transition-transform"
              >
                <span>{currentUser ? 'Save & Update Profile ✨' : 'Complete Profile & Enter PawConnect 🎉'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
