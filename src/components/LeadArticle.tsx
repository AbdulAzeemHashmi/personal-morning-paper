import React from 'react';
import { Article } from '../types';
import { ExternalLink, BookOpen, ThumbsUp, XCircle, Bookmark, Compass } from 'lucide-react';

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
  if (!article) return null;

  return (
    <article className="lead-article">
      <div className="lead-category">
        Front Page Anchor • {article.category}
      </div>

      <h2 className="lead-title" onClick={() => onReadFull(article)}>
        {article.title}
      </h2>

      <div className="lead-subhead">
        {article.subhead}
      </div>

      <div className="byline-bar">
        <div>
          By <span className="byline-author">{article.author}</span> • {article.outlet}
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span>{article.readingMinutes} min read</span>
          {article.relevanceScore && (
            <span
              style={{
                backgroundColor: 'var(--bg-subtle)',
                padding: '2px 6px',
                borderRadius: '3px',
                fontSize: '10px',
                fontWeight: 700,
                color: 'var(--accent-burgundy)'
              }}
              title="Calculated relevance from your learning profile"
            >
              ★ {article.relevanceScore} Match
            </span>
          )}
        </div>
      </div>

      <div className="lead-body-columns">
        <p className="drop-cap">
          {article.leadParagraph}
        </p>

        {article.fullBody.slice(0, 1).map((paragraph, idx) => (
          <p key={idx} style={{ marginTop: '12px' }}>
            {paragraph}
          </p>
        ))}

        {article.pullQuote && (
          <div className="pull-quote">
            "{article.pullQuote}"
          </div>
        )}

        {article.fullBody.slice(1, 2).map((paragraph, idx) => (
          <p key={idx} style={{ marginTop: '12px' }}>
            {paragraph}
          </p>
        ))}
      </div>

      {/* Action Strip */}
      <div className="article-actions">
        <div className="action-btns">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => onReadFull(article)}
            title="Open focus reader mode"
          >
            <BookOpen size={12} /> Read Complete Story
          </button>

          <a
            href={article.outletUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-outline"
            title="View original article at publisher"
          >
            <ExternalLink size={12} /> Original Source
          </a>
        </div>

        {/* Feedback / Learning Signals */}
        <div className="action-btns">
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
            title="Save for your evening archive"
          >
            <Bookmark size={12} /> {article.isBookmarked ? 'Saved' : 'Save'}
          </button>

          <button
            className="btn btn-sm btn-outline"
            onClick={() => onSkip(article)}
            title="Not interested: removes story and trains AI to de-emphasize this topic"
            style={{ color: 'var(--accent-burgundy)' }}
          >
            <XCircle size={12} /> Skip
          </button>
        </div>
      </div>
    </article>
  );
};
