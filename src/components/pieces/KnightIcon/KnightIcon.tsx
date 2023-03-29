import React from 'react';
import { ChildIconProps } from '../PieceIcon/PieceIcon';
import BlackKnight from './BlackKnight.svg';
import WhiteKnight from './WhiteKnight.svg'

const KnightIcon: React.FC<ChildIconProps> = ({ color, dragRef, ...props }) => {
  if (color === 'black') return (
    <div style={{ width: '85%', height: '85%', ...props.style  }} ref={dragRef}>
      <BlackKnight />
    </div>
  );

  return (
    <div style={{ width: '85%', height: '85%', ...props.style  }} ref={dragRef}>
      <WhiteKnight />
    </div>
  );
};

export default KnightIcon;
