import React, { useEffect, useState } from 'react';

function DebugInfo() {
  const [info, setInfo] = useState({
    environment: 'unknown',
    isLocalStorageAvailable: false
  });
  
  useEffect(() => {
    // Check environment
    const environment = process.env.NODE_ENV || 'unknown';
    
    // Check localStorage availability
    let localStorageAvailable = false;
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      localStorageAvailable = true;
    } catch (e) {
      localStorageAvailable = false;
    }
    
    setInfo({
      environment,
      isLocalStorageAvailable: localStorageAvailable
    });
    
    console.log('Debug info:', {
      environment,
      isLocalStorageAvailable: localStorageAvailable
    });
  }, []);
  
  return null; // No visible UI, just for debugging
}

export default DebugInfo;
