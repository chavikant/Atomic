import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';
type ThemeColor = 'indigo' | 'blue' | 'green' | 'amber' | 'red';

interface ThemeContextType {
  mode: ThemeMode;
  color: ThemeColor;
  reduceAnimations: boolean;
  compactMode: boolean;
  setMode: (mode: ThemeMode) => void;
  setColor: (color: ThemeColor) => void;
  setReduceAnimations: (reduce: boolean) => void;
  setCompactMode: (compact: boolean) => void;
  resetToDefault: () => void;
}

const defaultTheme = {
  mode: 'system' as ThemeMode,
  color: 'indigo' as ThemeColor,
  reduceAnimations: false,
  compactMode: false
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(() => {
    // Try to get theme from localStorage
    const savedTheme = localStorage.getItem('atomicHabitsTheme');
    return savedTheme ? JSON.parse(savedTheme) : defaultTheme;
  });

  // Apply theme whenever it changes
  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('atomicHabitsTheme', JSON.stringify(theme));
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme.color);
    
    // Apply mode
    if (theme.mode === 'system') {
      // Use media query to detect system preference
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', isDarkMode);
    } else {
      document.documentElement.classList.toggle('dark', theme.mode === 'dark');
    }
    
    // Apply reduced animations
    document.documentElement.classList.toggle('reduce-motion', theme.reduceAnimations);
    
    // Apply compact mode
    document.documentElement.classList.toggle('compact-mode', theme.compactMode);
  }, [theme]);

  // Function to set theme mode
  const setMode = (mode: ThemeMode) => {
    setTheme((prev: typeof defaultTheme) => ({ ...prev, mode }));
  };

  // Function to set theme color
  const setColor = (color: ThemeColor) => {
    setTheme((prev: typeof defaultTheme) => ({ ...prev, color }));
  };

  // Function to toggle reduce animations
  const setReduceAnimations = (reduceAnimations: boolean) => {
    setTheme((prev: typeof defaultTheme) => ({ ...prev, reduceAnimations }));
  };

  // Function to toggle compact mode
  const setCompactMode = (compactMode: boolean) => {
    setTheme((prev: typeof defaultTheme) => ({ ...prev, compactMode }));
  };

  // Function to reset to default theme
  const resetToDefault = () => {
    setTheme(defaultTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        mode: theme.mode,
        color: theme.color,
        reduceAnimations: theme.reduceAnimations,
        compactMode: theme.compactMode,
        setMode,
        setColor,
        setReduceAnimations,
        setCompactMode,
        resetToDefault
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}