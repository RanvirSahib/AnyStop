import React, { useState, useEffect } from 'react';
import { Radio } from 'lucide-react';
import { FilterState, SpottedReport, ComputedTrip } from './types/transit';
import { STOPS, BUS_SERVICES, INQUIRY_CONTACTS, INITIAL_SPOTTED_REPORTS } from './data/transitData';
import { getMatchingTrips, getCurrentMinutes } from './utils/transitEngine';
import { Header } from './components/Header';
import { SearchSection } from './components/SearchSection';
import { BusCard } from './components/BusCard';
import { SpottedFeedModal } from './components/SpottedFeedModal';
import { InquiryDirectoryModal } from './components/InquiryDirectoryModal';
import { UpcomingBookingModal } from './components/UpcomingBookingModal';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { AnyStopLogo } from './components/AnyStopLogo';

export const App: React.FC = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('anystop_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = darkMode ? 'dark' : 'light';
    localStorage.setItem('anystop_theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Current clock time updated every 30s
  const [currentMinutes, setCurrentMinutes] = useState<number>(getCurrentMinutes());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMinutes(getCurrentMinutes());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    from: "Chandigarh ISBT 43",
    to: "Ludhiana Bus Stand",
    timeFilter: "all",
    typeFilter: "any",
    ownerFilter: "any",
    openCardKey: null
  });

  // Modals state
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isSpottedOpen, setIsSpottedOpen] = useState(false);
  const [bookingTrip, setBookingTrip] = useState<ComputedTrip | null>(null);

  // Spotted crowd sightings list (with localStorage persistence)
  const [spottedReports, setSpottedReports] = useState<SpottedReport[]>(() => {
    try {
      const saved = localStorage.getItem('anystop_spotted_reports');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_SPOTTED_REPORTS;
  });

  const handleAddReport = (newReport: Omit<SpottedReport, 'id' | 'timestamp'>) => {
    const report: SpottedReport = {
      ...newReport,
      id: `spot-${Date.now()}`,
      timestamp: Date.now()
    };
    const updated = [report, ...spottedReports];
    setSpottedReports(updated);
    try {
      localStorage.setItem('anystop_spotted_reports', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Valid stops check
  const isFromValid = STOPS.includes(filters.from.trim());
  const isToValid = STOPS.includes(filters.to.trim());
  const areStopsValid = isFromValid && isToValid && filters.from.trim() !== filters.to.trim();

  // Trips calculation
  const trips = areStopsValid
    ? getMatchingTrips(BUS_SERVICES, filters, currentMinutes)
    : [];

  // Animated Theme toggle using View Transitions API when supported
  const handleToggleDarkMode = (e?: React.MouseEvent<HTMLButtonElement>) => {
    // Fallback if startViewTransition is unsupported
    if (!('startViewTransition' in document)) {
      setDarkMode(prev => !prev);
      return;
    }

    const x = e?.clientX ?? (window.innerWidth - 30);
    const y = e?.clientY ?? 30;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      setDarkMode(prev => !prev);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`
          ]
        },
        {
          duration: 500,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: '::view-transition-new(root)'
        }
      );
    });
  };

  return (
    <>
      {/* Hero Header */}
      <Header
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenInquiries={() => setIsInquiryOpen(true)}
        onOpenSpottedFeed={() => setIsSpottedOpen(true)}
        spottedCount={spottedReports.length}
      />

      {/* Main Content */}
      <main className="wrap">
        {/* Search Section */}
        <SearchSection
          from={filters.from}
          to={filters.to}
          stops={STOPS}
          timeFilter={filters.timeFilter}
          typeFilter={filters.typeFilter}
          ownerFilter={filters.ownerFilter}
          onChangeFrom={(from) => setFilters(prev => ({ ...prev, from, openCardKey: null }))}
          onChangeTo={(to) => setFilters(prev => ({ ...prev, to, openCardKey: null }))}
          onSwap={() => setFilters(prev => ({ ...prev, from: prev.to, to: prev.from, openCardKey: null }))}
          onSelectTrip={(from, to) => setFilters(prev => ({ ...prev, from, to, openCardKey: null }))}
          onChangeTimeFilter={(timeFilter) => setFilters(prev => ({ ...prev, timeFilter, openCardKey: null }))}
          onChangeTypeFilter={(typeFilter) => setFilters(prev => ({ ...prev, typeFilter, openCardKey: null }))}
          onChangeOwnerFilter={(ownerFilter) => setFilters(prev => ({ ...prev, ownerFilter, openCardKey: null }))}
        />

        {/* Community Spotted Prompt Banner */}
        <aside className="spotted-callout-banner" aria-label="Spotted bus community tip">
          <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 flex-1 min-w-0">
            <div className="spotted-callout-beacon shrink-0">
              <Radio className="w-4 h-4 text-[var(--teal)] animate-pulse" />
            </div>
            <p className="spotted-callout-text">
              If you want to share a spotted bus, you can kindly share it by clicking on{' '}
              <button
                type="button"
                onClick={() => setIsSpottedOpen(true)}
                className="spotted-callout-inline-pill"
                title="Open Spotted Bus Feed & Report"
              >
                <Radio className="w-3 h-3 text-[var(--teal)]" />
                <span>Spotted</span>
              </button>{' '}
              in the top bar.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsSpottedOpen(true)}
            className="spotted-callout-action-btn"
          >
            Share Bus
          </button>
        </aside>

        {/* Results Header */}
        <div className="head">
          <h2 id="title">
            {areStopsValid ? `${filters.from} to ${filters.to}` : 'Buses'}
          </h2>
          <span className="count" id="count">
            {areStopsValid && (trips.length + (trips.length === 1 ? ' bus' : ' buses'))}
          </span>
        </div>

        {/* Results List */}
        <div className="list" id="list" aria-live="polite">
          {!areStopsValid ? (
            <div className="empty">
              <b>Choose where you're starting and going.</b>
              <br />
              Type a stop or tap a popular trip.
              <p className="mt-3 text-xs text-[var(--muted)] flex items-center justify-center gap-1.5 flex-wrap">
                <span>Waiting at a stop? If you want to share a spotted bus, you can kindly share it through clicking on</span>
                <button
                  type="button"
                  onClick={() => setIsSpottedOpen(true)}
                  className="font-bold text-[var(--teal)] underline hover:opacity-80 inline-flex items-center gap-1 cursor-pointer"
                >
                  <Radio className="w-3 h-3" />
                  Spotted
                </button>
              </p>
            </div>
          ) : trips.length > 0 ? (
            trips.map((trip, idx) => {
              const cardKey = trip.id;
              const isOpen = filters.openCardKey === cardKey;
              return (
                <BusCard
                  key={cardKey}
                  index={idx}
                  trip={trip}
                  userFrom={filters.from}
                  userTo={filters.to}
                  isOpen={isOpen}
                  onToggleOpen={() => {
                    setFilters(prev => ({
                      ...prev,
                      openCardKey: prev.openCardKey === cardKey ? null : cardKey
                    }));
                  }}
                  onBookOnline={(selectedTrip) => setBookingTrip(selectedTrip)}
                />
              );
            })
          ) : (
            <div className="empty">
              <b>No buses found.</b>
              <br />
              Try "All day", or swap the stops.
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-[var(--line)] bg-[var(--card)]/40 py-8 backdrop-blur-sm transition-colors">
        <div className="wrap flex flex-col sm:flex-row items-center justify-between gap-5 text-[var(--muted)]">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <AnyStopLogo variant="navbar" height="34px" />
            <span className="text-xs font-medium text-[var(--muted)] pl-1">
              Real-time transit intelligence across all Punjab districts
            </span>
          </div>
          <div className="text-xs text-center sm:text-right max-w-sm leading-relaxed">
            Connecting Majha, Doaba, and Malwa — unreserved state buses (PRTC, Punbus) & private fleets. Confirm depot timings before travel.
          </div>
        </div>
      </footer>

      {/* Inquiry Directory Modal */}
      <InquiryDirectoryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        contacts={INQUIRY_CONTACTS}
      />

      {/* Spotted Feed Modal */}
      <SpottedFeedModal
        isOpen={isSpottedOpen}
        onClose={() => setIsSpottedOpen(false)}
        reports={spottedReports}
        onAddReport={handleAddReport}
        currentStop={filters.from}
      />

      {/* Upcoming Online Booking Modal */}
      <UpcomingBookingModal
        isOpen={Boolean(bookingTrip)}
        onClose={() => setBookingTrip(null)}
        trip={bookingTrip}
        from={filters.from}
        to={filters.to}
      />

      {/* PWA Install Prompt */}
      <PWAInstallBanner />
    </>
  );
};

export default App;
