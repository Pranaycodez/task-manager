import React, { useCallback } from 'react';

function TaskFilter({ currentFilter, onFilterChange }) {
  // Memoize filter click handlers
  const handleAllClick = useCallback(() => {
    onFilterChange('all');
  }, [onFilterChange]);
  
  const handleActiveClick = useCallback(() => {
    onFilterChange('active');
  }, [onFilterChange]);
  
  const handleCompletedClick = useCallback(() => {
    onFilterChange('completed');
  }, [onFilterChange]);
  
  return (
    <div className="task-filter">
      <span>Filter: </span>
      <div className="filter-buttons">
        <button 
          className={`filter-btn ${currentFilter === 'all' ? 'active' : ''}`}
          onClick={handleAllClick}
        >
          All
        </button>
        <button 
          className={`filter-btn ${currentFilter === 'active' ? 'active' : ''}`}
          onClick={handleActiveClick}
        >
          Active
        </button>
        <button 
          className={`filter-btn ${currentFilter === 'completed' ? 'active' : ''}`}
          onClick={handleCompletedClick}
        >
          Completed
        </button>
      </div>
    </div>
  );
}

export default React.memo(TaskFilter);
