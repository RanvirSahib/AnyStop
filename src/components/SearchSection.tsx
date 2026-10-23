import React, { useState } from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { TimeFilter, TypeFilter, OwnerFilter } from '../types/transit';
import { POPULAR_TRIPS, TIMES, TYPES, OWNERS } from '../data/transitData';
import { StopSelectMenu } from './StopSelectMenu';

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
        <StopSelectMenu
          id="from"
          label="SOURCE"
          value={from}
          stops={stops}
          placeholder="Ex: Chandigarh, Ludhiana..."
          otherValue={to}
          onChange={onChangeFrom}
        />

        <button
          className={`swap ${isSpinning ? 'spin' : ''}`}
          id="swap"
          aria-label="Swap source and destination"
          type="button"
          onClick={handleSwapClick}
          title="Swap source and destination"
        >
          <ArrowLeftRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <StopSelectMenu
          id="to"
          label="DESTINATION"
          value={to}
          stops={stops}
          placeholder="Ex: Amritsar, Jalandhar..."
          otherValue={from}
          onChange={onChangeTo}
        />
      </div>

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
