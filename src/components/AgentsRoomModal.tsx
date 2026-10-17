import React from 'react';
import { AgentLog } from '../agents/types';
import { Bot, Cpu, Sparkles, CheckCircle2, Play, RefreshCw, X, ShieldAlert } from 'lucide-react';

interface AgentsRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: AgentLog[];
  onTriggerAgents: () => void;
  isProcessing: boolean;
}

export const AgentsRoomModal: React.FC<AgentsRoomModalProps> = ({
  isOpen,
  onClose,
  logs,
  onTriggerAgents,
  isProcessing
}) => {
  if (!isOpen) return null;

  const agentBadges = [
    { name: 'Chief Editor Agent (Aura-1)', role: 'Editorial Synthesis & Theme', color: 'var(--accent-burgundy)' },
    { name: 'Curator & Reranker (Nexus-4)', role: 'Bayesian Scoring & Layout', color: 'var(--accent-blue)' },
    { name: 'Perspective & Nuance (Vantage-2)', role: '3-Way Worldview Framing', color: 'var(--accent-forest)' },
    { name: 'Culture & Leisure (Minerva-3)', role: 'Riddles, Trivia & Etymology', color: 'var(--accent-gold)' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()} style={{ maxWidth: '820px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot size={20} color="var(--accent-burgundy)" />
            <span style={{ fontFamily: 'var(--font-masthead)', fontWeight: 800, fontSize: '1.2rem' }}>
              The Multi-Agent Editorial Room : Autonomous Assembly
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '13px', color: 'var(--ink-secondary)', marginBottom: '16px' }}>
            Every morning paper is synthesized by a collaborative ensemble of autonomous AI agents. Rather than an unvetted single pass, specialized agents evaluate relevance, challenge editorial bias, draft perspectives, and construct intellectual puzzles.
          </p>

          {/* Agent Squad Roster */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
            {agentBadges.map((badge, idx) => (
              <div key={idx} style={{ padding: '10px 14px', backgroundColor: 'var(--bg-card)', border: '1px solid var(--rule-light)', borderRadius: 'var(--radius-sm)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '12px', color: badge.color }}>
                  <Cpu size={14} /> {badge.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--ink-secondary)', marginTop: '2px' }}>
                  {badge.role}
                </div>
              </div>
            ))}
          </div>

          {/* Action Trigger */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--rule-light)', paddingBottom: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Agent Workflow Trajectory ({logs.length} events)
            </div>

            <button
              type="button"
              className="btn btn-sm btn-primary"
              onClick={onTriggerAgents}
              disabled={isProcessing}
            >
              <RefreshCw size={12} className={isProcessing ? 'audio-pulse' : ''} />
              {isProcessing ? 'Agents Working...' : 'Run Editorial Agents Now'}
            </button>
          </div>

          {/* Workflow Log Stream */}
          <div style={{ maxHeight: '280px', overflowY: 'auto', backgroundColor: 'var(--bg-card)', border: '1px solid var(--rule-light)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
            {logs.length === 0 ? (
              <div style={{ fontSize: '12px', color: 'var(--ink-muted)', fontStyle: 'italic', textAlign: 'center', padding: '20px' }}>
                Agents ready. Click "Run Editorial Agents Now" to trigger a live multi-agent collaborative press run.
              </div>
            ) : (
              logs.map((log, index) => (
                <div key={index} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px dotted var(--rule-light)', fontSize: '12px' }}>
                  <div style={{ minWidth: '60px', fontSize: '10.5px', color: 'var(--ink-muted)', fontFamily: 'var(--font-ui)' }}>
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--ink-primary)', fontSize: '11.5px', marginBottom: '2px' }}>
                      {log.agent}
                    </div>
                    <div style={{ color: 'var(--ink-secondary)', lineHeight: 1.5 }}>
                      {log.message}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
