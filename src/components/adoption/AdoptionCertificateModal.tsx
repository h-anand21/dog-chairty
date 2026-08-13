import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { X, Award, ShieldCheck, Printer, CheckCircle2, Heart } from 'lucide-react';

export const AdoptionCertificateModal: React.FC = () => {
  const { viewingCertificateDog, setViewingCertificateDog } = useApp();
  const { playPawPop } = useAudio();

  if (!viewingCertificateDog) return null;

  const dog = viewingCertificateDog;
  const certId = dog.certificateId || 'CERT-PAW-892134';
  const adoptionDate = dog.adoptedDate || '18 August 2026';
  const newOwner = dog.newOwnerName || 'Sarah Jenkins';
  const originalOwner = dog.previousOwnerName || 'Alex Rivera';

  const handlePrint = () => {
    playPawPop();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-obsidian-900/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-4xl p-6 sm:p-10 shadow-2xl border-8 border-amber-200/80 my-6 animate-in fade-in zoom-in-95 duration-200 text-center">
        
        {/* Close button */}
        <button
          onClick={() => setViewingCertificateDog(null)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-obsidian-300 hover:bg-obsidian-400 flex items-center justify-center text-obsidian-700 transition-colors print:hidden"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Certificate Border & Header */}
        <div className="border-4 border-dashed border-amber-300 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden bg-gradient-to-b from-amber-50/50 via-white to-amber-50/30">
          
          {/* Watermark Paw */}
          <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none text-[240px]">
            🐾
          </div>

          {/* Top Seal */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-lg text-xl">
              🏆
            </div>
          </div>

          <div>
            <div className="text-xs font-black uppercase tracking-widest text-amber-700">
              OFFICIAL CANINE REGISTRATION & TRANSFER RECORD
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-display text-obsidian-900 mt-1">
              Certificate of Dog Adoption
            </h1>
            <div className="text-xs font-mono font-bold text-obsidian-500 mt-1">
              Certificate ID: #{certId}
            </div>
          </div>

          {/* Dog Centerpiece */}
          <div className="flex flex-col items-center justify-center gap-3">
            <img
              src={dog.coverPhoto}
              alt={dog.name}
              className="w-28 h-28 rounded-full object-cover ring-4 ring-amber-400 shadow-md"
            />
            <div>
              <div className="text-2xl font-black text-coral-600 font-display">
                {dog.name}
              </div>
              <div className="text-xs font-bold text-obsidian-700">
                {dog.breed} • {dog.age} • {dog.gender}
              </div>
            </div>
          </div>

          {/* Declaration Text */}
          <p className="text-sm text-obsidian-800 leading-relaxed max-w-md mx-auto italic font-serif">
            &ldquo;This certifies that full guardianship and loving custody of <strong>{dog.name}</strong> was officially transferred from <strong>{originalOwner}</strong> to <strong>{newOwner}</strong> under verified mutual consent.&rdquo;
          </p>

          {/* Signatures & Stamps Footer */}
          <div className="grid grid-cols-2 gap-6 pt-4 border-t-2 border-amber-200 text-xs">
            <div className="text-left space-y-1">
              <span className="text-[10px] uppercase font-bold text-obsidian-400">Adopted By</span>
              <div className="font-bold text-obsidian-900 font-serif italic text-base">
                {newOwner}
              </div>
              <div className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Guardian</span>
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className="text-[10px] uppercase font-bold text-obsidian-400">Date Completed</span>
              <div className="font-bold text-obsidian-900">{adoptionDate}</div>
              <div className="text-[10px] text-amber-700 font-bold flex items-center justify-end gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-600" />
                <span>PawConnect Trust Registry</span>
              </div>
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="mt-6 flex items-center justify-center gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-soft transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save Certificate</span>
          </button>
          <button
            onClick={() => setViewingCertificateDog(null)}
            className="px-6 py-2.5 rounded-full bg-obsidian-200 hover:bg-obsidian-300 text-obsidian-800 font-bold text-xs transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
