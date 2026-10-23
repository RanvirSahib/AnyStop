import { BusService, InquiryContact } from '../types/transit';

/**
 * All-Punjab transit routes across Majha, Doaba, and Malwa regions
 * Format: [Stop Name, minutes offset from route start]
 */
export const ROUTES: Record<string, [string, number][]> = {
  // 1. NH-5 Express Corridor (Chandigarh ⇄ Ludhiana via flyovers)
  E: [
    ["Chandigarh ISBT 43", 0],
    ["Kharar", 20],
    ["Gharuan (CU Gate 2)", 32],
    ["Morinda", 48],
    ["Samrala", 68],
    ["Sherpur Chowk", 86],
    ["Ludhiana Bus Stand", 98]
  ],

  // 2. NH-5 Local / All-Stop Corridor (Chandigarh ⇄ Ludhiana via interior bypasses)
  L: [
    ["Chandigarh ISBT 43", 0],
    ["Kharar", 25],
    ["Gharuan (CU Gate 2)", 40],
    ["Morinda", 60],
    ["Khamano", 85],
    ["Samrala", 105],
    ["Kohara", 135],
    ["Cheema Chowk", 155],
    ["Ludhiana Bus Stand", 170]
  ],

  // 3. Chandigarh to Jalandhar via NH-5 & NH-44
  J: [
    ["Chandigarh ISBT 43", 0],
    ["Kharar", 20],
    ["Gharuan (CU Gate 2)", 32],
    ["Morinda", 48],
    ["Samrala", 68],
    ["Ludhiana Bus Stand", 100],
    ["Phillaur", 130],
    ["Phagwara", 145],
    ["Jalandhar Central Bus Stand", 175]
  ],

  // 4. North-South Punjab Spine (Chandigarh ⇄ Ludhiana ⇄ Jalandhar ⇄ Amritsar)
  CHD_ASR: [
    ["Chandigarh ISBT 43", 0],
    ["Kharar", 20],
    ["Gharuan (CU Gate 2)", 32],
    ["Morinda", 48],
    ["Samrala", 68],
    ["Ludhiana Bus Stand", 100],
    ["Phillaur", 130],
    ["Phagwara", 145],
    ["Jalandhar Central Bus Stand", 175],
    ["Kartarpur", 195],
    ["Beas", 215],
    ["Jandiala Guru", 235],
    ["Amritsar ISBT", 255]
  ],

  // 5. Grand Trunk Road Corridor (Amritsar ⇄ Jalandhar ⇄ Ludhiana ⇄ Ambala)
  GT_CORRIDOR: [
    ["Amritsar ISBT", 0],
    ["Beas", 40],
    ["Jalandhar Central Bus Stand", 75],
    ["Phagwara", 95],
    ["Phillaur", 115],
    ["Ludhiana Bus Stand", 145],
    ["Sahnewal", 165],
    ["Khanna Bus Stand", 185],
    ["Sirhind (Fatehgarh Sahib)", 205],
    ["Rajpura Bypass", 230],
    ["Ambala Cantt", 260]
  ],

  // 6. Malwa South Corridor - NH-7 (Chandigarh ⇄ Patiala ⇄ Sangrur ⇄ Barnala ⇄ Bathinda)
  MALWA_NH7: [
    ["Chandigarh ISBT 43", 0],
    ["Zirakpur", 18],
    ["Rajpura Bypass", 40],
    ["Patiala Central Bus Stand", 65],
    ["Nabha Bypass", 95],
    ["Bhawanigarh", 115],
    ["Sangrur Bus Stand", 135],
    ["Dhanaula", 155],
    ["Barnala Bus Stand", 175],
    ["Tapa", 195],
    ["Rampura Phul", 215],
    ["Bathinda Central Bus Stand", 245]
  ],

  // 7. Western Malwa Corridor (Ludhiana ⇄ Moga ⇄ Firozpur)
  WEST_PUNJAB: [
    ["Ludhiana Bus Stand", 0],
    ["Mullanpur Dakha", 22],
    ["Jagraon Bus Stand", 45],
    ["Ajitwal", 65],
    ["Moga Central Bus Stand", 85],
    ["Talwandi Bhai", 110],
    ["Firozpur Cantt Bus Stand", 140]
  ],

  // 8. Majha to South Malwa Highway - NH-54 (Amritsar ⇄ Faridkot ⇄ Bathinda)
  MAJHA_MALWA: [
    ["Amritsar ISBT", 0],
    ["Tarn Taran Bus Stand", 28],
    ["Harike Pattan", 60],
    ["Zira", 90],
    ["Kotkapura", 125],
    ["Faridkot Bus Stand", 145],
    ["Goniana Mandi", 170],
    ["Bathinda Central Bus Stand", 195]
  ],

  // 9. North Punjab & Doaba (Pathankot ⇄ Mukerian ⇄ Dasuya ⇄ Hoshiarpur ⇄ Jalandhar)
  NORTH_DOABA: [
    ["Pathankot Bus Stand", 0],
    ["Mukerian", 38],
    ["Dasuya", 58],
    ["Hoshiarpur Bus Stand", 100],
    ["Adampur", 120],
    ["Jalandhar Central Bus Stand", 145]
  ],

  // 10. Shivalik Foothills / Anandpur Sahib Corridor (Chandigarh ⇄ Ropar ⇄ Anandpur Sahib ⇄ Nangal)
  ROPAR_ANANDPUR: [
    ["Chandigarh ISBT 43", 0],
    ["Kharar", 20],
    ["Kurali", 35],
    ["Rupnagar (Ropar) Bus Stand", 55],
    ["Ghanauli", 72],
    ["Kiratpur Sahib", 95],
    ["Anandpur Sahib Bus Stand", 110],
    ["Nangal", 130]
  ],

  // 11. Tricity & Ambala link
  A: [
    ["Ambala Cantt", 0],
    ["Zirakpur", 55],
    ["Chandigarh ISBT 43", 75],
    ["Chandigarh ISBT 17", 85]
  ]
};

/**
 * Raw Bus Services Across Punjab
 * [Operator, Class, SpeedType (E/L), RouteKey, DepartureTime, Direction (+1/-1)]
 */
export const RAW_BUS_DEFINITIONS: [string, string, 'E' | 'L', string, string, number][] = [
  // --- NH-5 Corridor (Chandigarh ⇄ Ludhiana) ---
  ["PRTC PEPSU", "Ordinary", "E", "E", "06:00", 1],
  ["Punbus", "Ordinary", "L", "L", "07:15", 1],
  ["Orbit Aviators", "Volvo AC", "E", "E", "08:15", 1],
  ["PRTC PEPSU", "Ordinary", "E", "E", "08:45", 1],
  ["Local Mini Bus", "Mini Bus", "L", "L", "09:10", 1],
  ["Punbus", "Ordinary", "E", "E", "10:15", 1],
  ["Libra", "HVAC Semi-Deluxe", "L", "L", "12:40", 1],
  ["Orbit Aviators", "Volvo AC", "E", "E", "14:15", 1],
  ["PRTC PEPSU", "Ordinary", "E", "E", "15:30", 1],
  ["PRTC PEPSU", "HVAC Semi-Deluxe", "E", "E", "16:30", 1],
  ["Jujhar", "HVAC Semi-Deluxe", "E", "E", "17:10", 1],
  ["Punbus", "Ordinary", "L", "L", "19:20", 1],
  ["Punbus", "Ordinary", "L", "L", "20:45", 1],

  // NH-5 Reverse (Ludhiana to Chandigarh)
  ["PRTC PEPSU", "Ordinary", "E", "E", "06:50", -1],
  ["PRTC PEPSU", "Ordinary", "E", "E", "08:15", -1],
  ["Punbus", "Ordinary", "E", "E", "11:00", -1],
  ["Punbus", "Ordinary", "L", "L", "13:00", -1],
  ["Orbit Aviators", "Volvo AC", "E", "E", "15:00", -1],
  ["Local Mini Bus", "Mini Bus", "L", "L", "16:40", -1],
  ["Jujhar", "HVAC Semi-Deluxe", "E", "E", "16:20", -1],
  ["PRTC PEPSU", "Ordinary", "E", "E", "18:30", -1],
  ["PRTC PEPSU", "Ordinary", "E", "E", "20:15", -1],

  // --- Chandigarh ⇄ Jalandhar ---
  ["Punbus", "Ordinary", "E", "J", "06:30", 1],
  ["Orbit Aviators", "Volvo AC", "E", "J", "09:30", 1],
  ["PRTC PEPSU", "HVAC Semi-Deluxe", "E", "J", "13:30", 1],
  ["Punbus", "Ordinary", "E", "J", "16:45", 1],
  ["Orbit Aviators", "Volvo AC", "E", "J", "10:45", -1],
  ["PRTC PEPSU", "Ordinary", "E", "J", "14:15", -1],
  ["Punbus", "HVAC Semi-Deluxe", "E", "J", "18:00", -1],

  // --- North-South Spine (Chandigarh ⇄ Amritsar via Ludhiana & Jalandhar) ---
  ["Punbus", "Ordinary", "E", "CHD_ASR", "05:30", 1],
  ["Punbus", "HVAC Semi-Deluxe", "E", "CHD_ASR", "07:30", 1],
  ["Orbit Aviators", "Volvo AC", "E", "CHD_ASR", "09:00", 1],
  ["PRTC PEPSU", "Ordinary", "E", "CHD_ASR", "11:45", 1],
  ["Orbit Aviators", "Volvo AC", "E", "CHD_ASR", "14:30", 1],
  ["Punbus", "Ordinary", "E", "CHD_ASR", "16:00", 1],
  ["PRTC PEPSU", "HVAC Semi-Deluxe", "E", "CHD_ASR", "18:30", 1],

  // Amritsar to Chandigarh Reverse
  ["Punbus", "Ordinary", "E", "CHD_ASR", "06:00", -1],
  ["Orbit Aviators", "Volvo AC", "E", "CHD_ASR", "08:30", -1],
  ["Punbus", "HVAC Semi-Deluxe", "E", "CHD_ASR", "10:30", -1],
  ["PRTC PEPSU", "Ordinary", "E", "CHD_ASR", "13:00", -1],
  ["Orbit Aviators", "Volvo AC", "E", "CHD_ASR", "15:30", -1],
  ["Punbus", "Ordinary", "E", "CHD_ASR", "17:45", -1],

  // --- Grand Trunk Road Corridor (Amritsar ⇄ Jalandhar ⇄ Ludhiana ⇄ Ambala) ---
  ["Punbus", "Ordinary", "E", "GT_CORRIDOR", "06:15", 1],
  ["PRTC PEPSU", "Ordinary", "L", "GT_CORRIDOR", "08:00", 1],
  ["Libra", "HVAC Semi-Deluxe", "E", "GT_CORRIDOR", "10:00", 1],
  ["Punbus", "Ordinary", "E", "GT_CORRIDOR", "12:30", 1],
  ["PRTC PEPSU", "HVAC Semi-Deluxe", "E", "GT_CORRIDOR", "15:15", 1],
  ["Haryana Roadways", "Ordinary", "E", "GT_CORRIDOR", "17:30", 1],

  // GT Corridor Reverse (Ambala to Amritsar)
  ["Haryana Roadways", "Ordinary", "E", "GT_CORRIDOR", "07:00", -1],
  ["Punbus", "Ordinary", "E", "GT_CORRIDOR", "09:15", -1],
  ["PRTC PEPSU", "Ordinary", "L", "GT_CORRIDOR", "11:30", -1],
  ["Libra", "HVAC Semi-Deluxe", "E", "GT_CORRIDOR", "14:00", -1],
  ["Punbus", "HVAC Semi-Deluxe", "E", "GT_CORRIDOR", "16:45", -1],

  // --- Malwa South Corridor - NH-7 (Chandigarh ⇄ Patiala ⇄ Sangrur ⇄ Bathinda) ---
  ["PRTC PEPSU", "Ordinary", "E", "MALWA_NH7", "05:45", 1],
  ["PRTC PEPSU", "HVAC Semi-Deluxe", "E", "MALWA_NH7", "07:15", 1],
  ["PRTC PEPSU", "Ordinary", "L", "MALWA_NH7", "08:30", 1],
  ["Orbit Aviators", "Volvo AC", "E", "MALWA_NH7", "10:15", 1],
  ["New Deep", "Ordinary", "L", "MALWA_NH7", "12:00", 1],
  ["PRTC PEPSU", "Ordinary", "E", "MALWA_NH7", "14:00", 1],
  ["PRTC PEPSU", "HVAC Semi-Deluxe", "E", "MALWA_NH7", "16:15", 1],
  ["New Deep", "Ordinary", "L", "MALWA_NH7", "18:30", 1],

  // Bathinda to Chandigarh Reverse
  ["PRTC PEPSU", "Ordinary", "E", "MALWA_NH7", "06:15", -1],
  ["PRTC PEPSU", "HVAC Semi-Deluxe", "E", "MALWA_NH7", "08:00", -1],
  ["New Deep", "Ordinary", "L", "MALWA_NH7", "10:30", -1],
  ["Orbit Aviators", "Volvo AC", "E", "MALWA_NH7", "13:15", -1],
  ["PRTC PEPSU", "Ordinary", "E", "MALWA_NH7", "15:45", -1],
  ["PRTC PEPSU", "Ordinary", "E", "MALWA_NH7", "18:00", -1],

  // --- Western Punjab Corridor (Ludhiana ⇄ Moga ⇄ Firozpur) ---
  ["Punbus", "Ordinary", "E", "WEST_PUNJAB", "06:45", 1],
  ["PRTC PEPSU", "Ordinary", "L", "WEST_PUNJAB", "08:15", 1],
  ["Jujhar", "HVAC Semi-Deluxe", "E", "WEST_PUNJAB", "10:45", 1],
  ["Punbus", "Ordinary", "L", "WEST_PUNJAB", "13:30", 1],
  ["New Deep", "Ordinary", "E", "WEST_PUNJAB", "16:00", 1],
  ["PRTC PEPSU", "Ordinary", "L", "WEST_PUNJAB", "18:15", 1],

  // Firozpur to Ludhiana Reverse
  ["Punbus", "Ordinary", "E", "WEST_PUNJAB", "07:30", -1],
  ["New Deep", "Ordinary", "E", "WEST_PUNJAB", "09:45", -1],
  ["PRTC PEPSU", "Ordinary", "L", "WEST_PUNJAB", "12:15", -1],
  ["Jujhar", "HVAC Semi-Deluxe", "E", "WEST_PUNJAB", "15:00", -1],
  ["Punbus", "Ordinary", "L", "WEST_PUNJAB", "17:30", -1],

  // --- Majha to South Malwa (Amritsar ⇄ Faridkot ⇄ Bathinda) ---
  ["PRTC PEPSU", "Ordinary", "E", "MAJHA_MALWA", "06:30", 1],
  ["Punbus", "Ordinary", "L", "MAJHA_MALWA", "09:00", 1],
  ["New Deep", "Ordinary", "E", "MAJHA_MALWA", "12:15", 1],
  ["PRTC PEPSU", "HVAC Semi-Deluxe", "E", "MAJHA_MALWA", "15:00", 1],
  ["PRTC PEPSU", "Ordinary", "E", "MAJHA_MALWA", "07:15", -1],
  ["New Deep", "Ordinary", "E", "MAJHA_MALWA", "10:45", -1],
  ["Punbus", "Ordinary", "L", "MAJHA_MALWA", "14:00", -1],
  ["PRTC PEPSU", "Ordinary", "E", "MAJHA_MALWA", "17:15", -1],

  // --- North Punjab & Doaba (Pathankot ⇄ Hoshiarpur ⇄ Jalandhar) ---
  ["Punbus", "Ordinary", "E", "NORTH_DOABA", "06:15", 1],
  ["Punbus", "Ordinary", "L", "NORTH_DOABA", "09:30", 1],
  ["PRTC PEPSU", "Ordinary", "E", "NORTH_DOABA", "13:15", 1],
  ["Punbus", "HVAC Semi-Deluxe", "E", "NORTH_DOABA", "16:30", 1],
  ["Punbus", "Ordinary", "E", "NORTH_DOABA", "07:45", -1],
  ["PRTC PEPSU", "Ordinary", "E", "NORTH_DOABA", "11:00", -1],
  ["Punbus", "Ordinary", "L", "NORTH_DOABA", "14:45", -1],
  ["Punbus", "HVAC Semi-Deluxe", "E", "NORTH_DOABA", "18:15", -1],

  // --- Ropar & Anandpur Sahib Corridor (Chandigarh ⇄ Ropar ⇄ Anandpur Sahib ⇄ Nangal) ---
  ["Punbus", "Ordinary", "E", "ROPAR_ANANDPUR", "06:30", 1],
  ["PRTC PEPSU", "Ordinary", "L", "ROPAR_ANANDPUR", "08:45", 1],
  ["Punbus", "HVAC Semi-Deluxe", "E", "ROPAR_ANANDPUR", "11:15", 1],
  ["Local Mini Bus", "Mini Bus", "L", "ROPAR_ANANDPUR", "14:00", 1],
  ["Punbus", "Ordinary", "E", "ROPAR_ANANDPUR", "16:30", 1],
  ["Punbus", "Ordinary", "E", "ROPAR_ANANDPUR", "08:00", -1],
  ["PRTC PEPSU", "Ordinary", "L", "ROPAR_ANANDPUR", "11:30", -1],
  ["Punbus", "HVAC Semi-Deluxe", "E", "ROPAR_ANANDPUR", "15:15", -1],

  // --- Ambala to Chandigarh Link ---
  ["Haryana Roadways", "Ordinary", "E", "A", "08:10", 1],
  ["CTU", "Ordinary", "L", "A", "11:30", 1],
  ["Haryana Roadways", "Ordinary", "E", "A", "14:10", -1],
  ["CTU", "Ordinary", "L", "A", "17:15", -1]
];

export const OWN: Record<string, 'G' | 'P' | 'O'> = {
  "PRTC PEPSU": "G",
  "Punbus": "G",
  "CTU": "G",
  "Haryana Roadways": "G",
  "Orbit Aviators": "P",
  "Libra": "P",
  "Jujhar": "P",
  "New Deep": "P",
  "Local Mini Bus": "O"
};

export const OWNL: Record<'G' | 'P' | 'O', [string, string]> = {
  G: ["Government", "b-g"],
  P: ["Private", "b-p"],
  O: ["Other (mini/local)", "b-o"]
};

export const CLASS_RATES: Record<string, number> = {
  "Mini Bus": 0.8,
  "Ordinary": 0.9,
  "HVAC Semi-Deluxe": 1.15,
  "Volvo AC": 2.4
};

// All unique stops across Punjab (alphabetically sorted)
export const STOPS = Array.from(
  new Set(Object.values(ROUTES).flatMap((route) => route.map(([name]) => name)))
).sort();

// Curated Popular Trips covering Majha, Doaba, and Malwa
export const POPULAR_TRIPS: [string, string][] = [
  ["Chandigarh ISBT 43", "Amritsar ISBT"],
  ["Chandigarh ISBT 43", "Ludhiana Bus Stand"],
  ["Ludhiana Bus Stand", "Jalandhar Central Bus Stand"],
  ["Jalandhar Central Bus Stand", "Amritsar ISBT"],
  ["Chandigarh ISBT 43", "Patiala Central Bus Stand"],
  ["Patiala Central Bus Stand", "Bathinda Central Bus Stand"],
  ["Ludhiana Bus Stand", "Moga Central Bus Stand"],
  ["Amritsar ISBT", "Bathinda Central Bus Stand"],
  ["Chandigarh ISBT 43", "Rupnagar (Ropar) Bus Stand"],
  ["Gharuan (CU Gate 2)", "Ludhiana Bus Stand"],
  ["Jalandhar Central Bus Stand", "Pathankot Bus Stand"],
  ["Ambala Cantt", "Chandigarh ISBT 17"]
];

export const TIMES: [string, string][] = [
  ["all", "All day"],
  ["now", "Next 60 min"],
  ["am", "Morning"],
  ["pm", "Afternoon"],
  ["ev", "Evening"]
];

export const TYPES: [string, string][] = [
  ["any", "All buses"],
  ["E", "⚡ Express"],
  ["L", "🐢 All-stop"]
];

export const OWNERS: [string, string][] = [
  ["any", "All"],
  ["G", "🏛 Government"],
  ["P", "Private"],
  ["O", "Other"]
];

export const BUS_SERVICES: BusService[] = RAW_BUS_DEFINITIONS.map(
  ([op, cls, t, r, s, d], idx) => {
    const routeStops = ROUTES[r];
    const totalDuration = routeStops[routeStops.length - 1][1];
    const [hh, mm] = s.split(':').map(Number);
    const startMinutes = hh * 60 + mm;

    const stops: [string, number][] = (d > 0 ? routeStops : [...routeStops].reverse()).map(
      ([name, offset]) => [name, d > 0 ? offset : totalDuration - offset]
    );

    return {
      id: `bus-${idx}-${op.replace(/\s+/g, '-').toLowerCase()}-${s.replace(':', '')}`,
      operator: op,
      busClass: cls as any,
      serviceType: t,
      ownership: (OWN[op] === 'G' ? 'gov' : 'pvt') as any,
      startMinutes,
      stops,
      bookingUrl: cls === 'Volvo AC' ? 'https://www.redbus.in/' : undefined
    };
  }
);

/**
 * Verified Depot & Bus Stand Helpdesks across Punjab
 */
export const INQUIRY_CONTACTS: InquiryContact[] = [
  // Amritsar (Majha)
  {
    id: "asr-isbt",
    title: "Amritsar Shaheed Dhingra ISBT Inquiry",
    location: "Near Railway Link Road, Amritsar",
    phone: "01832551734",
    displayPhone: "0183-2551734",
    category: "inquiry",
    timings: "24x7 Control Room",
    notes: "Main terminal control for Golden Temple express buses, Jalandhar, Chandigarh, and Jammu routes."
  },
  // Jalandhar (Doaba)
  {
    id: "jalandhar-isbt",
    title: "Jalandhar Shaheed-e-Azam ISBT Inquiry",
    location: "Jalandhar Central Bus Stand",
    phone: "01812223755",
    displayPhone: "0181-2223755",
    category: "inquiry",
    timings: "24x7 Control Room",
    notes: "Doaba regional hub connecting Amritsar, Pathankot, Hoshiarpur, and Ludhiana-Chandigarh."
  },
  // Ludhiana (Malwa)
  {
    id: "ldh-bus-stand",
    title: "Ludhiana Central Bus Stand Inquiry",
    location: "Near Bharat Nagar Chowk, Ludhiana",
    phone: "01612447015",
    displayPhone: "0161-2447015",
    category: "inquiry",
    timings: "24x7 Control Room",
    notes: "Punjab's largest transit nexus for PRTC & Punbus departures, Moga, Firozpur, and Chandigarh highway queries."
  },
  // Chandigarh ISBT 43
  {
    id: "chd-isbt-43",
    title: "Chandigarh ISBT Sector 43 Inquiry",
    location: "ISBT-43, Chandigarh",
    phone: "01722606672",
    displayPhone: "0172-2606672",
    category: "inquiry",
    timings: "24x7 Control Room",
    notes: "State capital intercity terminal for all Punjab roadways, PRTC, Himachal, and Haryana long-distance routes."
  },
  // Patiala (PRTC HQ)
  {
    id: "patiala-bus-stand",
    title: "Patiala Central Bus Stand & PRTC HQ",
    location: "Near Railway Station, Patiala",
    phone: "01752311718",
    displayPhone: "0175-2311718",
    category: "depot",
    timings: "24x7 Control Room",
    notes: "PRTC PEPSU main headquarters and central dispatcher for Sangrur, Bathinda, and Chandigarh fleets."
  },
  // Bathinda (South Malwa)
  {
    id: "bathinda-bus-stand",
    title: "Bathinda Central Bus Stand Control",
    location: "Mansa Road, Bathinda",
    phone: "01642252161",
    displayPhone: "0164-2252161",
    category: "inquiry",
    timings: "24x7 Control Room",
    notes: "Major Malwa junction connecting Rajasthan, Haryana, Muktsar, Faridkot, and Patiala."
  },
  // Pathankot (North Majha / Doaba)
  {
    id: "pathankot-bus-stand",
    title: "Pathankot Maharana Pratap ISBT",
    location: "Pathankot Intercity Terminal",
    phone: "01862220042",
    displayPhone: "0186-2220042",
    category: "inquiry",
    timings: "05:00 AM – 10:30 PM",
    notes: "Northern border gateway linking Jammu & Kashmir, Himachal, Hoshiarpur, and Jalandhar."
  },
  // Hoshiarpur (Doaba)
  {
    id: "hoshiarpur-bus-stand",
    title: "Hoshiarpur Central Bus Stand Helpdesk",
    location: "Bus Stand Road, Hoshiarpur",
    phone: "01882222336",
    displayPhone: "01882-222336",
    category: "inquiry",
    timings: "06:00 AM – 09:30 PM",
    notes: "Doaba sub-mountainous junction for Dasuya, Nangal, and Jalandhar routes."
  },
  // Moga (Central Malwa)
  {
    id: "moga-bus-stand",
    title: "Moga Central Bus Stand Control Desk",
    location: "GT Road, Moga",
    phone: "01636224455",
    displayPhone: "01636-224455",
    category: "inquiry",
    timings: "06:00 AM – 09:00 PM",
    notes: "Direct PRTC & Punbus dispatcher for Firozpur, Ludhiana, and Kotkapura routes."
  },
  // Firozpur (Border District)
  {
    id: "firozpur-bus-stand",
    title: "Firozpur Cantt Bus Stand Helpdesk",
    location: "Mall Road, Firozpur Cantt",
    phone: "01632244177",
    displayPhone: "01632-244177",
    category: "inquiry",
    timings: "06:00 AM – 09:00 PM",
    notes: "Border district transit hub for Fazilka, Zira, Moga, and Ludhiana buses."
  },
  // Rupnagar (Ropar)
  {
    id: "ropar-bus-stand",
    title: "Rupnagar (Ropar) Bus Stand Control",
    location: "Bela Chowk, Rupnagar",
    phone: "01881222455",
    displayPhone: "01881-222455",
    category: "inquiry",
    timings: "06:00 AM – 09:30 PM",
    notes: "Key gateway for Anandpur Sahib, Nangal, Kurali, and Chandigarh connections."
  },
  // Chandigarh ISBT 17
  {
    id: "chd-isbt-17",
    title: "Chandigarh ISBT Sector 17 Inquiry",
    location: "ISBT-17, Chandigarh",
    phone: "01722704005",
    displayPhone: "0172-2704005",
    category: "inquiry",
    timings: "06:00 AM – 10:00 PM",
    notes: "CTU Local bus services and Ambala/Delhi Haryana Roadways departures."
  },
  // Kharar Highway Stop
  {
    id: "kharar-bus-stand",
    title: "Kharar Highway Bus Stand Helpdesk",
    location: "Kharar Flyover Intersection",
    phone: "01602280200",
    displayPhone: "0160-2280200",
    category: "inquiry",
    timings: "06:00 AM – 09:30 PM",
    notes: "High-density transfer point for Chandigarh University (CU), Ropar, and Ludhiana routes."
  },
  // Morinda Junction
  {
    id: "morinda-bus-stand",
    title: "Morinda Junction Bus Stand Control",
    location: "Morinda Bypass",
    phone: "01602630040",
    displayPhone: "0160-2630040",
    category: "inquiry",
    timings: "06:30 AM – 08:30 PM",
    notes: "Platform inquiry for local all-stop routes, Khamano, and Samrala link buses."
  },
  // Private Fleets: Orbit & New Deep
  {
    id: "orbit-aviators-office",
    title: "Orbit Aviators Private Fleet Dispatch",
    location: "NH-5 / NH-44 Service Counter",
    phone: "01633263300",
    displayPhone: "01633-263300",
    category: "private",
    timings: "06:00 AM – 10:00 PM",
    notes: "Volvo AC coach seat assistance, tracking, and luggage queries across Punjab."
  },
  {
    id: "new-deep-dispatch",
    title: "New Deep Transport Fleet Desk",
    location: "Malwa Central Office, Muktsar",
    phone: "01633262100",
    displayPhone: "01633-262100",
    category: "private",
    timings: "06:00 AM – 09:30 PM",
    notes: "Semi-deluxe and ordinary private stage carriages serving Bathinda, Muktsar, and Moga."
  }
];

export const INITIAL_SPOTTED_REPORTS = [
  {
    id: "spot-1",
    operator: "Punbus",
    stop: "Gharuan (CU Gate 2)",
    direction: "Towards Ludhiana",
    speedType: "Express" as const,
    statusNote: "Just crossed Gate 2 (seats available). Running on time.",
    timestamp: Date.now() - 6 * 60 * 1000,
    crowdLevel: "Moderate" as const
  },
  {
    id: "spot-2",
    operator: "PRTC PEPSU",
    stop: "Kharar",
    direction: "Towards Ludhiana",
    speedType: "Express" as const,
    statusNote: "Cleared Kharar flyover. Arriving at CU Gate 2 in ~10 mins.",
    timestamp: Date.now() - 14 * 60 * 1000,
    crowdLevel: "Low" as const
  },
  {
    id: "spot-3",
    operator: "Orbit Aviators",
    stop: "Phagwara (Sugar Mill Chowk)",
    direction: "Towards Amritsar",
    speedType: "Express" as const,
    statusNote: "Volvo AC coach passed Phagwara towards Jalandhar. Steady pace.",
    timestamp: Date.now() - 22 * 60 * 1000,
    crowdLevel: "Moderate" as const
  },
  {
    id: "spot-4",
    operator: "PRTC PEPSU",
    stop: "Rajpura Bypass",
    direction: "Towards Patiala",
    speedType: "Express" as const,
    statusNote: "Departed Rajpura bypass towards Patiala ISBT. Good seating.",
    timestamp: Date.now() - 35 * 60 * 1000,
    crowdLevel: "Low" as const
  }
];
