import React, { HTMLAttributes } from 'react';
import './Panel.scss';

type PanelProps = {
  header: string;
  headerColor?: 'gradient' | 'blue' | 'green' | 'red';
  children: React.ReactNode;
} & HTMLAttributes<HTMLDivElement>;

const Panel: React.FC<PanelProps> = ({ children, header, headerColor='gradient', ...props }) => (
  <div {...props} className={`Panel ${props.className}`}>
    <h3 className={`Panel__Header ${headerColor}`}>{header}</h3>
    <div className='Panel__Content'>
      {children}
    </div>
  </div>
);

export default Panel;
