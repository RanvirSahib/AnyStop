import React from 'react';
import { ComputedTrip } from '../types/transit';
import { formatMinutesToTime, formatDuration, getTodayDateString } from '../utils/transitEngine';
import { OWNL, OWN } from '../data/transitData';

interface BusCardProps {
  trip: ComputedTrip;
  userFrom: string;
  userTo: string;
  isOpen: boolean;
  onToggleOpen: () => void;
  onBookOnline?: (trip: ComputedTrip) => void;
  index: number;
}

export const BusCard: React.FC<BusCardProps> = React.memo(({
  trip,
  userFrom,
  userTo,
  isOpen,
  onToggleOpen,
  onBookOnline,
  index
}) => {
  const isVolvo = trip.busClass === 'Volvo AC';
  const isAc = trip.busClass === 'HVAC' || trip.busClass === 'HVAC Semi-Deluxe' || trip.busClass === 'Volvo AC';
  const ownerCode = OWN[trip.operator] || (trip.ownership === 'gov' ? 'G' : 'P');
  const [ownerLabel, ownerClass] = OWNL[ownerCode] || ['Government', 'b-g'];
  const isToday = !trip.journeyDate || trip.journeyDate === getTodayDateString();

  // Stoppage list items with defensive fallbacks
  const fromName = (userFrom || '').split(' (')[0] || 'Origin';
  const toName = (userTo || '').split(' (')[0] || 'Destination';

  return (
    <article
      className={`card ${trip.hasDeparted ? 'gone' : ''} ${isOpen ? 'open' : ''}`}
      style={{ animationDelay: `${Math.min(index * 25, 200)}ms` }}
    >
      <div className="row">
        {/* Trip Departure and Arrival Times */}
        <div className="trip">
          <div className="t">
            {formatMinutesToTime(trip.depMinutes)}
            <small>{fromName}</small>
          </div>
          <div className="mid">
            <div className="dur">{formatDuration(trip.durationMinutes)}</div>
            <div className="bar"></div>
          </div>
          <div className="t">
            {formatMinutesToTime(trip.arrMinutes)}
            <small>{toName}</small>
          </div>
        </div>

        {/* Operator, Status, and Badges */}
        <div>
          <div className="op">{trip.operator}</div>
          <div className="meta">
            {trip.busClass}
            {!trip.hasDeparted && isToday && trip.minutesUntilDeparture <= 90
              ? ` • leaves in ${trip.minutesUntilDeparture} min`
              : ''}
          </div>

          <div style={{ marginTop: '4px' }}>
            {/* Government / Private Badge */}
            <span className={`badge ${ownerClass}`}>{ownerLabel}</span>

            {/* AC / Non-AC Comfort Badge */}
            <span className={`badge ${isAc ? 'b-ac' : 'b-non-ac'}`}>
              {isAc ? '❄️ AC' : '🍃 Non-AC'}
            </span>

            {/* Express / Local Badge */}
            <span className={`badge ${trip.serviceType === 'E' ? 'b-e' : 'b-l'}`}>
              {trip.serviceType === 'E' ? '⚡ Express' : '🐢 All-stop'}
            </span>

            {/* Intermediate Stops */}
            <span className="badge b-n">
              {trip.intermediateStops === 0
                ? 'Non-stop'
                : `${trip.intermediateStops} stop${trip.intermediateStops === 1 ? '' : 's'} between`}
            </span>

            {/* Maximum Price incl. GST */}
            <span
              className="badge b-fare"
              title={`Base Fare: ₹${trip.baseFare} + GST (${trip.gstRatePercent}%): ₹${trip.gstAmount}`}
            >
              Max ₹{trip.maxFare} (incl. GST)
            </span>

            {/* Daily Service Badge */}
            <span
              className="badge b-daily"
              title="Confirmed regular stage carriage timetable: operates everyday (Mon–Sun, 365 days a year) with the same departure timings"
            >
              📅 Daily service
            </span>

            {/* Boarding / Booking Mode */}
            <span className="badge b-n">
              {isVolvo ? 'Book online' : 'Pay on board'}
            </span>

            {/* Next Bus Blink Badge */}
            {trip.isNextBus && <span className="badge b-next">Next bus</span>}

            {/* Departed / Tomorrow Badge */}
            {trip.hasDeparted && (
              <span
                className="badge b-tomorrow"
                title="Runs everyday with the same timetable. Next departure tomorrow."
              >
                {isToday ? `Tomorrow at ${formatMinutesToTime(trip.depMinutes)}` : 'Departed'}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="acts">
          <button
            type="button"
            onClick={onToggleOpen}
            aria-expanded={isOpen}
          >
            {isOpen ? 'Hide stops' : 'See all stops'}
          </button>

          {isVolvo && (
            <button
              type="button"
              className="book"
              onClick={() => onBookOnline?.(trip)}
              title="Reserve seats online"
            >
              Book online
            </button>
          )}
        </div>
      </div>

      {/* Expandable Stops Drawer */}
      <div className="stops">
        <div>
          <div className="px-3 pt-2 pb-1.5 mb-2 rounded-lg bg-[var(--line)]/30 border border-[var(--line)]/50 text-[11px] text-[var(--muted)] flex items-center justify-between flex-wrap gap-1">
            <span className="font-semibold text-[var(--ink)]">📅 Daily Fixed Timetable:</span>
            <span>Runs everyday (Mon–Sun) at identical scheduled times</span>
          </div>
          <ol className="stoplist">
            {trip.stops.map(([stopName, offsetMins], x) => {
              const isEnd = x === trip.fromIndex || x === trip.toIndex;
              const isIn = x > trip.fromIndex && x < trip.toIndex;
              const stopTime = formatMinutesToTime(trip.startMinutes + offsetMins);

              return (
                <li
                  key={x}
                  style={{ ['--i' as any]: x }}
                  className={isEnd ? 'end' : isIn ? 'in' : ''}
                >
                  <span className="stop-name">{stopName}</span>
                  <div className="stop-time-wrap">
                    <span className="stop-time-val">~{stopTime}</span>
                    <span className="stop-time-badge">Expected</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </article>
  );
});
