import React from 'react';
import { LearningSignals, ReaderProfile } from '../types';
import { Brain, TrendingUp, TrendingDown, RefreshCw, X, Calendar, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface LearningMatrixDrawerProps {
  signals: LearningSignals;
  profile: ReaderProfile;
  isOpen: boolean;
  onClose: () => void;
  onSimulateNextDay: () => void;
  onResetSignals: () => void;
}

export const LearningMatrixDrawer: React.FC<LearningMatrixDrawerProps> = ({
  signals,
  profile,
  isOpen,
  onClose,
  onSimulateNextDay,
  onResetSignals
}) => {
  if (!isOpen) return null;

  const categories = Object.entries(signals.categoryWeights).sort((a, b) => b[1] - a[1]);
  const keywords = Object.entries(signals.keywordWeights).sort((a, b) => b[1] - a[1]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '750px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Brain size={20} color="var(--accent-burgundy)" />
            <span style={{ fontFamily: 'var(--font-masthead)', fontWeight: 800, fontSize: '1.15rem' }}>
              The Editorial Mind • Reader Intelligence Matrix
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '14px 18px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', border: '1px solid var(--rule-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '13px', color: 'var(--accent-burgundy)', marginBottom: '4px' }}>
              <Zap size={14} /> How Your Paper Learns Over Time
            </div>
            <p style={{ fontSize: '12.5px', color: 'var(--ink-secondary)', lineHeight: 1.5 }}>
              Every action you take shapes tomorrow's press run. <strong>Skipping an article</strong> deprioritizes that topic and related tags. <strong>Reading or Liking</strong> amplifies their weight. Over days, your broadsheet evolves from a generic feed into an irreplaceable personal chronicle.
            </p>
          </div>

          {/* Quick Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--rule-light)', padding: '12px', textAlign: 'center', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--ink-primary)' }}>{signals.readsCount}</div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-muted)', fontWeight: 700 }}>Articles Read</div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--rule-light)', padding: '12px', textAlign: 'center', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-forest)' }}>{signals.likesCount}</div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-muted)', fontWeight: 700 }}>Liked Stories</div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--rule-light)', padding: '12px', textAlign: 'center', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-burgundy)' }}>{signals.skipsCount}</div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-muted)', fontWeight: 700 }}>Skipped Stories</div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--rule-light)', padding: '12px', textAlign: 'center', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-gold)' }}>{signals.bookmarksCount}</div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-muted)', fontWeight: 700 }}>Saved Stories</div>
            </div>
          </div>

          {/* Dynamic Category Weights */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontFamily: 'var(--font-masthead)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px', borderBottom: '1px solid var(--rule-light)', paddingBottom: '4px' }}>
              Dynamic Category Affinity Scores
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {categories.map(([category, weight]) => {
                const percentage = Math.min(100, Math.max(10, (weight / 3.0) * 100));
                const isHigh = weight > 1.2;
                const isLow = weight < 0.8;

                return (
                  <div key={category} style={{ fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span style={{ fontWeight: 600 }}>{category}</span>
                      <span style={{ fontFamily: 'var(--font-ui)', fontWeight: 700, color: isHigh ? 'var(--accent-forest)' : isLow ? 'var(--accent-burgundy)' : 'var(--ink-muted)' }}>
                        {weight.toFixed(2)}x weight
                      </span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: 'var(--bg-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${percentage}%`,
                          backgroundColor: isHigh ? 'var(--accent-forest)' : isLow ? 'var(--accent-burgundy)' : 'var(--accent-blue)',
                          transition: 'width 0.4s ease'
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Keyword Weights */}
          {keywords.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontFamily: 'var(--font-masthead)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
                Learned Keyword Weights
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {keywords.map(([kw, weight]) => (
                  <span
                    key={kw}
                    style={{
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--rule-light)',
                      padding: '4px 10px',
                      borderRadius: '14px',
                      fontSize: '11px',
                      fontFamily: 'var(--font-ui)'
                    }}
                  >
                    #{kw} <strong style={{ color: weight >= 1.2 ? 'var(--accent-forest)' : 'var(--ink-muted)' }}>{weight.toFixed(2)}x</strong>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Signal Audit Trail */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontFamily: 'var(--font-masthead)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
              Recent Learning Signal Log
            </h4>
            {signals.recentInteractions.length === 0 ? (
              <div style={{ fontSize: '12px', color: 'var(--ink-muted)', fontStyle: 'italic' }}>
                No interactions logged yet. Skip or like stories on your paper to see signals recorded in real-time.
              </div>
            ) : (
              <div style={{ maxHeight: '160px', overflowY: 'auto', border: '1px solid var(--rule-light)', borderRadius: 'var(--radius-sm)', padding: '8px' }}>
                {signals.recentInteractions.slice(0, 10).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px', borderBottom: '1px solid var(--rule-light)', fontSize: '11.5px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {item.action === 'skip' ? (
                        <TrendingDown size={12} color="var(--accent-burgundy)" />
                      ) : (
                        <TrendingUp size={12} color="var(--accent-forest)" />
                      )}
                      <span><strong>{item.action.toUpperCase()}</strong>: {item.title.slice(0, 48)}...</span>
                    </div>
                    <span style={{ color: 'var(--ink-muted)' }}>{item.category}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Multi-Day Simulation & Reset */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid var(--rule-color)', paddingTop: '16px', flexWrap: 'wrap', gap: '10px' }}>
            <button className="btn btn-outline" onClick={onResetSignals}>
              <RefreshCw size={12} /> Reset to Defaults
            </button>

            <button className="btn btn-primary" onClick={onSimulateNextDay}>
              <Calendar size={12} /> Simulate Next Morning's Press Run <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
