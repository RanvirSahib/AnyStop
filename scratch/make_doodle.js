import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Primary transit icons (~22 - 28px)
const PRIMARY_ICONS = [
  // 0: Bus Front
  `<g class="doodle">
    <rect x="-11" y="-14" width="22" height="26" rx="5" />
    <rect x="-8" y="-11" width="16" height="8" rx="2" />
    <circle cx="-5.5" cy="3.5" r="1.8" />
    <circle cx="5.5" cy="3.5" r="1.8" />
    <line x1="-3" y1="7" x2="3" y2="7" />
    <line x1="-9" y1="12" x2="-6.5" y2="12" stroke-width="2" />
    <line x1="6.5" y1="12" x2="9" y2="12" stroke-width="2" />
  </g>`,

  // 1: Bus Side
  `<g class="doodle">
    <path d="M-17,-7 L10,-7 Q15,-7 17,-2 L17,6 Q17,8 14,8 L-14,8 Q-17,8 -17,6 Z" />
    <circle cx="-8.5" cy="8" r="3" />
    <circle cx="8.5" cy="8" r="3" />
    <line x1="-14" y1="-2.5" x2="13" y2="-2.5" />
    <line x1="-4" y1="-7" x2="-4" y2="4" />
    <line x1="3.5" y1="-7" x2="3.5" y2="4" />
  </g>`,

  // 2: AnyStop Pin
  `<g class="doodle">
    <path d="M0,13 C-5,7 -7,3.5 -7,-1.5 A7,7 0 1,1 7,-1.5 C7,3.5 5,7 0,13 Z" />
    <path d="M-3,12 L0,2 L3,12 M-1.8,7.5 L1.8,7.5" />
  </g>`,

  // 3: Bus Stop Sign
  `<g class="doodle">
    <line x1="0" y1="-14" x2="0" y2="14" stroke-width="1.8" />
    <circle cx="0" cy="-8.5" r="7.5" />
    <rect x="-4" y="-11" width="8" height="5" rx="1.2" />
    <line x1="-2.5" y1="-0.5" x2="2.5" y2="-0.5" />
  </g>`,

  // 4: Highway Milestone NH5
  `<g class="doodle">
    <path d="M-7.5,11 L-7.5,-1 Q-7.5,-9.5 0,-9.5 Q7.5,-9.5 7.5,-1 L7.5,11 Z" />
    <line x1="-7.5" y1="-0.5" x2="7.5" y2="-0.5" />
    <line x1="-4" y1="3.5" x2="4" y2="3.5" />
    <line x1="-2.5" y1="7" x2="2.5" y2="7" />
  </g>`,

  // 5: Map Location Pin
  `<g class="doodle">
    <path d="M0,12 C-5,5.5 -6.5,2 -6.5,-2 A6.5,6.5 0 1,1 6.5,-2 C6.5,2 5,5.5 0,12 Z" />
    <circle cx="0" cy="-2" r="2.3" />
  </g>`,

  // 6: Ticket
  `<g class="doodle">
    <rect x="-11" y="-6.5" width="22" height="13" rx="2" />
    <line x1="-1.5" y1="-6.5" x2="-1.5" y2="6.5" stroke-dasharray="1.8,1.8" />
    <circle cx="3.8" cy="0" r="2.2" />
    <line x1="-7.5" y1="-2.5" x2="-4" y2="-2.5" />
    <line x1="-7.5" y1="2" x2="-4" y2="2" />
  </g>`,

  // 7: Steering Wheel
  `<g class="doodle">
    <circle cx="0" cy="0" r="9.5" />
    <circle cx="0" cy="0" r="3" />
    <line x1="-9.5" y1="0" x2="-3" y2="0" />
    <line x1="3" y1="0" x2="9.5" y2="0" />
    <line x1="0" y1="3" x2="0" y2="9.5" />
  </g>`,

  // 8: Clock
  `<g class="doodle">
    <circle cx="0" cy="0" r="9" />
    <polyline points="0,-4.5 0,0 3.5,2.5" />
    <line x1="0" y1="-9" x2="0" y2="-7" />
    <line x1="9" y1="0" x2="7" y2="0" />
    <line x1="0" y1="9" x2="0" y2="7" />
    <line x1="-9" y1="0" x2="-7" y2="0" />
  </g>`,

  // 9: Radio/Wifi Waves
  `<g class="doodle">
    <path d="M-9,-2.5 A11.5,11.5 0 0,1 9,-2.5" />
    <path d="M-6,1.5 A7.5,7.5 0 0,1 6,1.5" />
    <path d="M-3,5.5 A3.8,3.8 0 0,1 3,5.5" />
    <circle cx="0" cy="8" r="1.3" class="doodle-dot" />
  </g>`,

  // 10: Traffic Light
  `<g class="doodle">
    <rect x="-4.5" y="-12" width="9" height="22" rx="3.8" />
    <line x1="0" y1="10" x2="0" y2="15" stroke-width="1.8" />
    <circle cx="0" cy="-7" r="1.9" />
    <circle cx="0" cy="-1" r="1.9" />
    <circle cx="0" cy="5" r="1.9" />
  </g>`,

  // 11: Chai / Coffee Cup
  `<g class="doodle">
    <path d="M-6,-4 L-4.5,6 Q-4.5,8.5 0,8.5 Q4.5,8.5 4.5,6 L6,-4 Z" />
    <path d="M4.5,-1.5 Q7.5,-1.5 7.5,1.5 Q7.5,5 4.5,5" />
    <path d="M-2,-6.5 Q-3.5,-9 -2,-11" />
    <path d="M1.5,-6.5 Q0,-9 1.5,-11" />
  </g>`,

  // 12: Luggage Suitcase
  `<g class="doodle">
    <rect x="-8.5" y="-5" width="17" height="14" rx="2.5" />
    <path d="M-3,-5 L-3,-8.5 L3,-8.5 L3,-5" />
    <line x1="-8.5" y1="2" x2="8.5" y2="2" />
    <circle cx="-5" cy="9" r="1" />
    <circle cx="5" cy="9" r="1" />
  </g>`,

  // 13: Compass
  `<g class="doodle">
    <circle cx="0" cy="0" r="9" />
    <polygon points="0,-6.5 2,0 0,6.5 -2,0" />
    <circle cx="0" cy="0" r="1.3" />
  </g>`,

  // 14: Road Sign Curve
  `<g class="doodle">
    <polygon points="0,-10 10,0 0,10 -10,0" />
    <path d="M-3,4.5 L-3,-1 Q-3,-3.5 0,-3.5 L3.5,-3.5" />
    <polyline points="1.2,-5.5 3.8,-3.5 1.2,-1.5" />
  </g>`,

  // 15: Speedometer
  `<g class="doodle">
    <path d="M-9,3.5 A9.5,9.5 0 1,1 9,3.5" />
    <polyline points="0,3.5 4,-2.5" />
    <circle cx="0" cy="3.5" r="1.5" />
  </g>`,

  // 16: Gas Pump
  `<g class="doodle">
    <rect x="-7.5" y="-9" width="11" height="18" rx="2" />
    <rect x="-5" y="-6.5" width="6" height="4.5" rx="1" />
    <path d="M3.5,-3 L6,-3 L6,6 Q6,8.5 8,7 L8,3.5" />
  </g>`,

  // 17: Roadside Tree
  `<g class="doodle">
    <path d="M-7,2 Q-9,-3 -2.5,-4.5 Q-3.5,-10 0,-10 Q3.5,-10 2.5,-4.5 Q9,-3 7,2 Z" />
    <line x1="0" y1="2" x2="0" y2="10" stroke-width="1.8" />
  </g>`,

  // 18: Headlights
  `<g class="doodle">
    <path d="M-4,-6 Q-0.8,-6 1.2,0 Q-0.8,6 -4,6 Z" />
    <line x1="4.5" y1="-5.5" x2="10.5" y2="-6.8" />
    <line x1="5" y1="-1.8" x2="11.5" y2="-2.6" />
    <line x1="5" y1="1.8" x2="11.5" y2="2.6" />
    <line x1="4.5" y1="5.5" x2="10.5" y2="6.8" />
  </g>`,

  // 19: Conductor Whistle
  `<g class="doodle">
    <circle cx="-1.8" cy="0" r="4.2" />
    <rect x="0" y="-4.2" width="8.5" height="4.2" rx="1" />
    <line x1="1.8" y1="-4.2" x2="1.8" y2="-2" />
  </g>`,

  // 20: Phone with Transit App
  `<g class="doodle">
    <rect x="-5" y="-9.5" width="10" height="19" rx="2" />
    <rect x="-3" y="-5.5" width="6" height="8" rx="1" />
    <circle cx="0" cy="6.5" r="0.8" />
  </g>`,

  // 21: Stop Octagon
  `<g class="doodle">
    <polygon points="-3.5,-8.5 3.5,-8.5 8.5,-3.5 8.5,3.5 3.5,8.5 -3.5,8.5 -8.5,3.5 -8.5,-3.5" />
    <line x1="-3.5" y1="0" x2="3.5" y2="0" />
    <line x1="0" y1="-3.5" x2="0" y2="3.5" />
  </g>`,

  // 22: Highway Road Perspective
  `<g class="doodle">
    <polygon points="-2.5,-8.5 2.5,-8.5 8.5,8.5 -8.5,8.5" />
    <line x1="0" y1="-6" x2="0" y2="-2.5" stroke-dasharray="1.2,1.2" />
    <line x1="0" y1="1.5" x2="0" y2="6" stroke-dasharray="1.2,1.2" />
  </g>`,

  // 23: 4-Point Transit Sparkle
  `<g class="doodle">
    <path d="M0,-7 Q0,0 7,0 Q0,0 0,7 Q0,0 -7,0 Q0,0 0,-7 Z" />
  </g>`,

  // 24: Rupee Fare Coin
  `<g class="doodle">
    <circle cx="0" cy="0" r="8" />
    <path d="M-3,-3.5 L3,-3.5 M-3,-1.2 L3,-1.2 M-3,-3.5 L-3,0 Q0.8,0 0.8,2 Q-0.8,4 -3.5,4 M-0.2,0.4 L2.8,4.5" />
  </g>`,

  // 25: Double Arrow Direction
  `<g class="doodle">
    <path d="M-7,-3.5 L0,-3.5 L-2.5,-6 M0,-3.5 L-2.5,-1" />
    <path d="M7,3.5 L0,3.5 L2.5,6 M0,3.5 L2.5,1" />
  </g>`
];

// Small filler elements (~6px - 12px) to pack into any gaps just like WhatsApp wallpaper
const FILLER_ICONS = [
  // F0: Tiny Heart
  `<g class="doodle">
    <path d="M0,3.5 C-2.5,1 -4,-1 -2.5,-2.8 C-1,-3.5 0,-2 0,-1 C0,-2 1,-3.5 2.5,-2.8 C4,-1 2.5,1 0,3.5 Z" />
  </g>`,

  // F1: Mini Plus / Spark
  `<g class="doodle">
    <line x1="0" y1="-3.5" x2="0" y2="3.5" stroke-width="1.3" />
    <line x1="-3.5" y1="0" x2="3.5" y2="0" stroke-width="1.3" />
  </g>`,

  // F2: Speech Bubble
  `<g class="doodle">
    <path d="M-4,-3 L4,-3 Q5.5,-3 5.5,-1 L5.5,2 Q5.5,4 4,4 L0,4 L-3.5,6 L-2.5,4 L-4,4 Q-5.5,4 -5.5,2 L-5.5,-1 Q-5.5,-3 -4,-3 Z" />
  </g>`,

  // F3: Mini Dot Trio
  `<g class="doodle">
    <circle cx="-3" cy="0" r="1.1" class="doodle-dot" />
    <circle cx="0" cy="0" r="1.1" class="doodle-dot" />
    <circle cx="3" cy="0" r="1.1" class="doodle-dot" />
  </g>`,

  // F4: Mini Star
  `<g class="doodle">
    <polygon points="0,-4 1.2,-1.2 4,0 1.2,1.2 0,4 -1.2,1.2 -4,0 -1.2,-1.2" />
  </g>`,

  // F5: Road Traffic Cone
  `<g class="doodle">
    <polygon points="0,-4.5 3,3.5 -3,3.5" />
    <line x1="-4" y1="4.5" x2="4" y2="4.5" stroke-width="1.2" />
  </g>`,

  // F6: Mini Leaf / Twig
  `<g class="doodle">
    <path d="M-3,3 Q-3,-3 3,-3 Q3,3 -3,3 Z" />
  </g>`,

  // F7: Mini Location Pin
  `<g class="doodle">
    <circle cx="0" cy="-1.5" r="2.2" />
    <path d="M-1.8,-0.5 L0,4 L1.8,-0.5" />
  </g>`,

  // F8: Double Mini Dots
  `<g class="doodle">
    <circle cx="-2" cy="-2" r="1.2" class="doodle-dot" />
    <circle cx="2" cy="2" r="1.2" class="doodle-dot" />
  </g>`,

  // F9: Hashtag
  `<g class="doodle">
    <line x1="-3" y1="-1.5" x2="3" y2="-1.5" />
    <line x1="-3" y1="1.5" x2="3" y2="1.5" />
    <line x1="-1.5" y1="-3" x2="-1.5" y2="3" />
    <line x1="1.5" y1="-3" x2="1.5" y2="3" />
  </g>`,

  // F10: Mini Circle Ring
  `<g class="doodle">
    <circle cx="0" cy="0" r="2.8" />
  </g>`,

  // F11: Mini Cloud
  `<g class="doodle">
    <path d="M-3,1 Q-4.5,1 -4,-0.5 Q-3.5,-2 -2,-1.8 Q-1.5,-3.5 0.5,-3.2 Q2,-3.5 2.5,-1.8 Q4,-2 4.2,-0.5 Q4.5,1 3,1 Z" />
  </g>`
];

// Canvas size and larger dense grid configuration
const SIZE = 560;
const COLS = 8;
const ROWS = 8;
const CELL_W = SIZE / COLS; // 70px
const CELL_H = SIZE / ROWS; // 70px

let seed = 2026;
function random() {
  seed = (seed * 9301 + 49297) % 233280;
  return seed / 233280;
}

const items = [];
let primaryIdx = 0;
let fillerIdx = 0;

// Pass 1: Primary Transit Icons (Scaled to 38px - 46px)
for (let r = 0; r < ROWS; r++) {
  // Stagger alternating rows by half cell width (WhatsApp brick layout)
  const rowOffset = (r % 2 === 1) ? (CELL_W / 2) : 0;

  for (let c = 0; c < COLS; c++) {
    const rawX = c * CELL_W + CELL_W / 2 + rowOffset;
    const rawY = r * CELL_H + CELL_H / 2;

    const x = Math.round(rawX % SIZE);
    const y = Math.round(rawY % SIZE);

    const jitterX = (random() - 0.5) * 8;
    const jitterY = (random() - 0.5) * 8;
    const rot = Math.round((random() - 0.5) * 28); // -14 to +14 deg
    const scale = (1.52 + random() * 0.22).toFixed(2); // ~1.52x to 1.74x scale

    const icon = PRIMARY_ICONS[primaryIdx % PRIMARY_ICONS.length];
    primaryIdx++;

    items.push(`  <g transform="translate(${Math.round(x + jitterX)}, ${Math.round(y + jitterY)}) rotate(${rot}) scale(${scale})">
  ${icon}
  </g>`);
  }
}

// Pass 2: Interstitial Fillers to eliminate gaps between the larger icons
for (let r = 0; r < ROWS; r++) {
  const rowOffset = (r % 2 === 1) ? 0 : (CELL_W / 2);

  for (let c = 0; c < COLS; c++) {
    const rawX = c * CELL_W + rowOffset;
    const rawY = r * CELL_H + CELL_H / 2;

    const x = Math.round(rawX % SIZE);
    const y = Math.round(rawY % SIZE);

    const jitterX = (random() - 0.5) * 10;
    const jitterY = (random() - 0.5) * 10;
    const rot = Math.round((random() - 0.5) * 40);
    const scale = (1.35 + random() * 0.35).toFixed(2);

    const filler = FILLER_ICONS[fillerIdx % FILLER_ICONS.length];
    fillerIdx++;

    items.push(`  <g transform="translate(${Math.round(x + jitterX)}, ${Math.round(y + jitterY)}) rotate(${rot}) scale(${scale})">
  ${filler}
  </g>`);
  }
}

// Generate Light Mode SVG
const lightSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" fill="none">
  <defs>
    <style>
      .doodle {
        stroke: #2A1F3D;
        stroke-width: 1.85;
        stroke-linecap: round;
        stroke-linejoin: round;
        fill: none;
        opacity: 0.095;
      }
      .doodle-dot {
        fill: #2A1F3D;
        opacity: 0.095;
      }
    </style>
  </defs>
${items.join('\n')}
</svg>`;

// Generate Dark Mode SVG
const darkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}" fill="none">
  <defs>
    <style>
      .doodle {
        stroke: #E2D9FC;
        stroke-width: 1.85;
        stroke-linecap: round;
        stroke-linejoin: round;
        fill: none;
        opacity: 0.085;
      }
      .doodle-dot {
        fill: #E2D9FC;
        opacity: 0.085;
      }
    </style>
  </defs>
${items.join('\n')}
</svg>`;

const pubDir = path.join(__dirname, '..', 'public');
fs.writeFileSync(path.join(pubDir, 'transit-doodle-light.svg'), lightSvg, 'utf8');
fs.writeFileSync(path.join(pubDir, 'transit-doodle-dark.svg'), darkSvg, 'utf8');

console.log(`Successfully generated large dense transit doodle wallpaper: ${items.length} items (primaries + fillers)!`);
