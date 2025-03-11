import React, { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';

function ThemeToggle() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <button 
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
    </button>
  );
}

export default ThemeToggle;
