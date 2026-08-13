import React from 'react';
import { DogStatus } from '../../types';
import { CheckCircle2, Clock, Calendar, FileText, HeartHandshake, Award } from 'lucide-react';

interface StatusBadgeProps {
  status: DogStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const configs: Record<DogStatus, { label: string; bg: string; text: string; border: string; icon: React.ReactNode }> = {
    available: {
      label: 'Available for Adoption',
      bg: 'bg-emerald-50 text-emerald-700',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
    },
    pending: {
      label: 'Adoption Pending',
      bg: 'bg-amber-50 text-amber-700',
      text: 'text-amber-700',
      border: 'border-amber-200',
      icon: <Clock className="w-3.5 h-3.5 text-amber-500" />
    },
    meet_scheduled: {
      label: 'Meet & Greet Scheduled',
      bg: 'bg-sky-50 text-sky-700',
      text: 'text-sky-700',
      border: 'border-sky-200',
      icon: <Calendar className="w-3.5 h-3.5 text-sky-500" />
    },
    agreement_pending: {
      label: 'Agreement in Review',
      bg: 'bg-purple-50 text-purple-700',
      text: 'text-purple-700',
      border: 'border-purple-200',
      icon: <FileText className="w-3.5 h-3.5 text-purple-500" />
    },
    handover_pending: {
      label: 'Handover Confirmation',
      bg: 'bg-orange-50 text-orange-700',
      text: 'text-orange-700',
      border: 'border-orange-200',
      icon: <HeartHandshake className="w-3.5 h-3.5 text-orange-500" />
    },
    adopted: {
      label: 'Happily Adopted 🎉',
      bg: 'bg-rose-50 text-rose-700',
      text: 'text-rose-700',
      border: 'border-rose-200',
      icon: <Award className="w-3.5 h-3.5 text-rose-500" />
    }
  };

  const config = configs[status] || configs.available;

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1',
    md: 'text-xs font-semibold px-3 py-1.5 gap-1.5',
    lg: 'text-sm font-bold px-4 py-2 gap-2'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-xs transition-all ${config.bg} ${config.border} ${sizeClasses[size]}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
