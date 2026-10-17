import React from 'react';
import { Article } from '../types';
import { BookOpen, ThumbsUp, XCircle, Flame } from 'lucide-react';

interface SideArticlesProps {
  articles: Article[];
  onReadFull: (article: Article) => void;
  onSkip: (article: Article) => void;
  onLike: (article: Article) => void;
}

export const SideArticles: React.FC<SideArticlesProps> = ({
  articles,
  onReadFull,
  onSkip,
  onLike
}) => {
  return (
    <aside className="side-dispatches-column">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)', marginBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent-amber)' }}>
          <Flame size={13} /> Trending Dispatches | Essential Briefs
        </div>
        <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
          {articles.filter(a => !a.isSkipped).length} stories
        </span>
      </div>

      {articles.map(article => {
        if (article.isSkipped) {
          return null;
        }

        return (
          <div key={article.id} className="side-dispatch-card">
            <div>
              <div className="category-tag-chip" style={{ fontSize: '10px', padding: '2px 8px', marginBottom: '6px' }}>
                {article.category}
              </div>
              <h3 className="side-title-modern" onClick={() => onReadFull(article)}>
                {article.title}
              </h3>
              <p className="side-excerpt-modern">{article.subhead}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11.5px', color: 'var(--text-muted)', marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)' }}>
              <span>{article.outlet} | {article.readingMinutes}m read</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => onReadFull(article)}
                  title="Read story"
                >
                  <BookOpen size={11} /> Read
                </button>
                <button
                  className={`btn btn-sm ${article.isLiked ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => onLike(article)}
                  title="Like story"
                >
                  <ThumbsUp size={11} />
                </button>
                <button
                  className="btn btn-sm btn-outline"
                  onClick={() => onSkip(article)}
                  title="Skip story"
                  style={{ color: 'var(--accent-rose)' }}
                >
                  <XCircle size={11} />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </aside>
  );
};

