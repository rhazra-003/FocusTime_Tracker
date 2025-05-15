import React, { createContext, useContext, useEffect, useState } from 'react';
import { storage } from '../utils/storage';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  // Load theme on mount
  useEffect(() => {
    const loadTheme = async () => {
      const settings = await storage.getUserSettings();
      setTheme(settings.theme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(settings.theme);
    };
    loadTheme();
  }, []);

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    const settings = await storage.getUserSettings();
    await storage.saveUserSettings({
      ...settings,
      theme: newTheme,
    });

    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
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