import { useContext } from 'react';
import { TodoContext } from '../context/TodoContext';
import { Priority, TaskStatus, CategoryTag, FilterStatus, SortOption } from '../types/todo';

const PRIORITY_RANK: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }

  const { state, dispatch } = context;

  // Multi-dimensional Filter Engine
  const filteredTodos = state.items.filter(todo => {
    // 1. Filter by Status
    if (state.filterStatus !== 'all' && todo.status !== state.filterStatus) {
      return false;
    }

    // 2. Filter by Category Tag
    if (state.filterCategory !== 'all' && todo.category !== state.filterCategory) {
      return false;
    }

    // 3. Filter by Priority
    if (state.filterPriority !== 'all' && todo.priority !== state.filterPriority) {
      return false;
    }

    // 4. Search Query over title, description, category, and subtask titles
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      const titleMatch = todo.title.toLowerCase().includes(q);
      const descMatch = todo.description?.toLowerCase().includes(q) ?? false;
      const catMatch = todo.category.toLowerCase().includes(q);
      const subtaskMatch = todo.subtasks.some(st => st.title.toLowerCase().includes(q));
      return titleMatch || descMatch || catMatch || subtaskMatch;
    }

    return true;
  });

  // Multi-Criteria Sort Engine
  const sortedTodos = [...filteredTodos].sort((a, b) => {
    let diff = 0;
    switch (state.sortBy) {
      case 'priority':
        diff = PRIORITY_RANK[b.priority] - PRIORITY_RANK[a.priority];
        break;
      case 'dueDate':
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        diff = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case 'alphabetical':
        diff = a.title.localeCompare(b.title);
        break;
      case 'progress': {
        const ratioA = a.subtasks.length > 0 ? a.subtasks.filter(st => st.completed).length / a.subtasks.length : (a.status === 'completed' ? 1 : 0);
        const ratioB = b.subtasks.length > 0 ? b.subtasks.filter(st => st.completed).length / b.subtasks.length : (b.status === 'completed' ? 1 : 0);
        diff = ratioB - ratioA;
        break;
      }
      case 'createdAt':
      default:
        diff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        break;
    }

    return state.sortDirection === 'asc' ? -diff : diff;
  });

  // Actions Helper API
  const addTodo = (
    title: string,
    description?: string,
    priority: Priority = 'medium',
    category: CategoryTag = 'work',
    status: TaskStatus = 'backlog',
    dueDate?: string,
    subtaskTitles?: Array<string>
  ) => {
    dispatch({
      type: 'ADD_TODO',
      payload: { title, description, priority, category, status, dueDate, subtaskTitles }
    });
  };

  const editTodo = (
    id: string,
    title: string,
    description?: string,
    priority: Priority = 'medium',
    category: CategoryTag = 'work',
    status: TaskStatus = 'backlog',
    dueDate?: string
  ) => {
    dispatch({
      type: 'EDIT_TODO',
      payload: { id, title, description, priority, category, status, dueDate }
    });
  };

  const toggleTodo = (id: string) => {
    dispatch({ type: 'TOGGLE_TODO', payload: { id } });
  };

  const updateStatus = (id: string, status: TaskStatus) => {
    dispatch({ type: 'UPDATE_STATUS', payload: { id, status } });
  };

  const deleteTodo = (id: string) => {
    dispatch({ type: 'DELETE_TODO', payload: { id } });
  };

  const duplicateTodo = (id: string) => {
    dispatch({ type: 'DUPLICATE_TODO', payload: { id } });
  };

  const addSubtask = (todoId: string, title: string) => {
    dispatch({ type: 'ADD_SUBTASK', payload: { todoId, title } });
  };

  const toggleSubtask = (todoId: string, subtaskId: string) => {
    dispatch({ type: 'TOGGLE_SUBTASK', payload: { todoId, subtaskId } });
  };

  const deleteSubtask = (todoId: string, subtaskId: string) => {
    dispatch({ type: 'DELETE_SUBTASK', payload: { todoId, subtaskId } });
  };

  // Bulk Selections
  const toggleSelectTodo = (id: string) => {
    dispatch({ type: 'TOGGLE_SELECT_TODO', payload: { id } });
  };

  const selectAll = () => {
    dispatch({ type: 'SELECT_ALL', payload: sortedTodos.map(t => t.id) });
  };

  const clearSelection = () => {
    dispatch({ type: 'CLEAR_SELECTION', payload: undefined });
  };

  const bulkDelete = () => {
    dispatch({ type: 'BULK_DELETE', payload: undefined });
  };

  const bulkUpdateStatus = (status: TaskStatus) => {
    dispatch({
      type: 'BULK_UPDATE_STATUS',
      payload: { targetIds: state.selectedIds, updateValue: status }
    });
  };

  const bulkUpdatePriority = (priority: Priority) => {
    dispatch({
      type: 'BULK_UPDATE_PRIORITY',
      payload: { targetIds: state.selectedIds, updateValue: priority }
    });
  };

  // Filter & Sort Setters
  const setFilterStatus = (status: FilterStatus) => dispatch({ type: 'SET_FILTER_STATUS', payload: status });
  const setFilterCategory = (category: 'all' | CategoryTag) => dispatch({ type: 'SET_FILTER_CATEGORY', payload: category });
  const setFilterPriority = (priority: 'all' | Priority) => dispatch({ type: 'SET_FILTER_PRIORITY', payload: priority });
  const setSearchQuery = (query: string) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  const setSortOption = (sortBy: SortOption) => dispatch({ type: 'SET_SORT_OPTION', payload: sortBy });
  const toggleSortDirection = () => dispatch({ type: 'TOGGLE_SORT_DIRECTION', payload: undefined });

  // Stats calculation
  const totalCount = state.items.length;
  const completedCount = state.items.filter(t => t.status === 'completed').length;
  const inProgressCount = state.items.filter(t => t.status === 'in_progress').length;
  const backlogCount = state.items.filter(t => t.status === 'backlog').length;

  return {
    todos: sortedTodos,
    allTodos: state.items,
    selectedIds: state.selectedIds,
    filterStatus: state.filterStatus,
    filterCategory: state.filterCategory,
    filterPriority: state.filterPriority,
    searchQuery: state.searchQuery,
    sortBy: state.sortBy,
    sortDirection: state.sortDirection,
    stats: { totalCount, completedCount, inProgressCount, backlogCount },
    addTodo,
    editTodo,
    toggleTodo,
    updateStatus,
    deleteTodo,
    duplicateTodo,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    toggleSelectTodo,
    selectAll,
    clearSelection,
    bulkDelete,
    bulkUpdateStatus,
    bulkUpdatePriority,
    setFilterStatus,
    setFilterCategory,
    setFilterPriority,
    setSearchQuery,
    setSortOption,
    toggleSortDirection
  };
};
