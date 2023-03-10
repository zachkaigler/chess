import React from 'react'
import { ChildIconProps } from '../PieceIcon/PieceIcon';

const QueenIcon: React.FC<ChildIconProps> = ({ piece, isDragging, dragRef }) => {
  if (piece.color === 'black') return (
    <>
      <div style={{ width: '85%', height: '85%' }} ref={dragRef}>
        <svg width="100%" height="100%" viewBox="0 0 217 327" fill="none" xmlns="http://www.w3.org/2000/svg" cursor={isDragging ? 'grabbing' : 'grab'}>
          <path d="M167.93 116.172C155.031 119.789 144.966 139.781 141.546 149.326L106 187V79H179.29C180.878 89.8837 180.829 112.555 167.93 116.172Z" fill="black"/>
          <path d="M48.0697 116.172C60.9688 119.789 71.034 139.781 74.4542 149.326L110 187V79H36.7096C35.1217 89.8837 35.1706 112.555 48.0697 116.172Z" fill="black"/>
          <ellipse cx="107.5" cy="83" rx="62.5" ry="60" fill="black"/>
          <circle cx="110" cy="26" r="13" fill="black"/>
          <path d="M110.5 0.5V23.5L105.5 8.5L110.5 0.5Z" fill="black"/>
          <path d="M110.5 0.5V23.5L115.5 8.5L110.5 0.5Z" fill="black"/>
          <path d="M15.5 14.5L36.5 78.5L39 82.5L60.5 91C70.8333 78.3333 86.6 52.9 67 52.5C47.4 52.1 24.5 27 15.5 14.5Z" fill="black"/>
          <path d="M55.5 9.5L76.5 73.5L79 77.5L100.5 86C110.833 73.3333 126.6 47.9 107 47.5C87.4 47.1 64.5 22 55.5 9.5Z" fill="black"/>
          <path d="M200.333 14.5L179.333 78.5L176.833 82.5L155.333 91C145 78.3333 129.233 52.9 148.833 52.5C168.433 52.1 191.333 27 200.333 14.5Z" fill="black"/>
          <path d="M161.833 10L140.833 74L138.333 78L116.833 86.5C106.5 73.8333 90.7329 48.4 110.333 48C129.933 47.6 152.833 22.5 161.833 10Z" fill="black"/>
          <mask id="mask0_2_107" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="114" width="217" height="213">
          <rect y="114" width="217" height="213" fill="#D9D9D9"/>
          </mask>
          <g mask="url(#mask0_2_107)">
          <path d="M61 66C56.2 54 45 53 40 54V0H77V25H92V0H109V54V326H6C6 299 -3.49473 276.458 6 260C21 234 56.6667 241.333 61 234C63 183 65.8 78 61 66Z" fill="black"/>
          </g>
          <mask id="mask1_2_107" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="114" width="217" height="213">
          <rect y="114" width="217" height="213" fill="#D9D9D9"/>
          </mask>
          <g mask="url(#mask1_2_107)">
          <path d="M155.78 66C160.58 54 171.78 53 176.78 54V0H139.78V25H124.78V0H107.78V54V326H210.78C210.78 299 220.275 276.458 210.78 260C195.78 234 160.113 241.333 155.78 234C153.78 183 150.98 78 155.78 66Z" fill="black"/>
          </g>
        </svg>
      </div>
    </>
  );

  return (
    <>
      <div style={{ width: '85%', height: '85%' }} ref={dragRef}>
        <svg width="100%" height="100%" viewBox="0 0 217 327" fill="none" xmlns="http://www.w3.org/2000/svg" cursor={isDragging ? 'grabbing' : 'grab'}>
          <path d="M167.93 116.172C155.031 119.789 144.966 139.781 141.546 149.326L106 187V79H179.29C180.878 89.8837 180.829 112.555 167.93 116.172Z" fill="#FFFDF0"/>
          <path d="M48.0697 116.172C60.9688 119.789 71.034 139.781 74.4542 149.326L110 187V79H36.7096C35.1217 89.8837 35.1706 112.555 48.0697 116.172Z" fill="#FFFDF0"/>
          <ellipse cx="107.5" cy="83" rx="62.5" ry="60" fill="#FFFDF0"/>
          <circle cx="110" cy="26" r="13" fill="#FFFDF0"/>
          <path d="M110.5 0.5V23.5L105.5 8.5L110.5 0.5Z" fill="#FFFDF0"/>
          <path d="M110.5 0.5V23.5L115.5 8.5L110.5 0.5Z" fill="#FFFDF0"/>
          <path d="M15.5 14.5L36.5 78.5L39 82.5L60.5 91C70.8333 78.3333 86.6 52.9 67 52.5C47.4 52.1 24.5 27 15.5 14.5Z" fill="#FFFDF0"/>
          <path d="M55.5 9.5L76.5 73.5L79 77.5L100.5 86C110.833 73.3333 126.6 47.9 107 47.5C87.4 47.1 64.5 22 55.5 9.5Z" fill="#FFFDF0"/>
          <path d="M200.333 14.5L179.333 78.5L176.833 82.5L155.333 91C145 78.3333 129.233 52.9 148.833 52.5C168.433 52.1 191.333 27 200.333 14.5Z" fill="#FFFDF0"/>
          <path d="M161.833 10L140.833 74L138.333 78L116.833 86.5C106.5 73.8333 90.7329 48.4 110.333 48C129.933 47.6 152.833 22.5 161.833 10Z" fill="#FFFDF0"/>
          <mask id="mask0_15_2" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="114" width="217" height="213">
          <rect y="114" width="217" height="213" fill="#D9D9D9"/>
          </mask>
          <g mask="url(#mask0_15_2)">
          <path d="M61 66C56.2 54 45 53 40 54V0H77V25H92V0H109V54V326H6C6 299 -3.49473 276.458 6 260C21 234 56.6667 241.333 61 234C63 183 65.8 78 61 66Z" fill="#FFFDF0"/>
          </g>
          <mask id="mask1_15_2" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="114" width="217" height="213">
          <rect y="114" width="217" height="213" fill="#D9D9D9"/>
          </mask>
          <g mask="url(#mask1_15_2)">
          <path d="M155.78 66C160.58 54 171.78 53 176.78 54V0H139.78V25H124.78V0H107.78V54V326H210.78C210.78 299 220.275 276.458 210.78 260C195.78 234 160.113 241.333 155.78 234C153.78 183 150.98 78 155.78 66Z" fill="#FFFDF0"/>
          </g>
        </svg>
      </div>
    </>
  );
}

export default QueenIcon;
