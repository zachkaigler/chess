import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import { convertBoardToMatrix } from './board';
import BoardSquareTile from './components/board elements/BoardSquareTile/BoardSquareTile';
import { useGameController } from './hooks/useGameController/useGameController';
import './App.scss'

// TODO: pawn movement and capturing gets wonky towards end of board
// TODO: capturing a piece on cooldown needs to reeset that square's cooldown timer to the new piece
// TODO: when a king is captured, end the game
// TODO: websockets + backend for pvp play
// TODO: pawn promotion, en passant, castling

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
