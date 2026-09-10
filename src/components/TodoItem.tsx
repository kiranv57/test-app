import React, { useState } from 'react';
import { Trash2, Edit3, Check, X, Calendar, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { useTodos } from '../hooks/useTodos';
import { Todo, Priority, TaskStatus, CategoryTag, PriorityBadgeMap, StatusBadgeMap, CategoryBadgeMap } from '../types/todo';
import { SubtaskManager } from './SubtaskManager';

const PRIORITY_MAP: PriorityBadgeMap = {
  high: { label: 'High', bgClass: 'high', textClass: 'high' },
  medium: { label: 'Medium', bgClass: 'medium', textClass: 'medium' },
  low: { label: 'Low', bgClass: 'low', textClass: 'low' }
};

const STATUS_MAP: StatusBadgeMap = {
  backlog: { label: 'Backlog', bgClass: 'status-backlog', textClass: 'status-backlog' },
  in_progress: { label: 'In Progress', bgClass: 'status-progress', textClass: 'status-progress' },
  in_review: { label: 'In Review', bgClass: 'status-review', textClass: 'status-review' },
  completed: { label: 'Completed', bgClass: 'status-completed', textClass: 'status-completed' }
};

const CATEGORY_MAP: CategoryBadgeMap = {
  work: { label: 'Work', bgClass: 'cat-work', textClass: 'cat-work' },
  personal: { label: 'Personal', bgClass: 'cat-personal', textClass: 'cat-personal' },
  devops: { label: 'DevOps', bgClass: 'cat-devops', textClass: 'cat-devops' },
  architecture: { label: 'Architecture', bgClass: 'cat-architecture', textClass: 'cat-architecture' },
  feature: { label: 'Feature', bgClass: 'cat-feature', textClass: 'cat-feature' }
};

export const TodoItem: React.FC<{ todo: Todo }> = ({ todo }) => {
  const {
    toggleTodo,
    updateStatus,
    deleteTodo,
    editTodo,
    duplicateTodo,
    selectedIds,
    toggleSelectTodo
  } = useTodos();

  const [isEditing, setIsEditing] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);

  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);
  const [editCategory, setEditCategory] = useState<CategoryTag>(todo.category);
  const [editStatus, setEditStatus] = useState<TaskStatus>(todo.status);
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || '');

  const isSelected = selectedIds.includes(todo.id);

  const handleSave = () => {
    if (editTitle.trim()) {
      editTodo(
        todo.id,
        editTitle.trim(),
        editDescription.trim() || undefined,
        editPriority,
        editCategory,
        editStatus,
        editDueDate || undefined
      );
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setEditPriority(todo.priority);
    setEditCategory(todo.category);
    setEditStatus(todo.status);
    setEditDueDate(todo.dueDate || '');
    setIsEditing(false);
  };

  return (
    <div className={`todo-item ${todo.status === 'completed' ? 'completed' : ''} ${isSelected ? 'selected' : ''}`}>
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={isSelected}
        onChange={() => toggleSelectTodo(todo.id)}
        title="Select for bulk action"
        style={{ marginRight: '0.25rem' }}
      />

      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.status === 'completed'}
        onChange={() => toggleTodo(todo.id)}
        title="Toggle complete status"
      />

      <div className="todo-content">
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              type="text"
              className="form-input"
              value={editTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditTitle(e.target.value)}
            />
            <input
              type="text"
              className="form-input"
              placeholder="Description..."
              value={editDescription}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditDescription(e.target.value)}
            />
            <div className="input-row">
              <select
                className="form-select"
                value={editStatus}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditStatus(e.target.value as TaskStatus)}
              >
                <option value="backlog">Backlog</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="completed">Completed</option>
              </select>
              <select
                className="form-select"
                value={editCategory}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditCategory(e.target.value as CategoryTag)}
              >
                <option value="work">Work</option>
                <option value="personal">Personal</option>
                <option value="devops">DevOps</option>
                <option value="architecture">Architecture</option>
                <option value="feature">Feature</option>
              </select>
              <select
                className="form-select"
                value={editPriority}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditPriority(e.target.value as Priority)}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>
        ) : (
          <>
            <div className="todo-title-row">
              <span className="todo-title">{todo.title}</span>

              <select
                className={`priority-badge ${STATUS_MAP[todo.status].bgClass}`}
                value={todo.status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateStatus(todo.id, e.target.value as TaskStatus)}
                style={{ cursor: 'pointer', outline: 'none', border: 'none' }}
              >
                <option value="backlog">Backlog</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="completed">Completed</option>
              </select>

              <span className={`priority-badge ${CATEGORY_MAP[todo.category].bgClass}`}>
                {CATEGORY_MAP[todo.category].label}
              </span>

              <span className={`priority-badge ${PRIORITY_MAP[todo.priority].bgClass}`}>
                {PRIORITY_MAP[todo.priority].label}
              </span>
            </div>

            {todo.description && (
              <p className="todo-description">{todo.description}</p>
            )}

            <div className="todo-meta">
              <span>Created {new Date(todo.createdAt).toLocaleDateString()}</span>
              {todo.dueDate && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#38bdf8' }}>
                  <Calendar size={12} />
                  Due {new Date(todo.dueDate).toLocaleDateString()}
                </span>
              )}
              {todo.subtasks.length > 0 && (
                <button
                  onClick={() => setShowSubtasks(!showSubtasks)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem', fontWeight: 600 }}
                >
                  {todo.subtasks.filter(s => s.completed).length}/{todo.subtasks.length} Subtasks
                  {showSubtasks ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              )}
            </div>

            {showSubtasks && (
              <SubtaskManager todoId={todo.id} subtasks={todo.subtasks} />
            )}
          </>
        )}
      </div>

      <div className="todo-actions">
        {isEditing ? (
          <>
            <button className="icon-btn" onClick={handleSave} title="Save changes">
              <Check size={18} style={{ color: '#6ee7b7' }} />
            </button>
            <button className="icon-btn" onClick={handleCancel} title="Cancel editing">
              <X size={18} style={{ color: '#fca5a5' }} />
            </button>
          </>
        ) : (
          <>
            <button className="icon-btn" onClick={() => setShowSubtasks(!showSubtasks)} title="Subtasks">
              <ChevronDown size={16} />
            </button>
            <button className="icon-btn" onClick={() => duplicateTodo(todo.id)} title="Clone / Duplicate Task">
              <Copy size={15} />
            </button>
            <button className="icon-btn" onClick={() => setIsEditing(true)} title="Edit Task">
              <Edit3 size={15} />
            </button>
            <button className="icon-btn delete" onClick={() => deleteTodo(todo.id)} title="Delete Task">
              <Trash2 size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
