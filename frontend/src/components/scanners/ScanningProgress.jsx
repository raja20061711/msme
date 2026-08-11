import React, { useEffect, useState } from 'react';
import { ShieldAlert, Loader2, CheckCircle2, Cpu } from 'lucide-react';

export const ScanningProgress = ({ scanType = 'Scan', onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    `Reading ${scanType.toLowerCase()} payload...`,
    'Applying OpenCV contrast enhancement & noise reduction...',
    'Extracting structured text with Tesseract OCR...',
    'Analyzing suspicious feature patterns & indicators...',
    'Computing deterministic fraud risk score & XAI report...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          if (onComplete) setTimeout(onComplete, 600);
          return prev;
        }
      });
    }, 600);

    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.min(100, Math.round(((currentStep + 1) / steps.length) * 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg p-4">
      <div className="w-full max-w-lg glass-panel-glow rounded-2xl p-8 border border-cyan-500/30 text-center relative overflow-hidden">
        {/* Animated Cyber Grid / Scan Radar Line */}
        <div className="scan-radar absolute inset-0 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mb-6 animate-pulse-glow">
            <Cpu className="w-8 h-8 animate-spin" style={{ animationDuration: '4s' }} />
          </div>

          <h3 className="text-xl font-bold text-white mb-1">
            SECUREMSME AI SCANNER
          </h3>
          <p className="text-xs text-cyan-400 font-mono uppercase tracking-widest mb-6">
            Analyzing {scanType} Input
          </p>

          {/* Progress Bar */}
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden mb-6 border border-slate-700">
            <div
              className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Steps Checklist */}
          <div className="w-full text-left space-y-2.5 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            {steps.map((stepText, idx) => {
              const isDone = idx < currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                  )}
                  <span className={isDone ? 'text-slate-300 line-through opacity-70' : isCurrent ? 'text-cyan-300 font-semibold' : 'text-slate-500'}>
                    {stepText}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-slate-500 mt-5 italic">
            Deterministic rule-weighted feature engine running...
          </p>
        </div>
      </div>
    </div>
  );
};
