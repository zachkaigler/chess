import { useCallback, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { generateBoard, BoardSquare, convertBoardToMatrix } from './board'
import BoardSquareTile from './components/board elements/BoardSquareTile/BoardSquareTile';
import { Pawn } from './pieces';
import './App.scss'

function App() {
  const { board } = generateBoard();
  const [game, setGame] = useState(board);
  const boardArray = convertBoardToMatrix(board);

  const movePiece = useCallback((piece: Pawn, targetSquare: BoardSquare) => {
    setGame({
      ...game,
      [piece.currentSqr]: {
        ...game[piece.currentSqr],
        piece: undefined,
      },
      [targetSquare.id]: {
        ...targetSquare,
        piece,
      }
    })
    piece.currentSqr = targetSquare.id;
  }, [game, setGame]);

  return (
    <div className="App">
      <DndProvider backend={HTML5Backend}>
        <div className='Chess__Board'>
          {boardArray.map((square) => (
            <BoardSquareTile
              key={square.id}
              square={square}
              board={board}
              movePiece={movePiece}
            />
          ))}
        </div>
      </DndProvider>
    </div>
  )
}

export default App
