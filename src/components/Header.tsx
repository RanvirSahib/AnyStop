import { Radio, PhoneCall, Sun, Moon } from 'lucide-react';
import { AnyStopLogo } from './AnyStopLogo';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onOpenInquiries: () => void;
  onOpenSpottedFeed: () => void;
  spottedCount: number;
  currentUser?: { name: string; isGuest?: boolean; avatarUrl?: string } | null;
  onNavigateLanding?: () => void;
  onNavigateLogin?: () => void;
  onNavigateProfile?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenInquiries,
  onOpenSpottedFeed,
  spottedCount,
  currentUser,
  onNavigateLanding,
  onNavigateLogin,
  onNavigateProfile
}) => {
  return (
    <header className="hero">
      <div className="wrap">
        <div className="top">
          <div
            className="logo shrink-0 cursor-pointer"
            onClick={() => {
              if (onNavigateLanding) {
                onNavigateLanding();
              } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            title="Return to AnyStop Home"
          >
            <AnyStopLogo variant="navbar" animated={true} />
          </div>

          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Inquiry button */}
            <button
              onClick={onOpenInquiries}
              className="tbtn shrink-0"
              title="Official Depot Inquiry Directory"
              aria-label="Official Depot Inquiries"
            >
              <PhoneCall style={{ width: '14px', height: '14px', color: 'var(--sun)' }} />
              <span className="hidden md:inline">Inquiries</span>
            </button>

            {/* Spotted button */}
            <button
              onClick={onOpenSpottedFeed}
              className="tbtn shrink-0"
              title="Live Spotted Feed"
              aria-label="Live Spotted Feed"
            >
              <Radio style={{ width: '13.5px', height: '13.5px', color: 'var(--teal)' }} />
              <span className="text-[11.5px] sm:text-sm font-semibold">Spotted</span>
              {spottedCount > 0 && (
                <span
                  style={{
                    background: 'var(--coral)',
                    color: '#fff',
                    borderRadius: '99px',
                    padding: '0 5px',
                    fontSize: '10px',
                    fontWeight: 700,
                    lineHeight: '14px'
                  }}
                >
                  {spottedCount}
                </span>
              )}
            </button>

            {/* User Profile Button */}
            {(onNavigateProfile || onNavigateLogin) && (
              <button
                onClick={onNavigateProfile || onNavigateLogin}
                className="tbtn shrink-0"
                title="View Passenger Profile & Pass"
                aria-label="View Passenger Profile"
              >
                {currentUser?.avatarUrl ? (
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-4 h-4 rounded-full object-cover shrink-0 ring-1 ring-white/60"
                  />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-[var(--coral)] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <span className="text-[11.5px] sm:text-sm font-semibold max-w-[80px] sm:max-w-[100px] truncate">
                  {currentUser?.name || 'Profile'}
                </span>
              </button>
            )}

            {/* Theme toggle */}
            <button
              onClick={onToggleDarkMode}
              className="tbtn shrink-0 theme-toggle-btn"
              id="theme"
              aria-label="Switch light and dark theme"
              title={darkMode ? "Switch to Day theme" : "Switch to Night theme"}
            >
              <span className="hidden sm:inline text-xs font-semibold">Theme</span>
              <span
                key={darkMode ? 'dark' : 'light'}
                className="theme-icon-container"
              >
                {darkMode ? (
                  <Moon className="w-3.5 h-3.5 text-indigo-200 fill-indigo-200/50 theme-icon" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-300 fill-amber-300/60 theme-icon" />
                )}
              </span>
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
