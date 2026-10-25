import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Calendar,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Clock,
  Zap,
  Building2,
  Wind
} from 'lucide-react';
import { TimeFilter, TypeFilter, OwnerFilter, AcFilter } from '../types/transit';
import { TIMES, TYPES, OWNERS, AC_TYPES } from '../data/transitData';
import { StopSelectMenu } from './StopSelectMenu';
import { CustomDatePickerModal } from './CustomDatePickerModal';
import { formatJourneyDate, getTodayDateString } from '../utils/transitEngine';

interface SearchSectionProps {
  from: string;
  to: string;
  stops: string[];
  journeyDate: string;
  timeFilter: TimeFilter;
  typeFilter: TypeFilter;
  ownerFilter: OwnerFilter;
  acFilter: AcFilter;
  onChangeFrom: (from: string) => void;
  onChangeTo: (to: string) => void;
  onChangeJourneyDate: (date: string) => void;
  onSwap: () => void;
  onSelectTrip?: (from: string, to: string) => void;
  onChangeTimeFilter: (filter: TimeFilter) => void;
  onChangeTypeFilter: (filter: TypeFilter) => void;
  onChangeOwnerFilter: (filter: OwnerFilter) => void;
  onChangeAcFilter: (filter: AcFilter) => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  from,
  to,
  stops,
  journeyDate,
  timeFilter,
  typeFilter,
  ownerFilter,
  acFilter,
  onChangeFrom,
  onChangeTo,
  onChangeJourneyDate,
  onSwap,
  onChangeTimeFilter,
  onChangeTypeFilter,
  onChangeOwnerFilter,
  onChangeAcFilter
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const activeFilterCount =
    (timeFilter !== 'all' ? 1 : 0) +
    (typeFilter !== 'any' ? 1 : 0) +
    (ownerFilter !== 'any' ? 1 : 0) +
    (acFilter !== 'any' ? 1 : 0);

  const handleResetFilters = () => {
    onChangeTimeFilter('all');
    onChangeTypeFilter('any');
    onChangeOwnerFilter('any');
    onChangeAcFilter('any');
  };

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

  const handleOpenDatePicker = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setIsCalendarOpen(true);
  };

  // Today & Tomorrow quick dates
  const todayStr = React.useMemo(() => getTodayDateString(), []);
  const tomorrowStr = React.useMemo(() => {
    const tom = new Date();
    tom.setDate(tom.getDate() + 1);
    const y = tom.getFullYear();
    const m = String(tom.getMonth() + 1).padStart(2, '0');
    const d = String(tom.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, []);

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

      {/* Date of Journey */}
      <div className="journey-date-wrapper">
        <label className="location-label flex items-center justify-between" htmlFor="journey-date-input">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[var(--coral)]" />
            <span>DATE OF JOURNEY</span>
          </span>
          <span className="text-[11px] text-[var(--muted)] font-normal hidden sm:inline">
            Click box or calendar to pick any date
          </span>
        </label>

        <div className="journey-date-row">
          <div
            className="journey-date-input-box"
            title="Click to choose journey date"
            onClick={handleOpenDatePicker}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOpenDatePicker();
              }
            }}
          >
            <div className="flex items-center gap-2 min-w-0 pointer-events-none">
              <Calendar className="w-4 h-4 text-[var(--coral)] shrink-0 ml-3.5" />
              <span className="journey-date-label-badge font-semibold truncate">
                {formatJourneyDate(journeyDate)}
              </span>
            </div>

            <div className="journey-date-change-pill mr-3 shrink-0 pointer-events-none">
              <span>Choose ▾</span>
            </div>
          </div>

          <div className="journey-quick-pills">
            <button
              type="button"
              className="pill shrink-0"
              aria-pressed={journeyDate === todayStr}
              onClick={() => onChangeJourneyDate(todayStr)}
            >
              Today
            </button>
            <button
              type="button"
              className="pill shrink-0"
              aria-pressed={journeyDate === tomorrowStr}
              onClick={() => onChangeJourneyDate(tomorrowStr)}
            >
              Tomorrow
            </button>
          </div>
        </div>

        {/* Custom Branded Calendar Modal */}
        <CustomDatePickerModal
          isOpen={isCalendarOpen}
          selectedDate={journeyDate}
          onSelectDate={(newDate) => {
            onChangeJourneyDate(newDate);
          }}
          onClose={() => setIsCalendarOpen(false)}
        />
      </div>

      {errorMessage && (
        <div className="err" id="err" role="alert">
          {errorMessage}
        </div>
      )}

      {/* Unified Filter Menu with Subparts */}
      <div className={`filter-menu-wrapper ${isFilterMenuOpen ? 'open' : ''} ${activeFilterCount > 0 ? 'has-active' : ''}`}>
        <button
          type="button"
          onClick={() => setIsFilterMenuOpen(prev => !prev)}
          className="filter-menu-trigger"
          aria-expanded={isFilterMenuOpen}
        >
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="filter-trigger-icon-box">
              <SlidersHorizontal className="w-4 h-4 text-[var(--coral)]" />
            </div>
            <div className="flex items-center gap-2 text-left min-w-0">
              <span className="font-bold text-sm text-[var(--ink)]">Filter Buses</span>
              {activeFilterCount > 0 && (
                <span className="filter-active-count-badge">
                  {activeFilterCount}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {activeFilterCount > 0 && !isFilterMenuOpen && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--muted)]">
                {timeFilter !== 'all' && (
                  <span className="active-filter-mini-chip">
                    {TIMES.find(t => t[0] === timeFilter)?.[1]}
                  </span>
                )}
                {acFilter !== 'any' && (
                  <span className="active-filter-mini-chip">
                    {AC_TYPES.find(t => t[0] === acFilter)?.[1]}
                  </span>
                )}
                {typeFilter !== 'any' && (
                  <span className="active-filter-mini-chip">
                    {TYPES.find(t => t[0] === typeFilter)?.[1]}
                  </span>
                )}
                {ownerFilter !== 'any' && (
                  <span className="active-filter-mini-chip">
                    {OWNERS.find(t => t[0] === ownerFilter)?.[1]}
                  </span>
                )}
              </div>
            )}
            <div className="filter-chevron-badge">
              {isFilterMenuOpen ? (
                <ChevronUp className="w-4 h-4 text-[var(--ink)]" />
              ) : (
                <ChevronDown className="w-4 h-4 text-[var(--ink)]" />
              )}
            </div>
          </div>
        </button>

        {/* Subparts inside Filter Menu */}
        {isFilterMenuOpen && (
          <div className="filter-menu-body animate-fadeIn">
            <div className="filter-subparts-grid">
              {/* Subpart 1: Departure Time */}
              <div className="filter-subpart">
                <p className="filter-subpart-title">
                  <Clock className="w-3.5 h-3.5 text-[var(--coral)]" />
                  <span>Departure Time</span>
                </p>
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
              </div>

              {/* Subpart 2: Bus Comfort (AC / Non-AC) */}
              <div className="filter-subpart">
                <p className="filter-subpart-title">
                  <Wind className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>Bus Comfort (AC / Non-AC)</span>
                </p>
                <div className="pills" id="acTypes">
                  {AC_TYPES.map(([k, label]) => (
                    <button
                      key={k}
                      className="pill"
                      type="button"
                      aria-pressed={acFilter === k}
                      onClick={() => onChangeAcFilter(k as AcFilter)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subpart 3: Bus Speed */}
              <div className="filter-subpart">
                <p className="filter-subpart-title">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Speed Type</span>
                </p>
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
              </div>

              {/* Subpart 4: Run by */}
              <div className="filter-subpart">
                <p className="filter-subpart-title">
                  <Building2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Operator Type</span>
                </p>
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
              </div>
            </div>

            {/* Filter Menu Footer */}
            <div className="filter-menu-footer">
              <span className="text-xs text-[var(--muted)] font-medium">
                {activeFilterCount > 0
                  ? `${activeFilterCount} active ${activeFilterCount === 1 ? 'filter' : 'filters'} applied`
                  : 'All filters default (showing all scheduled buses)'}
              </span>

              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="filter-reset-btn"
                    title="Reset all filters to default"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsFilterMenuOpen(false)}
                  className="filter-done-btn"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
