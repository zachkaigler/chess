import { Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import GameWrapper from './components/board elements/GameWrapper/GameWrapper';
import Board from './components/board elements/Board/Board';
import LandingPage from './components/ui/templates/LandingPage/LandingPage';
import Alert from './hooks/useTools/useTools';
import './App.scss';

// BUG: sometimes rooks randomly cover up other pieces? (safari only???? -> TODO: show message on non chrome browsers)
// TODO: on each move, post snapshot of full board to firebase. if user leaves and rejoins mid game, update game state w/ snapshot
// TODO: show modal when user is not on chrome
// TODO: optimize rendering

const withGameWrapper = (component: React.ReactNode) => (
  <GameWrapper>
    {component}
  </GameWrapper>
);

function App() {
  return (
    <div className='App'>
      <Alert />
      <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
        <div className='App__BoardContainer'>
          <Routes>
            <Route path='/' element={withGameWrapper(<LandingPage />)} />
            <Route path='/:game' element={withGameWrapper(<Board />)} />
          </Routes>
        </div>
      </DndProvider>
    </div>
  );
};

export default App;
