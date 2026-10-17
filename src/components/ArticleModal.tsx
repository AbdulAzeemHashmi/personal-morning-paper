import React, { useEffect } from 'react';
import { Article } from '../types';
import { NuanceLens } from './NuanceLens';
import { ExternalLink, ThumbsUp, XCircle, Bookmark, X, Clock, Newspaper } from 'lucide-react';

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
  useEffect(() => {
    if (article) {
      // Record read interaction
      onArticleRead(article);
    }
  }, [article?.id]);

  if (!article) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '860px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-burgundy)', fontWeight: 700 }}>
            <Newspaper size={14} /> {article.category} • {article.outlet}
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
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
              By <strong>{article.author}</strong> • Published via {article.outlet}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={12} /> {article.readingMinutes} min read
            </div>
          </div>

          <div style={{ fontSize: '15.5px', lineHeight: 1.8, color: 'var(--ink-primary)' }}>
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
                <ThumbsUp size={14} /> {article.isLiked ? 'Liked' : 'Like & Reinforce'}
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
                <XCircle size={14} /> Skip & Demote Topic
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
