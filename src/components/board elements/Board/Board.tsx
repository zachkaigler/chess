import React, { useState } from 'react';
import { convertBoardToMatrix } from '../../../game/game';
import { useFirebase } from '../../../hooks/useFirebase/useFirebase';
import { useGameController, GameStates } from '../../../hooks/useGameController/useGameController';
import GameOver from '../../ui/molecules/GameOver/GameOver';
import Menu from '../../ui/organisms/Menu/Menu';
import Modal from '../../ui/organisms/Modal/Modal';
import BoardSquareTile from '../BoardSquareTile/BoardSquareTile';
import './Board.scss';

const Board: React.FC = () => {
  const { myColor } = useFirebase();
  const { game, gameState } = useGameController();
  const boardArray = convertBoardToMatrix(game);

  const [showMenu, setShowMenu] = useState(false);

  const gameOver = (
    gameState === GameStates.ENDED_WHITE_WIN
    || gameState === GameStates.ENDED_BLACK_WIN
    || gameState === GameStates.ENDED_DRAW
  );

  return (
    <>
      {gameOver && (
        <Modal>
          <GameOver />
        </Modal>
      )}
      {showMenu && (
        <Modal>
          <Menu closeMenu={() => setShowMenu(false)} />
        </Modal>
      )}
      <div className={`Chess__BoardContainer ${myColor}`}>
        <div className='Chess__Board'>
          {boardArray.map((square) => (
            <BoardSquareTile
              key={square.id}
              square={square}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Board;
