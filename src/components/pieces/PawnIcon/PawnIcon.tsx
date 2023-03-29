import React from 'react'
import { ChildIconProps } from '../PieceIcon/PieceIcon';
import BlackPawn from './BlackPawn.svg';
import WhitePawn from './WhitePawn.svg';

const PawnIcon: React.FC<ChildIconProps> = ({ color, dragRef, ...props }) => {
  if (color === 'black') return (
    <div style={{ width: '85%', height: '85%', ...props.style }} ref={dragRef} >
      <BlackPawn />
    </div>
  );

  return (
    <div style={{ width: '85%', height: '85%', ...props.style  }} ref={dragRef}>
      <WhitePawn />
    </div>
  );
};

export default PawnIcon;
