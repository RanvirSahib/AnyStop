import React from 'react';

export type LogoVariant = 'navbar' | 'vertical' | 'icon' | 'app-icon' | 'emblem' | 'dynamic';

export interface AnyStopLogoProps {
  variant?: LogoVariant;
  className?: string;
  height?: number | string;
  showSparkle?: boolean;
  animated?: boolean;
  onClick?: () => void;
}

export const AnyStopLogo: React.FC<AnyStopLogoProps> = ({
  variant = 'navbar',
  className = '',
  height,
  showSparkle = true,
  animated = true,
  onClick
}) => {
  // Option 2: Compact Navbar (Horizontal)
  if (variant === 'navbar') {
    return (
      <div
        className={`inline-flex items-center gap-2.5 select-none transition-transform duration-200 ${
          onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''
        } ${className}`}
        onClick={onClick}
        role={onClick ? 'button' : 'img'}
        aria-label="AnyStop Logo"
      >
        <svg
          viewBox="0 0 320 80"
          className="w-auto"
          style={{ height: height || '42px', overflow: 'visible' }}
          fill="none"
        >
          <defs>
            <linearGradient id="navPinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#FF6B5E" />
              <stop offset="100%" stop-color="#FF4B3E" />
            </linearGradient>
            <linearGradient id="navRoadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#FFB326" />
              <stop offset="100%" stop-color="#FF981A" />
            </linearGradient>
            <filter id="navShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.25" />
            </filter>
          </defs>

          {/* Left Icon Mark */}
          <g transform="translate(10, 4)" filter="url(#navShadow)" className={animated ? 'anystop-logo-mark' : ''}>
            {/* Left Signal Waves */}
            <path
              d="M 23 23 A 28 28 0 0 0 23 51"
              stroke="#FFA726"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.95"
            />
            <path
              d="M 29 28 A 18 18 0 0 0 29 46"
              stroke="#FF5A4E"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Right Signal Waves */}
            <path
              d="M 67 28 A 18 18 0 0 1 67 46"
              stroke="#FF5A4E"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M 73 23 A 28 28 0 0 1 73 51"
              stroke="#FFA726"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.95"
            />

            {/* Location Pin */}
            <path
              d="M 48 64 C 41 53 28 41 28 26 A 20 20 0 1 1 68 26 C 68 41 55 53 48 64 Z"
              fill="url(#navPinGrad)"
            />

            {/* Bus Silhouette */}
            <rect x="37" y="14" width="22" height="26" rx="5.5" fill="#1F1A3F" />
            <rect x="40.5" y="18" width="15" height="7.5" rx="2" fill="#FF5A4E" />
            <circle cx="41.5" cy="32.5" r="1.6" fill="#FF5A4E" />
            <circle cx="54.5" cy="32.5" r="1.6" fill="#FF5A4E" />
            <rect x="45" y="33.5" width="6" height="1.4" rx="0.7" fill="#FF5A4E" />

            {/* Road 'A' */}
            <path
              d="M 44.5 37 L 51.5 37 L 59 66 L 52.5 66 L 50 56 L 46 56 L 43.5 66 L 37 66 Z"
              fill="url(#navRoadGrad)"
            />
            <polygon points="48,41 45.2,50.5 50.8,50.5" fill="#1F1A3F" />
            <polygon points="48,56 46,66 50,66" fill="#1F1A3F" />

            {/* Dashed highway lane lines */}
            <line x1="48" y1="44" x2="48" y2="49" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="48" y1="52" x2="48" y2="55" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="48" y1="58" x2="48" y2="64" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
          </g>

          {/* Typography: "AnyStop" */}
          <g
            fontFamily="'Bricolage Grotesque', 'Figtree', sans-serif"
            fontWeight="800"
            fontSize="38"
            letterSpacing="-0.5"
          >
            <text x="96" y="52" fill="#FFA726">
              Any
            </text>
            <text x="174" y="52" fill="#FFFFFF">
              Stop
            </text>
          </g>

          {/* Sparkle Star */}
          {showSparkle && (
            <path
              d="M 276 26 Q 276 32 282 32 Q 276 32 276 38 Q 276 32 270 32 Q 276 32 276 26 Z"
              fill="#A29DBE"
              opacity="0.85"
              className={animated ? 'anystop-sparkle' : ''}
            />
          )}
        </svg>
      </div>
    );
  }

  // Option 1: Vertical Full Logo
  if (variant === 'vertical') {
    return (
      <div
        className={`inline-flex flex-col items-center select-none ${
          onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''
        } ${className}`}
        onClick={onClick}
        role={onClick ? 'button' : 'img'}
        aria-label="AnyStop Vertical Logo"
      >
        <svg
          viewBox="0 0 300 320"
          className="w-auto"
          style={{ height: height || '240px', overflow: 'visible' }}
          fill="none"
        >
          <defs>
            <linearGradient id="vertPinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#FF6B5E" />
              <stop offset="100%" stop-color="#FF4B3E" />
            </linearGradient>
            <linearGradient id="vertRoadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#FFB326" />
              <stop offset="100%" stop-color="#FF981A" />
            </linearGradient>
            <filter id="vertShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="5" flood-color="#000000" flood-opacity="0.3" />
            </filter>
          </defs>

          {/* Icon Mark Centered */}
          <g transform="translate(150, 80) scale(1.6)" filter="url(#vertShadow)">
            <g transform="translate(-48, -44)">
              <path d="M 23 23 A 28 28 0 0 0 23 51" stroke="#FFA726" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.95" />
              <path d="M 29 28 A 18 18 0 0 0 29 46" stroke="#FF5A4E" strokeWidth="3.2" strokeLinecap="round" fill="none" />
              <path d="M 67 28 A 18 18 0 0 1 67 46" stroke="#FF5A4E" strokeWidth="3.2" strokeLinecap="round" fill="none" />
              <path d="M 73 23 A 28 28 0 0 1 73 51" stroke="#FFA726" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.95" />

              <path d="M 48 64 C 41 53 28 41 28 26 A 20 20 0 1 1 68 26 C 68 41 55 53 48 64 Z" fill="url(#vertPinGrad)" />

              <rect x="37" y="14" width="22" height="26" rx="5.5" fill="#1F1A3F" />
              <rect x="40.5" y="18" width="15" height="7.5" rx="2" fill="#FF5A4E" />
              <circle cx="41.5" cy="32.5" r="1.6" fill="#FF5A4E" />
              <circle cx="54.5" cy="32.5" r="1.6" fill="#FF5A4E" />
              <rect x="45" y="33.5" width="6" height="1.4" rx="0.7" fill="#FF5A4E" />

              <path d="M 44.5 37 L 51.5 37 L 59 66 L 52.5 66 L 50 56 L 46 56 L 43.5 66 L 37 66 Z" fill="url(#vertRoadGrad)" />
              <polygon points="48,41 45.2,50.5 50.8,50.5" fill="#1F1A3F" />
              <polygon points="48,56 46,66 50,66" fill="#1F1A3F" />

              <line x1="48" y1="44" x2="48" y2="49" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
              <line x1="48" y1="52" x2="48" y2="55" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
              <line x1="48" y1="58" x2="48" y2="64" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          </g>

          {/* Typography */}
          <g fontFamily="'Bricolage Grotesque', 'Figtree', sans-serif" fontWeight="800" textAnchor="middle" letterSpacing="-1">
            <text x="150" y="210" fontSize="52" fill="#FFA726">Any</text>
            <text x="150" y="268" fontSize="56" fill="#FFFFFF">Stop</text>
          </g>

          {/* Sparkles */}
          {showSparkle && (
            <>
              <path d="M 230 196 Q 230 203 237 203 Q 230 203 230 210 Q 230 203 223 203 Q 230 203 230 196 Z" fill="#8E8AA8" opacity="0.6" />
              <path d="M 244 246 Q 244 256 254 256 Q 244 256 244 266 Q 244 256 234 256 Q 244 256 244 246 Z" fill="#8E8AA8" opacity="0.75" />
            </>
          )}
        </svg>
      </div>
    );
  }

  // Option 4: Mobile App Icon (Squircle)
  if (variant === 'app-icon') {
    return (
      <div
        className={`inline-block select-none ${
          onClick ? 'cursor-pointer hover:scale-[1.03] active:scale-[0.97]' : ''
        } ${className}`}
        onClick={onClick}
        role={onClick ? 'button' : 'img'}
        aria-label="AnyStop App Icon"
      >
        <svg
          viewBox="0 0 512 512"
          className="w-auto rounded-3xl shadow-xl"
          style={{ height: height || '64px' }}
          fill="none"
        >
          <defs>
            <linearGradient id="appBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#28224E" />
              <stop offset="100%" stop-color="#181433" />
            </linearGradient>
            <linearGradient id="appIconPin" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#FF6B5E" />
              <stop offset="100%" stop-color="#FF473B" />
            </linearGradient>
            <linearGradient id="appIconRoad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#FFB326" />
              <stop offset="100%" stop-color="#FF9615" />
            </linearGradient>
            <radialGradient id="appIconGlow" cx="50%" cy="45%" r="45%">
              <stop offset="0%" stop-color="#FF5A4E" stop-opacity="0.25" />
              <stop offset="100%" stop-color="#FF5A4E" stop-opacity="0" />
            </radialGradient>
          </defs>

          <rect width="512" height="512" rx="124" fill="url(#appBgGrad)" />
          <rect width="508" height="508" x="2" y="2" rx="122" stroke="#FFFFFF" strokeOpacity="0.1" strokeWidth="2" />
          <circle cx="256" cy="245" r="180" fill="url(#appIconGlow)" />

          <path d="M 124 168 A 120 120 0 0 0 124 322" stroke="#FFA726" strokeWidth="18" strokeLinecap="round" fill="none" />
          <path d="M 154 195 A 80 80 0 0 0 154 295" stroke="#FF5A4E" strokeWidth="16" strokeLinecap="round" fill="none" />
          <path d="M 358 195 A 80 80 0 0 1 358 295" stroke="#FF5A4E" strokeWidth="16" strokeLinecap="round" fill="none" />
          <path d="M 388 168 A 120 120 0 0 1 388 322" stroke="#FFA726" strokeWidth="18" strokeLinecap="round" fill="none" />

          <g>
            <path d="M 256 376 C 218 318 152 258 152 184 A 104 104 0 1 1 360 184 C 360 258 294 318 256 376 Z" fill="url(#appIconPin)" />
            <rect x="200" y="124" width="112" height="132" rx="28" fill="#1F1A3F" />
            <rect x="216" y="144" width="80" height="40" rx="10" fill="#FF5A4E" />
            <circle cx="224" cy="220" r="8.5" fill="#FF5A4E" />
            <circle cx="288" cy="220" r="8.5" fill="#FF5A4E" />
            <rect x="240" y="226" width="32" height="7" rx="3.5" fill="#FF5A4E" />

            <path d="M 238 240 L 274 240 L 312 388 L 280 388 L 268 338 L 244 338 L 232 388 L 200 388 Z" fill="url(#appIconRoad)" />
            <polygon points="256,260 242,310 270,310" fill="#1F1A3F" />
            <polygon points="256,338 244,388 268,388" fill="#1F1A3F" />

            <line x1="256" y1="274" x2="256" y2="304" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
            <line x1="256" y1="318" x2="256" y2="334" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
            <line x1="256" y1="348" x2="256" y2="378" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" />
          </g>

          <path d="M 336 348 Q 336 362 350 362 Q 336 362 336 376 Q 336 362 322 362 Q 336 362 336 348 Z" fill="#8E8AA8" opacity="0.65" />
        </svg>
      </div>
    );
  }

  // Option 3: Circle Emblem
  if (variant === 'emblem') {
    return (
      <div
        className={`inline-block select-none ${
          onClick ? 'cursor-pointer hover:scale-[1.03] active:scale-[0.97]' : ''
        } ${className}`}
        onClick={onClick}
        role={onClick ? 'button' : 'img'}
        aria-label="AnyStop Emblem"
      >
        <svg
          viewBox="0 0 340 340"
          className="w-auto drop-shadow-lg"
          style={{ height: height || '120px' }}
          fill="none"
        >
          <circle cx="170" cy="170" r="156" fill="#1F1A3F" stroke="#FFA726" strokeWidth="12" />
          <g transform="translate(170, 142) scale(1.4)">
            <g transform="translate(-48, -48)">
              <path d="M 23 23 A 28 28 0 0 0 23 51" stroke="#FFA726" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.95" />
              <path d="M 29 28 A 18 18 0 0 0 29 46" stroke="#FF5A4E" strokeWidth="3.2" strokeLinecap="round" fill="none" />
              <path d="M 67 28 A 18 18 0 0 1 67 46" stroke="#FF5A4E" strokeWidth="3.2" strokeLinecap="round" fill="none" />
              <path d="M 73 23 A 28 28 0 0 1 73 51" stroke="#FFA726" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.95" />

              <path d="M 48 64 C 41 53 28 41 28 26 A 20 20 0 1 1 68 26 C 68 41 55 53 48 64 Z" fill="#FF5A4E" />

              <rect x="37" y="14" width="22" height="26" rx="5.5" fill="#1F1A3F" />
              <rect x="40.5" y="18" width="15" height="7.5" rx="2" fill="#FF5A4E" />
              <circle cx="41.5" cy="32.5" r="1.6" fill="#FF5A4E" />
              <circle cx="54.5" cy="32.5" r="1.6" fill="#FF5A4E" />
              <rect x="45" y="33.5" width="6" height="1.4" rx="0.7" fill="#FF5A4E" />

              <path d="M 44.5 37 L 51.5 37 L 59 66 L 52.5 66 L 50 56 L 46 56 L 43.5 66 L 37 66 Z" fill="#FFA726" />
              <polygon points="48,41 45.2,50.5 50.8,50.5" fill="#1F1A3F" />
              <polygon points="48,56 46,66 50,66" fill="#1F1A3F" />

              <line x1="48" y1="44" x2="48" y2="49" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
              <line x1="48" y1="52" x2="48" y2="55" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
              <line x1="48" y1="58" x2="48" y2="64" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
            </g>
          </g>

          <g fontFamily="'Bricolage Grotesque', 'Figtree', sans-serif" fontWeight="800" fontSize="34" letterSpacing="-0.5" textAnchor="middle">
            <text x="170" y="278">
              <tspan fill="#FFA726">Any</tspan><tspan fill="#FFFFFF">Stop</tspan>
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // Option 6: Dynamic Sweep
  if (variant === 'dynamic') {
    return (
      <div
        className={`inline-block select-none ${
          onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]' : ''
        } ${className}`}
        onClick={onClick}
        role={onClick ? 'button' : 'img'}
        aria-label="AnyStop Dynamic Logo"
      >
        <svg
          viewBox="0 0 340 300"
          className="w-auto drop-shadow-md"
          style={{ height: height || '140px' }}
          fill="none"
        >
          <g fill="#FF5A4E" opacity="0.95">
            <path d="M 220 86 L 278 86 C 280 86 280 89 278 89 L 220 89 Z" />
            <path d="M 220 98 L 294 98 C 296 98 296 102 294 102 L 220 102 Z" />
            <path d="M 220 112 L 310 112 C 313 112 313 117 310 117 L 220 117 Z" />
            <path d="M 220 128 L 298 128 C 300 128 300 133 298 133 L 220 133 Z" />
            <path d="M 220 144 L 272 144 C 274 144 274 148 272 148 L 220 148 Z" />
          </g>

          <path d="M 40 250 C 70 246 104 228 134 196 C 160 168 184 136 214 122 C 200 160 162 216 110 248 C 90 260 64 266 40 268 Z" fill="#FFA726" />
          <path d="M 62 251 C 82 245 99 232 116 218" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeDasharray="12 16" fill="none" />
          <path d="M 124 210 C 145 190 166 164 186 142" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round" strokeDasharray="10 14" fill="none" />

          <g transform="translate(140, 40)">
            <path d="M 70 140 C 44 116 16 88 16 54 A 54 54 0 1 1 124 54 C 124 88 96 116 70 140 Z" fill="#FF5A4E" />
            <rect x="42" y="30" width="56" height="66" rx="14" fill="#1F1A3F" />
            <rect x="50" y="38" width="40" height="20" rx="5" fill="#FF5A4E" />
            <circle cx="53" cy="76" r="4" fill="#FF5A4E" />
            <circle cx="87" cy="76" r="4" fill="#FF5A4E" />
            <rect x="62" y="79" width="16" height="3" rx="1.5" fill="#FF5A4E" />
          </g>

          <g fontFamily="'Bricolage Grotesque', 'Figtree', sans-serif" fontWeight="800">
            <text x="210" y="210" fontSize="44" fill="#FFA726">Any</text>
            <text x="210" y="258" fontSize="48" fill="#FFFFFF">Stop</text>
          </g>
        </svg>
      </div>
    );
  }

  // Default: Icon only
  return (
    <div
      className={`inline-block select-none ${
        onClick ? 'cursor-pointer hover:scale-[1.05] active:scale-[0.95]' : ''
      } ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : 'img'}
      aria-label="AnyStop Mark"
    >
      <svg
        viewBox="0 0 96 80"
        className="w-auto overflow-visible"
        style={{ height: height || '36px' }}
        fill="none"
      >
        <g transform="translate(0, 4)">
          <path d="M 23 23 A 28 28 0 0 0 23 51" stroke="#FFA726" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.95" />
          <path d="M 29 28 A 18 18 0 0 0 29 46" stroke="#FF5A4E" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          <path d="M 67 28 A 18 18 0 0 1 67 46" stroke="#FF5A4E" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          <path d="M 73 23 A 28 28 0 0 1 73 51" stroke="#FFA726" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.95" />

          <path d="M 48 64 C 41 53 28 41 28 26 A 20 20 0 1 1 68 26 C 68 41 55 53 48 64 Z" fill="#FF5A4E" />

          <rect x="37" y="14" width="22" height="26" rx="5.5" fill="#1F1A3F" />
          <rect x="40.5" y="18" width="15" height="7.5" rx="2" fill="#FF5A4E" />
          <circle cx="41.5" cy="32.5" r="1.6" fill="#FF5A4E" />
          <circle cx="54.5" cy="32.5" r="1.6" fill="#FF5A4E" />
          <rect x="45" y="33.5" width="6" height="1.4" rx="0.7" fill="#FF5A4E" />

          <path d="M 44.5 37 L 51.5 37 L 59 66 L 52.5 66 L 50 56 L 46 56 L 43.5 66 L 37 66 Z" fill="#FFA726" />
          <polygon points="48,41 45.2,50.5 50.8,50.5" fill="#1F1A3F" />
          <polygon points="48,56 46,66 50,66" fill="#1F1A3F" />

          <line x1="48" y1="44" x2="48" y2="49" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="48" y1="52" x2="48" y2="55" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
          <line x1="48" y1="58" x2="48" y2="64" stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

export default AnyStopLogo;
