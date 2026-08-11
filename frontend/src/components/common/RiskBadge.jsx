import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

export const RiskBadge = ({ level = 'SAFE', showIcon = true, size = 'normal' }) => {
  const normalized = (level || 'SAFE').toUpperCase();

  const sizeClasses = size === 'large' 
    ? 'px-4 py-1.5 text-sm rounded-full font-bold' 
    : 'px-2.5 py-1 text-xs rounded-full font-semibold';

  if (normalized === 'SAFE') {
    return (
      <span className={`inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 ${sizeClasses}`}>
        {showIcon && <ShieldCheck className={size === 'large' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
        SAFE
      </span>
    );
  } else if (normalized === 'MEDIUM') {
    return (
      <span className={`inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 ${sizeClasses}`}>
        {showIcon && <AlertTriangle className={size === 'large' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
        MEDIUM RISK
      </span>
    );
  } else { // HIGH
    return (
      <span className={`inline-flex items-center gap-1.5 bg-rose-500/15 border border-rose-500/40 text-rose-400 animate-pulse ${sizeClasses}`}>
        {showIcon && <AlertOctagon className={size === 'large' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />}
        HIGH RISK
      </span>
    );
  }
};
