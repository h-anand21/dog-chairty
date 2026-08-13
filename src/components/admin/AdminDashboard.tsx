import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAudio } from '../../context/AudioContext';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Flag,
  Award,
  Users,
  Dog as DogIcon,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { reports, resolveReport, dogs, applications, allUsers } = useApp();
  const { playPawPop, playSuccessChime } = useAudio();

  const activeReports = reports.filter(r => r.status === 'pending');
  const completedAdoptions = dogs.filter(d => d.status === 'adopted');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 font-bold text-xs mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            <span>Platform Trust & Safety Center</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-obsidian-900">
            Moderation & Safety Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-obsidian-600 mt-1">
            Real-time monitoring of community reports, verified guardians, and completed ownership transfers.
          </p>
        </div>
      </div>

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-3xl p-5 border border-obsidian-400/50 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-obsidian-500">Live Dog Listings</span>
            <DogIcon className="w-5 h-5 text-coral-500" />
          </div>
          <div className="text-3xl font-black text-obsidian-900 mt-2">{dogs.length}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">100% Verified</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-obsidian-400/50 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-obsidian-500">Pending Safety Reports</span>
            <Flag className="w-5 h-5 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-rose-600 mt-2">{activeReports.length}</div>
          <div className="text-[11px] text-obsidian-500 mt-1">Require moderator action</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-obsidian-400/50 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-obsidian-500">Completed Transfers</span>
            <Award className="w-5 h-5 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-amber-600 mt-2">{completedAdoptions.length}</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">Dual-confirmed certificates</div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-obsidian-400/50 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-obsidian-500">Verified Guardians</span>
            <Users className="w-5 h-5 text-sky-500" />
          </div>
          <div className="text-3xl font-black text-sky-600 mt-2">{allUsers.length}</div>
          <div className="text-[11px] text-obsidian-500 mt-1">ID & Phone screened</div>
        </div>
      </div>

      {/* Safety Reports Queue */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-obsidian-400/50 shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-obsidian-400/40">
          <div>
            <h3 className="text-lg font-black text-obsidian-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <span>Community Reported Listings Queue</span>
            </h3>
            <p className="text-xs text-obsidian-500 mt-0.5">
              Review flagged accounts and suspicious activity reports.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200">
            {activeReports.length} pending reviews
          </span>
        </div>

        {activeReports.length === 0 ? (
          <div className="text-center py-10 text-xs text-obsidian-500 space-y-2">
            <div className="text-3xl">🛡️✨</div>
            <p className="font-bold text-obsidian-800">All clear! No active pending safety reports.</p>
            <p className="text-[11px]">All dog listings comply with PawConnect trust guidelines.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeReports.map(rep => (
              <div
                key={rep.id}
                className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-obsidian-900 text-sm">
                      Report on Listing: {rep.dogName}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                      {rep.reason}
                    </span>
                  </div>
                  <p className="text-xs text-obsidian-700 mt-1">
                    Details: &ldquo;{rep.details || 'Suspicious listing reported by community member.'}&rdquo;
                  </p>
                  <div className="text-[10px] text-obsidian-400 mt-1">
                    Reported by {rep.reportedByName} • {rep.timestamp}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      playSuccessChime();
                      resolveReport(rep.id, 'resolve');
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                  >
                    ✓ Verify & Resolve
                  </button>
                  <button
                    onClick={() => {
                      playPawPop();
                      resolveReport(rep.id, 'dismiss');
                    }}
                    className="px-4 py-2 rounded-xl border border-obsidian-400 hover:bg-obsidian-300 text-obsidian-700 font-bold text-xs"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
