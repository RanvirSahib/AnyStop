import React, { useState, useEffect, useMemo } from 'react';
import { Radio, AlertCircle } from 'lucide-react';
import { FilterState, SpottedReport, ComputedTrip } from './types/transit';
import { STOPS, BUS_SERVICES, INQUIRY_CONTACTS, INITIAL_SPOTTED_REPORTS } from './data/transitData';
import { getMatchingTrips, getCurrentMinutes } from './utils/transitEngine';
import { Header } from './components/Header';
import { SearchSection } from './components/SearchSection';
import { BusCard } from './components/BusCard';
import { SharedBusCard } from './components/SharedBusCard';
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

  // Filter state (empty by default so user can choose starting and destination stops)
  const [filters, setFilters] = useState<FilterState>({
    from: "",
    to: "",
    timeFilter: "all",
    typeFilter: "any",
    ownerFilter: "any",
    openCardKey: null
  });

  // Modals state
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [isSpottedOpen, setIsSpottedOpen] = useState(false);
  const [bookingTrip, setBookingTrip] = useState<ComputedTrip | null>(null);

  // Spotted crowd sightings list (with localStorage persistence & auto-purge of stale reports)
  const [spottedReports, setSpottedReports] = useState<SpottedReport[]>(() => {
    try {
      const saved = localStorage.getItem('anystop_spotted_reports');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const now = Date.now();
          // Filter out demo reports AND expired reports (older than 3 hours)
          const valid = parsed.filter(
            (r: any) =>
              r &&
              r.id &&
              !['spot-1', 'spot-2', 'spot-3', 'spot-4'].includes(r.id) &&
              (now - (r.timestamp || 0)) < 3 * 60 * 60 * 1000
          );
          if (valid.length === 0) {
            localStorage.removeItem('anystop_spotted_reports');
          } else {
            localStorage.setItem('anystop_spotted_reports', JSON.stringify(valid));
          }
          return valid;
        }
      }
    } catch {
      // fallback
    }
    try {
      localStorage.removeItem('anystop_spotted_reports');
    } catch {
      // ignore
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

  const handleDeleteReport = (reportId: string) => {
    setSpottedReports(prev => {
      const updated = prev.filter(r => r.id !== reportId);
      try {
        if (updated.length === 0) {
          localStorage.removeItem('anystop_spotted_reports');
        } else {
          localStorage.setItem('anystop_spotted_reports', JSON.stringify(updated));
        }
      } catch {
        // ignore
      }
      return updated;
    });
  };

  // Valid stops check
  const isFromValid = STOPS.includes(filters.from.trim());
  const isToValid = STOPS.includes(filters.to.trim());
  const areStopsValid = isFromValid && isToValid && filters.from.trim() !== filters.to.trim();

  // Trips calculation
  const trips = areStopsValid
    ? getMatchingTrips(BUS_SERVICES, filters, currentMinutes)
    : [];

  // Open shared bus card tracking
  const [openSharedId, setOpenSharedId] = useState<string | null>(null);

  // Helper to normalize stop names for fuzzy corridor matching
  const normalizeStopName = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/\s*\([^)]*\)/g, '')
      .replace(/\b(bus stand|isbt|central|stand|depot)\b/gi, '')
      .replace(/[^a-z0-9]/g, '')
      .trim();
  };

  const isStopMatch = (target: string, query: string): boolean => {
    if (!target || !query) return false;
    const nTarget = normalizeStopName(target);
    const nQuery = normalizeStopName(query);
    if (!nTarget || !nQuery) return false;
    return nTarget.includes(nQuery) || nQuery.includes(nTarget);
  };

  // Relevant shared buses strictly linked to the chosen source & destination or stops between them
  const relevantSpotted = useMemo(() => {
    if (!areStopsValid) return [];

    const now = Date.now();
    const maxAgeMs = 3 * 60 * 60 * 1000; // 3 hours max age for live sighting

    // Find all corridor stop sequences connecting `filters.from` to `filters.to` in proper direction
    const corridorStopSequences: string[][] = [];

    for (const bus of BUS_SERVICES) {
      const fIdx = bus.stops.findIndex(([s]) => isStopMatch(s, filters.from));
      const tIdx = bus.stops.findIndex(([s]) => isStopMatch(s, filters.to));

      if (fIdx >= 0 && tIdx > fIdx) {
        const sequence = bus.stops.slice(fIdx, tIdx + 1).map(([s]) => s);
        corridorStopSequences.push(sequence);
      }
    }

    // Collect valid boarding/spotted stops (source + all intermediate stops along the corridor before destination)
    const validBoardingStops = new Set<string>();
    const validDestinationStops = new Set<string>();

    validBoardingStops.add(filters.from);
    validDestinationStops.add(filters.to);

    for (const seq of corridorStopSequences) {
      // Boarding / spotted stops along corridor before the destination
      for (let i = 0; i < seq.length - 1; i++) {
        validBoardingStops.add(seq[i]);
      }
      // Target destination stops
      for (let i = 1; i < seq.length; i++) {
        validDestinationStops.add(seq[i]);
      }
    }

    return spottedReports.filter(report => {
      // 1. Must be fresh (< 3h)
      if (now - report.timestamp > maxAgeMs) return false;

      // 2. Was it spotted at source or an intermediate stop along this corridor?
      const spottedAtCorridor = Array.from(validBoardingStops).some(s => isStopMatch(s, report.stop));

      // 3. Is it heading towards destination or along the corridor?
      const headingToCorridor = Array.from(validDestinationStops).some(s => isStopMatch(s, report.direction)) ||
        isStopMatch(report.direction, filters.to);

      // 4. Must NOT be heading in opposite/reverse direction towards origin
      const headingInReverse = isStopMatch(report.direction, filters.from);
      if (headingInReverse) return false;

      return spottedAtCorridor && headingToCorridor;
    });
  }, [spottedReports, areStopsValid, filters.from, filters.to]);

  // High-performance theme toggle: GPU-accelerated crossfade on mobile, circular reveal on desktop
  const handleToggleDarkMode = (e?: React.MouseEvent<HTMLButtonElement>) => {
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 768px), (pointer: coarse)').matches;
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Direct toggle if startViewTransition is unsupported or user prefers reduced motion
    if (!('startViewTransition' in document) || prefersReducedMotion) {
      setDarkMode(prev => !prev);
      return;
    }

    const docEl = document.documentElement;
    docEl.classList.add('theme-transition-active');

    if (isMobile) {
      // Mobile optimization: Fullscreen clip-path circle causes severe GPU rasterization lag on mobile.
      // Instead, use an ultra-smooth 220ms GPU-composited crossfade.
      docEl.classList.add('theme-fade-transition');
      const transition = document.startViewTransition(() => {
        setDarkMode(prev => !prev);
      });

      const cleanup = () => {
        docEl.classList.remove('theme-transition-active', 'theme-fade-transition');
      };

      transition.finished.then(cleanup).catch(cleanup);
      return;
    }

    // Desktop: Sleek circular reveal anchored to the theme button
    const x = e?.clientX ?? (window.innerWidth - 30);
    const y = e?.clientY ?? 30;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    docEl.classList.add('theme-clip-transition');
    const transition = document.startViewTransition(() => {
      setDarkMode(prev => !prev);
    });

    const cleanup = () => {
      docEl.classList.remove('theme-transition-active', 'theme-clip-transition');
    };

    transition.ready.then(() => {
      const animation = docEl.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`
          ]
        },
        {
          duration: 380,
          easing: 'cubic-bezier(0.2, 0, 0, 1)',
          pseudoElement: '::view-transition-new(root)'
        }
      );
      animation.onfinish = cleanup;
      animation.oncancel = cleanup;
    }).catch(cleanup);
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

        {/* Community Spotted Prompt Banner - only shown when timetable buses are showing and no user-uploaded buses are showing */}
        {areStopsValid && trips.length > 0 && relevantSpotted.length === 0 && (
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
        )}

        {/* User Shared Buses Matching the Selected Route */}
        {relevantSpotted.length > 0 && (
          <div className="mb-6">
            <div className="head" style={{ marginBottom: '6px' }}>
              <h2 className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-[var(--teal)] animate-pulse shrink-0" />
                <span>{filters.from} to {filters.to} (Shared by Users)</span>
              </h2>
              <span className="count">
                {relevantSpotted.length} shared {relevantSpotted.length === 1 ? 'bus' : 'buses'}
              </span>
            </div>
            {/* User-reported disclaimer notice */}
            <p className="text-xs text-[var(--muted)] mb-3.5 flex items-start sm:items-center gap-1.5 leading-relaxed">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
              <span>
                <strong>Note:</strong> We don't guarantee departure times or seat availability as this bus information is uploaded by fellow users.
              </span>
            </p>
            <div className="list">
              {relevantSpotted.map((report, idx) => (
                <SharedBusCard
                  key={`shared-corridor-${report.id}`}
                  report={report}
                  index={idx}
                  isOpen={openSharedId === report.id}
                  onToggleOpen={() => setOpenSharedId(prev => prev === report.id ? null : report.id)}
                  userFrom={filters.from}
                  userTo={filters.to}
                  onDelete={handleDeleteReport}
                />
              ))}
            </div>
          </div>
        )}

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
            <div>
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
        onDeleteReport={handleDeleteReport}
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
