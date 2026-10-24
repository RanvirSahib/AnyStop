import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { BusFinderPage } from './pages/BusFinderPage';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransitionStage] = useState<'fade-in' | 'fade-out'>('fade-in');
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setIsNavigating(true);
      setTransitionStage('fade-out');

      const exitTimer = setTimeout(() => {
        setDisplayLocation(location);
        setTransitionStage('fade-in');
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

        const enterTimer = setTimeout(() => {
          setIsNavigating(false);
        }, 320);

        return () => clearTimeout(enterTimer);
      }, 160);

      return () => clearTimeout(exitTimer);
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

          {/* Wildcard / Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AnimatedRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

