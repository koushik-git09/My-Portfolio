import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Award, Brain, Check, Download, Github, Mail, Terminal } from 'lucide-react';
import { TiltCard } from './TiltCard';

export const ComponentsPage: React.FC = () => {
  const [navActive, setNavActive] = useState('Projects');
  const [inputState, setInputState] = useState<'default' | 'focus' | 'error' | 'valid'>('default');
  const [inputVal, setInputVal] = useState('hello@yourname.dev');
  const [skillFilter, setSkillFilter] = useState('AI & ML');

  return (
    <div className="mx-auto max-w-[1280px] space-y-12 px-4 py-10 sm:px-6 sm:py-14">
      <div className="border-b border-[#263244] pb-8">
        <p className="font-mono text-xs text-[#B6FF5C]">Figma Page 05 · Reusable Components</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F8FAFC] sm:text-4xl">
          Component Library & Interactive Variants
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#94A3B8]">
          Consistent reusable primitives, interactive state variants, and card anatomies prepared for
          modular React component architecture.
        </p>
      </div>

      {/* 1. Button Variants */}
      <section className="rounded-2xl border border-[#263244] bg-[#151C29] p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#263244] pb-4">
          <h2 className="font-display text-lg font-bold text-[#F8FAFC]">Button Variants</h2>
          <span className="font-mono text-xs text-[#94A3B8]">44px / 40px Touch Targets</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#B6FF5C] px-6 text-sm font-semibold text-[#080B12] transition-opacity hover:opacity-90 active:scale-[0.98]"
          >
            <span>Primary Action</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#263244] bg-[#111827] px-5 text-sm font-medium text-[#F8FAFC] transition-colors hover:border-[#B6FF5C]/50"
          >
            <Download className="h-4 w-4 text-[#B6FF5C]" />
            <span>Secondary Outline</span>
          </button>

          <button
            type="button"
            className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#8B5CF6]/50 bg-[#8B5CF6]/10 px-5 text-sm font-medium text-[#F8FAFC] transition-colors hover:bg-[#8B5CF6]/20"
          >
            <span>Violet Accent Variant</span>
          </button>

          <button
            type="button"
            aria-label="Icon Only Button"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#263244] bg-[#111827] text-[#94A3B8] hover:border-[#B6FF5C]/50 hover:text-[#F8FAFC]"
          >
            <Github className="h-4 w-4" />
          </button>

          <button
            type="button"
            disabled
            className="inline-flex h-11 cursor-not-allowed items-center gap-2 rounded-xl border border-[#263244] bg-[#080B12] px-5 text-sm font-medium text-[#94A3B8]/50"
          >
            <span>Disabled State</span>
          </button>
        </div>
      </section>

      {/* 2. Floating Glass Nav Variant */}
      <section className="rounded-2xl border border-[#263244] bg-[#151C29] p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#263244] pb-4">
          <h2 className="font-display text-lg font-bold text-[#F8FAFC]">
            Glass Navigation Bar & Animated Active Indicator
          </h2>
          <span className="font-mono text-xs text-[#B6FF5C]">Click tabs to inspect spring indicator</span>
        </div>

        <div className="rounded-2xl border border-[#263244] bg-[#080B12] p-6">
          <div className="flex h-14 items-center justify-between gap-4 rounded-2xl border border-[#263244]/90 bg-[#080B12]/80 px-5 backdrop-blur-xl">
            <span className="font-display text-sm font-bold text-[#B6FF5C]">YN</span>
            <div className="flex items-center gap-5 overflow-x-auto">
              {['Home', 'About', 'Skills', 'Projects', 'Contact'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setNavActive(item)}
                  className={`relative py-1.5 text-sm font-medium whitespace-nowrap ${
                    navActive === item ? 'text-[#F8FAFC]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  {item}
                  {navActive === item && (
                    <motion.span
                      layoutId="demo-nav-indicator"
                      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                      className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-[#B6FF5C]"
                    />
                  )}
                </button>
              ))}
            </div>
            <span className="rounded-lg bg-[#B6FF5C] px-3 py-1.5 text-xs font-semibold text-[#080B12]">
              Resume
            </span>
          </div>
        </div>
      </section>

      {/* 3. Input & Form States + Segmented Tabs */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#263244] bg-[#151C29] p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-[#263244] pb-4">
            <h2 className="font-display text-lg font-bold text-[#F8FAFC]">Input Field States</h2>
            <div className="flex items-center gap-1.5">
              {(['default', 'focus', 'error', 'valid'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setInputState(st)}
                  className={`rounded-md px-2.5 py-1 font-mono text-[11px] capitalize ${
                    inputState === st
                      ? 'bg-[#B6FF5C] text-[#080B12] font-semibold'
                      : 'bg-[#111827] text-[#94A3B8]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#94A3B8]">Email Input Specimen</label>
            <div className="relative mt-2">
              <Mail className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-[#94A3B8]" />
              <input
                type="email"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className={`h-11 w-full rounded-xl border bg-[#080B12] pl-10 pr-4 text-sm text-[#F8FAFC] outline-none ${
                  inputState === 'focus'
                    ? 'border-[#B6FF5C] ring-2 ring-[#B6FF5C]/20'
                    : inputState === 'error'
                    ? 'border-rose-500 ring-2 ring-rose-500/20'
                    : inputState === 'valid'
                    ? 'border-emerald-400'
                    : 'border-[#263244]'
                }`}
              />
            </div>
            {inputState === 'error' && (
              <p className="mt-1.5 text-xs text-rose-400">Please enter a valid email address.</p>
            )}
            {inputState === 'valid' && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-400">
                <Check className="h-3.5 w-3.5" />
                <span>Validated format</span>
              </p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-[#263244] bg-[#151C29] p-6 space-y-5">
          <div className="border-b border-[#263244] pb-4">
            <h2 className="font-display text-lg font-bold text-[#F8FAFC]">
              Filter Segmented Control & Skill Card
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {['All', 'AI & ML', 'Computer Vision', 'Full-Stack'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSkillFilter(tab)}
                className={`h-9 rounded-lg px-3.5 text-xs font-medium transition-colors ${
                  skillFilter === tab
                    ? 'bg-[#B6FF5C] text-[#080B12] font-semibold'
                    : 'border border-[#263244] bg-[#111827] text-[#94A3B8]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="rounded-xl border border-[#263244] bg-[#111827] p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-sm font-semibold text-[#F8FAFC]">{skillFilter}</h3>
                <p className="text-xs text-[#94A3B8]">Category Card Specimen</p>
              </div>
              <Brain className="h-5 w-5 text-[#B6FF5C]" />
            </div>
          </div>
        </section>
      </div>

      {/* 4. Card Variants */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <TiltCard className="rounded-2xl border border-[#263244] bg-[#151C29] p-6">
          <p className="font-mono text-xs text-[#B6FF5C]">Project Card Variant</p>
          <h3 className="mt-2 font-display text-lg font-bold text-[#F8FAFC]">
            Interactive 3D Tilt Surface
          </h3>
          <p className="mt-2 text-sm text-[#94A3B8]">
            Hover cursor over this card to inspect perspective tilt and radial specular rim tracking.
          </p>
          <p className="mt-4 font-mono text-xs text-[#94A3B8]">PyTorch · TypeScript · Canvas</p>
        </TiltCard>

        <div className="rounded-2xl border border-[#263244] bg-[#151C29] p-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#B6FF5C]">Hackathon · 2026</span>
            <Award className="h-4 w-4 text-[#B6FF5C]" />
          </div>
          <h3 className="mt-3 font-display text-lg font-bold text-[#F8FAFC]">
            Achievement Card Variant
          </h3>
          <p className="mt-2 text-sm text-[#94A3B8]">
            Clean hairline borders and typographic metadata without pill clutter.
          </p>
        </div>

        <div className="rounded-2xl border border-[#263244] bg-[#151C29] p-6">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#8B5CF6]">Repository Card</span>
            <Terminal className="h-4 w-4 text-[#8B5CF6]" />
          </div>
          <h3 className="mt-3 font-mono text-base font-semibold text-[#F8FAFC]">
            aethergraph-core
          </h3>
          <p className="mt-2 text-sm text-[#94A3B8]">
            Terminal-inspired repository specimen with tabular star and fork counters.
          </p>
        </div>
      </section>
    </div>
  );
};
