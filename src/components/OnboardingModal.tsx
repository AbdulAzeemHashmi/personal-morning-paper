import React, { useState } from 'react';
import { ReaderProfile, ReadingTimePreference, TonePreference } from '../types';
import { AVAILABLE_CATEGORIES, SUGGESTED_KEYWORDS } from '../data/newsFeed';
import { Sparkles, Newspaper, Clock, BookOpen, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';

interface OnboardingModalProps {
  initialProfile: ReaderProfile;
  onComplete: (profile: ReaderProfile) => void;
  isOpen: boolean;
  onClose?: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialProfile,
  onComplete,
  isOpen,
  onClose
}) => {
  const [step, setStep] = useState<number>(1);
  const [profile, setProfile] = useState<ReaderProfile>(initialProfile);
  const [customKeywordInput, setCustomKeywordInput] = useState<string>('');

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Step 4 Complete: Trigger confetti & finish
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      onComplete({ ...profile, onboardingCompleted: true });
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleCategory = (cat: string) => {
    const exists = profile.topics.includes(cat);
    const updated = exists
      ? profile.topics.filter(t => t !== cat)
      : [...profile.topics, cat];
    setProfile({ ...profile, topics: updated });
  };

  const addKeyword = (kw: string) => {
    const trimmed = kw.trim();
    if (trimmed && !profile.customKeywords.includes(trimmed)) {
      setProfile({
        ...profile,
        customKeywords: [...profile.customKeywords, trimmed]
      });
      setCustomKeywordInput('');
    }
  };

  const removeKeyword = (kw: string) => {
    setProfile({
      ...profile,
      customKeywords: profile.customKeywords.filter(k => k !== kw)
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-dialog" style={{ maxWidth: '680px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Newspaper size={20} color="var(--accent-burgundy)" />
            <span style={{ fontFamily: 'var(--font-masthead)', fontWeight: 700, fontSize: '1.1rem' }}>
              The Morning Chronicle: Printing Press Setup
            </span>
          </div>
          {onClose && profile.onboardingCompleted && (
            <button className="modal-close-btn" onClick={onClose}>✕</button>
          )}
        </div>

        <div className="modal-body">
          {/* Step Dots */}
          <div className="wizard-step-indicator">
            {[1, 2, 3, 4].map(s => (
              <div key={s} className={`wizard-dot ${step === s ? 'active' : ''}`} />
            ))}
          </div>

          {/* STEP 1: Identity & Masthead */}
          {step === 1 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.6rem', marginBottom: '8px' }}>
                Name Your Morning Broadsheet
              </h2>
              <p style={{ color: 'var(--ink-secondary)', fontSize: '13.5px', marginBottom: '20px' }}>
                Every morning paper begins with its reader. Let's personalize your masthead.
              </p>

              <div className="form-group">
                <label className="form-label">Your Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.name}
                  onChange={e => {
                    const name = e.target.value;
                    setProfile({
                      ...profile,
                      name,
                      newspaperName: name ? `The ${name} Morning Chronicle` : 'The Daily Chronicle'
                    });
                  }}
                  placeholder="e.g. Abdul Azeem"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Newspaper Masthead Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.newspaperName}
                  onChange={e => setProfile({ ...profile, newspaperName: e.target.value })}
                  placeholder="e.g. Jimmy Morning Chronicle"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Morning Motto / Latin Maxim</label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.motto}
                  onChange={e => setProfile({ ...profile, motto: e.target.value })}
                  placeholder="e.g. Veritas, Gravitas et Lux"
                />
              </div>

              <div className="form-group">
                <label className="form-label">City / Weather Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={profile.location}
                  onChange={e => setProfile({ ...profile, location: e.target.value })}
                  placeholder="e.g. San Francisco, London, Tokyo"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Time & Routine */}
          {step === 2 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.6rem', marginBottom: '8px' }}>
                Your Reading Ritual
              </h2>
              <p style={{ color: 'var(--ink-secondary)', fontSize: '13.5px', marginBottom: '20px' }}>
                A finite publication respects your morning attention. How do you take your news?
              </p>

              <div className="form-group">
                <label className="form-label">Morning Reading Budget</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  {[
                    { id: '5min', label: '5 Min Espresso', desc: 'Punchy executive takeaways & lead story' },
                    { id: '15min', label: '15 Min Breakfast', desc: 'Balanced broadsheet with analytical depth' },
                    { id: '30min', label: '30 Min Commute', desc: 'Expansive long-form investigative reads' }
                  ].map(item => (
                    <div
                      key={item.id}
                      onClick={() => setProfile({ ...profile, readingTime: item.id as ReadingTimePreference })}
                      style={{
                        border: profile.readingTime === item.id ? '2px solid var(--accent-burgundy)' : '1px solid var(--rule-light)',
                        backgroundColor: profile.readingTime === item.id ? 'var(--bg-subtle)' : 'var(--bg-card)',
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <Clock size={20} style={{ margin: '0 auto 6px', color: profile.readingTime === item.id ? 'var(--accent-burgundy)' : 'var(--ink-muted)' }} />
                      <div style={{ fontWeight: 700, fontSize: '12.5px' }}>{item.label}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ink-secondary)', marginTop: '4px' }}>{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '24px' }}>
                <label className="form-label">Editorial Disposition / Tone</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                  {[
                    { id: 'analytical', title: 'Analytical & Objective', desc: 'Rigorous empirical facts, systemic trends' },
                    { id: 'executive', title: 'Executive & Strategic', desc: 'High-signal impacts on markets & strategy' },
                    { id: 'curious', title: 'Intellectual & Philosophical', desc: 'Deep ideas, historical context, cosmos' },
                    { id: 'provocative', title: 'Contrarian & Nuanced', desc: 'Challenging orthodoxies and consensus' }
                  ].map(t => (
                    <div
                      key={t.id}
                      onClick={() => setProfile({ ...profile, tone: t.id as TonePreference })}
                      style={{
                        border: profile.tone === t.id ? '2px solid var(--accent-burgundy)' : '1px solid var(--rule-light)',
                        backgroundColor: profile.tone === t.id ? 'var(--bg-subtle)' : 'var(--bg-card)',
                        padding: '12px',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '12.5px' }}>{t.title}</div>
                      <div style={{ fontSize: '11px', color: 'var(--ink-secondary)', marginTop: '3px' }}>{t.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Beats & Keywords */}
          {step === 3 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.6rem', marginBottom: '8px' }}>
                Your Editorial Beats & Passions
              </h2>
              <p style={{ color: 'var(--ink-secondary)', fontSize: '13.5px', marginBottom: '20px' }}>
                Choose the beats that shape your front page, plus specific micro-topics you track.
              </p>

              <div className="form-group">
                <label className="form-label">Primary Editorial Sections</label>
                <div className="pill-grid">
                  {AVAILABLE_CATEGORIES.map(cat => {
                    const isSelected = profile.topics.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        className={`pill-btn ${isSelected ? 'active' : ''}`}
                        onClick={() => toggleCategory(cat)}
                      >
                        {isSelected && <Check size={12} style={{ display: 'inline', marginRight: '4px' }} />}
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '20px' }}>
                <label className="form-label">Custom Micro-Topics & Keywords</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    className="form-input"
                    value={customKeywordInput}
                    onChange={e => setCustomKeywordInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addKeyword(customKeywordInput);
                      }
                    }}
                    placeholder="Type keyword and press Enter (e.g. Agentic AI, SpaceX, Clean Tech)"
                  />
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => addKeyword(customKeywordInput)}
                  >
                    Add
                  </button>
                </div>

                {/* Selected Keywords */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                  {profile.customKeywords.map(kw => (
                    <span
                      key={kw}
                      style={{
                        backgroundColor: 'var(--bg-subtle)',
                        border: '1px solid var(--rule-color)',
                        padding: '4px 10px',
                        borderRadius: '16px',
                        fontSize: '11px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontFamily: 'var(--font-ui)'
                      }}
                    >
                      {kw}
                      <span
                        style={{ cursor: 'pointer', fontWeight: 800, color: 'var(--accent-burgundy)' }}
                        onClick={() => removeKeyword(kw)}
                      >
                        ×
                      </span>
                    </span>
                  ))}
                </div>

                <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
                  Suggestions:
                  {SUGGESTED_KEYWORDS.filter(k => !profile.customKeywords.includes(k)).slice(0, 6).map(sug => (
                    <span
                      key={sug}
                      onClick={() => addKeyword(sug)}
                      style={{
                        marginLeft: '6px',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                        color: 'var(--accent-burgundy)'
                      }}
                    >
                      +{sug}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Live Masthead Preview & Launch */}
          {step === 4 && (
            <div>
              <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: '1.6rem', marginBottom: '8px', textAlign: 'center' }}>
                The Presses Are Ready to Roll
              </h2>
              <p style={{ color: 'var(--ink-secondary)', fontSize: '13.5px', marginBottom: '20px', textAlign: 'center' }}>
                Here is your bespoke broadsheet masthead for today's inaugural edition.
              </p>

              <div className="wizard-preview-masthead">
                <div style={{ fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent-burgundy)', fontWeight: 700 }}>
                  Vol. I: Daily Morning Edition
                </div>
                <div style={{ fontFamily: 'var(--font-masthead)', fontSize: '2rem', fontWeight: 900, textTransform: 'uppercase', margin: '6px 0' }}>
                  {profile.newspaperName || 'The Morning Chronicle'}
                </div>
                <div style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--ink-secondary)' }}>
                  "{profile.motto || 'Veritas, Gravitas et Lux'}"
                </div>
                <div className="rule-double" />
                <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '11px', fontFamily: 'var(--font-ui)', textTransform: 'uppercase' }}>
                  <span>City: {profile.location || 'San Francisco'}</span>
                  <span>Routine: {profile.readingTime}</span>
                  <span>Tone: {profile.tone}</span>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '14px', borderRadius: 'var(--radius-sm)', fontSize: '12.5px', color: 'var(--ink-secondary)', textAlign: 'center' }}>
                <Sparkles size={16} color="var(--accent-gold)" style={{ display: 'inline', marginRight: '6px' }} />
                Your paper will continuously adapt: skip what bores you, like what enlightens you, and our editorial mind will sharpen every morning.
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px', paddingTop: '16px', borderTop: '1px solid var(--rule-light)' }}>
            {step > 1 ? (
              <button type="button" className="btn btn-outline" onClick={handleBack}>
                <ArrowLeft size={14} /> Back
              </button>
            ) : <div />}

            <button type="button" className="btn btn-primary" onClick={handleNext}>
              {step === 4 ? (
                <>
                  <BookOpen size={14} /> Roll the Presses & Read
                </>
              ) : (
                <>
                  Continue <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
