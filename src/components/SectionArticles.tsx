import React from 'react';
import { Article } from '../types';
import { ExternalLink, BookOpen, ThumbsUp, XCircle, Tag } from 'lucide-react';

interface SectionArticlesProps {
  sections: { category: string; articles: Article[] }[];
  onReadFull: (article: Article) => void;
  onSkip: (article: Article) => void;
  onLike: (article: Article) => void;
}

export const SectionArticles: React.FC<SectionArticlesProps> = ({
  sections,
  onReadFull,
  onSkip,
  onLike
}) => {
  return (
    <div className="sections-container">
      {sections.map(section => {
        // filter out completely skipped items
        const visibleArticles = section.articles.filter(a => !a.isSkipped);
        if (visibleArticles.length === 0) return null;

        return (
          <section key={section.category} className="section-block">
            <div className="section-header">
              <span className="section-header-title">{section.category}</span>
              <div className="section-header-line" />
            </div>

            <div className="section-grid">
              {visibleArticles.map(article => (
                <article key={article.id} className="article-card">
                  <div className="article-card-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '4px' }}>
                      <span>{article.outlet}</span>
                      <span>{article.readingMinutes} min read</span>
                    </div>
                    <h4 className="article-card-title" onClick={() => onReadFull(article)}>
                      {article.title}
                    </h4>
                    <p className="article-card-excerpt">
                      {article.leadParagraph.slice(0, 150)}...
                    </p>
                  </div>

                  <div>
                    <div className="article-tag-list">
                      {article.tags.map(tag => (
                        <span key={tag} className="article-tag">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px dotted var(--rule-light)' }}>
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => onReadFull(article)}
                      >
                        <BookOpen size={11} /> Read
                      </button>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className={`btn btn-sm ${article.isLiked ? 'btn-primary' : 'btn-outline'}`}
                          onClick={() => onLike(article)}
                          title="Like and teach AI"
                        >
                          <ThumbsUp size={11} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => onSkip(article)}
                          title="Skip and demote"
                          style={{ color: 'var(--accent-burgundy)' }}
                        >
                          <XCircle size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};
