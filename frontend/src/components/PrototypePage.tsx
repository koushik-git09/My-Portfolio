import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, Sliders, Sparkles } from 'lucide-react';
import { HeroOrbitalVisual } from './HeroOrbitalVisual';
import { TiltCard } from './TiltCard';

interface PrototypePageProps {
  onTriggerLoadingConcept: () => void;
  onJumpToLiveHero: () => void;
}

export const PrototypePage: React.FC<PrototypePageProps> = ({
  onTriggerLoadingConcept,
  onJumpToLiveHero,
}) => {
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [tiltIntensity, setTiltIntensity] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [revealKey, setRevealKey] = useState(0);

  return (
    <div className="mx-auto max-w-[1280px] space-y-12 px-4 py-10 sm:px-6 sm:py-14">
      <div className="border-b border-[#263244] pb-8">
        <p className="font-mono text-xs text-[#B6FF5C]">Figma Page 06 · Prototype Interactions</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F8FAFC] sm:text-4xl">
          Motion Design & Interaction Lab
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#94A3B8]">
          Interactive prototype controls demonstrating the portfolio&apos;s 3D orbital physics,
          hero text reveal choreography, loading screen concept, and compositor-only timing curves.
        </p>
      </div>

      {/* 3D Orbital Physics Playground */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <HeroOrbitalVisual
            speedMultiplier={speedMultiplier}
            tiltIntensity={tiltIntensity}
            showGrid={showGrid}
          />
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-[#263244] bg-[#151C29] p-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b border-[#263244] pb-4">
              <Sliders className="h-4 w-4 text-[#B6FF5C]" />
              <h2 className="font-display text-lg font-bold text-[#F8FAFC]">
                3D Orbital Canvas Parameters
              </h2>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#94A3B8]">Orbital Angular Velocity</span>
                <span className="font-mono text-[#B6FF5C] tabular-nums">{speedMultiplier.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="3"
                step="0.2"
                value={speedMultiplier}
                onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
                className="mt-2 w-full accent-[#B6FF5C]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#94A3B8]">Cursor Parallax Sensitivity</span>
                <span className="font-mono text-[#B6FF5C] tabular-nums">{tiltIntensity.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0"
                max="2.5"
                step="0.5"
                value={tiltIntensity}
                onChange={(e) => setTiltIntensity(parseFloat(e.target.value))}
                className="mt-2 w-full accent-[#B6FF5C]"
              />
            </div>

            <div className="flex items-center justify-between rounded-xl border border-[#263244] bg-[#111827] px-4 py-3">
              <span className="text-xs font-medium text-[#F8FAFC]">Perspective Digital Grid Floor</span>
              <button
                type="button"
                onClick={() => setShowGrid((prev) => !prev)}
                className={`rounded-lg px-3 py-1.5 font-mono text-xs font-semibold transition-colors ${
                  showGrid
                    ? 'bg-[#B6FF5C] text-[#080B12]'
                    : 'border border-[#263244] bg-[#080B12] text-[#94A3B8]'
                }`}
              >
                {showGrid ? 'Enabled' : 'Hidden'}
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 border-t border-[#263244] pt-5">
            <button
              type="button"
              onClick={onTriggerLoadingConcept}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#B6FF5C] px-4 text-xs font-semibold text-[#080B12] hover:opacity-90"
            >
              <Play className="h-3.5 w-3.5" />
              <span>Preview Loading Screen Concept</span>
            </button>
            <button
              type="button"
              onClick={onJumpToLiveHero}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#263244] bg-[#111827] px-4 text-xs font-medium text-[#F8FAFC] hover:border-[#B6FF5C]/50"
            >
              <span>Inspect in Live Hero</span>
            </button>
          </div>
        </div>
      </section>

      {/* Hero Staggered Reveal & Card Tilt Lab */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#263244] bg-[#151C29] p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#263244] pb-4">
            <h2 className="font-display text-lg font-bold text-[#F8FAFC]">
              Hero Stagger Reveal Choreography
            </h2>
            <button
              type="button"
              onClick={() => setRevealKey((k) => k + 1)}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#263244] bg-[#111827] px-3 text-xs font-medium text-[#B6FF5C] hover:border-[#B6FF5C]/50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Replay Reveal</span>
            </button>
          </div>

          <div key={revealKey} className="space-y-3 rounded-xl border border-[#263244] bg-[#080B12] p-5">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-xs text-[#B6FF5C]"
            >
              0ms · Availability & Context
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.14, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-2xl font-bold text-[#F8FAFC]"
            >
              Engineering Ideas Into Intelligent Experiences.
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm text-[#94A3B8]"
            >
              140ms–240ms staggered deceleration with cubic-bezier(0.16, 1, 0.3, 1) settling.
            </motion.p>
          </div>
        </div>

        <TiltCard
          maxTilt={8}
          className="flex flex-col justify-between rounded-2xl border border-[#263244] bg-[#151C29] p-6"
        >
          <div>
            <div className="flex items-center justify-between border-b border-[#263244] pb-4">
              <h2 className="font-display text-lg font-bold text-[#F8FAFC]">
                3D Project Card Tilt & Specular Rim
              </h2>
              <Sparkles className="h-4 w-4 text-[#8B5CF6]" />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#94A3B8]">
              Move your pointer across this surface to preview amplified 8° perspective rotation and
              cursor-following lime specular highlights.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-[#263244] pt-4 font-mono text-xs">
            <div>
              <p className="text-[#94A3B8]">Curve</p>
              <p className="mt-1 text-[#F8FAFC]">Exponential Out</p>
            </div>
            <div>
              <p className="text-[#94A3B8]">Duration</p>
              <p className="mt-1 text-[#B6FF5C]">180ms</p>
            </div>
            <div>
              <p className="text-[#94A3B8]">Properties</p>
              <p className="mt-1 text-[#F8FAFC]">transform, opacity</p>
            </div>
          </div>
        </TiltCard>
      </section>
    </div>
  );
};
