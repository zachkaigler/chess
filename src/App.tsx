import { Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import GameWrapper from './components/board elements/GameWrapper/GameWrapper';
import Board from './components/board elements/Board/Board';
import LandingPage from './components/ui/templates/LandingPage/LandingPage';
import './App.scss';

// BUG: sometimes rooks randomly cover up other pieces? (safari only???? -> TODO: show message on non chrome browsers)
// TODO: style invalid game screen, game over modal
// TODO: redesign pieces
// TODO: record demo for landing page
// TODO: fix orientation of black promotion panel
// TODO: display opponents cooldown (do this locally, not via firebase)
// TODO: optimize rendering
// TODO: when a piece with a high cooldown captures a lower one, cooldown meter should jump to top and not slowly refill

const withGameWrapper = (component: React.ReactNode) => (
  <GameWrapper>
    {component}
  </GameWrapper>
);

function App() {
  return (
    <div className='App'>
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
