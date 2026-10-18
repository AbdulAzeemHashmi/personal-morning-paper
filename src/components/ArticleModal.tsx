import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { NuanceLens } from './NuanceLens';
import { ExternalLink, ThumbsUp, XCircle, Bookmark, X, Clock, Newspaper, Volume2, Square, Share2, Check } from 'lucide-react';

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
  onSkip: (article: Article) => void;
  onLike: (article: Article) => void;
  onBookmark: (article: Article) => void;
  onArticleRead: (article: Article) => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article,
  onClose,
  onSkip,
  onLike,
  onBookmark,
  onArticleRead
}) => {
  const [fontSize, setFontSize] = useState<number>(16);
  const [isNarrating, setIsNarrating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (article) {
      onArticleRead(article);
    }
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [article?.id]);

  if (!article) return null;

  const handleToggleNarration = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this device.');
      return;
    }

    if (isNarrating) {
      window.speechSynthesis.cancel();
      setIsNarrating(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${article.title}. By ${article.author} for ${article.outlet}. ${article.leadParagraph}. ${article.fullBody.join(' ')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = 1.0;
      utterance.onend = () => setIsNarrating(false);
      utterance.onerror = () => setIsNarrating(false);
      window.speechSynthesis.speak(utterance);
      setIsNarrating(true);
    }
  };

  const handleShare = () => {
    const shareText = `"${article.title}" via The Morning Chronicle: ${article.outletUrl}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '860px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-burgundy)', fontWeight: 700 }}>
            <Newspaper size={14} /> {article.category} | {article.outlet}
          </div>

          {/* Reading Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Font size scaling */}
            <div style={{ display: 'flex', border: '1px solid var(--rule-light)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                title="Decrease font size"
                style={{ border: 'none', padding: '2px 8px', fontSize: '11px' }}
              >
                A-
              </button>
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => setFontSize(Math.min(22, fontSize + 2))}
                title="Increase font size"
                style={{ border: 'none', padding: '2px 8px', fontSize: '11px', borderLeft: '1px solid var(--rule-light)' }}
              >
                A+
              </button>
            </div>

            {/* Read aloud single story */}
            <button
              type="button"
              className={`btn btn-sm ${isNarrating ? 'btn-primary' : 'btn-outline'}`}
              onClick={handleToggleNarration}
              title={isNarrating ? 'Stop story narration' : 'Listen to this story'}
            >
              {isNarrating ? <Square size={11} /> : <Volume2 size={11} />}
              {isNarrating ? 'Stop Audio' : 'Listen'}
            </button>

            {/* Copy quote / share */}
            <button
              type="button"
              className="btn btn-sm btn-outline"
              onClick={handleShare}
              title="Copy quote and share"
            >
              {copied ? <Check size={11} color="var(--accent-forest)" /> : <Share2 size={11} />}
              {copied ? 'Copied!' : 'Share'}
            </button>

            <button className="modal-close-btn" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="modal-body">
          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 'clamp(1.6rem, 2.5vw, 2.3rem)', fontWeight: 900, lineHeight: 1.2, marginBottom: '12px' }}>
            {article.title}
          </h2>

          <div style={{ fontFamily: 'var(--font-body)', fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--ink-secondary)', marginBottom: '16px', borderBottom: '1px solid var(--rule-light)', paddingBottom: '14px' }}>
            {article.subhead}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--ink-muted)', marginBottom: '20px', fontFamily: 'var(--font-ui)', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              By <strong>{article.author}</strong> | Published via {article.outlet}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={12} /> {article.readingMinutes} min read
            </div>
          </div>

          {article.imageUrl && (
            <div style={{ marginBottom: '20px', padding: '8px', backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <img
                src={article.imageUrl}
                alt={`Editorial illustration for ${article.title}`}
                style={{ width: '100%', maxHeight: '360px', objectFit: 'contain', display: 'block', borderRadius: '4px', backgroundColor: '#f4efe6' }}
              />
              <div style={{ marginTop: '6px', fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic' }}>
                FIG. I. Editorial Woodcut Engraving • Synthesized via Google Gemini API
              </div>
            </div>
          )}

          <div style={{ fontSize: `${fontSize}px`, lineHeight: 1.8, color: 'var(--ink-primary)' }}>
            <p className="drop-cap" style={{ marginBottom: '16px' }}>
              {article.leadParagraph}
            </p>

            {article.fullBody.map((paragraph, index) => (
              <p key={index} style={{ marginBottom: '16px' }}>
                {paragraph}
              </p>
            ))}

            {article.pullQuote && (
              <div className="pull-quote" style={{ margin: '24px 0' }}>
                "{article.pullQuote}"
              </div>
            )}
          </div>

          {/* Perspective Breakdown if available */}
          {article.nuancePerspective && (
            <NuanceLens perspective={article.nuancePerspective} articleTitle={article.title} />
          )}

          {/* Action Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px', paddingTop: '18px', borderTop: '2px solid var(--rule-color)', flexWrap: 'wrap', gap: '12px' }}>
            <a
              href={article.outletUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              <ExternalLink size={14} /> Open Original at {article.outlet}
            </a>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className={`btn ${article.isLiked ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => onLike(article)}
                title="Like story"
              >
                <ThumbsUp size={14} /> {article.isLiked ? 'Liked' : 'Like and Reinforce'}
              </button>

              <button
                className={`btn ${article.isBookmarked ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => onBookmark(article)}
                title="Save story"
              >
                <Bookmark size={14} /> {article.isBookmarked ? 'Saved' : 'Save'}
              </button>

              <button
                className="btn btn-outline"
                onClick={() => {
                  onSkip(article);
                  onClose();
                }}
                style={{ color: 'var(--accent-burgundy)' }}
                title="Skip story"
              >
                <XCircle size={14} /> Skip and Demote Topic
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
