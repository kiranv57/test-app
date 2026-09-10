import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useTodos } from '../hooks/useTodos';
import { TodoItem } from './TodoItem';
import { BulkActionBar } from './BulkActionBar';

export const TodoList: React.FC = () => {
  const { todos } = useTodos();

  return (
    <div>
      <BulkActionBar />

      {todos.length === 0 ? (
        <div className="glass-panel empty-state">
          <CheckCircle2 size={48} style={{ opacity: 0.4 }} />
          <h3 style={{ color: 'var(--text-primary)', fontWeight: 600 }}>No tasks match your criteria</h3>
          <p style={{ fontSize: '0.875rem' }}>Try clearing filters or search keywords.</p>
        </div>
      ) : (
        <div className="todo-list">
          {todos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      )}
    </div>
  );
};
