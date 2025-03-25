import React, { useReducer, useEffect, useContext, useState, useRef, useMemo, useCallback } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilter from './components/TaskFilter';
import AutoSaveIndicator from './components/AutoSaveIndicator';
import ThemeToggle from './components/ThemeToggle';
import { ThemeContext } from './contexts/ThemeContext';
import { taskReducer, initialTaskState, TASK_ACTIONS } from './reducers/taskReducer';
import PerformanceMonitor from './components/PerformanceMonitor';
import './App.css';

function App() {
  // Get theme context
  const { darkMode } = useContext(ThemeContext);
  
  // Replace useState with useReducer for task management
  const [taskState, dispatch] = useReducer(taskReducer, initialTaskState);
  
  const [isSaving, setIsSaving] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  
  // Use useRef to keep track of task completion stats without re-rendering
  const taskStats = useRef({
    completedCount: 0,
    lastCompletedAt: null
  });
  
  // Load tasks from localStorage on initial render
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      const parsedTasks = savedTasks ? JSON.parse(savedTasks) : [];
      
      // Initialize task stats
      const completedTasks = parsedTasks.filter(task => task.completed);
      taskStats.current.completedCount = completedTasks.length;
      
      dispatch({ type: TASK_ACTIONS.INITIALIZE, payload: parsedTasks });
    } catch (error) {
      console.error('Error loading tasks from localStorage:', error);
      // Fallback to empty tasks array
      dispatch({ type: TASK_ACTIONS.INITIALIZE, payload: [] });
    }
  }, []);
  
  // Use useMemo to compute filtered tasks only when tasks or filter changes
  const filteredTasks = useMemo(() => {
    console.log("Filtering tasks with filter:", taskState.filter);
    switch (taskState.filter) {
      case 'active':
        return taskState.tasks.filter(task => !task.completed);
      case 'completed':
        return taskState.tasks.filter(task => task.completed);
      case 'all':
      default:
        return taskState.tasks;
    }
  }, [taskState.tasks, taskState.filter]);
  
  // Use useMemo to compute task statistics
  const taskStatistics = useMemo(() => {
    console.log("Calculating task statistics");
    const total = taskState.tasks.length;
    const completed = taskState.tasks.filter(task => task.completed).length;
    const active = total - completed;
    const percentComplete = total === 0 ? 0 : Math.round((completed / total) * 100);
    
    return { total, completed, active, percentComplete };
  }, [taskState.tasks]);
  
  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    // Skip on initial render
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }
    
    try {
      // Update stats without triggering re-renders
      if (taskStatistics.completed > taskStats.current.completedCount) {
        taskStats.current.lastCompletedAt = new Date().toLocaleTimeString();
      }
      taskStats.current.completedCount = taskStatistics.completed;
      
      // Save tasks to localStorage
      localStorage.setItem('tasks', JSON.stringify(taskState.tasks));
      setIsSaving(true);
      
      // Rather than using alert, which might cause issues in deployment
      console.log(`Task list updated! ${taskStatistics.completed} of ${taskStatistics.total} tasks completed.`);
      if (taskStats.current.lastCompletedAt) {
        console.log(`Last task completed at ${taskStats.current.lastCompletedAt}`);
      }
      
      const timer = setTimeout(() => {
        setIsSaving(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Error saving tasks to localStorage:', error);
      setIsSaving(false);
    }
  }, [taskState.tasks, isInitialRender, taskStatistics]);
  
  // Optimize action handlers with useCallback
  const addTask = useCallback((taskData) => {
    const newTask = {
      ...taskData,
      id: Date.now(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    dispatch({ type: TASK_ACTIONS.ADD_TASK, payload: newTask });
  }, []);
  
  const removeTask = useCallback((id) => {
    dispatch({ type: TASK_ACTIONS.REMOVE_TASK, payload: id });
  }, []);
  
  const toggleTaskCompletion = useCallback((id) => {
    dispatch({ type: TASK_ACTIONS.TOGGLE_COMPLETION, payload: id });
  }, []);
  
  const updateTaskDetails = useCallback((id, updates) => {
    dispatch({ 
      type: TASK_ACTIONS.UPDATE_TASK, 
      payload: { id, updates } 
    });
  }, []);
  
  const filterTasks = useCallback((filterStatus) => {
    dispatch({ type: TASK_ACTIONS.FILTER_TASKS, payload: filterStatus });
  }, []);

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      <div className="app-header">
        <h1>Task Manager</h1>
        <ThemeToggle />
      </div>
      <AutoSaveIndicator show={isSaving} />
      <TaskForm onAddTask={addTask} />
      <TaskFilter 
        currentFilter={taskState.filter}
        onFilterChange={filterTasks}
      />
      
      {/* Task Statistics - using memoized values */}
      <div className="stats-display">
        <p>
          <strong>Progress: {taskStatistics.percentComplete}%</strong> ({taskStatistics.completed} of {taskStatistics.total} tasks completed)
          {taskStats.current.lastCompletedAt && 
            <span className="last-completed"> Last completed at {taskStats.current.lastCompletedAt}</span>}
        </p>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${taskStatistics.percentComplete}%` }}
          ></div>
        </div>
      </div>
      
      <TaskList 
        tasks={filteredTasks}
        onRemoveTask={removeTask}
        onToggleCompletion={toggleTaskCompletion}
        onUpdateTask={updateTaskDetails}
      />
      
      <PerformanceMonitor />
    </div>
  );
}

export default App;