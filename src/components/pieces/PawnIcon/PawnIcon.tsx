import React from 'react'
import { ChildIconProps } from '../PieceIcon/PieceIcon';

const PawnIcon: React.FC<ChildIconProps> = ({ color, isDragging, dragRef, ...props }) => {
  if (color === 'black') return (
    <>
      <div style={{ width: '85%', height: '85%', ...props.style }} ref={dragRef} >
        <svg width="100%" height="100%" viewBox="0 0 217 328" fill="none" xmlns="http://www.w3.org/2000/svg" cursor={isDragging === undefined ? 'pointer' : isDragging ? 'grabbing' : 'grab'}>
          <ellipse cx="108.5" cy="140" rx="69.5" ry="67" fill="black"/>
          <mask id="mask0_12_2" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="115" width="217" height="213">
          <rect y="115" width="217" height="213" fill="#D9D9D9"/>
          </mask>
          <g mask="url(#mask0_12_2)">
          <path d="M61 67C56.2 55 45 54 40 55V1H77V26H92V1H109V55V327H6.00003C6.00003 300 -3.49469 277.458 6.00003 261C21 235 56.6667 242.333 61 235C63 184 65.8 79 61 67Z" fill="black"/>
          </g>
          <mask id="mask1_12_2" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="110" width="217" height="218">
          <rect y="110" width="217" height="218" fill="#D9D9D9"/>
          </mask>
          <g mask="url(#mask1_12_2)">
          <path d="M155.78 67C160.58 55 171.78 54 176.78 55V1H139.78V26H124.78V1H107.78V55V327H210.78C210.78 300 220.275 277.458 210.78 261C195.78 235 160.113 242.333 155.78 235C153.78 184 150.98 79 155.78 67Z" fill="black"/>
          </g>
        </svg>
      </div>
    </>
  );

  return (
    <>
      <div style={{ width: '85%', height: '85%', ...props.style  }} ref={dragRef}>
      <svg width="100%" height="100%" viewBox="0 0 217 328" fill="none" xmlns="http://www.w3.org/2000/svg" cursor={isDragging === undefined ? 'pointer' : isDragging ? 'grabbing' : 'grab'}>
        <ellipse cx="108.5" cy="140" rx="69.5" ry="67" fill="#FFFDF0"/>
        <mask id="mask0_12_9" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="115" width="217" height="213">
        <rect y="115" width="217" height="213" fill="#D9D9D9"/>
        </mask>
        <g mask="url(#mask0_12_9)">
        <path d="M61 67C56.2 55 45 54 40 55V1H77V26H92V1H109V55V327H6.00003C6.00003 300 -3.49469 277.458 6.00003 261C21 235 56.6667 242.333 61 235C63 184 65.8 79 61 67Z" fill="#FFFDF0"/>
        </g>
        <mask id="mask1_12_9" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="110" width="217" height="218">
        <rect y="110" width="217" height="218" fill="#D9D9D9"/>
        </mask>
        <g mask="url(#mask1_12_9)">
        <path d="M155.78 67C160.58 55 171.78 54 176.78 55V1H139.78V26H124.78V1H107.78V55V327H210.78C210.78 300 220.275 277.458 210.78 261C195.78 235 160.113 242.333 155.78 235C153.78 184 150.98 79 155.78 67Z" fill="#FFFDF0"/>
        </g>
        </svg>
      </div>
    </>
  );
};

export default PawnIcon;
