import React from 'react';
import { NuancePerspective } from '../types';
import { Compass, Scale } from 'lucide-react';

interface NuanceLensProps {
  perspective?: NuancePerspective;
  articleTitle: string;
}

export const NuanceLens: React.FC<NuanceLensProps> = ({ perspective, articleTitle }) => {
  if (!perspective) return null;

  return (
    <div className="nuance-lens-box">
      <div className="nuance-lens-header">
        <div className="nuance-title">
          <Scale size={18} color="var(--accent-burgundy)" />
          The Nuance Lens: Multi-Perspective Dial
        </div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--ink-muted)' }}>
          Editorial Analysis across 3 Distinct Worldviews
        </div>
      </div>

      <div style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginBottom: '14px', fontFamily: 'var(--font-ui)' }}>
        Framing breakdown on: <strong>"{articleTitle}"</strong>
      </div>

      <div className="nuance-grid">
        <div className="nuance-card">
          <div className="nuance-badge">{perspective.label1}</div>
          <p className="nuance-text">{perspective.view1}</p>
        </div>

        <div className="nuance-card">
          <div className="nuance-badge">{perspective.label2}</div>
          <p className="nuance-text">{perspective.view2}</p>
        </div>

        <div className="nuance-card">
          <div className="nuance-badge">{perspective.label3}</div>
          <p className="nuance-text">{perspective.view3}</p>
        </div>
      </div>
    </div>
  );
};
