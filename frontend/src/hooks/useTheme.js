import { useState, useEffect } from 'react';

/**
 * useTheme — manages dark/light mode toggle.
 * Persists preference to localStorage so it survives page refresh.
 * Applies theme by toggling a 'light' class on <body>.
 */
export function useTheme() {
  // Read saved preference, default to dark
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  useEffect(() => {
    // Apply theme class to body so CSS variables can respond
    if (isDark) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
    // Persist to localStorage
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return { isDark, toggleTheme };
}