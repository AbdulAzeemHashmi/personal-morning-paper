import React from 'react';
import { Article } from '../types';
import { ExternalLink, BookOpen, ThumbsUp, XCircle } from 'lucide-react';

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
    <aside className="front-page-side">
      <div style={{ fontFamily: 'var(--font-masthead)', fontSize: '12px', letterSpacing: '1.5px', textTransform: 'uppercase', borderBottom: '2px solid var(--rule-color)', paddingBottom: '4px', fontWeight: 800 }}>
        The Morning Dispatches • Essential Briefs
      </div>

      {articles.map(article => {
        if (article.isSkipped) {
          return null; // hide skipped articles
        }

        return (
          <div key={article.id} className="side-article-card">
            <div className="side-category">{article.category}</div>
            <h3 className="side-title" onClick={() => onReadFull(article)}>
              {article.title}
            </h3>
            <p className="side-excerpt">{article.subhead}</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--ink-muted)' }}>
              <span>{article.outlet} • {article.readingMinutes}m</span>
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
                  style={{ color: 'var(--accent-burgundy)' }}
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
