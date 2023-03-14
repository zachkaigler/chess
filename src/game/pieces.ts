import { BoardSquare, Board, getRankById, getColBySquare } from "./game";

export enum PieceTypes {
  KING = 'king',
  QUEEN = 'queen',
  ROOK = 'rook',
  BISHOP = 'bishop',
  KNIGHT = 'knight',
  PAWN = 'pawn',
};

export class Piece {
  color: 'white' | 'black';
  startingSqrId: number;
  abb: string | null;
  name: PieceTypes;
  cooldown: number;
  enPassantPossible?: boolean;
  moveIsValid?(currentSquare: BoardSquare, targetSquare: BoardSquare, board: Board): boolean
}

export const canBeCapturedEnPassant = (piece: Piece, currentSquare: BoardSquare, targetSquare: BoardSquare): boolean => (
  piece.name === PieceTypes.PAWN
  && currentSquare.id === piece.startingSqrId
  && (
    targetSquare.id === currentSquare.id + 16
    || targetSquare.id === currentSquare.id - 16
  )
);

export class Pawn extends Piece {
  constructor(startingSqrId: number, color: 'white' | 'black') {
    super();
    this.color = color;
    this.startingSqrId = startingSqrId;
    this.abb = null;
    this.name = PieceTypes.PAWN;
    this.cooldown = 1000;
    this.enPassantPossible = false;
  }

  moveIsValid(currentSquare: BoardSquare, targetSquare: BoardSquare, board: Board): boolean {
    const hasPieceToCapture = () => {
      if (this.color === 'white') return (
        targetSquare.id === currentSquare.id + 9 && board[targetSquare.id].piece && board[targetSquare.id].piece?.color !== this.color
        || targetSquare.id === currentSquare.id + 9 && !targetSquare.piece && board[currentSquare.id + 1].piece && board[currentSquare.id + 1].piece?.enPassantPossible && board[targetSquare.id + 1].piece?.color !== this.color
        || targetSquare.id === currentSquare.id + 7 && targetSquare.piece && board[targetSquare.id].piece?.color !== this.color
        || targetSquare.id === currentSquare.id + 7 && !targetSquare.piece && board[currentSquare.id - 1].piece && board[currentSquare.id - 1].piece?.enPassantPossible && board[targetSquare.id - 1].piece?.color !== this.color
      );
      return (
        targetSquare.id === currentSquare.id - 9 && board[targetSquare.id].piece && board[targetSquare.id].piece?.color !== this.color
        || targetSquare.id === currentSquare.id - 9 && !targetSquare.piece && board[currentSquare.id - 1].piece && board[currentSquare.id - 1].piece?.enPassantPossible && board[targetSquare.id - 1].piece?.color !== this.color
        || targetSquare.id === currentSquare.id - 7 && targetSquare.piece && board[targetSquare.id].piece?.color !== this.color
        || targetSquare.id === currentSquare.id - 7 && !targetSquare.piece && board[currentSquare.id + 1].piece && board[currentSquare.id + 1].piece?.enPassantPossible && board[targetSquare.id + 1].piece?.color !== this.color
      );
    };

    switch (this.color) {
      case 'white':
        if (currentSquare.id === this.startingSqrId) {
          if (board[currentSquare.id + 8].piece && !hasPieceToCapture()) return false;
          if (
            targetSquare.id === currentSquare.id + 8 && !targetSquare.piece
            || targetSquare.id === currentSquare.id + 16 && !targetSquare.piece
            || hasPieceToCapture()
          ) {
            return true;
          } else {
            return false;
          }
        } else if (targetSquare.id === currentSquare.id + 8 && !targetSquare.piece) {
          return true;
        } else if (hasPieceToCapture()) {
          return true;
        } else {
          return false;
        }
      case 'black':
        if (currentSquare.id === this.startingSqrId) {
          if (board[currentSquare.id - 8].piece  && !hasPieceToCapture()) return false;
          if (
            targetSquare.id === currentSquare.id - 8 && !targetSquare.piece
            || targetSquare.id === currentSquare.id - 16 && !targetSquare.piece
            || hasPieceToCapture()
          ) {
            return true;
          } else {
            return false;
          }
        } else if (targetSquare.id === currentSquare.id - 8) {
          return true;
        } else if (hasPieceToCapture()) {
          return true;
        }else {
          return false;
        }
    };
  };
};

const checkRookRules = (currentSquare: BoardSquare, targetSquare: BoardSquare, board: Board) => {
    const targetSquareRank = getRankById(targetSquare.id);
    const targetSquareCol = getColBySquare(targetSquare);
    const currentSquareRank = getRankById(currentSquare.id);
    const currentSquareCol = getColBySquare(currentSquare);

    const currentRank = Object.values(board).filter((sqr: BoardSquare) => getRankById(sqr.id) === currentSquareRank);
    const currentCol = Object.values(board).filter((sqr: BoardSquare) => getColBySquare(sqr) === currentSquareCol);

    const piecesOnSameRankToRight = currentRank.filter((sqr: BoardSquare) => sqr.piece && sqr.id > currentSquare.id);
    const piecesOnSameRankToLeft = currentRank.filter((sqr: BoardSquare) => sqr.piece && sqr.id < currentSquare.id);
    const piecesOnSameColAbove = currentCol.filter((sqr: BoardSquare) => sqr.piece && sqr.id > currentSquare.id);
    const piecesOnSameColBelow = currentCol.filter((sqr: BoardSquare) => sqr.piece && sqr.id < currentSquare.id);

    const obstructingRightRankPiece = piecesOnSameRankToRight.sort()[0];
    const obstructingLeftRankPiece = piecesOnSameRankToLeft.sort()[piecesOnSameRankToLeft.length - 1];
    const obstructingAboveColPiece = piecesOnSameColAbove.sort()[0];
    const obstructingBelowColPiece = piecesOnSameColBelow.sort()[piecesOnSameColBelow.length - 1];

    const spacesShareCol = currentSquareCol === targetSquareCol;
    const spacesShareRank = targetSquareRank === currentSquareRank;

    return (
      targetSquare.piece?.color !== currentSquare.piece?.color 
    ) && (
      targetSquareCol === currentSquareCol
      || targetSquareRank === currentSquareRank
    ) && (
      !((targetSquare.id > obstructingRightRankPiece?.id) && spacesShareRank)
      && !((targetSquare.id > obstructingAboveColPiece?.id) && spacesShareCol)
      && !((targetSquare.id < obstructingLeftRankPiece?.id) && spacesShareRank)
      && !((targetSquare.id < obstructingBelowColPiece?.id)  && spacesShareCol)
    );
};

export class Rook extends Piece {
  constructor(startingSqrId: number, color: 'white' | 'black') {
    super();
    this.color = color;
    this.startingSqrId = startingSqrId;
    this.abb = 'R';
    this.name = PieceTypes.ROOK;
    this.cooldown = 5000;
  };

  moveIsValid(currentSquare: BoardSquare, targetSquare: BoardSquare, board: Board): boolean {
    return checkRookRules(currentSquare, targetSquare, board);
  };
};

const checkBishopRules = (currentSquare: BoardSquare, targetSquare: BoardSquare, board: Board) => {
  const rightDiagMemberSquares = Object.values(board).filter((sqr: BoardSquare) => Math.abs(sqr.id - currentSquare.id) % 9 === 0);
  const leftDiagMemberSquares = Object.values(board).filter((sqr: BoardSquare) => Math.abs(sqr.id - currentSquare.id) % 7 === 0);

  const piecesOnRightDiagAbove = rightDiagMemberSquares.filter((sqr: BoardSquare) => sqr.piece && sqr.id > currentSquare.id);
  const piecesOnRightDiagBelow = rightDiagMemberSquares.filter((sqr: BoardSquare) => sqr.piece && sqr.id < currentSquare.id);
  const piecesOnLeftDiagAbove = leftDiagMemberSquares.filter((sqr: BoardSquare) => sqr.piece && sqr.id > currentSquare.id);
  const piecesOnLeftDiagBelow = leftDiagMemberSquares.filter((sqr: BoardSquare) => sqr.piece && sqr.id < currentSquare.id);

  const obstructingRightAbovePiece = piecesOnRightDiagAbove.sort()[0];
  const obstructingRightBelowPiece = piecesOnRightDiagBelow.sort()[piecesOnRightDiagBelow.length - 1];
  const obstructingLeftAbovePiece = piecesOnLeftDiagAbove.sort()[0];
  const obstructingLeftBelowPiece = piecesOnLeftDiagBelow.sort()[piecesOnLeftDiagBelow.length - 1];

  return (
    targetSquare.piece?.color !== currentSquare.piece?.color 
  ) && (
    Math.abs(targetSquare.id - currentSquare.id) % 9 === 0
    || Math.abs(targetSquare.id - currentSquare.id) % 7 === 0
  ) && (
    !(targetSquare.id > obstructingRightAbovePiece?.id && rightDiagMemberSquares.find((sqr) => sqr.id === targetSquare.id))
    && !(targetSquare.id > obstructingLeftAbovePiece?.id && leftDiagMemberSquares.find((sqr) => sqr.id === targetSquare.id))
    && !(targetSquare.id < obstructingRightBelowPiece?.id && rightDiagMemberSquares.find((sqr) => sqr.id === targetSquare.id))
    && !(targetSquare.id < obstructingLeftBelowPiece?.id && leftDiagMemberSquares.find((sqr) => sqr.id === targetSquare.id))
  ) && (
    targetSquare.color === board[currentSquare.id].color
  );
};

export class Bishop extends Piece {
  constructor(startingSqrId: number, color: 'white' | 'black') {
    super();
    this.color = color;
    this.startingSqrId = startingSqrId;
    this.abb = 'B';
    this.name = PieceTypes.BISHOP;
    this.cooldown = 3000;
  };

  moveIsValid(currentSquare: BoardSquare, targetSquare: BoardSquare, board: Board): boolean {
    return checkBishopRules(currentSquare, targetSquare, board);
  };
};

const hasEdgeMismatch = (
  currentSquareCol: string,
  currentSquareRank: number,
  targetSquareCol: string,
  targetSquareRank: number,
): Boolean => (
  currentSquareCol === 'a' && targetSquareCol === 'h'
  || currentSquareCol === 'a' && targetSquareCol === 'g'
  || currentSquareCol === 'b' && targetSquareCol === 'h'
  || currentSquareCol === 'b' && targetSquareCol === 'g'
  || currentSquareCol === 'h' && targetSquareCol === 'a'
  || currentSquareCol === 'h' && targetSquareCol === 'b'
  || currentSquareCol === 'g' && targetSquareCol === 'a'
  || currentSquareCol === 'g' && targetSquareCol === 'b'
  || currentSquareRank === 1 && targetSquareRank === 8
  || currentSquareRank === 1 && targetSquareRank === 7
  || currentSquareRank === 2 && targetSquareRank === 8
  || currentSquareRank === 2 && targetSquareRank === 7
  || currentSquareRank === 8 && targetSquareRank === 1
  || currentSquareRank === 8 && targetSquareRank === 2
  || currentSquareRank === 7 && targetSquareRank === 1
  || currentSquareRank === 7 && targetSquareRank === 2
);

export class Knight extends Piece {
  constructor(startingSqrId: number, color: 'white' | 'black') {
    super();
    this.color = color;
    this.startingSqrId = startingSqrId;
    this.abb = 'N';
    this.name = PieceTypes.KNIGHT;
    this.cooldown = 3000;
  };

  moveIsValid(currentSquare: BoardSquare, targetSquare: BoardSquare, board: Board): boolean {
    const currentSquareCol = getColBySquare(currentSquare);
    const currentSquareRank = getRankById(currentSquare.id);
    const targetSquareCol = getColBySquare(targetSquare);
    const targetSquareRank = getRankById(targetSquare.id);
 
    return (
      targetSquare.piece?.color !== this.color
    ) && (
      currentSquare.id - targetSquare.id === -17
      || currentSquare.id - targetSquare.id === 17
      || currentSquare.id - targetSquare.id === 10
      || currentSquare.id - targetSquare.id === -10
      || currentSquare.id - targetSquare.id === 6
      || currentSquare.id - targetSquare.id === -6
      || currentSquare.id - targetSquare.id === 15
      || currentSquare.id - targetSquare.id === -15
    ) && (
      !hasEdgeMismatch(currentSquareCol, currentSquareRank, targetSquareCol, targetSquareRank)
    );
  };
};

export class Queen extends Piece {
  constructor(startingSqrId: number, color: 'white' | 'black') {
    super();
    this.color = color;
    this.startingSqrId = startingSqrId;
    this.abb = 'B';
    this.name = PieceTypes.QUEEN;
    this.cooldown = 9000;
  };

  moveIsValid(currentSquare: BoardSquare, targetSquare: BoardSquare, board: Board): boolean {
    return checkBishopRules(currentSquare, targetSquare, board) || checkRookRules(currentSquare, targetSquare, board);
  };
};

export class King extends Piece {
  constructor(startingSqrId: number, color: 'white' | 'black') {
    super();
    this.color = color;
    this.startingSqrId = startingSqrId;
    this.abb = 'K';
    this.name = PieceTypes.KING;
    this.cooldown = 5000;
  };

  moveIsValid(currentSquare: BoardSquare, targetSquare: BoardSquare, board: Board): boolean {
    const currentSquareCol = getColBySquare(currentSquare);
    const currentSquareRank = getRankById(currentSquare.id);
    const targetSquareCol = getColBySquare(targetSquare);
    const targetSquareRank = getRankById(targetSquare.id);

    return (
      targetSquare.piece?.color !== this.color
    ) && (
      targetSquare.id === currentSquare.id - 1
      || targetSquare.id === currentSquare.id + 1
      || targetSquare.id === currentSquare.id + 9
      || targetSquare.id === currentSquare.id - 9
      || targetSquare.id === currentSquare.id + 8
      || targetSquare.id === currentSquare.id - 8
      || targetSquare.id === currentSquare.id + 7
      || targetSquare.id === currentSquare.id - 7
    ) && (
      !hasEdgeMismatch(currentSquareCol, currentSquareRank, targetSquareCol, targetSquareRank)
    );
  };
};