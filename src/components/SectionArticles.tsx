import React from 'react';
import { Article } from '../types';
import { BookOpen, ThumbsUp, XCircle, Layers } from 'lucide-react';

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
        const visibleArticles = section.articles.filter(a => !a.isSkipped);
        if (visibleArticles.length === 0) return null;

        return (
          <section key={section.category} className="section-block-modern">
            <div className="section-header-modern">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={16} color="var(--accent-amber)" />
                <span className="section-title-modern">{section.category}</span>
              </div>
              <div className="section-line-modern" />
            </div>

            <div className="section-grid-modern">
              {visibleArticles.map(article => (
                <article key={article.id} className="modern-article-card">
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{article.outlet}</span>
                      <span>{article.readingMinutes} min read</span>
                    </div>

                    <h4 className="article-title-modern" onClick={() => onReadFull(article)}>
                      {article.title}
                    </h4>

                    <p className="article-excerpt-modern">
                      {article.leadParagraph.slice(0, 160)}...
                    </p>
                  </div>

                  <div>
                    <div style={{ marginBottom: '14px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {article.tags.map(tag => (
                        <span key={tag} className="tag-pill-modern">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
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
                          title="Like and reinforce beat"
                        >
                          <ThumbsUp size={11} />
                        </button>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={() => onSkip(article)}
                          title="Skip and demote"
                          style={{ color: 'var(--accent-rose)' }}
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

