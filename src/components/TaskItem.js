import React, { useState, useRef, useEffect, useCallback } from 'react';

function TaskItem({ task, onRemove, onToggleCompletion, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  
  // Create a ref for the edit title input
  const editTitleInputRef = useRef(null);
  
  // Update form values when task changes (useful if parent updates task data)
  useEffect(() => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  }, [task]);
  
  // Auto-focus the edit field when entering edit mode
  useEffect(() => {
    if (isEditing && editTitleInputRef.current) {
      editTitleInputRef.current.focus();
    }
  }, [isEditing]);
  
  // Memoize handlers using useCallback
  const handleUpdate = useCallback(() => {
    if (editTitle.trim()) {
      onUpdate(task.id, {
        title: editTitle,
        description: editDescription
      });
      setIsEditing(false);
    }
  }, [task.id, editTitle, editDescription, onUpdate]);
  
  const handleCancel = useCallback(() => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setIsEditing(false);
  }, [task.title, task.description]);
  
  const handleEditClick = useCallback(() => {
    setIsEditing(true);
  }, []);
  
  const handleToggleClick = useCallback(() => {
    onToggleCompletion(task.id);
  }, [task.id, onToggleCompletion]);
  
  const handleDeleteClick = useCallback(() => {
    onRemove(task.id);
  }, [task.id, onRemove]);

  // Render edit form
  if (isEditing) {
    return (
      <div className="task-item editing">
        <div className="edit-form">
          <div className="form-control">
            <label htmlFor={`title-${task.id}`}>Title:</label>
            <input
              id={`title-${task.id}`}
              type="text"
              ref={editTitleInputRef}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label htmlFor={`description-${task.id}`}>Description:</label>
            <textarea
              id={`description-${task.id}`}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows="3"
            />
          </div>
          <div className="edit-actions">
            <button onClick={handleUpdate} className="save-btn">Save</button>
            <button onClick={handleCancel} className="cancel-btn">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  // Render task view
  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
        <p className="task-status">
          Status: {task.completed ? 'Completed' : 'Pending'}
        </p>
      </div>
      
      <div className="task-actions">
        <button 
          className="toggle-btn"
          onClick={handleToggleClick}
        >
          {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
        </button>
        <button 
          className="edit-btn"
          onClick={handleEditClick}
        >
          Edit
        </button>
        <button 
          className="delete-btn"
          onClick={handleDeleteClick}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

// Wrap TaskItem with React.memo and provide a custom comparison function
export default React.memo(TaskItem, (prevProps, nextProps) => {
  // Only re-render if the task data changed
  return (
    prevProps.task.id === nextProps.task.id &&
    prevProps.task.title === nextProps.task.title &&
    prevProps.task.description === nextProps.task.description &&
    prevProps.task.completed === nextProps.task.completed
  );
});
