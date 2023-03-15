import React from 'react';
import { ChildIconProps } from '../PieceIcon/PieceIcon';

const KingIcon: React.FC<ChildIconProps> = ({ color, isDragging, dragRef, ...props }) => {
  if (color === 'black') return (
    <>
      <div style={{ width: '85%', height: '85%', ...props.style  }} ref={dragRef}>
        <svg width="100%" height="100%" viewBox="0 0 217 327" fill="none" xmlns="http://www.w3.org/2000/svg" cursor={isDragging === undefined ? 'pointer' : isDragging ? 'grabbing' : 'grab'}>
          <path d="M167.93 116.172C155.031 119.789 144.966 139.781 141.546 149.326L106 187V79H179.29C180.878 89.8837 180.829 112.555 167.93 116.172Z" fill="black"/>
          <path d="M48.0697 116.172C60.9688 119.789 71.034 139.781 74.4542 149.326L110 187V79H36.7096C35.1217 89.8837 35.1706 112.555 48.0697 116.172Z" fill="black"/>
          <rect x="87" width="46" height="228" fill="black"/>
          <rect x="132" y="20" width="41" height="76" transform="rotate(90 132 20)" fill="black"/>
          <rect x="164" y="20" width="41" height="76" transform="rotate(90 164 20)" fill="black"/>
          <mask id="mask0_2_97" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="114" width="217" height="213">
          <rect y="114" width="217" height="213" fill="#D9D9D9"/>
          </mask>
          <g mask="url(#mask0_2_97)">
          <path d="M61 66C56.2 54 45 53 40 54V0H77V25H92V0H109V54V326H6C6 299 -3.49473 276.458 6 260C21 234 56.6667 241.333 61 234C63 183 65.8 78 61 66Z" fill="black"/>
          </g>
          <mask id="mask1_2_97" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="114" width="217" height="213">
          <rect y="114" width="217" height="213" fill="#D9D9D9"/>
          </mask>
          <g mask="url(#mask1_2_97)">
          <path d="M155.78 66C160.58 54 171.78 53 176.78 54V0H139.78V25H124.78V0H107.78V54V326H210.78C210.78 299 220.275 276.458 210.78 260C195.78 234 160.113 241.333 155.78 234C153.78 183 150.98 78 155.78 66Z" fill="black"/>
          </g>
        </svg>
      </div>
    </>
  );

  return (
    <>
      <div style={{ width: '85%', height: '85%', ...props.style  }} ref={dragRef}>
        <svg width="100%" height="100%" viewBox="0 0 217 327" fill="none" xmlns="http://www.w3.org/2000/svg" cursor={isDragging === undefined ? 'pointer' : isDragging ? 'grabbing' : 'grab'}>
          <path d="M167.93 116.172C155.031 119.789 144.966 139.781 141.546 149.326L106 187V79H179.29C180.878 89.8837 180.829 112.555 167.93 116.172Z" fill="#FFFDF0"/>
          <path d="M48.0697 116.172C60.9688 119.789 71.034 139.781 74.4542 149.326L110 187V79H36.7096C35.1217 89.8837 35.1706 112.555 48.0697 116.172Z" fill="#FFFDF0"/>
          <rect x="87" width="46" height="228" fill="#FFFDF0"/>
          <rect x="132" y="20" width="41" height="76" transform="rotate(90 132 20)" fill="#FFFDF0"/>
          <rect x="164" y="20" width="41" height="76" transform="rotate(90 164 20)" fill="#FFFDF0"/>
          <mask id="mask0_16_18" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="114" width="217" height="213">
          <rect y="114" width="217" height="213" fill="#D9D9D9"/>
          </mask>
          <g mask="url(#mask0_16_18)">
          <path d="M61 66C56.2 54 45 53 40 54V0H77V25H92V0H109V54V326H6C6 299 -3.49473 276.458 6 260C21 234 56.6667 241.333 61 234C63 183 65.8 78 61 66Z" fill="#FFFDF0"/>
          </g>
          <mask id="mask1_16_18" style={{ maskType: 'alpha' }} maskUnits="userSpaceOnUse" x="0" y="114" width="217" height="213">
          <rect y="114" width="217" height="213" fill="#D9D9D9"/>
          </mask>
          <g mask="url(#mask1_16_18)">
          <path d="M155.78 66C160.58 54 171.78 53 176.78 54V0H139.78V25H124.78V0H107.78V54V326H210.78C210.78 299 220.275 276.458 210.78 260C195.78 234 160.113 241.333 155.78 234C153.78 183 150.98 78 155.78 66Z" fill="#FFFDF0"/>
          </g>
        </svg>
      </div>
    </>
  );
};

export default KingIcon;
