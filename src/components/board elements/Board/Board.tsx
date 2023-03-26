import { faCheck, faCopy, faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { convertBoardToMatrix } from '../../../game/game';
import { useFirebase } from '../../../hooks/useFirebase/useFirebase';
import { useGameController, GameStates } from '../../../hooks/useGameController/useGameController';
import IconButton from '../../ui/atoms/IconButton/IconButton';
import GameOver from '../../ui/molecules/GameOver/GameOver';
import Menu from '../../ui/organisms/Menu/Menu';
import Modal from '../../ui/organisms/Modal/Modal';
import BoardSquareTile from '../BoardSquareTile/BoardSquareTile';
import './Board.scss';

const Board: React.FC = () => {
  const { myColor, togglePlayerReady, blackPlayer, whitePlayer, invalidGame } = useFirebase();
  const navigate = useNavigate();
  const { game, gameState } = useGameController();
  const boardArray = convertBoardToMatrix(game);

  const [showMenu, setShowMenu] = useState(false);

  const myPlayer = myColor === 'white' ? whitePlayer : blackPlayer;
  const opposingPlayer = myColor === 'white' ? blackPlayer : whitePlayer;

  const getOpposingPlayerStatus = () => {
    if (opposingPlayer && !opposingPlayer.ready) return 'online';
    if (opposingPlayer && opposingPlayer.ready) return 'ready';
    return 'offline';
  };

  const gameOver = (
    gameState === GameStates.ENDED_WHITE_WIN
    || gameState === GameStates.ENDED_BLACK_WIN
    || gameState === GameStates.ENDED_DRAW
  );

  // TODO: make this look nice
  if (invalidGame) return <p style={{ color: 'white' }}>Invalid game.</p>

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
      <div className='Board__Page'>
        <div className={`Chess__BoardContainer ${myColor}`}>
          <div className={`Board__ActionsContainer top ${myColor === 'black' ? 'black' : ''}`}>
            { myColor === 'white' && <div className={`Board__StatusIndicator ${getOpposingPlayerStatus()}`} />}
            { myColor === 'black' && (
              <>
                <IconButton
                  icon={<FontAwesomeIcon icon={faCheck} />}
                  onClick={() => togglePlayerReady(myColor)}
                  active={myPlayer?.ready}
                />
                <IconButton icon={<FontAwesomeIcon icon={faCopy} />} />
                <IconButton
                  icon={<FontAwesomeIcon icon={faHouse} />}
                  onClick={() => navigate('/')}
                />
              </>
            )}
          </div>
          <div className='Chess__Board'>
            {boardArray.map((square) => (
              <BoardSquareTile
                key={square.id}
                square={square}
              />
            ))}
          </div>
          <div className='Board__ActionsContainer bottom'>
            { myColor === 'black' && <div className={`Board__StatusIndicator ${getOpposingPlayerStatus()}`} />}
            { myColor === 'white' && (
              <>
                <IconButton
                  icon={<FontAwesomeIcon icon={faCheck} />}
                  onClick={() => togglePlayerReady(myColor)}
                  active={myPlayer?.ready}
                />
                <IconButton icon={<FontAwesomeIcon icon={faCopy} />} />
                <IconButton
                  icon={<FontAwesomeIcon icon={faHouse} />}
                  onClick={() => navigate('/')}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Board;
