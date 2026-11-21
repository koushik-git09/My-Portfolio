import React, { useState } from 'react';
import { Check, Copy, Grid, Layers, Palette, Type } from 'lucide-react';

const COLOR_TOKENS = [
  { name: 'Primary Background', token: '--bg-primary', hex: '#080B12', role: '60% Dominant Obsidian Canvas' },
  { name: 'Secondary Background', token: '--bg-secondary', hex: '#111827', role: 'Alternating Section Surface' },
  { name: 'Card Background', token: '--bg-card', hex: '#151C29', role: '30% Elevated Structural Cards' },
  { name: 'Primary Accent', token: '--accent-lime', hex: '#B6FF5C', role: '10% Primary CTAs & Active Indicators' },
  { name: 'Secondary Accent', token: '--accent-violet', hex: '#8B5CF6', role: 'Orbital Depth, Neural Edges & Secondary Focus' },
  { name: 'Primary Text', token: '--text-primary', hex: '#F8FAFC', role: 'Headlines & High-Contrast Copy' },
  { name: 'Secondary Text', token: '--text-secondary', hex: '#94A3B8', role: 'Body Prose & Metadata Labels' },
  { name: 'Border Hairline', token: '--border-subtle', hex: '#263244', role: '1px Architectural Boundaries' },
];

const TYPE_SCALE = [
  {
    role: 'Hero Display H1',
    family: 'Space Grotesk',
    weight: '700 Bold',
    desktop: '56px / 1.08',
    mobile: '30px / 1.12',
    sample: 'Engineering Ideas Into Intelligent Experiences.',
    className: 'font-display text-3xl sm:text-4xl font-bold tracking-tight text-[#F8FAFC]',
  },
  {
    role: 'Section Heading H2',
    family: 'Space Grotesk',
    weight: '700 Bold',
    desktop: '36px / 1.15',
    mobile: '24px / 1.20',
    sample: 'Featured Engineering Projects',
    className: 'font-display text-2xl font-bold tracking-tight text-[#F8FAFC]',
  },
  {
    role: 'Card Title H3',
    family: 'Space Grotesk',
    weight: '600 SemiBold',
    desktop: '20px / 1.30',
    mobile: '18px / 1.30',
    sample: 'AetherGraph Multimodal Orchestrator',
    className: 'font-display text-xl font-semibold text-[#F8FAFC]',
  },
  {
    role: 'Body Copy',
    family: 'Inter',
    weight: '400 Regular',
    desktop: '16px / 1.65',
    mobile: '15px / 1.60',
    sample:
      'An aspiring Software Engineer and AI Engineer passionate about building intelligent applications and solving real-world problems.',
    className: 'font-sans text-base leading-relaxed text-[#94A3B8]',
  },
  {
    role: 'Technical Label',
    family: 'JetBrains Mono',
    weight: '500 Medium',
    desktop: '12px / 1.40',
    mobile: '11px / 1.40',
    sample: 'PyTorch · FastAPI · TypeScript · ONNX Runtime',
    className: 'font-mono text-xs text-[#B6FF5C]',
  },
];

const BREAKPOINT_GRID = [
  { name: 'Desktop', width: '1440px', cols: '12 Columns', gutter: '24px', margin: '80px', maxContainer: '1280px' },
  { name: 'Laptop', width: '1280px', cols: '12 Columns', gutter: '24px', margin: '48px', maxContainer: '1184px' },
  { name: 'Tablet', width: '768px', cols: '8 Columns', gutter: '20px', margin: '24px', maxContainer: '720px' },
  { name: 'Mobile L', width: '390px', cols: '4 Columns', gutter: '16px', margin: '16px', maxContainer: '358px' },
  { name: 'Mobile S', width: '375px', cols: '4 Columns', gutter: '12px', margin: '16px', maxContainer: '343px' },
];

export const DesignSystemPage: React.FC = () => {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = (hex: string) => {
    navigator.clipboard?.writeText(hex).catch(() => {});
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1600);
  };

  return (
    <div className="mx-auto max-w-[1280px] space-y-12 px-4 py-10 sm:px-6 sm:py-14">
      {/* Header */}
      <div className="border-b border-[#263244] pb-8">
        <p className="font-mono text-xs text-[#B6FF5C]">Figma Page 01 · Design System</p>
        <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F8FAFC] sm:text-4xl">
          Visual Language & Token Foundation
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#94A3B8]">
          Strict color tokens, typographic scale, spacing cadence, and responsive grid specifications
          for React & Tailwind CSS handoff.
        </p>
      </div>

      {/* Color Palette */}
      <section className="space-y-5">
        <div className="flex items-center gap-2.5">
          <Palette className="h-5 w-5 text-[#B6FF5C]" />
          <h2 className="font-display text-xl font-bold text-[#F8FAFC]">Color System</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {COLOR_TOKENS.map((c) => (
            <button
              key={c.hex}
              type="button"
              onClick={() => handleCopy(c.hex)}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#263244] bg-[#151C29] text-left transition-colors hover:border-[#B6FF5C]/50"
            >
              <div
                className="h-24 w-full border-b border-[#263244]"
                style={{ backgroundColor: c.hex }}
              />
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-sm font-semibold text-[#F8FAFC]">
                      {c.name}
                    </span>
                    {copiedHex === c.hex ? (
                      <Check className="h-3.5 w-3.5 text-[#B6FF5C]" />
                    ) : (
                      <Copy className="h-3.5 w-3.5 text-[#94A3B8] opacity-60 group-hover:opacity-100" />
                    )}
                  </div>
                  <p className="mt-1 font-mono text-xs text-[#B6FF5C]">{c.hex}</p>
                </div>
                <p className="mt-3 text-xs text-[#94A3B8]">{c.role}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Typography Hierarchy */}
      <section className="space-y-5">
        <div className="flex items-center gap-2.5">
          <Type className="h-5 w-5 text-[#B6FF5C]" />
          <h2 className="font-display text-xl font-bold text-[#F8FAFC]">Typography Scale</h2>
        </div>

        <div className="divide-y divide-[#263244] overflow-hidden rounded-2xl border border-[#263244] bg-[#151C29]">
          {TYPE_SCALE.map((t) => (
            <div key={t.role} className="grid grid-cols-1 gap-4 p-6 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-4 space-y-1">
                <p className="font-display text-sm font-semibold text-[#F8FAFC]">{t.role}</p>
                <p className="font-mono text-xs text-[#94A3B8]">
                  {t.family} · {t.weight}
                </p>
                <p className="font-mono text-[11px] text-[#8B5CF6]">
                  Desktop {t.desktop} · Mobile {t.mobile}
                </p>
              </div>
              <div className="lg:col-span-8">
                <p className={t.className}>{t.sample}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Spacing, Radii & Elevation */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#263244] bg-[#151C29] p-6">
          <div className="flex items-center gap-2.5">
            <Layers className="h-5 w-5 text-[#B6FF5C]" />
            <h2 className="font-display text-lg font-bold text-[#F8FAFC]">
              Spacing & Border Radius Tokens
            </h2>
          </div>
          <div className="mt-5 space-y-3">
            {[
              { label: 'xs / 8px', px: 8, radius: 'rounded-lg (8px) — Buttons & Inputs' },
              { label: 'sm / 12px', px: 12, radius: 'rounded-xl (12px) — Inner Modules' },
              { label: 'md / 16px', px: 16, radius: 'rounded-2xl (16px) — Primary Cards' },
              { label: 'lg / 24px', px: 24, radius: 'Card Padding Baseline (24px–32px)' },
              { label: 'xl / 64px', px: 64, radius: 'Mobile Section Rhythm (64px)' },
              { label: '2xl / 96px', px: 96, radius: 'Desktop Section Rhythm (96px)' },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between gap-4 border-b border-[#263244]/70 pb-2.5">
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 rounded-sm bg-[#B6FF5C]"
                    style={{ width: `${Math.min(88, s.px)}px` }}
                  />
                  <span className="font-mono text-xs text-[#F8FAFC] tabular-nums">{s.label}</span>
                </div>
                <span className="text-xs text-[#94A3B8] text-right">{s.radius}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#263244] bg-[#151C29] p-6">
          <div className="flex items-center gap-2.5">
            <Grid className="h-5 w-5 text-[#8B5CF6]" />
            <h2 className="font-display text-lg font-bold text-[#F8FAFC]">
              Responsive Grid Architecture
            </h2>
          </div>
          <div className="mt-5 space-y-3">
            {BREAKPOINT_GRID.map((bp) => (
              <div
                key={bp.name}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#263244] bg-[#111827] px-4 py-3"
              >
                <div>
                  <span className="font-display text-sm font-semibold text-[#F8FAFC]">
                    {bp.name}
                  </span>
                  <span className="ml-2 font-mono text-xs text-[#B6FF5C] tabular-nums">
                    {bp.width}
                  </span>
                </div>
                <div className="font-mono text-xs text-[#94A3B8] tabular-nums">
                  {bp.cols} · Gutter {bp.gutter} · Margin {bp.margin}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
