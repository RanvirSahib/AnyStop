import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { useAuth, UserSession } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AnyStopLogo } from '../components/AnyStopLogo';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, signInWithCredentials, signUpWithCredentials, signInWithGoogleAuth, isSupabaseActive } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [ticketNoLogin] = useState<string>(() => "NO. " + String(Math.floor(Math.random() * 4000) + 1000));
  const [ticketNoSignup] = useState<string>(() => "NO. " + String(Math.floor(Math.random() * 4000) + 5000));
  const [animStep, setAnimStep] = useState<number>(0);

  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign up specific fields
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);

  const [badName, setBadName] = useState(false);
  const [badId, setBadId] = useState(false);
  const [badPw, setBadPw] = useState(false);
  const [badEmail, setBadEmail] = useState(false);
  const [badPhone, setBadPhone] = useState(false);
  const [badSignupPw, setBadSignupPw] = useState(false);
  const [badConfirmPw, setBadConfirmPw] = useState(false);
  const [confirmPwErrorMsg, setConfirmPwErrorMsg] = useState('Passwords do not match.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [isTorn, setIsTorn] = useState(false);
  const [isBusRunning, setIsBusRunning] = useState(false);
  const [welcomeName, setWelcomeName] = useState('traveller');

  useEffect(() => {
    document.title = 'AnyStop – Board your account';
  }, []);

  const switchMode = (newMode: 'in' | 'up') => {
    if (newMode === mode) return;
    setMode(newMode);
    setAnimStep((prev) => prev + 1);
    setBadName(false);
    setBadId(false);
    setBadPw(false);
    setBadEmail(false);
    setBadPhone(false);
    setBadSignupPw(false);
    setBadConfirmPw(false);
    setServerError(null);
  };

  const validEmail = (v: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
  };

  const validPhone = (v: string) => {
    return /^[6-9]\d{9}$/.test(v.replace(/[\s-]/g, ''));
  };

  const validId = (v: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || /^[6-9]\d{9}$/.test(v.replace(/[\s-]/g, ''));
  };

  const triggerBad = (field: 'name' | 'id' | 'pw' | 'email' | 'phone' | 'signupPw' | 'confirmPw') => {
    if (field === 'name') {
      setBadName(false);
      setTimeout(() => setBadName(true), 10);
    } else if (field === 'id') {
      setBadId(false);
      setTimeout(() => setBadId(true), 10);
    } else if (field === 'pw') {
      setBadPw(false);
      setTimeout(() => setBadPw(true), 10);
    } else if (field === 'email') {
      setBadEmail(false);
      setTimeout(() => setBadEmail(true), 10);
    } else if (field === 'phone') {
      setBadPhone(false);
      setTimeout(() => setBadPhone(true), 10);
    } else if (field === 'signupPw') {
      setBadSignupPw(false);
      setTimeout(() => setBadSignupPw(true), 10);
    } else if (field === 'confirmPw') {
      setBadConfirmPw(false);
      setTimeout(() => setBadConfirmPw(true), 10);
    }
  };

  // Calculate bus progress based on form typing
  const getBusProgress = () => {
    const isUp = mode === 'up';
    let score = 0;
    const total = isUp ? 5 : 2;

    if (isUp) {
      if (name.trim().length > 0) score += Math.min(1, name.trim().length / 3);
      if (signupEmail.trim().length > 0) score += Math.min(1, signupEmail.trim().length / 6);
      if (signupPhone.trim().length > 0) score += Math.min(1, signupPhone.trim().length / 8);
      if (signupPassword.length > 0) score += Math.min(1, signupPassword.length / 6);
      if (signupConfirmPassword.length > 0) score += Math.min(1, signupConfirmPassword.length / 6);
    } else {
      if (identifier.trim().length > 0) score += Math.min(1, identifier.trim().length / 5);
      if (password.length > 0) score += Math.min(1, password.length / 6);
    }

    return score / total;
  };

  const busProgress = getBusProgress();

  let busLeft = '-120px';
  let busTransition = 'left 0.7s cubic-bezier(0.25, 1, 0.5, 1)';
  let isDriving = false;

  if (isBusRunning) {
    busLeft = 'calc(100% + 140px)';
    busTransition = 'left 1.8s cubic-bezier(0.4, 0, 0.2, 1)';
    isDriving = true;
  } else if (busProgress > 0) {
    busLeft = `calc(${15 + busProgress * 68}% - 50px)`;
    busTransition = 'left 0.7s cubic-bezier(0.25, 1, 0.5, 1)';
    isDriving = true;
  }

  const board = (who: string, isGuest = false, fullUser?: UserSession) => {
    setWelcomeName(who);

    if (fullUser) {
      login({
        ...fullUser,
        name: who,
        isGuest,
        boardedAt: fullUser.boardedAt || Date.now(),
      });
    } else {
      login({
        name: who,
        isGuest,
        ticketNo: mode === 'up' ? ticketNoSignup : ticketNoLogin,
        boardedAt: Date.now()
      });
    }

    setIsTorn(true);
    setTimeout(() => {
      setIsBusRunning(true);
      // Auto-advance after animation completes
      setTimeout(() => {
        navigate('/buses');
      }, 2000);
    }, 450);
  };

  const handleSubmit = async (e: React.FormEvent, submitMode: 'in' | 'up') => {
    e.preventDefault();
    if (isSubmitting) return;

    if (submitMode === 'up') {
      const n = name.trim();
      const em = signupEmail.trim();
      const ph = signupPhone.trim();
      const sp = signupPassword;
      const scp = signupConfirmPassword;

      const e1 = n.length < 2;
      const e2 = !validEmail(em);
      const e3 = !validPhone(ph);
      const e4 = sp.length < 6;
      let e5 = false;
      if (scp.length < 6 || scp !== sp) {
        e5 = true;
        setConfirmPwErrorMsg(scp !== sp ? 'Passwords do not match.' : 'Confirm password must be at least 6 characters.');
      }

      if (e1) triggerBad('name');
      else setBadName(false);

      if (e2) triggerBad('email');
      else setBadEmail(false);

      if (e3) triggerBad('phone');
      else setBadPhone(false);

      if (e4) triggerBad('signupPw');
      else setBadSignupPw(false);

      if (e5) triggerBad('confirmPw');
      else setBadConfirmPw(false);

      if (e1 || e2 || e3 || e4 || e5) return;

      setServerError(null);
      setIsSubmitting(true);

      try {
        const res = await signUpWithCredentials(n, em, sp, ticketNoSignup, ph);
        if (!res.success) {
          setServerError(res.error || 'Registration failed. Please try again.');
          setIsSubmitting(false);
          return;
        }
        board(res.user?.name || n.split(' ')[0], false, res.user);
      } catch {
        setServerError('An unexpected error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      const i = identifier.trim();
      const p = password;

      const e1 = !validId(i);
      const e2 = p.length < 6;

      if (e1) triggerBad('id');
      else setBadId(false);

      if (e2) triggerBad('pw');
      else setBadPw(false);

      if (e1 || e2) return;

      setServerError(null);
      setIsSubmitting(true);

      try {
        const res = await signInWithCredentials(i, p);
        if (!res.success) {
          setServerError(res.error || 'Login failed. Please check your credentials.');
          setIsSubmitting(false);
          return;
        }
        const who = res.user?.name || (i.includes('@') ? i.split('@')[0] : 'Passenger');
        board(who, false, res.user);
      } catch {
        setServerError('An unexpected error occurred. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      if (isSupabaseActive) {
        const { error } = await signInWithGoogleAuth();
        if (error) {
          setServerError(error);
          setIsSubmitting(false);
        }
      } else {
        const demoGoogleUser: UserSession = {
          name: 'Google Commuter',
          phoneOrEmail: 'commuter@gmail.com',
          ticketNo: `NO. ${Math.floor(Math.random() * 8999 + 1000)}`,
          boardedAt: Date.now(),
          homeStop: 'Chandigarh ISBT-43',
          preferredClass: 'All Types',
          totalSearches: 0,
        };
        board('Google Commuter', false, demoGoogleUser);
      }
    } catch (err: any) {
      setServerError(err?.message || 'Google sign in failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="stopsense-login">
      <div className="stage">
        <div className="topbar">
          <div
            className="logo cursor-pointer shrink-0"
            onClick={() => navigate('/')}
            title="AnyStop Home"
          >
            <AnyStopLogo variant="navbar" animated={true} height="32px" />
          </div>
          <div className="topbar-actions">
            <button
              type="button"
              onClick={(e) => toggleDarkMode(e)}
              className="login-theme-toggle-btn theme-toggle-btn"
              title={darkMode ? "Switch to Day theme" : "Switch to Night theme"}
              aria-label="Toggle theme"
            >
              <span key={darkMode ? 'dark' : 'light'} className="theme-icon-container">
                {darkMode ? (
                  <Moon className="w-3.5 h-3.5 text-indigo-200 fill-indigo-200/50 theme-icon" />
                ) : (
                  <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-500/50 theme-icon" />
                )}
              </span>
              <span className="theme-toggle-label hidden sm:inline">{darkMode ? 'Night' : 'Day'}</span>
            </button>
            <button
              type="button"
              className="back"
              onClick={() => navigate('/')}
            >
              ← Back&nbsp;<span className="hidden sm:inline">to landing page</span>
            </button>
          </div>
        </div>

        <div className={`ticket-stack ${isTorn ? 'tear' : ''}`}>
          {/* TICKET 1: LOGIN */}
          <div
            key={`ticket-login-${animStep}`}
            className={`ticket ticket-login ${mode === 'in' ? 'ticket-front' : 'ticket-back'} ${
              animStep === 0 ? '' : mode === 'in' ? 'deal-to-top' : 'drop-to-back'
            } ${isTorn && mode === 'in' ? 'tear' : ''}`}
            id="ticket-login"
            onClick={mode === 'up' ? () => switchMode('in') : undefined}
          >
            <div className="main">
              <div className="form" id="form-login">
                <div className="tophead">
                  <span>BOARDING PASS</span>
                  <b id="pn-login">{ticketNoLogin}</b>
                </div>
                <div className="route">
                  <div className="l" />
                  <span>ANYWHERE</span>
                </div>
                <h1>Welcome back, traveller</h1>
                <p className="sub">Log in to save your favourite routes.</p>

                <div
                  className="seg"
                  id="seg-login"
                  role="group"
                  aria-label="Log in or sign up"
                >
                  <button
                    type="button"
                    data-m="in"
                    aria-pressed={mode === 'in'}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      switchMode('in');
                    }}
                  >
                    Log in
                  </button>
                  <button
                    type="button"
                    data-m="up"
                    aria-pressed={mode === 'up'}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      switchMode('up');
                    }}
                  >
                    Sign up
                  </button>
                </div>

                <form
                  id="f-login"
                  noValidate
                  autoComplete="on"
                  onSubmit={(e) => handleSubmit(e, 'in')}
                >
                  <label className={`fld ${badId ? 'bad' : ''}`} id="fe-login">
                    <span>EMAIL OR PHONE</span>
                    <div className="inp">
                      <input
                        id="id-login"
                        autoComplete="username"
                        inputMode="email"
                        placeholder="you@example.com"
                        value={identifier}
                        readOnly={mode !== 'in'}
                        tabIndex={mode === 'in' ? 0 : -1}
                        onChange={(e) => {
                          setIdentifier(e.target.value);
                          if (badId) setBadId(false);
                        }}
                      />
                    </div>
                    <div className="msg">Enter a valid email or 10-digit phone number.</div>
                  </label>

                  <label className={`fld ${badPw ? 'bad' : ''}`} id="fp-login">
                    <span>PASSWORD</span>
                    <div className="inp">
                      <input
                        id="pw-login"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="At least 6 characters"
                        value={password}
                        readOnly={mode !== 'in'}
                        tabIndex={mode === 'in' ? 0 : -1}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (badPw) setBadPw(false);
                        }}
                      />
                      <button
                        type="button"
                        id="eye-login"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        tabIndex={mode === 'in' ? 0 : -1}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowPassword(!showPassword);
                        }}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <div className="msg">Use at least 6 characters.</div>
                  </label>

                  {serverError && mode === 'in' && (
                    <div className="login-server-error-banner" role="alert">
                      <span>⚠️</span>
                      <span>{serverError}</span>
                    </div>
                  )}

                  <div className="barcode" aria-hidden="true" />
                </form>
              </div>

              <div className="ok" aria-live="polite">
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <circle cx="50" cy="50" r="44" />
                  <path d="M30 52l14 14 27-30" />
                </svg>
                <h2>Welcome aboard, {welcomeName}!</h2>
                <p>Your seat is saved. Time to find your bus.</p>
                <button
                  type="button"
                  className="find-link"
                  onClick={() => navigate('/buses')}
                >
                  Find my bus
                </button>
              </div>
            </div>

            <div className="stub">
              <button
                className="go"
                id="go-login"
                type="submit"
                form="f-login"
                disabled={mode !== 'in' || isSubmitting}
                tabIndex={mode === 'in' ? 0 : -1}
              >
                {isSubmitting ? 'Punching...' : 'Punch my ticket →'}
              </button>
              <button
                className="google-btn"
                id="google-login"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGoogleSignIn();
                }}
                disabled={mode !== 'in' || isSubmitting}
                tabIndex={mode === 'in' ? 0 : -1}
              >
                <svg className="google-icon" viewBox="0 0 24 24" width="16" height="16">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>
            </div>
          </div>

          {/* TICKET 2: SIGN UP */}
          <div
            key={`ticket-signup-${animStep}`}
            className={`ticket ticket-signup ${mode === 'up' ? 'ticket-front' : 'ticket-back'} ${
              animStep === 0 ? '' : mode === 'up' ? 'deal-to-top' : 'drop-to-back'
            } ${isTorn && mode === 'up' ? 'tear' : ''}`}
            id="ticket-signup"
            onClick={mode === 'in' ? () => switchMode('up') : undefined}
          >
            <div className="main">
              <div className="form su" id="form-signup">
                <div className="tophead">
                  <span>BOARDING PASS</span>
                  <b id="pn-signup">{ticketNoSignup}</b>
                </div>
                <div className="route">
                  <div className="l" />
                  <span>ANYWHERE</span>
                </div>
                <h1>Get your first ticket</h1>
                <p className="sub">Fast boarding, saved stops & live alerts.</p>

                <div
                  className="seg su"
                  id="seg-signup"
                  role="group"
                  aria-label="Log in or sign up"
                >
                  <button
                    type="button"
                    data-m="in"
                    aria-pressed={mode === 'in'}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      switchMode('in');
                    }}
                  >
                    Log in
                  </button>
                  <button
                    type="button"
                    data-m="up"
                    aria-pressed={mode === 'up'}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      switchMode('up');
                    }}
                  >
                    Sign up
                  </button>
                </div>

                <form
                  id="f-signup"
                  noValidate
                  autoComplete="on"
                  onSubmit={(e) => handleSubmit(e, 'up')}
                >
                  <div className="name on">
                    <div>
                      <label className={`fld ${badName ? 'bad' : ''}`} id="fn-signup">
                        <span>PASSENGER NAME</span>
                        <div className="inp">
                          <input
                            id="name-signup"
                            autoComplete="name"
                            placeholder="Your name"
                            value={name}
                            readOnly={mode !== 'up'}
                            tabIndex={mode === 'up' ? 0 : -1}
                            onChange={(e) => {
                              setName(e.target.value);
                              if (badName) setBadName(false);
                            }}
                          />
                        </div>
                        <div className="msg">Tell us what to print on your pass.</div>
                      </label>
                    </div>
                  </div>

                  <label className={`fld ${badEmail ? 'bad' : ''}`} id="fe-signup">
                    <span>EMAIL ADDRESS</span>
                    <div className="inp">
                      <input
                        id="email-signup"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        placeholder="you@example.com"
                        value={signupEmail}
                        readOnly={mode !== 'up'}
                        tabIndex={mode === 'up' ? 0 : -1}
                        onChange={(e) => {
                          setSignupEmail(e.target.value);
                          if (badEmail) setBadEmail(false);
                        }}
                      />
                    </div>
                    <div className="msg">Enter a valid email address.</div>
                  </label>

                  <label className={`fld ${badPhone ? 'bad' : ''}`} id="fphone-signup">
                    <span>PHONE NUMBER</span>
                    <div className="inp">
                      <input
                        id="phone-signup"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        placeholder="10-digit mobile number"
                        value={signupPhone}
                        readOnly={mode !== 'up'}
                        tabIndex={mode === 'up' ? 0 : -1}
                        onChange={(e) => {
                          setSignupPhone(e.target.value);
                          if (badPhone) setBadPhone(false);
                        }}
                      />
                    </div>
                    <div className="msg">Enter a valid 10-digit mobile number.</div>
                  </label>

                  <label className={`fld ${badSignupPw ? 'bad' : ''}`} id="fp-signup">
                    <span>PASSWORD</span>
                    <div className="inp">
                      <input
                        id="pw-signup"
                        type={showSignupPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="At least 6 characters"
                        value={signupPassword}
                        readOnly={mode !== 'up'}
                        tabIndex={mode === 'up' ? 0 : -1}
                        onChange={(e) => {
                          setSignupPassword(e.target.value);
                          if (badSignupPw) setBadSignupPw(false);
                        }}
                      />
                      <button
                        type="button"
                        id="eye-signup"
                        aria-label={showSignupPassword ? 'Hide password' : 'Show password'}
                        tabIndex={mode === 'up' ? 0 : -1}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowSignupPassword(!showSignupPassword);
                        }}
                      >
                        {showSignupPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <div className="msg">Use at least 6 characters.</div>
                  </label>

                  <label className={`fld ${badConfirmPw ? 'bad' : ''}`} id="fcp-signup">
                    <span>CONFIRM PASSWORD</span>
                    <div className="inp">
                      <input
                        id="cpw-signup"
                        type={showSignupConfirmPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="Re-enter your password"
                        value={signupConfirmPassword}
                        readOnly={mode !== 'up'}
                        tabIndex={mode === 'up' ? 0 : -1}
                        onChange={(e) => {
                          setSignupConfirmPassword(e.target.value);
                          if (badConfirmPw) setBadConfirmPw(false);
                        }}
                      />
                      <button
                        type="button"
                        id="eye-confirm-signup"
                        aria-label={showSignupConfirmPassword ? 'Hide password' : 'Show password'}
                        tabIndex={mode === 'up' ? 0 : -1}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowSignupConfirmPassword(!showSignupConfirmPassword);
                        }}
                      >
                        {showSignupConfirmPassword ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <div className="msg">{confirmPwErrorMsg}</div>
                  </label>

                  {serverError && mode === 'up' && (
                    <div className="login-server-error-banner" role="alert">
                      <span>⚠️</span>
                      <span>{serverError}</span>
                    </div>
                  )}

                  <div className="barcode" aria-hidden="true" />
                </form>
              </div>

              <div className="ok" aria-live="polite">
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <circle cx="50" cy="50" r="44" />
                  <path d="M30 52l14 14 27-30" />
                </svg>
                <h2>Welcome aboard, {welcomeName}!</h2>
                <p>Your seat is saved. Time to find your bus.</p>
                <button
                  type="button"
                  className="find-link"
                  onClick={() => navigate('/buses')}
                >
                  Find my bus
                </button>
              </div>
            </div>

            <div className="stub">
              <button
                className="go"
                id="go-signup"
                type="submit"
                form="f-signup"
                disabled={mode !== 'up' || isSubmitting}
                tabIndex={mode === 'up' ? 0 : -1}
              >
                {isSubmitting ? 'Issuing pass...' : 'Issue my ticket →'}
              </button>
              <button
                className="google-btn"
                id="google-signup"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGoogleSignIn();
                }}
                disabled={mode !== 'up' || isSubmitting}
                tabIndex={mode === 'up' ? 0 : -1}
              >
                <svg className="google-icon" viewBox="0 0 24 24" width="16" height="16">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animated road and bus */}
      <div className="road" aria-hidden="true">
        <svg
          className={`bus ${isDriving ? 'driving' : ''} ${isBusRunning ? 'depart' : ''}`}
          id="bus"
          viewBox="0 0 120 50"
          style={{
            left: busLeft,
            transition: busTransition
          }}
        >
          <rect x="4" y="6" width="108" height="32" rx="7" fill="#FF5A4E" />
          <rect x="12" y="12" width="20" height="12" rx="2" fill="#1F1A3F" />
          <rect x="36" y="12" width="20" height="12" rx="2" fill="#1F1A3F" />
          <rect x="60" y="12" width="20" height="12" rx="2" fill="#1F1A3F" />
          <rect x="86" y="12" width="20" height="14" rx="2" fill="#9ED8F0" />
          <rect x="4" y="29" width="108" height="4" fill="#FFB020" />
          <circle cx="28" cy="40" r="7" fill="#1F1A3F" />
          <circle cx="88" cy="40" r="7" fill="#1F1A3F" />
          <circle cx="28" cy="40" r="3" fill="#ccc" />
          <circle cx="88" cy="40" r="3" fill="#ccc" />
        </svg>
      </div>
    </div>
  );
};

export default LoginPage;
