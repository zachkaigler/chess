import React from 'react'
import { ChildIconProps } from '../PieceIcon/PieceIcon';

const RookIcon: React.FC<ChildIconProps> = ({ color, isDragging, dragRef, ...props }) => {
  if (color === 'black') return (
    <>
      <div style={{ width: '85%', height: '85%', ...props.style  }} ref={dragRef}>
      <svg width="100%" height="100%" viewBox="0 0 214 326" fill="none" xmlns="http://www.w3.org/2000/svg" cursor={isDragging === undefined ? 'pointer' : isDragging ? 'grabbing' : 'grab'}>
        <path d="M60 66C55.2 54 44 53 39 54V0H76V25H91V0H108V54V326H5C5 299 -4.49473 276.458 5 260C20 234 55.6667 241.333 60 234C62 183 64.8 78 60 66Z" fill="black"/>
        <path d="M154.78 66C159.58 54 170.78 53 175.78 54V0H138.78V25H123.78V0H106.78V54V326H209.78C209.78 299 219.275 276.458 209.78 260C194.78 234 159.113 241.333 154.78 234C152.78 183 149.98 78 154.78 66Z" fill="black"/>
      </svg>
      </div>
    </>
  );

  return (
    <>
      <div style={{ width: '85%', height: '85%', ...props.style  }} ref={dragRef}>
        <svg width="100%" height="100%" viewBox="0 0 214 326" fill="none" xmlns="http://www.w3.org/2000/svg" cursor={isDragging === undefined ? 'pointer' : isDragging ? 'grabbing' : 'grab'}>
          <path d="M60 66C55.2 54 44 53 39 54V0H76V25H91V0H108V54V326H5C5 299 -4.49473 276.458 5 260C20 234 55.6667 241.333 60 234C62 183 64.8 78 60 66Z" fill="#FFFDF0"/>
          <path d="M154.78 66C159.58 54 170.78 53 175.78 54V0H138.78V25H123.78V0H106.78V54V326H209.78C209.78 299 219.275 276.458 209.78 260C194.78 234 159.113 241.333 154.78 234C152.78 183 149.98 78 154.78 66Z" fill="#FFFDF0"/>
        </svg>
      </div>
    </>
  );
};

export default RookIcon;
