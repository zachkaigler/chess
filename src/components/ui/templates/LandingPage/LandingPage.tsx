import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../../../../hooks/useFirebase/useFirebase';
import BlockButton from '../../atoms/BlockButton/BlockButton';
import Panel from '../../molecules/Panel/Panel';
import './LandingPage.scss';

const LandingPage: React.FC = () => {
  const { createGame } = useFirebase();
  const navigate = useNavigate();

  const handleCreateGame = async () => {
    const gameId = await createGame();
    navigate(`/${gameId}`);
  };

  return (
    <div className='LandingPage__Container'>
      <div className='LandingPage__Main'>
        <section className='LandingPage__Header'>
          <h1>Chess 2</h1>
          <h3>Long awaited sequel to the 200 B.C. smash hit!</h3>
        </section>
        <section className='LandingPage__Content'>
          <Panel header='Exciting New Gameplay!' className='LandingPage__Panel' >
            <h4>Say goodbye to outdated features</h4>
            <p>
              Turns? Checkmate? So pre-Christ. We just got rid of 'em!
              Move your pieces whenever you want and capture your
              opponent's King to win! 
            </p>
            <h4>Modern game balancing sensibilities</h4>
            <p>
              Did you think we were just gonna let you throw your Queen
              around whenever you wanted? LOL. Pieces are balanced around
              a brand new cooldown system to ensure a peak competitive
              environment.
            </p>
            <h4>Fan favorite rules return</h4>
            <p>
              It's not all "out with the old, in with the new"! Pieces will
              still move just like you remember them. We also support en
              passant, castling, and promotion. 
            </p>
            <BlockButton label='Play Now' onClick={handleCreateGame} />
          </Panel>
          <div className='LandingPage__DemoContainer'>
          <video
            width="100%"
            height="100%"
            autoPlay
            loop
            muted
          >
            <source src='src/assets/demo.mp4' type='video/mp4' />
          </video>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
