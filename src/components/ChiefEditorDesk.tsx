import React from 'react';
import { ChiefEditorNote, ReaderProfile } from '../types';
import { Sparkles, Terminal, ShieldCheck } from 'lucide-react';

interface ChiefEditorDeskProps {
  note: ChiefEditorNote;
  profile: ReaderProfile;
}

export const ChiefEditorDesk: React.FC<ChiefEditorDeskProps> = ({ note, profile }) => {
  return (
    <div className="modern-chief-editor">
      <div className="chief-editor-top">
        <div className="editor-badge">
          <Terminal size={13} color="var(--accent-amber)" />
          Chief Editor Dispatch | Morning Executive Address
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
          <ShieldCheck size={13} color="var(--accent-emerald)" />
          Curated for {profile.name} ({profile.readingTime} Edition)
        </div>
      </div>

      <h3 className="editor-headline">{note.headline}</h3>
      <p className="editor-body-text">{note.narrative}</p>

      <div className="editor-bottom-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <Sparkles size={13} color="var(--accent-amber)" />
          <strong>Core Focus:</strong> {note.keyTheme}
        </div>
        <div style={{ fontFamily: 'var(--font-serif-accent)', fontStyle: 'italic', fontSize: '13px', color: 'var(--text-primary)' }}>
          {note.signoff}
        </div>
      </div>
    </div>
  );
};

