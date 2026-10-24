import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Zap, Landmark, Banknote, WifiOff, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
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
  const navRef = useRef<HTMLElement>(null);
  const raceRef = useRef<HTMLElement>(null);

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

    return () => {
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
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
        <div className="wrap">
          <div>
            <span className="tag">
              ANY STOP<b>→</b>ANY BUS
            </span>
            <h1>
              Know your bus <em>before</em> it arrives.
            </h1>
            <p className="lead">
              Pick two stops. See which buses run between them, how many stops they make, and what the ticket costs.
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

          <div className="phone" aria-hidden="true">
            <div className="screen">
              <div className="mini">
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
                <span className="chip">~₹90</span>
              </div>

              <div className="mini">
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
                <span className="chip">~₹85</span>
              </div>

              <div className="mini">
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
              <h3>Fare estimates</h3>
              <p>Know how much cash to keep ready, or book online when the bus allows it.</p>
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
            <summary>Is the timetable live?</summary>
            <p>Not yet. Today it shows planned timings. Live rider updates are on the roadmap.</p>
          </details>
          <details className="rv">
            <summary>Which cities and routes are covered?</summary>
            <p>
              We’re starting with the Chandigarh, Ludhiana, Jalandhar and Ambala corridor and adding more stops over time.
            </p>
          </details>
          <details className="rv">
            <summary>Do I need an account?</summary>
            <p>No. You can search as a guest. An account will let you save favourite routes.</p>
          </details>
          <details className="rv">
            <summary>Can I book tickets here?</summary>
            <p>
              For buses that allow online booking, we link you to the booking site. Most government buses are paid on board.
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
          <span>© AnyStop · Timetable shown is sample data for design preview.</span>
          <span>
            <a onClick={handleFindBus}>Bus finder</a>
            <a onClick={handleLogin}>Log in</a>
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
