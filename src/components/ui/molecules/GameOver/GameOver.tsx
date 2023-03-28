import React from 'react';
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

  return (
    <div className='GameOver__Container vivify fadeInTop'>
      <FontAwesomeIcon className='GameOver__CloseButton' icon={faX} onClick={handleClose} />
      <Panel header='Game Over' headerColor='green'>
        {gameState === 'ended-white-win' && <p>White wins!</p>}
        {gameState === 'ended-black-win' && <p>Black wins!</p>}
        {gameState === 'ended-draw' && <p>Draw.</p>}
      </Panel>
    </div>
  );
};

export default GameOver;
