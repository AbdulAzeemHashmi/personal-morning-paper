import React from 'react';
import { PaperEdition } from '../types';
import { History, Calendar, ArrowRight, X, BookOpen } from 'lucide-react';

interface ArchiveModalProps {
  editions: PaperEdition[];
  currentEditionId: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectEdition: (edition: PaperEdition) => void;
}

export const ArchiveModal: React.FC<ArchiveModalProps> = ({
  editions,
  currentEditionId,
  isOpen,
  onClose,
  onSelectEdition
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <History size={18} color="var(--accent-burgundy)" />
            <span style={{ fontFamily: 'var(--font-masthead)', fontWeight: 800, fontSize: '1.15rem' }}>
              The Morning Archive • Historical Editions
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginBottom: '18px' }}>
            Step into the past. Browse previous days' editions to reflect on how global events unfolded and how your paper's editorial focus evolved over time.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {editions.map(edition => {
              const isCurrent = edition.editionId === currentEditionId;

              return (
                <div
                  key={edition.editionId}
                  style={{
                    backgroundColor: isCurrent ? 'var(--bg-subtle)' : 'var(--bg-card)',
                    border: isCurrent ? '2px solid var(--accent-burgundy)' : '1px solid var(--rule-light)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px'
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'var(--font-ui)', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '4px' }}>
                      <Calendar size={12} />
                      <strong>{edition.dateStr}</strong> • VOL. {edition.volume} NO. {edition.issue}
                      {isCurrent && (
                        <span style={{ backgroundColor: 'var(--accent-burgundy)', color: '#fff', padding: '1px 6px', borderRadius: '3px', fontWeight: 800 }}>
                          Active
                        </span>
                      )}
                    </div>
                    <h4 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.15rem', fontWeight: 700, margin: '2px 0 6px', color: 'var(--ink-primary)' }}>
                      {edition.leadArticle.title}
                    </h4>
                    <div style={{ fontSize: '12px', color: 'var(--ink-secondary)' }}>
                      {edition.weather.city} ({edition.weather.temp}) • Lead Outlet: {edition.leadArticle.outlet}
                    </div>
                  </div>

                  <div>
                    <button
                      className={`btn btn-sm ${isCurrent ? 'btn-outline' : 'btn-primary'}`}
                      onClick={() => {
                        onSelectEdition(edition);
                        onClose();
                      }}
                      disabled={isCurrent}
                    >
                      <BookOpen size={12} /> {isCurrent ? 'Reading' : 'Read Edition'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
