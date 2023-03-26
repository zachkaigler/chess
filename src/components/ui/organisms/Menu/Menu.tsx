import React from 'react';
import { useFirebase } from '../../../../hooks/useFirebase/useFirebase';
import { useNavigate } from 'react-router-dom';
import './Menu.scss';

interface MenuProps {
  closeMenu(): void;
}

const Menu: React.FC<MenuProps> = ({ closeMenu }) => {
  const { createGame } = useFirebase();
  const navigate = useNavigate();

  const handleCreateGame = async () => {
    const gameId = await createGame();
    navigate(`/${gameId}`);
  };

  return (
    <div className='Menu__Container'>
      <h1>Chess 2</h1>
      <button onClick={handleCreateGame}>Create Room</button>
      <button onClick={closeMenu}>Close Menu</button>
    </div>
  );
};

export default Menu;
