import React from 'react';
import { Radio, Trash2 } from 'lucide-react';
import { SpottedReport } from '../types/transit';
import { formatMinutesToTime, formatDuration, computeMaximumPrice } from '../utils/transitEngine';
import { OWNL, OWN, BUS_SERVICES } from '../data/transitData';

interface SharedBusCardProps {
  report: SpottedReport;
  index: number;
  isOpen: boolean;
  onToggleOpen: () => void;
  userFrom?: string;
  userTo?: string;
  onDelete?: (id: string) => void;
}

export const SharedBusCard: React.FC<SharedBusCardProps> = React.memo(({
  report,
  index,
  isOpen,
  onToggleOpen,
  userFrom,
  userTo,
  onDelete
}) => {
  // Origin & Destination naming
  const fromName = userFrom ? userFrom.split(' (')[0] : report.stop.split(' (')[0];
  const toRaw = userTo || report.direction.replace(/^towards\s+/i, '').trim();
  const toName = toRaw.split(' (')[0];

  // Operator and ownership
  const operatorName = report.operator || 'PRTC PEPSU';
  const isGov = operatorName.includes('PRTC') || 
                operatorName.includes('Punbus') || 
                operatorName.includes('CTU') || 
                operatorName.includes('Haryana');
  const ownerCode = OWN[operatorName] || (isGov ? 'G' : 'P');
  const [ownerLabel, ownerClass] = OWNL[ownerCode] || [isGov ? 'Government' : 'Private Fleet', isGov ? 'b-g' : 'b-p'];

  const isVolvo = operatorName.includes('Volvo') || operatorName.includes('Orbit');
  const busClass = isVolvo ? 'Volvo AC' : 'Ordinary';
  const isAc = isVolvo;

  // Timestamps and Duration
  const spottedDate = new Date(report.timestamp);
  const spottedMinutes = spottedDate.getHours() * 60 + spottedDate.getMinutes();
  const depTimeFormatted = formatMinutesToTime(spottedMinutes);

  // Calculate estimated travel time: check corridor matches in BUS_SERVICES or default to 95 mins
  let estDuration = 95;
  const matchCorridor = BUS_SERVICES.find(bus => {
    const hasFrom = bus.stops.some(([s]) => s.toLowerCase().includes(fromName.toLowerCase()));
    const hasTo = bus.stops.some(([s]) => s.toLowerCase().includes(toName.toLowerCase()));
    return hasFrom && hasTo;
  });

  if (matchCorridor) {
    const fIdx = matchCorridor.stops.findIndex(([s]) => s.toLowerCase().includes(fromName.toLowerCase()));
    const tIdx = matchCorridor.stops.findIndex(([s]) => s.toLowerCase().includes(toName.toLowerCase()));
    if (fIdx >= 0 && tIdx > fIdx) {
      estDuration = matchCorridor.stops[tIdx][1] - matchCorridor.stops[fIdx][1];
    }
  }

  const arrMinutes = spottedMinutes + estDuration;
  const arrTimeFormatted = formatMinutesToTime(arrMinutes);
  const durationFormatted = formatDuration(estDuration);

  // Relative elapsed time
  const elapsedMins = Math.max(1, Math.round((Date.now() - report.timestamp) / 60000));
  const relativeElapsed = elapsedMins < 60 ? `${elapsedMins}m ago` : `${Math.floor(elapsedMins / 60)}h ${elapsedMins % 60}m ago`;

  const isExpress = report.speedType === 'Express';
  const { maxFare, baseFare, gstAmount, gstRatePercent } = computeMaximumPrice(busClass, estDuration);

  return (
    <article
      className={`card ${isOpen ? 'open' : ''}`}
      style={{ animationDelay: `${index * 55}ms` }}
    >
      <div className="row">
        {/* Trip Departure and Arrival Times (Identical layout to scheduled BusCard) */}
        <div className="trip">
          <div className="t">
            {depTimeFormatted}
            <small>{fromName}</small>
          </div>
          <div className="mid">
            <div className="dur">{durationFormatted}</div>
            <div className="bar"></div>
          </div>
          <div className="t">
            {arrTimeFormatted}
            <small>{toName}</small>
          </div>
        </div>

        {/* Operator, Status, and Badges */}
        <div>
          <div className="op flex items-center gap-2">
            <span>{operatorName}</span>
          </div>
          <div className="meta">
            {busClass} • Spotted {relativeElapsed}
          </div>

          <div style={{ marginTop: '4px' }}>
            {/* Government / Private Badge */}
            <span className={`badge ${ownerClass}`}>{ownerLabel}</span>

            {/* AC / Non-AC Comfort Badge */}
            <span className={`badge ${isAc ? 'b-ac' : 'b-non-ac'}`}>
              {isAc ? '❄️ AC' : '🍃 Non-AC'}
            </span>

            {/* Express / Local Badge */}
            <span className={`badge ${isExpress ? 'b-e' : 'b-l'}`}>
              {isExpress ? '⚡ Express' : '🐢 All-stop'}
            </span>

            {/* Crowd Level Badge */}
            <span
              className={`badge ${
                report.crowdLevel === 'Low'
                  ? 'b-g'
                  : report.crowdLevel === 'Moderate'
                  ? 'b-o'
                  : 'b-e'
              }`}
            >
              {report.crowdLevel === 'Low'
                ? '🟢 Low Rush'
                : report.crowdLevel === 'Moderate'
                ? '🟡 Moderate Rush'
                : '🔴 Heavy Rush'}
            </span>

            {/* Maximum Price incl. GST */}
            <span
              className="badge b-fare"
              title={`Base Fare: ₹${baseFare} + GST (${gstRatePercent}%): ₹${gstAmount}`}
            >
              Max ₹{maxFare} (incl. GST)
            </span>

            {/* Boarding / Booking Mode */}
            <span className="badge b-n">
              {isVolvo ? 'Book online' : 'Pay on board'}
            </span>

            {/* Live Crowd Sighting Badge */}
            <span className="badge b-next">
              📡 Live Shared Bus
            </span>

            {/* Daily Corridor Badge */}
            <span
              className="badge b-daily"
              title="Daily stage carriage corridor: regular daily operations"
            >
              📅 Daily corridor
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="acts flex items-center gap-2">
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(report.id);
              }}
              title="Delete this shared bus"
              className="px-2.5 py-1 rounded-lg border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              <span>Delete</span>
            </button>
          )}
          <button
            type="button"
            onClick={onToggleOpen}
            aria-expanded={isOpen}
          >
            {isOpen ? 'Hide stops' : 'See all stops'}
          </button>
        </div>
      </div>

      {/* Expandable Stops Drawer */}
      <div className="stops">
        <div>
          {/* Commuter Live Sighting Note */}
          <div
            className="stops-notice"
            style={{
              background: 'rgba(11, 143, 130, 0.08)',
              borderColor: 'rgba(11, 143, 130, 0.25)'
            }}
          >
            <div
              className="stops-notice-header"
              style={{ color: 'var(--teal, #0B8F82)' }}
            >
              <Radio className="w-3.5 h-3.5 shrink-0 animate-pulse text-[var(--teal)]" />
              <span>Live Sighting Note from Commuter</span>
            </div>
            <p className="stops-notice-desc" style={{ color: 'var(--ink)' }}>
              "{report.statusNote}"
            </p>
          </div>

          <ol className="stoplist">
            <li className="end" style={{ ['--i' as any]: 0 }}>
              <span className="stop-name">{fromName} (Spotted at Stop)</span>
              <div className="stop-time-wrap">
                <span className="stop-time-val">{depTimeFormatted}</span>
                <span className="stop-time-badge spotted">
                  Spotted
                </span>
              </div>
            </li>
            <li className="end" style={{ ['--i' as any]: 1 }}>
              <span className="stop-name">{toName} (Heading Destination)</span>
              <div className="stop-time-wrap">
                <span className="stop-time-val">~{arrTimeFormatted}</span>
                <span className="stop-time-badge">Expected</span>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </article>
  );
});
