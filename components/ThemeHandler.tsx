"use client"

import React, { useEffect, useState, useMemo } from 'react';
import { WiMoonAltFirstQuarter } from "react-icons/wi"; // System
import { FiMoon, FiSun } from "react-icons/fi"; // Dark and Sun
import { useTheme } from 'next-themes';

type ThemePropsHandler = {
  children: (theme: string, systemTheme: string, changeTheme: () => void, icon: JSX.Element) => React.ReactNode;
}

const ThemeHandler: React.FC<ThemePropsHandler> = ({ children }) => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && theme) {
      localStorage.setItem('theme', theme);
    }
  }, [theme]);

  const currentTheme = theme || 'system';

  const currentIcon = useMemo(() => {
    const iconMap: { [key: string]: JSX.Element } = {
      system: <WiMoonAltFirstQuarter />,
      light: <FiSun />,
      dark: <FiMoon />,
    };
    return iconMap[currentTheme];
  }, [currentTheme]);

  const changeTheme = () => {
    const nextThemeMap: { [key: string]: string } = {
      system: 'light',
      light: 'dark',
      dark: 'system',
    };
    setTheme(nextThemeMap[currentTheme]);
  };

  if (!mounted) return null; // Avoid rendering until mounted

  return (
    <>
      {children(currentTheme, systemTheme || 'system', changeTheme, currentIcon)}
    </>
  );
};

export default ThemeHandler;