'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Article, ReaderProfile, LearningSignals, PaperEdition } from '../types';
import { AgentLog } from '../agents/types';
import { NewsroomOrchestrator } from '../agents/NewsroomOrchestrator';
import {
  loadReaderProfile,
  saveReaderProfile,
  loadLearningSignals,
  saveLearningSignals,
  loadCurrentEdition,
  saveCurrentEdition,
  loadEditionsHistory,
  registerSkip,
  registerRead,
  registerLike,
  registerBookmark,
  generatePersonalEdition,
  ensureInitialArchiveEditions,
  DEFAULT_SIGNALS,
  DEFAULT_PROFILE
} from '../utils/learningEngine';
import { generateNewspaperPDF } from '../utils/pdfGenerator';
import {
  checkServerHealth,
  apiFetchProfile,
  apiSaveProfile,
  apiFetchSignals,
  apiSendSignalAction
} from '../services/api';

import { Masthead } from '../components/Masthead';
import { AudioDispatchBar } from '../components/AudioDispatchBar';
import { ChiefEditorDesk } from '../components/ChiefEditorDesk';
import { LeadArticle } from '../components/LeadArticle';
import { SideArticles } from '../components/SideArticles';
import { SectionArticles } from '../components/SectionArticles';
import { CoffeeBreak } from '../components/CoffeeBreak';
import { NuanceLens } from '../components/NuanceLens';
import { ArticleModal } from '../components/ArticleModal';
import { OnboardingModal } from '../components/OnboardingModal';
import { LearningMatrixDrawer } from '../components/LearningMatrixDrawer';
import { ArchiveModal } from '../components/ArchiveModal';
import { ArchitectureModal } from '../components/ArchitectureModal';
import { PrintNewspaperTemplate } from '../components/PrintNewspaperTemplate';
import { AskPaperDrawer } from '../components/AskPaperDrawer';
import { SearchBar } from '../components/SearchBar';
import { LiveWireBar } from '../components/LiveWireBar';
import { AgentsRoomModal } from '../components/AgentsRoomModal';
import { Database, Bot, Sparkles, ArrowUp } from 'lucide-react';

export default function MorningPaperPage() {
  // Initialize with stable server-safe defaults to avoid SSR/client hydration mismatch.
  // The real localStorage values are loaded in the useEffect below (client-only).
  const [profile, setProfile] = useState<ReaderProfile>(DEFAULT_PROFILE);
  const [signals, setSignals] = useState<LearningSignals>(DEFAULT_SIGNALS);
  const [edition, setEdition] = useState<PaperEdition>(() => generatePersonalEdition(DEFAULT_PROFILE, DEFAULT_SIGNALS, 0));
  const [editionsHistory, setEditionsHistory] = useState<PaperEdition[]>([]);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [isProcessingAgents, setIsProcessingAgents] = useState<boolean>(false);

  const [activeArticleModal, setActiveArticleModal] = useState<Article | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(!profile.onboardingCompleted);
  const [isLearningMatrixOpen, setIsLearningMatrixOpen] = useState<boolean>(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState<boolean>(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [isAskPaperOpen, setIsAskPaperOpen] = useState<boolean>(false);
  const [isAgentsRoomOpen, setIsAgentsRoomOpen] = useState<boolean>(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState<boolean>(false);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [dayOffset, setDayOffset] = useState<number>(0);

  // Synchronize theme on html element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', profile.theme || 'broadsheet');
  }, [profile.theme]);

  // Hydrate from localStorage after mount (client-only).
  // This runs once and overwrites the server-safe defaults with real persisted values,
  // avoiding any SSR vs client HTML mismatch.
  useEffect(() => {
    const savedProfile = loadReaderProfile();
    const savedSignals = loadLearningSignals();
    const savedEdition = loadCurrentEdition();
    const savedHistory = loadEditionsHistory();
    setProfile(savedProfile);
    setSignals(savedSignals);
    setEdition(savedEdition);
    setEditionsHistory(savedHistory);
    setIsHydrated(true);
  }, []);

  // Initial Assembly via Multi-Agent Newsroom (runs after hydration so it has real profile/signals).
  useEffect(() => {
    if (!isHydrated) return;
    runAutonomousEditorialAssembly(profile, signals, 0);
    ensureInitialArchiveEditions();
    setEditionsHistory(loadEditionsHistory());

    checkServerHealth().then(online => {
      setIsBackendConnected(online);
      if (online) {
        apiFetchProfile().then(serverProfile => {
          if (serverProfile) {
            setProfile(serverProfile);
            saveReaderProfile(serverProfile);
          }
        });
        apiFetchSignals().then(serverSignals => {
          if (serverSignals) {
            setSignals(serverSignals);
            saveLearningSignals(serverSignals);
          }
        });
      }
    });
  }, [isHydrated]);

  const runAutonomousEditorialAssembly = async (p: ReaderProfile, s: LearningSignals, offset: number) => {
    setIsProcessingAgents(true);
    try {
      // First attempt server-side multi-agent assembly where Gemini 2.5 Flash is running
      const res = await fetch('/api/agents/editorial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: p, signals: s, dateOffsetDays: offset }),
        signal: AbortSignal.timeout(15000)
      }).catch(() => null);

      if (res && res.ok) {
        const data = await res.json();
        if (data.edition) {
          setEdition(data.edition);
          setAgentLogs(data.agentLogs || []);
          saveCurrentEdition(data.edition);
          return;
        }
      }

      // Fallback to local deterministic agent assembly
      const result = await NewsroomOrchestrator.assembleEdition(p, s, offset);
      setEdition(result.edition);
      setAgentLogs(result.logs);
      saveCurrentEdition(result.edition);
    } catch (err) {
      console.warn('Agent assembly fallback to direct composition', err);
      const fallbackEdition = generatePersonalEdition(p, s, offset);
      setEdition(fallbackEdition);
      saveCurrentEdition(fallbackEdition);
    } finally {
      setIsProcessingAgents(false);
    }
  };

  const handleThemeChange = (theme: 'broadsheet' | 'midnight' | 'sepia') => {
    const updated = { ...profile, theme };
    setProfile(updated);
    saveReaderProfile(updated);
    apiSaveProfile(updated);
    document.documentElement.setAttribute('data-theme', theme);
  };

  const handleOnboardingComplete = (newProfile: ReaderProfile) => {
    setProfile(newProfile);
    saveReaderProfile(newProfile);
    apiSaveProfile(newProfile);
    setIsOnboardingOpen(false);

    runAutonomousEditorialAssembly(newProfile, signals, dayOffset);
    setEditionsHistory(loadEditionsHistory());
  };

  // Learning interactions
  const handleSkip = (article: Article) => {
    const res = registerSkip(article.id, article.category, article.title, article.tags);
    setSignals({ ...res.signals });
    setEdition({ ...res.edition });
    apiSendSignalAction(article.id, article.title, article.category, 'skip', article.tags);
  };

  const handleLike = (article: Article) => {
    const res = registerLike(article.id, article.category, article.title, article.tags);
    setSignals({ ...res.signals });
    setEdition({ ...res.edition });
    apiSendSignalAction(article.id, article.title, article.category, 'like', article.tags);
  };

  const handleBookmark = (article: Article) => {
    const res = registerBookmark(article.id, article.category, article.title);
    setSignals({ ...res.signals });
    setEdition({ ...res.edition });
    apiSendSignalAction(article.id, article.title, article.category, 'bookmark', article.tags);
  };

  const handleArticleRead = (article: Article) => {
    const res = registerRead(article.id, article.category, article.title, article.tags);
    setSignals({ ...res.signals });
    apiSendSignalAction(article.id, article.title, article.category, 'read', article.tags);
  };

  const handleSimulateNextDay = () => {
    const nextOffset = dayOffset + 1;
    setDayOffset(nextOffset);
    runAutonomousEditorialAssembly(profile, signals, nextOffset);
    setIsLearningMatrixOpen(false);
  };

  const handleResetSignals = () => {
    saveLearningSignals(DEFAULT_SIGNALS);
    setSignals(DEFAULT_SIGNALS);
    runAutonomousEditorialAssembly(profile, DEFAULT_SIGNALS, dayOffset);
  };

  const handleSelectArchiveEdition = (selectedEdition: PaperEdition) => {
    setEdition(selectedEdition);
  };

  const handleDownloadPDF = async () => {
    setIsDownloadingPDF(true);
    try {
      const filename = `${profile.newspaperName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${edition.shortDate}`;
      await generateNewspaperPDF('printable-newspaper', filename);
    } catch (err) {
      console.error('Failed to generate PDF', err);
      alert('PDF generation encountered an error. Please try again.');
    } finally {
      setIsDownloadingPDF(false);
    }
  };

  const filteredSections = useMemo(() => {
    return edition.sections.map(sec => {
      if (selectedCategory !== 'ALL' && sec.category !== selectedCategory) {
        return null;
      }

      const matchingArticles = sec.articles.filter(art => {
        if (!searchTerm) return true;
        const query = searchTerm.toLowerCase();
        return (
          art.title.toLowerCase().includes(query) ||
          art.subhead.toLowerCase().includes(query) ||
          art.category.toLowerCase().includes(query) ||
          art.tags.some(t => t.toLowerCase().includes(query))
        );
      });

      if (matchingArticles.length === 0) return null;
      return { ...sec, articles: matchingArticles };
    }).filter(Boolean) as { category: string; articles: Article[] }[];
  }, [edition.sections, searchTerm, selectedCategory]);

  return (
    <div className="newspaper-wrapper">
      {/* Top Architecture & Connectivity Badges */}
      <div className="system-status-ribbon">
        <span
          className="info-chip"
          title="Supabase PostgreSQL database connectivity status"
          style={{ borderColor: isBackendConnected ? 'var(--accent-forest)' : 'var(--border-subtle)' }}
        >
          <Database size={12} color={isBackendConnected ? 'var(--accent-forest)' : 'var(--accent-cyan)'} />
          Database: {isBackendConnected ? 'Supabase PostgreSQL (Active)' : 'Supabase PostgreSQL'}
        </span>

        <span
          className="info-chip"
          title="Multi-Agent Editorial Room: 4 specialized agents active"
        >
          <Bot size={12} color="var(--accent-violet)" />
          Editorial Room: 5 Multi-Agents Online
        </span>
      </div>

      <main className="newspaper-sheet">

        {/* Broadsheet Masthead */}
        <Masthead
          edition={edition}
          profile={profile}
          signals={signals}
          onOpenLearningMatrix={() => setIsLearningMatrixOpen(true)}
          onOpenArchive={() => setIsArchiveOpen(true)}
          onOpenArchitecture={() => setIsArchitectureOpen(true)}
          onOpenSettings={() => setIsOnboardingOpen(true)}
          onOpenAskPaper={() => setIsAskPaperOpen(true)}
          onOpenAgentsRoom={() => setIsAgentsRoomOpen(true)}
          onDownloadPDF={handleDownloadPDF}
          isDownloadingPDF={isDownloadingPDF}
          onThemeChange={handleThemeChange}
          currentTheme={profile.theme || 'broadsheet'}
        />

        {/* Morning Audio Dispatch Player */}
        <AudioDispatchBar edition={edition} profile={profile} />

        {/* Live Wire Real-time Ticker */}
        <LiveWireBar />

        {/* Chief Editor Morning Address */}
        <ChiefEditorDesk note={edition.chiefEditorNote} profile={profile} />

        {/* In-Page Broadsheet Search & Filter Bar */}
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Front Page Grid: Lead Story + Side Columns */}
        {(!searchTerm && selectedCategory === 'ALL') && (
          <>
            <div className="front-page-grid">
              <LeadArticle
                article={edition.leadArticle}
                onReadFull={art => setActiveArticleModal(art)}
                onSkip={handleSkip}
                onLike={handleLike}
                onBookmark={handleBookmark}
              />

              <SideArticles
                articles={edition.frontPageSideArticles}
                onReadFull={art => setActiveArticleModal(art)}
                onSkip={handleSkip}
                onLike={handleLike}
              />
            </div>

            {/* Nuance Lens for the Lead Story */}
            {edition.leadArticle.nuancePerspective && (
              <NuanceLens
                perspective={edition.leadArticle.nuancePerspective}
                articleTitle={edition.leadArticle.title}
              />
            )}
          </>
        )}

        {/* Multipage Broadsheet Sections */}
        <SectionArticles
          sections={filteredSections}
          onReadFull={art => setActiveArticleModal(art)}
          onSkip={handleSkip}
          onLike={handleLike}
        />

        {/* The Coffee Break / Daily Dilemma with Interactive Solver */}
        <CoffeeBreak coffeeBreak={edition.coffeeBreak} />

        {/* Modern Digital Publication Footer */}
        <footer className="modern-footer">
          <div className="footer-inner-grid">
            <div>
              <div className="footer-quote-modern">
                "{edition.morningQuote.quote}"
              </div>
              <div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px', color: 'var(--text-primary)', fontSize: '13px' }}>
                - {edition.morningQuote.author}
              </div>
              <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Synthesized by the Gemini AI Autonomous Newsroom for {profile.name}. Curated to eliminate feed exhaustion and restore deep morning focus.
              </p>
            </div>

            <div>
              <div className="footer-col-title">Broadsheet Sections</div>
              <ul className="footer-link-list">
                {edition.sections.map(sec => (
                  <li key={sec.category}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(sec.category);
                        window.scrollTo({ top: 400, behavior: 'smooth' });
                      }}
                    >
                      {sec.category.charAt(0).toUpperCase() + sec.category.slice(1)} ({sec.articles.length})
                    </button>
                  </li>
                ))}
                <li>
                  <button type="button" onClick={() => setSelectedCategory('ALL')}>
                    All Dispatches
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div className="footer-col-title">Intelligence Console</div>
              <ul className="footer-link-list">
                <li>
                  <button type="button" onClick={() => setIsAskPaperOpen(true)}>
                    Ask Paper AI Q&A
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setIsAgentsRoomOpen(true)}>
                    Live Newsroom Telemetry
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setIsLearningMatrixOpen(true)}>
                    Curator Learning Matrix
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setIsArchiveOpen(true)}>
                    Morning Editions Archive
                  </button>
                </li>
                <li>
                  <button type="button" onClick={() => setIsArchitectureOpen(true)}>
                    System Architecture
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-bar">
            <div>
              <strong>Jimmy Morning Chronicle</strong> &bull; Vol. 2026 &bull; Handcrafted Daily Intelligence
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span>Engineered with Next.js 15, Gemini Flash & Supabase</span>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: '20px',
                  padding: '4px 12px',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  cursor: 'pointer'
                }}
              >
                <ArrowUp size={13} />
                Back to Top
              </button>
            </div>
          </div>
        </footer>
      </main>

      {/* Hidden Authentic Broadsheet Template for PDF Engine */}
      <PrintNewspaperTemplate edition={edition} profile={profile} />

      {/* Modals & Overlays */}
      <ArticleModal
        article={activeArticleModal}
        onClose={() => setActiveArticleModal(null)}
        onSkip={handleSkip}
        onLike={handleLike}
        onBookmark={handleBookmark}
        onArticleRead={handleArticleRead}
      />

      <OnboardingModal
        isOpen={isOnboardingOpen}
        initialProfile={profile}
        onComplete={handleOnboardingComplete}
        onClose={profile.onboardingCompleted ? () => setIsOnboardingOpen(false) : undefined}
      />

      <LearningMatrixDrawer
        isOpen={isLearningMatrixOpen}
        signals={signals}
        profile={profile}
        onClose={() => setIsLearningMatrixOpen(false)}
        onSimulateNextDay={handleSimulateNextDay}
        onResetSignals={handleResetSignals}
      />

      <ArchiveModal
        isOpen={isArchiveOpen}
        editions={editionsHistory}
        currentEditionId={edition.editionId}
        onClose={() => setIsArchiveOpen(false)}
        onSelectEdition={handleSelectArchiveEdition}
      />

      <ArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
      />

      <AskPaperDrawer
        isOpen={isAskPaperOpen}
        onClose={() => setIsAskPaperOpen(false)}
        newspaperName={profile.newspaperName}
      />

      <AgentsRoomModal
        isOpen={isAgentsRoomOpen}
        onClose={() => setIsAgentsRoomOpen(false)}
        logs={agentLogs}
        onTriggerAgents={() => runAutonomousEditorialAssembly(profile, signals, dayOffset)}
        isProcessing={isProcessingAgents}
      />

    </div>
  );
}


