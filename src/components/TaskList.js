import React, { useMemo } from 'react';
import TaskItem from './TaskItem';

function TaskList({ tasks, onRemoveTask, onToggleCompletion, onUpdateTask }) {
  // Use useMemo to avoid re-rendering the empty message unnecessarily
  const emptyMessage = useMemo(() => (
    <p className="empty-message">No tasks available. Add a new task to get started!</p>
  ), []);
  
  if (tasks.length === 0) {
    return emptyMessage;
  }

  return (
    <div className="task-list">
      <h2>Your Tasks ({tasks.length})</h2>
      {tasks.map(task => (
        <TaskItem 
          key={task.id}
          task={task}
          onRemove={onRemoveTask}
          onToggleCompletion={onToggleCompletion}
          onUpdate={onUpdateTask}
        />
      ))}
    </div>
  );
}

// Wrap the component in React.memo to prevent re-renders if props haven't changed
export default React.memo(TaskList);
