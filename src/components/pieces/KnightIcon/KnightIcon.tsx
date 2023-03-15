import React from 'react';
import { ChildIconProps } from '../PieceIcon/PieceIcon';

const KnightIcon: React.FC<ChildIconProps> = ({ color, isDragging, dragRef, ...props }) => {
  if (color === 'black') return (
    <>
      <div style={{ width: '85%', height: '85%', ...props.style  }} ref={dragRef}>
        <svg width="100%" height="100%" viewBox="0 0 225 329" fill="none" xmlns="http://www.w3.org/2000/svg" cursor={isDragging === undefined ? 'pointer' : isDragging ? 'grabbing' : 'grab'}>
          <path d="M125.5 140C122.3 163.2 145.167 213.667 157 236L114.5 261.5L60.5 218.5C59.3333 180.667 52.5 103.1 34.5 95.5C16.5 87.9 27 41.6666 34.5 19.5C41.6667 20.8333 59.3 21.2 72.5 12C85.7 2.79999 106 0.833302 114.5 0.999958L103.5 19.5C109.333 20.8333 124.4 26.1 138 36.5C155 49.5 142.5 49 151 53.5C159.5 58 213.5 69 222.5 85.5C229.7 98.7 213.5 111.667 204.5 116.5C197.333 113.333 182.5 108.4 180.5 114C178.5 119.6 168.333 121 163.5 121C152.167 117.667 128.7 116.8 125.5 140Z" fill="black"/>
          <mask id="mask0_1_48" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="116" width="217" height="213">
          <rect y="116" width="217" height="213" fill="#D9D9D9"/>
          </mask>
          <g mask="url(#mask0_1_48)">
          <path d="M61 68C56.2 56 45 55 40 56V2H77V27H92V2H109V56V328H6C6 301 -3.49473 278.458 6 262C21 236 56.6667 243.333 61 236C63 185 65.8 80 61 68Z" fill="black"/>
          </g>
          <mask id="mask1_1_48" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="237" width="217" height="92">
          <rect y="237" width="217" height="92" fill="#D9D9D9"/>
          </mask>
          <g mask="url(#mask1_1_48)">
          <path d="M155.78 68C160.58 56 171.78 55 176.78 56V2H139.78V27H124.78V2H107.78V56V328H210.78C210.78 301 220.275 278.458 210.78 262C195.78 236 160.113 243.333 155.78 236C153.78 185 150.98 80 155.78 68Z" fill="black"/>
          </g>
        </svg>
      </div>
    </>
  );

  return (
    <>
      <div style={{ width: '85%', height: '85%', ...props.style  }} ref={dragRef}>
        <svg width="100%" height="100%" viewBox="0 0 225 329" fill="none" xmlns="http://www.w3.org/2000/svg" cursor={isDragging === undefined ? 'pointer' : isDragging ? 'grabbing' : 'grab'}>
          <path d="M125.5 140C122.3 163.2 145.167 213.667 157 236L114.5 261.5L60.5 218.5C59.3333 180.667 52.5 103.1 34.5 95.5C16.5 87.9 27 41.6666 34.5 19.5C41.6667 20.8333 59.3 21.2 72.5 12C85.7 2.79999 106 0.833302 114.5 0.999958L103.5 19.5C109.333 20.8333 124.4 26.1 138 36.5C155 49.5 142.5 49 151 53.5C159.5 58 213.5 69 222.5 85.5C229.7 98.7 213.5 111.667 204.5 116.5C197.333 113.333 182.5 108.4 180.5 114C178.5 119.6 168.333 121 163.5 121C152.167 117.667 128.7 116.8 125.5 140Z" fill="#FFFDF0"/>
          <mask id="mask0_16_38" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="116" width="217" height="213">
          <rect y="116" width="217" height="213" fill="#D9D9D9"/>
          </mask>
          <g mask="url(#mask0_16_38)">
          <path d="M61 68C56.2 56 45 55 40 56V2H77V27H92V2H109V56V328H6C6 301 -3.49473 278.458 6 262C21 236 56.6667 243.333 61 236C63 185 65.8 80 61 68Z" fill="#FFFDF0"/>
          </g>
          <mask id="mask1_16_38" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="237" width="217" height="92">
          <rect y="237" width="217" height="92" fill="#D9D9D9"/>
          </mask>
          <g mask="url(#mask1_16_38)">
          <path d="M155.78 68C160.58 56 171.78 55 176.78 56V2H139.78V27H124.78V2H107.78V56V328H210.78C210.78 301 220.275 278.458 210.78 262C195.78 236 160.113 243.333 155.78 236C153.78 185 150.98 80 155.78 68Z" fill="#FFFDF0"/>
          </g>
        </svg>
      </div>
    </>
  );
};

export default KnightIcon;
