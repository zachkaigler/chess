import React from 'react';
import { ChildIconProps } from '../PieceIcon/PieceIcon';
import BlackBishop from './BlackBishop.svg';
import WhiteBishop from './WhiteBishop.svg';

const BishopIcon: React.FC<ChildIconProps> = ({ color, dragRef, ...props }) => {
  if (color === 'black') return (
    <div style={{ width: '85%', height: '85%', ...props.style  }} ref={dragRef}>
      <BlackBishop />
    </div>
  );

  return (
    <div style={{ width: '85%', height: '85%', ...props.style  }} ref={dragRef}>
      <WhiteBishop />
    </div>
  );
};

export default BishopIcon;
