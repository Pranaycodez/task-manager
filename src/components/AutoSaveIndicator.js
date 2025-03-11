import React, { useState, useEffect, useCallback } from 'react';

function AutoSaveIndicator({ show }) {
  const [visible, setVisible] = useState(false);
  
  // Use useCallback to memoize the visibility setting logic
  const updateVisibility = useCallback((isVisible) => {
    setVisible(isVisible);
  }, []);
  
  useEffect(() => {
    if (show) {
      updateVisibility(true);
      const timer = setTimeout(() => {
        updateVisibility(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [show, updateVisibility]);
  
  if (!visible) return null;
  
  return (
    <div className="autosave-indicator">
      Saving changes...
    </div>
  );
}

export default React.memo(AutoSaveIndicator);
