import React, { useState } from 'react';
import {
  X,
  Radio,
  Plus,
  Users,
  Clock,
  Send,
  CheckCircle2,
  MapPin,
  Sparkles,
  Navigation,
  Bus,
  Zap,
  MessageSquareQuote
} from 'lucide-react';
import { SpottedReport } from '../types/transit';

interface SpottedFeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  reports: SpottedReport[];
  onAddReport: (report: Omit<SpottedReport, 'id' | 'timestamp'>) => void;
  currentStop: string;
}

export const SpottedFeedModal: React.FC<SpottedFeedModalProps> = ({
  isOpen,
  onClose,
  reports,
  onAddReport,
  currentStop
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [operator, setOperator] = useState('PRTC PEPSU');
  const [stop, setStop] = useState(currentStop || 'Chandigarh ISBT 43');
  const [direction, setDirection] = useState('Towards Ludhiana');
  const [speedType, setSpeedType] = useState<'Express' | 'Local'>('Express');
  const [crowdLevel, setCrowdLevel] = useState<'Low' | 'Moderate' | 'Heavy Rush'>('Moderate');
  const [statusNote, setStatusNote] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddReport({
      operator,
      stop: stop.trim() || currentStop || 'Punjab Highway Corridor',
      direction: direction.trim() || 'On Route',
      speedType,
      crowdLevel,
      statusNote: statusNote.trim() || 'Bus spotted running on corridor'
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowAddForm(false);
      setStatusNote('');
    }, 1200);
  };

  const formatElapsed = (timestamp: number) => {
    const mins = Math.max(1, Math.floor((Date.now() - timestamp) / 60000));
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m ago`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-[#1E193C] rounded-[28px] shadow-2xl border border-[#E8DCCE] dark:border-[#38315E] overflow-hidden flex flex-col max-h-[90vh] transition-all"
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
                <div>
                  <label className="flex items-center gap-1.5 font-bold text-[#231F3D] dark:text-[#F6F1FF] mb-1.5">
                    <Bus className="w-3.5 h-3.5 text-[#0B8F82] dark:text-[#4DE0CF]" />
                    Operator Fleet
                  </label>
                  <select
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    className="w-full h-10 rounded-xl border border-[#DFD2C4] dark:border-[#3B3264] bg-[#F9F5F0] dark:bg-[#181333] px-3 font-semibold text-[#231F3D] dark:text-[#F6F1FF] focus:outline-none focus:border-[#0B8F82] focus:ring-2 focus:ring-[#0B8F82]/20 transition-all"
                  >
                    <option value="PRTC PEPSU">🏛 PRTC PEPSU (Govt)</option>
                    <option value="Punbus">🏛 Punbus / Punjab Roadways (Govt)</option>
                    <option value="Orbit Aviators">⭐ Orbit Aviators (Volvo AC)</option>
                    <option value="Libra Bus">🚍 Libra Bus Service</option>
                    <option value="New Deep">🚍 New Deep Transport</option>
                    <option value="Jujhar">🚍 Jujhar Bus Service</option>
                    <option value="CTU">🏛 CTU Chandigarh</option>
                    <option value="Haryana Roadways">🏛 Haryana Roadways</option>
                    <option value="Local Mini Bus">🚐 Local Mini Bus</option>
                  </select>
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
                <div>
                  <label className="flex items-center gap-1.5 font-bold text-[#231F3D] dark:text-[#F6F1FF] mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF5A4E]" />
                    At Stop / Landmark
                  </label>
                  <input
                    type="text"
                    value={stop}
                    onChange={(e) => setStop(e.target.value)}
                    placeholder="e.g. Chandigarh ISBT 43, Kharar, Beas"
                    className="w-full h-10 rounded-xl border border-[#DFD2C4] dark:border-[#3B3264] bg-[#F9F5F0] dark:bg-[#181333] px-3 font-semibold text-[#231F3D] dark:text-[#F6F1FF] placeholder-[#8E87A5] focus:outline-none focus:border-[#0B8F82] focus:ring-2 focus:ring-[#0B8F82]/20 transition-all"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 font-bold text-[#231F3D] dark:text-[#F6F1FF] mb-1.5">
                    <Navigation className="w-3.5 h-3.5 text-[#0B8F82] dark:text-[#4DE0CF]" />
                    Heading Towards
                  </label>
                  <input
                    type="text"
                    value={direction}
                    onChange={(e) => setDirection(e.target.value)}
                    placeholder="e.g. Towards Ludhiana, Amritsar, Bathinda"
                    className="w-full h-10 rounded-xl border border-[#DFD2C4] dark:border-[#3B3264] bg-[#F9F5F0] dark:bg-[#181333] px-3 font-semibold text-[#231F3D] dark:text-[#F6F1FF] placeholder-[#8E87A5] focus:outline-none focus:border-[#0B8F82] focus:ring-2 focus:ring-[#0B8F82]/20 transition-all"
                  />
                </div>
              </div>

              {/* Row 3: Crowd Level Radio Selector */}
              <div>
                <label className="flex items-center gap-1.5 font-bold text-xs text-[#231F3D] dark:text-[#F6F1FF] mb-1.5">
                  <Users className="w-3.5 h-3.5 text-[#FFB020]" />
                  Bus / Stop Crowd Level
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setCrowdLevel('Low')}
                    className={`p-2 rounded-xl border text-center font-bold transition-all ${
                      crowdLevel === 'Low'
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20'
                        : 'border-[#DFD2C4] dark:border-[#382F62] bg-[#F9F5F0] dark:bg-[#181333] text-[#6B6585] dark:text-[#A9A2C8]'
                    }`}
                  >
                    🟢 Low Rush
                    <span className="block text-[10px] font-normal opacity-80">Seats available</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCrowdLevel('Moderate')}
                    className={`p-2 rounded-xl border text-center font-bold transition-all ${
                      crowdLevel === 'Moderate'
                        ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-500 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/20'
                        : 'border-[#DFD2C4] dark:border-[#382F62] bg-[#F9F5F0] dark:bg-[#181333] text-[#6B6585] dark:text-[#A9A2C8]'
                    }`}
                  >
                    🟡 Moderate
                    <span className="block text-[10px] font-normal opacity-80">Standing room</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCrowdLevel('Heavy Rush')}
                    className={`p-2 rounded-xl border text-center font-bold transition-all ${
                      crowdLevel === 'Heavy Rush'
                        ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-500 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/20'
                        : 'border-[#DFD2C4] dark:border-[#382F62] bg-[#F9F5F0] dark:bg-[#181333] text-[#6B6585] dark:text-[#A9A2C8]'
                    }`}
                  >
                    🔴 Heavy Rush
                    <span className="block text-[10px] font-normal opacity-80">Packed bus</span>
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
                disabled={submitted}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-[#0B8F82] to-[#08776B] hover:from-[#09776c] hover:to-[#07685D] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#0B8F82]/25 transition-all active:scale-[0.98]"
              >
                {submitted ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span>Sighting Logged to Punjab Feed!</span>
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

          {/* Sighting Feed Header */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs font-bold text-[#6B6585] dark:text-[#A9A2C8] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#0B8F82]" />
              Recent Sightings Across Punjab ({reports.length})
            </span>
            <span className="text-[11px] text-[#8E87A5]">Auto-updates</span>
          </div>

          {/* Sighting List Cards */}
          <div className="space-y-3">
            {reports.map((rpt) => {
              const isExpress = rpt.speedType === 'Express';
              const crowdColor =
                rpt.crowdLevel === 'Low'
                  ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/25'
                  : rpt.crowdLevel === 'Moderate'
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/25'
                  : 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/25';

              return (
                <div
                  key={rpt.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#211B42] border border-[#E4D5C7] dark:border-[#383060] shadow-sm hover:shadow-md hover:border-[#0B8F82]/40 transition-all space-y-2.5"
                >
                  {/* Card Header: Operator + Speed + Crowd + Time */}
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-base text-[#231F3D] dark:text-[#F6F1FF]">
                        {rpt.operator}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold border ${
                          isExpress
                            ? 'bg-[#D8F5F0] text-[#077066] border-[#0B8F82]/30 dark:bg-[#0E3B3A] dark:text-[#4DE0CF]'
                            : 'bg-[#FFF1D6] text-[#8C5500] border-[#FFB020]/35 dark:bg-[#3D2F0A] dark:text-[#FFB020]'
                        }`}
                      >
                        {isExpress ? '⚡ Express' : '🐢 All-stop'}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${crowdColor}`}>
                        {rpt.crowdLevel}
                      </span>
                    </div>

                    <span className="text-[11px] font-semibold text-[#6B6585] dark:text-[#A9A2C8] flex items-center gap-1 bg-[#F4ECE3] dark:bg-[#181333] px-2 py-0.5 rounded-md">
                      <Clock className="w-3 h-3 text-[#FF5A4E]" />
                      {formatElapsed(rpt.timestamp)}
                    </span>
                  </div>

                  {/* Location & Direction */}
                  <div className="flex items-center gap-1.5 text-xs text-[#6B6585] dark:text-[#A9A2C8]">
                    <MapPin className="w-3.5 h-3.5 text-[#FF5A4E] shrink-0" />
                    <span className="font-bold text-[#231F3D] dark:text-[#F6F1FF]">
                      {rpt.stop}
                    </span>
                    <span className="opacity-40">•</span>
                    <span className="flex items-center gap-1 text-[#0B8F82] dark:text-[#4DE0CF] font-semibold">
                      <Navigation className="w-3 h-3" />
                      {rpt.direction}
                    </span>
                  </div>

                  {/* Quote Status Box */}
                  <div className="relative pl-7 pr-3 py-2.5 rounded-xl bg-[#F8F2EB] dark:bg-[#181333] border border-[#E8DDD1] dark:border-[#322A5A] text-xs font-medium text-[#231F3D] dark:text-[#F6F1FF] leading-relaxed">
                    <MessageSquareQuote className="w-4 h-4 text-[#FF5A4E] absolute left-2 top-2.5 opacity-80" />
                    "{rpt.statusNote}"
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpottedFeedModal;
