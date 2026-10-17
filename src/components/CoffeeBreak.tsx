import React, { useState } from 'react';
import { CoffeeBreakItem } from '../types';
import { Coffee, Eye, EyeOff, BookMarked, History, CheckCircle, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CoffeeBreakProps {
  coffeeBreak: CoffeeBreakItem;
}

export const CoffeeBreak: React.FC<CoffeeBreakProps> = ({ coffeeBreak }) => {
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [userGuess, setUserGuess] = useState<string>('');
  const [guessFeedback, setGuessFeedback] = useState<'correct' | 'incorrect' | null>(null);

  const handleCheckGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userGuess.trim()) return;

    const normalizedGuess = userGuess.toLowerCase().trim();
    const solutionKeywords = ['agent', 'ai', 'algorithm', 'swarm', 'artificial intelligence', 'autonomous', 'model'];

    const isMatch = solutionKeywords.some(kw => normalizedGuess.includes(kw));

    if (isMatch) {
      setGuessFeedback('correct');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 }
      });
    } else {
      setGuessFeedback('incorrect');
    }
  };

  return (
    <div className="modern-coffee-break">
      {/* Riddle & Brain Teaser */}
      <div className="coffee-riddle-side">
        <div className="coffee-header-modern">
          <Coffee size={18} color="var(--accent-amber)" />
          The Coffee Break : Daily Dilemma
        </div>

        <p className="riddle-text-modern">
          "{coffeeBreak.riddle}"
        </p>

        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px' }}>
          <strong style={{ color: 'var(--text-secondary)' }}>Clue:</strong> {coffeeBreak.clue}
        </div>

        {/* Interactive Answer Input */}
        <form onSubmit={handleCheckGuess} style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-input"
            value={userGuess}
            onChange={e => {
              setUserGuess(e.target.value);
              setGuessFeedback(null);
            }}
            placeholder="Type your guess here..."
            style={{ maxWidth: '240px', padding: '6px 12px', fontSize: '12px' }}
          />
          <button type="submit" className="btn btn-sm btn-primary">
            Check Answer
          </button>

          <button
            type="button"
            className="btn btn-sm btn-outline"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            {showAnswer ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <EyeOff size={11} /> Hide Solution
              </span>
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Eye size={11} /> Reveal
              </span>
            )}
          </button>
        </form>

        {guessFeedback === 'correct' && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--accent-emerald)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '8px 12px', borderRadius: '6px', fontSize: '12.5px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
            <CheckCircle size={15} /> Brilliant! Your answer is spot on!
          </div>
        )}

        {guessFeedback === 'incorrect' && (
          <div style={{ backgroundColor: 'rgba(244, 63, 94, 0.12)', color: 'var(--accent-rose)', border: '1px solid rgba(244, 63, 94, 0.3)', padding: '8px 12px', borderRadius: '6px', fontSize: '12px', marginBottom: '10px' }}>
            Not quite. Take another look at today's front-page technology lead!
          </div>
        )}

        {showAnswer && (
          <div style={{ background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '10px 14px', fontSize: '12.5px', color: 'var(--text-secondary)' }}>
            <strong style={{ color: 'var(--accent-amber)' }}>Solution:</strong> {coffeeBreak.answer}
          </div>
        )}
      </div>

      {/* Word of the Day & Historical Footnote */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1.2px', color: 'var(--accent-amber)', marginBottom: '8px' }}>
            <BookMarked size={14} /> Word of the Morning
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            {coffeeBreak.wordOfDay.word}
          </div>
          <div style={{ fontSize: '13.5px', fontStyle: 'italic', color: 'var(--text-secondary)', margin: '6px 0' }}>
            {coffeeBreak.wordOfDay.definition}
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
            Origin: {coffeeBreak.wordOfDay.origin}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            <History size={12} /> Press History Footnote
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            {coffeeBreak.factOfTheDay}
          </div>
        </div>
      </div>
    </div>
  );
};
