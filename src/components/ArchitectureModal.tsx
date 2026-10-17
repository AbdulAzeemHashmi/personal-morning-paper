import { Sparkles, Layers, Cpu, Database, Monitor, CheckCircle2, Video, GitBranch, ExternalLink, X } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '880px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="var(--accent-burgundy)" />
            <span style={{ fontFamily: 'var(--font-masthead)', fontWeight: 800, fontSize: '1.2rem' }}>
              System Architecture & Hackathon Submission Package
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Top Banner */}
          <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--rule-light)', padding: '16px 20px', borderRadius: 'var(--radius-sm)', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '13px', color: 'var(--accent-burgundy)', marginBottom: '6px' }}>
              <Sparkles size={16} /> The Personal Morning Paper: Engineering Overview
            </div>
            <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', lineHeight: 1.55 }}>
              A deterministic, privacy-first, zero-hallucination architecture combining authentic 19th-century broadsheet aesthetics with adaptive reinforcement algorithms, web speech synthesis, and vector-grade PDF rendering.
            </p>
          </div>

          {/* Architecture Visual Blueprint */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontFamily: 'var(--font-masthead)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px', borderBottom: '2px solid var(--rule-color)', paddingBottom: '4px' }}>
              System Architecture Diagram
            </h3>

            <div style={{ backgroundColor: 'var(--bg-card)', border: '2px solid var(--rule-color)', borderRadius: 'var(--radius-sm)', padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', textAlign: 'center' }}>
                {/* Stage 1 */}
                <div style={{ border: '1px solid var(--rule-light)', padding: '14px 10px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-paper)' }}>
                  <Database size={24} color="var(--accent-blue)" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontWeight: 800, fontSize: '12px', textTransform: 'uppercase' }}>1. Knowledge Feeds</div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                    Global Wire & RSS<br />
                    Multi-beat Outlets<br />
                    Perspective Metadata
                  </div>
                </div>

                {/* Stage 2 */}
                <div style={{ border: '2px solid var(--accent-burgundy)', padding: '14px 10px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-subtle)' }}>
                  <Cpu size={24} color="var(--accent-burgundy)" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontWeight: 800, fontSize: '12px', textTransform: 'uppercase', color: 'var(--accent-burgundy)' }}>2. Editorial Engine</div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                    Relevance Reranker<br />
                    Chief Editor Synthesis<br />
                    Nuance Lens Analyzer
                  </div>
                </div>

                {/* Stage 3 */}
                <div style={{ border: '1px solid var(--rule-light)', padding: '14px 10px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-paper)' }}>
                  <Monitor size={24} color="var(--accent-forest)" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontWeight: 800, fontSize: '12px', textTransform: 'uppercase' }}>3. Broadsheet UX</div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                    Interactive Webpage<br />
                    Morning Audio Dispatch<br />
                    High-Res Daily PDF
                  </div>
                </div>

                {/* Stage 4 */}
                <div style={{ border: '1px solid var(--rule-light)', padding: '14px 10px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-paper)' }}>
                  <Sparkles size={24} color="var(--accent-gold)" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontWeight: 800, fontSize: '12px', textTransform: 'uppercase' }}>4. Feedback Loop</div>
                  <div style={{ fontSize: '11px', color: 'var(--ink-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
                    Skips (-0.25 penalty)<br />
                    Likes (+0.35 boost)<br />
                    Next Morning Adapts
                  </div>
                </div>
              </div>

              {/* Feedback Loop Explanation Arrow */}
              <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '11px', color: 'var(--ink-muted)', fontStyle: 'italic', borderTop: '1px dashed var(--rule-light)', paddingTop: '10px' }}>
                ⇄ Continuous Reinforcement: Reader signals immediately update the local Bayesian weight matrix, recalibrating tomorrow's lead story & columns.
              </div>
            </div>
          </div>

          {/* Submission Deliverables Checklist */}
          <div style={{ marginBottom: '28px' }}>
            <h3 style={{ fontFamily: 'var(--font-masthead)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '14px', borderBottom: '2px solid var(--rule-color)', paddingBottom: '4px' }}>
              Submission Deliverables Guide (From Hackathon PDF)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '12px', padding: '12px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--rule-light)', borderRadius: 'var(--radius-sm)' }}>
                <CheckCircle2 size={20} color="var(--accent-forest)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px' }}>1. Public GitHub Repository</div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginTop: '2px' }}>
                    Repository URL: <code>https://github.com/AbdulAzeemHashmi/personal-morning-paper</code>. Clean commit history tracking each phase of implementation.
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', padding: '12px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--rule-light)', borderRadius: 'var(--radius-sm)' }}>
                <Video size={20} color="var(--accent-burgundy)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px' }}>2. Loom Product Walkthrough Video (5 minutes max)</div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginTop: '2px' }}>
                    Recommended flow:
                    <ul style={{ paddingLeft: '18px', marginTop: '4px', fontSize: '11.5px', lineHeight: 1.5 }}>
                      <li>0:00 - 1:00: Problem overview (information scatter) & Onboarding printing press setup.</li>
                      <li>1:00 - 2:30: Digital Broadsheet experience (Masthead, Lead story, Audio dispatch, Column layout).</li>
                      <li>2:30 - 3:30: Adaptive Learning demonstration (skipping an article, showing the AI Mind weight shifts, simulating next day).</li>
                      <li>3:30 - 4:15: Room to Explore features (Chief Editor Note, Nuance Lens, Coffee Break, Historical Archive).</li>
                      <li>4:15 - 5:00: 1-Click Broadsheet PDF generation & architecture walkthrough.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', padding: '12px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--rule-light)', borderRadius: 'var(--radius-sm)' }}>
                <Layers size={20} color="var(--accent-gold)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13px' }}>3. Architecture Diagram & Specification</div>
                  <div style={{ fontSize: '12px', color: 'var(--ink-secondary)', marginTop: '2px' }}>
                    Detailed above and included in the repository's <code>ARCHITECTURE.md</code> and <code>PLAN.md</code>.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submission Form Link */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-subtle)', padding: '14px 18px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--rule-color)' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', color: 'var(--accent-burgundy)' }}>
                Official Submission Form
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--ink-secondary)' }}>
                Submit repo link, Loom video, and architecture diagram
              </div>
            </div>

            <a
              href="https://forms.gle/4i4Gf8vNv3Vu8ZLJ7"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Open Google Form <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
