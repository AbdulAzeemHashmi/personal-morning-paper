import React from 'react';
import { PaperEdition, ReaderProfile, LearningSignals } from '../types';
import { Download, Sliders, Brain, History, Moon, Sun, Sparkles, MessageSquare, Bot, Clock, CloudSun, Palette } from 'lucide-react';

interface MastheadProps {
  edition: PaperEdition;
  profile: ReaderProfile;
  signals: LearningSignals;
  onOpenLearningMatrix: () => void;
  onOpenArchive: () => void;
  onOpenArchitecture: () => void;
  onOpenSettings: () => void;
  onOpenAskPaper: () => void;
  onOpenAgentsRoom: () => void;
  onOpenImageStudio: () => void;
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
  onOpenAgentsRoom,
  onOpenImageStudio,
  onDownloadPDF,
  isDownloadingPDF,
  onThemeChange,
  currentTheme
}) => {
  return (
    <header className="modern-masthead-wrapper">
      {/* Sleek Floating Top Bar */}
      <div className="modern-top-bar">
        <div className="top-bar-left">
          <div className="brand-emblem">M</div>
          <span className="info-chip">
            <strong>{edition.dateStr}</strong>
          </span>
          <span className="info-chip">
            <CloudSun size={12} color="var(--accent-amber)" />
            {edition.weather.city} | {edition.weather.temp}, {edition.weather.condition}
          </span>
          <span className="info-chip">
            <Clock size={12} />
            {profile.readingTime.toUpperCase()} Reading Window
          </span>
        </div>

        <div className="top-bar-right">
          {/* Theme Selector */}
          <div className="theme-pill-group">
            <button
              className={`theme-pill-btn ${currentTheme === 'midnight' ? 'active' : ''}`}
              onClick={() => onThemeChange('midnight')}
              title="Midnight Obsidian Theme"
            >
              <Moon size={11} style={{ display: 'inline', marginRight: '3px' }} /> Night
            </button>
            <button
              className={`theme-pill-btn ${currentTheme === 'broadsheet' ? 'active' : ''}`}
              onClick={() => onThemeChange('broadsheet')}
              title="Clean Opal Theme"
            >
              <Sun size={11} style={{ display: 'inline', marginRight: '3px' }} /> Clean
            </button>
            <button
              className={`theme-pill-btn ${currentTheme === 'sepia' ? 'active' : ''}`}
              onClick={() => onThemeChange('sepia')}
              title="Artisanal Parchment Theme"
            >
              Sepia
            </button>
          </div>

          <button
            className="btn btn-sm btn-outline"
            onClick={onOpenSettings}
            title="Configure personal preferences and beats"
          >
            <Sliders size={12} /> Preferences
          </button>

          <button
            className="btn btn-sm btn-primary"
            onClick={onDownloadPDF}
            disabled={isDownloadingPDF}
            title="Export broadsheet as a crisp PDF"
          >
            <Download size={12} />
            {isDownloadingPDF ? 'Generating...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Main Modern Masthead */}
      <div className="modern-masthead">
        <h1 className="modern-masthead-title">
          {profile.newspaperName || 'The Morning Chronicle'}
        </h1>
        <div className="modern-masthead-motto">
          "{profile.motto || 'Veritas, Gravitas et Lux: An Intelligent Daily Broadsheet'}"
        </div>

        {/* Feature Action Ribbon */}
        <div className="masthead-nav-ribbon">
          <button
            className="btn btn-sm btn-outline"
            onClick={onOpenImageStudio}
            title="Open Google Gemini API Image Generation Studio"
            style={{ borderColor: 'var(--accent-amber)', backgroundColor: 'rgba(217, 119, 6, 0.08)' }}
          >
            <Palette size={13} color="var(--accent-amber)" /> Gemini Image Studio
          </button>

          <button
            className="btn btn-sm btn-outline"
            onClick={onOpenAgentsRoom}
            title="Inspect autonomous multi-agent newsroom reasoning"
          >
            <Bot size={13} color="var(--accent-amber)" /> Agents Room (5 Active)
          </button>

          <button
            className="btn btn-sm btn-outline"
            onClick={onOpenAskPaper}
            title="Ask questions about today's articles with AI synthesis"
          >
            <MessageSquare size={13} color="var(--accent-cyan)" /> Ask The Paper
          </button>

          <button
            className="btn btn-sm btn-outline"
            onClick={onOpenLearningMatrix}
            title="Inspect how the AI adapts to your reading patterns"
          >
            <Brain size={13} color="var(--accent-violet)" />
            AI Mind Matrix ({signals.skipsCount} skips, {signals.likesCount} likes)
          </button>

          <button
            className="btn btn-sm btn-outline"
            onClick={onOpenArchive}
            title="Explore past daily editions"
          >
            <History size={13} /> Historical Editions
          </button>

          <button
            className="btn btn-sm btn-outline"
            onClick={onOpenArchitecture}
            title="View system design diagram & technical specification"
          >
            <Sparkles size={13} color="var(--accent-amber)" /> Architecture & Specs
          </button>
        </div>
      </div>
    </header>
  );
};
