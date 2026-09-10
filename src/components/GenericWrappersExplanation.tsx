import React from 'react';
import { BookOpen, Layers } from 'lucide-react';

export const GenericWrappersExplanation: React.FC = () => {
  return (
    <div className="explanation-card">
      <div className="explanation-title">
        <BookOpen size={20} />
        TypeScript Type System Reference Guide
      </div>

      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        A <strong>type</strong> defines the interface contract and member methods of a value. 
        A <strong>generic parameter</strong> (<code className="code-chip">&lt;T&gt;</code>) adds type specificity to reusable components, 
        specifying event targets, action payloads, or container element shapes.
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.85rem', color: 'var(--accent-secondary)' }}>
        <Layers size={16} />
        Type Classification & Generic Parameters in Application Architecture:
      </div>

      <table className="explanation-table">
        <thead>
          <tr>
            <th>Type Category</th>
            <th>Type Definition</th>
            <th>Generic Parameter &lt;T&gt;</th>
            <th>Application Implementation Site</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Framework DOM Event</strong></td>
            <td><code className="code-chip">React.FormEvent</code></td>
            <td>Element source submitting the form (<code className="code-chip">HTMLFormElement</code>)</td>
            <td><code className="code-chip">(e: React.FormEvent&lt;HTMLFormElement&gt;)</code></td>
          </tr>
          <tr>
            <td><strong>Framework Input Event</strong></td>
            <td><code className="code-chip">React.ChangeEvent</code></td>
            <td>Input element emitting value change (<code className="code-chip">HTMLInputElement</code>)</td>
            <td><code className="code-chip">(e: React.ChangeEvent&lt;HTMLInputElement&gt;)</code></td>
          </tr>
          <tr>
            <td><strong>State Action Payload</strong></td>
            <td><code className="code-chip">ActionWrapper</code></td>
            <td>Payload data shape riding inside action payload (<code className="code-chip">&#123; id: string, status: TaskStatus &#125;</code>)</td>
            <td><code className="code-chip">ActionWrapper&lt;'UPDATE_STATUS', &#123;id: string, status: TaskStatus&#125;&gt;</code></td>
          </tr>
          <tr>
            <td><strong>Bulk Operations Wrapper</strong></td>
            <td><code className="code-chip">BulkActionWrapper</code></td>
            <td>Target ID type (<code className="code-chip">string</code>) and value shape (<code className="code-chip">Priority</code>)</td>
            <td><code className="code-chip">BulkActionWrapper&lt;string, Priority&gt;</code></td>
          </tr>
          <tr>
            <td><strong>Filter Engine Spec</strong></td>
            <td><code className="code-chip">FilterConfig</code></td>
            <td>Target entity shape being filtered (<code className="code-chip">Todo</code>)</td>
            <td><code className="code-chip">FilterConfig&lt;Todo&gt;</code></td>
          </tr>
          <tr>
            <td><strong>State Slice Container</strong></td>
            <td><code className="code-chip">StateContainer</code></td>
            <td>Entity shape inside the container array (<code className="code-chip">Todo</code>)</td>
            <td><code className="code-chip">StateContainer&lt;Todo&gt;</code></td>
          </tr>
          <tr>
            <td><strong>TS Utility Transform</strong></td>
            <td><code className="code-chip">Partial</code></td>
            <td>Base interface shape whose keys become optional (<code className="code-chip">Todo</code>)</td>
            <td><code className="code-chip">FormDraft&lt;T&gt; = Partial&lt;T&gt;</code></td>
          </tr>
          <tr>
            <td><strong>TS Utility Record</strong></td>
            <td><code className="code-chip">Record</code></td>
            <td>Key type (<code className="code-chip">CategoryTag</code>) and Value style shape</td>
            <td><code className="code-chip">Record&lt;CategoryTag, BadgeStyle&gt;</code></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
