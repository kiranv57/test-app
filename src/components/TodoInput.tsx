import React, { useState } from 'react';
import { Plus, AlertCircle, Tag, ListPlus } from 'lucide-react';
import { useTodos } from '../hooks/useTodos';
import { Priority, CategoryTag, TaskStatus } from '../types/todo';

export const TodoInput: React.FC = () => {
  const { addTodo } = useTodos();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<CategoryTag>('work');
  const [status, setStatus] = useState<TaskStatus>('backlog');
  const [dueDate, setDueDate] = useState('');
  const [subtasksInput, setSubtasksInput] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [error, setError] = useState('');

  /**
   * Framework DOM Event Handler:
   * React.FormEvent<HTMLFormElement>
   */
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Todo title cannot be empty.');
      return;
    }

    const subtaskTitles = subtasksInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    addTodo(
      title.trim(),
      description.trim() || undefined,
      priority,
      category,
      status,
      dueDate || undefined,
      subtaskTitles
    );

    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategory('work');
    setStatus('backlog');
    setDueDate('');
    setSubtasksInput('');
    setError('');
  };

  return (
    <div className="glass-panel">
      <form onSubmit={handleSubmit} className="todo-form">
        <div className="input-row">
          <input
            type="text"
            className="form-input"
            placeholder="Add a new task..."
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setTitle(e.target.value);
              if (error) setError('');
            }}
          />

          <select
            className="form-select"
            value={category}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCategory(e.target.value as CategoryTag)}
          >
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="devops">DevOps</option>
            <option value="architecture">Architecture</option>
            <option value="feature">Feature</option>
          </select>

          <select
            className="form-select"
            value={priority}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPriority(e.target.value as Priority)}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <button type="submit" className="btn-submit">
            <Plus size={18} />
            Add Task
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            className="tab-btn"
            onClick={() => setShowMore(!showMore)}
            style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem' }}
          >
            {showMore ? '- Simple Mode' : '+ Add Description & Subtasks'}
          </button>
        </div>

        {showMore && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Detailed description..."
              value={description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
            />

            <div className="input-row">
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ListPlus size={16} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Subtasks (comma separated, e.g. Design UI, Write tests)..."
                  value={subtasksInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubtasksInput(e.target.value)}
                />
              </div>

              <select
                className="form-select"
                value={status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as TaskStatus)}
              >
                <option value="backlog">Backlog</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="completed">Completed</option>
              </select>

              <input
                type="date"
                className="form-input"
                style={{ maxWidth: '170px' }}
                value={dueDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value)}
              />
            </div>
          </div>
        )}

        {error && (
          <div style={{ color: '#fca5a5', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertCircle size={14} />
            {error}
          </div>
        )}
      </form>
    </div>
  );
};
