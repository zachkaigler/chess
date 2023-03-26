import React, { HTMLAttributes } from 'react';
import './BlockButton.scss';

type BlockButtonProps = {
  label: string;
} & HTMLAttributes<HTMLButtonElement>;

const BlockButton: React.FC<BlockButtonProps> = ({ label, ...props }) => (
  <button className='BlockButton__Container' {...props}>
    <div className='BlockButton__Inner'>
      {label}
    </div>
  </button>
);

export default BlockButton;
