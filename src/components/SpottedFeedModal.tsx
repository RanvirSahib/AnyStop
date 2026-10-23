import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  X,
  Radio,
  Plus,
  Users,
  Send,
  CheckCircle2,
  MapPin,
  Sparkles,
  Navigation,
  Bus,
  Zap,
  MessageSquareQuote,
  AlertCircle,
  Building2,
  ChevronDown
} from 'lucide-react';
import { SpottedReport } from '../types/transit';
import { ALL_PUNJAB_LOCATIONS } from '../data/transitData';
import { formatLocationDisplay, renderHighlightedLocation } from './StopSelectMenu';
import { SharedBusCard } from './SharedBusCard';

export const OPERATOR_FLEET_OPTIONS = [
  { value: 'PRTC PEPSU', display: 'PRTC PEPSU (Punjab), Punjab, India', badge: 'Govt' },
  { value: 'Punbus', display: 'Punbus / Punjab Roadways (Punjab), Punjab, India', badge: 'Govt' },
  { value: 'Orbit Aviators', display: 'Orbit Aviators (Punjab), Punjab, India', badge: 'Volvo AC' },
  { value: 'Libra Bus', display: 'Libra Bus Service (Punjab), Punjab, India', badge: 'Private' },
  { value: 'New Deep', display: 'New Deep Transport (Punjab), Punjab, India', badge: 'Private' },
  { value: 'Jujhar', display: 'Jujhar Bus Service (Punjab), Punjab, India', badge: 'Private' },
  { value: 'CTU', display: 'CTU Chandigarh (Punjab), Punjab, India', badge: 'Govt' },
  { value: 'Haryana Roadways', display: 'Haryana Roadways (Punjab), Punjab, India', badge: 'Govt' },
  { value: 'Local Mini Bus', display: 'Local Mini Bus (Punjab), Punjab, India', badge: 'Local' },
];

interface SpottedFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: SpottedReport[];
  onAddReport: (report: Omit<SpottedReport, 'id' | 'timestamp'>) => void;
  onDeleteReport?: (id: string) => void;
  currentStop: string;
}

export const SpottedFeedModal: React.FC<SpottedFeedModalProps> = ({
  isOpen,
  onClose,
  reports,
  onAddReport,
  onDeleteReport,
  currentStop
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [operator, setOperator] = useState('');
  const [isOperatorOpen, setIsOperatorOpen] = useState(false);
  const [operatorHighlightedIndex, setOperatorHighlightedIndex] = useState(0);
  const operatorMenuRef = useRef<HTMLDivElement>(null);

  const [stop, setStop] = useState('');
  const [isStopOpen, setIsStopOpen] = useState(false);
  const [stopHighlightedIndex, setStopHighlightedIndex] = useState(0);
  const stopMenuRef = useRef<HTMLDivElement>(null);

  const [direction, setDirection] = useState('');
  const [isDirectionOpen, setIsDirectionOpen] = useState(false);
  const [directionHighlightedIndex, setDirectionHighlightedIndex] = useState(0);
  const directionMenuRef = useRef<HTMLDivElement>(null);

  // Filter stop locations across all 23 districts of Punjab
  const filteredStopLocations = useMemo(() => {
    const q = stop.trim().toLowerCase();
    if (!q) return ALL_PUNJAB_LOCATIONS.slice(0, 60);
    return ALL_PUNJAB_LOCATIONS.filter((loc) => {
      const formatted = formatLocationDisplay(loc).toLowerCase();
      return loc.toLowerCase().includes(q) || formatted.includes(q);
    });
  }, [stop]);

  // Filter direction destinations across Punjab
  const filteredDirectionLocations = useMemo(() => {
    const q = direction.replace(/^towards\s+/i, '').trim().toLowerCase();
    if (!q) return ALL_PUNJAB_LOCATIONS.slice(0, 60);
    return ALL_PUNJAB_LOCATIONS.filter((loc) => {
      const formatted = formatLocationDisplay(loc).toLowerCase();
      return loc.toLowerCase().includes(q) || formatted.includes(q);
    });
  }, [direction]);

  const [speedType, setSpeedType] = useState<'Express' | 'Local'>('Express');
  const [crowdLevel, setCrowdLevel] = useState<'Low' | 'Moderate' | 'Heavy Rush'>('Moderate');
  const [statusNote, setStatusNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openCardId, setOpenCardId] = useState<string | null>(null);

  const isFormValid = Boolean(operator.trim() && stop.trim() && direction.trim());

  // Close menus when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (operatorMenuRef.current && !operatorMenuRef.current.contains(target)) {
        setIsOperatorOpen(false);
      }
      if (stopMenuRef.current && !stopMenuRef.current.contains(target)) {
        setIsStopOpen(false);
      }
      if (directionMenuRef.current && !directionMenuRef.current.contains(target)) {
        setIsDirectionOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!operator.trim() || !stop.trim() || !direction.trim()) {
      return;
    }
    onAddReport({
      operator: operator.trim(),
      stop: stop.trim(),
      direction: direction.trim(),
      speedType,
      crowdLevel,
      statusNote: statusNote.trim() || 'Bus spotted running on corridor'
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowAddForm(false);
      setOperator('');
      setStop('');
      setDirection('');
      setStatusNote('');
    }, 1200);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#1E193C] rounded-[28px] shadow-2xl border border-[#E8DCCE] dark:border-[#38315E] overflow-hidden flex flex-col max-h-[90vh] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3.5 sm:p-5 border-b border-[#EBDDD0] dark:border-[#342E5A] flex items-center justify-between gap-2.5 bg-gradient-to-r from-[#FFF5EC] to-[#FFF0E0] dark:from-[#171330] dark:to-[#1E193C]">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-[#0B8F82] to-[#12B3A4] text-white flex items-center justify-center shadow-md shadow-[#0B8F82]/25 shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="font-display font-extrabold text-base sm:text-xl text-[#231F3D] dark:text-[#F6F1FF] tracking-tight truncate">
                  <span className="sm:hidden">Live Spotted</span>
                  <span className="hidden sm:inline">Live Spotted at Stop</span>
                </h3>
                <span className="inline-flex items-center gap-1 text-[10.5px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 shrink-0 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="sm:hidden">Live Feed</span>
                  <span className="hidden sm:inline">Live Crowd Feed</span>
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#6B6585] dark:text-[#A9A2C8] mt-0.5 truncate sm:whitespace-normal">
                Real-time bus sightings shared by waiting commuters
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/80 dark:bg-[#2A2352] text-[#6B6585] dark:text-[#A9A2C8] hover:text-[#231F3D] dark:hover:text-white hover:bg-white shadow-sm flex items-center justify-center transition-all active:scale-95 shrink-0 ml-1"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Stop Rush Live Meter */}
        <div className="px-3.5 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-[#FFF4DF] to-[#FFF8EC] dark:from-[#2B2313] dark:to-[#221B32] border-b border-[#EBDDD0] dark:border-[#342E5A] flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-[#FFB020]/20 flex items-center justify-center text-[#8A5A00] dark:text-[#FFB020] shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-[#231F3D] dark:text-[#F6F1FF] truncate text-[11.5px] sm:text-xs">
              {currentStop || 'Corridor Stop'}
            </span>
          </div>
          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#FFB020] text-[#7A4E00] font-bold text-[11px] sm:text-xs shadow-sm shrink-0 whitespace-nowrap">
            <Zap className="w-3 h-3 fill-current" />
            <span className="sm:hidden">Moderate Rush</span>
            <span className="hidden sm:inline">Moderate Rush (15–20 waiting)</span>
          </span>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#FAF4ED] dark:bg-[#16122D]">
          {/* Sighting Form Card */}
          {showAddForm ? (
            <form
              onSubmit={handleSubmit}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#211B42] border-2 border-[#FF5A4E]/30 dark:border-[#FF5A4E]/40 shadow-lg shadow-[#FF5A4E]/5 space-y-3.5 animate-in slide-in-from-top-2 duration-200"
            >
              {/* Form Card Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[#F0E4D8] dark:border-[#322A5A]">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-[#FF5A4E]/10 text-[#FF5A4E]">
                    <Sparkles className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#FF5A4E]">
                    Report a Bus Spotted Right Now
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-2.5 py-1 rounded-lg bg-[#F3EAE1] dark:bg-[#2C2454] hover:bg-[#EBDDD0] text-xs font-bold text-[#6B6585] dark:text-[#A9A2C8] hover:text-[#231F3D] dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
              </div>

              {/* Row 1: Operator & Speed Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="relative" ref={operatorMenuRef}>
                  <label className="flex items-center gap-1.5 font-bold text-[#231F3D] dark:text-[#F6F1FF] mb-1.5">
                    <Bus className="w-3.5 h-3.5 text-[#0B8F82] dark:text-[#4DE0CF]" />
                    Operator Fleet
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsOperatorOpen((prev) => !prev)}
                    className="w-full h-10 rounded-xl border border-[#DFD2C4] dark:border-[#3B3264] bg-[#F9F5F0] dark:bg-[#181333] px-3 font-semibold text-[#231F3D] dark:text-[#F6F1FF] flex items-center justify-between focus:outline-none focus:border-[#0B8F82] focus:ring-2 focus:ring-[#0B8F82]/20 transition-all text-left"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Bus
                        className={`w-4 h-4 shrink-0 ${
                          operator ? 'text-[#0B8F82] dark:text-[#4DE0CF]' : 'text-[#8E87A5]'
                        }`}
                      />
                      <span
                        className={`truncate text-xs ${
                          operator
                            ? 'font-semibold text-[#231F3D] dark:text-[#F6F1FF]'
                            : 'font-normal text-[#8E87A5]'
                        }`}
                      >
                        {OPERATOR_FLEET_OPTIONS.find((o) => o.value === operator)?.display || 'Choose Operator Fleet...'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {operator && (
                        <span
                          role="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOperator('');
                            setIsOperatorOpen(true);
                          }}
                          className="p-1 rounded-md text-[#8E87A5] hover:text-[#231F3D] dark:hover:text-white cursor-pointer"
                          title="Clear operator"
                        >
                          <X className="w-3 h-3" />
                        </span>
                      )}
                      <ChevronDown
                        className={`w-4 h-4 text-[#6B6585] dark:text-[#A9A2C8] shrink-0 transition-transform duration-200 ${
                          isOperatorOpen ? 'rotate-180 text-[#0B8F82]' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {isOperatorOpen && (
                    <div
                      className="location-dropdown-menu"
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        zIndex: 90,
                        maxHeight: '230px',
                        overflowY: 'auto'
                      }}
                      role="listbox"
                    >
                      <ul className="location-dropdown-list">
                        {OPERATOR_FLEET_OPTIONS.map((opt, idx) => {
                          const isSelected = operator === opt.value;
                          const isHighlighted = idx === operatorHighlightedIndex;
                          return (
                            <li
                              key={opt.value}
                              role="option"
                              aria-selected={isSelected}
                              onMouseEnter={() => setOperatorHighlightedIndex(idx)}
                              onClick={() => {
                                setOperator(opt.value);
                                setIsOperatorOpen(false);
                              }}
                              className={`location-menu-item ${isHighlighted ? 'highlighted' : ''} ${
                                isSelected ? 'selected' : ''
                              }`}
                            >
                              <Bus className="w-4 h-4 text-[#0B8F82] dark:text-[#4DE0CF] shrink-0 location-building-icon" />
                              <span className="location-item-text truncate">{opt.display}</span>
                              {opt.badge && <span className="location-item-badge">{opt.badge}</span>}
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-1.5 font-bold text-[#231F3D] dark:text-[#F6F1FF] mb-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#FFB020]" />
                    Speed Type
                  </label>
                  <div className="grid grid-cols-2 gap-1.5 h-10 p-1 bg-[#F4EAE0] dark:bg-[#181333] rounded-xl border border-[#DFD2C4] dark:border-[#3B3264]">
                    <button
                      type="button"
                      onClick={() => setSpeedType('Express')}
                      className={`rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1 ${
                        speedType === 'Express'
                          ? 'bg-[#0B8F82] text-white shadow-sm'
                          : 'text-[#6B6585] dark:text-[#A9A2C8] hover:text-[#231F3D]'
                      }`}
                    >
                      ⚡ Express
                    </button>
                    <button
                      type="button"
                      onClick={() => setSpeedType('Local')}
                      className={`rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1 ${
                        speedType === 'Local'
                          ? 'bg-[#FFB020] text-[#7A4E00] shadow-sm'
                          : 'text-[#6B6585] dark:text-[#A9A2C8] hover:text-[#231F3D]'
                      }`}
                    >
                      🐢 All-Stop
                    </button>
                  </div>
                </div>
              </div>

              {/* Row 2: Location & Direction */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* At Stop / Landmark */}
                <div className="relative" ref={stopMenuRef}>
                  <label className="flex items-center gap-1.5 font-bold text-[#231F3D] dark:text-[#F6F1FF] mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF5A4E]" />
                    At Stop / Landmark
                  </label>
                  <div className="w-full h-10 rounded-xl border border-[#DFD2C4] dark:border-[#3B3264] bg-[#F9F5F0] dark:bg-[#181333] px-3 flex items-center gap-2.5 focus-within:border-[#0B8F82] focus-within:ring-2 focus-within:ring-[#0B8F82]/20 transition-all">
                    <Building2 className="w-4 h-4 text-[#6B6585] dark:text-[#A9A2C8] shrink-0 pointer-events-none" />
                    <input
                      type="text"
                      value={stop}
                      onChange={(e) => {
                        setStop(e.target.value);
                        setIsStopOpen(true);
                      }}
                      onFocus={() => setIsStopOpen(true)}
                      placeholder="Search bus stand in Punjab..."
                      className="flex-1 min-w-0 bg-transparent border-0 outline-none p-0 font-semibold text-xs text-[#231F3D] dark:text-[#F6F1FF] placeholder-[#8E87A5] truncate shadow-none ring-0 focus:ring-0 focus:outline-none"
                      style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      {stop && (
                        <button
                          type="button"
                          onClick={() => {
                            setStop('');
                            setIsStopOpen(true);
                          }}
                          className="p-1 rounded-md text-[#8E87A5] hover:text-[#231F3D] dark:hover:text-white cursor-pointer"
                          title="Clear input"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsStopOpen((prev) => !prev)}
                        className="p-1 text-[#8E87A5] hover:text-[#231F3D] dark:hover:text-white cursor-pointer"
                        title="Toggle bus stands list"
                      >
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isStopOpen ? 'rotate-180 text-[#0B8F82]' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {isStopOpen && (
                    <div
                      className="location-dropdown-menu"
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        zIndex: 90,
                        maxHeight: '230px',
                        overflowY: 'auto'
                      }}
                      role="listbox"
                    >
                      <ul className="location-dropdown-list">
                        {filteredStopLocations.length === 0 ? (
                          <div className="location-empty-state">
                            <span>No Punjab bus stand matching "{stop}"</span>
                          </div>
                        ) : (
                          filteredStopLocations.map((loc, idx) => {
                            const formatted = formatLocationDisplay(loc);
                            const isSelected = stop === loc;
                            const isHighlighted = idx === stopHighlightedIndex;
                            return (
                              <li
                                key={`stop-${loc}`}
                                role="option"
                                aria-selected={isSelected}
                                onMouseEnter={() => setStopHighlightedIndex(idx)}
                                onClick={() => {
                                  setStop(loc);
                                  setIsStopOpen(false);
                                }}
                                className={`location-menu-item ${isHighlighted ? 'highlighted' : ''} ${
                                  isSelected ? 'selected' : ''
                                }`}
                              >
                                <Building2 className="location-building-icon" />
                                <span className="location-item-text truncate">
                                  {renderHighlightedLocation(formatted, stop)}
                                </span>
                                <span className="location-item-badge">
                                  {loc.toLowerCase().includes('isbt') ? 'ISBT' : 'Bus Stand'}
                                </span>
                              </li>
                            );
                          })
                        )}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Heading Towards */}
                <div className="relative" ref={directionMenuRef}>
                  <label className="flex items-center gap-1.5 font-bold text-[#231F3D] dark:text-[#F6F1FF] mb-1.5">
                    <Navigation className="w-3.5 h-3.5 text-[#0B8F82] dark:text-[#4DE0CF]" />
                    Heading Towards
                  </label>
                  <div className="w-full h-10 rounded-xl border border-[#DFD2C4] dark:border-[#3B3264] bg-[#F9F5F0] dark:bg-[#181333] px-3 flex items-center gap-2.5 focus-within:border-[#0B8F82] focus-within:ring-2 focus-within:ring-[#0B8F82]/20 transition-all">
                    <Navigation className="w-4 h-4 text-[#0B8F82] dark:text-[#4DE0CF] shrink-0 pointer-events-none" />
                    <input
                      type="text"
                      value={direction}
                      onChange={(e) => {
                        setDirection(e.target.value);
                        setIsDirectionOpen(true);
                      }}
                      onFocus={() => setIsDirectionOpen(true)}
                      placeholder="Search destination in Punjab..."
                      className="flex-1 min-w-0 bg-transparent border-0 outline-none p-0 font-semibold text-xs text-[#231F3D] dark:text-[#F6F1FF] placeholder-[#8E87A5] truncate shadow-none ring-0 focus:ring-0 focus:outline-none"
                      style={{ padding: 0, margin: 0, border: 'none', background: 'transparent' }}
                    />
                    <div className="flex items-center gap-1 shrink-0">
                      {direction && (
                        <button
                          type="button"
                          onClick={() => {
                            setDirection('');
                            setIsDirectionOpen(true);
                          }}
                          className="p-1 rounded-md text-[#8E87A5] hover:text-[#231F3D] dark:hover:text-white cursor-pointer"
                          title="Clear input"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setIsDirectionOpen((prev) => !prev)}
                        className="p-1 text-[#8E87A5] hover:text-[#231F3D] dark:hover:text-white cursor-pointer"
                        title="Toggle destinations list"
                      >
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isDirectionOpen ? 'rotate-180 text-[#0B8F82]' : ''
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {isDirectionOpen && (
                    <div
                      className="location-dropdown-menu"
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 4px)',
                        left: 0,
                        right: 0,
                        zIndex: 90,
                        maxHeight: '230px',
                        overflowY: 'auto'
                      }}
                      role="listbox"
                    >
                      <ul className="location-dropdown-list">
                        {filteredDirectionLocations.length === 0 ? (
                          <div className="location-empty-state">
                            <span>No Punjab destination matching "{direction}"</span>
                          </div>
                        ) : (
                          filteredDirectionLocations.map((loc, idx) => {
                            const cleanLoc = loc.replace(/^towards\s+/i, '');
                            const formatted = `Towards ${formatLocationDisplay(cleanLoc)}`;
                            const isSelected = direction.toLowerCase().includes(cleanLoc.toLowerCase());
                            const isHighlighted = idx === directionHighlightedIndex;
                            const searchPart = direction.replace(/^towards\s+/i, '').trim();
                            return (
                              <li
                                key={`dir-${loc}`}
                                role="option"
                                aria-selected={isSelected}
                                onMouseEnter={() => setDirectionHighlightedIndex(idx)}
                                onClick={() => {
                                  setDirection(`Towards ${cleanLoc}`);
                                  setIsDirectionOpen(false);
                                }}
                                className={`location-menu-item ${isHighlighted ? 'highlighted' : ''} ${
                                  isSelected ? 'selected' : ''
                                }`}
                              >
                                <Navigation className="location-building-icon text-[#0B8F82] dark:text-[#4DE0CF]" />
                                <span className="location-item-text truncate">
                                  {renderHighlightedLocation(formatted, searchPart)}
                                </span>
                                <span className="location-item-badge">
                                  {loc.toLowerCase().includes('isbt') ? 'ISBT' : 'Route'}
                                </span>
                              </li>
                            );
                          })
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Row 3: Crowd Level Radio Selector */}
              <div>
                <label className="flex items-center gap-1.5 font-bold text-xs text-[#231F3D] dark:text-[#F6F1FF] mb-1.5">
                  <Users className="w-3.5 h-3.5 text-[#FFB020]" />
                  Bus / Stop Crowd Level
                </label>
                <div className="grid grid-cols-3 gap-2 sm:gap-2.5 text-xs">
                  {/* Low Rush */}
                  <button
                    type="button"
                    onClick={() => setCrowdLevel('Low')}
                    className={`relative p-2.5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      crowdLevel === 'Low'
                        ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/20 shadow-md shadow-emerald-500/10 scale-[1.02]'
                        : 'border-[#E2D6C7] dark:border-[#332A5A] bg-[#F9F5F0] dark:bg-[#181333] hover:border-emerald-400/50 hover:bg-emerald-50/40 dark:hover:bg-emerald-950/20'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2.5 w-2.5 shrink-0">
                        {crowdLevel === 'Low' && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        )}
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span
                        className={`text-xs font-bold leading-tight ${
                          crowdLevel === 'Low'
                            ? 'text-emerald-700 dark:text-emerald-300'
                            : 'text-[#231F3D] dark:text-[#F6F1FF]'
                        }`}
                      >
                        Low Rush
                      </span>
                    </div>
                    <span
                      className={`text-[10px] mt-1 font-medium ${
                        crowdLevel === 'Low'
                          ? 'text-emerald-600/90 dark:text-emerald-300/80 font-semibold'
                          : 'text-[#8E87A5]'
                      }`}
                    >
                      Seats available
                    </span>
                  </button>

                  {/* Moderate */}
                  <button
                    type="button"
                    onClick={() => setCrowdLevel('Moderate')}
                    className={`relative p-2.5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      crowdLevel === 'Moderate'
                        ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-500/20 shadow-md shadow-amber-500/10 scale-[1.02]'
                        : 'border-[#E2D6C7] dark:border-[#332A5A] bg-[#F9F5F0] dark:bg-[#181333] hover:border-amber-400/50 hover:bg-amber-50/40 dark:hover:bg-amber-950/20'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2.5 w-2.5 shrink-0">
                        {crowdLevel === 'Moderate' && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        )}
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                      </span>
                      <span
                        className={`text-xs font-bold leading-tight ${
                          crowdLevel === 'Moderate'
                            ? 'text-amber-700 dark:text-amber-300'
                            : 'text-[#231F3D] dark:text-[#F6F1FF]'
                        }`}
                      >
                        Moderate
                      </span>
                    </div>
                    <span
                      className={`text-[10px] mt-1 font-medium ${
                        crowdLevel === 'Moderate'
                          ? 'text-amber-600/90 dark:text-amber-300/80 font-semibold'
                          : 'text-[#8E87A5]'
                      }`}
                    >
                      Standing room
                    </span>
                  </button>

                  {/* Heavy Rush */}
                  <button
                    type="button"
                    onClick={() => setCrowdLevel('Heavy Rush')}
                    className={`relative p-2.5 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      crowdLevel === 'Heavy Rush'
                        ? 'border-rose-500 bg-rose-500/10 dark:bg-rose-500/20 shadow-md shadow-rose-500/10 scale-[1.02]'
                        : 'border-[#E2D6C7] dark:border-[#332A5A] bg-[#F9F5F0] dark:bg-[#181333] hover:border-rose-400/50 hover:bg-rose-50/40 dark:hover:bg-rose-950/20'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2.5 w-2.5 shrink-0">
                        {crowdLevel === 'Heavy Rush' && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        )}
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
                      </span>
                      <span
                        className={`text-xs font-bold leading-tight ${
                          crowdLevel === 'Heavy Rush'
                            ? 'text-rose-700 dark:text-rose-300'
                            : 'text-[#231F3D] dark:text-[#F6F1FF]'
                        }`}
                      >
                        Heavy Rush
                      </span>
                    </div>
                    <span
                      className={`text-[10px] mt-1 font-medium ${
                        crowdLevel === 'Heavy Rush'
                          ? 'text-rose-600/90 dark:text-rose-300/80 font-semibold'
                          : 'text-[#8E87A5]'
                      }`}
                    >
                      Packed bus
                    </span>
                  </button>
                </div>
              </div>

              {/* Row 4: Status Note */}
              <div>
                <label className="flex items-center gap-1.5 font-bold text-xs text-[#231F3D] dark:text-[#F6F1FF] mb-1.5">
                  <MessageSquareQuote className="w-3.5 h-3.5 text-[#0B8F82]" />
                  Live Note for Commuters
                </label>
                <input
                  type="text"
                  placeholder="e.g. Just cleared flyover, conductor giving tickets, plenty seats..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full h-10 rounded-xl border border-[#DFD2C4] dark:border-[#3B3264] bg-[#F9F5F0] dark:bg-[#181333] px-3 text-xs font-medium text-[#231F3D] dark:text-[#F6F1FF] placeholder-[#8E87A5] focus:outline-none focus:border-[#0B8F82] focus:ring-2 focus:ring-[#0B8F82]/20 transition-all"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitted || !isFormValid}
                className={`w-full h-11 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98] ${
                  submitted
                    ? 'bg-emerald-600 text-white shadow-emerald-600/25'
                    : isFormValid
                    ? 'bg-gradient-to-r from-[#0B8F82] to-[#08776B] hover:from-[#09776c] hover:to-[#07685D] text-white shadow-[#0B8F82]/25 cursor-pointer'
                    : 'bg-[#E5DACF] dark:bg-[#2C2450] text-[#8E87A5] dark:text-[#7A729A] cursor-not-allowed shadow-none'
                }`}
              >
                {submitted ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span>Sighting Logged to Punjab Feed!</span>
                  </>
                ) : !isFormValid ? (
                  <>
                    <Send className="w-4 h-4 opacity-50" />
                    <span>Choose Fleet, Stop & Destination to Submit</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Live Sighting</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Attractive Trigger Button */
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-[#FF5A4E]/40 hover:border-[#FF5A4E] text-[#FF5A4E] font-extrabold text-sm flex items-center justify-center gap-2 transition-all bg-gradient-to-r from-[#FF5A4E]/5 to-[#FFB020]/5 hover:from-[#FF5A4E]/10 hover:to-[#FFB020]/10 hover:shadow-md group active:scale-[0.99]"
            >
              <div className="w-6 h-6 rounded-full bg-[#FF5A4E] text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Plus className="w-4 h-4 stroke-[3]" />
              </div>
              <span className="truncate">
                <span className="sm:hidden">Spotted a Bus? Share Sighting</span>
                <span className="hidden sm:inline">Spotted a Bus? Share Live Sighting with Commuters</span>
              </span>
            </button>
          )}

          {/* Sighting Feed Header - Exact .head style like the main search results */}
          <div className="head" style={{ marginTop: '24px', marginBottom: '6px' }}>
            <h2 className="disp flex items-center gap-2 text-[var(--ink)]">
              <Radio className="w-5 h-5 text-[#0B8F82] animate-pulse shrink-0" />
              <span>Live Buses Shared by Users</span>
            </h2>
            <span className="count">
              {reports.length} shared {reports.length === 1 ? 'bus' : 'buses'}
            </span>
          </div>

          {/* User-reported disclaimer notice */}
          <p className="text-xs text-[var(--muted)] mb-3.5 flex items-start sm:items-center gap-1.5 leading-relaxed">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
            <span>
              <strong>Note:</strong> We don't guarantee departure times or seat availability as this bus information is uploaded by fellow users.
            </span>
          </p>

          {/* Sighting List Cards - Exact AnyStop card style */}
          <div className="list">
            {reports.length === 0 ? (
              <div className="empty" style={{ padding: '36px 16px', borderRadius: '20px' }}>
                <b>No shared buses yet.</b>
                <br />
                Be the first commuter to spot and share a live bus on this route!
              </div>
            ) : (
              reports.map((rpt, idx) => (
                <SharedBusCard
                  key={rpt.id}
                  report={rpt}
                  index={idx}
                  isOpen={openCardId === rpt.id}
                  onToggleOpen={() => setOpenCardId(prev => prev === rpt.id ? null : rpt.id)}
                  onDelete={onDeleteReport}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpottedFeedModal;
