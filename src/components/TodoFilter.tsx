import React from 'react';
import { Search, ArrowUpDown, Filter, Tag, AlertOctagon } from 'lucide-react';
import { useTodos } from '../hooks/useTodos';
import { FilterStatus, CategoryTag, Priority, SortOption } from '../types/todo';

export const TodoFilter: React.FC = () => {
  const {
    filterStatus,
    filterCategory,
    filterPriority,
    searchQuery,
    sortBy,
    sortDirection,
    setFilterStatus,
    setFilterCategory,
    setFilterPriority,
    setSearchQuery,
    setSortOption,
    toggleSortDirection
  } = useTodos();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div className="controls-bar">
        <div className="search-box">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.2rem' }}
              placeholder="Search tasks, descriptions, tags, subtasks..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="filter-tabs">
          {(['all', 'backlog', 'in_progress', 'in_review', 'completed'] as FilterStatus[]).map(status => (
            <button
              key={status}
              className={`tab-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'in_progress' ? 'In Progress' : status === 'in_review' ? 'In Review' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Tag size={14} style={{ color: 'var(--text-muted)' }} />
            <select
              className="form-select"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
              value={filterCategory}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilterCategory(e.target.value as 'all' | CategoryTag)
              }
            >
              <option value="all">All Categories</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="devops">DevOps</option>
              <option value="architecture">Architecture</option>
              <option value="feature">Feature</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <AlertOctagon size={14} style={{ color: 'var(--text-muted)' }} />
            <select
              className="form-select"
              style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
              value={filterPriority}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFilterPriority(e.target.value as 'all' | Priority)
              }
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ArrowUpDown size={14} style={{ color: 'var(--text-muted)' }} />
          <select
            className="form-select"
            style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
            value={sortBy}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSortOption(e.target.value as SortOption)
            }
          >
            <option value="createdAt">Date Created</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority Level</option>
            <option value="alphabetical">Alphabetical (A-Z)</option>
            <option value="progress">Subtask Progress</option>
          </select>

          <button
            className="tab-btn"
            onClick={toggleSortDirection}
            title="Toggle sort direction"
            style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
          >
            {sortDirection === 'desc' ? 'Desc ↓' : 'Asc ↑'}
          </button>
        </div>
      </div>
    </div>
  );
};
