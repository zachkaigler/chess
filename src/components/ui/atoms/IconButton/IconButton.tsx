import React, { HTMLAttributes } from 'react';
import './IconButton.scss';

type IconButtonProps = {
  icon: React.ReactNode;
  active?: boolean;
} & HTMLAttributes<HTMLButtonElement>;

const IconButton: React.FC<IconButtonProps> = ({ icon, active, ...props }) => {
  return (
    <button className={`SquareButton__Container ${active ? 'active' : ''}`} {...props}>
      {icon}
    </button>
  );
};

export default IconButton;
