import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { AdoptionApplication } from '../../types';
import { AgreementModal } from './AgreementModal';
import { MeetAndGreetModal } from './MeetAndGreetModal';
import {
  CheckCircle2,
  Clock,
  MessageCircle,
  Calendar,
  FileText,
  HeartHandshake,
  Award,
  ShieldCheck,
  UserCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface JourneyTrackerProps {
  application: AdoptionApplication;
}

export const AdoptionJourneyTracker: React.FC<JourneyTrackerProps> = ({ application }) => {
  const {
    currentUser,
    dogs,
    acceptApplication,
    declineApplication,
    meetups,
    agreements,
    handovers,
    confirmHandover,
    setActiveConversationId,
    setActiveTab,
    setViewingCertificateDog,
  } = useApp();

  const { playPawPop, playSuccessChime } = useAudio();

  const [isAgreementOpen, setIsAgreementOpen] = useState(false);
  const [isMeetModalOpen, setIsMeetModalOpen] = useState(false);

  const dog = dogs.find(d => d.id === application.dogId);
  const agreement = agreements.find(a => a.applicationId === application.id) || {
    id: `agree_${application.id}`,
    applicationId: application.id,
    dogId: application.dogId,
    dogName: application.dogName,
    dogBreed: application.dogBreed,
    currentOwnerId: dog?.currentOwnerId || 'user_alex',
    currentOwnerName: dog?.currentOwnerName || 'Alex Rivera',
    adopterId: application.applicantId,
    adopterName: application.applicantName,
    adoptionDate: 'August 18, 2026',
    termsAccepted: true,
    isFullySigned: false
  };

  const handover = handovers.find(h => h.applicationId === application.id) || {
    id: `handover_${application.id}`,
    applicationId: application.id,
    dogId: application.dogId,
    ownerConfirmed: false,
    adopterConfirmed: false,
    isCompleted: false
  };

  const activeMeet = meetups.find(m => m.applicationId === application.id);

  let currentStep = 1;
  if (application.status === 'submitted') currentStep = 2;
  if (application.status === 'accepted') currentStep = 3;
  if (activeMeet) currentStep = 4;
  if (activeMeet?.status === 'completed' || agreement.ownerSignature || agreement.adopterSignature) currentStep = 5;
  if (agreement.isFullySigned) currentStep = 6;
  if (handover.isCompleted || application.status === 'completed') currentStep = 7;

  const isOwner = currentUser?.id === dog?.currentOwnerId;
  const isAdopter = currentUser?.id === application.applicantId;

  const handleOpenChat = () => {
    playPawPop();
    const convId = `conv_${application.dogId}_${application.applicantId}`;
    setActiveConversationId(convId);
    setActiveTab('chat');
  };

  const handleConfirmHandoverAction = () => {
    playSuccessChime();
    const role = isOwner ? 'owner' : 'adopter';
    confirmHandover(application.id, role);
  };

  const stages = [
    { num: 1, label: 'Application', desc: 'Screening Form' },
    { num: 2, label: 'Review', desc: 'Owner Decision' },
    { num: 3, label: 'Chat', desc: 'Direct Messages' },
    { num: 4, label: 'Meet & Greet', desc: 'Park Meeting' },
    { num: 5, label: 'Agreement', desc: 'Legal Contract' },
    { num: 6, label: 'Dual Handover', desc: 'Live Transfer' },
  ];

  return (
    <div className="glass-card rounded-4xl p-6 sm:p-8 border border-white dark:border-white/10 shadow-elevated space-y-7 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-obsidian-200 dark:border-white/10">
        <div className="flex items-center gap-4">
          <img
            src={application.dogPhoto}
            alt={application.dogName}
            className="w-16 h-16 rounded-3xl object-cover ring-4 ring-coral-300 dark:ring-coral-500/40 shadow-md shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl sm:text-2xl font-black font-display text-obsidian-950 dark:text-white">
                {application.dogName}&apos;s Adoption Journey
              </h3>
              <span className="px-3 py-0.5 rounded-full bg-coral-50 dark:bg-coral-950/60 text-coral-600 dark:text-coral-400 text-xs font-black border border-coral-200 dark:border-coral-800/60">
                {application.dogBreed}
              </span>
            </div>
            <p className="text-xs text-obsidian-500 dark:text-slate-400 font-medium mt-0.5">
              Applicant: <strong className="text-obsidian-900 dark:text-white">{application.applicantName}</strong> • Submitted: {application.submittedAt}
            </p>
          </div>
        </div>

        <div>
          {currentStep >= 7 ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-black text-xs border border-emerald-300 dark:border-emerald-800/60 shadow-xs">
              <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Adoption Completed 🎉</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 font-extrabold text-xs border border-sky-200 dark:border-sky-800/60">
              <Clock className="w-4 h-4 text-sky-600 dark:text-sky-400 animate-spin" />
              <span>Stage {Math.min(currentStep, 6)} of 6 Active</span>
            </div>
          )}
        </div>
      </div>

      {/* 6-STAGE PROGRESS BAR */}
      <div className="overflow-x-auto pb-3">
        <div className="flex items-center justify-between min-w-[650px] relative px-4">
          
          <div className="absolute top-[22px] left-12 right-12 h-1 bg-obsidian-200 dark:bg-white/10 -z-0 rounded-full" />
          <div
            className="absolute top-[22px] left-12 h-1 bg-gradient-to-r from-emerald-500 via-coral-500 to-sky-500 transition-all duration-500 -z-0 rounded-full shadow-xs"
            style={{ width: `${Math.min(((currentStep - 1) / 5) * 100, 100)}%` }}
          />

          {stages.map((stage) => {
            const isCompleted = currentStep > stage.num || (stage.num === 6 && currentStep >= 7);
            const isCurrent = currentStep === stage.num;
            return (
              <div key={stage.num} className="flex flex-col items-center text-center relative z-10 w-24">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-xs transition-all ${
                    isCompleted
                      ? 'bg-emerald-500 text-white border-2 border-emerald-300 dark:border-emerald-400 shadow-md shadow-emerald-500/30'
                      : isCurrent
                      ? 'bg-coral-500 text-white border-2 border-white dark:border-coral-300 shadow-glow-coral'
                      : 'bg-[#101726] border-2 border-obsidian-300 dark:border-white/15 text-obsidian-400 dark:text-slate-500 shadow-inner'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5 text-white" /> : stage.num}
                </div>
                <div className="mt-2.5 text-xs font-extrabold text-obsidian-950 dark:text-white leading-tight">
                  {stage.label}
                </div>
                <div className="text-[10px] text-obsidian-400 dark:text-slate-400 font-semibold mt-0.5">
                  {stage.desc}
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* STAGE ACTION BLOCKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        
        {/* LEFT: Application Questionnaire Summary */}
        <div className="p-5 rounded-3xl bg-obsidian-100/90 dark:bg-[#101726] border border-obsidian-200 dark:border-white/10 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-obsidian-400 dark:text-slate-400">
              Submitted Questionnaire
            </span>
            {application.status === 'accepted' || currentStep >= 3 ? (
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200 dark:border-emerald-800/60">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Screening Approved ✓</span>
              </span>
            ) : (
              <span className="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-200 dark:border-amber-800/60">
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Under Review ⏳</span>
              </span>
            )}
          </div>

          <div className="space-y-2.5 text-xs text-obsidian-800 dark:text-slate-200">
            <div>
              <span className="font-bold text-obsidian-950 dark:text-white">Why Adopt:</span>
              <p className="italic text-obsidian-700 dark:text-slate-300 mt-0.5 font-medium leading-relaxed">&ldquo;{application.reason}&rdquo;</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-obsidian-400 dark:text-slate-400 text-[11px] font-bold">Home Type:</span>
                <div className="font-extrabold text-obsidian-900 dark:text-white">{application.homeType} (Yard: {application.hasYard ? 'Yes ✓' : 'No'})</div>
              </div>
              <div>
                <span className="text-obsidian-400 dark:text-slate-400 text-[11px] font-bold">Other Pets:</span>
                <div className="font-extrabold text-obsidian-900 dark:text-white">{application.otherPets}</div>
              </div>
            </div>
            <div className="pt-1">
              <span className="text-obsidian-400 dark:text-slate-400 text-[11px] font-bold">Work Routine:</span>
              <div className="font-bold text-obsidian-900 dark:text-white">{application.workSchedule}</div>
            </div>
          </div>

          {application.status === 'submitted' && isOwner && (
            <div className="pt-3 border-t border-obsidian-200 dark:border-white/10 flex items-center gap-2">
              <button
                onClick={() => {
                  playSuccessChime();
                  acceptApplication(application.id);
                }}
                className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-soft transition-all cursor-pointer"
              >
                ✓ Accept Application
              </button>
              <button
                onClick={() => {
                  playPawPop();
                  declineApplication(application.id);
                }}
                className="px-4 py-3 rounded-2xl border border-obsidian-300 dark:border-white/15 hover:bg-obsidian-200 dark:hover:bg-white/10 text-obsidian-700 dark:text-slate-300 font-bold text-xs cursor-pointer"
              >
                Decline
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: Active Action Step */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-coral-50/70 via-white to-amber-50/50 dark:from-[#151D30] dark:via-[#131B2C] dark:to-[#171F33] border border-coral-200 dark:border-coral-500/30 flex flex-col justify-between space-y-4 shadow-sm">
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-coral-600 dark:text-coral-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next Immediate Action</span>
              </span>
            </div>

            {/* Stage 2: Under Review */}
            {currentStep === 2 && (
              <div className="space-y-2.5">
                <h4 className="font-black text-base text-obsidian-950 dark:text-white">
                  Application Under Review ⏳
                </h4>
                <p className="text-xs text-obsidian-600 dark:text-slate-300 leading-relaxed font-medium">
                  {isOwner
                    ? `Review ${application.applicantName}'s living details on the left and click Accept to unlock direct chat & meetup scheduling.`
                    : `Your application has been received by ${dog?.currentOwnerName || 'the guardian'}. You will be notified as soon as they approve it!`}
                </p>
                <button
                  onClick={() => {
                    playSuccessChime();
                    acceptApplication(application.id);
                  }}
                  className="w-full btn-primary text-white py-3.5 rounded-2xl font-black text-xs shadow-glow-coral flex items-center justify-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>✓ Approve Application (Unlock Stage 3 & 4)</span>
                </button>
              </div>
            )}

            {/* Stage 3: Chat */}
            {currentStep === 3 && (
              <div className="space-y-2.5">
                <h4 className="font-black text-base text-obsidian-950 dark:text-white">
                  Private Chat Unlocked!
                </h4>
                <p className="text-xs text-obsidian-600 dark:text-slate-300 leading-relaxed font-medium">
                  Coordinate directly with the guardian, ask questions, and prepare for the park Meet & Greet.
                </p>
                <button
                  onClick={handleOpenChat}
                  className="w-full btn-primary text-white py-3 rounded-2xl font-black text-xs shadow-glow-coral flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open Live Chat with {isOwner ? application.applicantName : dog?.currentOwnerName}</span>
                </button>
              </div>
            )}

            {/* Stage 4: Meet & Greet */}
            {currentStep === 4 && (
              <div className="space-y-2.5">
                <h4 className="font-black text-base text-obsidian-950 dark:text-white">
                  Meet & Greet Protocol
                </h4>
                <p className="text-xs text-obsidian-600 dark:text-slate-300 leading-relaxed font-medium">
                  {activeMeet ? `Scheduled for ${activeMeet.date} at ${activeMeet.locationName}.` : 'Schedule a public dog park meetup.'}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsMeetModalOpen(true)}
                    className="flex-1 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs shadow-glow-sky transition-all cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 inline mr-1" />
                    <span>{activeMeet ? 'Update Meetup' : 'Schedule Meet & Greet'}</span>
                  </button>
                  <button
                    onClick={handleOpenChat}
                    className="px-4 py-3 rounded-2xl border border-obsidian-300 dark:border-white/15 bg-white dark:bg-white/10 font-bold text-xs text-obsidian-800 dark:text-white cursor-pointer"
                  >
                    Chat
                  </button>
                </div>
              </div>
            )}

            {/* Stage 5: Agreement Signing */}
            {currentStep === 5 && (
              <div className="space-y-2.5">
                <h4 className="font-black text-base text-obsidian-950 dark:text-white">
                  Digital Adoption Agreement
                </h4>
                <p className="text-xs text-obsidian-600 dark:text-slate-300 leading-relaxed font-medium">
                  Review legal welfare terms, vet care commitments, and provide digital signature.
                </p>
                <button
                  onClick={() => setIsAgreementOpen(true)}
                  className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-soft transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>
                    {agreement.isFullySigned ? 'View Signed Agreement ✓' : 'Review & Sign Agreement ✍️'}
                  </span>
                </button>
              </div>
            )}

            {/* Stage 6: Dual Handover Confirmation */}
            {currentStep === 6 && (
              <div className="space-y-3">
                <h4 className="font-black text-base text-obsidian-950 dark:text-white flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-coral-600 dark:text-coral-400" />
                  <span>Dual Confirmation Handover</span>
                </h4>
                <p className="text-xs text-obsidian-600 dark:text-slate-300 leading-relaxed font-medium">
                  Both original guardian and adopter must click confirm upon physical handover to execute digital ownership transfer.
                </p>

                <div className="space-y-1.5 text-xs bg-white dark:bg-[#0E1524] p-3.5 rounded-2xl border border-coral-200 dark:border-white/10">
                  <div className="flex items-center justify-between font-bold text-obsidian-900 dark:text-white">
                    <span>Owner Handover Confirmation:</span>
                    <span className={handover.ownerConfirmed ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                      {handover.ownerConfirmed ? 'Confirmed ✓' : 'Pending...'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between font-bold text-obsidian-900 dark:text-white">
                    <span>Adopter Received Confirmation:</span>
                    <span className={handover.adopterConfirmed ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                      {handover.adopterConfirmed ? 'Confirmed ✓' : 'Pending...'}
                    </span>
                  </div>
                </div>

                {isOwner && !handover.ownerConfirmed && (
                  <button
                    onClick={handleConfirmHandoverAction}
                    className="w-full py-3.5 rounded-2xl btn-primary text-white font-black text-xs shadow-glow-coral cursor-pointer"
                  >
                    🐾 Guardian: Confirm Handover of {application.dogName}
                  </button>
                )}

                {isAdopter && !handover.adopterConfirmed && (
                  <button
                    onClick={handleConfirmHandoverAction}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-coral-500 via-coral-600 to-amber-500 text-white font-black text-xs shadow-glow-coral cursor-pointer"
                  >
                    🐾 Adopter: Confirm Received {application.dogName}
                  </button>
                )}
              </div>
            )}

            {/* Stage 7+: Completed Certificate */}
            {currentStep >= 7 && (
              <div className="space-y-2 text-center py-2">
                <div className="text-4xl animate-bounce">🏆✨</div>
                <h4 className="font-black text-base text-emerald-950 dark:text-emerald-300">
                  Official Adoption Completed!
                </h4>
                <p className="text-xs text-obsidian-600 dark:text-slate-300 font-medium">
                  {application.dogName} is now officially registered under {application.applicantName}.
                </p>
                <button
                  onClick={() => {
                    playPawPop();
                    if (dog) setViewingCertificateDog(dog);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-glow-amber transition-all cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>View Official Certificate 📜</span>
                </button>
              </div>
            )}

          </div>

          <div className="text-[11px] text-obsidian-500 dark:text-slate-400 pt-2 border-t border-coral-200 dark:border-white/10 flex items-center gap-1.5 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Protected by PawConnect Verified Adoption Registry</span>
          </div>

        </div>

      </div>

      <AgreementModal
        isOpen={isAgreementOpen}
        onClose={() => setIsAgreementOpen(false)}
        agreement={agreement}
      />

      <MeetAndGreetModal
        isOpen={isMeetModalOpen}
        onClose={() => setIsMeetModalOpen(false)}
        dogId={application.dogId}
        dogName={application.dogName}
        applicationId={application.id}
        adopterId={application.applicantId}
      />

    </div>
  );
};
