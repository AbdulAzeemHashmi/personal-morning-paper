import React, { useState } from 'react';
import { CoffeeBreakItem } from '../types';
import { Coffee, HelpCircle, Eye, EyeOff, BookMarked, History } from 'lucide-react';

interface CoffeeBreakProps {
  coffeeBreak: CoffeeBreakItem;
}

export const CoffeeBreak: React.FC<CoffeeBreakProps> = ({ coffeeBreak }) => {
  const [showAnswer, setShowAnswer] = useState<boolean>(false);

  return (
    <div className="coffee-break-container">
      {/* Riddle & Brain Teaser */}
      <div className="coffee-riddle-box">
        <div className="coffee-header">
          <Coffee size={18} color="var(--accent-burgundy)" />
          The Coffee Break • Daily Dilemma
        </div>

        <p className="riddle-text">
          "{coffeeBreak.riddle}"
        </p>

        <div style={{ fontSize: '11px', color: 'var(--ink-muted)', marginBottom: '10px' }}>
          <strong>Clue:</strong> {coffeeBreak.clue}
        </div>

        <button
          className="answer-toggle-btn"
          onClick={() => setShowAnswer(!showAnswer)}
        >
          {showAnswer ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <EyeOff size={11} /> Hide Solution
            </span>
          ) : (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Eye size={11} /> Reveal Solution
            </span>
          )}
        </button>

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
