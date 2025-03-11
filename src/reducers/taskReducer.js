// Action Types
export const TASK_ACTIONS = {
  INITIALIZE: 'initialize',
  ADD_TASK: 'add_task',
  REMOVE_TASK: 'remove_task',
  TOGGLE_COMPLETION: 'toggle_completion',
  UPDATE_TASK: 'update_task',
  FILTER_TASKS: 'filter_tasks'
};

// Initial state
export const initialTaskState = {
  tasks: [],
  filter: 'all' // Can be 'all', 'active', or 'completed'
};

// Reducer function
export const taskReducer = (state, action) => {
  switch (action.type) {
    case TASK_ACTIONS.INITIALIZE:
      return {
        ...state,
        tasks: action.payload
      };

    case TASK_ACTIONS.ADD_TASK:
      return {
        ...state,
        tasks: [...state.tasks, action.payload]
      };

    case TASK_ACTIONS.REMOVE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };

    case TASK_ACTIONS.TOGGLE_COMPLETION:
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload
            ? { ...task, completed: !task.completed }
            : task
        )
      };

    case TASK_ACTIONS.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task => 
          task.id === action.payload.id
            ? { ...task, ...action.payload.updates }
            : task
        )
      };

    case TASK_ACTIONS.FILTER_TASKS:
      return {
        ...state,
        filter: action.payload
      };

    default:
      return state;
  }
};
