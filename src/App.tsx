import React, { useState, useEffect, useMemo } from 'react';
import { Article, ReaderProfile, LearningSignals, PaperEdition } from './types';
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
  DEFAULT_SIGNALS
} from './utils/learningEngine';
import { generateNewspaperPDF } from './utils/pdfGenerator';
import {
  checkServerHealth,
  apiFetchProfile,
  apiSaveProfile,
  apiFetchSignals,
  apiSendSignalAction
} from './services/api';

import { Masthead } from './components/Masthead';
import { AudioDispatchBar } from './components/AudioDispatchBar';
import { ChiefEditorDesk } from './components/ChiefEditorDesk';
import { LeadArticle } from './components/LeadArticle';
import { SideArticles } from './components/SideArticles';
import { SectionArticles } from './components/SectionArticles';
import { CoffeeBreak } from './components/CoffeeBreak';
import { NuanceLens } from './components/NuanceLens';
import { ArticleModal } from './components/ArticleModal';
import { OnboardingModal } from './components/OnboardingModal';
import { LearningMatrixDrawer } from './components/LearningMatrixDrawer';
import { ArchiveModal } from './components/ArchiveModal';
import { ArchitectureModal } from './components/ArchitectureModal';
import { PrintNewspaperTemplate } from './components/PrintNewspaperTemplate';
import { AskPaperDrawer } from './components/AskPaperDrawer';
import { SearchBar } from './components/SearchBar';
import { LiveWireBar } from './components/LiveWireBar';
import { Database, CheckCircle2 } from 'lucide-react';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<ReaderProfile>(loadReaderProfile);
  const [signals, setSignals] = useState<LearningSignals>(loadLearningSignals);
  const [edition, setEdition] = useState<PaperEdition>(loadCurrentEdition);
  const [editionsHistory, setEditionsHistory] = useState<PaperEdition[]>(loadEditionsHistory);

  const [activeArticleModal, setActiveArticleModal] = useState<Article | null>(null);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(!profile.onboardingCompleted);
  const [isLearningMatrixOpen, setIsLearningMatrixOpen] = useState<boolean>(false);
  const [isArchiveOpen, setIsArchiveOpen] = useState<boolean>(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [isAskPaperOpen, setIsAskPaperOpen] = useState<boolean>(false);
  const [isDownloadingPDF, setIsDownloadingPDF] = useState<boolean>(false);
  const [isSqliteOnline, setIsSqliteOnline] = useState<boolean>(false);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [dayOffset, setDayOffset] = useState<number>(0);

  // Synchronize theme on html element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', profile.theme || 'broadsheet');
  }, [profile.theme]);

  // Check SQLite Server connection & sync state
  useEffect(() => {
    checkServerHealth().then(online => {
      setIsSqliteOnline(online);
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

    ensureInitialArchiveEditions();
    setEditionsHistory(loadEditionsHistory());
  }, []);

  const handleThemeChange = (theme: 'broadsheet' | 'midnight' | 'sepia') => {
    const updated = { ...profile, theme };
    setProfile(updated);
    saveReaderProfile(updated);
    if (isSqliteOnline) apiSaveProfile(updated);
    document.documentElement.setAttribute('data-theme', theme);
  };

  const handleOnboardingComplete = (newProfile: ReaderProfile) => {
    setProfile(newProfile);
    saveReaderProfile(newProfile);
    if (isSqliteOnline) apiSaveProfile(newProfile);
    setIsOnboardingOpen(false);

    // Re-curate edition with newly selected topics & keywords
    const freshEdition = generatePersonalEdition(newProfile, signals, dayOffset);
    setEdition(freshEdition);
    saveCurrentEdition(freshEdition);
    setEditionsHistory(loadEditionsHistory());
  };

  // Learning interactions with SQLite sync
  const handleSkip = (article: Article) => {
    const res = registerSkip(article.id, article.category, article.title, article.tags);
    setSignals({ ...res.signals });
    setEdition({ ...res.edition });
    if (isSqliteOnline) {
      apiSendSignalAction(article.id, article.title, article.category, 'skip', article.tags);
    }
  };

  const handleLike = (article: Article) => {
    const res = registerLike(article.id, article.category, article.title, article.tags);
    setSignals({ ...res.signals });
    setEdition({ ...res.edition });
    if (isSqliteOnline) {
      apiSendSignalAction(article.id, article.title, article.category, 'like', article.tags);
    }
  };

  const handleBookmark = (article: Article) => {
    const res = registerBookmark(article.id, article.category, article.title);
    setSignals({ ...res.signals });
    setEdition({ ...res.edition });
    if (isSqliteOnline) {
      apiSendSignalAction(article.id, article.title, article.category, 'bookmark', article.tags);
    }
  };

  const handleArticleRead = (article: Article) => {
    const res = registerRead(article.id, article.category, article.title, article.tags);
    setSignals({ ...res.signals });
    if (isSqliteOnline) {
      apiSendSignalAction(article.id, article.title, article.category, 'read', article.tags);
    }
  };

  // Simulate Next Day Press Run (Demonstrating adaptation over time)
  const handleSimulateNextDay = () => {
    const nextOffset = dayOffset + 1;
    setDayOffset(nextOffset);

    // Generate edition with current learned weights
    const nextEdition = generatePersonalEdition(profile, signals, nextOffset);
    setEdition(nextEdition);
    saveCurrentEdition(nextEdition);
    setEditionsHistory(loadEditionsHistory());
    setIsLearningMatrixOpen(false);
  };

  const handleResetSignals = () => {
    saveLearningSignals(DEFAULT_SIGNALS);
    setSignals(DEFAULT_SIGNALS);
    const freshEdition = generatePersonalEdition(profile, DEFAULT_SIGNALS, dayOffset);
    setEdition(freshEdition);
    saveCurrentEdition(freshEdition);
  };

  const handleSelectArchiveEdition = (selectedEdition: PaperEdition) => {
    setEdition(selectedEdition);
  };

  // PDF Generator Trigger
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

  // Filter sections by search term and selected category
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
      {/* SQLite Database Connectivity Indicator */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '8px' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            fontFamily: 'var(--font-ui)',
            padding: '2px 8px',
            borderRadius: '12px',
            backgroundColor: isSqliteOnline ? '#e6f4ea' : 'var(--bg-subtle)',
            color: isSqliteOnline ? '#137333' : 'var(--ink-muted)',
            border: '1px solid var(--rule-light)'
          }}
          title={isSqliteOnline ? 'Connected to local SQLite database (morning_paper.db)' : 'Running in local storage fallback'}
        >
          <Database size={11} />
          SQLite Database: {isSqliteOnline ? 'Active (WAL Mode)' : 'Offline / Local Fallback'}
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

        {/* Broadsheet Newspaper Footer */}
        <footer className="newspaper-footer">
          <div className="footer-quote">
            "{edition.morningQuote.quote}"
          </div>
          <div style={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
            {edition.morningQuote.author}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
            The Personal Morning Paper | Handcrafted daily for {profile.name} | End of Today's Edition
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
    </div>
  );
};

export default App;
