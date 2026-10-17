import React, { useState, useEffect } from 'react';
import { Article, ReaderProfile, LearningSignals, PaperEdition } from './types';
import {
  loadReaderProfile,
  saveReaderProfile,
  loadLearningSignals,
  saveLearningSignals,
  loadCurrentEdition,
  saveCurrentEdition,
  loadEditionsHistory,
  saveEditionToHistory,
  registerSkip,
  registerRead,
  registerLike,
  registerBookmark,
  generatePersonalEdition,
  ensureInitialArchiveEditions,
  DEFAULT_SIGNALS
} from './utils/learningEngine';
import { generateNewspaperPDF } from './utils/pdfGenerator';

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
  const [isDownloadingPDF, setIsDownloadingPDF] = useState<boolean>(false);
  const [dayOffset, setDayOffset] = useState<number>(0);

  // Synchronize theme on html element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', profile.theme || 'broadsheet');
  }, [profile.theme]);

  // Ensure archive editions exist on first run
  useEffect(() => {
    ensureInitialArchiveEditions();
    setEditionsHistory(loadEditionsHistory());
  }, []);

  const handleThemeChange = (theme: 'broadsheet' | 'midnight' | 'sepia') => {
    const updated = { ...profile, theme };
    setProfile(updated);
    saveReaderProfile(updated);
    document.documentElement.setAttribute('data-theme', theme);
  };

  const handleOnboardingComplete = (newProfile: ReaderProfile) => {
    setProfile(newProfile);
    saveReaderProfile(newProfile);
    setIsOnboardingOpen(false);

    // Re-curate edition with newly selected topics & keywords
    const freshEdition = generatePersonalEdition(newProfile, signals, dayOffset);
    setEdition(freshEdition);
    saveCurrentEdition(freshEdition);
    setEditionsHistory(loadEditionsHistory());
  };

  // Learning interactions
  const handleSkip = (article: Article) => {
    const res = registerSkip(article.id, article.category, article.title, article.tags);
    setSignals({ ...res.signals });
    setEdition({ ...res.edition });
  };

  const handleLike = (article: Article) => {
    const res = registerLike(article.id, article.category, article.title, article.tags);
    setSignals({ ...res.signals });
    setEdition({ ...res.edition });
  };

  const handleBookmark = (article: Article) => {
    const res = registerBookmark(article.id, article.category, article.title);
    setSignals({ ...res.signals });
    setEdition({ ...res.edition });
  };

  const handleArticleRead = (article: Article) => {
    const res = registerRead(article.id, article.category, article.title, article.tags);
    setSignals({ ...res.signals });
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

  return (
    <div className="newspaper-wrapper">
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
          onDownloadPDF={handleDownloadPDF}
          isDownloadingPDF={isDownloadingPDF}
          onThemeChange={handleThemeChange}
          currentTheme={profile.theme || 'broadsheet'}
        />

        {/* Morning Audio Dispatch Player */}
        <AudioDispatchBar edition={edition} profile={profile} />

        {/* Chief Editor Morning Address */}
        <ChiefEditorDesk note={edition.chiefEditorNote} profile={profile} />

        {/* Front Page Grid: Lead Story + Side Columns */}
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

        {/* Multipage Broadsheet Sections */}
        <SectionArticles
          sections={edition.sections}
          onReadFull={art => setActiveArticleModal(art)}
          onSkip={handleSkip}
          onLike={handleLike}
        />

        {/* The Coffee Break / Daily Dilemma */}
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
            The Personal Morning Paper • Published every dawn for {profile.name} • End of Today's Edition
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
    </div>
  );
};

export default App;
