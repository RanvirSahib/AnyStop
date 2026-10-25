export type BusClass = 'Mini Bus' | 'Ordinary' | 'HVAC Semi-Deluxe' | 'HVAC' | 'Volvo AC';
export type ServiceType = 'E' | 'L'; // 'E' = Express, 'L' = Local/All-stop
export type Ownership = 'G' | 'P' | 'O' | 'gov' | 'pvt';

export interface BusService {
  id: string;
  operator: string;
  busClass: BusClass;
  serviceType: ServiceType;
  ownership: Ownership;
  operatesDaily: boolean; // Confirmed stage carriage daily schedule (operates 365 days a year)
  frequency: string; // 'Daily (Mon–Sun)'
  startMinutes: number; // minutes from midnight (0 - 1439)
  stops: [string, number][]; // [Stop Name, minutes offset from start]
  bookingUrl?: string;
  notes?: string;
}

export interface ComputedTrip extends BusService {
  fromIndex: number;
  toIndex: number;
  depMinutes: number;
  arrMinutes: number;
  durationMinutes: number;
  intermediateStops: number;
  estimatedFare: number;
  maxFare: number; // Maximum price inclusive of GST
  baseFare: number;
  gstAmount: number;
  gstRatePercent: number; // 0% for non-AC stage carriage, 5% for AC/Volvo
  isNextBus: boolean;
  minutesUntilDeparture: number;
  hasDeparted: boolean;
  journeyDate?: string;
}

export type TimeFilter = 'now' | 'all' | 'am' | 'pm' | 'ev';
export type TypeFilter = 'any' | 'E' | 'L';
export type OwnerFilter = 'any' | 'G' | 'P' | 'O' | 'gov' | 'pvt';
export type AcFilter = 'any' | 'ac' | 'non-ac';

export interface FilterState {
  from: string;
  to: string;
  journeyDate: string; // YYYY-MM-DD
  timeFilter: TimeFilter;
  typeFilter: TypeFilter;
  ownerFilter: OwnerFilter;
  acFilter: AcFilter;
  openCardKey: string | null;
}

export interface SpottedReport {
  id: string;
  operator: string;
  stop: string;
  direction: string;
  speedType: 'Express' | 'Local';
  statusNote: string;
  timestamp: number; // ms timestamp
  crowdLevel: 'Low' | 'Moderate' | 'Heavy Rush';
  busClass?: string;
}

export interface InquiryContact {
  id: string;
  title: string;
  location: string;
  phone: string;
  displayPhone: string;
  category: 'depot' | 'inquiry' | 'private';
  timings?: string;
  notes: string;
}
