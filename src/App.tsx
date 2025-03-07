import React from 'react';
import AppRouter from './routes/AppRouter';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="app">
      <main>
        <AppRouter />
      </main>
    </div>
  );
};

export default App;