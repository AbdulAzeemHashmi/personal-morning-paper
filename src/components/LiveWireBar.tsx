import React, { useState, useEffect } from 'react';
import { apiFetchLiveWire, LiveWireDispatch } from '../services/api';
import { Radio, ExternalLink, ChevronRight } from 'lucide-react';

export const LiveWireBar: React.FC = () => {
  const [dispatches, setDispatches] = useState<LiveWireDispatch[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    apiFetchLiveWire().then(setDispatches);
  }, []);

  return (
    <div style={{ backgroundColor: 'var(--bg-subtle)', border: '1px solid var(--rule-light)', borderRadius: 'var(--radius-sm)', padding: '10px 16px', margin: '14px 0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setIsOpen(!isOpen)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontFamily: 'var(--font-ui)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--accent-burgundy)' }}>
          <Radio size={14} className="audio-pulse" /> Live Wire Ticker : Real-Time Feeds ({dispatches.length} updates)
        </div>
        <div style={{ fontSize: '11px', color: 'var(--ink-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          {isOpen ? 'Collapse Wire' : 'Expand Wire'} <ChevronRight size={12} style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s ease' }} />
        </div>
      </div>

      {isOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px', borderTop: '1px dotted var(--rule-light)', paddingTop: '10px' }}>
          {dispatches.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '10px', color: 'var(--ink-muted)', minWidth: '55px' }}>{item.publishedAt}</span>
                <span style={{ fontWeight: 600, color: 'var(--ink-primary)' }}>{item.title}</span>
                <span style={{ fontSize: '10.5px', color: 'var(--ink-muted)' }}>via {item.outlet}</span>
              </div>
              <a
                href={item.outletUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: 'var(--accent-burgundy)', display: 'inline-flex', alignItems: 'center', gap: '2px', textDecoration: 'none', fontSize: '11px', fontWeight: 600 }}
              >
                Wire Link <ExternalLink size={10} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
