import React, { useState } from 'react';
import { AchievementItem, ProjectItem } from './data/portfolioData';
import { PortfolioView } from './components/PortfolioView';
import {
  CertificatePreviewModal,
  ProjectDetailModal,
  ResumePreviewModal,
} from './components/PortfolioModals';
import { LoadingConceptOverlay } from './components/LoadingConceptOverlay';

export default function App() {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<AchievementItem | null>(null);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [loadingConceptActive, setLoadingConceptActive] = useState(false);

  return (
    <div className="min-h-screen bg-[#080B12] text-[#F8FAFC]">
      {/* Production Portfolio View - direct entry without prototype toolbar */}
      <main>
        <PortfolioView
          onSelectProject={setSelectedProject}
          onSelectAchievement={setSelectedAchievement}
          onOpenResume={() => setResumeOpen(true)}
        />
      </main>

      {/* Interactive Modals */}
      <ProjectDetailModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
      <CertificatePreviewModal
        achievement={selectedAchievement}
        onClose={() => setSelectedAchievement(null)}
      />
      <ResumePreviewModal
        open={resumeOpen}
        onClose={() => setResumeOpen(false)}
      />
      <LoadingConceptOverlay
        active={loadingConceptActive}
        onComplete={() => setLoadingConceptActive(false)}
      />
    </div>
  );
}
