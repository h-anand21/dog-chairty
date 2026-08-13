import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { AdoptionAgreement } from '../../types';
import { X, FileText, CheckCircle2, ShieldCheck, PenTool, Sparkles } from 'lucide-react';

interface AgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  agreement: AdoptionAgreement;
}

export const AgreementModal: React.FC<AgreementModalProps> = ({
  isOpen,
  onClose,
  agreement,
}) => {
  const { currentUser, signAgreement } = useApp();
  const { playSuccessChime, playPawPop } = useAudio();

  const [signatureName, setSignatureName] = useState(currentUser.name);
  const [agreedTerms, setAgreedTerms] = useState(true);

  if (!isOpen) return null;

  const isOwner = currentUser.id === agreement.currentOwnerId;
  const isAdopter = currentUser.id === agreement.adopterId;
  const alreadySigned = (isOwner && !!agreement.ownerSignature) || (isAdopter && !!agreement.adopterSignature);

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signatureName.trim() || !agreedTerms) return;

    playSuccessChime();
    const role = isOwner ? 'owner' : 'adopter';
    signAgreement(agreement.applicationId, role, signatureName.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-obsidian-900/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-4xl p-6 sm:p-8 shadow-2xl border border-obsidian-300 my-6 animate-in fade-in zoom-in-95 duration-200 text-left">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-obsidian-300 hover:bg-obsidian-400 flex items-center justify-center text-obsidian-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-bold text-xs mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official PawConnect Legal Transfer • Stage 5</span>
          </div>
          <h2 className="text-2xl font-black font-display text-obsidian-900">
            Adoption & Guardianship Agreement 📜
          </h2>
          <p className="text-xs text-obsidian-600 mt-1">
            Dog: <strong>{agreement.dogName}</strong> ({agreement.dogBreed}) • Date: {agreement.adoptionDate}
          </p>
        </div>

        {/* Contract Terms Box */}
        <div className="p-4 rounded-2xl bg-obsidian-300/40 border border-obsidian-400/60 max-h-52 overflow-y-auto space-y-3 text-xs text-obsidian-800 leading-relaxed font-mono">
          <p className="font-bold text-obsidian-900">
            PAWCONNECT STANDARD CANINE WELFARE & OWNERSHIP TRANSFER AGREEMENT
          </p>
          <p>
            1. <strong>Transfer of Guardianship:</strong> Current guardian ({agreement.currentOwnerName}) voluntarily transfers full guardianship and care of canine ({agreement.dogName}) to Adopting guardian ({agreement.adopterName}).
          </p>
          <p>
            2. <strong>Veterinary & Humane Care Pledge:</strong> Adopter agrees to provide high quality nutrition, safe indoor living quarters, regular veterinary checkups, annual vaccinations, and prompt medical attention when needed.
          </p>
          <p>
            3. <strong>Non-Abandonment Clause:</strong> In any unforeseen future circumstance where Adopter cannot maintain care, Adopter agrees not to surrender {agreement.dogName} to an open-intake shelter without first notifying the PawConnect rehoming network.
          </p>
          <p>
            4. <strong>Dual Handover Verification:</strong> Official system registration and transfer of digital records takes effect once both parties submit physical handover confirmation on the platform.
          </p>
        </div>

        {/* Signature Status Tracker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          
          {/* Owner Signature Block */}
          <div className={`p-3.5 rounded-2xl border text-xs ${
            agreement.ownerSignature ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-obsidian-200 border-obsidian-300 text-obsidian-600'
          }`}>
            <div className="font-bold flex items-center justify-between">
              <span>Original Guardian: {agreement.currentOwnerName}</span>
              {agreement.ownerSignature && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            </div>
            <div className="mt-1 text-[11px]">
              {agreement.ownerSignature ? (
                <>
                  Signed: <span className="font-serif italic font-bold">{agreement.ownerSignature}</span>
                  <div className="text-[10px] text-emerald-700">{agreement.ownerSignedAt}</div>
                </>
              ) : (
                <span className="text-amber-700 font-medium">⏳ Awaiting Signature</span>
              )}
            </div>
          </div>

          {/* Adopter Signature Block */}
          <div className={`p-3.5 rounded-2xl border text-xs ${
            agreement.adopterSignature ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-obsidian-200 border-obsidian-300 text-obsidian-600'
          }`}>
            <div className="font-bold flex items-center justify-between">
              <span>Adopter: {agreement.adopterName}</span>
              {agreement.adopterSignature && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
            </div>
            <div className="mt-1 text-[11px]">
              {agreement.adopterSignature ? (
                <>
                  Signed: <span className="font-serif italic font-bold">{agreement.adopterSignature}</span>
                  <div className="text-[10px] text-emerald-700">{agreement.adopterSignedAt}</div>
                </>
              ) : (
                <span className="text-amber-700 font-medium">⏳ Awaiting Signature</span>
              )}
            </div>
          </div>

        </div>

        {/* Signing Action Form */}
        {!alreadySigned ? (
          <form onSubmit={handleSign} className="space-y-4 pt-2 border-t border-obsidian-400/40">
            <div>
              <label className="block text-xs font-bold text-obsidian-900 mb-1">
                Type your Full Name as Digital Signature *
              </label>
              <div className="relative">
                <PenTool className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-obsidian-500" />
                <input
                  type="text"
                  required
                  value={signatureName}
                  onChange={e => setSignatureName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-obsidian-400 text-sm font-serif italic outline-hidden"
                />
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs font-bold text-obsidian-800 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreedTerms}
                onChange={e => setAgreedTerms(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded-sm mt-0.5"
              />
              <span>
                I agree to the terms of transfer and confirm my intent for {agreement.dogName}&apos;s care.
              </span>
            </label>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-full border border-obsidian-400 text-xs font-bold text-obsidian-700 hover:bg-obsidian-300"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-soft transition-all"
              >
                Sign Agreement ✍️
              </button>
            </div>
          </form>
        ) : (
          <div className="pt-2 text-center">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-bold mb-3">
              ✓ You have signed this agreement.
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full bg-obsidian-900 text-white text-xs font-bold"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
