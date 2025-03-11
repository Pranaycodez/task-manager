import React, { useState, useEffect } from 'react';

function PerformanceMonitor() {
  const [renderCount, setRenderCount] = useState(0);
  const [lastRenderTime, setLastRenderTime] = useState(performance.now());
  const [renderTimes, setRenderTimes] = useState([]);
  
  // Track render count and timing
  useEffect(() => {
    const now = performance.now();
    const timeSinceLastRender = now - lastRenderTime;
    
    // Only keep the last 10 render times
    setRenderTimes(prev => {
      const newTimes = [...prev, timeSinceLastRender];
      return newTimes.slice(Math.max(newTimes.length - 10, 0));
    });
    
    setRenderCount(prev => prev + 1);
    setLastRenderTime(now);
  }, [lastRenderTime]); // Add dependency array to prevent infinite updates
  
  // Calculate average render time
  const averageRenderTime = renderTimes.length 
    ? renderTimes.reduce((sum, time) => sum + time, 0) / renderTimes.length
    : 0;
  
  return (
    <div className="performance-monitor">
      <h3>Performance Monitor</h3>
      <p>Total Renders: {renderCount}</p>
      <p>Avg Render Time: {averageRenderTime.toFixed(2)} ms</p>
      <p>Last Render Time: {renderTimes[renderTimes.length - 1]?.toFixed(2) || 0} ms</p>
      
      <div className="render-bars">
        {renderTimes.map((time, index) => (
          <div 
            key={index} 
            className="render-bar"
            style={{ 
              height: `${Math.min(time / 10, 100)}%`,
              backgroundColor: time > 16 ? '#f44336' : '#4caf50'
            }}
            title={`${time.toFixed(2)} ms`}
          />
        ))}
      </div>
    </div>
  );
}

export default PerformanceMonitor;
