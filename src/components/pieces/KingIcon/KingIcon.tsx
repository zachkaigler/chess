import React from 'react';
import { ChildIconProps } from '../PieceIcon/PieceIcon';
import BlackKing from './BlackKing.svg';
import WhiteKing from './WhiteKing.svg';

const KingIcon: React.FC<ChildIconProps> = ({ color, dragRef, ...props }) => {
  if (color === 'black') return (
    <div style={{ width: '85%', height: '85%', ...props.style  }} ref={dragRef}>
      <BlackKing />
    </div>
  );

  return (
    <div style={{ width: '85%', height: '85%', ...props.style  }} ref={dragRef}>
      <WhiteKing />
    </div>
  );
};

export default KingIcon;
