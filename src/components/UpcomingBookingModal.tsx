import React, { useState, useEffect } from 'react';
import { X, Sparkles, Ticket, ArrowRight, CheckCircle2, ShieldCheck, Calendar } from 'lucide-react';
import { ComputedTrip } from '../types/transit';
import { formatMinutesToTime, formatJourneyDate } from '../utils/transitEngine';

interface UpcomingBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: ComputedTrip | null;
  from: string;
  to: string;
  journeyDate?: string;
}

export const UpcomingBookingModal: React.FC<UpcomingBookingModalProps> = ({
  isOpen,
  onClose,
  trip,
  from,
  to,
  journeyDate
}) => {
  const [notified, setNotified] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState('');

  // Handle escape key to dismiss modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !trip) return null;

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) return;
    setNotified(true);
    setTimeout(() => {
      setTimeout(() => {
        onClose();
        setNotified(false);
        setEmailOrPhone('');
      }, 2000);
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fadeIn overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[360px] sm:max-w-md overflow-hidden rounded-2xl bg-[var(--surface)] text-[var(--ink)] shadow-2xl border border-[var(--line)] animate-scaleUp my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gradient Banner */}
        <div className="relative bg-gradient-to-r from-[#FF5A4E] via-[#FF8A7A] to-[#FFB020] px-4 py-4 sm:p-5 text-white text-center">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 rounded-full p-1.5 bg-black/20 hover:bg-black/35 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-white/20 backdrop-blur-md mb-2 shadow-inner">
            <Ticket className="w-6 h-6 text-white" />
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/25 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3 h-3" />
            Upcoming Feature
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white mb-1 leading-tight">
            Online Booking Coming Soon!
          </h2>

          <p className="text-white/90 text-xs sm:text-sm max-w-xs mx-auto leading-relaxed">
            This feature is coming as soon as possible. Direct in-app seat reservation is currently under active development.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-3.5 sm:p-4 space-y-3">
          {/* Selected Bus Info Card */}
          <div className="rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-[var(--muted)] mb-1.5">
              <span>SELECTED BUS</span>
              <span className="text-[var(--coral)] font-bold truncate max-w-[140px] text-right">
                {trip.operator}
              </span>
            </div>

            <div className="flex items-center justify-between gap-1.5">
              <div className="min-w-0 flex-1">
                <div className="font-extrabold text-base sm:text-lg text-[var(--ink)] tracking-tight">
                  {formatMinutesToTime(trip.depMinutes)}
                </div>
                <div className="text-[11px] text-[var(--muted)] truncate font-medium">
                  {from.split(' (')[0]}
                </div>
              </div>

              {/* Responsive connecting arrow divider */}
              <div className="flex items-center justify-center px-1 shrink-0 text-[var(--coral)]">
                <div className="w-4 sm:w-7 h-[2px] bg-gradient-to-r from-[var(--coral)] to-[var(--sun)] rounded-full"></div>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </div>

              <div className="min-w-0 flex-1 text-right">
                <div className="font-extrabold text-base sm:text-lg text-[var(--ink)] tracking-tight">
                  {formatMinutesToTime(trip.arrMinutes)}
                </div>
                <div className="text-[11px] text-[var(--muted)] truncate font-medium">
                  {to.split(' (')[0]}
                </div>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-[var(--line)]/60 flex flex-col gap-1 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-[var(--muted)]">Service: <b className="text-[var(--ink)]">{trip.busClass}</b></span>
                <span className="text-[var(--muted)]">Max Price: <b className="text-emerald-600 dark:text-emerald-400 font-bold">₹{trip.maxFare} (incl. GST)</b></span>
              </div>
              {journeyDate && (
                <div className="flex items-center justify-between text-[10.5px]">
                  <span className="text-[var(--muted)] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[var(--coral)]" />
                    <span>Travel Date:</span>
                  </span>
                  <b className="text-[var(--ink)] font-bold">{formatJourneyDate(journeyDate)}</b>
                </div>
              )}
              <div className="flex items-center justify-between text-[10px] text-[var(--muted)]">
                <span>Statutory Fare Breakdown</span>
                <span>Base: ₹{trip.baseFare} {trip.gstRatePercent > 0 ? `+ GST (${trip.gstRatePercent}%): ₹${trip.gstAmount}` : '(0% GST exempt)'}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-[var(--muted)] pt-0.5 border-t border-[var(--line)]/40">
                <span>Operating Schedule</span>
                <span className="font-semibold text-sky-700 dark:text-sky-300">📅 Runs Everyday (Mon–Sun • Same Daily Timetable)</span>
              </div>
            </div>
          </div>

          {/* Current Boarding Instructions */}
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 p-2.5 sm:p-3 flex gap-2.5 text-[11.5px] leading-snug text-[var(--ink)]">
            <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <b className="font-bold block text-amber-600 dark:text-amber-400 mb-0.5">
                How to board this bus right now:
              </b>
              You can board directly at the stop and purchase your physical ticket on-board with the conductor (cash or UPI accepted on most Punjab routes).
            </div>
          </div>

          {/* Notify Me Form */}
          {!notified ? (
            <form onSubmit={handleNotifySubmit} className="space-y-1.5">
              <label htmlFor="notifyInput" className="block text-[11px] font-bold text-[var(--muted)]">
                Get notified when online reservations launch:
              </label>
              <div className="flex gap-2">
                <input
                  id="notifyInput"
                  type="text"
                  maxLength={80}
                  placeholder="Enter phone or email"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="flex-1 h-9 px-3 text-xs rounded-xl border border-[var(--line)] bg-[var(--bg)] focus:outline-none focus:border-[var(--coral)] transition-colors"
                />
                <button
                  type="submit"
                  className="h-9 px-3.5 rounded-xl bg-[var(--ink)] text-[var(--bg)] font-bold text-xs hover:opacity-90 transition-opacity whitespace-nowrap shrink-0"
                >
                  Notify Me
                </button>
              </div>
            </form>
          ) : (
            <div className="p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-xs font-bold flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Thank you! We'll alert you as soon as booking launches!
            </div>
          )}

          {/* Dismiss button */}
          <button
            type="button"
            onClick={onClose}
            className="w-full h-10 rounded-xl bg-[var(--coral)] hover:bg-[var(--coral2)] text-white font-bold text-xs sm:text-sm shadow-md transition-colors active:scale-[0.99]"
          >
            Understood, Show Timetable
          </button>
        </div>
      </div>
    </div>
  );
};
