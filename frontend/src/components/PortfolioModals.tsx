import React, { useEffect } from 'react';
import { Award, CheckCircle2, Download, ExternalLink, Github, X } from 'lucide-react';
import { AchievementItem, PORTFOLIO_PROFILE, ProjectItem } from '../data/portfolioData';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    if (!project) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#080B12]/85 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-modal-title"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-[#263244] bg-[#151C29] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Browser Bar Chrome */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#263244] bg-[#111827]/95 px-6 py-4 backdrop-blur-md">
          <div className="min-w-0">
            <p className="font-mono text-xs text-[#B6FF5C]">{project.kicker}</p>
            <h3 id="project-modal-title" className="truncate font-display text-lg font-semibold text-[#F8FAFC]">
              {project.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#263244] bg-[#151C29] text-[#94A3B8] transition-colors hover:border-[#B6FF5C]/50 hover:text-[#F8FAFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B6FF5C]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Media Preview */}
          <div className="overflow-hidden rounded-xl border border-[#263244] bg-[#080B12]">
            {project.image ? (
              <img
                src={project.image}
                alt={project.name}
                referrerPolicy="no-referrer"
                className="aspect-video w-full object-cover"
              />
            ) : (
              <div className="flex aspect-video w-full flex-col items-center justify-center bg-architectural-grid p-8 text-center">
                <span className="font-mono text-xs text-[#94A3B8]">UI Mockup Placeholder</span>
                <p className="mt-2 font-display text-xl font-semibold text-[#F8FAFC]">{project.name}</p>
              </div>
            )}
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {project.metrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-xl border border-[#263244] bg-[#111827] px-4 py-3"
              >
                <p className="text-xs text-[#94A3B8]">{metric.label}</p>
                <p className="mt-1 font-display text-base font-semibold text-[#F8FAFC] tabular-nums">
                  {metric.value}
                </p>
              </div>
            ))}
          </div>

          {/* Description & Architecture */}
          <div className="space-y-4">
            <div>
              <h4 className="font-display text-sm font-semibold text-[#F8FAFC]">Overview</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-[#94A3B8]">{project.description}</p>
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-[#F8FAFC]">System Architecture</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-[#94A3B8]">{project.architectureNote}</p>
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-[#F8FAFC]">Key Highlights</h4>
              <ul className="mt-2 space-y-2">
                {project.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-[#94A3B8]">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#B6FF5C]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Clean Typographic Tech Stack */}
          <div className="border-t border-[#263244] pt-4">
            <p className="text-xs text-[#94A3B8]">Technology Stack</p>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-[#F8FAFC]">
              {project.technologies.map((tech, idx) => (
                <React.Fragment key={tech}>
                  <span>{tech}</span>
                  {idx < project.technologies.length - 1 && (
                    <span className="text-[#94A3B8]" aria-hidden="true">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 border-t border-[#263244] pt-4">
            <a
              href={project.githubUrl}
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-lg border border-[#263244] bg-[#111827] px-4 py-2.5 text-sm font-medium text-[#F8FAFC] transition-colors hover:border-[#B6FF5C]/50 whitespace-nowrap shrink-0"
            >
              <Github className="h-4 w-4" />
              <span>View Repository</span>
            </a>
            <a
              href={project.liveUrl}
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-lg bg-[#B6FF5C] px-4 py-2.5 text-sm font-semibold text-[#080B12] transition-opacity hover:opacity-90 whitespace-nowrap shrink-0"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Interactive Prototype</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CertificateModalProps {
  achievement: AchievementItem | null;
  onClose: () => void;
}

export const CertificatePreviewModal: React.FC<CertificateModalProps> = ({
  achievement,
  onClose,
}) => {
  useEffect(() => {
    if (!achievement) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#080B12]/85 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cert-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl border border-[#263244] bg-[#151C29] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-[#B6FF5C]">
              {achievement.category} · {achievement.year}
            </p>
            <h3 id="cert-modal-title" className="mt-1 font-display text-xl font-semibold text-[#F8FAFC]">
              {achievement.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close certificate preview"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#263244] bg-[#111827] text-[#94A3B8] transition-colors hover:text-[#F8FAFC]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Certificate Credential Frame */}
        <div className="mt-5 rounded-xl border border-[#263244] bg-[#080B12] bg-architectural-grid p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#B6FF5C]/30 bg-[#151C29] text-[#B6FF5C]">
            <Award className="h-6 w-6" />
          </div>
          <p className="mt-4 font-mono text-xs text-[#B6FF5C]">Verified Credential & Recognition</p>
          <h4 className="mt-2 font-display text-lg font-semibold text-[#F8FAFC]">
            Awarded to {PORTFOLIO_PROFILE.displayName}
          </h4>
          <p className="mt-1 text-sm text-[#94A3B8]">Issued by {achievement.issuer}</p>
          <div className="mt-6 flex items-center justify-center gap-4 border-t border-[#263244] pt-4 font-mono text-xs text-[#94A3B8]">
            <span>Credential ID: {achievement.credentialCode}</span>
            <span aria-hidden="true">·</span>
            <span>{achievement.year}</span>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-[#94A3B8]">{achievement.certificateNote}</p>
      </div>
    </div>
  );
};

interface ResumeModalProps {
  open: boolean;
  onClose: () => void;
}

export const ResumePreviewModal: React.FC<ResumeModalProps> = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#080B12]/85 p-3 sm:p-5 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
      onClick={onClose}
    >
      <div
        className="flex h-[92vh] w-full max-w-5xl flex-col rounded-2xl border border-[#263244] bg-[#151C29] p-4 sm:p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar with actions */}
        <div className="flex items-center justify-between gap-3 border-b border-[#263244] pb-4 shrink-0">
          <div>
            <p className="font-mono text-xs text-[#B6FF5C]">Curriculum Vitae · Official Document</p>
            <h3 id="resume-modal-title" className="mt-0.5 font-display text-lg sm:text-xl font-semibold text-[#F8FAFC]">
              {PORTFOLIO_PROFILE.displayName} — Resume
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={PORTFOLIO_PROFILE.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open resume in new tab"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#263244] bg-[#111827] px-3 text-xs font-medium text-[#F8FAFC] transition-colors hover:border-[#B6FF5C]/50 hover:text-[#B6FF5C]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Open in Tab</span>
            </a>
            <a
              href={PORTFOLIO_PROFILE.resumeUrl}
              download="Ediga_Laxmi_Koushik_Goud_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download resume PDF"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#B6FF5C] px-3.5 text-xs font-semibold text-[#080B12] transition-opacity hover:opacity-90"
            >
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close resume modal"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#263244] bg-[#111827] text-[#94A3B8] transition-colors hover:text-[#F8FAFC]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Embedded Actual PDF Viewer */}
        <div className="relative mt-4 flex-1 w-full overflow-hidden rounded-xl border border-[#263244] bg-[#080B12]">
          <iframe
            src={`${PORTFOLIO_PROFILE.resumeUrl}#toolbar=0&navpanes=0`}
            title={`${PORTFOLIO_PROFILE.displayName} Resume`}
            className="h-full w-full border-0 rounded-xl bg-white"
          />
        </div>
      </div>
    </div>
  );
};
