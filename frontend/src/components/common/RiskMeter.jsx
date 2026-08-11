import React, { useEffect, useState } from 'react';

export const RiskMeter = ({ score = 0, riskLevel = 'SAFE', size = 200 }) => {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Math.min(100, Math.max(0, score));
    const duration = 1200; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = (end - start) / steps;

    const timer = setInterval(() => {
      start += increment;
      if ((increment >= 0 && start >= end) || (increment < 0 && start <= end)) {
        setDisplayScore(end);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayScore / 100) * circumference;

  let strokeColor = '#10B981'; // Green SAFE
  let glowColor = 'rgba(16, 185, 129, 0.4)';
  if (riskLevel === 'MEDIUM') {
    strokeColor = '#F59E0B'; // Amber MEDIUM
    glowColor = 'rgba(245, 158, 11, 0.4)';
  } else if (riskLevel === 'HIGH') {
    strokeColor = '#EF4444'; // Red HIGH
    glowColor = 'rgba(239, 68, 68, 0.5)';
  }

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1F2937"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Gradient Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            transition: 'stroke-dashoffset 0.1s linear',
            filter: `drop-shadow(0 0 12px ${glowColor})`
          }}
        />
      </svg>
      {/* Score Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-4xl font-extrabold tracking-tight text-white font-mono">
          {displayScore}
        </span>
        <span className="text-xs uppercase font-medium tracking-widest text-slate-400 mt-0.5">
          / 100 Score
        </span>
      </div>
    </div>
  );
};
