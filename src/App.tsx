import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import { convertBoardToMatrix } from './game/game';
import BoardSquareTile from './components/board elements/BoardSquareTile/BoardSquareTile';
import { GameStates, useGameController } from './hooks/useGameController/useGameController';
import Modal from './components/ui/organisms/Modal/Modal';
import GameOver from './components/ui/molecules/GameOver/GameOver';
import './App.scss';

// TODO: websockets + backend for pvp play
// TODO: captured pieces show up to side and calculate score
// TODO: optimize rendering
// TODO: when a piece with a high cooldown captures a lower one, cooldown meter should jump to top and not slowly refill

function App() {
  const { game, gameState } = useGameController();
  const boardArray = convertBoardToMatrix(game);

  const gameOver = (
    gameState === GameStates.ENDED_WHITE_WIN
    || gameState === GameStates.ENDED_BLACK_WIN
    || gameState === GameStates.ENDED_DRAW
  );

  return (
    <div className="App">
      <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
        {gameOver && (
          <Modal>
            <GameOver />
          </Modal>
        )}
        <div className='Chess__BoardContainer'>
          <div className='Chess__Board'>
            {boardArray.map((square) => (
              <BoardSquareTile
                key={square.id}
                square={square}
              />
            ))}
          </div>
        </div>
      </DndProvider>
    </div>
  )
}

export default App
