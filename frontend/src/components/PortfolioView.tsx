import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUp,
  ArrowUpRight,
  Award,
  Brain,
  CalendarCheck,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Database,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Github,
  GraduationCap,
  Layers,
  Layout,
  Linkedin,
  Mail,
  MapPin,
  Menu,
  Send,
  Server,
  Terminal,
  X,
} from 'lucide-react';
import {
  ABOUT_CONTENT,
  ACHIEVEMENTS_DATA,
  AchievementItem,
  EDUCATION_DATA,
  EXPERIENCE_ITEMS,
  PORTFOLIO_PROFILE,
  PROJECTS_DATA,
  ProjectItem,
  SKILL_CATEGORIES,
  SkillCategory,
} from '../data/portfolioData';
import { HeroOrbitalVisual } from './HeroOrbitalVisual';
import { TiltCard } from './TiltCard';
import { api } from '../services/api';

interface PortfolioViewProps {
  onSelectProject: (project: ProjectItem) => void;
  onSelectAchievement: (achievement: AchievementItem) => void;
  onOpenResume: () => void;
  isFramedPreview?: boolean;
  heroReplayKey?: number;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];

const SkillIcon: React.FC<{ name: SkillCategory['iconName'] }> = ({ name }) => {
  const cls = 'h-5 w-5 text-[#B6FF5C]';
  switch (name) {
    case 'code':
      return <Code2 className={cls} />;
    case 'brain':
      return <Brain className={cls} />;
    case 'layers':
      return <Layers className={cls} />;
    case 'eye':
      return <Eye className={cls} />;
    case 'layout':
      return <Layout className={cls} />;
    case 'server':
      return <Server className={cls} />;
    case 'database':
      return <Database className={cls} />;
    case 'terminal':
      return <Terminal className={cls} />;
  }
};

export const PortfolioView: React.FC<PortfolioViewProps> = ({
  onSelectProject,
  onSelectAchievement,
  onOpenResume,
  isFramedPreview = false,
  heroReplayKey = 0,
}) => {
  const [activeNav, setActiveNav] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [activeSkillTab, setActiveSkillTab] = useState<string>('all');
  const [activeAchievementTab, setActiveAchievementTab] = useState<string>('All');
  const [portraitError, setPortraitError] = useState(false);
  const [failedProjectImages, setFailedProjectImages] = useState<Record<string, boolean>>({});
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Contact form state
  const [formState, setFormState] = useState({ name: '', email: '', subject: '', message: '' });
  const [formError, setFormError] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState('');

  // Animated role cycling
  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % PORTFOLIO_PROFILE.animatedRoles.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveNav(id);
    setMobileMenuOpen(false);
    const el = document.getElementById(`portfolio-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText(PORTFOLIO_PROFILE.email).catch(() => {});
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.email.trim() || !formState.message.trim()) {
      setFormError('Please fill in your name, email address, and message.');
      return;
    }
    if (!formState.email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    setFormError('');
    setFormSubmitting(true);
    try {
      const res = await api.submitContact({
        name: formState.name.trim(),
        email: formState.email.trim(),
        subject: formState.subject.trim() || 'General Inquiry',
        message: formState.message.trim(),
      });
      setFormSubmitted(true);
      setFormSuccessMessage(res.message || 'Your message has been received successfully!');
      setFormState({ name: '', email: '', subject: '', message: '' });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to submit message. Please try again.';
      setFormError(msg);
    } finally {
      setFormSubmitting(false);
    }
  };

  const featuredProject = PROJECTS_DATA.find((p) => p.tier === 'featured')!;
  const mediumProjects = PROJECTS_DATA.filter((p) => p.tier === 'medium');
  const compactProjects = PROJECTS_DATA.filter((p) => p.tier === 'compact');

  const filteredSkills =
    activeSkillTab === 'all'
      ? SKILL_CATEGORIES
      : SKILL_CATEGORIES.filter((c) => c.id === activeSkillTab);

  const achievementFilters = ['All', ...Array.from(new Set(ACHIEVEMENTS_DATA.map((a) => a.category)))];
  const filteredAchievements =
    activeAchievementTab === 'All'
      ? ACHIEVEMENTS_DATA
      : ACHIEVEMENTS_DATA.filter((a) => a.category === activeAchievementTab);

  return (
    <div className="@container relative w-full bg-[#080B12] text-[#F8FAFC]">
      {/* A. FLOATING GLASS NAVIGATION BAR */}
      <div className={`${isFramedPreview ? 'sticky' : 'sticky'} top-3 z-40 mx-auto max-w-[1280px] px-4 @3xl:px-6`}>
        <header className="flex h-14 items-center justify-between gap-4 rounded-2xl border border-[#263244]/85 bg-[#080B12]/80 px-4 shadow-lg backdrop-blur-xl @3xl:px-6">
          {/* Zone 1: Personal Logo / Initials */}
          <button
            type="button"
            onClick={() => scrollToSection('home')}
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B6FF5C] rounded-lg"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#B6FF5C]/40 bg-[#151C29] font-display text-xs font-bold tracking-tight text-[#B6FF5C]">
              {PORTFOLIO_PROFILE.initials}
            </span>
            <span className="font-display text-sm font-semibold tracking-tight text-[#F8FAFC]">
              {PORTFOLIO_PROFILE.displayName}
            </span>
          </button>

          {/* Zone 2: Clean Single-Line Nav Links with Animated Indicator */}
          <nav className="hidden @5xl:flex items-center gap-6" aria-label="Portfolio sections">
            {NAV_ITEMS.map((item) => {
              const isActive = activeNav === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`relative py-1.5 text-sm font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:text-[#B6FF5C] ${
                    isActive ? 'text-[#F8FAFC]' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-indicator"
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                      className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-[#B6FF5C]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Resume CTA + Mobile Menu Button */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenResume}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#B6FF5C] px-3.5 py-2 text-xs font-semibold text-[#080B12] transition-all hover:opacity-90 active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B6FF5C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080B12]"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Resume</span>
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="flex @5xl:hidden h-10 w-10 items-center justify-center rounded-lg border border-[#263244] bg-[#151C29] text-[#F8FAFC] transition-colors hover:border-[#B6FF5C]/50"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </header>

        {/* Mobile / Tablet Glass Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="mt-2 rounded-2xl border border-[#263244] bg-[#111827]/95 p-3 shadow-2xl backdrop-blur-xl @5xl:hidden"
            >
              <div className="grid grid-cols-2 gap-1.5">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={`flex h-11 items-center justify-between rounded-xl px-3.5 text-sm font-medium transition-colors ${
                      activeNav === item.id
                        ? 'bg-[#151C29] text-[#B6FF5C]'
                        : 'text-[#94A3B8] hover:bg-[#151C29]/60 hover:text-[#F8FAFC]'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* B. HERO SECTION */}
      <section
        id="portfolio-home"
        className="relative overflow-hidden border-b border-[#263244]/70 pb-16 pt-10 @3xl:pb-24 @3xl:pt-16"
      >
        {/* Atmospheric backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-architectural-grid opacity-55"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-[#8B5CF6]/12 blur-[120px]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 right-1/5 h-80 w-80 rounded-full bg-[#B6FF5C]/8 blur-[120px]"
        />

        <div className="relative mx-auto max-w-[1280px] px-4 @3xl:px-6">
          <div className="grid grid-cols-1 items-center gap-10 @5xl:grid-cols-12 @5xl:gap-12">
            {/* Left Column: Editorial Hierarchy */}
            <motion.div
              key={heroReplayKey}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="@5xl:col-span-7 space-y-6"
            >
              {/* Clean Availability Indicator (No pulsing dot) */}
              <div className="inline-flex items-center gap-2 text-xs font-medium text-[#94A3B8]">
                <CalendarCheck className="h-4 w-4 shrink-0 text-[#B6FF5C]" />
                <span>{PORTFOLIO_PROFILE.availability}</span>
              </div>

              {/* Main Heading */}
              <h1 className="font-display text-3xl font-bold leading-[1.08] tracking-tight text-[#F8FAFC] text-balance @3xl:text-5xl @6xl:text-[3.5rem]">
                {PORTFOLIO_PROFILE.heroHeadline}
              </h1>

              {/* Animated Role Concept */}
              <div className="flex flex-wrap items-center gap-2.5 text-sm @3xl:text-base">
                <span className="font-mono text-xs text-[#94A3B8]">Focus</span>
                <span className="text-[#263244]" aria-hidden="true">/</span>
                <div className="relative h-6 min-w-[240px] overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={PORTFOLIO_PROFILE.animatedRoles[roleIndex]}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="block font-mono text-sm font-medium text-[#B6FF5C]"
                    >
                      {PORTFOLIO_PROFILE.animatedRoles[roleIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>

              {/* Supporting Copy */}
              <p className="max-w-2xl text-base leading-relaxed text-[#94A3B8] @3xl:text-lg">
                {PORTFOLIO_PROFILE.heroSupport}
              </p>

              {/* CTAs & Social Links */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => scrollToSection('projects')}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#B6FF5C] px-6 text-sm font-semibold text-[#080B12] transition-all hover:opacity-90 active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B6FF5C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#080B12]"
                >
                  <span>Explore My Work</span>
                  <ArrowUpRight className="h-4 w-4" />
                </button>
                <a
                  href={PORTFOLIO_PROFILE.resumeUrl}
                  download="Ediga_Laxmi_Koushik_Goud_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#263244] bg-[#151C29] px-5 text-sm font-medium text-[#F8FAFC] transition-colors hover:border-[#B6FF5C]/50 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B6FF5C]"
                >
                  <Download className="h-4 w-4 text-[#B6FF5C]" />
                  <span>Download Resume (PDF)</span>
                </a>

                <div className="flex items-center gap-2 pl-0 @3xl:pl-2">
                  <a
                    href={PORTFOLIO_PROFILE.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub Profile"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#263244] bg-[#111827] text-[#94A3B8] transition-colors hover:border-[#B6FF5C]/50 hover:text-[#F8FAFC]"
                  >
                    <Github className="h-4 w-4" />
                  </a>
                  <a
                    href={PORTFOLIO_PROFILE.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn Profile"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#263244] bg-[#111827] text-[#94A3B8] transition-colors hover:border-[#8B5CF6]/60 hover:text-[#F8FAFC]"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href={`mailto:${PORTFOLIO_PROFILE.email}`}
                    aria-label="Send Email"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#263244] bg-[#111827] text-[#94A3B8] transition-colors hover:border-[#B6FF5C]/50 hover:text-[#F8FAFC]"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Right Column: Futuristic 3D Orbital Composition */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="@5xl:col-span-5"
            >
              <div className="hidden @3xl:block">
                <HeroOrbitalVisual />
              </div>
              <div className="block @3xl:hidden">
                <HeroOrbitalVisual compact />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* C. ABOUT ME */}
      <section id="portfolio-about" className="border-b border-[#263244]/70 bg-[#111827]/45 py-16 @3xl:py-24">
        <div className="mx-auto max-w-[1280px] px-4 @3xl:px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs text-[#B6FF5C]">01. Profile & Narrative</p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#F8FAFC] @3xl:text-4xl">
                About Me
              </h2>
            </div>
            <p className="font-mono text-xs text-[#94A3B8]">
              Professional Profile · Engineering & Innovation
            </p>
          </div>

          {/* Editorial Split Layout */}
          <div className="grid grid-cols-1 items-stretch gap-8 @3xl:grid-cols-12 @3xl:gap-10">
            {/* Portrait Card */}
            <div className="@3xl:col-span-5">
              <div className="relative h-full min-h-[380px] overflow-hidden rounded-2xl border border-[#263244] bg-[#151C29]">
                {!portraitError ? (
                  <img
                    src={PORTFOLIO_PROFILE.portraitImage}
                    alt={PORTFOLIO_PROFILE.displayName}
                    referrerPolicy="no-referrer"
                    onError={() => setPortraitError(true)}
                    className="h-full w-full object-cover object-top"
                  />
                ) : (
                  <div className="flex h-full min-h-[380px] flex-col items-center justify-center bg-architectural-grid p-8 text-center">
                    <span className="font-display text-3xl font-bold text-[#B6FF5C]">
                      {PORTFOLIO_PROFILE.initials}
                    </span>
                    <span className="mt-2 font-mono text-xs text-[#94A3B8]">
                      {PORTFOLIO_PROFILE.displayName}
                    </span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#080B12] via-[#080B12]/85 to-transparent p-5">
                  <p className="font-display text-base font-semibold text-[#F8FAFC]">
                    {PORTFOLIO_PROFILE.displayName}
                  </p>
                </div>
              </div>
            </div>

            {/* Editorial Narrative Blocks */}
            <div className="@3xl:col-span-7 flex flex-col justify-between space-y-6">
              <div className="space-y-6">
                <div className="border-b border-[#263244]/80 pb-5">
                  <h3 className="font-display text-sm font-semibold text-[#F8FAFC]">Introduction</h3>
                  <p className="mt-2 text-base leading-relaxed text-[#94A3B8]">
                    {ABOUT_CONTENT.introduction}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 @3xl:grid-cols-2">
                  <div>
                    <h3 className="font-display text-sm font-semibold text-[#F8FAFC]">
                      Professional Interests
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">
                      {ABOUT_CONTENT.interests}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-[#F8FAFC]">
                      Technical Focus
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">
                      {ABOUT_CONTENT.technicalFocus}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-[#263244] bg-[#151C29] p-5">
                  <h3 className="font-display text-sm font-semibold text-[#B6FF5C]">Career Vision</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#F8FAFC]/90">
                    {ABOUT_CONTENT.careerVision}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* D. TECHNICAL SKILLS */}
      <section id="portfolio-skills" className="border-b border-[#263244]/70 py-16 @3xl:py-24">
        <div className="mx-auto max-w-[1280px] px-4 @3xl:px-6">
          <div className="mb-8 flex flex-col justify-between gap-4 @3xl:flex-row @3xl:items-end">
            <div>
              <p className="font-mono text-xs text-[#B6FF5C]">02. Engineering Stack</p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#F8FAFC] @3xl:text-4xl">
                Technical Skills
              </h2>
            </div>
          </div>

          {/* Interactive Category Filter Bar (Redesigned for easy mobile/tablet navigation) */}
          <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2">
            <button
              type="button"
              onClick={() => setActiveSkillTab('all')}
              className={`h-9 rounded-lg px-3.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeSkillTab === 'all'
                  ? 'bg-[#B6FF5C] text-[#080B12] font-semibold'
                  : 'border border-[#263244] bg-[#151C29] text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              All Domains ({SKILL_CATEGORIES.length})
            </button>
            {SKILL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveSkillTab(cat.id)}
                className={`h-9 rounded-lg px-3.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  activeSkillTab === cat.id
                    ? 'bg-[#B6FF5C] text-[#080B12] font-semibold'
                    : 'border border-[#263244] bg-[#151C29] text-[#94A3B8] hover:text-[#F8FAFC]'
                }`}
              >
                {cat.title}
              </button>
            ))}
          </div>

          {/* Categorized Technology Grid */}
          <div className="grid grid-cols-1 gap-5 @3xl:grid-cols-2 @6xl:grid-cols-4">
            {filteredSkills.map((category, idx) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="flex flex-col rounded-2xl border border-[#263244] bg-[#151C29] p-5 transition-colors hover:border-[#8B5CF6]/50"
              >
                <div className="flex items-start justify-between gap-3 border-b border-[#263244]/80 pb-4">
                  <div>
                    <h3 className="font-display text-base font-semibold text-[#F8FAFC]">
                      {category.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#94A3B8]">{category.subtitle}</p>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#263244] bg-[#111827]">
                    <SkillIcon name={category.iconName} />
                  </div>
                </div>

                <ul className="mt-4 space-y-2.5">
                  {category.technologies.map((tech) => (
                    <li
                      key={tech.name}
                      className="flex items-baseline justify-between gap-2 text-sm"
                    >
                      <span className="font-medium text-[#F8FAFC]">{tech.name}</span>
                      <span className="font-mono text-[11px] text-[#94A3B8] truncate">
                        {tech.context}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* E. EXPERIENCE TIMELINE */}
      <section id="portfolio-experience" className="border-b border-[#263244]/70 bg-[#111827]/45 py-16 @3xl:py-24">
        <div className="mx-auto max-w-[1280px] px-4 @3xl:px-6">
          <div className="mb-12">
            <p className="font-mono text-xs text-[#B6FF5C]">03. Career & Research</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#F8FAFC] @3xl:text-4xl">
              Experience
            </h2>
          </div>

          <div className="relative pl-6 @3xl:pl-10">
            {/* Vertical Timeline Spine */}
            <div
              aria-hidden="true"
              className="absolute bottom-2 left-2 top-2 w-px bg-gradient-to-b from-[#B6FF5C] via-[#8B5CF6] to-[#263244] @3xl:left-3"
            />

            <div className="space-y-8">
              {EXPERIENCE_ITEMS.map((exp, idx) => (
                <motion.article
                  key={exp.id}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="relative rounded-2xl border border-[#263244] bg-[#151C29] p-5 @3xl:p-7"
                >
                  {/* Geometric Timeline Node */}
                  <span
                    aria-hidden="true"
                    className="absolute -left-[22px] top-7 flex h-3.5 w-3.5 items-center justify-center rounded-sm border border-[#B6FF5C] bg-[#080B12] @3xl:-left-[34px]"
                  >
                    <span className="h-1.5 w-1.5 bg-[#B6FF5C]" />
                  </span>

                  <div className="flex flex-col justify-between gap-2 border-b border-[#263244]/80 pb-4 @3xl:flex-row @3xl:items-center">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-[#F8FAFC] @3xl:text-xl">
                        {exp.position}
                      </h3>
                      <p className="mt-0.5 text-sm font-medium text-[#B6FF5C]">
                        {exp.organization}
                      </p>
                    </div>
                    <div className="font-mono text-xs text-[#94A3B8] @3xl:text-right">
                      <p>{exp.duration}</p>
                      <p className="mt-0.5">{exp.location}</p>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-[#94A3B8]">{exp.description}</p>

                  <ul className="mt-4 space-y-2">
                    {exp.contributions.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2.5 text-sm text-[#F8FAFC]/90">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#8B5CF6]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Clean Typographic Technologies */}
                  <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-[#263244]/80 pt-4 font-mono text-xs text-[#94A3B8]">
                    <span className="text-[#F8FAFC]">Stack:</span>
                    {exp.technologies.map((tech, tIdx) => (
                      <React.Fragment key={tech}>
                        <span>{tech}</span>
                        {tIdx < exp.technologies.length - 1 && (
                          <span aria-hidden="true">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* F. FEATURED PROJECTS */}
      <section id="portfolio-projects" className="border-b border-[#263244]/70 py-16 @3xl:py-24">
        <div className="mx-auto max-w-[1280px] px-4 @3xl:px-6">
          <div className="mb-10 flex flex-col justify-between gap-4 @3xl:flex-row @3xl:items-end">
            <div>
              <p className="font-mono text-xs text-[#B6FF5C]">04. Selected Engineering Works</p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#F8FAFC] @3xl:text-4xl">
                Featured Projects
              </h2>
            </div>
          </div>

          {/* 1 Large Featured Project */}
          <TiltCard className="mb-8 rounded-2xl border border-[#263244] bg-[#151C29] overflow-hidden">
            <div className="grid grid-cols-1 @5xl:grid-cols-12">
              {/* Browser Mockup Frame */}
              <div className="@5xl:col-span-7 border-b border-[#263244] bg-[#0B101A] @5xl:border-b-0 @5xl:border-r">
                <div className="flex items-center justify-between border-b border-[#263244] bg-[#111827] px-4 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#263244]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#263244]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#263244]" />
                  </div>
                  <span className="font-mono text-[11px] text-[#94A3B8] truncate max-w-[220px]">
                    prototype.yourname.dev/aethergraph
                  </span>
                  <span className="font-mono text-[11px] text-[#B6FF5C]">16:9</span>
                </div>
                <div className="overflow-hidden">
                  {!failedProjectImages[featuredProject.id] ? (
                    <img
                      src={featuredProject.image}
                      alt={featuredProject.name}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setFailedProjectImages((prev) => ({ ...prev, [featuredProject.id]: true }))
                      }
                      className="aspect-video w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex aspect-video w-full items-center justify-center bg-architectural-grid p-8">
                      <span className="font-display text-lg text-[#F8FAFC]">{featuredProject.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Project Narrative & Actions */}
              <div className="@5xl:col-span-5 flex flex-col justify-between p-6 @3xl:p-8">
                <div>
                  <p className="font-mono text-xs text-[#B6FF5C]">{featuredProject.kicker}</p>
                  <h3 className="mt-2 font-display text-xl font-bold text-[#F8FAFC] @3xl:text-2xl">
                    {featuredProject.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#94A3B8]">
                    {featuredProject.tagline}
                  </p>

                  <div className="mt-5 grid grid-cols-3 gap-2 border-y border-[#263244]/80 py-3.5">
                    {featuredProject.metrics.map((m) => (
                      <div key={m.label}>
                        <p className="text-[11px] text-[#94A3B8]">{m.label}</p>
                        <p className="mt-0.5 font-mono text-xs font-medium text-[#F8FAFC]">
                          {m.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-[#94A3B8]">
                    {featuredProject.technologies.map((tech, idx) => (
                      <React.Fragment key={tech}>
                        <span className="text-[#F8FAFC]/90">{tech}</span>
                        {idx < featuredProject.technologies.length - 1 && (
                          <span aria-hidden="true">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onSelectProject(featuredProject)}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#B6FF5C] px-4 text-xs font-semibold text-[#080B12] transition-opacity hover:opacity-90 whitespace-nowrap shrink-0"
                  >
                    <span>View Details</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                  <a
                    href={featuredProject.githubUrl}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#263244] bg-[#111827] px-3.5 text-xs font-medium text-[#F8FAFC] hover:border-[#B6FF5C]/50 whitespace-nowrap shrink-0"
                  >
                    <Github className="h-3.5 w-3.5" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href={featuredProject.liveUrl}
                    className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#263244] bg-[#111827] px-3.5 text-xs font-medium text-[#F8FAFC] hover:border-[#8B5CF6]/50 whitespace-nowrap shrink-0"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Live Demo</span>
                  </a>
                </div>
              </div>
            </div>
          </TiltCard>

          {/* 2 Medium-Sized Project Cards */}
          <div className="mb-8 grid grid-cols-1 gap-6 @3xl:grid-cols-2">
            {mediumProjects.map((project) => (
              <TiltCard
                key={project.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-[#263244] bg-[#151C29]"
              >
                {/* Mini Browser Frame */}
                <div className="border-b border-[#263244] bg-[#0B101A]">
                  <div className="flex items-center justify-between border-b border-[#263244] bg-[#111827] px-4 py-2">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-[#263244]" />
                      <span className="h-2 w-2 rounded-full bg-[#263244]" />
                      <span className="h-2 w-2 rounded-full bg-[#263244]" />
                    </div>
                    <span className="font-mono text-[11px] text-[#94A3B8]">{project.kicker}</span>
                  </div>
                  <div className="overflow-hidden">
                    {!failedProjectImages[project.id] ? (
                      <img
                        src={project.image}
                        alt={project.name}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedProjectImages((prev) => ({ ...prev, [project.id]: true }))
                        }
                        className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex aspect-[4/3] w-full items-center justify-center bg-architectural-grid p-6">
                        <span className="font-display text-base text-[#F8FAFC]">{project.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#F8FAFC]">{project.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">{project.tagline}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-[#94A3B8]">
                      {project.technologies.map((tech, idx) => (
                        <React.Fragment key={tech}>
                          <span className="text-[#F8FAFC]/90">{tech}</span>
                          {idx < project.technologies.length - 1 && (
                            <span aria-hidden="true">·</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-2.5 border-t border-[#263244]/80 pt-4">
                    <button
                      type="button"
                      onClick={() => onSelectProject(project)}
                      className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#B6FF5C] px-4 text-xs font-semibold text-[#080B12] hover:opacity-90 whitespace-nowrap shrink-0"
                    >
                      <span>View Details</span>
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                    <a
                      href={project.githubUrl}
                      className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#263244] bg-[#111827] px-3.5 text-xs font-medium text-[#F8FAFC] hover:border-[#B6FF5C]/50 whitespace-nowrap shrink-0"
                    >
                      <Github className="h-3.5 w-3.5" />
                      <span>GitHub</span>
                    </a>
                    <a
                      href={project.liveUrl}
                      className="inline-flex h-10 items-center gap-1.5 rounded-lg border border-[#263244] bg-[#111827] px-3.5 text-xs font-medium text-[#F8FAFC] hover:border-[#8B5CF6]/50 whitespace-nowrap shrink-0"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Demo</span>
                    </a>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>

          {/* 3 Additional Smaller Project Cards */}
          <div className="grid grid-cols-1 gap-5 @3xl:grid-cols-3">
            {compactProjects.map((project) => (
              <TiltCard
                key={project.id}
                maxTilt={3.5}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[#263244] bg-[#151C29] p-5"
              >
                <div>
                  <div className="mb-4 overflow-hidden rounded-xl border border-[#263244] bg-[#0B101A]">
                    {project.image && !failedProjectImages[project.id] ? (
                      <img
                        src={project.image}
                        alt={project.name}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setFailedProjectImages((prev) => ({ ...prev, [project.id]: true }))
                        }
                        className="aspect-[16/10] w-full object-cover"
                      />
                    ) : (
                      <div className="flex aspect-[16/10] w-full flex-col items-center justify-center bg-architectural-grid p-4 text-center">
                        <Code2 className="h-5 w-5 text-[#8B5CF6]" />
                        <span className="mt-2 font-mono text-[11px] text-[#94A3B8]">
                          {project.kicker}
                        </span>
                      </div>
                    )}
                  </div>

                  <p className="font-mono text-[11px] text-[#B6FF5C]">{project.kicker}</p>
                  <h3 className="mt-1.5 font-display text-base font-bold text-[#F8FAFC]">
                    {project.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#94A3B8]">{project.tagline}</p>

                  <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] text-[#94A3B8]">
                    {project.technologies.map((tech, idx) => (
                      <React.Fragment key={tech}>
                        <span>{tech}</span>
                        {idx < project.technologies.length - 1 && <span aria-hidden="true">·</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between gap-2 border-t border-[#263244]/80 pt-3.5">
                  <button
                    type="button"
                    onClick={() => onSelectProject(project)}
                    className="inline-flex h-9 items-center gap-1 rounded-lg bg-[#111827] border border-[#263244] px-3 text-xs font-medium text-[#B6FF5C] hover:border-[#B6FF5C]/50 whitespace-nowrap shrink-0"
                  >
                    <span>Details</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                  <div className="flex items-center gap-1.5">
                    <a
                      href={project.githubUrl}
                      aria-label={`${project.name} GitHub`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#263244] bg-[#111827] text-[#94A3B8] hover:text-[#F8FAFC]"
                    >
                      <Github className="h-3.5 w-3.5" />
                    </a>
                    <a
                      href={project.liveUrl}
                      aria-label={`${project.name} Live Demo`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#263244] bg-[#111827] text-[#94A3B8] hover:text-[#F8FAFC]"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* G. ACHIEVEMENTS */}
      <section id="portfolio-achievements" className="border-b border-[#263244]/70 bg-[#111827]/45 py-16 @3xl:py-24">
        <div className="mx-auto max-w-[1280px] px-4 @3xl:px-6">
          <div className="mb-8 flex flex-col justify-between gap-4 @3xl:flex-row @3xl:items-end">
            <div>
              <p className="font-mono text-xs text-[#B6FF5C]">05. Honors & Credentials</p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#F8FAFC] @3xl:text-4xl">
                Achievements
              </h2>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {achievementFilters.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveAchievementTab(cat)}
                  className={`h-9 rounded-lg px-3 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    activeAchievementTab === cat
                      ? 'bg-[#B6FF5C] text-[#080B12] font-semibold'
                      : 'border border-[#263244] bg-[#151C29] text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 @3xl:grid-cols-2 @6xl:grid-cols-3">
            {filteredAchievements.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-[#263244] bg-[#151C29] p-6 transition-colors hover:border-[#B6FF5C]/40"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-mono text-xs text-[#94A3B8]">
                      <span className="text-[#B6FF5C]">{item.category}</span>
                      <span className="mx-1.5" aria-hidden="true">·</span>
                      <span>{item.year}</span>
                    </div>
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#263244] bg-[#111827] text-[#B6FF5C]">
                      <Award className="h-4 w-4" />
                    </div>
                  </div>

                  <h3 className="mt-3 font-display text-base font-bold text-[#F8FAFC]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-[#8B5CF6]">{item.issuer}</p>
                  <p className="mt-3 text-sm leading-relaxed text-[#94A3B8]">{item.summary}</p>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#263244]/80 pt-4">
                  <span className="font-mono text-[11px] text-[#94A3B8] truncate">
                    {item.credentialCode}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-xs text-[#B6FF5C]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Verified Credential</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* H. EDUCATION */}
      <section id="portfolio-education" className="border-b border-[#263244]/70 py-16 @3xl:py-24">
        <div className="mx-auto max-w-[1280px] px-4 @3xl:px-6">
          <div className="mb-10">
            <p className="font-mono text-xs text-[#B6FF5C]">06. Academic Foundation</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight text-[#F8FAFC] @3xl:text-4xl">
              Education
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 @3xl:grid-cols-2">
            {EDUCATION_DATA.map((edu) => (
              <div
                key={edu.id}
                className="rounded-2xl border border-[#263244] bg-[#151C29] p-6 @3xl:p-7"
              >
                <div className="flex items-start justify-between gap-4 border-b border-[#263244]/80 pb-4">
                  <div>
                    <p className="font-mono text-xs text-[#B6FF5C]">{edu.duration}</p>
                    <h3 className="mt-1.5 font-display text-lg font-bold text-[#F8FAFC]">
                      {edu.degree}
                    </h3>
                    <p className="mt-1 text-sm text-[#94A3B8]">{edu.institution}</p>
                  </div>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#263244] bg-[#111827] text-[#8B5CF6]">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-4 text-sm font-medium text-[#F8FAFC]">{edu.specialization}</p>
                <p className="mt-1 font-mono text-xs text-[#94A3B8]">{edu.standing}</p>

                <div className="mt-5 border-t border-[#263244]/80 pt-4">
                  <p className="font-mono text-xs text-[#94A3B8]">Relevant Coursework</p>
                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#F8FAFC]/90">
                    {edu.coursework.map((course, idx) => (
                      <React.Fragment key={course}>
                        <span>{course}</span>
                        {idx < edu.coursework.length - 1 && (
                          <span className="text-[#94A3B8]" aria-hidden="true">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* I. CONTACT */}
      <section id="portfolio-contact" className="border-b border-[#263244]/70 py-16 @3xl:py-24">
        <div className="mx-auto max-w-[1280px] px-4 @3xl:px-6">
          <div className="grid grid-cols-1 gap-10 @5xl:grid-cols-12 @5xl:gap-12">
            {/* Left Info */}
            <div className="@5xl:col-span-5 flex flex-col justify-between space-y-8">
              <div>
                <p className="font-mono text-xs text-[#B6FF5C]">07. Initiate Conversation</p>
                <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-[#F8FAFC] text-balance @3xl:text-4xl">
                  Let&apos;s Create Something Extraordinary.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-[#94A3B8]">
                  Open to software engineering internships, applied machine learning research collaborations,
                  and ambitious technical product engineering opportunities.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-[#263244] bg-[#151C29] p-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <Mail className="h-4 w-4 shrink-0 text-[#B6FF5C]" />
                    <div className="min-w-0">
                      <p className="text-xs text-[#94A3B8]">Email</p>
                      <p className="truncate font-mono text-sm text-[#F8FAFC]">
                        {PORTFOLIO_PROFILE.email}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#263244] bg-[#111827] px-3 text-xs font-medium text-[#F8FAFC] hover:border-[#B6FF5C]/50 whitespace-nowrap shrink-0"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#B6FF5C]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {PORTFOLIO_PROFILE.phone && (
                  <div className="flex items-center justify-between rounded-xl border border-[#263244] bg-[#151C29] p-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-4 w-4 items-center justify-center font-mono text-xs font-bold text-[#B6FF5C]">
                        #
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-[#94A3B8]">Phone / Mobile</p>
                        <p className="truncate font-mono text-sm text-[#F8FAFC]">
                          {PORTFOLIO_PROFILE.phone}
                        </p>
                      </div>
                    </div>
                    <a
                      href={`tel:${PORTFOLIO_PROFILE.phone.replace(/\s+/g, '')}`}
                      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-[#263244] bg-[#111827] px-3 text-xs font-medium text-[#F8FAFC] hover:border-[#B6FF5C]/50 whitespace-nowrap shrink-0"
                    >
                      <span>Call</span>
                    </a>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={PORTFOLIO_PROFILE.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-[#263244] bg-[#151C29] p-4 transition-colors hover:border-[#B6FF5C]/40"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Github className="h-4 w-4 shrink-0 text-[#F8FAFC]" />
                      <span className="truncate text-sm font-medium text-[#F8FAFC]">GitHub</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[#94A3B8]" />
                  </a>
                  <a
                    href={PORTFOLIO_PROFILE.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-[#263244] bg-[#151C29] p-4 transition-colors hover:border-[#8B5CF6]/50"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Linkedin className="h-4 w-4 shrink-0 text-[#8B5CF6]" />
                      <span className="truncate text-sm font-medium text-[#F8FAFC]">LinkedIn</span>
                    </div>
                    <ArrowUpRight className="h-4 w-4 shrink-0 text-[#94A3B8]" />
                  </a>
                </div>

                <a
                  href={PORTFOLIO_PROFILE.resumeUrl}
                  download="Ediga_Laxmi_Koushik_Goud_Resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#B6FF5C]/40 bg-[#151C29] px-5 text-sm font-semibold text-[#B6FF5C] transition-colors hover:bg-[#B6FF5C] hover:text-[#080B12]"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Resume (PDF)</span>
                </a>
              </div>
            </div>

            {/* Right Contact Form Design */}
            <div className="@5xl:col-span-7">
              <form
                onSubmit={handleContactSubmit}
                noValidate
                className="rounded-2xl border border-[#263244] bg-[#151C29] p-6 @3xl:p-8 space-y-5"
              >
                <div className="flex items-center justify-between border-b border-[#263244]/80 pb-4">
                  <h3 className="font-display text-lg font-semibold text-[#F8FAFC]">
                    Direct Inquiry Form
                  </h3>
                  <span className="font-mono text-xs text-[#B6FF5C]">Direct Message</span>
                </div>

                <div className="grid grid-cols-1 gap-4 @3xl:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className="block text-xs font-medium text-[#94A3B8]">
                      Your Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={formState.name}
                      onChange={(e) => {
                        setFormState((s) => ({ ...s, name: e.target.value }));
                        setFormSubmitted(false);
                      }}
                      placeholder="Alex Rivera"
                      className="mt-1.5 h-11 w-full rounded-xl border border-[#263244] bg-[#080B12] px-3.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 transition-colors focus:border-[#B6FF5C] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-xs font-medium text-[#94A3B8]">
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={formState.email}
                      onChange={(e) => {
                        setFormState((s) => ({ ...s, email: e.target.value }));
                        setFormSubmitted(false);
                      }}
                      placeholder="alex@company.com"
                      className="mt-1.5 h-11 w-full rounded-xl border border-[#263244] bg-[#080B12] px-3.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 transition-colors focus:border-[#B6FF5C] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block text-xs font-medium text-[#94A3B8]">
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    value={formState.subject}
                    onChange={(e) => {
                      setFormState((s) => ({ ...s, subject: e.target.value }));
                      setFormSubmitted(false);
                    }}
                    placeholder="ML Engineering Internship / Project Collaboration"
                    className="mt-1.5 h-11 w-full rounded-xl border border-[#263244] bg-[#080B12] px-3.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 transition-colors focus:border-[#B6FF5C] focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-medium text-[#94A3B8]">
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={formState.message}
                    onChange={(e) => {
                      setFormState((s) => ({ ...s, message: e.target.value }));
                      setFormSubmitted(false);
                    }}
                    placeholder="Tell me about the role, research problem, or engineering challenge..."
                    className="mt-1.5 w-full rounded-xl border border-[#263244] bg-[#080B12] p-3.5 text-sm text-[#F8FAFC] placeholder-[#94A3B8]/50 transition-colors focus:border-[#B6FF5C] focus:outline-none"
                  />
                </div>

                {formError && (
                  <p className="text-xs font-medium text-rose-400" role="alert">
                    {formError}
                  </p>
                )}

                {formSubmitted && (
                  <div className="flex items-center gap-2 rounded-xl border border-[#B6FF5C]/40 bg-[#080B12] p-3 text-xs text-[#B6FF5C]">
                    <Check className="h-4 w-4 shrink-0" />
                    <span>
                      {formSuccessMessage || 'Your message has been received successfully.'}
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#B6FF5C] px-6 text-sm font-semibold text-[#080B12] transition-all hover:opacity-90 active:scale-[0.99] disabled:opacity-60 @3xl:w-auto"
                >
                  <Send className="h-4 w-4" />
                  <span>{formSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* K. FOOTER */}
      <footer className="bg-[#080B12] py-10">
        <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 px-4 @3xl:flex-row @3xl:items-center @3xl:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#263244] bg-[#151C29] font-display text-xs font-bold text-[#B6FF5C]">
              {PORTFOLIO_PROFILE.initials}
            </span>
            <div>
              <p className="font-display text-sm font-semibold text-[#F8FAFC]">
                {PORTFOLIO_PROFILE.displayName}
              </p>
              <p className="text-xs text-[#94A3B8]">
                © 2026 {PORTFOLIO_PROFILE.displayName}. All rights reserved.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs text-[#94A3B8]">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="transition-colors hover:text-[#F8FAFC] whitespace-nowrap"
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollToSection('home')}
            className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-[#263244] bg-[#151C29] px-4 text-xs font-medium text-[#F8FAFC] transition-colors hover:border-[#B6FF5C]/50 whitespace-nowrap shrink-0"
          >
            <ArrowUp className="h-3.5 w-3.5 text-[#B6FF5C]" />
            <span>Back to Top</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
