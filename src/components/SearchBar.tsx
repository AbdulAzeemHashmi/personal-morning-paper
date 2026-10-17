import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { AVAILABLE_CATEGORIES } from '../data/newsFeed';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '18px 0 26px', flexWrap: 'wrap' }}>
      {/* Search Input */}
      <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
        <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
        <input
          type="text"
          className="form-input"
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Filter today's briefing by keyword, topic, or source..."
          style={{ paddingLeft: '36px', paddingRight: '32px', height: '38px', fontSize: '13px' }}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          type="button"
          className={`pill-btn ${selectedCategory === 'ALL' ? 'active' : ''}`}
          onClick={() => onCategoryChange('ALL')}
          style={{ fontSize: '11.5px', padding: '6px 12px' }}
        >
          All Topics
        </button>
        {AVAILABLE_CATEGORIES.map(cat => (
          <button
            key={cat}
            type="button"
            className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => onCategoryChange(selectedCategory === cat ? 'ALL' : cat)}
            style={{ fontSize: '11.5px', padding: '6px 12px' }}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};

