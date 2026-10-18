import React from 'react';
import { Layers, GitBranch, ExternalLink, X, BookOpen, Sparkles } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="var(--accent-burgundy)" />
            <span style={{ fontFamily: 'var(--font-masthead)', fontWeight: 800, fontSize: '1.2rem' }}>
              Jimmy Morning Chronicle
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* About */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--accent-amber)', marginBottom: '8px' }}>
              <Sparkles size={13} /> About This Application
            </div>
            <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', lineHeight: 1.6, margin: 0 }}>
              A full-stack personal broadsheet powered by a Multi-Agent Editorial Room, Google Gemini AI (Flash &amp; Imagen 3 Image Generation), and Supabase PostgreSQL. Restores the ritual and tactile elegance of the morning newspaper with adaptive Bayesian learning.
            </p>
          </div>

          {/* Tech Stack */}
          <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ fontWeight: 800, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--accent-amber)', marginBottom: '2px' }}>
              Technology Stack
            </div>
            {[
              ['Framework', 'Next.js 16 App Router (Turbopack)'],
              ['AI Engine', 'Google Gemini 2.5/3.8 Flash'],
              ['Image Generation', 'Gemini API (Imagen 3 & Vector Engraver)'],
              ['Database', 'Supabase PostgreSQL 15'],
              ['Styling', 'Vanilla CSS Design System'],
              ['Deployment', 'Vercel'],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', borderBottom: '1px solid var(--rule-light)', paddingBottom: '6px' }}>
                <span style={{ color: 'var(--ink-muted)', fontWeight: 600 }}>{label}</span>
                <span style={{ color: 'var(--ink-primary)' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Links */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <a
              href="https://github.com/AbdulAzeemHashmi/personal-morning-paper"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <GitBranch size={13} /> View on GitHub <ExternalLink size={11} />
            </a>
            <a
              href="https://github.com/AbdulAzeemHashmi/personal-morning-paper/blob/main/ARCHITECTURE.md"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ flex: 1, justifyContent: 'center' }}
            >
              <BookOpen size={13} /> Architecture Docs <ExternalLink size={11} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
