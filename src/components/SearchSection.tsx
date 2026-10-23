import React, { useState } from 'react';
import { TimeFilter, TypeFilter, OwnerFilter } from '../types/transit';
import { POPULAR_TRIPS, TIMES, TYPES, OWNERS } from '../data/transitData';

interface SearchSectionProps {
  from: string;
  to: string;
  stops: string[];
  timeFilter: TimeFilter;
  typeFilter: TypeFilter;
  ownerFilter: OwnerFilter;
  onChangeFrom: (from: string) => void;
  onChangeTo: (to: string) => void;
  onSwap: () => void;
  onSelectTrip: (from: string, to: string) => void;
  onChangeTimeFilter: (filter: TimeFilter) => void;
  onChangeTypeFilter: (filter: TypeFilter) => void;
  onChangeOwnerFilter: (filter: OwnerFilter) => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  from,
  to,
  stops,
  timeFilter,
  typeFilter,
  ownerFilter,
  onChangeFrom,
  onChangeTo,
  onSwap,
  onSelectTrip,
  onChangeTimeFilter,
  onChangeTypeFilter,
  onChangeOwnerFilter
}) => {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleSwapClick = () => {
    setIsSpinning(prev => !prev);
    onSwap();
  };

  // Validation
  const trimmedFrom = from.trim();
  const trimmedTo = to.trim();
  const badFrom = trimmedFrom && !stops.includes(trimmedFrom);
  const badTo = trimmedTo && !stops.includes(trimmedTo);

  let errorMessage = '';
  if (badFrom && badTo) {
    errorMessage = 'Pick a stop from the list for the from and to boxes.';
  } else if (badFrom) {
    errorMessage = 'Pick a stop from the list for the from box.';
  } else if (badTo) {
    errorMessage = 'Pick a stop from the list for the to box.';
  } else if (trimmedFrom && trimmedFrom === trimmedTo) {
    errorMessage = 'Choose two different stops.';
  }

  return (
    <section className="search" aria-label="Find a bus">
      <div className="fields">
        <div>
          <label htmlFor="from">From</label>
          <input
            type="text"
            id="from"
            list="stoplist"
            autoComplete="off"
            placeholder="Search any stop in Punjab (e.g. Amritsar, Jalandhar, Patiala)"
            value={from}
            onChange={(e) => onChangeFrom(e.target.value)}
            onFocus={(e) => e.target.select()}
          />
        </div>

        <button
          className={`swap ${isSpinning ? 'spin' : ''}`}
          id="swap"
          aria-label="Swap from and to"
          type="button"
          onClick={handleSwapClick}
        >
          ⇅
        </button>

        <div>
          <label htmlFor="to">To</label>
          <input
            type="text"
            id="to"
            list="stoplist"
            autoComplete="off"
            placeholder="Search destination in Punjab (e.g. Bathinda, Ludhiana, Moga)"
            value={to}
            onChange={(e) => onChangeTo(e.target.value)}
            onFocus={(e) => e.target.select()}
          />
        </div>
      </div>

      <datalist id="stoplist">
        {stops.map((stop) => (
          <option key={stop} value={stop} />
        ))}
      </datalist>

      {errorMessage && (
        <div className="err" id="err" role="alert">
          {errorMessage}
        </div>
      )}

      {/* Popular Punjab trips */}
      <p className="lbl">Popular Punjab Inter-City Corridors</p>
      <div className="pills" id="pop">
        {POPULAR_TRIPS.map(([pFrom, pTo], idx) => {
          const isCurrent = from === pFrom && to === pTo;
          const displayFrom = pFrom.split(' (')[0].replace(' Bus Stand', '');
          const displayTo = pTo.split(' (')[0].replace(' Bus Stand', '');
          return (
            <button
              key={idx}
              className="pill"
              type="button"
              aria-pressed={isCurrent}
              onClick={() => onSelectTrip(pFrom, pTo)}
            >
              {displayFrom} → {displayTo}
            </button>
          );
        })}
      </div>

      {/* When */}
      <p className="lbl">When</p>
      <div className="pills" id="times">
        {TIMES.map(([k, label]) => (
          <button
            key={k}
            className="pill"
            type="button"
            aria-pressed={timeFilter === k}
            onClick={() => onChangeTimeFilter(k as TimeFilter)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Bus type */}
      <p className="lbl">Bus type</p>
      <div className="pills" id="types">
        {TYPES.map(([k, label]) => (
          <button
            key={k}
            className="pill"
            type="button"
            aria-pressed={typeFilter === k}
            onClick={() => onChangeTypeFilter(k as TypeFilter)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Run by */}
      <p className="lbl">Run by</p>
      <div className="pills" id="owners">
        {OWNERS.map(([k, label]) => (
          <button
            key={k}
            className="pill"
            type="button"
            aria-pressed={ownerFilter === k}
            onClick={() => onChangeOwnerFilter(k as OwnerFilter)}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
};
