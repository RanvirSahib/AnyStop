import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Camera,
  Upload,
  Trash2,
  ShieldCheck,
  Ticket,
  MapPin,
  Clock,
  Compass,
  Settings,
  LogOut,
  CheckCircle2,
  ChevronRight,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AnyStopLogo } from '../components/AnyStopLogo';
import { POPULAR_TRIPS } from '../data/transitData';

const KEY_PUNJAB_STATIONS = [
  'Chandigarh ISBT 43',
  'Chandigarh ISBT 17',
  'Ludhiana Bus Stand',
  'Amritsar ISBT',
  'Jalandhar Central Bus Stand',
  'Patiala Central Bus Stand',
  'Bathinda Central Bus Stand',
  'Hoshiarpur Bus Stand',
  'Pathankot Bus Stand',
  'Moga Central Bus Stand',
  'Mohali Phase 8 Bus Stand',
  'Delhi ISBT Kashmiri Gate'
];

const PRESET_AVATARS = [
  { label: 'Bus Captain', icon: '🚌' },
  { label: 'City Commuter', icon: '🧢' },
  { label: 'Express Rider', icon: '⚡' },
  { label: 'Transit Pilot', icon: '✈️' },
  { label: 'VIP Pass', icon: '⭐' },
  { label: 'Highway Scout', icon: '🕶️' }
];

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, updateUser, uploadAvatarImage, removeAvatarImage, logout, isAuthenticated } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Editable Profile State
  const [nameInput, setNameInput] = useState(currentUser?.name || 'guest');
  const [homeStop, setHomeStop] = useState(currentUser?.homeStop || 'Chandigarh ISBT 43');
  const [preferredClass, setPreferredClass] = useState(currentUser?.preferredClass || 'Ordinary');
  const [preferredSpeed, setPreferredSpeed] = useState<'any' | 'E' | 'L'>('any');
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [photoToast, setPhotoToast] = useState<string | null>(null);
  const [spottedCount, setSpottedCount] = useState(0);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Keep state synced with currentUser if it changes
  useEffect(() => {
    if (currentUser) {
      setNameInput(currentUser.name || 'guest');
      if (currentUser.homeStop) setHomeStop(currentUser.homeStop);
      if (currentUser.preferredClass) setPreferredClass(currentUser.preferredClass);
    }
  }, [currentUser]);

  // Retrieve user spotted contributions count from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('anystop_spotted_reports');
      if (stored) {
        const reports = JSON.parse(stored);
        setSpottedCount(Array.isArray(reports) ? reports.length : 0);
      }
    } catch {
      setSpottedCount(0);
    }
  }, []);

  // Handle Photo Upload with client-side image compression & database sync
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setPhotoToast('Please choose a valid image (PNG, JPG, WebP).');
      setTimeout(() => setPhotoToast(null), 3000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoToast('Image should be under 5MB.');
      setTimeout(() => setPhotoToast(null), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      if (!src) return;

      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const size = 256;
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Center-crop to square
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;

        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);

        setIsUploadingPhoto(true);
        setPhotoToast('Saving profile picture to database...');
        try {
          const res = await uploadAvatarImage(dataUrl);
          if (res.success) {
            setPhotoToast('Profile photo saved to database! ✨');
          } else {
            setPhotoToast('Photo saved locally (database sync will retry)');
          }
        } catch {
          setPhotoToast('Profile photo updated.');
        } finally {
          setIsUploadingPhoto(false);
          setTimeout(() => setPhotoToast(null), 3000);
        }
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleRemovePhoto = async () => {
    setIsUploadingPhoto(true);
    setPhotoToast('Removing photo from database...');
    try {
      await removeAvatarImage();
      setPhotoToast('Profile photo removed from database.');
    } finally {
      setIsUploadingPhoto(false);
      setTimeout(() => setPhotoToast(null), 2500);
    }
  };

  const handleSelectPreset = async (icon: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 160;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 160, 160);
      grad.addColorStop(0, '#FF5A4E');
      grad.addColorStop(1, '#FFB020');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(80, 80, 80, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '76px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(icon, 80, 86);
      const dataUrl = canvas.toDataURL('image/png');

      setIsUploadingPhoto(true);
      setPhotoToast(`Saving ${icon} avatar to database...`);
      try {
        await uploadAvatarImage(dataUrl);
        setPhotoToast(`Avatar changed to ${icon} and saved to database! ✨`);
      } finally {
        setIsUploadingPhoto(false);
        setTimeout(() => setPhotoToast(null), 2500);
      }
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;

    setIsSavingProfile(true);
    await updateUser({
      name: nameInput.trim(),
      homeStop,
      preferredClass
    });
    setIsSavingProfile(false);
    setIsSavedToast(true);
    setTimeout(() => {
      setIsSavedToast(false);
    }, 2800);
  };

  const handleLaunchTrip = (from: string, to: string) => {
    navigate(`/buses?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!currentUser) {
    return null;
  }

  const passNumber = currentUser.ticketNo || 'PB-2026-9042';
  const issueDate = currentUser.boardedAt
    ? new Date(currentUser.boardedAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : '25 Oct 2026';

  const userInitial = (currentUser.name || 'G').charAt(0).toUpperCase();

  return (
    <div className="min-h-screen text-[var(--ink)] relative pb-14 transition-colors duration-200">
      {/* Top Header - Matches Dashboard */}
      <header className="hero" style={{ padding: '16px 0 36px' }}>
        <div className="wrap flex items-center justify-between gap-3">
          <div
            className="logo cursor-pointer shrink-0"
            onClick={() => navigate('/buses')}
            title="Go to AnyStop Bus Finder"
          >
            <AnyStopLogo variant="navbar" animated={true} />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Back to Bus Finder */}
            <button
              type="button"
              onClick={() => navigate('/buses')}
              className="tbtn shrink-0"
              title="Return to Bus Search"
            >
              <ArrowLeft className="w-4 h-4 text-[var(--coral)]" />
              <span className="text-xs sm:text-sm font-semibold">Bus Finder</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="tbtn shrink-0 theme-toggle-btn"
              title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-300" />
              ) : (
                <Moon className="w-4 h-4 text-slate-200" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Profile Content - Transparent background lets body::before transit doodle wallpaper show through */}
      <main className="wrap -mt-5 sm:-mt-7 relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Saved Success Notification */}
        {isSavedToast && (
          <div className="rounded-2xl bg-emerald-500/15 border border-emerald-500/30 p-3 sm:p-4 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Profile and commuter preferences saved successfully!</span>
          </div>
        )}

        {/* Photo Upload Toast Notification */}
        {photoToast && (
          <div className="rounded-2xl bg-sky-500/15 border border-sky-500/30 p-3 sm:p-4 text-sky-800 dark:text-sky-300 text-xs sm:text-sm font-semibold flex items-center gap-2 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-sky-600 dark:text-sky-400 shrink-0" />
            <span>{photoToast}</span>
          </div>
        )}

        {/* 1. Digital Commuter Boarding Pass Card with Profile Picture */}
        <section className="card p-5 sm:p-7 relative overflow-hidden shadow-lg border border-[var(--line)]/70">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[var(--coral)]/10 to-[var(--sun)]/15 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center sm:items-center justify-between gap-5 relative z-10">
            {/* User Avatar with Profile Picture Upload & Change Feature */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <div className="relative group shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shadow-md ring-4 ring-[var(--line)]/60 bg-gradient-to-tr from-[var(--coral)] to-[var(--sun)] flex items-center justify-center relative">
                  {currentUser.avatarUrl ? (
                    <img
                      src={currentUser.avatarUrl}
                      alt={currentUser.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white text-3xl sm:text-4xl font-extrabold select-none">
                      {userInitial}
                    </span>
                  )}

                  {/* Saving spinner overlay */}
                  {isUploadingPhoto && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-10 rounded-2xl">
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>

                {/* Camera upload overlay badge */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[var(--coral)] hover:bg-[var(--coral2)] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer ring-2 ring-[var(--bg)]"
                  title="Upload / Change Profile Picture"
                  aria-label="Upload / Change Profile Picture"
                >
                  <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                />
              </div>

              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-[var(--ink)] tracking-tight">
                    {currentUser.name}
                  </h1>
                </div>

                <p className="text-xs text-[var(--muted)] mt-1 flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                  <Ticket className="w-3.5 h-3.5 text-[var(--coral)]" />
                  <span>Pass: <strong className="font-mono text-[var(--ink)]">{passNumber}</strong></span>
                  <span>•</span>
                  <Clock className="w-3.5 h-3.5 text-[var(--teal)]" />
                  <span>Boarded: {issueDate}</span>
                </p>

                <p className="text-xs text-[var(--muted)] mt-1 flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                  <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  <span>Home Terminal: <strong className="text-[var(--ink)]">{homeStop}</strong></span>
                  <span>•</span>
                  <Sparkles className="w-3.5 h-3.5 text-[var(--coral)] shrink-0" />
                  <span>Spotted: <strong className="text-[var(--ink)]">{spottedCount} live</strong></span>
                </p>

                {/* Photo Action Buttons */}
                <div className="mt-2.5 flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingPhoto}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[var(--line)]/50 hover:bg-[var(--line)] text-[var(--ink)] flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-3 h-3 text-[var(--coral)]" />
                    <span>{currentUser.avatarUrl ? 'Change Picture' : 'Upload Picture'}</span>
                  </button>

                  {currentUser.avatarUrl && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      disabled={isUploadingPhoto}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-lg text-rose-500 hover:bg-rose-500/10 flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  )}

                  <span className="text-[10.5px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    ✓ Saves automatically
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Badge */}
            <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0 border-[var(--line)]/50">
              <span className="badge b-fare text-xs">
                365-Day Daily Pass
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="text-xs text-rose-500 hover:text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                title="Log out and switch commuter pass"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Exit Pass</span>
              </button>
            </div>
          </div>
        </section>

        {/* 3. Profile Preferences & Customization */}
        <section className="card p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[var(--line)]/50">
            <Settings className="w-5 h-5 text-[var(--coral)]" />
            <h2 className="text-base sm:text-lg font-bold text-[var(--ink)]">
              Commuter Profile Settings
            </h2>
          </div>

          {/* Quick Preset Transit Avatars */}
          <div>
            <label className="block text-xs font-bold text-[var(--muted)] mb-2">
              CHOOSE A TRANSIT AVATAR (OR UPLOAD YOUR OWN ABOVE)
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET_AVATARS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => handleSelectPreset(preset.icon)}
                  className="px-3 py-1.5 rounded-xl border border-[var(--line)] bg-[var(--line)]/20 hover:bg-[var(--line)]/50 hover:border-[var(--coral)] text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  title={`Set avatar to ${preset.label}`}
                >
                  <span className="text-base">{preset.icon}</span>
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Display Name */}
              <div>
                <label className="block text-xs font-bold text-[var(--muted)] mb-1.5">
                  PASSENGER NAME
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Enter passenger name"
                  className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-[var(--coral)] transition-colors font-semibold"
                />
              </div>

              {/* Home Bus Stand */}
              <div>
                <label className="block text-xs font-bold text-[var(--muted)] mb-1.5">
                  HOME TRANSIT STAND
                </label>
                <select
                  value={homeStop}
                  onChange={(e) => setHomeStop(e.target.value)}
                  className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-[var(--coral)] transition-colors font-medium cursor-pointer"
                >
                  {KEY_PUNJAB_STATIONS.map((stop) => (
                    <option key={stop} value={stop}>
                      {stop}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred Class */}
              <div>
                <label className="block text-xs font-bold text-[var(--muted)] mb-1.5">
                  PREFERRED TRAVEL CLASS
                </label>
                <select
                  value={preferredClass}
                  onChange={(e) => setPreferredClass(e.target.value)}
                  className="w-full h-10 px-3 text-xs sm:text-sm rounded-xl border border-[var(--line)] bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-[var(--coral)] transition-colors font-medium cursor-pointer"
                >
                  <option value="Ordinary">Ordinary Stage Carriage (Non-AC)</option>
                  <option value="HVAC Semi-Deluxe">HVAC Semi-Deluxe</option>
                  <option value="HVAC">HVAC Intercity Express</option>
                  <option value="Volvo AC">Volvo AC / Luxury Air-Conditioned</option>
                  <option value="Mini Bus">Mini Bus (Local Feeder)</option>
                </select>
              </div>

              {/* Preferred Service Speed */}
              <div>
                <label className="block text-xs font-bold text-[var(--muted)] mb-1.5">
                  PREFERRED SERVICE TYPE
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPreferredSpeed('any')}
                    className={`h-10 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      preferredSpeed === 'any'
                        ? 'border-[var(--coral)] bg-[var(--coral)]/10 text-[var(--coral)]'
                        : 'border-[var(--line)] text-[var(--muted)] hover:border-[var(--line)]/80'
                    }`}
                  >
                    All Types
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferredSpeed('E')}
                    className={`h-10 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      preferredSpeed === 'E'
                        ? 'border-[var(--teal)] bg-[var(--teal)]/10 text-[var(--teal)]'
                        : 'border-[var(--line)] text-[var(--muted)] hover:border-[var(--line)]/80'
                    }`}
                  >
                    ⚡ Express
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreferredSpeed('L')}
                    className={`h-10 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                      preferredSpeed === 'L'
                        ? 'border-[var(--sun)] bg-[var(--sun)]/10 text-[var(--sunink)]'
                        : 'border-[var(--line)] text-[var(--muted)] hover:border-[var(--line)]/80'
                    }`}
                  >
                    🐢 All-stop
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--coral)] to-[var(--sun)] text-white text-xs sm:text-sm font-bold shadow-md hover:opacity-95 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
              >
                {isSavingProfile ? 'Saving to Database...' : 'Save Preferences'}
              </button>
            </div>
          </form>
        </section>

        {/* 4. Quick Frequent Corridors Launcher */}
        <section className="card p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--line)]/50">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[var(--teal)]" />
              <h2 className="text-base sm:text-lg font-bold text-[var(--ink)]">
                Favorite & Frequent Corridors
              </h2>
            </div>
            <span className="text-xs text-[var(--muted)] font-medium">1-tap search</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {POPULAR_TRIPS.slice(0, 6).map(([fromStop, toStop], idx) => (
              <div
                key={idx}
                onClick={() => handleLaunchTrip(fromStop, toStop)}
                className="p-3 rounded-xl bg-[var(--line)]/20 hover:bg-[var(--line)]/40 border border-[var(--line)]/50 flex items-center justify-between gap-2 cursor-pointer transition-all group"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs sm:text-sm text-[var(--ink)] truncate group-hover:text-[var(--coral)] transition-colors">
                    {fromStop.split(' (')[0]} → {toStop.split(' (')[0]}
                  </div>
                  <div className="text-[11px] text-[var(--muted)] mt-0.5">
                    Daily scheduled stage carriage service
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-[var(--line)]/40 flex items-center justify-center shrink-0 group-hover:bg-[var(--coral)] group-hover:text-white transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Account Switcher & Sign Out */}
        <section className="p-4 rounded-2xl bg-[var(--line)]/20 border border-[var(--line)]/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[var(--muted)]">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Digital Boarding Pass stored securely on this device.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-3 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--bg)] font-bold text-[var(--ink)] hover:border-[var(--coral)] transition-colors cursor-pointer"
            >
              Switch Pass
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 font-bold hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
