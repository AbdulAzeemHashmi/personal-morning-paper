import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { ExternalLink, BookOpen, ThumbsUp, XCircle, Bookmark, Sparkles, Clock, RefreshCw } from 'lucide-react';

interface LeadArticleProps {
  article: Article;
  onReadFull: (article: Article) => void;
  onSkip: (article: Article) => void;
  onLike: (article: Article) => void;
  onBookmark: (article: Article) => void;
}

export const LeadArticle: React.FC<LeadArticleProps> = ({
  article,
  onReadFull,
  onSkip,
  onLike,
  onBookmark
}) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(article.imageUrl);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    setImageUrl(article.imageUrl);
  }, [article.id, article.imageUrl]);

  if (!article || article.isSkipped) return null;

  const handleRegenerateArt = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: article.title,
          prompt: `${article.title}. ${article.subhead || ''}`,
          category: article.category
        })
      });
      const data = await res.json();
      if (data.imageUrl) {
        setImageUrl(data.imageUrl);
        article.imageUrl = data.imageUrl;
      }
    } catch (err) {
      console.error('Failed to regenerate image with Gemini:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <article className="lead-article-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div className="category-tag-chip">
          <Sparkles size={11} /> Cover Story | {article.category}
        </div>
        {article.relevanceScore && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--accent-amber)'
            }}
            title="Calculated relevance from your learning profile"
          >
            ★ {Math.round(article.relevanceScore * 10)}% Affinity
          </span>
        )}
      </div>

      <h2 className="lead-title-modern" onClick={() => onReadFull(article)}>
        {article.title}
      </h2>

      <div className="lead-subhead-modern">
        {article.subhead}
      </div>

      <div className="byline-bar-modern">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span>Reporting by <strong style={{ color: 'var(--text-primary)' }}>{article.author}</strong></span>
          <span style={{ color: 'var(--text-muted)' }}>•</span>
          <span className="byline-outlet-badge">{article.outlet}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={12} /> {article.readingMinutes} min read
        </div>
      </div>

      {/* Gemini AI Editorial Illustration / Broadsheet Woodcut Plate */}
      <div
        className="lead-illustration-frame"
        style={{
          margin: '14px 0 18px 0',
          padding: '8px',
          backgroundColor: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)'
        }}
      >
        {imageUrl ? (
          <div>
            <img
              src={imageUrl}
              alt={`Editorial woodcut illustration for ${article.title}`}
              style={{
                width: '100%',
                maxHeight: '340px',
                objectFit: 'contain',
                display: 'block',
                borderRadius: '4px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: '#f4efe6'
              }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '8px',
                fontSize: '11px',
                color: 'var(--text-muted)',
                flexWrap: 'wrap',
                gap: '8px'
              }}
            >
              <span>
                <strong>FIG. I.</strong> Editorial Woodcut • Generated via Google Gemini API
              </span>
              <button
                type="button"
                className="btn btn-sm btn-outline"
                onClick={handleRegenerateArt}
                disabled={isGenerating}
                style={{ padding: '3px 8px', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                title="Regenerate bespoke illustration using Gemini API"
              >
                <RefreshCw size={11} className={isGenerating ? 'audio-pulse' : ''} />
                {isGenerating ? 'Engraving...' : 'Regenerate Art (Gemini)'}
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 14px',
              backgroundColor: 'var(--bg-card)',
              border: '1px dashed var(--border-subtle)',
              borderRadius: '4px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <Sparkles size={14} color="var(--accent-amber)" />
              <span>Engrave bespoke Victorian editorial illustration with Gemini AI</span>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={handleRegenerateArt}
              disabled={isGenerating}
              style={{ fontSize: '11.5px', padding: '4px 10px' }}
            >
              <RefreshCw size={11} className={isGenerating ? 'audio-pulse' : ''} />
              {isGenerating ? 'Engraving with Gemini...' : 'Generate with Gemini'}
            </button>
          </div>
        )}
      </div>

      <div className="lead-body-modern">
        <p style={{ marginBottom: '14px' }}>
          {article.leadParagraph}
        </p>

        {article.pullQuote && (
          <div className="pull-quote-modern">
            "{article.pullQuote}"
          </div>
        )}

        {article.fullBody.slice(0, 1).map((paragraph, idx) => (
          <p key={idx} style={{ marginTop: '12px' }}>
            {paragraph}
          </p>
        ))}
      </div>

      {/* Modern Action Strip */}
      <div className="article-actions-modern">
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => onReadFull(article)}
            title="Open focus reader mode"
          >
            <BookOpen size={13} /> Focus Reader
          </button>

          <a
            href={article.outletUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline"
            title="View original article at publisher"
          >
            <ExternalLink size={12} /> Publisher Source
          </a>
        </div>

        {/* Feedback / Learning Actions */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${article.isLiked ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => onLike(article)}
            title="Valuable story: trains AI to show more like this"
          >
            <ThumbsUp size={12} /> {article.isLiked ? 'Liked' : 'Like'}
          </button>

          <button
            className={`btn btn-sm ${article.isBookmarked ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => onBookmark(article)}
            title="Save for later"
          >
            <Bookmark size={12} /> {article.isBookmarked ? 'Saved' : 'Save'}
          </button>

          <button
            className="btn btn-sm btn-outline"
            onClick={() => onSkip(article)}
            title="Not interested: removes story and trains AI to de-emphasize this topic"
            style={{ color: 'var(--accent-rose)' }}
          >
            <XCircle size={12} /> Skip
          </button>
        </div>
      </div>
    </article>
  );
};
