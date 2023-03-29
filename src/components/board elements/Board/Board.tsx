import React, { useEffect, useState } from 'react';
import { faCheck, faCopy, faHouse, faRetweet } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from 'react-router-dom';
import { convertBoardToMatrix } from '../../../game/game';
import { useCssTransition } from '../../../hooks/useCssTransition/useCssTransition';
import { useFirebase } from '../../../hooks/useFirebase/useFirebase';
import { useGameController } from '../../../hooks/useGameController/useGameController';
import IconButton from '../../ui/atoms/IconButton/IconButton';
import GameOver from '../../ui/molecules/GameOver/GameOver';
import Modal from '../../ui/organisms/Modal/Modal';
import BoardSquareTile from '../BoardSquareTile/BoardSquareTile';
import { useAlert } from '../../../hooks/useTools/useTools';
import './Board.scss';

const Board: React.FC = () => {
  const {
    myColor,
    togglePlayerReady,
    blackPlayer,
    whitePlayer,
    invalidGame,
    cleanUpGame,
    bothPlayersReady,
    countdown,
    currentGame,
  } = useFirebase();
  const navigate = useNavigate();
  const { game: gameId } = useParams();
  const { renderAlert } = useAlert();

  const { game, gameOver, resetBoard } = useGameController();
  const boardArray = convertBoardToMatrix(game);

  const myPlayer = myColor === 'white' ? whitePlayer : blackPlayer;
  const opposingPlayer = myColor === 'white' ? blackPlayer : whitePlayer;

  const parseCountdown = (): string | null => {
    if (!bothPlayersReady || currentGame?.status !== 'not-started' || countdown === -1) return null;
    if (countdown === 0) return 'Go!'
    return countdown.toString();
  }

  const countdownValue = parseCountdown();

  const [cleaningUp, setCleaningUp] = useState(false);

  const cleanUp = async () => {
    await cleanUpGame();
    resetBoard(gameId!);
  };

  const goHome = async () => {
    setCleaningUp(true);
    await cleanUp();
    navigate('/');
    setCleaningUp(false);
  };

  const [showGameOverModal, setShowGameOverModal] = useState<boolean>(false);

  useEffect(() => {
    if (gameOver) setShowGameOverModal(true);
  }, [gameOver])

  const resetGame = () => {
    if (!gameOver) return;
    if (showGameOverModal) setShowGameOverModal(false);
    resetBoard(gameId!);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    renderAlert('Challenge link copied to clipboard!');
  };

  const getOpposingPlayerStatus = () => {
    if (opposingPlayer && !opposingPlayer.ready) return 'online';
    if (opposingPlayer && opposingPlayer.ready) return 'ready';
    return 'offline';
  };

  const opposingPlayerStatus = getOpposingPlayerStatus();

  interface ActionButtons {
    [key: string]: {
      key: string;
      icon: React.ReactNode;
      handleClick(): void;
      active: boolean;
      highlight: boolean;
      description: string;
      disabled: boolean;
    }
  }

  const buttonOpts: ActionButtons = {
    ready: {
      key: 'ready',
      icon: <FontAwesomeIcon icon={faCheck} />,
      handleClick: () => togglePlayerReady(myColor),
      active: !!(myPlayer?.ready),
      highlight: true,
      description: 'Ready to Start',
      disabled: false,
    },
    copy: {
      key: 'copy',
      icon: <FontAwesomeIcon icon={faCopy} />,
      handleClick: copyLink,
      highlight: false,
      active: false,
      description: 'Copy Challenge Link',
      disabled: false,
    },
    reset: {
      key: 'reset',
      icon: <FontAwesomeIcon icon={faRetweet} />,
      handleClick: resetGame,
      highlight: false,
      active: false,
      description: 'Reset Game',
      disabled: !gameOver,
    },
    home: {
      key: 'home',
      icon: <FontAwesomeIcon icon={faHouse} />,
      handleClick: goHome,
      highlight: false,
      active: false,
      description: 'Return Home',
      disabled: false,
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
      disabled={button.disabled}
      highlight={button.highlight}
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
  if (invalidGame && !cleaningUp) return <p style={{ color: 'white' }}>Invalid game.</p>

  return (
    <>
      {showGameOverModal && (
        <Modal>
          <GameOver handleClose={() => setShowGameOverModal(false)} />
        </Modal>
      )}
      {countdownValue && (
        <Modal>
          <h1 className='Board__Countdown'>{countdownValue}</h1>
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
          <div className={`Chess__Board ${showGameOverModal || countdownValue ? 'inactive' : ''}`}>
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
