import React from 'react'
import { ChildIconProps } from '../PieceIcon/PieceIcon';
import BlackRook from './BlackRook.svg';
import WhiteRook from './WhiteRook.svg';

const RookIcon: React.FC<ChildIconProps> = ({ color, dragRef, ...props }) => {
  if (color === 'black') return (
    <div style={{ width: '85%', height: '85%', ...props.style  }} ref={dragRef}>
      <BlackRook />
    </div>
  );

  return (
    <div style={{ width: '85%', height: '85%', ...props.style  }} ref={dragRef}>
      <WhiteRook />
    </div>
  );
};

export default RookIcon;
