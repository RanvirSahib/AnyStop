# AnyStop — Product & Technical Requirements Document (PRD)

## Project Overview
**Product Name:** AnyStop  
**Vision:** Real-time intelligence for unreserved, offline, and highway bus transit.  
**Target Audience:** Highway commuters, university students, hostelers, day-scholars, daily office travelers.  
**Pilot Corridor & Current Coverage:** Statewide Punjab across all 23 districts (Majha, Doaba, and Malwa corridors: Chandigarh, Ludhiana, Amritsar, Jalandhar, Patiala, Bathinda, Pathankot, Firozpur, Moga, etc.).  
**Platform Roadmap:** Phase 1: Progressive Web App (PWA) | Phase 2: Native Mobile App (Flutter).

---

## 1. User Personas & Use Cases

### Persona 1: The Rushed Commuter / Student (Aman)
- **Context**: Standing at a highway curb stop (e.g. CU Gate 2 or Kharar flyover) on Friday evening.
- **Pain Point**: Needs to reach Ludhiana fast; gets confused by incoming buses and risks boarding a slow ordinary bus that stops everywhere and takes 3+ hours.
- **Goal**: Open AnyStop on mobile, see buses passing in the next 15–30 minutes, confirm if it is an Express service, view fare, and check intermediate halts.

### Persona 2: The Budget / Weekend Traveler (Rohan)
- **Context**: Planning a trip between Chandigarh and Ludhiana.
- **Pain Point**: Wants to know whether to wait for an affordable PRTC/Punbus (~₹100) or book a Volvo/Orbit online (~₹250+).
- **Goal**: Compare upcoming offline departures with online-bookable coaches and view direct booking links when available.

### Persona 3: The Daily Commuter (Simran)
- **Context**: Travels daily between intermediate towns (e.g. Kharar, Morinda, Samrala).
- **Pain Point**: Needs predictable schedules and bus stand inquiry numbers when services run late.
- **Goal**: Fast timetable lookups and one-tap access to official depot inquiry desks.

---

## 2. Functional Requirements (FR)

### Module 1: Stop & Corridor Selection
- **FR-1.1 Origin Stop Selection**:
  - Allows selecting any supported highway stop or terminal (Default: `CU Gate 2 (Chandigarh University)`).
  - One-tap swap button to reverse trip direction.
- **FR-1.2 Destination Selector**:
  - Quick destination chips:
    - Ludhiana (Central Bus Stand / Sherpur Chowk)
    - Chandigarh (ISBT Sector 43 / ISBT Sector 17)
    - Kharar / Mohali
    - Morinda / Khamano / Samrala
    - Jalandhar / Amritsar
    - Ambala Cantt / Delhi
- **FR-1.3 Time & Service Filters**:
  - "Departing Now" (Next 60 minutes)
  - Time windows: Morning (6 AM - 12 PM), Afternoon (12 PM - 5 PM), Evening/Night (5 PM - 11 PM)
  - Speed Category: All, ⚡ Express Only, 🐢 Local All-Stop
  - Booking Type: All, Pay on Board, Book Online

### Module 2: Bus Result Cards & Details
Each bus result card must present:
- **FR-2.1 Operator & Fleet Badge**:
  - Operator: PRTC PEPSU, Punbus, Orbit Aviators, Libra Bus, CTU, Haryana Roadways, etc.
  - Category: Ordinary Non-AC, HVAC Semi-Deluxe, Volvo AC.
- **FR-2.2 Speed Classification & Duration**:
  - Visual tag: `⚡ Express` (minimal halts) vs `🐢 Local` (multiple stops).
  - Estimated total journey duration (e.g., ~1h 30m vs ~2h 45m).
- **FR-2.3 Arrival Window & Stoppage Timings**:
  - Scheduled arrival window at selected stop (e.g. `04:15 PM – 04:25 PM`).
  - Origin departure time (e.g. `Left ISBT 43 at 03:40 PM`).
  - Estimated arrival time at destination.
- **FR-2.4 Fare & Booking Action**:
  - `Pay on Board`: Ticket purchased inside bus with estimated fare (e.g., ₹95).
  - `Book Online`: Deep link button to official booking portal with price indicator (e.g., ₹280).
- **FR-2.5 Interactive Stoppage Progression**:
  - Expandable stop timeline diagram detailing intermediate stops with major transit hubs emphasized.

### Module 3: Verified Helpdesk & Bus Stand Directory
- **FR-3.1 Comprehensive Statewide Depot Directory**:
  - Direct dial links and one-tap copy buttons for official control rooms and bus stands across all Punjab districts (Amritsar, Jalandhar, Ludhiana, Chandigarh, Patiala, Bathinda, Pathankot, Hoshiarpur, Firozpur, etc.).
- **FR-3.2 Real-Time Directory Search & Category Filters**:
  - Instant search filtering by City, Depot Name, Operator, or Phone number.
  - Category filter chips: All Contacts, State Depots (PRTC/Punbus/CTU), Private Fleets, and 24x7 Control Rooms.
- **FR-3.3 Travel Tips & Guidance**:
  - Practical tips on recognizing windshield destination plates and boarding etiquette at highway stops.

### Module 4: Live Community Layer ("Spotted at Stop")
- **FR-4.1 Commuter Sighting Submissions**:
  - Report form with operator selection, custom stop name, speed classification (Express vs. Local), and crowd density.
- **FR-4.2 Stop Rush Density Selector**:
  - 3-card crowd density selector:
    - 🟢 Low Rush ("Plenty of empty seats available")
    - 🟡 Moderate ("Seats filling up, standing available")
    - 🔴 Heavy Rush ("Packed bus, board quickly")
- **FR-4.3 Speech-Bubble Sighting Feed**:
  - Reverse-chronological sighting feed cards with operator icons, stop pins, crowd badges, and live relative timestamps ("3 mins ago", "12 mins ago") persisted in local storage.

### Module 5: Visual Brand Identity & Background Atmosphere
- **FR-5.1 High-Contrast Solid Cards**:
  - Solid card surfaces (`#FFFFFF` in light mode, `#201B40` in dark mode) ensuring 100% visibility for all bus cards without washed-out transparencies.
- **FR-5.2 WhatsApp Chat-Style Transit Doodle Wallpaper**:
  - Subtle, high-density transit icon wallpaper pattern (242 interlocking doodles per tile) applied to the app body with fixed background-attachment.
  - Automatically switches between light mode (warm 8.5% ink) and dark mode (soft 7.5% lavender-white).

---

## 3. Non-Functional Requirements (NFR)

### NFR-1: Performance & Low Latency
- First Contentful Paint (FCP) `< 1.0s` on 4G mobile connections.
- Total JavaScript bundle size `< 150 KB` for instant client-side filtering.

### NFR-2: Mobile-First Responsive Design
- Optimized for mobile viewports (360px – 430px) with minimum 44px tap targets for one-handed use outdoors.

### NFR-3: Offline Capability & PWA
- Progressive Web App manifest and service worker caching so commuters with weak highway reception can still access timetables offline.

### NFR-4: Accessibility & Outdoor Readability
- High contrast typography and color coding suited for bright sunlight.
- Bilingual terminology (English & Punjabi phonetics) for key stop names.

---

## 4. Master Data Schema (JSON)

```json
{
  "bus_id": "anystop_nh5_0415",
  "operator": "PRTC PEPSU",
  "bus_number": "PB-65-XXXX",
  "category": "Ordinary",
  "speed_type": "express",
  "estimated_duration_mins": 90,
  "estimated_fare_inr": 95,
  "booking_type": "offline_onboard",
  "booking_url": null,
  "route": {
    "origin": "Chandigarh ISBT 43",
    "origin_departure_time": "15:45",
    "stop_timings": [
      { "stop_id": "isbt_43", "stop_name": "Chandigarh ISBT 43", "time": "15:45", "is_major": true },
      { "stop_id": "kharar_flyover", "stop_name": "Kharar Flyover", "time": "16:05", "is_major": false },
      { "stop_id": "cu_gate2", "stop_name": "CU Gate 2 (Gharuan)", "time": "16:18", "is_major": true },
      { "stop_id": "morinda_bypass", "stop_name": "Morinda Bypass", "time": "16:30", "is_major": false },
      { "stop_id": "samrala_bypass", "stop_name": "Samrala Bypass", "time": "16:50", "is_major": true },
      { "stop_id": "sherpur_chowk", "stop_name": "Sherpur Chowk Ludhiana", "time": "17:10", "is_major": true },
      { "stop_id": "ludhiana_stand", "stop_name": "Ludhiana Central Bus Stand", "time": "17:25", "is_major": true }
    ],
    "destination": "Ludhiana Central Bus Stand",
    "destination_arrival_time": "17:25"
  },
  "frequency": "Daily",
  "peak_notes": "Heavy Friday evening boarding"
}
```

---

## 5. Technology Stack

- **Frontend Framework:** React 19 / Next.js 14+ or Vite + React (TypeScript) + Tailwind CSS + Lucide React.
- **PWA / Offline:** Service Worker + Web App Manifest for mobile home screen installation.
- **Data Architecture:** High-speed client-side indexed schedule dataset + LocalStorage persistence for recent searches and crowd reports.
- **Deployment:** Vercel / Cloudflare Pages / Static CDN.
