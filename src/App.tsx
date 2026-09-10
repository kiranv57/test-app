import { useState } from 'react';
import { TodoProvider } from './context/TodoContext';
import { Header } from './components/Header';
import { TodoInput } from './components/TodoInput';
import { TodoStats } from './components/TodoStats';
import { TodoFilter } from './components/TodoFilter';
import { TodoList } from './components/TodoList';
import { GenericWrappersExplanation } from './components/GenericWrappersExplanation';

export function App() {
  const [showExplanation, setShowExplanation] = useState(true);

  return (
    <TodoProvider>
      <div className="app-container">
        <Header
          onToggleExplanation={() => setShowExplanation(prev => !prev)}
          showExplanation={showExplanation}
        />

        {showExplanation && <GenericWrappersExplanation />}

        <TodoStats />
        <TodoInput />
        <TodoFilter />
        <TodoList />
      </div>
    </TodoProvider>
  );
}

export default App;
