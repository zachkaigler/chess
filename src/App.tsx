import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import { convertBoardToMatrix } from './board';
import BoardSquareTile from './components/board elements/BoardSquareTile/BoardSquareTile';
import { useGameController } from './hooks/useGameController/useGameController';
import './App.scss'

// TODO: when a king is captured, end the game
// TODO: websockets + backend for pvp play
// TODO: pawn promotion, en passant, castling
// TODO: optimize rendering -> every action is causing 2 rerenders for some reason
// TODO: when a piece with a high cooldown captures a lower one, cooldown meter should jump to top and not slowly refill

function App() {
  const { game } = useGameController();
  const boardArray = convertBoardToMatrix(game);
  return (
    <div className="App">
      <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
        <div className='Chess__Board'>
          {boardArray.map((square) => (
            <BoardSquareTile
              key={square.id}
              square={square}
            />
          ))}
        </div>
      </DndProvider>
    </div>
  )
}

export default App
