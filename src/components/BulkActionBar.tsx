import React from 'react';
import { Trash2, CheckCircle2, AlertOctagon, X } from 'lucide-react';
import { useTodos } from '../hooks/useTodos';
import { TaskStatus, Priority } from '../types/todo';

export const BulkActionBar: React.FC = () => {
  const {
    todos,
    selectedIds,
    selectAll,
    clearSelection,
    bulkDelete,
    bulkUpdateStatus,
    bulkUpdatePriority
  } = useTodos();

  if (selectedIds.length === 0) return null;

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))',
        border: '1px solid var(--accent-primary)',
        borderRadius: '12px',
        padding: '0.85rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        boxShadow: '0 8px 25px rgba(56, 189, 248, 0.2)',
        marginBottom: '1rem',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-primary)' }}>
          {selectedIds.length} Selected
        </span>
        <button
          className="tab-btn"
          onClick={selectAll}
          style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem' }}
        >
          Select All ({todos.length})
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <CheckCircle2 size={14} style={{ color: 'var(--text-muted)' }} />
          <select
            className="form-select"
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              if (e.target.value) {
                bulkUpdateStatus(e.target.value as TaskStatus);
                e.target.value = '';
              }
            }}
          >
            <option value="">Bulk Status...</option>
            <option value="backlog">Set to Backlog</option>
            <option value="in_progress">Set to In Progress</option>
            <option value="in_review">Set to In Review</option>
            <option value="completed">Set to Completed</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <AlertOctagon size={14} style={{ color: 'var(--text-muted)' }} />
          <select
            className="form-select"
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              if (e.target.value) {
                bulkUpdatePriority(e.target.value as Priority);
                e.target.value = '';
              }
            }}
          >
            <option value="">Bulk Priority...</option>
            <option value="low">Set to Low</option>
            <option value="medium">Set to Medium</option>
            <option value="high">Set to High</option>
          </select>
        </div>

        <button
          className="icon-btn delete"
          onClick={bulkDelete}
          style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', padding: '0.35rem 0.75rem', background: 'rgba(239, 68, 68, 0.2)' }}
        >
          <Trash2 size={14} />
          Delete Selected
        </button>

        <button
          className="icon-btn"
          onClick={clearSelection}
          title="Clear Selection"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};
