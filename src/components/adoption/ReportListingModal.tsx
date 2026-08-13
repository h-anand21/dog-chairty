import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import { X, Flag, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { ReportItem } from '../../types';

export const ReportListingModal: React.FC = () => {
  const { isReportModalOpen, setIsReportModalOpen, selectedDog, submitReport } = useApp();
  const { playPawPop } = useAudio();

  const [reason, setReason] = useState<ReportItem['reason']>('Fake dog / Scam');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isReportModalOpen || !selectedDog) return null;

  const handleClose = () => {
    setIsReportModalOpen(false);
    setSubmitted(false);
    setDetails('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playPawPop();
    submitReport(selectedDog.id, selectedDog.name, reason, details);
    setSubmitted(true);
    setTimeout(() => {
      handleClose();
    }, 1800);
  };

  const reportReasons: ReportItem['reason'][] = [
    'Fake dog / Scam',
    'Animal abuse / neglect',
    'Incorrect information',
    'Suspicious owner',
    'Commercial breeding',
    'Other'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-900/75 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-white rounded-4xl p-6 sm:p-8 shadow-2xl border border-obsidian-300 animate-in fade-in zoom-in-95 duration-150 text-left">
        
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-obsidian-300 hover:bg-obsidian-400 flex items-center justify-center text-obsidian-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-2xl">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-obsidian-900">Report Submitted</h3>
            <p className="text-xs text-obsidian-600">
              Our Safety Moderation Team has received your report for <strong>{selectedDog.name}</strong> and is investigating immediately.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-wider mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>Trust & Safety Review</span>
            </div>

            <h3 className="text-xl font-black font-display text-obsidian-900">
              Report Listing: {selectedDog.name}
            </h3>
            <p className="text-xs text-obsidian-600 mt-1">
              Help us keep the canine community safe by reporting suspicious behavior or fraudulent listings.
            </p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-obsidian-900 mb-1.5">
                  Reason for reporting *
                </label>
                <div className="space-y-1.5">
                  {reportReasons.map((r, i) => (
                    <label
                      key={i}
                      className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                        reason === r ? 'border-rose-500 bg-rose-50 text-rose-900' : 'border-obsidian-300 hover:bg-obsidian-200 text-obsidian-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reportReason"
                        checked={reason === r}
                        onChange={() => setReason(r)}
                        className="text-rose-600 focus:ring-rose-400"
                      />
                      <span>{r}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-obsidian-900 mb-1">
                  Additional Details
                </label>
                <textarea
                  rows={2}
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  placeholder="Provide any additional context or proof..."
                  className="w-full px-3 py-2 rounded-xl border border-obsidian-400 text-xs outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-full font-bold text-xs shadow-soft transition-all"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Submit Safety Report</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
