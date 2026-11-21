import React from 'react';
import {
  Component as ComponentIcon,
  EyeOff,
  Figma,
  Laptop,
  Monitor,
  Palette,
  Play,
  Smartphone,
  Tablet,
} from 'lucide-react';

export type StudioPageId =
  | 'desktop'
  | 'tablet'
  | 'mobile'
  | 'design-system'
  | 'components'
  | 'prototype';

export type DesktopWidthMode = 'fluid' | '1440' | '1280';
export type MobileWidthMode = 'both' | '390' | '375';

interface StudioBarProps {
  activePage: StudioPageId;
  onChangePage: (page: StudioPageId) => void;
  desktopWidth: DesktopWidthMode;
  onChangeDesktopWidth: (w: DesktopWidthMode) => void;
  mobileWidth: MobileWidthMode;
  onChangeMobileWidth: (w: MobileWidthMode) => void;
  presentationMode: boolean;
  onTogglePresentationMode: () => void;
}

const STUDIO_PAGES: { id: StudioPageId; label: string; icon: React.ReactNode }[] = [
  { id: 'desktop', label: 'Desktop Portfolio', icon: <Monitor className="h-3.5 w-3.5" /> },
  { id: 'tablet', label: 'Tablet Portfolio', icon: <Tablet className="h-3.5 w-3.5" /> },
  { id: 'mobile', label: 'Mobile Portfolio', icon: <Smartphone className="h-3.5 w-3.5" /> },
  { id: 'design-system', label: 'Design System', icon: <Palette className="h-3.5 w-3.5" /> },
  { id: 'components', label: 'Reusable Components', icon: <ComponentIcon className="h-3.5 w-3.5" /> },
  { id: 'prototype', label: 'Prototype Interactions', icon: <Play className="h-3.5 w-3.5" /> },
];

export const StudioBar: React.FC<StudioBarProps> = ({
  activePage,
  onChangePage,
  desktopWidth,
  onChangeDesktopWidth,
  mobileWidth,
  onChangeMobileWidth,
  presentationMode,
  onTogglePresentationMode,
}) => {
  if (presentationMode) {
    return (
      <button
        type="button"
        onClick={onTogglePresentationMode}
        className="fixed bottom-4 right-4 z-50 hidden md:inline-flex items-center gap-2 rounded-xl border border-[#263244] bg-[#151C29]/95 px-3.5 py-2 font-mono text-xs text-[#F8FAFC] shadow-xl backdrop-blur-md transition-colors hover:border-[#B6FF5C]/60"
      >
        <Figma className="h-3.5 w-3.5 text-[#B6FF5C]" />
        <span>Show Design Pages</span>
      </button>
    );
  }

  return (
    <div className="hidden md:block border-b border-[#263244] bg-[#06080E] px-4 py-2">
      <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-4">
        {/* Figma Organization Label */}
        <div className="flex items-center gap-2 shrink-0">
          <Figma className="h-3.5 w-3.5 text-[#B6FF5C]" />
          <span className="font-mono text-[11px] font-medium text-[#94A3B8] whitespace-nowrap">
            Design Prototype
          </span>
        </div>

        {/* 6 Logical Figma Pages */}
        <div className="flex items-center gap-1 overflow-x-auto" role="tablist" aria-label="Figma Design Pages">
          {STUDIO_PAGES.map((page) => {
            const active = activePage === page.id;
            return (
              <button
                key={page.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onChangePage(page.id)}
                className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#151C29] text-[#B6FF5C] border border-[#B6FF5C]/40'
                    : 'text-[#94A3B8] hover:bg-[#111827] hover:text-[#F8FAFC]'
                }`}
              >
                {page.icon}
                <span>{page.label}</span>
              </button>
            );
          })}
        </div>

        {/* Contextual Frame Width Controls + Hide Bar */}
        <div className="flex items-center gap-2 shrink-0">
          {activePage === 'desktop' && (
            <div className="flex items-center gap-1 rounded-lg border border-[#263244] bg-[#111827] p-0.5">
              {(
                [
                  { id: 'fluid', label: 'Full', icon: null },
                  { id: '1440', label: '1440px', icon: <Monitor className="h-3 w-3" /> },
                  { id: '1280', label: '1280px', icon: <Laptop className="h-3 w-3" /> },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChangeDesktopWidth(opt.id)}
                  className={`inline-flex h-7 items-center gap-1 rounded-md px-2 font-mono text-[11px] transition-colors whitespace-nowrap ${
                    desktopWidth === opt.id
                      ? 'bg-[#B6FF5C] text-[#080B12] font-semibold'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          )}

          {activePage === 'mobile' && (
            <div className="flex items-center gap-1 rounded-lg border border-[#263244] bg-[#111827] p-0.5">
              {(
                [
                  { id: 'both', label: '390 + 375' },
                  { id: '390', label: '390px' },
                  { id: '375', label: '375px' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChangeMobileWidth(opt.id)}
                  className={`inline-flex h-7 items-center rounded-md px-2 font-mono text-[11px] transition-colors whitespace-nowrap ${
                    mobileWidth === opt.id
                      ? 'bg-[#B6FF5C] text-[#080B12] font-semibold'
                      : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={onTogglePresentationMode}
            title="Hide studio bar for unobstructed portfolio presentation"
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#263244] bg-[#111827] px-2.5 text-xs text-[#94A3B8] transition-colors hover:text-[#F8FAFC] whitespace-nowrap"
          >
            <EyeOff className="h-3.5 w-3.5" />
            <span className="hidden xl:inline">Clean View</span>
          </button>
        </div>
      </div>
    </div>
  );
};
