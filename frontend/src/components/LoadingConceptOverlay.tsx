import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PORTFOLIO_PROFILE } from '../data/portfolioData';

interface LoadingConceptOverlayProps {
  active: boolean;
  onComplete: () => void;
}

export const LoadingConceptOverlay: React.FC<LoadingConceptOverlayProps> = ({
  active,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) {
      setProgress(0);
      return;
    }

    const start = performance.now();
    const duration = 1500;
    let raf = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(onComplete, 260);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#080B12] p-6"
          role="dialog"
          aria-label="Loading screen animation concept"
        >
          {/* Geometric Orbital Preloader Ring */}
          <div className="relative flex h-32 w-32 items-center justify-center">
            <motion.svg
              viewBox="0 0 120 120"
              className="h-full w-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
            >
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#263244"
                strokeWidth="1.5"
              />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="none"
                stroke="#B6FF5C"
                strokeWidth="2"
                strokeDasharray="90 240"
                strokeLinecap="round"
              />
              <circle
                cx="60"
                cy="60"
                r="38"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="1.5"
                strokeDasharray="60 180"
                strokeLinecap="round"
              />
            </motion.svg>
            <span className="absolute font-display text-xl font-bold tracking-tight text-[#F8FAFC]">
              {PORTFOLIO_PROFILE.initials}
            </span>
          </div>

          <div className="mt-8 w-56 space-y-2 text-center">
            <div className="flex items-center justify-between font-mono text-xs text-[#94A3B8]">
              <span>Loading Concept</span>
              <span className="text-[#B6FF5C] tabular-nums">{progress}%</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-[#151C29]">
              <div
                className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#B6FF5C] transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onComplete}
            className="mt-8 rounded-lg border border-[#263244] bg-[#151C29] px-4 py-2 text-xs font-medium text-[#94A3B8] transition-colors hover:text-[#F8FAFC]"
          >
            Skip Preview
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
