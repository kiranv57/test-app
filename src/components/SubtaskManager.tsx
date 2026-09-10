import React, { useState } from 'react';
import { Plus, Trash2, CheckSquare } from 'lucide-react';
import { useTodos } from '../hooks/useTodos';
import { SubTask } from '../types/todo';

export const SubtaskManager: React.FC<{ todoId: string; subtasks: Array<SubTask> }> = ({ todoId, subtasks }) => {
  const { addSubtask, toggleSubtask, deleteSubtask } = useTodos();
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      addSubtask(todoId, newSubtaskTitle.trim());
      setNewSubtaskTitle('');
    }
  };

  const completedCount = subtasks.filter(st => st.completed).length;
  const progressPercent = subtasks.length > 0 ? Math.round((completedCount / subtasks.length) * 100) : 0;

  return (
    <div style={{ marginTop: '0.75rem', background: 'rgba(15, 23, 42, 0.4)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <CheckSquare size={12} />
          Subtasks ({completedCount}/{subtasks.length})
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
          {progressPercent}%
        </span>
      </div>

      {subtasks.length > 0 && (
        <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden', marginBottom: '0.75rem' }}>
          <div style={{ width: `${progressPercent}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-primary), #6ee7b7)', transition: 'width 0.3s ease' }} />
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {subtasks.map(subtask => (
          <div key={subtask.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: subtask.completed ? 'var(--text-muted)' : 'var(--text-primary)', textDecoration: subtask.completed ? 'line-through' : 'none' }}>
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={() => toggleSubtask(todoId, subtask.id)}
                style={{ accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
              />
              {subtask.title}
            </label>
            <button
              onClick={() => deleteSubtask(todoId, subtask.id)}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
              title="Delete subtask"
            >
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Add subtask..."
          style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
          value={newSubtaskTitle}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSubtaskTitle(e.target.value)}
        />
        <button
          type="submit"
          className="btn-submit"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
        >
          <Plus size={14} />
        </button>
      </form>
    </div>
  );
};
