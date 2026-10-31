import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { BusFinderPage } from './pages/BusFinderPage';
import { ProfilePage } from './pages/ProfilePage';
import { registerNativeBackButton } from './utils/nativeApp';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState<'fade-in' | 'fade-out'>('fade-in');
  const [isNavigating, setIsNavigating] = useState(false);

  // Native Android hardware/gesture back button handling
  useEffect(() => {
    const unregister = registerNativeBackButton(() => {
      // 1. Check if any open modal/dialog has a close button and dismiss it first
      const openModalCloseBtn = document.querySelector<HTMLButtonElement>(
        'button[aria-label="Close modal"], button[aria-label="Close calendar"], .custom-calendar-close-btn'
      );
      if (openModalCloseBtn) {
        openModalCloseBtn.click();
        return true; // handled modal dismissal
      }
      return false; // proceed to route history back
    });
    return unregister;
  }, []);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setIsNavigating(true);
      setTransitionStage('fade-out');

      let enterTimer: ReturnType<typeof setTimeout>;
      const exitTimer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('fade-in');
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

        enterTimer = setTimeout(() => {
          setIsNavigating(false);
        }, 200);
      }, 100);

      return () => {
        clearTimeout(exitTimer);
        clearTimeout(enterTimer);
      };
    }
  }, [location, displayLocation.pathname]);

  return (
    <>
      {isNavigating && <div className="anystop-route-progress" aria-hidden="true" />}
      <div className={`anystop-page-stage ${transitionStage}`} key={displayLocation.pathname}>
        <Routes location={displayLocation}>
          {/* 1. Landing Page */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/landing" element={<Navigate to="/" replace />} />

          {/* 2. Boarding Pass Login Page */}
          <Route path="/login" element={<LoginPage />} />

          {/* 3. Punjab Bus Finder Page */}
          <Route path="/buses" element={<BusFinderPage />} />
          <Route path="/finder" element={<Navigate to="/buses" replace />} />

          {/* 4. Passenger Profile Page */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/account" element={<Navigate to="/profile" replace />} />

          {/* Wildcard / Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
};

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <AnimatedRoutes />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;

