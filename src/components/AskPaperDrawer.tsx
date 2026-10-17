import React, { useState } from 'react';
import { apiAskThePaper, AskPaperResponse } from '../services/api';
import { MessageSquare, Send, Sparkles, X, BookOpen, ExternalLink, HelpCircle } from 'lucide-react';

interface AskPaperDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  newspaperName: string;
}

export const AskPaperDrawer: React.FC<AskPaperDrawerProps> = ({ isOpen, onClose, newspaperName }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AskPaperResponse | null>(null);

  if (!isOpen) return null;

  const handleAsk = async (q: string) => {
    if (!q.trim()) return;
    setIsLoading(true);
    try {
      const res = await apiAskThePaper(q);
      setResponse(res);
    } catch {
      // Handled in api
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    'What does the lead story say about autonomous agent swarms?',
    'How is solar deflation affecting central bank policy?',
    'What did astronomers detect on exoplanet K2-18b?',
    'Why is bounded morning reading good for cognitive focus?'
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="var(--accent-burgundy)" />
            <span style={{ fontFamily: 'var(--font-masthead)', fontWeight: 800, fontSize: '1.15rem' }}>
              Ask {newspaperName} : Semantic Editorial Assistant
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginBottom: '16px' }}>
            Have a question about today's headlines or deeper implications? Query today's SQLite knowledge base and receive synthesized answers anchored in today's dispatches.
          </p>

          {/* Search Input */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleAsk(query);
            }}
            style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}
          >
            <input
              type="text"
              className="form-input"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Ask anything about today's edition..."
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary" disabled={isLoading || !query.trim()}>
              {isLoading ? 'Synthesizing...' : <><Send size={14} /> Inquire</>}
            </button>
          </form>

          {/* Prompt Suggestions */}
          {!response && !isLoading && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--ink-muted)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <HelpCircle size={12} /> Suggested Questions for Today:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {sampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setQuery(q);
                      handleAsk(q);
                    }}
                    style={{
                      textAlign: 'left',
                      padding: '8px 12px',
                      background: 'var(--bg-subtle)',
                      border: '1px solid var(--rule-light)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '12px',
                      cursor: 'pointer',
                      color: 'var(--ink-primary)'
                    }}
                  >
                    "{q}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Response Box */}
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--ink-muted)', fontSize: '13px' }}>
              <span className="audio-pulse" style={{ display: 'inline-block', marginRight: '8px' }} />
              Querying today's SQLite broadsheet corpus and synthesizing perspectives...
            </div>
          )}

          {response && !isLoading && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--rule-color)', padding: '18px', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent-burgundy)', letterSpacing: '1px', marginBottom: '8px' }}>
                Editorial Synthesis
              </div>
              <p style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--ink-primary)', marginBottom: '14px' }}>
                {response.answer}
              </p>

              {response.sources.length > 0 && (
                <div style={{ borderTop: '1px dotted var(--rule-light)', paddingTop: '10px' }}>
                  <div style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 700, color: 'var(--ink-muted)', marginBottom: '4px' }}>
                    Sources Cited in Today's Paper:
                  </div>
                  {response.sources.map((s, idx) => (
                    <div key={idx} style={{ fontSize: '11.5px', color: 'var(--ink-secondary)' }}>
                      • <strong>{s.title}</strong> ({s.outlet})
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
