import React from 'react';
import { NuancePerspective } from '../types';
import { Scale, Sparkles } from 'lucide-react';

interface NuanceLensProps {
  perspective?: NuancePerspective;
  articleTitle: string;
}

export const NuanceLens: React.FC<NuanceLensProps> = ({ perspective, articleTitle }) => {
  if (!perspective) return null;

  return (
    <div className="modern-nuance-box">
      <div className="nuance-lens-header">
        <div className="nuance-title-modern">
          <Scale size={18} color="var(--accent-amber)" />
          The Nuance Lens: Multi-Perspective Dial
        </div>
        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
          Editorial Analysis across 3 Distinct Worldviews
        </div>
      </div>

      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        Framing breakdown on: <strong style={{ color: 'var(--text-primary)' }}>"{articleTitle}"</strong>
      </div>

      <div className="nuance-grid-modern">
        <div className="nuance-card-modern">
          <div className="nuance-badge-modern">{perspective.label1}</div>
          <p className="nuance-text-modern">{perspective.view1}</p>
        </div>

        <div className="nuance-card-modern">
          <div className="nuance-badge-modern">{perspective.label2}</div>
          <p className="nuance-text-modern">{perspective.view2}</p>
        </div>

        <div className="nuance-card-modern">
          <div className="nuance-badge-modern">{perspective.label3}</div>
          <p className="nuance-text-modern">{perspective.view3}</p>
        </div>
      </div>
    </div>
  );
};

