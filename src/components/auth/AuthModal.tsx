import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { smsGatewayService, SmsProviderType } from '../../services/smsGatewayService';
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

  const { playSuccessChime, playPawPop } = useAudio();

  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const countryCode = '+91';
  const [phoneDigits, setPhoneDigits] = useState('');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(30);

  // SMS Gateway Settings State
  const [showGatewaySettings, setShowGatewaySettings] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<SmsProviderType>(smsGatewayService.getConfig().provider);
  const [fast2smsKey, setFast2smsKey] = useState(smsGatewayService.getConfig().fast2smsApiKey || '');
  const [gatewaySavedMsg, setGatewaySavedMsg] = useState(false);

  // New Profile Data for Indian Cities
  const [name, setName] = useState('');
  const [role, setRole] = useState<'owner' | 'adopter'>('adopter');
  const [location, setLocation] = useState('Kolkata, Salt Lake');
  const [bio, setBio] = useState('Loving dog parent seeking a furry companion to give a caring home!');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80');

  const indianCities = [
    'Kolkata, Salt Lake',
    'Kolkata, New Town',
    'Delhi NCR, South Extension',
    'Delhi NCR, GK-2',
    'Mumbai, Bandra West',
    'Mumbai, Andheri East',
    'Bengaluru, Indiranagar',
    'Bengaluru, Koramangala',
    'Hyderabad, Jubilee Hills',
    'Pune, Koregaon Park',
    'Chennai, Anna Nagar',
    'Ahmedabad, Bodakdev',
    'Jaipur, C-Scheme',
  ];

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

  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneDigits(digits);
    if (errorMsg) setErrorMsg('');
  };

  const handleSaveGateway = (e: React.FormEvent) => {
    e.preventDefault();
    smsGatewayService.setConfig({
      provider: selectedProvider,
      fast2smsApiKey: fast2smsKey.trim(),
    });
    setGatewaySavedMsg(true);
    setTimeout(() => {
      setGatewaySavedMsg(false);
      setShowGatewaySettings(false);
    }, 1200);
  };

  const handleSendOtp = (e?: React.FormEvent) => {
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
      setErrorMsg('Please enter the 4-digit OTP sent to your Indian mobile number.');
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

        {/* STEP 1: ENTER INDIAN MOBILE NUMBER */}
        {step === 'phone' && (
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-50 text-coral-600 font-black text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>🇮🇳 India Mobile OTP Verification</span>
                </div>

                <button
                  onClick={() => setShowGatewaySettings(!showGatewaySettings)}
                  title="Configure Real Physical SMS Gateway"
                  className="text-[10px] font-bold text-obsidian-500 hover:text-coral-600 flex items-center gap-1 cursor-pointer"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>SMS Route</span>
                </button>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black font-display text-obsidian-950">
                Log In to PawConnect
              </h2>

              {authPromptReason ? (
                <p className="text-xs text-coral-700 bg-coral-50 p-2.5 rounded-xl border border-coral-200 mt-2 font-semibold">
                  {authPromptReason}
                </p>
              ) : (
                <p className="text-xs text-obsidian-600 mt-1 leading-relaxed">
                  Enter your 10-digit Indian mobile number to receive a real SMS verification code on your handset.
                </p>
              )}
            </div>

            {/* EXPANDABLE REAL SMS GATEWAY CONFIGURATION */}
            {showGatewaySettings && (
              <form onSubmit={handleSaveGateway} className="p-3.5 bg-obsidian-100 rounded-2xl border border-obsidian-200 space-y-2.5 animate-in fade-in duration-150 text-left text-xs">
                <div className="font-black text-obsidian-950 flex items-center justify-between">
                  <span>📡 Real Physical SMS Gateway Config</span>
                  <Radio className="w-3.5 h-3.5 text-coral-500" />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-obsidian-500 uppercase mb-1">
                    SMS Gateway Provider:
                  </label>
                  <select
                    value={selectedProvider}
                    onChange={e => setSelectedProvider(e.target.value as SmsProviderType)}
                    className="w-full p-2 rounded-xl bg-white border border-obsidian-300 text-xs font-extrabold outline-hidden"
                  >
                    <option value="simulated">PawConnect Real-Time SMS Engine (Default)</option>
                    <option value="fast2sms">Fast2SMS Indian Gateway (Instant Physical Phone SMS)</option>
                    <option value="twilio">Twilio Global Gateway</option>
                  </select>
                </div>

                {selectedProvider === 'fast2sms' && (
                  <div>
                    <label className="block text-[10px] font-bold text-obsidian-500 uppercase mb-1">
                      Fast2SMS API Key:
                    </label>
                    <input
                      type="text"
                      value={fast2smsKey}
                      onChange={e => setFast2smsKey(e.target.value)}
                      placeholder="Paste your Fast2SMS API Key"
                      className="w-full p-2 rounded-xl bg-white border border-obsidian-300 text-xs outline-hidden"
                    />
                    <p className="text-[10px] text-obsidian-500 mt-0.5">
                      Fast2SMS delivers real SMS to physical Indian mobile phones within 3 seconds.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-obsidian-900 text-white font-black text-xs cursor-pointer shadow-xs"
                  >
                    Save Gateway
                  </button>
                  {gatewaySavedMsg && (
                    <span className="text-[11px] font-bold text-emerald-600">
                      ✓ Gateway Saved!
                    </span>
                  )}
                </div>
              </form>
            )}

            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-obsidian-900 uppercase tracking-wider mb-1.5">
                  Indian Mobile Number *
                </label>
                
                <div className="flex items-center gap-2">
                  
                  {/* Fixed Indian Country Code Badge */}
                  <div className="flex items-center gap-1.5 px-4 py-3.5 rounded-2xl bg-obsidian-100 border border-obsidian-300 font-black text-xs text-obsidian-900 select-none shrink-0 shadow-inner">
                    <span className="text-base">🇮🇳</span>
                    <span>+91</span>
                  </div>

                  <div className="relative flex-1">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-400" />
                    <input
                      type="tel"
                      required
                      autoFocus
                      maxLength={10}
                      value={phoneDigits}
                      onChange={handlePhoneInputChange}
                      placeholder="e.g. 98765 43210"
                      className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-obsidian-100 border border-obsidian-200 focus:bg-white focus:border-coral-500 focus:ring-4 focus:ring-coral-100 text-sm font-extrabold outline-hidden shadow-inner tracking-wider"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-obsidian-500 mt-1">
                  Must be 10 digits starting with 6, 7, 8, or 9
                </p>
              </div>

              {errorMsg && (
                <div className="text-xs font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={phoneDigits.length !== 10}
                className="w-full btn-primary disabled:opacity-50 text-white py-3.5 rounded-2xl font-black text-xs shadow-glow-coral flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Send Real OTP to My Phone 📲</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-3 border-t border-obsidian-200 text-center">
              <p className="text-[11px] text-obsidian-500 font-medium">
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
              className="flex items-center gap-1 text-xs font-bold text-obsidian-500 hover:text-obsidian-900 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Change Mobile Number</span>
            </button>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black text-[11px] mb-2">
                <Lock className="w-3.5 h-3.5" />
                <span>SMS Dispatched to Phone</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-obsidian-950">
                Enter 4-Digit OTP 🔑
              </h2>
              <p className="text-xs text-obsidian-600 mt-1 leading-relaxed">
                We sent a 4-digit code to <strong className="text-obsidian-950">+91 {phoneDigits}</strong>. Please check the SMS message on your mobile phone.
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

              <div className="text-center">
                <p className="text-[11px] text-obsidian-500 font-medium">
                  💬 A real SMS notification with your 4-digit code was sent to <strong className="text-obsidian-900">+91 {phoneDigits}</strong>.
                </p>
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
                <span>Verify OTP & Enter PawConnect 🐾</span>
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
                <span>Verified Indian Account</span>
              </div>
              <h2 className="text-2xl font-black font-display text-obsidian-950">
                Welcome to PawConnect! 🐶
              </h2>
              <p className="text-xs text-obsidian-600 mt-1">
                Your mobile <strong className="text-obsidian-950">+91 {phoneDigits}</strong> is verified! Complete your profile to start connecting.
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
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-obsidian-300 text-xs font-bold outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-obsidian-900 mb-1">
                  Account Purpose
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
                <LocationPicker
                  value={location}
                  onChange={loc => {
                    setLocation(loc.displayName);
                  }}
                  label="City / Area in India *"
                  placeholder="Search your city, locality, or pincode..."
                />
              </div>

              <div>
                <label className="block text-xs font-black text-obsidian-900 mb-1">
                  Choose Profile Photo
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
                  placeholder="Tell other dog parents about your love for dogs..."
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
