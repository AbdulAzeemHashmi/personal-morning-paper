import React from 'react';
import { ChiefEditorNote, ReaderProfile } from '../types';
import { Feather, Compass, Sparkles } from 'lucide-react';

interface ChiefEditorDeskProps {
  note: ChiefEditorNote;
  profile: ReaderProfile;
}

export const ChiefEditorDesk: React.FC<ChiefEditorDeskProps> = ({ note, profile }) => {
  return (
    <div className="chief-editor-box">
      <div className="chief-editor-header">
        <div className="editor-label">
          <Feather size={14} /> The Chief Editor's Desk • Morning Address
        </div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: '11px', color: 'var(--ink-muted)' }}>
          Curated for {profile.name} ({profile.readingTime} Edition)
        </div>
      </div>

      <h3 className="editor-title">{note.headline}</h3>
      <p className="editor-narrative">{note.narrative}</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--ink-secondary)', fontFamily: 'var(--font-ui)' }}>
          <Sparkles size={12} color="var(--accent-gold)" />
          <strong>Central Theme:</strong> {note.keyTheme}
        </div>
        <div className="editor-signoff">{note.signoff}</div>
      </div>
    </div>
  );
};
