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
  ArrowRight,
  ShieldCheck,
  UserCheck,
  MapPin,
  Sparkles,
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

  // Compute Current Active Step (1 to 6)
  let currentStep = 1;
  if (application.status === 'submitted') currentStep = 2; // Needs owner review
  if (application.status === 'accepted') currentStep = 3; // Chat unlocked
  if (activeMeet) currentStep = 4; // Meetup scheduled
  if (activeMeet?.status === 'completed' || agreement.ownerSignature || agreement.adopterSignature) currentStep = 5; // Agreement
  if (agreement.isFullySigned) currentStep = 6; // Handover confirmation
  if (handover.isCompleted || application.status === 'completed') currentStep = 7; // Completed

  const isOwner = currentUser.id === dog?.currentOwnerId;
  const isAdopter = currentUser.id === application.applicantId;

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
    { num: 1, label: 'Application Form', desc: 'Verified Questionnaire' },
    { num: 2, label: 'Owner Review', desc: 'Acceptance Decision' },
    { num: 3, label: 'Private Chat', desc: 'Direct Communication' },
    { num: 4, label: 'Meet & Greet', desc: 'Park Interaction' },
    { num: 5, label: 'Agreement Signed', desc: 'Legal Contract' },
    { num: 6, label: 'Dual Handover', desc: 'Official Transfer' },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-obsidian-400/50 shadow-soft space-y-6 text-left">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-obsidian-400/40">
        <div className="flex items-center gap-4">
          <img
            src={application.dogPhoto}
            alt={application.dogName}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-coral-400 shrink-0"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black font-display text-obsidian-900">
                {application.dogName}&apos;s Adoption Journey
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-coral-50 text-coral-700 text-xs font-bold border border-coral-200">
                {application.dogBreed}
              </span>
            </div>
            <p className="text-xs text-obsidian-600 mt-0.5">
              Applicant: <strong>{application.applicantName}</strong> • Submitted: {application.submittedAt}
            </p>
          </div>
        </div>

        {/* Current State Pill */}
        <div>
          {currentStep >= 7 ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-black text-xs border border-emerald-200 shadow-xs">
              <Award className="w-4 h-4 text-emerald-600" />
              <span>Adoption Completed 🎉</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 text-sky-700 font-bold text-xs border border-sky-200">
              <Clock className="w-4 h-4 text-sky-600 animate-spin" />
              <span>Stage {Math.min(currentStep, 6)} of 6 Active</span>
            </div>
          )}
        </div>
      </div>

      {/* VISUAL 6-STAGE TIMELINE */}
      <div className="overflow-x-auto pb-2">
        <div className="flex items-center justify-between min-w-[650px] relative">
          
          {/* Background Connecting Line */}
          <div className="absolute top-5 left-6 right-6 h-1 bg-obsidian-300 -z-0" />
          <div
            className="absolute top-5 left-6 h-1 bg-gradient-to-r from-coral-500 via-sky-500 to-emerald-500 transition-all duration-500 -z-0"
            style={{ width: `${Math.min(((currentStep - 1) / 5) * 100, 100)}%` }}
          />

          {stages.map((stage) => {
            const isCompleted = currentStep > stage.num || (stage.num === 6 && currentStep >= 7);
            const isCurrent = currentStep === stage.num;
            return (
              <div key={stage.num} className="flex flex-col items-center text-center relative z-10 w-24">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xs transition-all shadow-md ${
                    isCompleted
                      ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                      : isCurrent
                      ? 'bg-coral-500 text-white ring-4 ring-coral-100 scale-110'
                      : 'bg-white border-2 border-obsidian-400 text-obsidian-500'
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : stage.num}
                </div>
                <div className="mt-2 text-xs font-bold text-obsidian-900 leading-tight">
                  {stage.label}
                </div>
                <div className="text-[10px] text-obsidian-500 mt-0.5">
                  {stage.desc}
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* DETAILED ACTIVE STAGE ACTION CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        
        {/* LEFT BOX: Applicant Details & Questionnaire Summary */}
        <div className="p-4 sm:p-5 rounded-2xl bg-obsidian-300/30 border border-obsidian-400/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-obsidian-500">
              Application Details
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Verified Living Profile</span>
            </span>
          </div>

          <div className="space-y-2 text-xs text-obsidian-800">
            <div>
              <span className="font-bold text-obsidian-900">Applicant Reason:</span>
              <p className="italic text-obsidian-700 mt-0.5">&ldquo;{application.reason}&rdquo;</p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <span className="text-obsidian-500 text-[11px]">Home Type:</span>
                <div className="font-bold">{application.homeType} (Yard: {application.hasYard ? 'Yes ✓' : 'No'})</div>
              </div>
              <div>
                <span className="text-obsidian-500 text-[11px]">Other Pets:</span>
                <div className="font-bold">{application.otherPets}</div>
              </div>
            </div>
            <div className="pt-1">
              <span className="text-obsidian-500 text-[11px]">Work Schedule:</span>
              <div className="font-bold">{application.workSchedule}</div>
            </div>
          </div>

          {/* Owner Review Actions (If pending review) */}
          {application.status === 'submitted' && isOwner && (
            <div className="pt-3 border-t border-obsidian-400/40 flex items-center gap-2">
              <button
                onClick={() => {
                  playSuccessChime();
                  acceptApplication(application.id);
                }}
                className="flex-1 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-soft transition-all"
              >
                ✓ Accept Application
              </button>
              <button
                onClick={() => {
                  playPawPop();
                  declineApplication(application.id);
                }}
                className="px-4 py-2.5 rounded-full border border-obsidian-400 hover:bg-obsidian-300 text-obsidian-700 font-bold text-xs transition-all"
              >
                Decline
              </button>
            </div>
          )}
        </div>

        {/* RIGHT BOX: Dynamic Stage Actions (Chat, Meetup, Agreement, Dual Handover) */}
        <div className="p-4 sm:p-5 rounded-2xl bg-coral-50/40 border border-coral-200/80 flex flex-col justify-between space-y-4">
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-coral-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next Immediate Action</span>
              </span>
            </div>

            {/* Stage 3: Chat */}
            {currentStep === 3 && (
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-obsidian-900">
                  Private Chat is Unlocked!
                </h4>
                <p className="text-xs text-obsidian-600 leading-relaxed">
                  Start coordinating directly with the guardian. Ask about routines, favorite snacks, or prepare for the Meet & Greet.
                </p>
                <button
                  onClick={handleOpenChat}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-bold text-xs shadow-soft transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Open Chat with {isOwner ? application.applicantName : dog?.currentOwnerName}</span>
                </button>
              </div>
            )}

            {/* Stage 4: Meet & Greet */}
            {currentStep === 4 && (
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-obsidian-900">
                  Meet & Greet Protocol
                </h4>
                <p className="text-xs text-obsidian-600 leading-relaxed">
                  {activeMeet ? `Scheduled for ${activeMeet.date} at ${activeMeet.locationName}.` : 'Schedule a public dog park meetup.'}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsMeetModalOpen(true)}
                    className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-soft transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5 inline mr-1" />
                    <span>{activeMeet ? 'Update Meetup' : 'Schedule Meet & Greet'}</span>
                  </button>
                  <button
                    onClick={handleOpenChat}
                    className="px-4 py-2.5 rounded-xl border border-obsidian-400 bg-white font-bold text-xs text-obsidian-700"
                  >
                    Chat
                  </button>
                </div>
              </div>
            )}

            {/* Stage 5: Agreement Signing */}
            {currentStep === 5 && (
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-obsidian-900">
                  Digital Adoption Agreement
                </h4>
                <p className="text-xs text-obsidian-600 leading-relaxed">
                  Review welfare terms, vet care commitments, and provide digital signature.
                </p>
                <button
                  onClick={() => setIsAgreementOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-soft transition-all"
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
                <h4 className="font-bold text-sm text-obsidian-900 flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-coral-600" />
                  <span>Dual Confirmation Handover</span>
                </h4>
                <p className="text-xs text-obsidian-600 leading-relaxed">
                  Both the original guardian and adopter must click confirm upon physical handover to transfer digital ownership.
                </p>

                <div className="space-y-1.5 text-xs bg-white p-3 rounded-xl border border-coral-200">
                  <div className="flex items-center justify-between">
                    <span>Owner Handover Confirmation:</span>
                    <span className={`font-bold ${handover.ownerConfirmed ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {handover.ownerConfirmed ? 'Confirmed ✓' : 'Pending...'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Adopter Received Confirmation:</span>
                    <span className={`font-bold ${handover.adopterConfirmed ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {handover.adopterConfirmed ? 'Confirmed ✓' : 'Pending...'}
                    </span>
                  </div>
                </div>

                {/* Handover Button */}
                {isOwner && !handover.ownerConfirmed && (
                  <button
                    onClick={handleConfirmHandoverAction}
                    className="w-full py-3 rounded-xl bg-coral-500 hover:bg-coral-600 text-white font-black text-xs shadow-soft hover:shadow-soft-hover transition-all"
                  >
                    🐾 Guardian: Confirm Handover of {application.dogName}
                  </button>
                )}

                {isAdopter && !handover.adopterConfirmed && (
                  <button
                    onClick={handleConfirmHandoverAction}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-coral-500 to-amber-500 hover:from-coral-600 hover:to-amber-600 text-white font-black text-xs shadow-soft hover:shadow-soft-hover transition-all"
                  >
                    🐾 Adopter: Confirm Received {application.dogName}
                  </button>
                )}
              </div>
            )}

            {/* Stage 7+: Completed & Certificate */}
            {currentStep >= 7 && (
              <div className="space-y-2 text-center py-2">
                <div className="text-3xl">🏆✨</div>
                <h4 className="font-bold text-sm text-emerald-900">
                  Official Adoption Completed!
                </h4>
                <p className="text-xs text-obsidian-600">
                  {application.dogName} is now registered under {application.applicantName}.
                </p>
                <button
                  onClick={() => {
                    playPawPop();
                    if (dog) setViewingCertificateDog(dog);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-soft transition-all"
                >
                  <Award className="w-4 h-4" />
                  <span>View Official Certificate 📜</span>
                </button>
              </div>
            )}

          </div>

          <div className="text-[11px] text-obsidian-500 pt-2 border-t border-coral-200/50 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Protected by PawConnect Verified Adoption Protocol</span>
          </div>

        </div>

      </div>

      {/* Modals */}
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
