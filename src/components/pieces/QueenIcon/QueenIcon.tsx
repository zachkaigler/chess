import React from 'react'
import { ChildIconProps } from '../PieceIcon/PieceIcon';
import BlackQueen from './BlackQueen.svg';
import WhiteQueen from './WhiteQueen.svg';


const QueenIcon: React.FC<ChildIconProps> = ({ color, dragRef, ...props }) => {
  if (color === 'black') return (
    <div style={{ width: '85%', height: '85%', ...props.style  }} ref={dragRef}>
      <BlackQueen />
    </div>
  );

  return (
    <div style={{ width: '85%', height: '85%', ...props.style  }} ref={dragRef}>
      <WhiteQueen />
    </div>
  );
}

export default QueenIcon;
