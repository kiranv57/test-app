import React from 'react';
import { CheckSquare, Code2 } from 'lucide-react';

export const Header: React.FC<{ onToggleExplanation: () => void; showExplanation: boolean }> = ({
  onToggleExplanation,
  showExplanation
}) => {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-icon">
          <CheckSquare size={24} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h1 className="brand-title">Test App</h1>
            <span className="brand-tag">Corporate Todo Manager</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Client-Side Task Management • Docker Containerized Development
          </p>
        </div>
      </div>

      <button
        className={`btn-submit ${showExplanation ? 'active' : ''}`}
        onClick={onToggleExplanation}
        style={{
          background: showExplanation ? 'var(--bg-surface)' : undefined,
          color: showExplanation ? 'var(--accent-primary)' : undefined,
          border: '1px solid var(--border-color)',
          fontSize: '0.85rem'
        }}
      >
        <Code2 size={16} />
        {showExplanation ? 'Hide Type Guide' : 'TS Type Guide'}
      </button>
    </header>
  );
};
