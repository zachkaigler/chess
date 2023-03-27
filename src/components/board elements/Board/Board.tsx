import { faCheck, faCopy, faHouse } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { convertBoardToMatrix } from '../../../game/game';
import { useCssTransition } from '../../../hooks/useCssTransition/useCssTransition';
import { useFirebase } from '../../../hooks/useFirebase/useFirebase';
import { useGameController, GameStates } from '../../../hooks/useGameController/useGameController';
import IconButton from '../../ui/atoms/IconButton/IconButton';
import GameOver from '../../ui/molecules/GameOver/GameOver';
import Modal from '../../ui/organisms/Modal/Modal';
import BoardSquareTile from '../BoardSquareTile/BoardSquareTile';
import './Board.scss';

const Board: React.FC = () => {
  const { myColor, togglePlayerReady, blackPlayer, whitePlayer, invalidGame } = useFirebase();
  const navigate = useNavigate();
  const { game, gameState } = useGameController();
  const boardArray = convertBoardToMatrix(game);

  const myPlayer = myColor === 'white' ? whitePlayer : blackPlayer;
  const opposingPlayer = myColor === 'white' ? blackPlayer : whitePlayer;

  const getOpposingPlayerStatus = () => {
    if (opposingPlayer && !opposingPlayer.ready) return 'online';
    if (opposingPlayer && opposingPlayer.ready) return 'ready';
    return 'offline';
  };

  const opposingPlayerStatus = getOpposingPlayerStatus();

  const gameOver = (
    gameState === GameStates.ENDED_WHITE_WIN
    || gameState === GameStates.ENDED_BLACK_WIN
    || gameState === GameStates.ENDED_DRAW
  );

  interface ActionButtons {
    [key: string]: {
      key: string;
      icon: React.ReactNode;
      handleClick(): void;
      active: boolean;
      description: string;
    }
  }

  const buttonOpts: ActionButtons = {
    ready: {
      key: 'ready',
      icon: <FontAwesomeIcon icon={faCheck} />,
      handleClick: () => togglePlayerReady(myColor),
      active: !!(myPlayer?.ready),
      description: 'Ready to Start'
    },
    copy: {
      key: 'copy',
      icon: <FontAwesomeIcon icon={faCopy} />,
      handleClick: () => console.log('copied url'),
      active: false,
      description: 'Copy Challenge Link'
    },
    home: {
      key: 'home',
      icon: <FontAwesomeIcon icon={faHouse} />,
      handleClick: () => navigate('/'),
      active: false,
      description: 'Back to Home'
    },
  };

  const [activeTip, setActiveTip] = useState<string | null>(null);

  const {
    cn,
    styles,
    showComponent: showTip,
    hideComponent: hideTip,
  } = useCssTransition({
    transitionDurationMs: 500,
    transitionInClassName: 'visible',
    transitionOutClassName: 'hidden',
    additionalClassNames: [
      'Board__ActionTip',
    ],
  });

  const buttons = Object.values(buttonOpts).map((button) => (
    <IconButton
      key={button.key}
      icon={button.icon}
      onClick={button.handleClick}
      active={button.active}
      onMouseOver={() => {
        if (activeTip === button.description) return;
        setActiveTip(button.description);
        showTip();
      }}
      onMouseLeave={() => {
        setActiveTip(null);
        hideTip();
      }}
    />
  ));

  // TODO: make this look nice
  if (invalidGame) return <p style={{ color: 'white' }}>Invalid game.</p>

  return (
    <>
      {gameOver && (
        <Modal>
          <GameOver />
        </Modal>
      )}
      <div className='Board__Page'>
        <div className={`Chess__BoardContainer ${myColor}`}>
          <div className={`Board__ActionsContainer top ${myColor === 'black' ? 'black' : ''}`}>
            { myColor === 'white' && (
              <div className={`Board__StatusIndicator ${opposingPlayerStatus}`}>
                {opposingPlayerStatus === 'ready' && <FontAwesomeIcon icon={faCheck} />}
              </div>
            )}
            { myColor === 'black' && <>{buttons}</> }
            { myColor === 'black' && <p className={cn} style={styles}>{activeTip}</p> }
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
            { myColor === 'black' && (
              <div className={`Board__StatusIndicator black ${opposingPlayerStatus}`}>
                {opposingPlayerStatus === 'ready' && <FontAwesomeIcon icon={faCheck} />}
              </div>
            )}
            { myColor === 'white' && <>{buttons}</> }
            {/* TODO: these tips jack up spacing when screen is small. fix */}
            {/* TODO: transition out isn't working */}
            { myColor === 'white' && <p className={cn} style={styles}>{activeTip}</p> }
          </div>
        </div>
      </div>
    </>
  );
};

export default Board;
