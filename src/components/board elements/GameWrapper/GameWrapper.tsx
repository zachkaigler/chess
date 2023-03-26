import React from 'react'
import { useParams } from 'react-router-dom';
import { FirebaseProvider } from '../../../hooks/useFirebase/useFirebase';
import { GameProvider } from '../../../hooks/useGameController/useGameController';

interface GameWrapperProps {
  children: React.ReactNode;
}

const GameWrapper: React.FC<GameWrapperProps> = ({ children }) => {
  const { game: gameId } = useParams();

  return (
    <FirebaseProvider gameId={gameId}>
      <GameProvider>
        {children}
      </GameProvider>
    </FirebaseProvider>
  )
}

export default GameWrapper;
