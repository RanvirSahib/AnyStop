import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AnyStopLogo } from '../components/AnyStopLogo';
import { ALL_PUNJAB_LOCATIONS } from '../data/transitData';
import './ProfilePage.css';

const GRADIENTS = [
  'linear-gradient(135deg,#FF5A4E,#B8338A)',
  'linear-gradient(135deg,#0B8F82,#1F1A3F)',
  'linear-gradient(135deg,#FFB020,#FF5A4E)',
  'linear-gradient(135deg,#6E64E6,#B8338A)',
  'linear-gradient(135deg,#12B5A6,#6E64E6)'
];

const STATS_TYPE_LABELS: Record<string, string> = {
  any: 'Any',
  E: 'Express',
  L: 'All-stop'
};

const DEFAULT_ROUTES: [string, string][] = [
  ['Chandigarh ISBT 43', 'Ludhiana Bus Stand'],
  ['Kharar', 'Morinda']
];

interface ProfilePrefs {
  type: 'any' | 'E' | 'L';
  own: 'any' | 'G' | 'P';
  lang: 'en' | 'pa' | 'hi';
  alerts: boolean;
  fares: boolean;
  book: boolean;
  gradientIndex: number;
  routes: [string, string][];
}

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, updateUser, uploadAvatarImage, logout, isAuthenticated, isLoadingAuth } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab selection: 0 = Routes, 1 = Preferences, 2 = Account
  const [activeTab, setActiveTab] = useState<number>(0);

  // Profile preferences state
  const [prefs, setPrefs] = useState<ProfilePrefs>(() => {
    try {
      const stored = localStorage.getItem('ss_profile');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          type: parsed.type || 'any',
          own: parsed.own || 'any',
          lang: parsed.lang || 'en',
          alerts: parsed.alerts ?? true,
          fares: parsed.fares ?? true,
          book: parsed.book ?? true,
          gradientIndex: parsed.gradientIndex || 0,
          routes: Array.isArray(parsed.routes) && parsed.routes.length ? parsed.routes : DEFAULT_ROUTES
        };
      }
    } catch {
      // Fallback
    }
    return {
      type: 'any',
      own: 'any',
      lang: 'en',
      alerts: true,
      fares: true,
      book: true,
      gradientIndex: 0,
      routes: DEFAULT_ROUTES
    };
  });

  // Account form fields
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.phoneOrEmail?.includes('@') ? currentUser.phoneOrEmail : '');
  const [phone, setPhone] = useState(!currentUser?.phoneOrEmail?.includes('@') ? currentUser?.phoneOrEmail || '' : '');
  const [homeStop, setHomeStop] = useState(currentUser?.homeStop || 'Chandigarh ISBT 43');

  // Add route form fields
  const [routeFrom, setRouteFrom] = useState('');
  const [routeTo, setRouteTo] = useState('');
  const [routeError, setRouteError] = useState('');
  const [accountError, setAccountError] = useState('');

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track animating deletion route index
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const showToast = (msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // Sync state when currentUser updates
  useEffect(() => {
    if (currentUser) {
      if (currentUser.name) setFullName(currentUser.name);
      if (currentUser.homeStop) setHomeStop(currentUser.homeStop);
      if (currentUser.phoneOrEmail?.includes('@')) {
        setEmail(currentUser.phoneOrEmail);
      } else if (currentUser.phoneOrEmail) {
        setPhone(currentUser.phoneOrEmail);
      }
    }
  }, [currentUser]);

  // Save prefs to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem('ss_profile', JSON.stringify(prefs));
    } catch {
      // Ignore quota errors
    }
  }, [prefs]);

  // Auth gate
  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isLoadingAuth, isAuthenticated, navigate]);

  // Cycle avatar gradient
  const handleCycleAvatar = () => {
    const nextIdx = (prefs.gradientIndex + 1) % GRADIENTS.length;
    setPrefs((prev) => ({ ...prev, gradientIndex: nextIdx }));
    showToast('Avatar style changed');
  };

  // Add custom photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please pick an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const src = evt.target?.result as string;
      if (!src) return;

      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const size = 256;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);

        showToast('Saving profile picture...');
        await uploadAvatarImage(dataUrl);
        showToast('Profile photo updated ✓');
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Remove saved route with smooth slide animation
  const handleRemoveRoute = (index: number) => {
    setDeletingIndex(index);
    setTimeout(() => {
      setPrefs((prev) => {
        const updated = [...prev.routes];
        updated.splice(index, 1);
        return { ...prev, routes: updated };
      });
      setDeletingIndex(null);
      showToast('Route removed');
    }, 320);
  };

  // Add a route
  const handleAddRoute = () => {
    const a = routeFrom.trim();
    const b = routeTo.trim();

    if (!a || !b) {
      setRouteError('Enter both starting and destination stops.');
      return;
    }

    if (a.toLowerCase() === b.toLowerCase()) {
      setRouteError('Choose two different stops.');
      return;
    }

    if (prefs.routes.some((r) => r[0].toLowerCase() === a.toLowerCase() && r[1].toLowerCase() === b.toLowerCase())) {
      setRouteError('You already saved this route.');
      return;
    }

    setRouteError('');
    setPrefs((prev) => ({
      ...prev,
      routes: [[a, b], ...prev.routes]
    }));
    setRouteFrom('');
    setRouteTo('');
    showToast('Route saved ✓');
  };

  // Save Account Changes
  const handleSaveAccount = async () => {
    const n = fullName.trim();
    const e = email.trim();
    const p = phone.replace(/[\s-]/g, '');
    const h = homeStop.trim();

    const errors: string[] = [];
    if (n.length < 2) errors.push('Enter your name.');
    if (e && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) errors.push('Email looks wrong.');
    if (p && !/^[6-9]\d{9}$/.test(p)) errors.push('Phone must be a valid 10-digit number.');

    if (errors.length) {
      setAccountError(errors.join(' '));
      return;
    }

    setAccountError('');
    await updateUser({
      name: n,
      homeStop: h || 'Chandigarh ISBT 43',
      phoneOrEmail: e || p || currentUser?.phoneOrEmail
    });

    showToast('Profile updated ✓');
  };

  // Navigate to bus finder for selected route
  const handleFindBusesForRoute = (from: string, to: string) => {
    navigate(`/buses?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
  };

  // Sign out
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (isLoadingAuth) {
    return (
      <div className="profile-page min-h-screen flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-[var(--coral)] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-bold text-[var(--muted)]">Loading AnyStop Profile...</span>
        </div>
      </div>
    );
  }

  const initial = (fullName || currentUser?.name || 'Traveller').trim()[0]?.toUpperCase() || 'T';
  const cleanHomeStop = (homeStop || currentUser?.homeStop || '—').split(' (')[0].replace(' Bus Stand', '').replace(' Central', '');
  const activeGradient = GRADIENTS[prefs.gradientIndex % GRADIENTS.length];

  return (
    <div className="profile-page">
      {/* Hero Header */}
      <header className="hero">
        <div className="wrap">
          <div className="top">
            <div
              className="logo cursor-pointer shrink-0"
              onClick={() => navigate('/buses')}
              title="Go to AnyStop Bus Finder"
            >
              <AnyStopLogo variant="navbar" animated={true} height="32px" />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleDarkMode}
                className="tbtn shrink-0 theme-toggle-btn"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-200" />}
              </button>

              <button
                type="button"
                onClick={() => navigate('/buses')}
                className="tl"
                title="Return to Bus Search"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Find a bus</span>
              </button>
            </div>
          </div>

          <div className="who">
            <button
              className="av"
              id="av"
              onClick={handleCycleAvatar}
              onContextMenu={(e) => {
                e.preventDefault();
                fileInputRef.current?.click();
              }}
              style={{ ['--g' as any]: activeGradient }}
              aria-label="Change avatar color or picture"
              title="Click to change avatar gradient color, right-click to upload photo"
            >
              {currentUser?.avatarUrl ? (
                <img src={currentUser.avatarUrl} alt={fullName || 'User'} />
              ) : (
                <span id="ini">{initial}</span>
              )}
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
            />

            <div>
              <h1 id="nm">{fullName || currentUser?.name || 'Traveller'}</h1>
              <p id="em">{email || phone || currentUser?.phoneOrEmail || 'Add your email in Account'}</p>
              <span className="tag">ANYSTOP MEMBER</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="wrap">
        {/* Floating Quick Stats */}
        <div className="stats">
          <div className="st">
            <b id="s1">{prefs.routes.length}</b>
            <span>Saved routes</span>
          </div>
          <div className="st">
            <b id="s2">{STATS_TYPE_LABELS[prefs.type] || 'Any'}</b>
            <span>Bus type</span>
          </div>
          <div className="st">
            <b id="s3">{cleanHomeStop || '—'}</b>
            <span>Home stop</span>
          </div>
        </div>

        {/* 3-Tab Segmented Switcher */}
        <div
          className="seg"
          id="seg"
          role="tablist"
          style={{ ['--i' as any]: activeTab }}
        >
          <button
            role="tab"
            aria-selected={activeTab === 0}
            onClick={() => setActiveTab(0)}
          >
            Routes
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 1}
            onClick={() => setActiveTab(1)}
          >
            Preferences
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 2}
            onClick={() => setActiveTab(2)}
          >
            Account
          </button>
        </div>

        {/* Tab 0: Saved Routes */}
        <section className={`panel ${activeTab === 0 ? 'on' : ''}`} id="p0">
          <div className="card">
            <h2>Saved routes</h2>
            <p className="sub">Your regular trips, one tap away.</p>
            <div id="rl">
              {prefs.routes.length > 0 ? (
                prefs.routes.map((r, i) => (
                  <div
                    key={`${r[0]}-${r[1]}-${i}`}
                    className={`route ${deletingIndex === i ? 'out' : ''}`}
                  >
                    <div className="rt">
                      <b>{r[0]}</b>
                      <i />
                      <b>{r[1]}</b>
                    </div>
                    <button
                      type="button"
                      className="mini"
                      onClick={() => handleFindBusesForRoute(r[0], r[1])}
                    >
                      Find buses
                    </button>
                    <button
                      type="button"
                      className="x"
                      aria-label="Remove route"
                      onClick={() => handleRemoveRoute(i)}
                    >
                      ✕
                    </button>
                  </div>
                ))
              ) : (
                <div className="empty">No saved routes yet. Add your first one below.</div>
              )}
            </div>
          </div>

          <div className="card">
            <h2>Add a route</h2>
            <div className="two">
              <label className="f">
                <span>FROM</span>
                <input
                  className="inp"
                  id="rf"
                  list="sl"
                  placeholder="Type a stop"
                  value={routeFrom}
                  onChange={(e) => setRouteFrom(e.target.value)}
                  autoComplete="off"
                />
              </label>
              <label className="f">
                <span>TO</span>
                <input
                  className="inp"
                  id="rtt"
                  list="sl"
                  placeholder="Type a stop"
                  value={routeTo}
                  onChange={(e) => setRouteTo(e.target.value)}
                  autoComplete="off"
                />
              </label>
            </div>
            {routeError && <div className="err" role="alert">{routeError}</div>}
            <button className="btn" type="button" onClick={handleAddRoute}>
              Save route
            </button>
          </div>
        </section>

        {/* Tab 1: Preferences */}
        <section className={`panel ${activeTab === 1 ? 'on' : ''}`} id="p1">
          <div className="card">
            <h2>Bus preferences</h2>

            <p className="lbl">Preferred bus type</p>
            <div className="pills" id="pt">
              {[
                ['any', 'Any'],
                ['E', '⚡ Express'],
                ['L', '🐢 All-stop']
              ].map(([k, v]) => (
                <button
                  key={k}
                  type="button"
                  className="pill"
                  aria-pressed={prefs.type === k}
                  onClick={() => {
                    setPrefs((prev) => ({ ...prev, type: k as any }));
                    showToast('Preference saved');
                  }}
                >
                  {v}
                </button>
              ))}
            </div>

            <p className="lbl">Run by</p>
            <div className="pills" id="po">
              {[
                ['any', 'Any'],
                ['G', '🏛 Government'],
                ['P', 'Private']
              ].map(([k, v]) => (
                <button
                  key={k}
                  type="button"
                  className="pill"
                  aria-pressed={prefs.own === k}
                  onClick={() => {
                    setPrefs((prev) => ({ ...prev, own: k as any }));
                    showToast('Preference saved');
                  }}
                >
                  {v}
                </button>
              ))}
            </div>

            <p className="lbl">Language</p>
            <div className="pills" id="pl">
              {[
                ['en', 'English'],
                ['pa', 'ਪੰਜਾਬੀ'],
                ['hi', 'हिन्दी']
              ].map(([k, v]) => (
                <button
                  key={k}
                  type="button"
                  className="pill"
                  aria-pressed={prefs.lang === k}
                  onClick={() => {
                    setPrefs((prev) => ({ ...prev, lang: k as any }));
                    showToast('Language preference saved');
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="card">
            <h2>Alerts and display</h2>
            <div className="tg">
              <div>
                <b>Peak-hour alerts</b>
                <small>Heads-up on busy days like Fridays</small>
              </div>
              <button
                type="button"
                className="sw"
                role="switch"
                aria-checked={prefs.alerts}
                aria-label="Peak-hour alerts"
                onClick={() => {
                  setPrefs((prev) => ({ ...prev, alerts: !prev.alerts }));
                  showToast(!prefs.alerts ? 'Alerts turned on' : 'Alerts turned off');
                }}
              />
            </div>

            <div className="tg">
              <div>
                <b>Show fare estimates</b>
                <small>Keep cash ready before you board</small>
              </div>
              <button
                type="button"
                className="sw"
                role="switch"
                aria-checked={prefs.fares}
                aria-label="Show fare estimates"
                onClick={() => {
                  setPrefs((prev) => ({ ...prev, fares: !prev.fares }));
                  showToast(!prefs.fares ? 'Fare estimates on' : 'Fare estimates off');
                }}
              />
            </div>

            <div className="tg">
              <div>
                <b>Online booking links</b>
                <small>Show Book online where possible</small>
              </div>
              <button
                type="button"
                className="sw"
                role="switch"
                aria-checked={prefs.book}
                aria-label="Online booking links"
                onClick={() => {
                  setPrefs((prev) => ({ ...prev, book: !prev.book }));
                  showToast(!prefs.book ? 'Booking links on' : 'Booking links off');
                }}
              />
            </div>
          </div>
        </section>

        {/* Tab 2: Account Details */}
        <section className={`panel ${activeTab === 2 ? 'on' : ''}`} id="p2">
          <div className="card">
            <h2>Your details</h2>

            <label className="f">
              <span>FULL NAME</span>
              <input
                className="inp"
                id="an"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                placeholder="Your name"
                maxLength={50}
              />
            </label>

            <label className="f">
              <span>EMAIL</span>
              <input
                className="inp"
                id="ae"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder="you@example.com"
                maxLength={60}
              />
            </label>

            <label className="f">
              <span>PHONE</span>
              <input
                className="inp"
                id="ap"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                placeholder="10-digit mobile number"
                maxLength={15}
              />
            </label>

            <label className="f">
              <span>HOME STOP</span>
              <input
                className="inp"
                id="ah"
                list="sl"
                value={homeStop}
                onChange={(e) => setHomeStop(e.target.value)}
                placeholder="Where you usually start"
                autoComplete="off"
                maxLength={80}
              />
            </label>

            <div className="mt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-[var(--coral)] underline hover:opacity-80 cursor-pointer"
              >
                Upload custom profile photo
              </button>
              {currentUser?.avatarUrl && (
                <button
                  type="button"
                  onClick={async () => {
                    await updateUser({ avatarUrl: undefined });
                    showToast('Custom photo removed');
                  }}
                  className="text-xs font-semibold text-red-500 hover:opacity-80 cursor-pointer"
                >
                  Reset to color avatar
                </button>
              )}
            </div>

            {accountError && <div className="err" role="alert">{accountError}</div>}

            <button className="btn" type="button" onClick={handleSaveAccount}>
              Save changes
            </button>
          </div>

          <button className="btn out" type="button" onClick={handleLogout}>
            Log out
          </button>
        </section>

        {/* Global Stops Datalist for Autocomplete */}
        <datalist id="sl">
          {ALL_PUNJAB_LOCATIONS.map((stop) => (
            <option key={stop} value={stop} />
          ))}
        </datalist>

        <p className="note">
          Your commuter details, preferences, and saved routes are safely synchronized with your AnyStop account.
        </p>
      </main>

      {/* Floating Animated Toast */}
      <div className={`toast ${toastMessage ? 'on' : ''}`} role="status">
        {toastMessage}
      </div>
    </div>
  );
};

export default ProfilePage;
