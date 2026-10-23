import React from 'react';
import { Radio, PhoneCall } from 'lucide-react';
import { AnyStopLogo } from './AnyStopLogo';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenInquiries: () => void;
  onOpenSpottedFeed: () => void;
  spottedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenInquiries,
  onOpenSpottedFeed,
  spottedCount
}) => {
  return (
    <header className="hero">
      <div className="wrap">
        <div className="top">
          <div className="logo shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="block sm:hidden">
              <AnyStopLogo variant="navbar" height="34px" animated={true} />
            </div>
            <div className="hidden sm:block">
              <AnyStopLogo variant="navbar" height="42px" animated={true} />
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Inquiry button */}
            <button
              onClick={onOpenInquiries}
              className="tbtn"
              title="Official Depot Inquiry Directory"
              aria-label="Official Depot Inquiries"
            >
              <PhoneCall style={{ width: '15px', height: '15px', color: 'var(--sun)' }} />
              <span className="hidden md:inline">Inquiries</span>
            </button>

            {/* Spotted button */}
            <button
              onClick={onOpenSpottedFeed}
              className="tbtn"
              title="Live Spotted Feed"
              aria-label="Live Spotted Feed"
            >
              <Radio style={{ width: '15px', height: '15px', color: 'var(--teal)' }} />
              <span className="hidden sm:inline">Spotted</span>
              {spottedCount > 0 && (
                <span
                  style={{
                    background: 'var(--coral)',
                    color: '#fff',
                    borderRadius: '99px',
                    padding: '1px 6px',
                    fontSize: '11px',
                    fontWeight: 700,
                    lineHeight: '14px'
                  }}
                >
                  {spottedCount}
                </span>
              )}
            </button>

            {/* Theme toggle */}
            <button
              onClick={onToggleDarkMode}
              className="tbtn"
              id="theme"
              aria-label="Switch light and dark theme"
              title="Toggle light and dark theme"
            >
              <span className="hidden sm:inline">Theme </span>
              <span>{darkMode ? '🌙' : '☀️'}</span>
            </button>
          </div>
        </div>

        <h1>Which bus runs between your two stops across Punjab?</h1>
        <p>
          Pick any bus stand, highway bypass, or village curb stop. See departure times, express vs. all-stop speeds, route breakdowns, and likely fares across all Punjab corridors.
        </p>
      </div>

      {/* Animated road path with bus animation */}
      <svg className="path" viewBox="0 0 620 160" aria-hidden="true">
        <path
          className="r"
          d="M10 130 C120 20 220 150 320 80 S520 10 610 60"
          fill="none"
          stroke="#FF8A7A"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <g fill="#fff">
          <circle cx="10" cy="130" r="8" />
          <circle cx="320" cy="80" r="7" />
          <circle cx="610" cy="60" r="8" />
        </g>
        <circle r="11" fill="#FFB020">
          <animateMotion
            dur="5s"
            repeatCount="indefinite"
            path="M10 130 C120 20 220 150 320 80 S520 10 610 60"
          />
        </circle>
      </svg>
    </header>
  );
};
