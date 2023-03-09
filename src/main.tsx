import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GameProvider } from './hooks/useGameController/useGameController';
import './index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>,
)
