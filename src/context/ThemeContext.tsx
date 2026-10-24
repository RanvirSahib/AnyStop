import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: (e?: React.MouseEvent<HTMLButtonElement>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('anystop_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = darkMode ? 'dark' : 'light';
    try {
      localStorage.setItem('anystop_theme', darkMode ? 'dark' : 'light');
    } catch {
      // ignore
    }
  }, [darkMode]);

  const toggleDarkMode = (e?: React.MouseEvent<HTMLButtonElement>) => {
    const nextDark = !darkMode;

    // Check for View Transition API support
    if (!document.startViewTransition || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDarkMode(nextDark);
      return;
    }

    const docEl = document.documentElement;
    let x = window.innerWidth / 2;
    let y = 0;

    if (e && e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      x = rect.left + rect.width / 2;
      y = rect.top + rect.height / 2;
    }

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    docEl.classList.add('theme-transition-active', 'theme-clip-transition');

    const transition = document.startViewTransition(() => {
      setDarkMode(nextDark);
    });

    const cleanup = () => {
      docEl.classList.remove('theme-transition-active', 'theme-clip-transition');
    };

    transition.ready.then(() => {
      const animation = docEl.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`
          ]
        },
        {
          duration: 380,
          easing: 'cubic-bezier(0.2, 0, 0, 1)',
          pseudoElement: '::view-transition-new(root)'
        }
      );
      animation.onfinish = cleanup;
      animation.oncancel = cleanup;
    }).catch(cleanup);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
