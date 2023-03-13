import React from 'react';
import { GameStates, useGameController } from '../../../../hooks/useGameController/useGameController';
import './GameOver.scss';

const GameOver: React.FC = () => {
  const { gameState } = useGameController();

  return (
    <div className='GameOver__Container vivify fadeInTop'>
      <section className='GameOver__Header'>
        <h1>gg</h1>
      </section>
      <section className='GameOver__Content'>
        {gameState === GameStates.ENDED_WHITE_WIN && <p>White wins.</p>}
        {gameState === GameStates.ENDED_BLACK_WIN && <p>Black wins.</p>}
        {gameState === GameStates.ENDED_DRAW && <p>Draw.</p>}
      </section>
    </div>
  );
};

export default GameOver;
