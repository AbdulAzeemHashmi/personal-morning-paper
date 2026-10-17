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
    <div className="coffee-break-container">
      {/* Riddle & Brain Teaser */}
      <div className="coffee-riddle-box">
        <div className="coffee-header">
          <Coffee size={18} color="var(--accent-burgundy)" />
          The Coffee Break : Daily Dilemma
        </div>

        <p className="riddle-text">
          "{coffeeBreak.riddle}"
        </p>

        <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '12px' }}>
          <strong>Clue:</strong> {coffeeBreak.clue}
        </div>

        {/* Interactive Answer Input */}
        <form onSubmit={handleCheckGuess} style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-input"
            value={userGuess}
            onChange={e => {
              setUserGuess(e.target.value);
              setGuessFeedback(null);
            }}
            placeholder="Type your guess here..."
            style={{ maxWidth: '240px', padding: '6px 10px', fontSize: '12px' }}
          />
          <button type="submit" className="btn btn-sm btn-primary">
            Check Answer
          </button>

          <button
            type="button"
            className="answer-toggle-btn"
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
          <div style={{ backgroundColor: '#e6f4ea', color: '#137333', padding: '6px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <CheckCircle size={14} /> Brilliant! Your answer is spot on!
          </div>
        )}

        {guessFeedback === 'incorrect' && (
          <div style={{ backgroundColor: '#fce8e6', color: '#c5221f', padding: '6px 10px', borderRadius: '4px', fontSize: '12px', marginBottom: '8px' }}>
            Not quite. Take another look at today's front-page technology lead!
          </div>
        )}

        {showAnswer && (
          <div className="answer-reveal">
            <strong>Solution:</strong> {coffeeBreak.answer}
          </div>
        )}
      </div>

      {/* Word of the Day & Historical Footnote */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'var(--font-masthead)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
            <BookMarked size={14} color="var(--accent-forest)" /> Word of the Morning
          </div>
          <div style={{ fontFamily: 'var(--font-headline)', fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-burgundy)' }}>
            {coffeeBreak.wordOfDay.word}
          </div>
          <div style={{ fontSize: '13px', fontStyle: 'italic', color: 'var(--ink-secondary)', margin: '4px 0' }}>
            {coffeeBreak.wordOfDay.definition}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--ink-muted)' }}>
            Origin: {coffeeBreak.wordOfDay.origin}
          </div>
        </div>

        <div style={{ borderTop: '1px dotted var(--rule-light)', paddingTop: '10px', marginTop: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: '4px' }}>
            <History size={12} /> Press History Footnote
          </div>
          <div style={{ fontSize: '11.5px', color: 'var(--ink-secondary)', lineHeight: 1.45 }}>
            {coffeeBreak.factOfTheDay}
          </div>
        </div>
      </div>
    </div>
  );
};
