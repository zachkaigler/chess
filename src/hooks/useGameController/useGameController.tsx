import { createContext, useCallback, useState, useContext, useEffect } from "react";
import { generateBoard, BoardSquare, Board, convertBoardToMatrix } from "../../game/game";
import { Piece, PieceTypes } from "../../game/pieces";

export enum GameStates {
  NOT_STARTED = 'notStarted',
  STARTING = 'starting',
  PLAYING = 'playing',
  ENDED_WHITE_WIN = 'endedWhiteWin',
  ENDED_BLACK_WIN = 'endedBlackWin',
  ENDED_DRAW = 'endedDraw',
}

interface GameContextValues {
  game: Board,
  gameState: GameStates,
  movePiece(piece: Piece, currentSquare: BoardSquare, targetSquare: BoardSquare): void;
}

const GameContext = createContext<GameContextValues | undefined>(undefined);

interface GameProviderProps {
  children: React.ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const { board } = generateBoard();
  const [game, setGame] = useState(board);
  const [gameState, setGameState] = useState(GameStates.PLAYING); // TODO: cycle this through all steps eventually

  useEffect(() => {
    if (convertBoardToMatrix(game).filter((sqr: BoardSquare) => sqr.piece && sqr.piece.name !== PieceTypes.KING).length === 0) {
      setGameState(GameStates.ENDED_DRAW);
    }
  }, [game]);

  const movePiece = useCallback((piece: Piece, currentSquare: BoardSquare, targetSquare: BoardSquare) => {
    if (gameState !== GameStates.PLAYING) return;
    if (targetSquare.cooldownTimers) {
      clearInterval(targetSquare.cooldownTimers.interval);
      clearTimeout(targetSquare.cooldownTimers.timeout);
      setGame((oldGame) => ({
        ...oldGame,
        [targetSquare.id]: {
          ...oldGame[targetSquare.id],
          cooldownTimers: null,
          cooldownProgress: 0,
        },
      }));
    }
    const progressInterval = setInterval(() => {
      setGame((oldGame) => {
        if (!oldGame[targetSquare.id].cooldownTimers) {
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
    const cooldownTimer = setTimeout(() => {
      setGame((oldGame) => ({
        ...oldGame,
        [targetSquare.id]: {
          ...oldGame[targetSquare.id],
          cooldownTimers: null,
        },
      }));
    }, piece.cooldown);
    setGame((oldGame) => ({
      ...oldGame,
      [currentSquare.id]: {
        ...oldGame[currentSquare.id],
        piece: undefined,
      },
      [targetSquare.id]: {
        ...oldGame[targetSquare.id],
        piece,
        cooldownTimers: { interval: progressInterval, timeout: cooldownTimer},
      },
    }));
    if (targetSquare.piece && targetSquare.piece.name === PieceTypes.KING) {
      setGameState(targetSquare.piece.color === 'black' ? GameStates.ENDED_WHITE_WIN : GameStates.ENDED_BLACK_WIN);
    }
  }, []);

  return (
    <GameContext.Provider value={{ game, gameState, movePiece }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameController = () => {
  const values = useContext(GameContext);
  
  if (!values) throw new Error('useGameController must be called within a GameProvider');

  return values;
};
