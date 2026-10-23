import { BusService, ComputedTrip, FilterState } from '../types/transit';
import { CLASS_RATES, OWN } from '../data/transitData';

/**
 * Format minutes from midnight (0..1439) into 12-hour "hh:mm AM/PM" string
 */
export function formatMinutesToTime(minutes: number): string {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const hours24 = Math.floor(normalized / 60);
  const mins = normalized % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  const paddedMins = mins.toString().padStart(2, '0');
  return `${hours12}:${paddedMins} ${period}`;
}

/**
 * Format duration in minutes into "Xh Ym" or "Ym"
 */
export function formatDuration(mins: number): string {
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  if (hours > 0) {
    return remainingMins > 0 ? `${hours}h ${remainingMins}m` : `${hours}h`;
  }
  return `${remainingMins}m`;
}

/**
 * Get current time in minutes from midnight (0..1439)
 */
export function getCurrentMinutes(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

/**
 * Compute valid trips between two stops and apply active filters
 */
export function getMatchingTrips(
  buses: BusService[],
  filters: FilterState,
  currentMinutes: number = getCurrentMinutes()
): ComputedTrip[] {
  const { from, to, timeFilter, typeFilter, ownerFilter } = filters;

  if (!from || !to || from === to) {
    return [];
  }

  // 1. Find matching trips that stop at both 'from' and 'to', with 'to' after 'from'
  const matched: ComputedTrip[] = [];

  for (const bus of buses) {
    const fromIndex = bus.stops.findIndex(([stopName]) => stopName === from);
    const toIndex = bus.stops.findIndex(([stopName]) => stopName === to);

    if (fromIndex >= 0 && toIndex > fromIndex) {
      const depMinutes = bus.startMinutes + bus.stops[fromIndex][1];
      const arrMinutes = bus.startMinutes + bus.stops[toIndex][1];
      const durationMinutes = arrMinutes - depMinutes;
      const intermediateStops = toIndex - fromIndex - 1;
      
      const rate = CLASS_RATES[bus.busClass] || 0.9;
      const rawFare = rate * durationMinutes;
      const estimatedFare = Math.max(10, Math.round(rawFare / 5) * 5);

      const diff = depMinutes - currentMinutes;
      const hasDeparted = diff < 0;

      matched.push({
        ...bus,
        fromIndex,
        toIndex,
        depMinutes,
        arrMinutes,
        durationMinutes,
        intermediateStops,
        estimatedFare,
        isNextBus: false,
        minutesUntilDeparture: diff,
        hasDeparted
      });
    }
  }

  // 2. Apply filters
  let filtered = matched;

  // Filter by service type (Express vs Local)
  if (typeFilter !== 'any') {
    filtered = filtered.filter(trip => trip.serviceType === typeFilter);
  }

  // Filter by ownership (Government vs Private vs Other)
  if (ownerFilter !== 'any') {
    filtered = filtered.filter(trip => {
      const o = OWN[trip.operator] || (trip.ownership === 'gov' ? 'G' : 'P');
      return o === ownerFilter;
    });
  }

  // Filter by time window
  if (timeFilter === 'now') {
    // Next 60 minutes
    filtered = filtered.filter(trip => {
      const diff = trip.depMinutes - currentMinutes;
      return diff >= 0 && diff <= 60;
    });
  } else if (timeFilter === 'am') {
    // 06:00 to 12:00 (360 to 720 mins)
    filtered = filtered.filter(trip => trip.depMinutes >= 360 && trip.depMinutes < 720);
  } else if (timeFilter === 'pm') {
    // 12:00 to 17:00 (720 to 1020 mins)
    filtered = filtered.filter(trip => trip.depMinutes >= 720 && trip.depMinutes < 1020);
  } else if (timeFilter === 'ev') {
    // 17:00 to 24:00 (1020 to 1440 mins)
    filtered = filtered.filter(trip => trip.depMinutes >= 1020 && trip.depMinutes <= 1440);
  }

  // 3. Sort by upcoming departure first
  filtered.sort((a, b) => {
    const scoreA = a.depMinutes < currentMinutes ? a.depMinutes + 1440 : a.depMinutes;
    const scoreB = b.depMinutes < currentMinutes ? b.depMinutes + 1440 : b.depMinutes;
    return scoreA - scoreB;
  });

  // 4. Mark the very first upcoming departure as next bus
  let nextBusAssigned = false;
  for (const trip of filtered) {
    if (!trip.hasDeparted && !nextBusAssigned) {
      trip.isNextBus = true;
      nextBusAssigned = true;
    }
  }

  return filtered;
}
