import React, { useState, useRef, useEffect, useCallback } from 'react';

function TaskForm({ onAddTask }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Create a ref for the title input field
  const titleInputRef = useRef(null);
  
  // Auto-focus the title input when component mounts
  useEffect(() => {
    titleInputRef.current.focus();
  }, []);
  
  // Memoize the handleSubmit function
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    onAddTask({ title, description });
    
    // Clear form fields after submission
    setTitle('');
    setDescription('');
    
    // Focus back on the input field after task submission
    titleInputRef.current.focus();
  }, [title, description, onAddTask]);
  
  // Memoize the keydown handler
  const handleKeyDown = useCallback((e) => {
    // Quick add on Ctrl+Enter or Cmd+Enter for title field
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>✨ Add New Task</h2>
      
      <div className="form-control">
        <label htmlFor="title">📌 Title:</label>
        <input
          type="text"
          id="title"
          ref={titleInputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done?"
          required
        />
        <small className="form-hint">⌨️ Press Ctrl+Enter for quick add</small>
      </div>
      
      <div className="form-control">
        <label htmlFor="description">📝 Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add details about this task..."
          rows="3"
        />
      </div>
      
      <button type="submit">➕ Add Task</button>
    </form>
  );
}

export default React.memo(TaskForm);
