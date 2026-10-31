import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Zap, Landmark, Banknote, Calendar, WifiOff, Users, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AnyStopLogo } from '../components/AnyStopLogo';
import './LandingPage.css';

const NAMES = [
  "Chandigarh",
  "Kharar",
  "Gharuan",
  "Morinda",
  "Samrala",
  "Khamano",
  "Ludhiana",
  "Phillaur",
  "Jalandhar",
  "Zirakpur",
  "Ambala Cantt",
  "Cheema Chowk"
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navRef = useRef<HTMLElement>(null);
  const raceRef = useRef<HTMLElement>(null);
  const [activeMini, setActiveMini] = useState<number | null>(null);

  const handleFindBus = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (isAuthenticated) {
      navigate('/buses');
    } else {
      navigate('/login');
    }
  };

  const handleLogin = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    navigate('/login');
  };

  useEffect(() => {
    const nav = navRef.current;
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (nav) {
            nav.classList.toggle('sc', window.scrollY > 20);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            if (entry.target.id === 'race') {
              entry.target.classList.add('go');
            }
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    document.querySelectorAll('.stopsense-landing .rv, .stopsense-landing #race').forEach((el) => {
      io.observe(el);
    });

    // 3D Parallax & Magnetic Button interactions from AnyStop reference
    let raf = 0;
    const hero = document.getElementById('top');
    const ph = document.getElementById('phone');
    const spot = document.getElementById('spot');

    const handlePointerMove = (e: PointerEvent) => {
      if (!hero || !ph || !spot) return;
      const r = hero.getBoundingClientRect();
      const p = ph.getBoundingClientRect();
      const clamp = (v: number) => Math.max(-1, Math.min(1, v));

      spot.style.setProperty('--sx', `${e.clientX - r.left}px`);
      spot.style.setProperty('--sy', `${e.clientY - r.top}px`);

      const targetX = clamp(((e.clientX - (p.left + p.width / 2)) / (window.innerWidth / 2)) * 1.6);
      const targetY = clamp(((e.clientY - (p.top + p.height / 2)) / (window.innerHeight / 2)) * 1.6);

      const loop = () => {
        currX += (targetX - currX) * 0.12;
        currY += (targetY - currY) * 0.12;
        ph.style.setProperty('--ry', `${currX * 16}deg`);
        ph.style.setProperty('--rx', `${-currY * 16}deg`);
        ph.style.setProperty('--gx', `${50 + currX * 50}%`);
        ph.style.setProperty('--gy', `${50 + currY * 50}%`);

        if (Math.abs(targetX - currX) > 0.002 || Math.abs(targetY - currY) > 0.002) {
          raf = requestAnimationFrame(loop);
        } else {
          raf = 0;
        }
      };

      if (!raf) {
        raf = requestAnimationFrame(loop);
      }
    };

    let currX = 0;
    let currY = 0;

    const handlePointerLeave = () => {
      const loop = () => {
        currX += (0 - currX) * 0.12;
        currY += (0 - currY) * 0.12;
        if (ph) {
          ph.style.setProperty('--ry', `${currX * 16}deg`);
          ph.style.setProperty('--rx', `${-currY * 16}deg`);
        }
        if (Math.abs(currX) > 0.002 || Math.abs(currY) > 0.002) {
          raf = requestAnimationFrame(loop);
        } else {
          raf = 0;
        }
      };
      if (!raf) {
        raf = requestAnimationFrame(loop);
      }
    };

    const ctaBtns = document.querySelectorAll<HTMLElement>('.stopsense-landing .cta .btn');
    const onBtnMove = (e: MouseEvent) => {
      const b = e.currentTarget as HTMLElement;
      const r = b.getBoundingClientRect();
      b.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.18}px ${(e.clientY - r.top - r.height / 2) * 0.3}px`;
    };
    const onBtnLeave = (e: MouseEvent) => {
      (e.currentTarget as HTMLElement).style.translate = '';
    };

    if (window.matchMedia('(hover:hover) and (pointer:fine)').matches && !window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
      hero?.addEventListener('pointermove', handlePointerMove);
      hero?.addEventListener('pointerleave', handlePointerLeave);
      ctaBtns.forEach((b) => {
        b.addEventListener('pointermove', onBtnMove);
        b.addEventListener('pointerleave', onBtnLeave);
      });
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      hero?.removeEventListener('pointermove', handlePointerMove);
      hero?.removeEventListener('pointerleave', handlePointerLeave);
      ctaBtns.forEach((b) => {
        b.removeEventListener('pointermove', onBtnMove);
        b.removeEventListener('pointerleave', onBtnLeave);
      });
    };
  }, []);

  return (
    <div className="stopsense-landing">
      {/* Navigation */}
      <nav id="nav" ref={navRef}>
        <div className="wrap">
          <a className="logo shrink-0" href="#top" title="AnyStop Home">
            <AnyStopLogo variant="navbar" animated={true} height="36px" />
          </a>
          <div className="links">
            <a href="#how">How it works</a>
            <a href="#features">Features</a>
            <a href="#faq">FAQ</a>
            <button
              type="button"
              onClick={(e) => toggleDarkMode(e)}
              className="landing-theme-toggle-btn theme-toggle-btn"
              title={darkMode ? "Switch to Day theme" : "Switch to Night theme"}
              aria-label="Toggle theme"
            >
              <span key={darkMode ? 'dark' : 'light'} className="theme-icon-container">
                {darkMode ? (
                  <Moon className="w-4 h-4 text-indigo-300 fill-indigo-300/40 theme-icon" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-500 fill-amber-500/50 theme-icon" />
                )}
              </span>
              <span className="theme-mode-label hidden sm:inline">{darkMode ? 'Night' : 'Day'}</span>
            </button>
            <button type="button" className="btn" onClick={handleLogin}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
              </svg>
              Log in
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="hero" id="top">
        <div className="spot" id="spot" aria-hidden="true" />
        <div className="wrap">
          <div>
            <span className="tag">
              <i className="td" />
              ANY STOP<b>→</b>ANY BUS
            </span>
            <h1>
              Know your bus <em>before</em> it arrives.
            </h1>
            <p className="lead">
              Pick two stops. See which buses run between them, intermediate stops, and statutory maximum prices including GST.
            </p>
            <div className="cta">
              <button type="button" className="btn b1" onClick={handleFindBus}>
                Find my bus →
              </button>
              <a className="btn b2" href="#how">
                How it works
              </a>
            </div>
          </div>

          <div className="phone" id="phone" aria-hidden="true">
            <i className="glare" />
            <span className="fl l" style={{ top: '16%' }}>📍 Kharar</span>
            <span className="fl r" style={{ top: '46%', animationDelay: '-1.5s' }}>💸 ~₹90</span>
            <span className="fl l" style={{ bottom: '12%', animationDelay: '-3s' }}>⚡ 3 stops</span>
            <div className="screen">
              <div
                className={`mini ${activeMini === 0 ? 'on' : ''}`}
                onClick={() => setActiveMini((prev) => (prev === 0 ? null : 0))}
              >
                <div className="tr">
                  <div>
                    6:00 AM<small>Chandigarh</small>
                  </div>
                  <div className="bar" />
                  <div>
                    7:40 AM<small>Ludhiana</small>
                  </div>
                </div>
                <span className="chip e">⚡ Express</span>
                <span className="chip g">Government</span>
                <span className="chip" style={{ background: '#E8F5E9', color: '#1B5E20', fontWeight: 700 }}>~₹90</span>
                <span className="chip" style={{ background: '#E0F2FE', color: '#0369A1', fontWeight: 600 }}>📅 Daily</span>
                <div className="more">
                  <div>
                    <span>3 stops: Kharar → Morinda → Samrala</span>
                  </div>
                </div>
              </div>

              <div
                className={`mini ${activeMini === 1 ? 'on' : ''}`}
                onClick={() => setActiveMini((prev) => (prev === 1 ? null : 1))}
              >
                <div className="tr">
                  <div>
                    7:15 AM<small>Chandigarh</small>
                  </div>
                  <div className="bar" style={{ animationDelay: '.4s' }} />
                  <div>
                    10:05 AM<small>Ludhiana</small>
                  </div>
                </div>
                <span className="chip">🐢 All-stop</span>
                <span className="chip" style={{ background: '#E8F5E9', color: '#1B5E20', fontWeight: 700 }}>~₹85</span>
                <span className="chip" style={{ background: '#E0F2FE', color: '#0369A1', fontWeight: 600 }}>📅 Daily</span>
                <div className="more">
                  <div>
                    <span>9 stops: halts at every town on the way</span>
                  </div>
                </div>
              </div>

              <div
                className={`mini ${activeMini === 2 ? 'on' : ''}`}
                onClick={() => setActiveMini((prev) => (prev === 2 ? null : 2))}
              >
                <div className="tr">
                  <div>
                    9:30 AM<small>Chandigarh</small>
                  </div>
                  <div className="bar" style={{ animationDelay: '.8s' }} />
                  <div>
                    11:10 AM<small>Ludhiana</small>
                  </div>
                </div>
                <span className="chip">Private</span>
                <span className="chip" style={{ background: '#E0F2FE', color: '#0369A1', fontWeight: 600 }}>📅 Daily</span>
                <div className="more">
                  <div>
                    <span>AC coach · you can book online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Marquee Ribbon */}
      <div className="mq" aria-label="Punjab Transit Major Stops Ribbon" title="Major Punjab Transit Route Stops (Live Flowing)">
        <div className="mq-track">
          <div className="mq-slide">
            {[...NAMES, ...NAMES].map((name, i) => (
              <span key={`a-${i}`}>{name}</span>
            ))}
          </div>
          <div className="mq-slide" aria-hidden="true">
            {[...NAMES, ...NAMES].map((name, i) => (
              <span key={`b-${i}`}>{name}</span>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <section id="how">
        <div className="wrap">
          <p className="kick rv">HOW IT WORKS</p>
          <h2 className="rv">Three taps. No guessing.</h2>
          <p className="lede rv">Skip the “is this the fast bus?” moment at the roadside.</p>
          <div className="steps">
            <div className="step rv">
              <b>1</b>
              <h3>Pick your stops</h3>
              <p>Type where you are and where you’re going. Swap them with one tap.</p>
            </div>
            <div className="step rv" style={{ ['--d' as any]: 1 }}>
              <b>2</b>
              <h3>Compare buses</h3>
              <p>Filter by time, Express or All-stop, and government or private.</p>
            </div>
            <div className="step rv" style={{ ['--d' as any]: 2 }}>
              <b>3</b>
              <h3>Board with confidence</h3>
              <p>Open the full stop list, check the fare, and book online where it’s possible.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Race: Express or All-Stop */}
      <section className="race" id="race" ref={raceRef}>
        <div className="wrap">
          <p className="kick rv" style={{ color: 'var(--sun)' }}>
            EXPRESS OR ALL-STOP?
          </p>
          <h2 className="rv text-white" style={{ color: '#FFFFFF' }}>Same route. Very different day.</h2>
          <p className="lede rv" style={{ color: '#DAD3F2' }}>
            Two buses leave together. One makes 3 stops, the other makes 9. AnyStop tells you which is which before you board.
          </p>
          <div className="track fast">
            <div className="t" style={{ color: '#FFFFFF' }}>
              <span style={{ color: '#FFFFFF' }}>⚡ Express · 3 stops</span>
              <span style={{ color: 'var(--sun)' }}>1h 30m</span>
            </div>
            <div className="rail">
              <i style={{ left: '30%' }} />
              <i style={{ left: '60%' }} />
              <b>🚌</b>
            </div>
          </div>
          <div className="track slow">
            <div className="t" style={{ color: '#FFFFFF' }}>
              <span style={{ color: '#FFFFFF' }}>🐢 All-stop · 9 stops</span>
              <span style={{ color: 'var(--sun)' }}>2h 45m</span>
            </div>
            <div className="rail">
              <i style={{ left: '12%' }} />
              <i style={{ left: '24%' }} />
              <i style={{ left: '36%' }} />
              <i style={{ left: '48%' }} />
              <i style={{ left: '60%' }} />
              <i style={{ left: '72%' }} />
              <i style={{ left: '84%' }} />
              <b>🚌</b>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features">
        <div className="wrap">
          <p className="kick rv">FEATURES</p>
          <h2 className="rv">Built for the roadside, not the terminal.</h2>
          <p className="lede rv">Made for buses that you pay for on board and can’t find on booking apps.</p>
          <div className="feats">
            <div className="f rv">
              <div className="ic">
                <MapPin className="w-6 h-6 text-[var(--coral)]" strokeWidth={2.2} />
              </div>
              <h3>Any stop to any stop</h3>
              <p>Not just big bus stands. Search the stops, flyovers and chowks you really use.</p>
            </div>
            <div className="f rv" style={{ ['--d' as any]: 1 }}>
              <div className="ic">
                <Zap className="w-6 h-6 text-[var(--sunink)]" strokeWidth={2.2} />
              </div>
              <h3>Express vs All-stop</h3>
              <p>A clear badge and the number of stops between you and your destination.</p>
            </div>
            <div className="f rv" style={{ ['--d' as any]: 2 }}>
              <div className="ic">
                <Landmark className="w-6 h-6 text-[var(--coral2)]" strokeWidth={2.2} />
              </div>
              <h3>Government and private</h3>
              <p>See who runs each bus and filter by operator type.</p>
            </div>
            <div className="f rv">
              <div className="ic">
                <Banknote className="w-6 h-6 text-[var(--sunink)]" strokeWidth={2.2} />
              </div>
              <h3>Maximum Price (incl. GST)</h3>
              <p>Gazetted statutory fare caps with GST breakdown so you always know the exact legal price.</p>
            </div>
            <div className="f rv" style={{ ['--d' as any]: 1 }}>
              <div className="ic">
                <Calendar className="w-6 h-6 text-[var(--teal)]" strokeWidth={2.2} />
              </div>
              <h3>Runs Everyday (Mon–Sun)</h3>
              <p>Every listed stage carriage service operates 365 days a year with the exact same daily timetable.</p>
            </div>
            <div className="f soon rv" style={{ ['--d' as any]: 1 }}>
              <div className="ic">
                <WifiOff className="w-6 h-6 text-[var(--teal)]" strokeWidth={2.2} />
              </div>
              <h3>
                Works offline <span className="soonb">SOON</span>
              </h3>
              <p>Save timetables on your phone for patchy signal on the highway.</p>
            </div>
            <div className="f soon rv" style={{ ['--d' as any]: 2 }}>
              <div className="ic">
                <Users className="w-6 h-6 text-[var(--teal)]" strokeWidth={2.2} />
              </div>
              <h3>
                Live spotted updates <span className="soonb">SOON</span>
              </h3>
              <p>Riders report “bus just passed” and how crowded the stop is.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq" id="faq">
        <div className="wrap" style={{ maxWidth: '760px' }}>
          <p className="kick rv">FAQ</p>
          <h2 className="rv">Quick answers</h2>
          <br />
          <details className="rv">
            <summary>Do these buses run every day with the same timetable?</summary>
            <p>Yes. All listed services are confirmed stage carriage buses operating every day (Monday to Sunday, 365 days a year) with the exact same departure and stoppage timetable.</p>
          </details>
          <details className="rv">
            <summary>Which cities and corridors are covered?</summary>
            <p>
              All 23 districts of Punjab across Majha, Doaba, and Malwa regions, plus connecting interstate routes to Delhi, Jammu & Kashmir, Himachal Pradesh, Haryana, Uttarakhand, and Rajasthan.
            </p>
          </details>
          <details className="rv">
            <summary>Are ticket prices inclusive of GST?</summary>
            <p>Yes. All prices shown are statutory maximum fares inclusive of GST (0% exempt for Ordinary/Mini stage carriage; 5% for AC and Volvo services).</p>
          </details>
          <details className="rv">
            <summary>Can I book tickets here?</summary>
            <p>
              For luxury Volvo buses that support online booking, we provide instant links. For ordinary and HVAC stage carriage buses, payment is made on board with the conductor.
            </p>
          </details>
        </div>
      </section>

      {/* Final Call to Action */}
      <section style={{ paddingTop: 0 }}>
        <div className="wrap">
          <div className="final rv">
            <h2>Your next bus is already on the road.</h2>
            <p>Check it in ten seconds, then go.</p>
            <button type="button" className="btn" onClick={handleFindBus}>
              Find my bus →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="wrap">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span>© AnyStop · Punjab Daily Transit Timetables & Maximum Prices (incl. GST)</span>
            <span style={{ fontSize: '13px' }}>
              Designed with ❤️ by{' '}
              <a
                href="https://pocketsitestudio.in/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: 0, textDecoration: 'underline' }}
              >
                PocketSite Studio
              </a>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button type="button" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', font: 'inherit' }} onClick={handleFindBus}>Bus finder</button>
            <button type="button" style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit', font: 'inherit' }} onClick={handleLogin}>Log in</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
