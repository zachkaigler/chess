import React from 'react';
import KnightIcon from '../../../pieces/KnightIcon/KnightIcon';
import './Loader.scss';

const Loader: React.FC = () => (
  <div className='Loader__Page'>
    <div className='Loader__IconContainer'>
      <KnightIcon color='white' />
    </div>
  </div>
);

export default Loader;
