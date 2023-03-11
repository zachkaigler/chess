import { createContext, useCallback, useState, useContext } from "react";
import { generateBoard, BoardSquare, Board } from "../../board";
import { Piece } from "../../pieces";

interface GameContextValues {
  game: Board,
  movePiece(piece: Piece, currentSquare: BoardSquare, targetSquare: BoardSquare): void; 
}

const GameContext = createContext<GameContextValues | undefined>(undefined);

interface GameProviderProps {
  children: React.ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const { board } = generateBoard();
  const [game, setGame] = useState(board);

  const movePiece = useCallback((piece: Piece, currentSquare: BoardSquare, targetSquare: BoardSquare) => {
    setGame((oldGame) => ({
      ...oldGame,
      [currentSquare.id]: {
        ...oldGame[currentSquare.id],
        piece: undefined,
      },
      [targetSquare.id]: {
        ...oldGame[targetSquare.id],
        piece,
        onCooldown: true,
      },
    }));
    const progressInterval = setInterval(() => {
      setGame((oldGame) => {
        if (!oldGame[targetSquare.id].onCooldown) {
          clearInterval(progressInterval);
          return {
            ...oldGame,
            [targetSquare.id]: {
              ...oldGame[targetSquare.id],
              cooldownProgress: 0,
            },
          };
        } else {
          return {
            ...oldGame,
            [targetSquare.id]: {
              ...oldGame[targetSquare.id],
              cooldownProgress: oldGame[targetSquare.id].cooldownProgress + 10,
            }
          };
        };
      });
    }, piece.cooldown / 10);
    setTimeout(() => {
      setGame((oldGame) => ({
        ...oldGame,
        [targetSquare.id]: {
          ...oldGame[targetSquare.id],
          onCooldown: false,
        },
      }));
    }, piece.cooldown);
  }, []);

  return (
    <GameContext.Provider value={{ game, movePiece }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameController = () => {
  const values = useContext(GameContext);
  
  if (!values) throw new Error('useGameController must be called within a GameProvider');

  return values;
};
