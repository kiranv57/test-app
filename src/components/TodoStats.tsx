import React from 'react';
import { useTodos } from '../hooks/useTodos';

export const TodoStats: React.FC = () => {
  const { stats } = useTodos();

  const completionPercentage = stats.totalCount > 0
    ? Math.round((stats.completedCount / stats.totalCount) * 100)
    : 0;

  return (
    <div className="stats-summary">
      <div className="stat-card">
        <span className="stat-val">{stats.totalCount}</span>
        <span className="stat-label">Total Tasks</span>
      </div>
      <div className="stat-card">
        <span className="stat-val" style={{ color: '#93c5fd' }}>{stats.backlogCount}</span>
        <span className="stat-label">Backlog</span>
      </div>
      <div className="stat-card">
        <span className="stat-val" style={{ color: 'var(--accent-primary)' }}>{stats.inProgressCount}</span>
        <span className="stat-label">In Progress</span>
      </div>
      <div className="stat-card">
        <span className="stat-val" style={{ color: '#6ee7b7' }}>{stats.completedCount}</span>
        <span className="stat-label">Completed ({completionPercentage}%)</span>
      </div>
    </div>
  );
};
