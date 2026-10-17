import React from 'react';
import { Search, X, Filter } from 'lucide-react';
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
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '14px 0 20px', flexWrap: 'wrap' }}>
      {/* Search Input */}
      <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
        <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} />
        <input
          type="text"
          className="form-input"
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Filter today's broadsheet by keyword..."
          style={{ paddingLeft: '32px', paddingRight: '28px', height: '34px', fontSize: '13px' }}
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)' }}
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
          style={{ fontSize: '11px', padding: '4px 10px' }}
        >
          All Beats
        </button>
        {AVAILABLE_CATEGORIES.map(cat => (
          <button
            key={cat}
            type="button"
            className={`pill-btn ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => onCategoryChange(selectedCategory === cat ? 'ALL' : cat)}
            style={{ fontSize: '11px', padding: '4px 10px' }}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
};
