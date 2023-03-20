import { createContext, useCallback, useState, useContext, useEffect } from "react";
import { generateBoard, BoardSquare, Board, convertBoardToMatrix } from "../../game/game";
import { Bishop, canBeCapturedEnPassant, Knight, Piece, PieceTypes, pieceValues, Queen, Rook } from "../../game/pieces";
import { useFirebase } from "../useFirebase/useFirebase";

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
  promotePawn(square: BoardSquare, promoteTo: PieceTypes.QUEEN | PieceTypes.ROOK | PieceTypes.BISHOP | PieceTypes.KNIGHT): void;
}

const GameContext = createContext<GameContextValues | undefined>(undefined);

interface GameProviderProps {
  children: React.ReactNode;
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const { postToMovesFirebase, lastMove, bothPlayersReady, myColor } = useFirebase();

  const { board } = generateBoard();
  const [game, setGame] = useState(board);
  const [gameState, setGameState] = useState(GameStates.NOT_STARTED); // TODO: cycle this through all steps eventually

  // when both players are ready, start game
  useEffect(() => {
    if (!bothPlayersReady) return;
    setGameState(GameStates.PLAYING);
  }, [bothPlayersReady]);

  const checkForWinCondition = (targetSquare: BoardSquare) => {
    if (targetSquare.piece && targetSquare.piece.name === PieceTypes.KING) {
      setGameState(targetSquare.piece.color === 'black' ? GameStates.ENDED_WHITE_WIN : GameStates.ENDED_BLACK_WIN);
    }
  };

  // shovel latest move of opposite color from firebase into state
  useEffect(() => {
    const moveColor = lastMove.find((move) => move.piece)?.piece?.color;
    if (moveColor === myColor) return;
    lastMove.forEach((move) => {
      setGame((oldGame) => ({
        ...oldGame,
        [move.id]: move,
      }));

      if (
        move.piece
        && game[move.id].piece
        && game[move.id].piece?.name === PieceTypes.KING
        && game[move.id].piece?.color === myColor
      ) {
        setGameState(move.piece.color === 'black' ? GameStates.ENDED_BLACK_WIN : GameStates.ENDED_WHITE_WIN);
      }
    });
  }, [lastMove]);

  const hasPawn = (square: BoardSquare): boolean => game[square.id].piece?.name === PieceTypes.PAWN;

  const promotionSquaresWithPawns = (): BoardSquare[]=> {
    const squares = [];

    if (hasPawn(game[1]) && game[1].piece?.color === myColor) squares.push(game[1]);
    if (hasPawn(game[2]) && game[2].piece?.color === myColor) squares.push(game[2]);
    if (hasPawn(game[3]) && game[3].piece?.color === myColor) squares.push(game[3]);
    if (hasPawn(game[4]) && game[4].piece?.color === myColor) squares.push(game[4]);
    if (hasPawn(game[5]) && game[5].piece?.color === myColor) squares.push(game[5]);
    if (hasPawn(game[6]) && game[6].piece?.color === myColor) squares.push(game[6]);
    if (hasPawn(game[7]) && game[7].piece?.color === myColor) squares.push(game[7]);
    if (hasPawn(game[8]) && game[8].piece?.color === myColor) squares.push(game[8]);
    if (hasPawn(game[57]) && game[57].piece?.color === myColor) squares.push(game[57]);
    if (hasPawn(game[58]) && game[58].piece?.color === myColor) squares.push(game[58]);
    if (hasPawn(game[59]) && game[59].piece?.color === myColor) squares.push(game[59]);
    if (hasPawn(game[60]) && game[60].piece?.color === myColor) squares.push(game[60]);
    if (hasPawn(game[61]) && game[61].piece?.color === myColor) squares.push(game[61]);
    if (hasPawn(game[62]) && game[62].piece?.color === myColor) squares.push(game[62]);
    if (hasPawn(game[63]) && game[63].piece?.color === myColor) squares.push(game[63]);
    if (hasPawn(game[64]) && game[64].piece?.color === myColor) squares.push(game[64]);

    return squares;
  };

  const generateCooldownInterval = (cooldown: number, targetSquareId: number) => {
    const progressInterval = setInterval(() => {
      setGame((oldGame) => {
        if (!oldGame[targetSquareId].cooldownTimers) {
          clearInterval(progressInterval);
          return {
            ...oldGame,
            [targetSquareId]: {
              ...oldGame[targetSquareId],
              cooldownProgress: 0,
            },
          };
        } else {
          return {
            ...oldGame,
            [targetSquareId]: {
              ...oldGame[targetSquareId],
              cooldownProgress: oldGame[targetSquareId].cooldownProgress + 10,
            },
          };
        };
      });
    }, cooldown / 10);

    return progressInterval;
  };

  const generateCooldownTimeout = (cooldown: number, targetSquareId: number) => {
    const cooldownTimer = setTimeout(() => {
      setGame((oldGame) => ({
        ...oldGame,
        [targetSquareId]: {
          ...oldGame[targetSquareId],
          cooldownTimers: null,
        },
      }));
    }, cooldown);

    return cooldownTimer;
  };

  const openPromotionPanel = useCallback((square: BoardSquare) => {
    if (square.showPromotionPanel) return;
    setGame((oldGame) => ({
      ...oldGame,
      [square.id]: {
        ...oldGame[square.id],
        showPromotionPanel: true,
      },
    }));
  }, [game]);

  const closePromotionPanel = useCallback((square: BoardSquare) => {
    if (!square.showPromotionPanel) return;
    setGame((oldGame) => ({
      ...oldGame,
      [square.id]: {
        ...oldGame[square.id],
        showPromotionPanel: false,
      },
    }));
  }, [game]);

  const promotePawn = useCallback((square: BoardSquare, promoteTo: PieceTypes.QUEEN | PieceTypes.ROOK | PieceTypes.BISHOP | PieceTypes.KNIGHT) => {
    const generateNewPiece = () => {
      switch (promoteTo) {
        case PieceTypes.QUEEN:
          return new Queen(square.id, square.piece!.color);
        case PieceTypes.ROOK:
          return new Rook(square.id, square.piece!.color);
        case PieceTypes.BISHOP:
          return new Bishop(square.id, square.piece!.color);
        case PieceTypes.KNIGHT:
          return new Knight(square.id, square.piece!.color);
      };
    };

    const newPiece = generateNewPiece();

    postToMovesFirebase([{
      ...game[square.id],
      piece: newPiece,
      showPromotionPanel: false,
    }]);

    setGame((oldGame) => ({
      ...oldGame,
      [square.id]: {
        ...oldGame[square.id],
        piece: newPiece,
      },
    }));

    closePromotionPanel(square);
  }, [game]);

  const movePiece = useCallback((piece: Piece, currentSquare: BoardSquare, targetSquare: BoardSquare) => {
    const mainMoveInterval = generateCooldownInterval(piece.cooldown, targetSquare.id);
    const mainMoveTimeout = generateCooldownTimeout(piece.cooldown, targetSquare.id);
    let castleRookInterval: ReturnType<typeof setInterval>;
    let castleRookTimeout: ReturnType<typeof setTimeout>;

    let rookMoveForFirebase;
    let rookOldSquareForFirebase;
    let enPassantCaptureForFirebase;

    // reset timers on a square after capture
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

    // move piece from old square to new square and initiate cooldown
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
        cooldownTimers: {
          interval: mainMoveInterval,
          timeout: mainMoveTimeout,
        },
      },
    }));

    // rook move if castle king side
    if (
      piece.name === PieceTypes.KING
      && targetSquare.id === currentSquare.id + 2
    ) {
      switch (piece.color) {
        case 'white':
          castleRookInterval = generateCooldownInterval(pieceValues[PieceTypes.ROOK].cooldown, 6);
          castleRookTimeout = generateCooldownTimeout(pieceValues[PieceTypes.ROOK].cooldown, 6);

          rookOldSquareForFirebase = {
            ...game[8],
            piece: null, 
          };

          rookMoveForFirebase = {
            ...game[6],
            piece: game[8].piece,
          };

          delete rookMoveForFirebase.piece?.moveIsValid;

          setGame((oldGame) => ({
            ...oldGame,
            8: {
              ...oldGame[8],
              piece: undefined,
            },
            6: {
              ...oldGame[6],
              piece: {
                ...oldGame[8].piece!,
                moveIsValid: oldGame[8].piece!.moveIsValid,
                canCastle: false,
              },
              cooldownTimers: {
                interval: castleRookInterval,
                timeout: castleRookTimeout,
              },
            },
          }));
          break;
          case 'black':
            castleRookInterval = generateCooldownInterval(pieceValues[PieceTypes.ROOK].cooldown, 62);
            castleRookTimeout = generateCooldownTimeout(pieceValues[PieceTypes.ROOK].cooldown, 62);
            
            rookOldSquareForFirebase = {
              ...game[64],
              piece: null, 
            };

            rookMoveForFirebase = {
              ...game[62],
              piece: game[64].piece,
            };

            delete rookMoveForFirebase.piece?.moveIsValid;

            setGame((oldGame) => ({
              ...oldGame,
              64: {
                ...oldGame[64],
                piece: undefined,
              },
              62: {
                ...oldGame[62],
                piece: {
                  ...oldGame[64].piece!,
                  moveIsValid: oldGame[64].piece!.moveIsValid,
                  canCastle: false,
                },
                // piece: oldGame[64].piece,
                cooldownTimers: {
                  interval: castleRookInterval,
                  timeout: castleRookTimeout,
                },
              },
            }));
          break;
          default: return null;  
      }
    }

    // rook move if castle queen side
    if (
      piece.name === PieceTypes.KING
      && targetSquare.id === currentSquare.id - 2
    ) {
      switch (piece.color) {
        case 'white':
          castleRookInterval = generateCooldownInterval(pieceValues[PieceTypes.ROOK].cooldown, 4);
          castleRookTimeout = generateCooldownTimeout(pieceValues[PieceTypes.ROOK].cooldown, 4);

          rookOldSquareForFirebase = {
            ...game[1],
            piece: null, 
          };

          rookMoveForFirebase = {
            ...game[4],
            piece: game[1].piece,
          };

          delete rookMoveForFirebase.piece?.moveIsValid;

          setGame((oldGame) => ({
            ...oldGame,
            1: {
              ...oldGame[1],
              piece: undefined,
            },
            4: {
              ...oldGame[4],
              // piece: oldGame[1].piece,
              piece: {
                ...oldGame[1].piece!,
                moveIsValid: oldGame[1].piece!.moveIsValid,
                canCastle: false,
              },
              cooldownTimers: {
                interval: castleRookInterval,
                timeout: castleRookTimeout,
              },
            },
          }));
          break;
          case 'black':
            castleRookInterval = generateCooldownInterval(pieceValues[PieceTypes.ROOK].cooldown, 60);
            castleRookTimeout = generateCooldownTimeout(pieceValues[PieceTypes.ROOK].cooldown, 60);
            
            rookOldSquareForFirebase = {
              ...game[57],
              piece: null, 
            };

            rookMoveForFirebase = {
              ...game[60],
              piece: game[57].piece,
            };

            delete rookMoveForFirebase.piece?.moveIsValid;
            setGame((oldGame) => ({
              ...oldGame,
              57: {
                ...oldGame[57],
                piece: undefined,
              },
              60: {
                ...oldGame[60],
                // piece: oldGame[57].piece,
                piece: {
                  ...oldGame[57].piece!,
                  moveIsValid: oldGame[57].piece!.moveIsValid,
                  canCastle: false,
                },
                cooldownTimers: {
                  interval: castleRookInterval,
                  timeout: castleRookTimeout,
                },
              },
            }));
          break;
          default: return null;  
      }
    }

    // remove pawn captured en passant left
    if (
      piece.name === PieceTypes.PAWN
      && !!game[currentSquare.id - 1].piece?.enPassantPossible
      && game[currentSquare.id - 1].piece?.color !== piece.color
      && !(targetSquare.id === currentSquare.id + 8 || targetSquare.id === currentSquare.id - 8)
    ) {
      enPassantCaptureForFirebase = {
        ...game[currentSquare.id - 1],
        piece: null,
      };

      setGame((oldGame) => ({
          ...oldGame,
          [currentSquare.id - 1]: {
            ...oldGame[currentSquare.id - 1],
            piece: undefined,
          },
      }));
    }

    // remove pawn captured en passant right
    if (
      piece.name === PieceTypes.PAWN
      && !!game[currentSquare.id + 1].piece?.enPassantPossible
      && game[currentSquare.id + 1].piece?.color !== piece.color
      && !(targetSquare.id === currentSquare.id + 8 || targetSquare.id === currentSquare.id - 8)
    ) {
      enPassantCaptureForFirebase = {
        ...game[currentSquare.id + 1],
        piece: null,
      };

      setGame((oldGame) => ({
        ...oldGame,
        [currentSquare.id + 1]: {
          ...oldGame[currentSquare.id + 1],
          piece: undefined,
        },
      }));
    }

    const sanitizedPiece = piece;
    delete sanitizedPiece.moveIsValid;

    const firebaseMoves = [
      { ...currentSquare, piece: null },
      { ...targetSquare,
        piece: {
          ...sanitizedPiece,
          enPassantPossible: canBeCapturedEnPassant(piece, currentSquare, targetSquare) ? true : false,
          canCastle: false,
        },
      },
    ];

    if (rookMoveForFirebase) firebaseMoves.push(rookMoveForFirebase!);
    if (rookOldSquareForFirebase) firebaseMoves.push(rookOldSquareForFirebase);
    if (enPassantCaptureForFirebase) firebaseMoves.push(enPassantCaptureForFirebase);

    postToMovesFirebase(firebaseMoves);

    checkForWinCondition(targetSquare);
  }, [game, gameState]);

  // check for draw conditions
  useEffect(() => {
    if (convertBoardToMatrix(game).filter((sqr: BoardSquare) => sqr.piece && sqr.piece.name !== PieceTypes.KING).length === 0) {
      setGameState(GameStates.ENDED_DRAW);
    }
  }, [game]);

  // check for pawn on promotion square
  useEffect(() => {
    const squares = promotionSquaresWithPawns();
    if (!squares.length) return;
    squares.forEach((sqr) => openPromotionPanel(sqr));
  }, [game]);

  return (
    <GameContext.Provider value={{ game, gameState, movePiece, promotePawn }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameController = () => {
  const values = useContext(GameContext);
  
  if (!values) throw new Error('useGameController must be called within a GameProvider');

  return values;
};
