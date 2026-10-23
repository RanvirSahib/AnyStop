import { BusService, InquiryContact, SpottedReport } from '../types/transit';

/**
 * All-Punjab transit routes across all 23 districts in Majha, Doaba, and Malwa regions
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
    ["Goraya Bus Stand", 140],
    ["Phagwara", 150],
    ["Jalandhar Central Bus Stand", 180]
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
    ["Goraya Bus Stand", 140],
    ["Phagwara", 150],
    ["Jalandhar Central Bus Stand", 175],
    ["Kartarpur", 195],
    ["Beas", 215],
    ["Rayya Bus Stand", 225],
    ["Jandiala Guru", 235],
    ["Amritsar ISBT", 255]
  ],

  // 5. Grand Trunk Road Corridor (Amritsar ⇄ Jalandhar ⇄ Ludhiana ⇄ Ambala)
  GT_CORRIDOR: [
    ["Amritsar ISBT", 0],
    ["Jandiala Guru", 20],
    ["Rayya Bus Stand", 30],
    ["Beas", 42],
    ["Kartarpur", 60],
    ["Jalandhar Central Bus Stand", 80],
    ["Phagwara", 100],
    ["Goraya Bus Stand", 112],
    ["Phillaur", 125],
    ["Ludhiana Bus Stand", 155],
    ["Sahnewal", 175],
    ["Doraha Bus Stand", 185],
    ["Khanna Bus Stand", 200],
    ["Mandi Gobindgarh Bus Stand", 212],
    ["Sirhind (Fatehgarh Sahib)", 225],
    ["Rajpura Bypass", 250],
    ["Ambala Cantt", 280]
  ],

  // 6. Malwa South Corridor - NH-7 (Chandigarh ⇄ Patiala ⇄ Sangrur ⇄ Barnala ⇄ Bathinda)
  MALWA_NH7: [
    ["Chandigarh ISBT 43", 0],
    ["Zirakpur", 18],
    ["Banur Bus Stand", 32],
    ["Rajpura Bypass", 45],
    ["Patiala Central Bus Stand", 70],
    ["Nabha Bypass", 100],
    ["Bhawanigarh", 120],
    ["Sangrur Bus Stand", 140],
    ["Dhanaula", 160],
    ["Barnala Bus Stand", 180],
    ["Tapa", 200],
    ["Rampura Phul", 220],
    ["Bhucho Mandi Bus Stand", 235],
    ["Bathinda Central Bus Stand", 255]
  ],

  // 7. Western Malwa Corridor (Ludhiana ⇄ Moga ⇄ Firozpur)
  WEST_PUNJAB: [
    ["Ludhiana Bus Stand", 0],
    ["Mullanpur Dakha", 22],
    ["Jagraon Bus Stand", 45],
    ["Ajitwal", 65],
    ["Moga Central Bus Stand", 85],
    ["Talwandi Bhai", 110],
    ["Firozpur Cantt Bus Stand", 135],
    ["Firozpur City Bus Stand", 145]
  ],

  // 8. Majha to South Malwa Highway - NH-54 (Amritsar ⇄ Faridkot ⇄ Bathinda)
  MAJHA_MALWA: [
    ["Amritsar ISBT", 0],
    ["Tarn Taran Bus Stand", 28],
    ["Harike Pattan", 60],
    ["Makhu Bus Stand", 75],
    ["Zira", 95],
    ["Kotkapura", 130],
    ["Faridkot Bus Stand", 150],
    ["Goniana Mandi", 175],
    ["Bathinda Central Bus Stand", 200]
  ],

  // 9. North Punjab & Doaba (Pathankot ⇄ Mukerian ⇄ Dasuya ⇄ Hoshiarpur ⇄ Jalandhar)
  NORTH_DOABA: [
    ["Pathankot Bus Stand", 0],
    ["Sujanpur Bus Stand", 15],
    ["Mukerian", 45],
    ["Dasuya", 65],
    ["Tanda Urmar Bus Stand", 85],
    ["Bhogpur Bus Stand", 100],
    ["Hoshiarpur Bus Stand", 125],
    ["Adampur", 145],
    ["Jalandhar Central Bus Stand", 170]
  ],

  // 10. Shivalik Foothills / Anandpur Sahib Corridor (Chandigarh ⇄ Ropar ⇄ Anandpur Sahib ⇄ Nangal)
  ROPAR_ANANDPUR: [
    ["Chandigarh ISBT 43", 0],
    ["Kharar", 20],
    ["Kurali", 35],
    ["Rupnagar (Ropar) Bus Stand", 55],
    ["Ghanauli", 72],
    ["Kiratpur Sahib", 90],
    ["Anandpur Sahib Bus Stand", 105],
    ["Nangal", 125]
  ],

  // 11. Majha Northern Trunk (Amritsar ⇄ Batala ⇄ Gurdaspur ⇄ Dinanagar ⇄ Pathankot)
  MAJHA_NORTH: [
    ["Amritsar ISBT", 0],
    ["Majitha Bus Stand", 22],
    ["Fatehgarh Churian Bus Stand", 42],
    ["Batala Bus Stand", 65],
    ["Qadian Bus Stand", 85],
    ["Gurdaspur Central Bus Stand", 110],
    ["Dinanagar Bus Stand", 130],
    ["Pathankot Bus Stand", 155]
  ],

  // 12. Dera Baba Nanak & Sri Hargobindpur Link (Dera Baba Nanak ⇄ Batala ⇄ Tanda ⇄ Hoshiarpur)
  BORDER_HERITAGE: [
    ["Dera Baba Nanak Bus Stand", 0],
    ["Kalanaur Bus Stand", 22],
    ["Batala Bus Stand", 48],
    ["Sri Hargobindpur Bus Stand", 78],
    ["Tanda Urmar Bus Stand", 108],
    ["Hoshiarpur Bus Stand", 138]
  ],

  // 13. Border Majha Corridor (Amritsar ⇄ Tarn Taran ⇄ Patti ⇄ Bhikhiwind ⇄ Khemkaran)
  TARN_TARAN_BORDER: [
    ["Amritsar ISBT", 0],
    ["Attari (Wagah Border)", 30],
    ["Tarn Taran Bus Stand", 60],
    ["Patti Bus Stand", 88],
    ["Bhikhiwind Bus Stand", 112],
    ["Khemkaran Bus Stand", 138]
  ],

  // 14. Historic Doaba Circuit (Jalandhar ⇄ Kapurthala ⇄ Sultanpur Lodhi ⇄ Goindwal ⇄ Tarn Taran)
  DOABA_KAPURTHALA: [
    ["Jalandhar Central Bus Stand", 0],
    ["Kapurthala Central Bus Stand", 30],
    ["Subhanpur Bus Stand", 48],
    ["Bholath Bus Stand", 68],
    ["Nadala Bus Stand", 80],
    ["Sultanpur Lodhi Bus Stand", 110],
    ["Goindwal Sahib Bus Stand", 135],
    ["Khadoor Sahib Bus Stand", 150],
    ["Tarn Taran Bus Stand", 175]
  ],

  // 15. Nawanshahr & Shivalik Link (Jalandhar ⇄ Phagwara ⇄ Banga ⇄ Nawanshahr ⇄ Balachaur ⇄ Ropar ⇄ Chandigarh)
  DOABA_NAWANSHAHR: [
    ["Jalandhar Central Bus Stand", 0],
    ["Phagwara", 25],
    ["Banga Bus Stand", 52],
    ["Nawanshahr Central Bus Stand", 72],
    ["Rahon Bus Stand", 85],
    ["Balachaur Bus Stand", 110],
    ["Rupnagar (Ropar) Bus Stand", 140],
    ["Kurali", 165],
    ["Kharar", 180],
    ["Chandigarh ISBT 43", 205]
  ],

  // 16. Hoshiarpur to Capital Corridor (Hoshiarpur ⇄ Mahilpur ⇄ Garhshankar ⇄ Balachaur ⇄ Ropar ⇄ Chandigarh)
  HOSHIARPUR_CHANDIGARH: [
    ["Hoshiarpur Bus Stand", 0],
    ["Mahilpur Bus Stand", 25],
    ["Garhshankar Bus Stand", 48],
    ["Balachaur Bus Stand", 80],
    ["Rupnagar (Ropar) Bus Stand", 110],
    ["Kharar", 145],
    ["Chandigarh ISBT 43", 165]
  ],

  // 17. South-West Border Highway (Firozpur ⇄ Guru Har Sahai ⇄ Jalalabad ⇄ Fazilka ⇄ Abohar)
  SOUTH_WEST_BORDER: [
    ["Firozpur Cantt Bus Stand", 0],
    ["Firozpur City Bus Stand", 12],
    ["Guru Har Sahai Bus Stand", 45],
    ["Jalalabad Bus Stand", 75],
    ["Arniwala Sheikh Subhan Bus Stand", 95],
    ["Fazilka Central Bus Stand", 115],
    ["Khuian Sarwar Bus Stand", 138],
    ["Abohar Central Bus Stand", 168]
  ],

  // 18. Cotton Belt Expressway (Bathinda ⇄ Gidderbaha ⇄ Malout ⇄ Abohar ⇄ Fazilka)
  MUKTSAR_MALOUT_ABOHAR: [
    ["Bathinda Central Bus Stand", 0],
    ["Gidderbaha Bus Stand", 35],
    ["Malout Central Bus Stand", 65],
    ["Abohar Central Bus Stand", 100],
    ["Fazilka Central Bus Stand", 135]
  ],

  // 19. Historic Muktsar & Malwa Line (Faridkot ⇄ Kotkapura ⇄ Muktsar ⇄ Malout ⇄ Lambi)
  MUKTSAR_FARIDKOT: [
    ["Faridkot Bus Stand", 0],
    ["Kotkapura", 20],
    ["Bariwala Bus Stand", 45],
    ["Sri Muktsar Sahib Central Bus Stand", 70],
    ["Malout Central Bus Stand", 105],
    ["Lambi Bus Stand", 130]
  ],

  // 20. Central Malwa Link (Faridkot ⇄ Kotkapura ⇄ Baghapurana ⇄ Moga ⇄ Jagraon ⇄ Ludhiana)
  MOGA_FARIDKOT_LUDHIANA: [
    ["Faridkot Bus Stand", 0],
    ["Kotkapura", 20],
    ["Baghapurana Bus Stand", 50],
    ["Nihal Singh Wala Bus Stand", 75],
    ["Badhni Kalan Bus Stand", 95],
    ["Moga Central Bus Stand", 120],
    ["Jagraon Bus Stand", 155],
    ["Mullanpur Dakha", 178],
    ["Ludhiana Bus Stand", 200]
  ],

  // 21. South Malwa Spine (Patiala ⇄ Samana ⇄ Patran ⇄ Moonak ⇄ Sunam ⇄ Sangrur ⇄ Mansa ⇄ Bathinda)
  PATIALA_MANSA_BATHINDA: [
    ["Patiala Central Bus Stand", 0],
    ["Sanaur Bus Stand", 15],
    ["Samana Bus Stand", 40],
    ["Patran Bus Stand", 70],
    ["Moonak Bus Stand", 100],
    ["Lehragaga Bus Stand", 125],
    ["Sunam Udham Singh Wala Bus Stand", 150],
    ["Sangrur Bus Stand", 175],
    ["Mansa Central Bus Stand", 220],
    ["Maur Mandi Bus Stand", 250],
    ["Bathinda Central Bus Stand", 285]
  ],

  // 22. Southern Border Corridor (Sangrur ⇄ Sunam ⇄ Bhikhi ⇄ Mansa ⇄ Budhlada ⇄ Bareta ⇄ Sardulgarh)
  MANSA_SARDULGARH: [
    ["Sangrur Bus Stand", 0],
    ["Sunam Udham Singh Wala Bus Stand", 22],
    ["Bhikhi Bus Stand", 55],
    ["Mansa Central Bus Stand", 80],
    ["Budhlada Bus Stand", 110],
    ["Bareta Bus Stand", 130],
    ["Jhunir Bus Stand", 155],
    ["Sardulgarh Bus Stand", 185]
  ],

  // 23. Bathinda Sub-division Circuit (Bathinda ⇄ Bhucho ⇄ Rampura Phul ⇄ Maur ⇄ Talwandi Sabo ⇄ Raman)
  TALWANDI_SABO_CIRCUIT: [
    ["Bathinda Central Bus Stand", 0],
    ["Bhucho Mandi Bus Stand", 20],
    ["Rampura Phul", 45],
    ["Maur Mandi Bus Stand", 75],
    ["Talwandi Sabo Bus Stand", 100],
    ["Raman Mandi Bus Stand", 125],
    ["Sangat Mandi Bus Stand", 150]
  ],

  // 24. Ludhiana to Barnala (Ludhiana ⇄ Raikot ⇄ Mehal Kalan ⇄ Barnala ⇄ Tapa ⇄ Bhadaur)
  LUDHIANA_BARNALA: [
    ["Ludhiana Bus Stand", 0],
    ["Mullanpur Dakha", 22],
    ["Raikot Bus Stand", 52],
    ["Mehal Kalan Bus Stand", 80],
    ["Barnala Bus Stand", 110],
    ["Bhadaur Bus Stand", 135],
    ["Tapa", 155]
  ],

  // 25. Malerkotla Heart of Malwa (Ludhiana ⇄ Ahmedgarh ⇄ Malerkotla ⇄ Amargarh ⇄ Nabha ⇄ Patiala)
  LUDHIANA_MALERKOTLA_PATIALA: [
    ["Ludhiana Bus Stand", 0],
    ["Ahmedgarh Bus Stand", 35],
    ["Malerkotla Central Bus Stand", 60],
    ["Amargarh Bus Stand", 80],
    ["Nabha Bypass", 115],
    ["Patiala Central Bus Stand", 150]
  ],

  // 26. Tricity & Shivalik Bypass (Chandigarh ⇄ Mohali ⇄ Kharar ⇄ Morinda ⇄ Chamkaur Sahib ⇄ Ropar)
  MOHALI_ROPAR_SHIVALIK: [
    ["Chandigarh ISBT 43", 0],
    ["Mohali Phase 8 ISBT", 15],
    ["New Chandigarh Bus Stand", 30],
    ["Kharar", 45],
    ["Morinda", 65],
    ["Chamkaur Sahib Bus Stand", 85],
    ["Rupnagar (Ropar) Bus Stand", 105],
    ["Nurpur Bedi Bus Stand", 135],
    ["Anandpur Sahib Bus Stand", 160]
  ],

  // 27. Historic Sirhind & Mohali South (Chandigarh ⇄ Zirakpur ⇄ Dera Bassi ⇄ Lalru ⇄ Banur ⇄ Rajpura ⇄ Sirhind ⇄ Khanna)
  FATEHGARH_PATIALA_CIRCUIT: [
    ["Chandigarh ISBT 43", 0],
    ["Zirakpur", 18],
    ["Dera Bassi Bus Stand", 35],
    ["Lalru Bus Stand", 55],
    ["Banur Bus Stand", 80],
    ["Rajpura Bypass", 105],
    ["Sirhind (Fatehgarh Sahib)", 130],
    ["Bassi Pathana Bus Stand", 145],
    ["Mandi Gobindgarh Bus Stand", 165],
    ["Amloh Bus Stand", 185],
    ["Khanna Bus Stand", 205]
  ],

  // 28. Doaba to Malwa Cross-River (Jalandhar ⇄ Nakodar ⇄ Shahkot ⇄ Dharamkot ⇄ Moga ⇄ Baghapurana)
  JALANDHAR_NAKODAR_MOGA: [
    ["Jalandhar Central Bus Stand", 0],
    ["Nakodar Bus Stand", 35],
    ["Shahkot Bus Stand", 60],
    ["Dharamkot Bus Stand", 90],
    ["Moga Central Bus Stand", 115],
    ["Baghapurana Bus Stand", 140]
  ],

  // 29. Kandi Canal Belt (Hoshiarpur ⇄ Hariana ⇄ Dasuya ⇄ Mukerian ⇄ Hajipur ⇄ Talwara)
  HOSHIARPUR_TALWARA: [
    ["Hoshiarpur Bus Stand", 0],
    ["Hariana Bus Stand", 20],
    ["Dasuya", 55],
    ["Mukerian", 80],
    ["Hajipur Bus Stand", 105],
    ["Talwara Bus Stand", 130]
  ],

  // 30. Tricity & Ambala link
  A: [
    ["Ambala Cantt", 0],
    ["Lalru Bus Stand", 25],
    ["Dera Bassi Bus Stand", 42],
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
  // --- 1. NH-5 Corridor (Chandigarh ⇄ Ludhiana) ---
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

  // --- 2. Chandigarh ⇄ Jalandhar ---
  ["Punbus", "Ordinary", "E", "J", "06:30", 1],
  ["Orbit Aviators", "Volvo AC", "E", "J", "09:30", 1],
  ["PRTC PEPSU", "HVAC Semi-Deluxe", "E", "J", "13:30", 1],
  ["Punbus", "Ordinary", "E", "J", "16:45", 1],
  ["Orbit Aviators", "Volvo AC", "E", "J", "10:45", -1],
  ["PRTC PEPSU", "Ordinary", "E", "J", "14:15", -1],
  ["Punbus", "HVAC Semi-Deluxe", "E", "J", "18:00", -1],

  // --- 3. North-South Spine (Chandigarh ⇄ Amritsar via Ludhiana & Jalandhar) ---
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

  // --- 4. Grand Trunk Road Corridor (Amritsar ⇄ Jalandhar ⇄ Ludhiana ⇄ Ambala) ---
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

  // --- 5. Malwa South Corridor - NH-7 (Chandigarh ⇄ Patiala ⇄ Sangrur ⇄ Bathinda) ---
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

  // --- 6. Western Punjab Corridor (Ludhiana ⇄ Moga ⇄ Firozpur) ---
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

  // --- 7. Majha to South Malwa (Amritsar ⇄ Faridkot ⇄ Bathinda) ---
  ["PRTC PEPSU", "Ordinary", "E", "MAJHA_MALWA", "06:30", 1],
  ["Punbus", "Ordinary", "L", "MAJHA_MALWA", "09:00", 1],
  ["New Deep", "Ordinary", "E", "MAJHA_MALWA", "12:15", 1],
  ["PRTC PEPSU", "HVAC Semi-Deluxe", "E", "MAJHA_MALWA", "15:00", 1],
  ["PRTC PEPSU", "Ordinary", "E", "MAJHA_MALWA", "07:15", -1],
  ["New Deep", "Ordinary", "E", "MAJHA_MALWA", "10:45", -1],
  ["Punbus", "Ordinary", "L", "MAJHA_MALWA", "14:00", -1],
  ["PRTC PEPSU", "Ordinary", "E", "MAJHA_MALWA", "17:15", -1],

  // --- 8. North Punjab & Doaba (Pathankot ⇄ Hoshiarpur ⇄ Jalandhar) ---
  ["Punbus", "Ordinary", "E", "NORTH_DOABA", "06:15", 1],
  ["Punbus", "Ordinary", "L", "NORTH_DOABA", "09:30", 1],
  ["PRTC PEPSU", "Ordinary", "E", "NORTH_DOABA", "13:15", 1],
  ["Punbus", "HVAC Semi-Deluxe", "E", "NORTH_DOABA", "16:30", 1],
  ["Punbus", "Ordinary", "E", "NORTH_DOABA", "07:45", -1],
  ["PRTC PEPSU", "Ordinary", "E", "NORTH_DOABA", "11:00", -1],
  ["Punbus", "Ordinary", "L", "NORTH_DOABA", "14:45", -1],
  ["Punbus", "HVAC Semi-Deluxe", "E", "NORTH_DOABA", "18:15", -1],

  // --- 9. Ropar & Anandpur Sahib Corridor (Chandigarh ⇄ Ropar ⇄ Anandpur Sahib ⇄ Nangal) ---
  ["Punbus", "Ordinary", "E", "ROPAR_ANANDPUR", "06:30", 1],
  ["PRTC PEPSU", "Ordinary", "L", "ROPAR_ANANDPUR", "08:45", 1],
  ["Punbus", "HVAC Semi-Deluxe", "E", "ROPAR_ANANDPUR", "11:15", 1],
  ["Local Mini Bus", "Mini Bus", "L", "ROPAR_ANANDPUR", "14:00", 1],
  ["Punbus", "Ordinary", "E", "ROPAR_ANANDPUR", "16:30", 1],
  ["Punbus", "Ordinary", "E", "ROPAR_ANANDPUR", "08:00", -1],
  ["PRTC PEPSU", "Ordinary", "L", "ROPAR_ANANDPUR", "11:30", -1],
  ["Punbus", "HVAC Semi-Deluxe", "E", "ROPAR_ANANDPUR", "15:15", -1],

  // --- 10. Majha Northern Trunk (Amritsar ⇄ Batala ⇄ Gurdaspur ⇄ Pathankot) ---
  ["Punbus", "Ordinary", "E", "MAJHA_NORTH", "06:00", 1],
  ["PRTC PEPSU", "Ordinary", "L", "MAJHA_NORTH", "08:30", 1],
  ["Punbus", "HVAC Semi-Deluxe", "E", "MAJHA_NORTH", "11:00", 1],
  ["Local Mini Bus", "Mini Bus", "L", "MAJHA_NORTH", "13:45", 1],
  ["Punbus", "Ordinary", "E", "MAJHA_NORTH", "16:15", 1],
  ["Punbus", "Ordinary", "E", "MAJHA_NORTH", "07:15", -1],
  ["PRTC PEPSU", "Ordinary", "E", "MAJHA_NORTH", "10:30", -1],
  ["Punbus", "HVAC Semi-Deluxe", "E", "MAJHA_NORTH", "14:00", -1],
  ["Punbus", "Ordinary", "L", "MAJHA_NORTH", "17:30", -1],

  // --- 11. Dera Baba Nanak & Sri Hargobindpur Link ---
  ["Punbus", "Ordinary", "L", "BORDER_HERITAGE", "06:45", 1],
  ["PRTC PEPSU", "Ordinary", "E", "BORDER_HERITAGE", "10:15", 1],
  ["Local Mini Bus", "Mini Bus", "L", "BORDER_HERITAGE", "14:30", 1],
  ["Punbus", "Ordinary", "E", "BORDER_HERITAGE", "17:45", 1],
  ["PRTC PEPSU", "Ordinary", "L", "BORDER_HERITAGE", "08:00", -1],
  ["Punbus", "Ordinary", "E", "BORDER_HERITAGE", "12:30", -1],
  ["PRTC PEPSU", "Ordinary", "L", "BORDER_HERITAGE", "16:15", -1],

  // --- 12. Border Majha Corridor (Amritsar ⇄ Tarn Taran ⇄ Patti ⇄ Khemkaran) ---
  ["PRTC PEPSU", "Ordinary", "L", "TARN_TARAN_BORDER", "06:30", 1],
  ["Punbus", "Ordinary", "E", "TARN_TARAN_BORDER", "09:45", 1],
  ["Local Mini Bus", "Mini Bus", "L", "TARN_TARAN_BORDER", "13:15", 1],
  ["PRTC PEPSU", "Ordinary", "E", "TARN_TARAN_BORDER", "17:00", 1],
  ["Punbus", "Ordinary", "L", "TARN_TARAN_BORDER", "08:15", -1],
  ["PRTC PEPSU", "Ordinary", "E", "TARN_TARAN_BORDER", "11:30", -1],
  ["Punbus", "Ordinary", "L", "TARN_TARAN_BORDER", "15:45", -1],

  // --- 13. Historic Doaba Circuit (Jalandhar ⇄ Kapurthala ⇄ Sultanpur Lodhi ⇄ Tarn Taran) ---
  ["Punbus", "Ordinary", "E", "DOABA_KAPURTHALA", "06:15", 1],
  ["PRTC PEPSU", "Ordinary", "L", "DOABA_KAPURTHALA", "09:30", 1],
  ["Punbus", "HVAC Semi-Deluxe", "E", "DOABA_KAPURTHALA", "13:00", 1],
  ["Local Mini Bus", "Mini Bus", "L", "DOABA_KAPURTHALA", "16:30", 1],
  ["Punbus", "Ordinary", "E", "DOABA_KAPURTHALA", "07:30", -1],
  ["PRTC PEPSU", "Ordinary", "E", "DOABA_KAPURTHALA", "11:15", -1],
  ["Punbus", "Ordinary", "L", "DOABA_KAPURTHALA", "15:00", -1],

  // --- 14. Nawanshahr & Shivalik Link (Jalandhar ⇄ Nawanshahr ⇄ Balachaur ⇄ Chandigarh) ---
  ["Punbus", "Ordinary", "E", "DOABA_NAWANSHAHR", "06:00", 1],
  ["PRTC PEPSU", "Ordinary", "L", "DOABA_NAWANSHAHR", "08:45", 1],
  ["Orbit Aviators", "Volvo AC", "E", "DOABA_NAWANSHAHR", "11:30", 1],
  ["Punbus", "HVAC Semi-Deluxe", "E", "DOABA_NAWANSHAHR", "14:45", 1],
  ["PRTC PEPSU", "Ordinary", "E", "DOABA_NAWANSHAHR", "17:30", 1],
  ["Punbus", "Ordinary", "E", "DOABA_NAWANSHAHR", "07:00", -1],
  ["Orbit Aviators", "Volvo AC", "E", "DOABA_NAWANSHAHR", "10:15", -1],
  ["PRTC PEPSU", "Ordinary", "L", "DOABA_NAWANSHAHR", "13:30", -1],
  ["Punbus", "HVAC Semi-Deluxe", "E", "DOABA_NAWANSHAHR", "16:45", -1],

  // --- 15. Hoshiarpur to Capital (Hoshiarpur ⇄ Garhshankar ⇄ Balachaur ⇄ Chandigarh) ---
  ["PRTC PEPSU", "Ordinary", "E", "HOSHIARPUR_CHANDIGARH", "06:30", 1],
  ["Punbus", "HVAC Semi-Deluxe", "E", "HOSHIARPUR_CHANDIGARH", "09:15", 1],
  ["Punbus", "Ordinary", "L", "HOSHIARPUR_CHANDIGARH", "13:30", 1],
  ["PRTC PEPSU", "Ordinary", "E", "HOSHIARPUR_CHANDIGARH", "16:45", 1],
  ["Punbus", "Ordinary", "E", "HOSHIARPUR_CHANDIGARH", "08:00", -1],
  ["PRTC PEPSU", "HVAC Semi-Deluxe", "E", "HOSHIARPUR_CHANDIGARH", "11:45", -1],
  ["Punbus", "Ordinary", "L", "HOSHIARPUR_CHANDIGARH", "15:15", -1],

  // --- 16. South-West Border Highway (Firozpur ⇄ Jalalabad ⇄ Fazilka ⇄ Abohar) ---
  ["PRTC PEPSU", "Ordinary", "E", "SOUTH_WEST_BORDER", "06:15", 1],
  ["New Deep", "Ordinary", "L", "SOUTH_WEST_BORDER", "08:45", 1],
  ["Punbus", "Ordinary", "E", "SOUTH_WEST_BORDER", "11:30", 1],
  ["New Deep", "Ordinary", "E", "SOUTH_WEST_BORDER", "14:15", 1],
  ["PRTC PEPSU", "HVAC Semi-Deluxe", "E", "SOUTH_WEST_BORDER", "17:00", 1],
  ["New Deep", "Ordinary", "E", "SOUTH_WEST_BORDER", "07:00", -1],
  ["Punbus", "Ordinary", "L", "SOUTH_WEST_BORDER", "09:30", -1],
  ["PRTC PEPSU", "Ordinary", "E", "SOUTH_WEST_BORDER", "13:00", -1],
  ["New Deep", "Ordinary", "L", "SOUTH_WEST_BORDER", "16:15", -1],

  // --- 17. Cotton Belt Expressway (Bathinda ⇄ Gidderbaha ⇄ Malout ⇄ Abohar ⇄ Fazilka) ---
  ["PRTC PEPSU", "Ordinary", "E", "MUKTSAR_MALOUT_ABOHAR", "06:30", 1],
  ["Orbit Aviators", "Volvo AC", "E", "MUKTSAR_MALOUT_ABOHAR", "09:00", 1],
  ["New Deep", "Ordinary", "L", "MUKTSAR_MALOUT_ABOHAR", "11:45", 1],
  ["PRTC PEPSU", "HVAC Semi-Deluxe", "E", "MUKTSAR_MALOUT_ABOHAR", "14:30", 1],
  ["Punbus", "Ordinary", "E", "MUKTSAR_MALOUT_ABOHAR", "17:15", 1],
  ["New Deep", "Ordinary", "E", "MUKTSAR_MALOUT_ABOHAR", "07:30", -1],
  ["Orbit Aviators", "Volvo AC", "E", "MUKTSAR_MALOUT_ABOHAR", "10:15", -1],
  ["PRTC PEPSU", "Ordinary", "L", "MUKTSAR_MALOUT_ABOHAR", "13:30", -1],
  ["PRTC PEPSU", "Ordinary", "E", "MUKTSAR_MALOUT_ABOHAR", "16:45", -1],

  // --- 18. Historic Muktsar Line (Faridkot ⇄ Kotkapura ⇄ Muktsar ⇄ Malout ⇄ Lambi) ---
  ["PRTC PEPSU", "Ordinary", "E", "MUKTSAR_FARIDKOT", "06:00", 1],
  ["New Deep", "Ordinary", "L", "MUKTSAR_FARIDKOT", "08:30", 1],
  ["Punbus", "Ordinary", "E", "MUKTSAR_FARIDKOT", "11:15", 1],
  ["New Deep", "Ordinary", "E", "MUKTSAR_FARIDKOT", "14:45", 1],
  ["PRTC PEPSU", "Ordinary", "L", "MUKTSAR_FARIDKOT", "17:30", 1],
  ["New Deep", "Ordinary", "E", "MUKTSAR_FARIDKOT", "07:15", -1],
  ["PRTC PEPSU", "Ordinary", "E", "MUKTSAR_FARIDKOT", "10:00", -1],
  ["Punbus", "Ordinary", "L", "MUKTSAR_FARIDKOT", "13:15", -1],
  ["New Deep", "Ordinary", "E", "MUKTSAR_FARIDKOT", "16:30", -1],

  // --- 19. Central Malwa Link (Faridkot ⇄ Baghapurana ⇄ Moga ⇄ Jagraon ⇄ Ludhiana) ---
  ["PRTC PEPSU", "Ordinary", "E", "MOGA_FARIDKOT_LUDHIANA", "06:30", 1],
  ["Jujhar", "HVAC Semi-Deluxe", "E", "MOGA_FARIDKOT_LUDHIANA", "09:00", 1],
  ["Punbus", "Ordinary", "L", "MOGA_FARIDKOT_LUDHIANA", "12:15", 1],
  ["New Deep", "Ordinary", "E", "MOGA_FARIDKOT_LUDHIANA", "15:30", 1],
  ["PRTC PEPSU", "Ordinary", "L", "MOGA_FARIDKOT_LUDHIANA", "18:00", 1],
  ["Jujhar", "HVAC Semi-Deluxe", "E", "MOGA_FARIDKOT_LUDHIANA", "07:45", -1],
  ["PRTC PEPSU", "Ordinary", "E", "MOGA_FARIDKOT_LUDHIANA", "10:30", -1],
  ["Punbus", "Ordinary", "L", "MOGA_FARIDKOT_LUDHIANA", "14:00", -1],
  ["New Deep", "Ordinary", "E", "MOGA_FARIDKOT_LUDHIANA", "16:45", -1],

  // --- 20. South Malwa Spine (Patiala ⇄ Samana ⇄ Patran ⇄ Sunam ⇄ Sangrur ⇄ Mansa ⇄ Bathinda) ---
  ["PRTC PEPSU", "Ordinary", "E", "PATIALA_MANSA_BATHINDA", "05:30", 1],
  ["PRTC PEPSU", "Ordinary", "L", "PATIALA_MANSA_BATHINDA", "08:00", 1],
  ["Orbit Aviators", "Volvo AC", "E", "PATIALA_MANSA_BATHINDA", "10:45", 1],
  ["New Deep", "Ordinary", "L", "PATIALA_MANSA_BATHINDA", "13:15", 1],
  ["PRTC PEPSU", "HVAC Semi-Deluxe", "E", "PATIALA_MANSA_BATHINDA", "16:00", 1],
  ["PRTC PEPSU", "Ordinary", "E", "PATIALA_MANSA_BATHINDA", "06:45", -1],
  ["Orbit Aviators", "Volvo AC", "E", "PATIALA_MANSA_BATHINDA", "09:30", -1],
  ["New Deep", "Ordinary", "L", "PATIALA_MANSA_BATHINDA", "12:45", -1],
  ["PRTC PEPSU", "Ordinary", "E", "PATIALA_MANSA_BATHINDA", "15:30", -1],

  // --- 21. Southern Border Corridor (Sangrur ⇄ Sunam ⇄ Mansa ⇄ Budhlada ⇄ Sardulgarh) ---
  ["PRTC PEPSU", "Ordinary", "L", "MANSA_SARDULGARH", "06:15", 1],
  ["Punbus", "Ordinary", "E", "MANSA_SARDULGARH", "09:30", 1],
  ["New Deep", "Ordinary", "L", "MANSA_SARDULGARH", "13:00", 1],
  ["PRTC PEPSU", "Ordinary", "E", "MANSA_SARDULGARH", "16:30", 1],
  ["Punbus", "Ordinary", "L", "MANSA_SARDULGARH", "07:30", -1],
  ["PRTC PEPSU", "Ordinary", "E", "MANSA_SARDULGARH", "11:15", -1],
  ["New Deep", "Ordinary", "L", "MANSA_SARDULGARH", "15:00", -1],

  // --- 22. Bathinda Sub-division Circuit (Bathinda ⇄ Rampura ⇄ Talwandi Sabo ⇄ Raman) ---
  ["PRTC PEPSU", "Ordinary", "L", "TALWANDI_SABO_CIRCUIT", "06:30", 1],
  ["Local Mini Bus", "Mini Bus", "L", "TALWANDI_SABO_CIRCUIT", "09:15", 1],
  ["PRTC PEPSU", "Ordinary", "E", "TALWANDI_SABO_CIRCUIT", "12:45", 1],
  ["Local Mini Bus", "Mini Bus", "L", "TALWANDI_SABO_CIRCUIT", "15:30", 1],
  ["PRTC PEPSU", "Ordinary", "L", "TALWANDI_SABO_CIRCUIT", "18:15", 1],
  ["Local Mini Bus", "Mini Bus", "L", "TALWANDI_SABO_CIRCUIT", "07:45", -1],
  ["PRTC PEPSU", "Ordinary", "E", "TALWANDI_SABO_CIRCUIT", "10:30", -1],
  ["PRTC PEPSU", "Ordinary", "L", "TALWANDI_SABO_CIRCUIT", "14:15", -1],

  // --- 23. Ludhiana to Barnala (Ludhiana ⇄ Raikot ⇄ Barnala ⇄ Tapa) ---
  ["PRTC PEPSU", "Ordinary", "E", "LUDHIANA_BARNALA", "06:45", 1],
  ["Libra", "HVAC Semi-Deluxe", "E", "LUDHIANA_BARNALA", "09:15", 1],
  ["Local Mini Bus", "Mini Bus", "L", "LUDHIANA_BARNALA", "12:30", 1],
  ["PRTC PEPSU", "Ordinary", "L", "LUDHIANA_BARNALA", "15:15", 1],
  ["New Deep", "Ordinary", "E", "LUDHIANA_BARNALA", "18:00", 1],
  ["Libra", "HVAC Semi-Deluxe", "E", "LUDHIANA_BARNALA", "08:00", -1],
  ["PRTC PEPSU", "Ordinary", "E", "LUDHIANA_BARNALA", "10:45", -1],
  ["Local Mini Bus", "Mini Bus", "L", "LUDHIANA_BARNALA", "14:00", -1],
  ["PRTC PEPSU", "Ordinary", "L", "LUDHIANA_BARNALA", "16:45", -1],

  // --- 24. Malerkotla Heart of Malwa (Ludhiana ⇄ Ahmedgarh ⇄ Malerkotla ⇄ Nabha ⇄ Patiala) ---
  ["PRTC PEPSU", "Ordinary", "E", "LUDHIANA_MALERKOTLA_PATIALA", "06:15", 1],
  ["Libra", "HVAC Semi-Deluxe", "E", "LUDHIANA_MALERKOTLA_PATIALA", "08:45", 1],
  ["PRTC PEPSU", "Ordinary", "L", "LUDHIANA_MALERKOTLA_PATIALA", "11:30", 1],
  ["Local Mini Bus", "Mini Bus", "L", "LUDHIANA_MALERKOTLA_PATIALA", "14:15", 1],
  ["PRTC PEPSU", "Ordinary", "E", "LUDHIANA_MALERKOTLA_PATIALA", "17:00", 1],
  ["PRTC PEPSU", "Ordinary", "E", "LUDHIANA_MALERKOTLA_PATIALA", "07:30", -1],
  ["Libra", "HVAC Semi-Deluxe", "E", "LUDHIANA_MALERKOTLA_PATIALA", "10:00", -1],
  ["PRTC PEPSU", "Ordinary", "L", "LUDHIANA_MALERKOTLA_PATIALA", "13:00", -1],
  ["PRTC PEPSU", "Ordinary", "E", "LUDHIANA_MALERKOTLA_PATIALA", "15:45", -1],

  // --- 25. Tricity & Shivalik Bypass (Chandigarh ⇄ Mohali ⇄ Kharar ⇄ Chamkaur ⇄ Ropar) ---
  ["CTU", "Ordinary", "L", "MOHALI_ROPAR_SHIVALIK", "06:45", 1],
  ["Punbus", "Ordinary", "E", "MOHALI_ROPAR_SHIVALIK", "09:30", 1],
  ["Local Mini Bus", "Mini Bus", "L", "MOHALI_ROPAR_SHIVALIK", "13:00", 1],
  ["Punbus", "HVAC Semi-Deluxe", "E", "MOHALI_ROPAR_SHIVALIK", "16:15", 1],
  ["Punbus", "Ordinary", "E", "MOHALI_ROPAR_SHIVALIK", "08:15", -1],
  ["CTU", "Ordinary", "L", "MOHALI_ROPAR_SHIVALIK", "11:00", -1],
  ["Punbus", "Ordinary", "L", "MOHALI_ROPAR_SHIVALIK", "14:45", -1],

  // --- 26. Historic Sirhind Circuit (Chandigarh ⇄ Zirakpur ⇄ Rajpura ⇄ Sirhind ⇄ Khanna) ---
  ["PRTC PEPSU", "Ordinary", "L", "FATEHGARH_PATIALA_CIRCUIT", "06:30", 1],
  ["Punbus", "Ordinary", "E", "FATEHGARH_PATIALA_CIRCUIT", "09:15", 1],
  ["Local Mini Bus", "Mini Bus", "L", "FATEHGARH_PATIALA_CIRCUIT", "12:45", 1],
  ["PRTC PEPSU", "Ordinary", "E", "FATEHGARH_PATIALA_CIRCUIT", "15:30", 1],
  ["Punbus", "Ordinary", "L", "FATEHGARH_PATIALA_CIRCUIT", "08:00", -1],
  ["PRTC PEPSU", "Ordinary", "E", "FATEHGARH_PATIALA_CIRCUIT", "11:00", -1],
  ["PRTC PEPSU", "Ordinary", "L", "FATEHGARH_PATIALA_CIRCUIT", "14:15", -1],

  // --- 27. Doaba to Malwa Cross-River (Jalandhar ⇄ Nakodar ⇄ Shahkot ⇄ Moga) ---
  ["Punbus", "Ordinary", "E", "JALANDHAR_NAKODAR_MOGA", "06:45", 1],
  ["PRTC PEPSU", "Ordinary", "L", "JALANDHAR_NAKODAR_MOGA", "10:00", 1],
  ["Local Mini Bus", "Mini Bus", "L", "JALANDHAR_NAKODAR_MOGA", "13:30", 1],
  ["Punbus", "Ordinary", "E", "JALANDHAR_NAKODAR_MOGA", "16:45", 1],
  ["PRTC PEPSU", "Ordinary", "E", "JALANDHAR_NAKODAR_MOGA", "08:15", -1],
  ["Punbus", "Ordinary", "L", "JALANDHAR_NAKODAR_MOGA", "11:45", -1],
  ["PRTC PEPSU", "Ordinary", "E", "JALANDHAR_NAKODAR_MOGA", "15:15", -1],

  // --- 28. Kandi Canal Belt (Hoshiarpur ⇄ Dasuya ⇄ Mukerian ⇄ Talwara) ---
  ["Punbus", "Ordinary", "L", "HOSHIARPUR_TALWARA", "06:30", 1],
  ["PRTC PEPSU", "Ordinary", "E", "HOSHIARPUR_TALWARA", "10:15", 1],
  ["Local Mini Bus", "Mini Bus", "L", "HOSHIARPUR_TALWARA", "14:00", 1],
  ["Punbus", "Ordinary", "E", "HOSHIARPUR_TALWARA", "17:15", 1],
  ["PRTC PEPSU", "Ordinary", "L", "HOSHIARPUR_TALWARA", "08:00", -1],
  ["Punbus", "Ordinary", "E", "HOSHIARPUR_TALWARA", "12:00", -1],
  ["Local Mini Bus", "Mini Bus", "L", "HOSHIARPUR_TALWARA", "15:45", -1],

  // --- 29. Ambala to Chandigarh Link ---
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

// All unique stops across all 23 districts of Punjab (alphabetically sorted)
export const STOPS = Array.from(
  new Set(Object.values(ROUTES).flatMap((route) => route.map(([name]) => name)))
).sort();

// Comprehensive list of Punjab bus stands, stops, and regional transit landmarks across all 23 districts
export const ALL_PUNJAB_LOCATIONS: string[] = Array.from(
  new Set([
    ...STOPS,
    "Zirakpur Bus Stand",
    "Mohali Phase 7 Bus Stand",
    "Mohali Phase 8 Bus Stand",
    "Mohali Phase 11 Bus Stand",
    "Sector 43 ISBT Chandigarh",
    "Sector 17 ISBT Chandigarh",
    "CU Gharuan Gate 1",
    "CU Gharuan Gate 2",
    "Amritsar Golden Temple Stand",
    "Attari Wagah Border",
    "Harike Pattan Wetland",
    "Makhu Bus Stand",
    "Bagha Purana Bus Stand",
    "Nihal Singh Wala Bus Stand",
    "Dhariwal Bus Stand",
    "Gardhiwala Bus Stand",
    "Sham Chaurasi Bus Stand",
    "Amargarh Bus Stand",
    "Dhuri Bus Stand",
    "Lehragaga Bus Stand",
    "Ghanaur Bus Stand",
    "Tapa Bus Stand",
    "Bhadaur Bus Stand",
    "Mehal Kalan Bus Stand",
    "Goniana Mandi Bus Stand",
    "Bhucho Mandi Bus Stand",
    "Jhunir Bus Stand",
    "Bareta Bus Stand",
    "Longowal Bus Stand",
    "Cheema Jodhpur Bus Stand",
    "Bhawanigarh Bus Stand",
    "Banur Bus Stand",
    "Lalru Bus Stand",
    "Kurali Bypass",
    "Rupnagar Old Bus Stand",
    "Sri Anandpur Sahib Bus Stand",
    "Nangal Dam Bus Stand",
    "Bassi Pathana Bus Stand",
    "Mandi Gobindgarh GT Road",
    "Doraha Bus Stand",
    "Sahnewal Bus Stand",
    "Samrala Chowk Ludhiana",
    "Jalandhar Bypass Ludhiana",
    "PAP Chowk Jalandhar",
    "Rama Mandi Jalandhar",
    "Phagwara Sugar Mill Chowk",
    "Amritsar Railway Station",
    "Ludhiana Railway Station",
    "Jalandhar City Railway Station",
    "Dera Bassi Highway Junction"
  ])
).sort();

// Curated Popular Trips covering all regions of Punjab (Majha, Doaba, and Malwa)
export const POPULAR_TRIPS: [string, string][] = [
  ["Chandigarh ISBT 43", "Amritsar ISBT"],
  ["Chandigarh ISBT 43", "Ludhiana Bus Stand"],
  ["Ludhiana Bus Stand", "Jalandhar Central Bus Stand"],
  ["Jalandhar Central Bus Stand", "Amritsar ISBT"],
  ["Chandigarh ISBT 43", "Patiala Central Bus Stand"],
  ["Patiala Central Bus Stand", "Bathinda Central Bus Stand"],
  ["Ludhiana Bus Stand", "Moga Central Bus Stand"],
  ["Amritsar ISBT", "Bathinda Central Bus Stand"],
  ["Amritsar ISBT", "Pathankot Bus Stand"],
  ["Jalandhar Central Bus Stand", "Hoshiarpur Bus Stand"],
  ["Ludhiana Bus Stand", "Barnala Bus Stand"],
  ["Bathinda Central Bus Stand", "Mansa Central Bus Stand"],
  ["Firozpur Cantt Bus Stand", "Fazilka Central Bus Stand"],
  ["Gurdaspur Central Bus Stand", "Batala Bus Stand"],
  ["Chandigarh ISBT 43", "Rupnagar (Ropar) Bus Stand"],
  ["Gharuan (CU Gate 2)", "Ludhiana Bus Stand"],
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
 * Verified Depot & Bus Stand Helpdesks across all 23 Punjab Districts
 */
export const INQUIRY_CONTACTS: InquiryContact[] = [
  {
    "id": "amritsar-isbt",
    "title": "Amritsar Shaheed Dhingra ISBT Inquiry",
    "location": "Near Railway Link Road, Amritsar (Majha)",
    "phone": "01832551734",
    "displayPhone": "0183-2551734",
    "category": "inquiry",
    "timings": "24x7 Control Room",
    "notes": "Main terminal control for Golden Temple express buses, Jalandhar, Chandigarh, and Jammu routes (Majha)."
  },
  {
    "id": "majitha-bus-stand",
    "title": "Majitha Bus Stand Inquiry",
    "location": "Main Chowk, Majitha, Amritsar District (Majha)",
    "phone": "01832762211",
    "displayPhone": "0183-2762211",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Serves local Majha commuter buses towards Amritsar, Fatehgarh Churian, and Batala."
  },
  {
    "id": "attari-bus-stand",
    "title": "Attari (Wagah Border) Bus Stand Helpdesk",
    "location": "GT Road Border Terminal, Attari, Amritsar (Majha)",
    "phone": "01832382100",
    "displayPhone": "0183-2382100",
    "category": "inquiry",
    "timings": "06:00 AM – 08:00 PM",
    "notes": "International border terminal for tourist shuttles, Punbus local services, and Amritsar city link."
  },
  {
    "id": "beas-bus-stand",
    "title": "Beas Bus Stand Helpdesk",
    "location": "GT Road Highway Bypass, Beas, Amritsar (Majha)",
    "phone": "01853273120",
    "displayPhone": "01853-273120",
    "category": "inquiry",
    "timings": "05:30 AM – 10:00 PM",
    "notes": "Dera Radha Soami Satsang hub connecting Jalandhar, Kartarpur, and Amritsar on NH-3."
  },
  {
    "id": "jandiala-guru-bus-stand",
    "title": "Jandiala Guru Bus Stand Helpdesk",
    "location": "GT Road Junction, Jandiala Guru, Amritsar (Majha)",
    "phone": "01832422310",
    "displayPhone": "0183-2422310",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Key GT Road suburban boarding point for Rayya, Beas, and Amritsar express stages."
  },
  {
    "id": "rayya-bus-stand",
    "title": "Rayya Bus Stand Inquiry Desk",
    "location": "National Highway 3, Rayya, Amritsar (Majha)",
    "phone": "01853252110",
    "displayPhone": "01853-252110",
    "category": "inquiry",
    "timings": "06:00 AM – 09:00 PM",
    "notes": "Subdivision hub connecting Baba Bakala Sahib, Beas, and Amritsar intercity buses."
  },
  {
    "id": "gurdaspur-central-bus-stand",
    "title": "Gurdaspur Central Bus Stand Inquiry",
    "location": "GT Road, Gurdaspur (Majha)",
    "phone": "01874240245",
    "displayPhone": "01874-240245",
    "category": "depot",
    "timings": "24x7 Control Room",
    "notes": "Punbus Depot #24 control connecting Batala, Dinanagar, Mukerian, and Pathankot (Majha)."
  },
  {
    "id": "batala-bus-stand",
    "title": "Batala Bus Stand Control Room",
    "location": "Jalandhar Road, Batala, Gurdaspur (Majha)",
    "phone": "01871242330",
    "displayPhone": "01871-242330",
    "category": "inquiry",
    "timings": "05:30 AM – 10:00 PM",
    "notes": "Major historic industrial hub connecting Amritsar, Qadian, Dera Baba Nanak, and Jalandhar."
  },
  {
    "id": "dera-baba-nanak-bus-stand",
    "title": "Dera Baba Nanak Bus Stand Helpdesk",
    "location": "Kartarpur Corridor Highway, Dera Baba Nanak (Majha)",
    "phone": "01871247220",
    "displayPhone": "01871-247220",
    "category": "inquiry",
    "timings": "06:00 AM – 08:00 PM",
    "notes": "Historic Kartarpur Sahib pilgrimage corridor gateway connecting Kalanaur, Batala, and Amritsar."
  },
  {
    "id": "dinanagar-bus-stand",
    "title": "Dinanagar Bus Stand Inquiry",
    "location": "NH-54 Highway Stop, Dinanagar, Gurdaspur (Majha)",
    "phone": "01875220130",
    "displayPhone": "01875-220130",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Northern border subdivision connecting Gurdaspur, Narot Jaimal Singh, and Pathankot."
  },
  {
    "id": "fatehgarh-churian-bus-stand",
    "title": "Fatehgarh Churian Bus Stand Helpdesk",
    "location": "Amritsar Road, Fatehgarh Churian, Gurdaspur (Majha)",
    "phone": "01871258210",
    "displayPhone": "01871-258210",
    "category": "inquiry",
    "timings": "06:00 AM – 08:00 PM",
    "notes": "Border tehsil hub connecting Dera Baba Nanak, Majitha, and Amritsar."
  },
  {
    "id": "kalanaur-bus-stand",
    "title": "Kalanaur Bus Stand Control Desk",
    "location": "Batala-Dera Baba Nanak Road, Kalanaur (Majha)",
    "phone": "01874250100",
    "displayPhone": "01874-250100",
    "category": "inquiry",
    "timings": "06:00 AM – 08:00 PM",
    "notes": "Akbar coronation historic town transit desk for Gurdaspur and Batala mini buses."
  },
  {
    "id": "qadian-bus-stand",
    "title": "Qadian Bus Stand Inquiry",
    "location": "Batala Road, Qadian, Gurdaspur (Majha)",
    "phone": "01872220410",
    "displayPhone": "01872-220410",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "International convention town hub connecting Batala, Harchowal, and Sri Hargobindpur."
  },
  {
    "id": "sri-hargobindpur-bus-stand",
    "title": "Sri Hargobindpur Bus Stand Desk",
    "location": "Beas River Highway, Sri Hargobindpur (Majha)",
    "phone": "01871262100",
    "displayPhone": "01871-262100",
    "category": "inquiry",
    "timings": "06:00 AM – 08:00 PM",
    "notes": "Majha-Doaba river crossing junction linking Batala, Tanda Urmar, and Hoshiarpur."
  },
  {
    "id": "pathankot-bus-stand",
    "title": "Pathankot Maharana Pratap ISBT Inquiry",
    "location": "Pathankot Intercity Terminal (Majha)",
    "phone": "01862220042",
    "displayPhone": "0186-2220042",
    "category": "depot",
    "timings": "24x7 Control Room",
    "notes": "Northern border gateway linking Jammu & Kashmir, Himachal, Hoshiarpur, and Jalandhar (Majha)."
  },
  {
    "id": "sujanpur-bus-stand",
    "title": "Sujanpur Bus Stand Helpdesk",
    "location": "NH-44 Jammu Highway, Sujanpur, Pathankot (Majha)",
    "phone": "01862244120",
    "displayPhone": "0186-2244120",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Ravi River border town connecting Madhopur, Kathua (J&K), and Pathankot city."
  },
  {
    "id": "tarn-taran-bus-stand",
    "title": "Tarn Taran Central Bus Stand Inquiry",
    "location": "Amritsar Road, Tarn Taran (Majha)",
    "phone": "01852222400",
    "displayPhone": "01852-222400",
    "category": "depot",
    "timings": "24x7 Control Room",
    "notes": "Central Majha junction connecting Patti, Bhikhiwind, Goindwal, Harike, and Amritsar (Majha)."
  },
  {
    "id": "patti-bus-stand",
    "title": "Patti Bus Stand Control Desk",
    "location": "Khemkaran Road, Patti, Tarn Taran (Majha)",
    "phone": "01851244220",
    "displayPhone": "01851-244220",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Border tehsil hub for Harike Pattan, Khemkaran, and Amritsar stage carriage services."
  },
  {
    "id": "bhikhiwind-bus-stand",
    "title": "Bhikhiwind Bus Stand Inquiry",
    "location": "Khemkaran Highway, Bhikhiwind, Tarn Taran (Majha)",
    "phone": "01851272100",
    "displayPhone": "01851-272100",
    "category": "inquiry",
    "timings": "06:00 AM – 08:00 PM",
    "notes": "Strategic border nexus linking Khalra, Patti, Tarn Taran, and Amritsar."
  },
  {
    "id": "khemkaran-bus-stand",
    "title": "Khemkaran Bus Stand Helpdesk",
    "location": "Asal Uttar Border Road, Khemkaran (Majha)",
    "phone": "01851260110",
    "displayPhone": "01851-260110",
    "category": "inquiry",
    "timings": "06:30 AM – 07:30 PM",
    "notes": "Border terminus serving historic Patton Nagar memorial belt and Bhikhiwind connectors."
  },
  {
    "id": "goindwal-sahib-bus-stand",
    "title": "Goindwal Sahib Bus Stand Helpdesk",
    "location": "Gurdwara Baoli Sahib Link, Goindwal Sahib (Majha)",
    "phone": "01859222150",
    "displayPhone": "01859-222150",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Historic heritage pilgrimage town connecting Kapurthala, Sultanpur Lodhi, and Khadoor Sahib."
  },
  {
    "id": "khadoor-sahib-bus-stand",
    "title": "Khadoor Sahib Bus Stand Desk",
    "location": "Fatehabad Road, Khadoor Sahib, Tarn Taran (Majha)",
    "phone": "01859234120",
    "displayPhone": "01859-234120",
    "category": "inquiry",
    "timings": "06:00 AM – 08:00 PM",
    "notes": "Pilgrimage link connecting Goindwal, Rayya, and Tarn Taran city."
  },
  {
    "id": "harike-pattan-bus-stand",
    "title": "Harike Pattan Bus Stand Helpdesk",
    "location": "NH-54 Bird Sanctuary Junction, Harike (Majha/Malwa)",
    "phone": "01851248100",
    "displayPhone": "01851-248100",
    "category": "inquiry",
    "timings": "06:00 AM – 09:00 PM",
    "notes": "Confluence of Sutlej & Beas rivers, connecting Majha (Tarn Taran/Amritsar) with Malwa (Makhu/Firozpur)."
  },
  {
    "id": "jalandhar-isbt",
    "title": "Jalandhar Shaheed-e-Azam ISBT Inquiry",
    "location": "Jalandhar Central Bus Stand, Garha Road (Doaba)",
    "phone": "01812223755",
    "displayPhone": "0181-2223755",
    "category": "depot",
    "timings": "24x7 Control Room",
    "notes": "Doaba regional hub connecting Amritsar, Pathankot, Hoshiarpur, Ludhiana, and Chandigarh (Doaba)."
  },
  {
    "id": "adampur-bus-stand",
    "title": "Adampur Bus Stand Inquiry Desk",
    "location": "Airport Highway, Adampur, Jalandhar (Doaba)",
    "phone": "01812751200",
    "displayPhone": "0181-2751200",
    "category": "inquiry",
    "timings": "06:00 AM – 09:00 PM",
    "notes": "Civil airport town transit link connecting Hoshiarpur, Bhogpur, and Jalandhar."
  },
  {
    "id": "bhogpur-bus-stand",
    "title": "Bhogpur Bus Stand Helpdesk",
    "location": "GT Road / NH-44, Bhogpur, Jalandhar (Doaba)",
    "phone": "01812692130",
    "displayPhone": "0181-2692130",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Industrial cooperative sugar mill town connecting Tanda Urmar, Dasuya, and Jalandhar."
  },
  {
    "id": "goraya-bus-stand",
    "title": "Goraya Bus Stand Helpdesk",
    "location": "GT Road Highway Stop, Goraya, Jalandhar (Doaba)",
    "phone": "01826262150",
    "displayPhone": "01826-262150",
    "category": "inquiry",
    "timings": "06:00 AM – 09:30 PM",
    "notes": "High-density GT Road stop connecting Phagwara, Phillaur, and Ludhiana."
  },
  {
    "id": "kartarpur-bus-stand",
    "title": "Kartarpur Bus Stand Helpdesk",
    "location": "GT Road, Kartarpur, Jalandhar (Doaba)",
    "phone": "01812802200",
    "displayPhone": "0181-2802200",
    "category": "inquiry",
    "timings": "06:00 AM – 09:00 PM",
    "notes": "Jang-e-Azadi Memorial hub connecting Jalandhar with Subhanpur, Beas, and Amritsar."
  },
  {
    "id": "nakodar-bus-stand",
    "title": "Nakodar Bus Stand Control Room",
    "location": "Shahkot Road, Nakodar, Jalandhar (Doaba)",
    "phone": "01821220130",
    "displayPhone": "01821-220130",
    "category": "inquiry",
    "timings": "06:00 AM – 09:00 PM",
    "notes": "Sufi shrine town junction for Jalandhar, Shahkot, Dharamkot, and Moga routes."
  },
  {
    "id": "phillaur-bus-stand",
    "title": "Phillaur Bus Stand Helpdesk",
    "location": "Sutlej River Bridge / GT Road, Phillaur (Doaba)",
    "phone": "01826222120",
    "displayPhone": "01826-222120",
    "category": "inquiry",
    "timings": "06:00 AM – 09:30 PM",
    "notes": "Historic police academy town and Sutlej river gate connecting Doaba with Ludhiana (Malwa)."
  },
  {
    "id": "shahkot-bus-stand",
    "title": "Shahkot Bus Stand Inquiry",
    "location": "Moga Highway, Shahkot, Jalandhar (Doaba)",
    "phone": "01821260100",
    "displayPhone": "01821-260100",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Doaba-Malwa bridge junction connecting Nakodar, Mehatpur, and Dharamkot/Moga."
  },
  {
    "id": "kapurthala-central-bus-stand",
    "title": "Kapurthala Central Bus Stand Helpdesk",
    "location": "Circular Road, Kapurthala (Doaba)",
    "phone": "01822233480",
    "displayPhone": "01822-233480",
    "category": "depot",
    "timings": "24x7 Control Room",
    "notes": "Heritage city hub connecting Sultanpur Lodhi, Subhanpur, Kartarpur, and Jalandhar (Doaba)."
  },
  {
    "id": "phagwara-bus-stand",
    "title": "Phagwara Central Bus Stand Helpdesk",
    "location": "GT Road, Phagwara, Kapurthala (Doaba)",
    "phone": "01824260233",
    "displayPhone": "01824-260233",
    "category": "depot",
    "timings": "24x7 Control Room",
    "notes": "High-frequency GT Road nexus linking Ludhiana, Jalandhar, Nawanshahr, and Hoshiarpur (Doaba)."
  },
  {
    "id": "sultanpur-lodhi-bus-stand",
    "title": "Sultanpur Lodhi Bus Stand Control Desk",
    "location": "Gurdwara Ber Sahib Link, Sultanpur Lodhi (Doaba)",
    "phone": "01828222140",
    "displayPhone": "01828-222140",
    "category": "inquiry",
    "timings": "05:30 AM – 09:30 PM",
    "notes": "Guru Nanak 550th Prakash Purb pilgrim center connecting Kapurthala, Lohian Khas, and Goindwal."
  },
  {
    "id": "bholath-bus-stand",
    "title": "Bholath Bus Stand Helpdesk",
    "location": "Subhanpur Road, Bholath, Kapurthala (Doaba)",
    "phone": "01822244220",
    "displayPhone": "01822-244220",
    "category": "inquiry",
    "timings": "06:00 AM – 08:00 PM",
    "notes": "Doaba NRI heartland subdivision connecting Nadala, Begowal, and Kapurthala."
  },
  {
    "id": "nadala-bus-stand",
    "title": "Nadala Bus Stand Desk",
    "location": "Main Bazaar Chowk, Nadala, Kapurthala (Doaba)",
    "phone": "01822271100",
    "displayPhone": "01822-271100",
    "category": "inquiry",
    "timings": "06:30 AM – 08:00 PM",
    "notes": "Local transit junction serving Bholath, Subhanpur, and Kartarpur routes."
  },
  {
    "id": "subhanpur-bus-stand",
    "title": "Subhanpur Bus Stand Inquiry",
    "location": "GT Road NH-3 Junction, Subhanpur (Doaba)",
    "phone": "01822263150",
    "displayPhone": "01822-263150",
    "category": "inquiry",
    "timings": "06:00 AM – 09:00 PM",
    "notes": "Intersection connecting Kapurthala district headquarters with GT Road (Beas-Amritsar)."
  },
  {
    "id": "hoshiarpur-central-bus-stand",
    "title": "Hoshiarpur Central Bus Stand Helpdesk",
    "location": "Bus Stand Road, Hoshiarpur (Doaba)",
    "phone": "01882222336",
    "displayPhone": "01882-222336",
    "category": "depot",
    "timings": "24x7 Control Room",
    "notes": "Doaba sub-mountainous junction for Dasuya, Nangal, Balachaur, and Jalandhar routes (Doaba)."
  },
  {
    "id": "dasuya-bus-stand",
    "title": "Dasuya Bus Stand Control Room",
    "location": "GT Road / NH-44, Dasuya, Hoshiarpur (Doaba)",
    "phone": "01883285140",
    "displayPhone": "01883-285140",
    "category": "inquiry",
    "timings": "06:00 AM – 09:30 PM",
    "notes": "Epic Virat Nagari subdivision on NH-44 connecting Mukerian, Tanda, and Pathankot."
  },
  {
    "id": "mukerian-bus-stand",
    "title": "Mukerian Bus Stand Inquiry",
    "location": "GT Road, Mukerian, Hoshiarpur (Doaba)",
    "phone": "01883244230",
    "displayPhone": "01883-244230",
    "category": "inquiry",
    "timings": "06:00 AM – 09:30 PM",
    "notes": "Major Hydel project and sugar hub linking Pathankot, Talwara, and Jalandhar."
  },
  {
    "id": "tanda-urmar-bus-stand",
    "title": "Tanda Urmar Bus Stand Helpdesk",
    "location": "NH-44 Highway Intersection, Tanda Urmar (Doaba)",
    "phone": "01886222120",
    "displayPhone": "01886-222120",
    "category": "inquiry",
    "timings": "06:00 AM – 09:00 PM",
    "notes": "Twin-town junction for Sri Hargobindpur (Majha link), Dasuya, and Bhogpur/Jalandhar."
  },
  {
    "id": "garhshankar-bus-stand",
    "title": "Garhshankar Bus Stand Inquiry",
    "location": "Anandpur-Nawanshahr Road, Garhshankar (Doaba)",
    "phone": "01884282130",
    "displayPhone": "01884-282130",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Shivalik foothill crossroad linking Mahilpur, Balachaur, Nawanshahr, and Anandpur Sahib."
  },
  {
    "id": "mahilpur-bus-stand",
    "title": "Mahilpur Bus Stand Desk",
    "location": "Hoshiarpur-Chandigarh Road, Mahilpur (Doaba)",
    "phone": "01884245100",
    "displayPhone": "01884-245100",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Punjab's football cradle hub connecting Hoshiarpur with Garhshankar and Chandigarh."
  },
  {
    "id": "hariana-bus-stand",
    "title": "Hariana Bus Stand Helpdesk",
    "location": "Dasuya Road, Hariana, Hoshiarpur (Doaba)",
    "phone": "01882258200",
    "displayPhone": "01882-258200",
    "category": "inquiry",
    "timings": "06:30 AM – 08:00 PM",
    "notes": "Historic town transit desk for local Kandi belt commuter routes."
  },
  {
    "id": "hajipur-bus-stand",
    "title": "Hajipur Bus Stand Desk",
    "location": "Talwara Road, Hajipur, Hoshiarpur (Doaba)",
    "phone": "01883270110",
    "displayPhone": "01883-270110",
    "category": "inquiry",
    "timings": "06:30 AM – 08:00 PM",
    "notes": "Kandi canal valley stop connecting Mukerian with Talwara and Pong Dam."
  },
  {
    "id": "talwara-bus-stand",
    "title": "Talwara Bus Stand Inquiry",
    "location": "Pong Dam Road, Talwara Township (Doaba)",
    "phone": "01883230240",
    "displayPhone": "01883-230240",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Pong Dam border township linking Himachal Pradesh (Kangra) and Mukerian/Hoshiarpur."
  },
  {
    "id": "nawanshahr-central-bus-stand",
    "title": "Nawanshahr Central Bus Stand Control",
    "location": "Chandigarh Road, Nawanshahr (Doaba)",
    "phone": "01823222020",
    "displayPhone": "01823-222020",
    "category": "depot",
    "timings": "24x7 Control Room",
    "notes": "Central SBS Nagar terminal connecting Banga, Balachaur, Ropar, and Jalandhar (Doaba)."
  },
  {
    "id": "banga-bus-stand",
    "title": "Banga Bus Stand Helpdesk",
    "location": "Phagwara-Chandigarh Highway, Banga (Doaba)",
    "phone": "01823260140",
    "displayPhone": "01823-260140",
    "category": "inquiry",
    "timings": "06:00 AM – 09:00 PM",
    "notes": "Shaheed Bhagat Singh ancestral region hub (Khatkar Kalan link) connecting Phagwara and Nawanshahr."
  },
  {
    "id": "balachaur-bus-stand",
    "title": "Balachaur Bus Stand Inquiry",
    "location": "Ropar Highway, Balachaur, SBS Nagar (Doaba)",
    "phone": "01887222130",
    "displayPhone": "01887-222130",
    "category": "inquiry",
    "timings": "06:00 AM – 09:00 PM",
    "notes": "Crucial Doaba-Shivalik bypass terminal connecting Hoshiarpur, Garhshankar, and Ropar/Chandigarh."
  },
  {
    "id": "rahon-bus-stand",
    "title": "Rahon Bus Stand Helpdesk",
    "location": "Machhiwara Road, Rahon, SBS Nagar (Doaba)",
    "phone": "01823240120",
    "displayPhone": "01823-240120",
    "category": "inquiry",
    "timings": "06:00 AM – 08:00 PM",
    "notes": "Historic town connecting Nawanshahr with Sutlej river crossing to Machhiwara (Ludhiana)."
  },
  {
    "id": "ldh-bus-stand",
    "title": "Ludhiana Central Bus Stand Inquiry",
    "location": "Near Bharat Nagar Chowk, Ludhiana (Malwa)",
    "phone": "01612447015",
    "displayPhone": "0161-2447015",
    "category": "depot",
    "timings": "24x7 Control Room",
    "notes": "Punjab's largest transit nexus for PRTC & Punbus departures, Moga, Firozpur, and Chandigarh highway queries (Malwa)."
  },
  {
    "id": "jagraon-bus-stand",
    "title": "Jagraon Bus Stand Control Desk",
    "location": "GT Road / NH-5, Jagraon, Ludhiana (Malwa)",
    "phone": "01624222340",
    "displayPhone": "01624-222340",
    "category": "inquiry",
    "timings": "06:00 AM – 09:30 PM",
    "notes": "Lala Lajpat Rai birthplace subdivision hub connecting Ludhiana, Raikot, and Moga."
  },
  {
    "id": "khanna-bus-stand",
    "title": "Khanna Bus Stand Helpdesk",
    "location": "GT Road / NH-44, Khanna, Ludhiana (Malwa)",
    "phone": "01628226150",
    "displayPhone": "01628-226150",
    "category": "inquiry",
    "timings": "06:00 AM – 10:00 PM",
    "notes": "Asia's largest grain market terminal connecting Ludhiana with Mandi Gobindgarh, Sirhind, and Delhi."
  },
  {
    "id": "samrala-bus-stand",
    "title": "Samrala Bus Stand Inquiry",
    "location": "NH-5 Highway Bypass, Samrala, Ludhiana (Malwa)",
    "phone": "01628262100",
    "displayPhone": "01628-262100",
    "category": "inquiry",
    "timings": "06:00 AM – 09:30 PM",
    "notes": "Direct high-frequency NH-5 corridor stop connecting Chandigarh, Morinda, Khamano, and Ludhiana."
  },
  {
    "id": "raikot-bus-stand",
    "title": "Raikot Bus Stand Inquiry",
    "location": "Barnala Highway, Raikot, Ludhiana (Malwa)",
    "phone": "01624264220",
    "displayPhone": "01624-264220",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Historic Gurdwara Tahliana Sahib town linking Ludhiana, Mehal Kalan, and Barnala."
  },
  {
    "id": "doraha-bus-stand",
    "title": "Doraha Bus Stand Desk",
    "location": "GT Road / Canal Bridge, Doraha, Ludhiana (Malwa)",
    "phone": "01628258120",
    "displayPhone": "01628-258120",
    "category": "inquiry",
    "timings": "06:00 AM – 09:00 PM",
    "notes": "Canal heritage junction on NH-44 connecting Sahnewal, Khanna, and southern bypass."
  },
  {
    "id": "mullanpur-dakha-bus-stand",
    "title": "Mullanpur Dakha Bus Stand Helpdesk",
    "location": "NH-5 Highway Junction, Mullanpur Dakha (Malwa)",
    "phone": "01612882100",
    "displayPhone": "0161-2882100",
    "category": "inquiry",
    "timings": "06:00 AM – 09:00 PM",
    "notes": "Ludhiana western gateway connecting PAU, Jagraon, Raikot, and Firozpur corridors."
  },
  {
    "id": "sahnewal-bus-stand",
    "title": "Sahnewal Bus Stand Desk",
    "location": "GT Road / Airport Link, Sahnewal, Ludhiana (Malwa)",
    "phone": "01612844200",
    "displayPhone": "0161-2844200",
    "category": "inquiry",
    "timings": "06:00 AM – 09:00 PM",
    "notes": "Ludhiana domestic airport junction and eastern GT Road industrial boarding point."
  },
  {
    "id": "kohara-bus-stand",
    "title": "Kohara Highway Bus Stand",
    "location": "Chandigarh-Ludhiana Interior Road, Kohara (Malwa)",
    "phone": "01612831200",
    "displayPhone": "0161-2831200",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Interior bypass junction connecting Samrala, Machhiwara, and Ludhiana focal points."
  },
  {
    "id": "patiala-bus-stand",
    "title": "Patiala Central Bus Stand & PRTC HQ",
    "location": "Near Railway Station, Patiala (Malwa)",
    "phone": "01752311718",
    "displayPhone": "0175-2311718",
    "category": "depot",
    "timings": "24x7 Control Room",
    "notes": "PRTC PEPSU main headquarters and central dispatcher for Sangrur, Bathinda, and Chandigarh fleets (Malwa)."
  },
  {
    "id": "rajpura-bus-stand",
    "title": "Rajpura Bus Stand & Bypass Control Desk",
    "location": "GT Road / NH-44 Junction, Rajpura, Patiala (Malwa)",
    "phone": "01762224210",
    "displayPhone": "01762-224210",
    "category": "inquiry",
    "timings": "24x7 Control Room",
    "notes": "Industrial corridor junction connecting Chandigarh, Patiala, Sirhind, and Ambala Cantt."
  },
  {
    "id": "nabha-bus-stand",
    "title": "Nabha Bus Stand & Bypass Helpdesk",
    "location": "Patiala-Malerkotla Road, Nabha (Malwa)",
    "phone": "01765220230",
    "displayPhone": "01765-220230",
    "category": "inquiry",
    "timings": "06:00 AM – 09:00 PM",
    "notes": "Historic princely state subdivision connecting Patiala, Bhadson, and Malerkotla."
  },
  {
    "id": "samana-bus-stand",
    "title": "Samana Bus Stand Control Desk",
    "location": "Patran Highway, Samana, Patiala (Malwa)",
    "phone": "01764221220",
    "displayPhone": "01764-221220",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "South Malwa hub connecting Patiala with Patran, Moonak, and Haryana border."
  },
  {
    "id": "patran-bus-stand",
    "title": "Patran Bus Stand Helpdesk",
    "location": "NH-71 / Narwana Road, Patran, Patiala (Malwa)",
    "phone": "01764242150",
    "displayPhone": "01764-242150",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Interstate highway junction connecting Patiala, Samana, Sunam, and Kaithal/Hisar."
  },
  {
    "id": "sanaur-bus-stand",
    "title": "Sanaur Bus Stand Desk",
    "location": "Devigarh Road, Sanaur, Patiala (Malwa)",
    "phone": "01752651120",
    "displayPhone": "0175-2651120",
    "category": "inquiry",
    "timings": "06:30 AM – 08:00 PM",
    "notes": "Vegetable bowl suburban hub serving Patiala, Pehowa, and Kurukshetra link buses."
  },
  {
    "id": "bathinda-bus-stand",
    "title": "Bathinda Central Bus Stand Control",
    "location": "Mansa Road, Bathinda (Malwa)",
    "phone": "01642252161",
    "displayPhone": "0164-2252161",
    "category": "depot",
    "timings": "24x7 Control Room",
    "notes": "Major Malwa junction connecting Rajasthan, Haryana, Muktsar, Faridkot, Mansa, and Patiala (Malwa)."
  },
  {
    "id": "rampura-phul-bus-stand",
    "title": "Rampura Phul Bus Stand Helpdesk",
    "location": "NH-7 Barnala-Bathinda Highway, Rampura Phul (Malwa)",
    "phone": "01651220140",
    "displayPhone": "01651-220140",
    "category": "inquiry",
    "timings": "06:00 AM – 09:00 PM",
    "notes": "Key NH-7 intersection for Tapa, Barnala, Maur Mandi, and Bathinda express routes."
  },
  {
    "id": "talwandi-sabo-bus-stand",
    "title": "Talwandi Sabo Bus Stand Inquiry",
    "location": "Takht Sri Damdama Sahib Road, Talwandi Sabo (Malwa)",
    "phone": "01655220220",
    "displayPhone": "01655-220220",
    "category": "inquiry",
    "timings": "05:30 AM – 09:30 PM",
    "notes": "Takht Sri Damdama Sahib pilgrimage terminal connecting Raman, Maur, and Bathinda."
  },
  {
    "id": "maur-mandi-bus-stand",
    "title": "Maur Mandi Bus Stand Helpdesk",
    "location": "Talwandi Sabo Road, Maur Mandi, Bathinda (Malwa)",
    "phone": "01642702100",
    "displayPhone": "0164-2702100",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Grain market subdivision hub connecting Rampura Phul, Mansa, and Bathinda."
  },
  {
    "id": "bhucho-mandi-bus-stand",
    "title": "Bhucho Mandi Bus Stand Desk",
    "location": "NH-7 Highway Stop, Bhucho Mandi, Bathinda (Malwa)",
    "phone": "01642741120",
    "displayPhone": "0164-2741120",
    "category": "inquiry",
    "timings": "06:00 AM – 09:00 PM",
    "notes": "Industrial suburban stop connecting Bathinda thermal area with Rampura Phul."
  },
  {
    "id": "raman-mandi-bus-stand",
    "title": "Raman Mandi Bus Stand Inquiry",
    "location": "Refinery Road, Raman Mandi, Bathinda (Malwa)",
    "phone": "01655240150",
    "displayPhone": "01655-240150",
    "category": "inquiry",
    "timings": "06:00 AM – 08:00 PM",
    "notes": "Guru Gobind Singh Refinery hub connecting Talwandi Sabo and Haryana border."
  },
  {
    "id": "sangat-mandi-bus-stand",
    "title": "Sangat Mandi Bus Stand Desk",
    "location": "Dabwali Road, Sangat Mandi, Bathinda (Malwa)",
    "phone": "01642821100",
    "displayPhone": "0164-2821100",
    "category": "inquiry",
    "timings": "06:30 AM – 08:00 PM",
    "notes": "Southern gateway serving Mandi Dabwali and Sirsa interstate connections."
  },
  {
    "id": "goniana-mandi-bus-stand",
    "title": "Goniana Mandi Bus Stand Helpdesk",
    "location": "Faridkot Highway / NH-54, Goniana, Bathinda (Malwa)",
    "phone": "01642761200",
    "displayPhone": "0164-2761200",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "NH-54 northern corridor stop connecting Bathinda with Kotkapura and Faridkot."
  },
  {
    "id": "mohali-isbt",
    "title": "Mohali Phase 8 ISBT Control Room",
    "location": "Phase 8, SAS Nagar, Mohali (Malwa / Tricity)",
    "phone": "01722270100",
    "displayPhone": "0172-2270100",
    "category": "depot",
    "timings": "24x7 Control Room",
    "notes": "Direct PRTC/Punbus terminal linking Kharar, Airport Road, and southern Malwa routes (Malwa)."
  },
  {
    "id": "kharar-bus-stand",
    "title": "Kharar Highway Bus Stand Helpdesk",
    "location": "Kharar Flyover Intersection, NH-5 / NH-205 (Malwa)",
    "phone": "01602280200",
    "displayPhone": "0160-2280200",
    "category": "inquiry",
    "timings": "06:00 AM – 10:00 PM",
    "notes": "High-density transfer nexus for Chandigarh University (CU), Ropar, Ludhiana, and Morinda (Malwa)."
  },
  {
    "id": "kurali-bus-stand",
    "title": "Kurali Bus Stand Helpdesk",
    "location": "NH-205 Ropar Highway, Kurali, SAS Nagar (Malwa)",
    "phone": "01602551200",
    "displayPhone": "0160-2551200",
    "category": "inquiry",
    "timings": "06:00 AM – 09:00 PM",
    "notes": "Important junction connecting Kharar, Morinda, Siswan Dam road, and Rupnagar."
  },
  {
    "id": "dera-bassi-bus-stand",
    "title": "Dera Bassi Bus Stand Inquiry",
    "location": "NH-152 Ambala Highway, Dera Bassi, SAS Nagar (Malwa)",
    "phone": "01762280140",
    "displayPhone": "01762-280140",
    "category": "inquiry",
    "timings": "06:00 AM – 09:30 PM",
    "notes": "Industrial hub on Chandigarh-Delhi highway connecting Zirakpur, Lalru, and Barwala."
  },
  {
    "id": "zirakpur-bus-stand",
    "title": "Zirakpur Flyover Transit Desk",
    "location": "Zirakpur Himalayan Expressway Junction (Malwa / Tricity)",
    "phone": "01762250100",
    "displayPhone": "01762-250100",
    "category": "inquiry",
    "timings": "24x7 Control Room",
    "notes": "High-density Tricity nexus connecting Chandigarh, Panchkula, Patiala, and Ambala."
  },
  {
    "id": "lalru-bus-stand",
    "title": "Lalru Bus Stand Desk",
    "location": "GT Road / NH-152, Lalru, SAS Nagar (Malwa)",
    "phone": "01762274110",
    "displayPhone": "01762-274110",
    "category": "inquiry",
    "timings": "06:00 AM – 09:00 PM",
    "notes": "Interstate border industrial stop linking Dera Bassi and Ambala Cantt."
  },
  {
    "id": "banur-bus-stand",
    "title": "Banur Bus Stand Helpdesk",
    "location": "Patiala-Zirakpur Highway, Banur, SAS Nagar (Malwa)",
    "phone": "01762264200",
    "displayPhone": "01762-264200",
    "category": "inquiry",
    "timings": "06:00 AM – 09:00 PM",
    "notes": "Strategic junction connecting Patiala, Rajpura, Kharar, and Zirakpur."
  },
  {
    "id": "new-chandigarh-bus-stand",
    "title": "New Chandigarh Bus Stand Desk",
    "location": "Mullanpur Garibdas / Eco City, SAS Nagar (Malwa)",
    "phone": "01722270100",
    "displayPhone": "0172-2270100",
    "category": "inquiry",
    "timings": "06:30 AM – 08:30 PM",
    "notes": "Serves Medicity, cricket stadium, Kurali link, and Chandigarh north entry."
  },
  {
    "id": "ropar-bus-stand",
    "title": "Rupnagar (Ropar) Bus Stand Control",
    "location": "Bela Chowk, Rupnagar (Malwa / Shivalik)",
    "phone": "01881222455",
    "displayPhone": "01881-222455",
    "category": "depot",
    "timings": "24x7 Control Room",
    "notes": "Key gateway for Anandpur Sahib, Nangal, Kurali, Chamkaur Sahib, and Chandigarh (Malwa)."
  },
  {
    "id": "anandpur-sahib-bus-stand",
    "title": "Anandpur Sahib Bus Stand Helpdesk",
    "location": "Takht Sri Kesgarh Sahib Highway Link, Anandpur Sahib",
    "phone": "01887232140",
    "displayPhone": "01887-232140",
    "category": "inquiry",
    "timings": "24x7 Control Room",
    "notes": "Birthplace of Khalsa pilgrimage terminal for Hola Mohalla, Nangal, and Kiratpur Sahib."
  },
  {
    "id": "kiratpur-sahib-bus-stand",
    "title": "Kiratpur Sahib Bus Stand Desk",
    "location": "Bilaspur Highway / NH-205, Kiratpur Sahib (Malwa)",
    "phone": "01887238210",
    "displayPhone": "01887-238210",
    "category": "inquiry",
    "timings": "06:00 AM – 09:00 PM",
    "notes": "Pilgrimage hub and gateway to Himachal Pradesh (Bilaspur/Manali) and Anandpur Sahib."
  },
  {
    "id": "chamkaur-sahib-bus-stand",
    "title": "Chamkaur Sahib Bus Stand Inquiry",
    "location": "Gurdwara Katalgarh Sahib Link, Chamkaur Sahib (Malwa)",
    "phone": "01881260120",
    "displayPhone": "01881-260120",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Historic Shaheedi pilgrimage hub connecting Morinda, Bela, and Ropar."
  },
  {
    "id": "morinda-bus-stand",
    "title": "Morinda Bus Stand Control Room",
    "location": "Kainor Chowk / NH-5, Morinda, Rupnagar (Malwa)",
    "phone": "01602630140",
    "displayPhone": "0160-2630140",
    "category": "inquiry",
    "timings": "06:00 AM – 09:30 PM",
    "notes": "NH-5 crossroads connecting Chandigarh, Kharar, Chamkaur Sahib, Ropar, and Ludhiana."
  },
  {
    "id": "nangal-bus-stand",
    "title": "Nangal Central Bus Stand Helpdesk",
    "location": "Bhakra Dam Road, Nangal, Rupnagar (Malwa)",
    "phone": "01887220250",
    "displayPhone": "01887-220250",
    "category": "inquiry",
    "timings": "05:30 AM – 09:30 PM",
    "notes": "Bhakra Dam border terminal connecting Anandpur Sahib with Una and Mehatpur (HP)."
  },
  {
    "id": "nurpur-bedi-bus-stand",
    "title": "Nurpur Bedi Bus Stand Desk",
    "location": "Garhshankar Link Road, Nurpur Bedi (Malwa)",
    "phone": "01887240110",
    "displayPhone": "01887-240110",
    "category": "inquiry",
    "timings": "06:30 AM – 08:00 PM",
    "notes": "Kandi subdivision stop connecting Anandpur Sahib with Ropar and Garhshankar."
  },
  {
    "id": "ghanauli-bus-stand",
    "title": "Ghanauli Bus Stand Helpdesk",
    "location": "NH-205 Thermal Plant Link, Ghanauli, Rupnagar (Malwa)",
    "phone": "01881274100",
    "displayPhone": "01881-274100",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Guru Gobind Singh Super Thermal Plant boarding stop between Ropar and Kiratpur Sahib."
  },
  {
    "id": "sirhind-bus-stand",
    "title": "Sirhind (Fatehgarh Sahib) Bus Stand",
    "location": "GT Road Bypass, Sirhind, Fatehgarh Sahib (Malwa)",
    "phone": "01763232230",
    "displayPhone": "01763-232230",
    "category": "depot",
    "timings": "24x7 Control Room",
    "notes": "Historic Shaheedi Jor Mela terminal connecting Mandi Gobindgarh, Khanna, and Rajpura (Malwa)."
  },
  {
    "id": "mandi-gobindgarh-bus-stand",
    "title": "Mandi Gobindgarh Bus Stand Helpdesk",
    "location": "GT Road / Steel Town, Mandi Gobindgarh (Malwa)",
    "phone": "01765255120",
    "displayPhone": "01765-255120",
    "category": "inquiry",
    "timings": "06:00 AM – 09:30 PM",
    "notes": "Loha Mandi steel town transit hub on GT Road connecting Sirhind and Khanna."
  },
  {
    "id": "bassi-pathana-bus-stand",
    "title": "Bassi Pathana Bus Stand Control Desk",
    "location": "Morinda Road, Bassi Pathana, Fatehgarh Sahib (Malwa)",
    "phone": "01763250140",
    "displayPhone": "01763-250140",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Historic subdivision linking Sirhind, Morinda, and Khamano."
  },
  {
    "id": "amloh-bus-stand",
    "title": "Amloh Bus Stand Inquiry",
    "location": "Nabha Road, Amloh, Fatehgarh Sahib (Malwa)",
    "phone": "01765230110",
    "displayPhone": "01765-230110",
    "category": "inquiry",
    "timings": "06:00 AM – 08:00 PM",
    "notes": "Subdivision connecting Mandi Gobindgarh, Khanna, and Nabha."
  },
  {
    "id": "khamano-bus-stand",
    "title": "Khamano Bus Stand Helpdesk",
    "location": "Chandigarh-Ludhiana Interior Road, Khamano (Malwa)",
    "phone": "01628275130",
    "displayPhone": "01628-275130",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Interior route town linking Morinda with Samrala and Ludhiana."
  },
  {
    "id": "sangrur-bus-stand",
    "title": "Sangrur Central Bus Stand Inquiry",
    "location": "Patiala Road, Sangrur (Malwa)",
    "phone": "01672234240",
    "displayPhone": "01672-234240",
    "category": "depot",
    "timings": "24x7 Control Room",
    "notes": "Heart of Malwa connecting Sunam, Dhuri, Barnala, Mansa, and Patiala PRTC fleets (Malwa)."
  },
  {
    "id": "sunam-bus-stand",
    "title": "Sunam Udham Singh Wala Bus Stand",
    "location": "Bathinda Highway, Sunam, Sangrur (Malwa)",
    "phone": "01676220130",
    "displayPhone": "01676-220130",
    "category": "inquiry",
    "timings": "06:00 AM – 09:30 PM",
    "notes": "Shaheed Udham Singh birthplace terminal connecting Sangrur, Bhikhi, Mansa, and Patran."
  },
  {
    "id": "bhawanigarh-bus-stand",
    "title": "Bhawanigarh Bus Stand Helpdesk",
    "location": "NH-7 Patiala-Sangrur Highway, Bhawanigarh (Malwa)",
    "phone": "01672272140",
    "displayPhone": "01672-272140",
    "category": "inquiry",
    "timings": "06:00 AM – 09:00 PM",
    "notes": "Mid-way NH-7 junction between Patiala and Sangrur, connecting Nabha and Samana."
  },
  {
    "id": "lehragaga-bus-stand",
    "title": "Lehragaga Bus Stand Inquiry",
    "location": "Moonak Road, Lehragaga, Sangrur (Malwa)",
    "phone": "01676272120",
    "displayPhone": "01676-272120",
    "category": "inquiry",
    "timings": "06:00 AM – 08:00 PM",
    "notes": "Southern Malwa subdivision hub connecting Sunam, Moonak, and Jakhal (Haryana)."
  },
  {
    "id": "moonak-bus-stand",
    "title": "Moonak Bus Stand Helpdesk",
    "location": "Ghaggar River Highway, Moonak, Sangrur (Malwa)",
    "phone": "01676276150",
    "displayPhone": "01676-276150",
    "category": "inquiry",
    "timings": "06:00 AM – 08:00 PM",
    "notes": "Border tehsil hub connecting Patran, Lehragaga, and Tohana (Haryana)."
  },
  {
    "id": "barnala-bus-stand",
    "title": "Barnala Central Bus Stand Control",
    "location": "Bajakhana Road, Barnala (Malwa)",
    "phone": "01679232155",
    "displayPhone": "01679-232155",
    "category": "depot",
    "timings": "24x7 Control Room",
    "notes": "Industrial junction for Ludhiana, Bathinda, Raikot, and Mansa buses (Malwa)."
  },
  {
    "id": "tapa-bus-stand",
    "title": "Tapa Bus Stand Helpdesk",
    "location": "NH-7 Bathinda Highway, Tapa, Barnala (Malwa)",
    "phone": "01679272140",
    "displayPhone": "01679-272140",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Subdivision stop on NH-7 connecting Barnala with Rampura Phul and Bathinda."
  },
  {
    "id": "bhadaur-bus-stand",
    "title": "Bhadaur Bus Stand Inquiry",
    "location": "Bajakhana-Barnala Road, Bhadaur (Malwa)",
    "phone": "01679275120",
    "displayPhone": "01679-275120",
    "category": "inquiry",
    "timings": "06:00 AM – 08:00 PM",
    "notes": "Historic town connecting Barnala with Bhagapurana and Moga."
  },
  {
    "id": "dhanaula-bus-stand",
    "title": "Dhanaula Bus Stand Desk",
    "location": "Sangrur-Barnala Road / NH-7, Dhanaula (Malwa)",
    "phone": "01679264110",
    "displayPhone": "01679-264110",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Midway boarding point between Sangrur and Barnala on NH-7."
  },
  {
    "id": "mehal-kalan-bus-stand",
    "title": "Mehal Kalan Bus Stand Inquiry",
    "location": "Ludhiana-Barnala Highway, Mehal Kalan (Malwa)",
    "phone": "01679245130",
    "displayPhone": "01679-245130",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Key connecting point between Raikot (Ludhiana) and Barnala city."
  },
  {
    "id": "mansa-bus-stand",
    "title": "Mansa Central Bus Stand Helpdesk",
    "location": "Barnala Road, Mansa (Malwa)",
    "phone": "01652228120",
    "displayPhone": "01652-228120",
    "category": "depot",
    "timings": "24x7 Control Room",
    "notes": "Cotton belt terminal serving Budhlada, Sardulgarh, Sunam, and Bathinda routes (Malwa)."
  },
  {
    "id": "budhlada-bus-stand",
    "title": "Budhlada Bus Stand Control Desk",
    "location": "Bareta Road, Budhlada, Mansa (Malwa)",
    "phone": "01652252140",
    "displayPhone": "01652-252140",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Major subdivision terminal connecting Mansa, Bareta, and Ratia (Haryana)."
  },
  {
    "id": "sardulgarh-bus-stand",
    "title": "Sardulgarh Bus Stand Helpdesk",
    "location": "Sirsa Highway, Sardulgarh, Mansa (Malwa)",
    "phone": "01659250120",
    "displayPhone": "01659-250120",
    "category": "inquiry",
    "timings": "06:00 AM – 08:00 PM",
    "notes": "Southern border subdivision terminal on Ghaggar river linking Sirsa (Haryana)."
  },
  {
    "id": "bareta-bus-stand",
    "title": "Bareta Bus Stand Inquiry",
    "location": "Jakhal Link Road, Bareta, Mansa (Malwa)",
    "phone": "01652270110",
    "displayPhone": "01652-270110",
    "category": "inquiry",
    "timings": "06:30 AM – 08:00 PM",
    "notes": "Mansa district border town connecting Budhlada and Jakhal Mandi."
  },
  {
    "id": "bhikhi-bus-stand",
    "title": "Bhikhi Bus Stand Helpdesk",
    "location": "Sunam-Mansa Road, Bhikhi, Mansa (Malwa)",
    "phone": "01652242130",
    "displayPhone": "01652-242130",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Junction connecting Sunam (Sangrur) with Mansa city and Maur Mandi."
  },
  {
    "id": "jhunir-bus-stand",
    "title": "Jhunir Bus Stand Desk",
    "location": "Sardulgarh Road, Jhunir, Mansa (Malwa)",
    "phone": "01659240100",
    "displayPhone": "01659-240100",
    "category": "inquiry",
    "timings": "06:30 AM – 07:30 PM",
    "notes": "Connecting Mansa city with rural Sardulgarh belt."
  },
  {
    "id": "muktsar-bus-stand",
    "title": "Sri Muktsar Sahib Central Bus Stand",
    "location": "Malout Road, Sri Muktsar Sahib (Malwa)",
    "phone": "01633262100",
    "displayPhone": "01633-262100",
    "category": "depot",
    "timings": "24x7 Control Room",
    "notes": "PRTC Muktsar depot dispatcher for Malout, Gidderbaha, Kotkapura, and Bathinda (Malwa)."
  },
  {
    "id": "malout-bus-stand",
    "title": "Malout Central Bus Stand Helpdesk",
    "location": "GT Road / NH-7 Junction, Malout (Malwa)",
    "phone": "01637222150",
    "displayPhone": "01637-222150",
    "category": "depot",
    "timings": "05:30 AM – 10:00 PM",
    "notes": "Major highway tri-junction connecting Bathinda, Abohar, Muktsar, and Dabwali (Malwa)."
  },
  {
    "id": "gidderbaha-bus-stand",
    "title": "Gidderbaha Bus Stand Inquiry",
    "location": "NH-7 Bathinda-Malout Highway, Gidderbaha (Malwa)",
    "phone": "01637230140",
    "displayPhone": "01637-230140",
    "category": "inquiry",
    "timings": "06:00 AM – 09:00 PM",
    "notes": "High-frequency stage stop between Bathinda and Malout on NH-7."
  },
  {
    "id": "bariwala-bus-stand",
    "title": "Bariwala Bus Stand Desk",
    "location": "Kotkapura-Muktsar Road, Bariwala (Malwa)",
    "phone": "01633255110",
    "displayPhone": "01633-255110",
    "category": "inquiry",
    "timings": "06:30 AM – 08:00 PM",
    "notes": "Historic subdivision stop connecting Kotkapura and Sri Muktsar Sahib."
  },
  {
    "id": "lambi-bus-stand",
    "title": "Lambi Bus Stand Desk",
    "location": "Malout-Dabwali Link, Lambi, Sri Muktsar Sahib (Malwa)",
    "phone": "01637242100",
    "displayPhone": "01637-242100",
    "category": "inquiry",
    "timings": "06:30 AM – 08:00 PM",
    "notes": "Rural subdivision terminal connecting Malout with Haryana border."
  },
  {
    "id": "faridkot-bus-stand",
    "title": "Faridkot Central Bus Stand Control",
    "location": "Talwandi Road, Faridkot (Malwa)",
    "phone": "01639250160",
    "displayPhone": "01639-250160",
    "category": "depot",
    "timings": "24x7 Control Room",
    "notes": "Baba Farid medical hub connecting Kotkapura, Firozpur, Bathinda, and Amritsar (Malwa)."
  },
  {
    "id": "kotkapura-bus-stand",
    "title": "Kotkapura Central Bus Stand Helpdesk",
    "location": "Batti Chowk / NH-54, Kotkapura, Faridkot (Malwa)",
    "phone": "01635220140",
    "displayPhone": "01635-220140",
    "category": "inquiry",
    "timings": "05:30 AM – 09:30 PM",
    "notes": "Critical Malwa junction connecting Faridkot, Muktsar, Bathinda, Baghapurana, and Moga."
  },
  {
    "id": "firozpur-cantt-bus-stand",
    "title": "Firozpur Cantt Bus Stand Helpdesk",
    "location": "Mall Road, Firozpur Cantt (Malwa)",
    "phone": "01632244177",
    "displayPhone": "01632-244177",
    "category": "depot",
    "timings": "24x7 Control Room",
    "notes": "Border district transit hub for Fazilka, Zira, Moga, and Ludhiana buses (Malwa)."
  },
  {
    "id": "firozpur-city-bus-stand",
    "title": "Firozpur City Bus Stand Inquiry",
    "location": "Circular Road, Firozpur City (Malwa)",
    "phone": "01632222150",
    "displayPhone": "01632-222150",
    "category": "inquiry",
    "timings": "06:00 AM – 09:00 PM",
    "notes": "Connecting Hussainiwala Border, Guru Har Sahai, and local city routes."
  },
  {
    "id": "zira-bus-stand",
    "title": "Zira Bus Stand Control Desk",
    "location": "Makhu-Firozpur Highway, Zira, Firozpur (Malwa)",
    "phone": "01682250120",
    "displayPhone": "01682-250120",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Subdivision junction connecting Amritsar (via Harike/Makhu) with Firozpur and Moga."
  },
  {
    "id": "guru-har-sahai-bus-stand",
    "title": "Guru Har Sahai Bus Stand Helpdesk",
    "location": "Fazilka Highway, Guru Har Sahai, Firozpur (Malwa)",
    "phone": "01685230140",
    "displayPhone": "01685-230140",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Border tehsil hub connecting Firozpur with Jalalabad and Fazilka."
  },
  {
    "id": "makhu-bus-stand",
    "title": "Makhu Bus Stand Helpdesk",
    "location": "NH-54 / Harike Pattan Link, Makhu, Firozpur (Malwa)",
    "phone": "01682260110",
    "displayPhone": "01682-260110",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Malwa-Majha gateway junction right off Harike bridge towards Zira and Firozpur."
  },
  {
    "id": "talwandi-bhai-bus-stand",
    "title": "Talwandi Bhai Bus Stand Desk",
    "location": "NH-5 Ludhiana-Firozpur Highway, Talwandi Bhai (Malwa)",
    "phone": "01632234120",
    "displayPhone": "01632-234120",
    "category": "inquiry",
    "timings": "06:00 AM – 09:00 PM",
    "notes": "Highway junction connecting Moga with Firozpur and Mudki."
  },
  {
    "id": "fazilka-bus-stand",
    "title": "Fazilka Central Bus Stand Inquiry",
    "location": "National Highway 7, Fazilka (Malwa)",
    "phone": "01638262140",
    "displayPhone": "01638-262140",
    "category": "depot",
    "timings": "24x7 Control Room",
    "notes": "Border district headquarters linking Abohar, Jalalabad, Malout, and Rajasthan border (Malwa)."
  },
  {
    "id": "abohar-bus-stand",
    "title": "Abohar Central Bus Stand Helpdesk",
    "location": "Circular Road, Abohar, Fazilka (Malwa)",
    "phone": "01634220025",
    "displayPhone": "01634-220025",
    "category": "depot",
    "timings": "24x7 Control Room",
    "notes": "Major tri-junction terminal for Punjab, Rajasthan (Sri Ganganagar), and Haryana (Malwa)."
  },
  {
    "id": "jalalabad-bus-stand",
    "title": "Jalalabad (West) Bus Stand Inquiry",
    "location": "NH-7 Firozpur-Fazilka Road, Jalalabad (Malwa)",
    "phone": "01638250130",
    "displayPhone": "01638-250130",
    "category": "inquiry",
    "timings": "06:00 AM – 09:00 PM",
    "notes": "Border subdivision hub between Guru Har Sahai and Fazilka city."
  },
  {
    "id": "arniwala-bus-stand",
    "title": "Arniwala Sheikh Subhan Bus Stand Desk",
    "location": "Fazilka Highway Stop, Arniwala, Fazilka (Malwa)",
    "phone": "01638245100",
    "displayPhone": "01638-245100",
    "category": "inquiry",
    "timings": "06:30 AM – 08:00 PM",
    "notes": "Midway stop between Jalalabad and Fazilka on NH-7."
  },
  {
    "id": "khuian-sarwar-bus-stand",
    "title": "Khuian Sarwar Bus Stand Desk",
    "location": "Abohar-Fazilka Link Road, Khuian Sarwar (Malwa)",
    "phone": "01634275120",
    "displayPhone": "01634-275120",
    "category": "inquiry",
    "timings": "06:30 AM – 08:00 PM",
    "notes": "Kinnu citrus belt transit stop connecting Abohar and Fazilka."
  },
  {
    "id": "moga-bus-stand",
    "title": "Moga Central Bus Stand Control Desk",
    "location": "GT Road / NH-5, Moga (Malwa)",
    "phone": "01636224455",
    "displayPhone": "01636-224455",
    "category": "depot",
    "timings": "24x7 Control Room",
    "notes": "Direct PRTC & Punbus dispatcher for Firozpur, Ludhiana, Kotkapura, and Jalandhar (Malwa)."
  },
  {
    "id": "baghapurana-bus-stand",
    "title": "Baghapurana Bus Stand Helpdesk",
    "location": "Mudki-Kotkapura Road, Baghapurana, Moga (Malwa)",
    "phone": "01636240120",
    "displayPhone": "01636-240120",
    "category": "inquiry",
    "timings": "06:00 AM – 09:00 PM",
    "notes": "Central Malwa hub linking Moga with Kotkapura, Faridkot, and Nihal Singh Wala."
  },
  {
    "id": "nihal-singh-wala-bus-stand",
    "title": "Nihal Singh Wala Bus Stand Inquiry",
    "location": "Barnala-Moga Link, Nihal Singh Wala (Malwa)",
    "phone": "01636255140",
    "displayPhone": "01636-255140",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Subdivision connecting Baghapurana with Badhni Kalan and Barnala."
  },
  {
    "id": "dharamkot-bus-stand",
    "title": "Dharamkot Bus Stand Desk",
    "location": "Jalandhar-Moga Road, Dharamkot (Malwa)",
    "phone": "01636260110",
    "displayPhone": "01636-260110",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Sutlej river border town connecting Shahkot (Doaba) with Moga."
  },
  {
    "id": "badhni-kalan-bus-stand",
    "title": "Badhni Kalan Bus Stand Desk",
    "location": "Moga-Barnala Road, Badhni Kalan (Malwa)",
    "phone": "01636270130",
    "displayPhone": "01636-270130",
    "category": "inquiry",
    "timings": "06:30 AM – 08:00 PM",
    "notes": "Connecting Moga with Nihal Singh Wala and Raikot."
  },
  {
    "id": "ajitwal-bus-stand",
    "title": "Ajitwal Highway Bus Stand Desk",
    "location": "GT Road / NH-5, Ajitwal, Moga (Malwa)",
    "phone": "01636282100",
    "displayPhone": "01636-282100",
    "category": "inquiry",
    "timings": "06:00 AM – 09:00 PM",
    "notes": "Nestle industrial hub between Jagraon and Moga on NH-5."
  },
  {
    "id": "malerkotla-bus-stand",
    "title": "Malerkotla Central Bus Stand Inquiry",
    "location": "Ludhiana Bypass, Malerkotla (Malwa)",
    "phone": "01675253100",
    "displayPhone": "01675-253100",
    "category": "depot",
    "timings": "24x7 Control Room",
    "notes": "Historic district hub connecting Ludhiana, Nabha, Patiala, Dhuri, and Sangrur (Malwa)."
  },
  {
    "id": "ahmedgarh-bus-stand",
    "title": "Ahmedgarh Bus Stand Helpdesk",
    "location": "Ludhiana-Malerkotla Road, Ahmedgarh (Malwa)",
    "phone": "01675240120",
    "displayPhone": "01675-240120",
    "category": "inquiry",
    "timings": "06:00 AM – 08:30 PM",
    "notes": "Agricultural market town connecting Dehlon, Ludhiana, and Malerkotla."
  },
  {
    "id": "amargarh-bus-stand",
    "title": "Amargarh Bus Stand Desk",
    "location": "Nabha Road, Amargarh, Malerkotla (Malwa)",
    "phone": "01675265110",
    "displayPhone": "01675-265110",
    "category": "inquiry",
    "timings": "06:30 AM – 08:00 PM",
    "notes": "Connecting Malerkotla with Nabha and Patiala."
  },
  {
    "id": "gharuan-cu-gate-2",
    "title": "Gharuan (CU Gate 2) Transit Desk",
    "location": "NH-5 Gate 2 Highway Stop, Gharuan (Malwa)",
    "phone": "01602280200",
    "displayPhone": "0160-2280200",
    "category": "inquiry",
    "timings": "06:00 AM – 10:00 PM",
    "notes": "Primary transit desk for Chandigarh University (CU) students and commuters connecting Kharar, Morinda, and Ludhiana."
  },
  {
    "id": "cheema-chowk-stop",
    "title": "Cheema Chowk Transit Stop Helpdesk",
    "location": "Industrial Area-A, Cheema Chowk, Ludhiana (Malwa)",
    "phone": "01612447015",
    "displayPhone": "0161-2447015",
    "category": "inquiry",
    "timings": "06:00 AM – 09:30 PM",
    "notes": "Ludhiana city boarding stop connecting Samrala, Kohara, and Ludhiana Bus Stand."
  },
  {
    "id": "sherpur-chowk-stop",
    "title": "Sherpur Chowk Highway Express Desk",
    "location": "GT Road / NH-44 Flyover, Sherpur Chowk, Ludhiana (Malwa)",
    "phone": "01612447015",
    "displayPhone": "0161-2447015",
    "category": "inquiry",
    "timings": "06:00 AM – 10:00 PM",
    "notes": "Highway express stop on NH-44 connecting Ludhiana with Samrala, Doraha, and Chandigarh."
  },
  {
    "id": "chd-isbt-43",
    "title": "Chandigarh ISBT Sector 43 Inquiry",
    "location": "ISBT-43, Chandigarh (Tricity / Capital)",
    "phone": "01722606672",
    "displayPhone": "0172-2606672",
    "category": "depot",
    "timings": "24x7 Control Room",
    "notes": "State capital intercity terminal for all Punjab roadways, PRTC, Himachal, and Haryana long-distance routes."
  },
  {
    "id": "chd-isbt-17",
    "title": "Chandigarh ISBT Sector 17 Inquiry",
    "location": "ISBT-17, Chandigarh (Tricity / Capital)",
    "phone": "01722704005",
    "displayPhone": "0172-2704005",
    "category": "inquiry",
    "timings": "06:00 AM – 10:00 PM",
    "notes": "CTU Local bus services and Ambala/Delhi Haryana Roadways departures."
  },
  {
    "id": "ambala-cantt-bus-stand",
    "title": "Ambala Cantt Intercity Bus Stand Helpdesk",
    "location": "GT Road, Ambala Cantt (Haryana / Punjab Border)",
    "phone": "01712640856",
    "displayPhone": "0171-2640856",
    "category": "depot",
    "timings": "24x7 Control Room",
    "notes": "Major interstate railway & transit nexus connecting Punjab (Rajpura/Ludhiana/Chandigarh) with Delhi."
  },
  {
    "id": "orbit-aviators-office",
    "title": "Orbit Aviators Private Fleet Dispatch",
    "location": "NH-5 / NH-44 Service Counter (Punjab)",
    "phone": "01633263300",
    "displayPhone": "01633-263300",
    "category": "private",
    "timings": "06:00 AM – 10:00 PM",
    "notes": "Volvo AC coach seat assistance, tracking, and luggage queries across Punjab."
  },
  {
    "id": "new-deep-dispatch",
    "title": "New Deep Transport Fleet Desk",
    "location": "Malwa Central Office, Muktsar (Punjab)",
    "phone": "01633262100",
    "displayPhone": "01633-262100",
    "category": "private",
    "timings": "06:00 AM – 09:30 PM",
    "notes": "Semi-deluxe and ordinary private stage carriages serving Bathinda, Muktsar, and Moga."
  },
  {
    "id": "libra-bus-dispatch",
    "title": "Libra Bus Service Operations",
    "location": "GT Road Depot, Ludhiana / Khanna (Punjab)",
    "phone": "01612534500",
    "displayPhone": "0161-2534500",
    "category": "private",
    "timings": "06:00 AM – 09:30 PM",
    "notes": "HVAC semi-deluxe services on Chandigarh, Ludhiana, Barnala, and Malerkotla corridors."
  },
  {
    "id": "jujhar-fleet-desk",
    "title": "Jujhar Transport Control Desk",
    "location": "Ludhiana Central Office (Punjab)",
    "phone": "01614680000",
    "displayPhone": "0161-4680000",
    "category": "private",
    "timings": "06:00 AM – 10:00 PM",
    "notes": "Stage carriage passenger operations across Ludhiana, Moga, and Chandigarh routes."
  }
];

export const INITIAL_SPOTTED_REPORTS: SpottedReport[] = [];
