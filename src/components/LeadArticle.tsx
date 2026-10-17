import React from 'react';
import { Article } from '../types';
import { ExternalLink, BookOpen, ThumbsUp, XCircle, Bookmark, Sparkles, Clock } from 'lucide-react';

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
  if (!article || article.isSkipped) return null;

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
        <div>
          By <strong style={{ color: 'var(--text-primary)' }}>{article.author}</strong> | {article.outlet}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={12} /> {article.readingMinutes} min read
        </div>
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
