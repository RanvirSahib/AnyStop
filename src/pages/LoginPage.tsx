import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AnyStopLogo } from '../components/AnyStopLogo';
import './LoginPage.css';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [ticketNoLogin] = useState<string>(() => "NO. " + String(Math.floor(Math.random() * 4000) + 1000));
  const [ticketNoSignup] = useState<string>(() => "NO. " + String(Math.floor(Math.random() * 4000) + 5000));
  const [animStep, setAnimStep] = useState<number>(0);

  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [badName, setBadName] = useState(false);
  const [badId, setBadId] = useState(false);
  const [badPw, setBadPw] = useState(false);

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
  };

  const validId = (v: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || /^[6-9]\d{9}$/.test(v.replace(/[\s-]/g, ''));
  };

  const triggerBad = (field: 'name' | 'id' | 'pw') => {
    if (field === 'name') {
      setBadName(false);
      setTimeout(() => setBadName(true), 10);
    } else if (field === 'id') {
      setBadId(false);
      setTimeout(() => setBadId(true), 10);
    } else if (field === 'pw') {
      setBadPw(false);
      setTimeout(() => setBadPw(true), 10);
    }
  };

  // Calculate bus progress based on form typing
  const getBusProgress = () => {
    const isUp = mode === 'up';
    let score = 0;
    const total = isUp ? 3 : 2;

    if (isUp) {
      if (name.trim().length > 0) score += Math.min(1, name.trim().length / 3);
      if (identifier.trim().length > 0) score += Math.min(1, identifier.trim().length / 5);
      if (password.length > 0) score += Math.min(1, password.length / 6);
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

  const board = (who: string, isGuest = false) => {
    setWelcomeName(who);

    login({
      name: who,
      isGuest,
      ticketNo: mode === 'up' ? ticketNoSignup : ticketNoLogin,
      boardedAt: Date.now()
    });

    setIsTorn(true);
    setTimeout(() => {
      setIsBusRunning(true);
      // Auto-advance after animation completes
      setTimeout(() => {
        navigate('/buses');
      }, 2000);
    }, 450);
  };

  const handleSubmit = (e: React.FormEvent, submitMode: 'in' | 'up') => {
    e.preventDefault();

    const n = name.trim();
    const i = identifier.trim();
    const p = password;

    const e1 = submitMode === 'up' && n.length < 2;
    const e2 = !validId(i);
    const e3 = p.length < 6;

    if (e1) triggerBad('name');
    else setBadName(false);

    if (e2) triggerBad('id');
    else setBadId(false);

    if (e3) triggerBad('pw');
    else setBadPw(false);

    if (e1 || e2 || e3) return;

    const who = submitMode === 'up' ? n.split(' ')[0] : (i.includes('@') ? i.split('@')[0] : 'traveller');
    board(who, false);
  };

  const handleGuest = () => {
    board('guest', true);
  };

  return (
    <div className="stopsense-login">
      <div className="stage">
        <div className="topbar">
          <div
            className="logo cursor-pointer"
            onClick={() => navigate('/')}
            title="AnyStop Home"
          >
            <AnyStopLogo variant="navbar" animated={true} height="34px" />
          </div>
          <button
            type="button"
            className="back"
            onClick={() => navigate('/')}
          >
            ← Back to landing page
          </button>
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
                disabled={mode !== 'in'}
                tabIndex={mode === 'in' ? 0 : -1}
              >
                Punch my ticket →
              </button>
              <button
                className="guest"
                id="guest-login"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGuest();
                }}
                disabled={mode !== 'in'}
                tabIndex={mode === 'in' ? 0 : -1}
              >
                Continue as guest
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

                  <label className={`fld ${badId ? 'bad' : ''}`} id="fe-signup">
                    <span>EMAIL OR PHONE</span>
                    <div className="inp">
                      <input
                        id="id-signup"
                        autoComplete="username"
                        inputMode="email"
                        placeholder="you@example.com"
                        value={identifier}
                        readOnly={mode !== 'up'}
                        tabIndex={mode === 'up' ? 0 : -1}
                        onChange={(e) => {
                          setIdentifier(e.target.value);
                          if (badId) setBadId(false);
                        }}
                      />
                    </div>
                    <div className="msg">Enter a valid email or 10-digit phone number.</div>
                  </label>

                  <label className={`fld ${badPw ? 'bad' : ''}`} id="fp-signup">
                    <span>PASSWORD</span>
                    <div className="inp">
                      <input
                        id="pw-signup"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="new-password"
                        placeholder="At least 6 characters"
                        value={password}
                        readOnly={mode !== 'up'}
                        tabIndex={mode === 'up' ? 0 : -1}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (badPw) setBadPw(false);
                        }}
                      />
                      <button
                        type="button"
                        id="eye-signup"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        tabIndex={mode === 'up' ? 0 : -1}
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
                disabled={mode !== 'up'}
                tabIndex={mode === 'up' ? 0 : -1}
              >
                Issue my ticket →
              </button>
              <button
                className="guest"
                id="guest-signup"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleGuest();
                }}
                disabled={mode !== 'up'}
                tabIndex={mode === 'up' ? 0 : -1}
              >
                Continue as guest
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
