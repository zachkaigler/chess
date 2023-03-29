import React, { useState, useEffect } from 'react';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useGameController } from '../../../../hooks/useGameController/useGameController';
import Panel from '../Panel/Panel';
import './GameOver.scss';

interface GameOverProps {
  handleClose(): void;
}

const GameOver: React.FC<GameOverProps> = ({ handleClose }) => {
  const { gameState } = useGameController();
  const [gameStateOnMount, setGameStateOnMount] = useState<"not-started" | "playing" | "ended-white-win" | "ended-black-win" | "ended-draw" | undefined | null>(null)

  useEffect(() => {
    setGameStateOnMount(gameState);
  }, [])

  if (!gameStateOnMount) return null;

  return (
    <div className='GameOver__Container vivify fadeInTop'>
      <FontAwesomeIcon className='GameOver__CloseButton' icon={faX} onClick={handleClose} />
      <Panel header='Game Over' headerColor='green'>
        {gameStateOnMount === 'ended-white-win' && <p>White wins!</p>}
        {gameStateOnMount === 'ended-black-win' && <p>Black wins!</p>}
        {gameStateOnMount === 'ended-draw' && <p>Draw.</p>}
      </Panel>
    </div>
  );
};

export default GameOver;
