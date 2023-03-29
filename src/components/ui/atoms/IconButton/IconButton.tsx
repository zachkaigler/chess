import React from 'react';
import './IconButton.scss';

type IconButtonProps = {
  icon: React.ReactNode;
  active?: boolean;
  highlight?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const IconButton: React.FC<IconButtonProps> = ({ icon, active, highlight, ...props }) => {
  return (
    <button className={`SquareButton__Container ${active ? 'active' : ''} ${highlight && !active ? 'highlight' : ''}`} {...props}>
      {icon}
    </button>
  );
};

export default IconButton;
