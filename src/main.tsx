import ReactDOM from 'react-dom/client';
import App from './App';
import { FirebaseProvider } from './hooks/useFirebase/useFirebase';
import { GameProvider } from './hooks/useGameController/useGameController';
import './index.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <FirebaseProvider>
    <GameProvider>
      <App />
    </GameProvider>
  </FirebaseProvider>
)
