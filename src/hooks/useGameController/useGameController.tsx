import { createContext, useCallback, useState, useContext, useEffect } from "react";
import { generateBoard, BoardSquare, Board, convertBoardToMatrix } from "../../game/game";
import { canBeCapturedEnPassant, Piece, PieceTypes, pieceValues } from "../../game/pieces";

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
    let rookCastleInterval: number;
    let rookCastleTimeout: number;

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
        piece: {
          ...piece,
          moveIsValid: piece.moveIsValid,
          enPassantPossible: canBeCapturedEnPassant(piece, currentSquare, targetSquare) ? true : false,
          canCastle: false,
        },
        cooldownTimers: { interval: progressInterval, timeout: cooldownTimer },
      },
    }));

    // if castle king side
    if (
      piece.name === PieceTypes.KING
      && targetSquare.id === currentSquare.id + 2
    ) {
      switch (piece.color) {
        case 'white':
          rookCastleInterval = setInterval(() => {
            setGame((oldGame) => {
              if (!oldGame[6].cooldownTimers) {
                clearInterval(rookCastleInterval);
                return {
                  ...oldGame,
                  6: {
                    ...oldGame[6],
                    cooldownProgress: 0,
                  },
                };
              } else {
                return {
                  ...oldGame,
                  6: {
                    ...oldGame[6],
                    cooldownProgress: oldGame[6].cooldownProgress + 10,
                  }
                };
              };
            });
          }, pieceValues[PieceTypes.ROOK].cooldown / 10);
    
          rookCastleTimeout = setTimeout(() => {
            setGame((oldGame) => ({
              ...oldGame,
              6: {
                ...oldGame[6],
                cooldownTimers: null,
              },
            }));
          }, pieceValues[PieceTypes.ROOK].cooldown);
          setGame((oldGame) => ({
            ...oldGame,
            8: {
              ...oldGame[8],
              piece: undefined,
            },
            6: {
              ...oldGame[6],
              piece: oldGame[8].piece,
              cooldownTimers: { interval: rookCastleInterval, timeout: rookCastleTimeout },
            }
          }));
          break;
          case 'black':
            rookCastleInterval = setInterval(() => {
              setGame((oldGame) => {
                if (!oldGame[targetSquare.id].cooldownTimers) {
                  clearInterval(progressInterval);
                  return {
                    ...oldGame,
                    62: {
                      ...oldGame[62],
                      cooldownProgress: 0,
                    },
                  };
                } else {
                  return {
                    ...oldGame,
                    62: {
                      ...oldGame[62],
                      cooldownProgress: oldGame[62].cooldownProgress + 10,
                    }
                  };
                };
              });
            }, pieceValues[PieceTypes.ROOK].cooldown / 10);
      
            rookCastleTimeout = setTimeout(() => {
              setGame((oldGame) => ({
                ...oldGame,
                62: {
                  ...oldGame[62],
                  cooldownTimers: null,
                },
              }));
            }, pieceValues[PieceTypes.ROOK].cooldown);
            setGame((oldGame) => ({
              ...oldGame,
              64: {
                ...oldGame[64],
                piece: undefined,
              },
              62: {
                ...oldGame[62],
                piece: oldGame[64].piece,
                cooldownTimers: { interval: rookCastleInterval, timeout: rookCastleTimeout },
              }
            }));
          break;
          default: return null;  
      }
    }

    // if castle queen side
    if (
      piece.name === PieceTypes.KING
      && targetSquare.id === currentSquare.id - 2
    ) {
      switch (piece.color) {
        case 'white':
          rookCastleInterval = setInterval(() => {
            setGame((oldGame) => {
              if (!oldGame[4].cooldownTimers) {
                clearInterval(rookCastleInterval);
                return {
                  ...oldGame,
                  4: {
                    ...oldGame[4],
                    cooldownProgress: 0,
                  },
                };
              } else {
                return {
                  ...oldGame,
                  4: {
                    ...oldGame[4],
                    cooldownProgress: oldGame[4].cooldownProgress + 10,
                  }
                };
              };
            });
          }, pieceValues[PieceTypes.ROOK].cooldown / 10);
    
          rookCastleTimeout = setTimeout(() => {
            setGame((oldGame) => ({
              ...oldGame,
              4: {
                ...oldGame[4],
                cooldownTimers: null,
              },
            }));
          }, pieceValues[PieceTypes.ROOK].cooldown);
          setGame((oldGame) => ({
            ...oldGame,
            1: {
              ...oldGame[1],
              piece: undefined,
            },
            4: {
              ...oldGame[4],
              piece: oldGame[1].piece,
              cooldownTimers: { interval: rookCastleInterval, timeout: rookCastleTimeout },
            }
          }));
          break;
          case 'black':
            rookCastleInterval = setInterval(() => {
              setGame((oldGame) => {
                if (!oldGame[60].cooldownTimers) {
                  clearInterval(rookCastleInterval);
                  return {
                    ...oldGame,
                    60: {
                      ...oldGame[60],
                      cooldownProgress: 0,
                    },
                  };
                } else {
                  return {
                    ...oldGame,
                    60: {
                      ...oldGame[60],
                      cooldownProgress: oldGame[60].cooldownProgress + 10,
                    }
                  };
                };
              });
            }, pieceValues[PieceTypes.ROOK].cooldown / 10);
      
            rookCastleTimeout = setTimeout(() => {
              setGame((oldGame) => ({
                ...oldGame,
                60: {
                  ...oldGame[60],
                  cooldownTimers: null,
                },
              }));
            }, pieceValues[PieceTypes.ROOK].cooldown);
            setGame((oldGame) => ({
              ...oldGame,
              57: {
                ...oldGame[57],
                piece: undefined,
              },
              60: {
                ...oldGame[60],
                piece: oldGame[57].piece,
                cooldownTimers: { interval: rookCastleInterval, timeout: rookCastleTimeout },
              }
            }));
          break;
          default: return null;  
      }
    }

    if (
      piece.name === PieceTypes.PAWN
      && !!game[currentSquare.id - 1].piece?.enPassantPossible
      && game[currentSquare.id - 1].piece?.color !== piece.color
      && !(targetSquare.id === currentSquare.id + 8 || targetSquare.id === currentSquare.id - 8)
    ) {
      setGame((oldGame) => ({
        ...oldGame,
        [currentSquare.id - 1]: {
          ...oldGame[currentSquare.id - 1],
          piece: undefined,
        },
      }));
    }

    if (
      piece.name === PieceTypes.PAWN
      && !!game[currentSquare.id + 1].piece?.enPassantPossible
      && game[currentSquare.id + 1].piece?.color !== piece.color
      && !(targetSquare.id === currentSquare.id + 8 || targetSquare.id === currentSquare.id - 8)
    ) {
      setGame((oldGame) => ({
        ...oldGame,
        [currentSquare.id + 1]: {
          ...oldGame[currentSquare.id + 1],
          piece: undefined,
        },
      }));
    }

    if (targetSquare.piece && targetSquare.piece.name === PieceTypes.KING) {
      setGameState(targetSquare.piece.color === 'black' ? GameStates.ENDED_WHITE_WIN : GameStates.ENDED_BLACK_WIN);
    }
  }, [game]);

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
