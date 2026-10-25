import { BusService, ComputedTrip, FilterState } from '../types/transit';
import { OWN } from '../data/transitData';

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
 * Return today's date formatted as YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a YYYY-MM-DD date into friendly text like "Today • Sun, 25 Oct" or "Sun, 25 Oct 2026"
 */
export function formatJourneyDate(dateStr: string): string {
  if (!dateStr) return 'Today';
  const today = getTodayDateString();
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  
  const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  const dayName = d.toLocaleDateString('en-IN', { weekday: 'short' });
  const dayNum = d.getDate();
  const monthName = d.toLocaleDateString('en-IN', { month: 'short' });
  const year = d.getFullYear();

  if (dateStr === today) {
    return `Today • ${dayName}, ${dayNum} ${monthName}`;
  }

  // Check tomorrow
  const tom = new Date();
  tom.setDate(tom.getDate() + 1);
  const tomYear = tom.getFullYear();
  const tomMonth = String(tom.getMonth() + 1).padStart(2, '0');
  const tomDay = String(tom.getDate()).padStart(2, '0');
  const tomorrowStr = `${tomYear}-${tomMonth}-${tomDay}`;

  if (dateStr === tomorrowStr) {
    return `Tomorrow • ${dayName}, ${dayNum} ${monthName}`;
  }

  return `${dayName}, ${dayNum} ${monthName} ${year}`;
}

/**
 * Gazetted Base Passenger Rates per minute/km for Punjab stage carriages
 */
export const CLASS_BASE_RATES: Record<string, number> = {
  "Mini Bus": 1.20,
  "Ordinary": 1.35,
  "HVAC Semi-Deluxe": 1.65,
  "HVAC": 1.95,
  "Volvo AC": 3.15
};

/**
 * Statutory GST rates: 0% for non-AC stage carriages, 5% for air-conditioned buses
 */
export const CLASS_GST_RATES: Record<string, number> = {
  "Mini Bus": 0.00,
  "Ordinary": 0.00,
  "HVAC Semi-Deluxe": 0.05,
  "HVAC": 0.05,
  "Volvo AC": 0.05
};

/**
 * Compute the statutory maximum price inclusive of GST
 */
export function computeMaximumPrice(busClass: string, durationMinutes: number) {
  const baseRate = CLASS_BASE_RATES[busClass] || 1.35;
  const gstRate = CLASS_GST_RATES[busClass] || 0.00;

  // Minimum stage ticketing floor (₹15 for Ordinary/Mini, ₹30 for HVAC, ₹50 for Volvo)
  const floor = busClass === 'Volvo AC' ? 50 : busClass.includes('HVAC') ? 30 : 15;

  const rawBase = Math.max(floor, baseRate * durationMinutes);
  const baseFare = Math.round(rawBase);
  const gstAmount = Math.round(baseFare * gstRate);
  const totalWithGst = baseFare + gstAmount;

  // Round to nearest standard ₹5 ticketing increment
  const maxFare = Math.max(floor, Math.round(totalWithGst / 5) * 5);

  return {
    baseFare,
    gstAmount,
    gstRatePercent: Math.round(gstRate * 100),
    maxFare
  };
}

/**
 * Compute valid trips between two stops and apply active filters
 */
export function getMatchingTrips(
  buses: BusService[],
  filters: FilterState,
  currentMinutes: number = getCurrentMinutes()
): ComputedTrip[] {
  const { from, to, journeyDate, timeFilter, typeFilter, ownerFilter, acFilter } = filters;

  if (!from || !to || from === to) {
    return [];
  }

  const todayStr = getTodayDateString();
  const activeDate = journeyDate || todayStr;
  const isToday = activeDate === todayStr;
  const isFuture = activeDate > todayStr;
  const isPast = activeDate < todayStr;

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
      
      const { baseFare, gstAmount, gstRatePercent, maxFare } = computeMaximumPrice(bus.busClass, durationMinutes);

      const diff = depMinutes - currentMinutes;
      let hasDeparted = false;
      let minutesUntilDeparture = diff;

      if (isToday) {
        hasDeparted = diff < 0;
        minutesUntilDeparture = diff;
      } else if (isFuture) {
        hasDeparted = false;
        minutesUntilDeparture = depMinutes;
      } else if (isPast) {
        hasDeparted = true;
        minutesUntilDeparture = -1;
      }

      matched.push({
        ...bus,
        fromIndex,
        toIndex,
        depMinutes,
        arrMinutes,
        durationMinutes,
        intermediateStops,
        estimatedFare: maxFare,
        maxFare,
        baseFare,
        gstAmount,
        gstRatePercent,
        isNextBus: false,
        minutesUntilDeparture,
        hasDeparted,
        journeyDate: activeDate
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

  // Filter by AC vs Non-AC
  if (acFilter && acFilter !== 'any') {
    const isAcClass = (cls: string) => cls === 'HVAC' || cls === 'HVAC Semi-Deluxe' || cls === 'Volvo AC';
    if (acFilter === 'ac') {
      filtered = filtered.filter(trip => isAcClass(trip.busClass));
    } else if (acFilter === 'non-ac') {
      filtered = filtered.filter(trip => !isAcClass(trip.busClass));
    }
  }

  // Filter by time window
  if (timeFilter === 'now') {
    if (isToday) {
      filtered = filtered.filter(trip => {
        const diff = trip.depMinutes - currentMinutes;
        return diff >= 0 && diff <= 60;
      });
    } else {
      // For future dates, show morning first departures
      filtered = filtered.filter(trip => trip.depMinutes < 420);
    }
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
    if (isFuture || isPast) {
      return a.depMinutes - b.depMinutes;
    }
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
