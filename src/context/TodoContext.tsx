import React, { createContext, useReducer, useEffect } from 'react';
import {
  Todo,
  TaskStatus,
  Priority,
  CategoryTag,
  FilterStatus,
  SortOption,
  ActionWrapper,
  StateContainer,
  BulkActionWrapper
} from '../types/todo';

const STORAGE_KEY = 'corporate_test_app_todos_v2';

const DEFAULT_TODOS: Array<Todo> = [
  {
    id: '1',
    title: 'Review Production Architecture & Component Specifications',
    description: 'Verify system architecture, TypeScript contracts, and Docker runtime configuration.',
    status: 'completed',
    priority: 'high',
    category: 'architecture',
    subtasks: [
      { id: '101', title: 'Verify component tier separation', completed: true },
      { id: '102', title: 'Check type definitions and interfaces', completed: true }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    dueDate: new Date(Date.now() + 86400000).toISOString()
  },
  {
    id: '2',
    title: 'Set Up Automated CI/CD Pipeline',
    description: 'Configure GitHub Actions workflow for automated testing, linting, and Docker container builds.',
    status: 'in_progress',
    priority: 'medium',
    category: 'devops',
    subtasks: [
      { id: '201', title: 'Configure build pipeline', completed: true },
      { id: '202', title: 'Validate deployment scripts', completed: false }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Document TypeScript Type System & Generics',
    description: 'Detail type definitions, interface contracts, and generic utility types for team onboarding documentation.',
    status: 'in_review',
    priority: 'high',
    category: 'feature',
    subtasks: [
      { id: '301', title: 'Map component event handlers', completed: true },
      { id: '302', title: 'Define action payload types', completed: false }
    ],
    createdAt: new Date().toISOString(),
  }
];

export type TodoAction =
  | ActionWrapper<'ADD_TODO', { title: string; description?: string; priority: Priority; category: CategoryTag; status?: TaskStatus; dueDate?: string; subtaskTitles?: Array<string> }>
  | ActionWrapper<'EDIT_TODO', { id: string; title: string; description?: string; priority: Priority; category: CategoryTag; status: TaskStatus; dueDate?: string }>
  | ActionWrapper<'TOGGLE_TODO', { id: string }>
  | ActionWrapper<'UPDATE_STATUS', { id: string; status: TaskStatus }>
  | ActionWrapper<'DELETE_TODO', { id: string }>
  | ActionWrapper<'DUPLICATE_TODO', { id: string }>
  | ActionWrapper<'ADD_SUBTASK', { todoId: string; title: string }>
  | ActionWrapper<'TOGGLE_SUBTASK', { todoId: string; subtaskId: string }>
  | ActionWrapper<'DELETE_SUBTASK', { todoId: string; subtaskId: string }>
  | ActionWrapper<'TOGGLE_SELECT_TODO', { id: string }>
  | ActionWrapper<'SELECT_ALL', Array<string>>
  | ActionWrapper<'CLEAR_SELECTION', undefined>
  | ActionWrapper<'BULK_DELETE', undefined>
  | ActionWrapper<'BULK_UPDATE_STATUS', BulkActionWrapper<string, TaskStatus>>
  | ActionWrapper<'BULK_UPDATE_PRIORITY', BulkActionWrapper<string, Priority>>
  | ActionWrapper<'SET_FILTER_STATUS', FilterStatus>
  | ActionWrapper<'SET_FILTER_CATEGORY', 'all' | CategoryTag>
  | ActionWrapper<'SET_FILTER_PRIORITY', 'all' | Priority>
  | ActionWrapper<'SET_SEARCH_QUERY', string>
  | ActionWrapper<'SET_SORT_OPTION', SortOption>
  | ActionWrapper<'TOGGLE_SORT_DIRECTION', undefined>;

export interface TodoContextType {
  state: StateContainer<Todo>;
  dispatch: React.Dispatch<TodoAction>;
}

export const TodoContext = createContext<TodoContextType | undefined>(undefined);

function loadInitialState(): StateContainer<Todo> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: Array<Todo> = JSON.parse(saved);
      return {
        items: parsed,
        selectedIds: [],
        filterStatus: 'all',
        filterCategory: 'all',
        filterPriority: 'all',
        searchQuery: '',
        sortBy: 'createdAt',
        sortDirection: 'desc'
      };
    }
  } catch (e) {
    console.error('Failed to load todos from localStorage', e);
  }

  return {
    items: DEFAULT_TODOS,
    selectedIds: [],
    filterStatus: 'all',
    filterCategory: 'all',
    filterPriority: 'all',
    searchQuery: '',
    sortBy: 'createdAt',
    sortDirection: 'desc'
  };
}

function todoReducer(state: StateContainer<Todo>, action: TodoAction): StateContainer<Todo> {
  switch (action.type) {
    case 'ADD_TODO': {
      const subtasks = (action.payload.subtaskTitles || [])
        .filter(t => t.trim().length > 0)
        .map((t, idx) => ({ id: `${Date.now()}-${idx}`, title: t.trim(), completed: false }));

      const newTodo: Todo = {
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        title: action.payload.title,
        description: action.payload.description,
        status: action.payload.status || 'backlog',
        priority: action.payload.priority,
        category: action.payload.category,
        subtasks,
        createdAt: new Date().toISOString(),
        dueDate: action.payload.dueDate
      };
      return { ...state, items: [newTodo, ...state.items] };
    }

    case 'EDIT_TODO': {
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? {
                ...item,
                title: action.payload.title,
                description: action.payload.description,
                priority: action.payload.priority,
                category: action.payload.category,
                status: action.payload.status,
                dueDate: action.payload.dueDate
              }
            : item
        )
      };
    }

    case 'TOGGLE_TODO': {
      return {
        ...state,
        items: state.items.map(item => {
          if (item.id !== action.payload.id) return item;
          const nextStatus: TaskStatus = item.status === 'completed' ? 'in_progress' : 'completed';
          return {
            ...item,
            status: nextStatus,
            subtasks: item.subtasks.map(st => ({ ...st, completed: nextStatus === 'completed' }))
          };
        })
      };
    }

    case 'UPDATE_STATUS': {
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? { ...item, status: action.payload.status } : item
        )
      };
    }

    case 'DELETE_TODO': {
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id),
        selectedIds: state.selectedIds.filter(id => id !== action.payload.id)
      };
    }

    case 'DUPLICATE_TODO': {
      const original = state.items.find(item => item.id === action.payload.id);
      if (!original) return state;

      const duplicated: Todo = {
        ...original,
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        title: `${original.title} (Copy)`,
        createdAt: new Date().toISOString(),
        subtasks: original.subtasks.map((st, idx) => ({ ...st, id: `${Date.now()}-${idx}` }))
      };
      return { ...state, items: [duplicated, ...state.items] };
    }

    case 'ADD_SUBTASK': {
      return {
        ...state,
        items: state.items.map(item => {
          if (item.id !== action.payload.todoId) return item;
          const newSubtask = { id: String(Date.now()), title: action.payload.title, completed: false };
          return { ...item, subtasks: [...item.subtasks, newSubtask] };
        })
      };
    }

    case 'TOGGLE_SUBTASK': {
      return {
        ...state,
        items: state.items.map(item => {
          if (item.id !== action.payload.todoId) return item;
          const updatedSubtasks = item.subtasks.map(st =>
            st.id === action.payload.subtaskId ? { ...st, completed: !st.completed } : st
          );
          const allCompleted = updatedSubtasks.length > 0 && updatedSubtasks.every(st => st.completed);
          return {
            ...item,
            subtasks: updatedSubtasks,
            status: allCompleted ? 'completed' : item.status === 'completed' ? 'in_progress' : item.status
          };
        })
      };
    }

    case 'DELETE_SUBTASK': {
      return {
        ...state,
        items: state.items.map(item => {
          if (item.id !== action.payload.todoId) return item;
          return {
            ...item,
            subtasks: item.subtasks.filter(st => st.id !== action.payload.subtaskId)
          };
        })
      };
    }

    case 'TOGGLE_SELECT_TODO': {
      const id = action.payload.id;
      const isSelected = state.selectedIds.includes(id);
      return {
        ...state,
        selectedIds: isSelected
          ? state.selectedIds.filter(item => item !== id)
          : [...state.selectedIds, id]
      };
    }

    case 'SELECT_ALL': {
      return { ...state, selectedIds: action.payload };
    }

    case 'CLEAR_SELECTION': {
      return { ...state, selectedIds: [] };
    }

    case 'BULK_DELETE': {
      return {
        ...state,
        items: state.items.filter(item => !state.selectedIds.includes(item.id)),
        selectedIds: []
      };
    }

    case 'BULK_UPDATE_STATUS': {
      const { targetIds, updateValue } = action.payload;
      return {
        ...state,
        items: state.items.map(item =>
          targetIds.includes(item.id) ? { ...item, status: updateValue } : item
        ),
        selectedIds: []
      };
    }

    case 'BULK_UPDATE_PRIORITY': {
      const { targetIds, updateValue } = action.payload;
      return {
        ...state,
        items: state.items.map(item =>
          targetIds.includes(item.id) ? { ...item, priority: updateValue } : item
        ),
        selectedIds: []
      };
    }

    case 'SET_FILTER_STATUS':
      return { ...state, filterStatus: action.payload };
    case 'SET_FILTER_CATEGORY':
      return { ...state, filterCategory: action.payload };
    case 'SET_FILTER_PRIORITY':
      return { ...state, filterPriority: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_SORT_OPTION':
      return { ...state, sortBy: action.payload };
    case 'TOGGLE_SORT_DIRECTION':
      return { ...state, sortDirection: state.sortDirection === 'asc' ? 'desc' : 'asc' };

    default:
      return state;
  }
}

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, undefined, loadInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch (e) {
      console.error('Failed to save todos to localStorage', e);
    }
  }, [state.items]);

  return (
    <TodoContext.Provider value={{ state, dispatch }}>
      {children}
    </TodoContext.Provider>
  );
};
