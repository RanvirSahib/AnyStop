import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MapPin, Building2, X } from 'lucide-react';

interface StopSelectMenuProps {
  id: string;
  label: string;
  value: string;
  stops: string[];
  placeholder?: string;
  otherValue?: string;
  onChange: (stop: string) => void;
}

/**
 * Formats stop names matching the reference portal format:
 * e.g. "Zirakpur (Punjab), Punjab, India"
 */
export const formatLocationDisplay = (stop: string): string => {
  if (!stop) return '';
  const trimmed = stop.trim();
  if (trimmed.includes('Chandigarh')) {
    return `${trimmed}, Punjab / UT, India`;
  }
  if (trimmed.includes('Ambala')) {
    return `${trimmed}, Haryana / Punjab Border, India`;
  }
  if (trimmed.toLowerCase().includes('punjab')) {
    return `${trimmed}, India`;
  }
  return `${trimmed} (Punjab), Punjab, India`;
};

/**
 * Helper to highlight matching letters in the search results
 */
export const renderHighlightedLocation = (fullLocation: string, searchQuery: string) => {
  if (!fullLocation || typeof fullLocation !== 'string') return '';
  const q = (searchQuery || '').trim();
  if (!q) return fullLocation;

  try {
    const escaped = q.replace(/[.*+?^${}()|[\]\\-]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = fullLocation.split(regex);

    return (
      <>
        {parts.map((part, idx) =>
          part.toLowerCase() === q.toLowerCase() ? (
            <mark
              key={idx}
              className="bg-transparent font-extrabold text-[var(--coral)] underline decoration-[var(--coral)] decoration-2"
            >
              {part}
            </mark>
          ) : (
            <React.Fragment key={idx}>{part}</React.Fragment>
          )
        )}
      </>
    );
  } catch {
    return fullLocation;
  }
};

export const StopSelectMenu: React.FC<StopSelectMenuProps> = ({
  id,
  label,
  value,
  stops,
  placeholder = 'Ex: Amritsar, Jalandhar...',
  otherValue,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value || '');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Sync internal query state with external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Filter stops matching typed letters
  const filteredStops = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return stops.filter(stop => {
      const formatted = formatLocationDisplay(stop).toLowerCase();
      return stop.toLowerCase().includes(q) || formatted.includes(q);
    });
  }, [stops, query]);

  // Reset highlight index when filtered list changes
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredStops]);

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (stop: string) => {
    onChange(stop);
    setQuery(stop);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev + 1) % (filteredStops.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex(prev => (prev - 1 + filteredStops.length) % (filteredStops.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredStops[highlightedIndex]) {
        handleSelect(filteredStops[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="location-field-wrapper" ref={containerRef}>
      {/* Upper Label */}
      <label htmlFor={id} className="location-label">
        {label}
      </label>

      {/* Input Box matching reference style */}
      <div className={`location-input-box ${isOpen ? 'focused' : ''}`}>
        <MapPin className="location-pin-icon" />

        <input
          ref={inputRef}
          type="text"
          id={id}
          autoComplete="off"
          maxLength={80}
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            const val = e.target.value;
            onChange(val);
            setQuery(val);
            // Open ONLY when typing letters
            if (val.trim().length > 0) {
              setIsOpen(true);
            } else {
              setIsOpen(false);
            }
          }}
          onFocus={() => {
            // Do NOT open on focus if empty; only open if user has already typed search letters
            if (query.trim().length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          className="location-input"
        />

        {/* Clear Button */}
        {value && (
          <div className="location-actions">
            <button
              type="button"
              onClick={handleClear}
              className="location-action-btn"
              title="Clear text"
              aria-label="Clear text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Dropdown Menu - only visible when user has typed letters and has matching results or no matches */}
      {isOpen && query.trim().length > 0 && (
        <div className="location-dropdown-menu" role="listbox">
          {filteredStops.length === 0 ? (
            <div className="location-empty-state">
              <span>No bus stops found matching "{query.trim()}"</span>
            </div>
          ) : (
            <ul ref={listRef} className="location-dropdown-list">
              {filteredStops.map((stop, index) => {
                const isHighlighted = index === highlightedIndex;
                const isSelected = value === stop;
                const isOther = otherValue === stop;
                const formattedName = formatLocationDisplay(stop);

                return (
                  <li
                    key={stop}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => handleSelect(stop)}
                    className={`location-menu-item ${isHighlighted ? 'highlighted' : ''} ${
                      isSelected ? 'selected' : ''
                    }`}
                  >
                    <Building2 className="location-building-icon" />
                    <span className="location-item-text truncate">
                      {renderHighlightedLocation(formattedName, query)}
                    </span>
                    {isOther && (
                      <span className="location-item-badge">
                        Opposite
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};
