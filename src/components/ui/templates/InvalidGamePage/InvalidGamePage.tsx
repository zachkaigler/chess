import React from 'react';
import { useNavigate } from 'react-router-dom';
import KnightIcon from '../../../pieces/KnightIcon/KnightIcon';
import BlockButton from '../../atoms/BlockButton/BlockButton';
import './InvalidGamePage.scss';

const InvalidGamePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className='InvalidGamePage__Page'>
      <div className='InvalidGamePage__Main'>
        <div className='InvalidGamePage__BG'>
          <KnightIcon color='white' />
        </div>
        <h1>Invalid game.</h1>
      </div>
      <div className='InvalidGamePage__ButtonContainer'>
        <BlockButton label='Back Home' onClick={() => navigate('/')} />
      </div>
    </div>
  );
};

export default InvalidGamePage;
