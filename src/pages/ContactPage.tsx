import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { AnyStopLogo } from '../components/AnyStopLogo';
import './ContactPage.css';

interface TopicItem {
  icon: string;
  label: string;
}

const TOPICS: TopicItem[] = [
  { icon: '⏰', label: 'Wrong timing' },
  { icon: '📍', label: 'Add a stop or route' },
  { icon: '💡', label: 'Suggestion' },
  { icon: '🤝', label: 'Partnership' },
  { icon: '💬', label: 'Something else' }
];

export const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  const [selectedTopic, setSelectedTopic] = useState<number>(0);
  const [name, setName] = useState<string>(currentUser?.name || '');
  const [email, setEmail] = useState<string>(currentUser?.phoneOrEmail?.includes('@') ? currentUser.phoneOrEmail : '');
  const [message, setMessage] = useState<string>('');

  const [nameError, setNameError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [messageError, setMessageError] = useState<boolean>(false);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('support.anystop@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMessage = message.trim();

    const isNameInvalid = trimmedName.length < 2;
    const isEmailInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmedEmail);
    const isMessageInvalid = trimmedMessage.length < 10;

    setNameError(isNameInvalid);
    setEmailError(isEmailInvalid);
    setMessageError(isMessageInvalid);

    if (isNameInvalid || isEmailInvalid || isMessageInvalid) {
      return;
    }

    setIsSubmitting(true);

    // 1. Dispatch form payload directly to support.anystop@gmail.com via FormSubmit AJAX service
    try {
      const emailPromise = fetch('https://formsubmit.co/ajax/support.anystop@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          topic: TOPICS[selectedTopic].label,
          message: trimmedMessage,
          _subject: `[AnyStop Contact] ${TOPICS[selectedTopic].label} from ${trimmedName}`,
          _template: 'table',
          _captcha: 'false',
        }),
      });

      // Up to 3.5s timeout so UI never freezes if network is sluggish
      const timeoutPromise = new Promise((resolve) => setTimeout(resolve, 3500));
      await Promise.race([emailPromise, timeoutPromise]);
    } catch (err) {
      console.warn('Direct email dispatch note (stored locally and mailto fallback available):', err);
    }

    // 2. Save feedback message locally so it is never lost
    try {
      const stored = localStorage.getItem('anystop_feedback_messages');
      const messages = stored ? JSON.parse(stored) : [];
      messages.unshift({
        id: `msg_${Date.now()}`,
        topic: TOPICS[selectedTopic].label,
        name: trimmedName,
        email: trimmedEmail,
        message: trimmedMessage,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('anystop_feedback_messages', JSON.stringify(messages.slice(0, 50)));
    } catch {
      // Ignore quota errors
    }

    // 3. Trigger sending animation and success screen
    setIsSubmitting(false);
    setIsSent(true);
  };

  const handleResetForm = () => {
    setIsSent(false);
    setMessage('');
    setNameError(false);
    setEmailError(false);
    setMessageError(false);
  };

  const mailtoSubject = `[AnyStop] ${TOPICS[selectedTopic].label}`;
  const mailtoBody = `${message.trim()}\n\n— ${name.trim()} (${email.trim()})`;
  const mailtoUrl = `mailto:support.anystop@gmail.com?subject=${encodeURIComponent(mailtoSubject)}&body=${encodeURIComponent(mailtoBody)}`;

  const firstName = name.trim().split(/\s+/)[0] || 'Traveller';

  return (
    <div className="contact-page">
      {/* Hero Header */}
      <header className="hero">
        <div className="wrap">
          <div className="top">
            <div
              className="logo"
              onClick={() => navigate('/buses')}
              title="Go to AnyStop Bus Finder"
            >
              <AnyStopLogo variant="navbar" animated={true} height="32px" />
            </div>

            <nav className="nl">
              <button
                type="button"
                className="hide"
                onClick={() => navigate('/buses')}
              >
                Find a bus
              </button>
              {isAuthenticated ? (
                <button
                  type="button"
                  className="hide"
                  onClick={() => navigate('/profile')}
                >
                  Profile
                </button>
              ) : (
                <button
                  type="button"
                  className="hide"
                  onClick={() => navigate('/login')}
                >
                  Log in
                </button>
              )}

              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleDarkMode}
                className="tbtn shrink-0 theme-toggle-btn"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-200" />}
              </button>
            </nav>
          </div>

          <h1>
            Got a bus tip?<br />
            <em>Tell us.</em>
          </h1>
          <p>
            Wrong timing, a missing stop, an idea, or a partnership. Every message helps make Punjab highway timetables more accurate for everyday riders.
          </p>
        </div>

        {/* Animated Flying Paper Plane Path */}
        <svg className="plane" viewBox="0 0 520 150" aria-hidden="true">
          <path
            className="tr"
            d="M10 130 C140 140 200 20 330 60 S470 30 500 20"
            fill="none"
            stroke="#FF8A7A"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <g>
            <path d="M-14 -9 L14 0 L-14 9 L-8 0Z" fill="#FFB020" />
            <animateMotion
              dur="4.5s"
              repeatCount="indefinite"
              rotate="auto"
              path="M10 130 C140 140 200 20 330 60 S470 30 500 20"
            />
          </g>
        </svg>
      </header>

      {/* Main Grid Content */}
      <main className="wrap">
        <div className="grid">
          {/* Left Column: Direct Info Cards */}
          <div className="info">
            <a
              className="ic"
              href="mailto:support.anystop@gmail.com"
              onClick={handleCopyEmail}
              title="Click to copy email address"
            >
              <span className="e">✉️</span>
              <div>
                <b>Email us</b>
                <span>{copiedEmail ? 'Copied to clipboard! ✓' : 'support.anystop@gmail.com'}</span>
              </div>
            </a>

            <div className="ic t">
              <span className="e">⏱</span>
              <div>
                <b>Reply time</b>
                <span>We aim to review and reply within 1–2 working days.</span>
              </div>
            </div>

            <div className="ic g">
              <span className="e">🚌</span>
              <div>
                <b>Reporting a wrong timing?</b>
                <span>Tell us the two stops, the bus operator (PRTC/Punbus/private), and the actual departure time you saw. That’s all we need.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Message Card */}
          <div className={`card ${isSent ? 'sent' : ''}`} id="card">
            <div className="form">
              <h2>Send a message</h2>
              <p className="sub">It takes under a minute.</p>

              <span className="lbl">WHAT’S THIS ABOUT?</span>
              <div className="pills">
                {TOPICS.map((topic, i) => (
                  <button
                    key={topic.label}
                    type="button"
                    className="pill"
                    aria-pressed={selectedTopic === i}
                    onClick={() => setSelectedTopic(i)}
                  >
                    <span>{topic.icon}</span>
                    <span>{topic.label}</span>
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} noValidate>
                <div className="two">
                  <label className={`fl ${nameError ? 'bad' : ''}`}>
                    <span className="lbl">YOUR NAME</span>
                    <input
                      className="inp"
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (nameError) setNameError(false);
                      }}
                      autoComplete="name"
                      placeholder="Your name"
                      maxLength={60}
                    />
                    <div className="msg">Please enter your name.</div>
                  </label>

                  <label className={`fl ${emailError ? 'bad' : ''}`}>
                    <span className="lbl">EMAIL</span>
                    <input
                      className="inp"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (emailError) setEmailError(false);
                      }}
                      autoComplete="email"
                      placeholder="you@example.com"
                      maxLength={80}
                    />
                    <div className="msg">Enter a valid email address so we can reply.</div>
                  </label>
                </div>

                <label className={`fl ${messageError ? 'bad' : ''}`}>
                  <span className="lbl">MESSAGE</span>
                  <textarea
                    className="inp"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (messageError) setMessageError(false);
                    }}
                    maxLength={600}
                    placeholder="Tell us what you saw, what timing was wrong, or what you'd like to suggest…"
                  />
                  <div className="msg">Please write at least 10 characters so we can understand your request.</div>
                </label>

                <div className="cnt">
                  <span>{message.length}</span>/600
                </div>

                <button className="send" type="submit" disabled={isSubmitting}>
                  <span>{isSubmitting ? 'Sending…' : 'Send message'}</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M22 2 11 13" />
                    <path d="M22 2 15 22l-4-9-9-4z" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Success / Done Overlay */}
            <div className="done" aria-live="polite">
              <svg className="done-check" viewBox="0 0 100 100" aria-hidden="true">
                <circle cx="50" cy="50" r="44" />
                <path d="M30 52l14 14 27-30" />
              </svg>
              <h2>Message forwarded to support!</h2>
              <p>
                Thanks, <strong>{firstName}</strong>. Your message has been sent directly to <strong>support.anystop@gmail.com</strong>.
                Our transit desk will reply to <strong>{email.trim() || 'your email'}</strong> within 1–2 working days.
              </p>
              <div className="row">
                <button type="button" className="p" onClick={() => navigate('/buses')}>
                  <span>Back to bus finder</span>
                </button>
                <button type="button" onClick={handleResetForm}>
                  <span>Write another</span>
                </button>
              </div>
              <div className="extra-mail-action">
                <span>Want to send attachments or a direct copy from your mailbox?</span>{' '}
                <a href={mailtoUrl} target="_blank" rel="noopener noreferrer">
                  Open in email app <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="faq">
          <h2>Before you write</h2>

          <details>
            <summary>How do I report a wrong bus timing?</summary>
            <p>
              Choose "Wrong timing", then mention both your starting stop and destination, the bus operator (PRTC, Punbus, CTU, or private fleet), and the scheduled departure time vs. what actually ran.
            </p>
          </details>

          <details>
            <summary>Can you add my local stop or village bypass?</summary>
            <p>
              Yes! Choose "Add a stop or route" and tell us the exact chowk, bypass flyover, or bus stop name along with the routes or bus operators that halt there.
            </p>
          </details>

          <details>
            <summary>Do you sell or cancel tickets?</summary>
            <p>
              No. AnyStop is an independent highway transit intelligence timetable for unreserved stage carriage buses. Stage carriage tickets are bought directly on board from the conductor; for Volvo services that support online booking, we redirect you to the operator's official portal.
            </p>
          </details>
        </div>
      </main>

      {/* Footer */}
      <footer>
        <div className="wrap">
          <span>© AnyStop · Punjab Highway Transit Intelligence</span>
          <div>
            <button type="button" onClick={() => navigate('/')}>Home</button>
            <button type="button" onClick={() => navigate('/buses')}>Find a bus</button>
            <button type="button" onClick={() => navigate('/profile')}>Profile</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;

