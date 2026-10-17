import React, { useState, useEffect } from 'react';
import { apiFetchLiveWire, LiveWireDispatch } from '../services/api';
import { Radio, ExternalLink, ChevronRight, Zap } from 'lucide-react';

export const LiveWireBar: React.FC = () => {
  const [dispatches, setDispatches] = useState<LiveWireDispatch[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    apiFetchLiveWire().then(setDispatches);
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px 18px', margin: '16px 0 24px', boxShadow: 'var(--shadow-sm)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setIsOpen(!isOpen)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-amber)' }}>
          <span style={{ display: 'inline-flex', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-emerald)', animation: 'pulse 1.4s infinite' }} />
          <Radio size={14} /> Live Wire Ticker : Real-Time Intelligence Stream ({dispatches.length} updates)
        </div>
        <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {isOpen ? 'Collapse Wire' : 'Expand Stream'} <ChevronRight size={13} style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }} />
        </div>
      </div>

      {isOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
          {dispatches.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', gap: '12px', padding: '6px 8px', borderRadius: '6px', background: 'var(--bg-surface-elevated)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10.5px', color: 'var(--accent-amber)', fontWeight: 700, minWidth: '55px' }}>{item.publishedAt}</span>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.title}</span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>via {item.outlet}</span>
              </div>
              <a
                href={item.outletUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent-amber)', display: 'inline-flex', alignItems: 'center', gap: '3px', textDecoration: 'none', fontSize: '11.5px', fontWeight: 600, flexShrink: 0 }}
              >
                Source <ExternalLink size={11} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

