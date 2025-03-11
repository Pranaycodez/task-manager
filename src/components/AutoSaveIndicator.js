import React, { useState, useEffect } from 'react';

function AutoSaveIndicator({ show }) {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [show]);
  
  if (!visible) return null;
  
  return (
    <div className="autosave-indicator">
      Saving changes...
    </div>
  );
}

export default AutoSaveIndicator;
