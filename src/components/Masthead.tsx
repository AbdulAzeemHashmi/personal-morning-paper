import React from 'react';
import { PaperEdition, ReaderProfile, LearningSignals } from '../types';
import { Download, Sliders, Brain, History, Moon, Sparkles, MessageSquare } from 'lucide-react';

interface MastheadProps {
  edition: PaperEdition;
  profile: ReaderProfile;
  signals: LearningSignals;
  onOpenLearningMatrix: () => void;
  onOpenArchive: () => void;
  onOpenArchitecture: () => void;
  onOpenSettings: () => void;
  onOpenAskPaper: () => void;
  onDownloadPDF: () => void;
  isDownloadingPDF: boolean;
  onThemeChange: (theme: 'broadsheet' | 'midnight' | 'sepia') => void;
  currentTheme: string;
}

export const Masthead: React.FC<MastheadProps> = ({
  edition,
  profile,
  signals,
  onOpenLearningMatrix,
  onOpenArchive,
  onOpenArchitecture,
  onOpenSettings,
  onOpenAskPaper,
  onDownloadPDF,
  isDownloadingPDF,
  onThemeChange,
  currentTheme
}) => {
  return (
    <header className="masthead-section">
      {/* Top Meta Bar */}
      <div className="top-meta-bar">
        <div className="meta-group">
          <span className="meta-item">
            <strong>{edition.dateStr}</strong>
          </span>
          <span>•</span>
          <span className="meta-item">
            {edition.weather.city} | {edition.weather.temp}, {edition.weather.condition}
          </span>
        </div>

        <div className="meta-group">
          <span style={{ color: 'var(--accent-burgundy)', fontWeight: 700 }}>
            PRICE: PRICELESS / FOR YOUR EYES ONLY
          </span>
          <span>•</span>
          {/* Theme Switcher */}
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            <button
              title="Broadsheet Paper (Cream)"
              className={`btn btn-sm ${currentTheme === 'broadsheet' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => onThemeChange('broadsheet')}
            >
              Paper
            </button>
            <button
              title="Midnight Edition (Dark)"
              className={`btn btn-sm ${currentTheme === 'midnight' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => onThemeChange('midnight')}
            >
              <Moon size={11} /> Night
            </button>
            <button
              title="Sepia Archive"
              className={`btn btn-sm ${currentTheme === 'sepia' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => onThemeChange('sepia')}
            >
              Sepia
            </button>
          </div>
        </div>
      </div>

      {/* Main Ornate Masthead */}
      <div className="masthead-container">
        <div className="masthead-subtitle">The Sovereign Daily Digest</div>
        <h1 className="masthead-title">
          {profile.newspaperName || 'The Morning Chronicle'}
        </h1>
        <div className="masthead-motto">
          "{profile.motto || 'Veritas, Gravitas et Lux'}"
        </div>
      </div>

      {/* Issue Bar & Action Strip */}
      <div className="issue-bar">
        <div>
          VOL. {edition.volume} | NO. {edition.issue}
        </div>
        <div>
          READING TIME: {profile.readingTime.toUpperCase()} • TONE: {profile.tone.toUpperCase()}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            className="btn btn-sm btn-outline"
            onClick={onOpenLearningMatrix}
            title="Inspect how the AI adapts to your reading patterns"
          >
            <Brain size={12} color="var(--accent-burgundy)" />
            AI Mind ({signals.skipsCount} skips, {signals.likesCount} likes)
          </button>

          <button
            className="btn btn-sm btn-outline"
            onClick={onOpenAskPaper}
            title="Ask questions about today's articles with AI synthesis"
          >
            <MessageSquare size={12} color="var(--accent-blue)" /> Ask Paper
          </button>

          <button
            className="btn btn-sm btn-outline"
            onClick={onOpenArchive}
            title="Explore past daily editions"
          >
            <History size={12} /> Past Editions
          </button>

          <button
            className="btn btn-sm btn-outline"
            onClick={onOpenArchitecture}
            title="View system design diagram & hackathon submission specs"
          >
            <Sparkles size={12} color="var(--accent-gold)" /> Architecture
          </button>

          <button
            className="btn btn-sm btn-outline"
            onClick={onOpenSettings}
            title="Personalize preferences"
          >
            <Sliders size={12} /> Setup
          </button>

          <button
            className="btn btn-sm btn-primary"
            onClick={onDownloadPDF}
            disabled={isDownloadingPDF}
            title="Download this exact broadsheet edition as a high-resolution PDF"
          >
            <Download size={12} />
            {isDownloadingPDF ? 'Printing PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>
    </header>
  );
};
