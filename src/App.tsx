import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import { convertBoardToMatrix } from './board';
import BoardSquareTile from './components/board elements/BoardSquareTile/BoardSquareTile';
import { useGameController } from './hooks/useGameController/useGameController';
import './App.scss'

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
