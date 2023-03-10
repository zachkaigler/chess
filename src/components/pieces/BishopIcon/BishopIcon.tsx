import React from 'react';
import { ChildIconProps } from '../PieceIcon/PieceIcon';

const BishopIcon: React.FC<ChildIconProps> = ({ piece, isDragging, dragRef }) => {
  if (piece.color === 'black') return (
    <>
      <div style={{ width: '85%', height: '85%' }} ref={dragRef}>
      <svg width="100%" height="100%" viewBox="0 0 217 328" fill="none" xmlns="http://www.w3.org/2000/svg" cursor={isDragging ? 'grabbing' : 'grab'}>
        <path d="M81.5063 195.869V84.4818L106 62V272H99.5017C81.173 264.165 47.8149 245.737 61.0115 234.701C74.2082 223.664 80.1733 204.214 81.5063 195.869Z" fill="black"/>
        <path d="M136.494 195.869V84.4818L112 62V272H118.498C136.827 264.165 170.185 245.737 156.988 234.701C143.792 223.664 137.827 204.214 136.494 195.869Z" fill="black"/>
        <path d="M110 117V0C92.8371 7.57714 58.4104 29.8183 58.0065 58.1657C57.6027 86.5131 76.0107 109.2 85.2652 117H110Z" fill="black"/>
        <path d="M110 117V0C114.371 1.92952 118.737 5.30996 124.5 9L120.5 62.5L138.563 18C151.016 28.5169 161.769 42.3965 161.993 58.1657C162.397 86.5131 143.989 109.2 134.735 117H110Z" fill="black"/>
        <rect x="104" y="88" width="13" height="147" fill="black"/>
        <mask id="mask0_2_67" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="235" width="217" height="93">
        <rect y="235" width="217" height="93" fill="#D9D9D9"/>
        </mask>
        <g mask="url(#mask0_2_67)">
        <path d="M61 67C56.2 55 45 54 40 55V1H77V26H92V1H109V55V327H6C6 300 -3.49473 277.458 6 261C21 235 56.6667 242.333 61 235C63 184 65.8 79 61 67Z" fill="black"/>
        </g>
        <mask id="mask1_2_67" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="235" width="217" height="93">
        <rect y="235" width="217" height="93" fill="#D9D9D9"/>
        </mask>
        <g mask="url(#mask1_2_67)">
        <path d="M155.78 67C160.58 55 171.78 54 176.78 55V1H139.78V26H124.78V1H107.78V55V327H210.78C210.78 300 220.275 277.458 210.78 261C195.78 235 160.113 242.333 155.78 235C153.78 184 150.98 79 155.78 67Z" fill="black"/>
        </g>
      </svg>
      </div>
    </>
  );

  return (
    <>
      <div style={{ width: '85%', height: '85%' }} ref={dragRef}>
        <svg width="100%" height="100%" viewBox="0 0 217 328" fill="none" xmlns="http://www.w3.org/2000/svg" cursor={isDragging ? 'grabbing' : 'grab'}>
          <path d="M81.5063 195.869V84.4818L106 62V272H99.5017C81.173 264.165 47.8149 245.737 61.0115 234.701C74.2082 223.664 80.1733 204.214 81.5063 195.869Z" fill="#FFFDF0"/>
          <path d="M136.494 195.869V84.4818L112 62V272H118.498C136.827 264.165 170.185 245.737 156.988 234.701C143.792 223.664 137.827 204.214 136.494 195.869Z" fill="#FFFDF0"/>
          <path d="M110 117V0C92.8371 7.57714 58.4104 29.8183 58.0065 58.1657C57.6027 86.5131 76.0107 109.2 85.2652 117H110Z" fill="#FFFDF0"/>
          <path d="M110 117V0C114.371 1.92952 118.737 5.30996 124.5 9L120.5 62.5L138.563 18C151.016 28.5169 161.769 42.3965 161.993 58.1657C162.397 86.5131 143.989 109.2 134.735 117H110Z" fill="#FFFDF0"/>
          <rect x="104" y="88" width="13" height="147" fill="#FFFDF0"/>
          <mask id="mask0_16_28" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="235" width="217" height="93">
          <rect y="235" width="217" height="93" fill="#D9D9D9"/>
          </mask>
          <g mask="url(#mask0_16_28)">
          <path d="M61 67C56.2 55 45 54 40 55V1H77V26H92V1H109V55V327H6C6 300 -3.49473 277.458 6 261C21 235 56.6667 242.333 61 235C63 184 65.8 79 61 67Z" fill="#FFFDF0"/>
          </g>
          <mask id="mask1_16_28" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="235" width="217" height="93">
          <rect y="235" width="217" height="93" fill="#D9D9D9"/>
          </mask>
          <g mask="url(#mask1_16_28)">
          <path d="M155.78 67C160.58 55 171.78 54 176.78 55V1H139.78V26H124.78V1H107.78V55V327H210.78C210.78 300 220.275 277.458 210.78 261C195.78 235 160.113 242.333 155.78 235C153.78 184 150.98 79 155.78 67Z" fill="#FFFDF0"/>
          </g>
        </svg>
      </div>
    </>
  );
};

export default BishopIcon;
