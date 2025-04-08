import React, { createContext, useState, useEffect } from 'react';

// Create a context with default values
export const ThemeContext = createContext({
  darkMode: false,
  toggleTheme: () => {},
});

// Create a provider component
export const ThemeProvider = ({ children }) => {
  // Check localStorage for saved theme preference
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('darkMode');
      return savedTheme ? JSON.parse(savedTheme) : false;
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return false;
    }
  });

  // Update localStorage when theme changes
  useEffect(() => {
    try {
      localStorage.setItem('darkMode', JSON.stringify(darkMode));
      
      // Apply theme class to body element
      if (darkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  }, [darkMode]);

  // Toggle theme function
  const toggleTheme = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Value to be provided to consumers
  const value = {
    darkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
