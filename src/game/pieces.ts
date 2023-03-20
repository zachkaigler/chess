import { BoardSquare, Board, getRankById, getColBySquare } from "./game";

export enum PieceTypes {
  KING = 'king',
  QUEEN = 'queen',
  ROOK = 'rook',
  BISHOP = 'bishop',
  KNIGHT = 'knight',
  PAWN = 'pawn',
};

export const pieceValues = {
  [PieceTypes.KING]: {
    points: null,
    cooldown: 5000,
  },
  [PieceTypes.QUEEN]: {
    points: 9,
    cooldown: 9000,
  },
  [PieceTypes.ROOK]: {
    points: 5,
    cooldown: 5000,
  },
  [PieceTypes.BISHOP]: {
    points: 3,
    cooldown: 3000,
  },
  [PieceTypes.KNIGHT]: {
    points: 3,
    cooldown: 3000,
  },
  [PieceTypes.PAWN]: {
    points: 1,
    cooldown: 1000,
  },
}

export class Piece {
  color: 'white' | 'black';
  startingSqrId: number;
  abb: string | null;
  name: PieceTypes;
  value: number | null;
  cooldown: number;
  enPassantPossible: boolean;
  canCastle: boolean;
  moveIsValid?(currentSquare: BoardSquare, targetSquare: BoardSquare, board: Board): boolean;
}

export const canBeCapturedEnPassant = (piece: Piece, currentSquare: BoardSquare, targetSquare: BoardSquare): boolean => (
  piece.name === PieceTypes.PAWN
  && currentSquare.id === piece.startingSqrId
  && (
    targetSquare.id === currentSquare.id + 16
    || targetSquare.id === currentSquare.id - 16
  )
);

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

export class Pawn extends Piece {
  constructor(startingSqrId: number, color: 'white' | 'black') {
    super();
    this.color = color;
    this.startingSqrId = startingSqrId;
    this.abb = null;
    this.name = PieceTypes.PAWN;
    this.value = pieceValues[PieceTypes.PAWN].points;
    this.cooldown = pieceValues[PieceTypes.PAWN].cooldown;
    this.enPassantPossible = false;
    this.canCastle = false;
  }

  moveIsValid(currentSquare: BoardSquare, targetSquare: BoardSquare, board: Board): boolean {
    const hasPieceToCapture = () => {
      const targetSquareRank = getRankById(targetSquare.id);
      const targetSquareCol = getColBySquare(targetSquare);
      const currentSquareRank = getRankById(currentSquare.id);
      const currentSquareCol = getColBySquare(currentSquare);

      if (this.color === 'white') return (
        !hasEdgeMismatch(currentSquareCol, currentSquareRank, targetSquareCol, targetSquareRank)
        && (targetSquare.id === currentSquare.id + 9 && board[targetSquare.id].piece && board[targetSquare.id].piece?.color !== this.color
        || targetSquare.id === currentSquare.id + 9 && !targetSquare.piece && board[currentSquare.id + 1].piece && board[currentSquare.id + 1].piece?.enPassantPossible && board[targetSquare.id + 1].piece?.color !== this.color
        || targetSquare.id === currentSquare.id + 7 && targetSquare.piece && board[targetSquare.id].piece?.color !== this.color
        || targetSquare.id === currentSquare.id + 7 && !targetSquare.piece && board[currentSquare.id - 1].piece && board[currentSquare.id - 1].piece?.enPassantPossible && board[targetSquare.id - 1].piece?.color !== this.color)
      );
      return (
        !hasEdgeMismatch(currentSquareCol, currentSquareRank, targetSquareCol, targetSquareRank)
        && (targetSquare.id === currentSquare.id - 9 && board[targetSquare.id].piece && board[targetSquare.id].piece?.color !== this.color
        || targetSquare.id === currentSquare.id - 9 && !targetSquare.piece && board[currentSquare.id - 1].piece && board[currentSquare.id - 1].piece?.enPassantPossible && board[targetSquare.id - 1].piece?.color !== this.color
        || targetSquare.id === currentSquare.id - 7 && targetSquare.piece && board[targetSquare.id].piece?.color !== this.color
        || targetSquare.id === currentSquare.id - 7 && !targetSquare.piece && board[currentSquare.id + 1].piece && board[currentSquare.id + 1].piece?.enPassantPossible && board[targetSquare.id + 1].piece?.color !== this.color)
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
          if (board[currentSquare.id - 8].piece && !hasPieceToCapture()) return false;
          if (
            targetSquare.id === currentSquare.id - 8 && !targetSquare.piece
            || targetSquare.id === currentSquare.id - 16 && !targetSquare.piece
            || hasPieceToCapture()
          ) {
            return true;
          } else {
            return false;
          }
        } else if (targetSquare.id === currentSquare.id - 8 && !targetSquare.piece) {
          return true;
        } else if (hasPieceToCapture()) {
          return true;
        }else {
          return false;
        }
    };
  };
};

export class Rook extends Piece {
  constructor(startingSqrId: number, color: 'white' | 'black') {
    super();
    this.color = color;
    this.startingSqrId = startingSqrId;
    this.abb = 'R';
    this.name = PieceTypes.ROOK;
    this.value = pieceValues[PieceTypes.ROOK].points;
    this.cooldown = pieceValues[PieceTypes.ROOK].cooldown;
    this.canCastle = true;
    this.enPassantPossible = false;
  };

  moveIsValid(currentSquare: BoardSquare, targetSquare: BoardSquare, board: Board): boolean {
    return checkRookRules(currentSquare, targetSquare, board);
  };
};

export class Bishop extends Piece {
  constructor(startingSqrId: number, color: 'white' | 'black') {
    super();
    this.color = color;
    this.startingSqrId = startingSqrId;
    this.abb = 'B';
    this.name = PieceTypes.BISHOP;
    this.value = pieceValues[PieceTypes.BISHOP].points;
    this.cooldown = pieceValues[PieceTypes.BISHOP].cooldown;
    this.enPassantPossible = false;
    this.canCastle = false;
  };

  moveIsValid(currentSquare: BoardSquare, targetSquare: BoardSquare, board: Board): boolean {
    return checkBishopRules(currentSquare, targetSquare, board);
  };
};

export class Knight extends Piece {
  constructor(startingSqrId: number, color: 'white' | 'black') {
    super();
    this.color = color;
    this.startingSqrId = startingSqrId;
    this.abb = 'N';
    this.name = PieceTypes.KNIGHT;
    this.value = pieceValues[PieceTypes.KNIGHT].points;
    this.cooldown = pieceValues[PieceTypes.KNIGHT].cooldown;
    this.enPassantPossible = false;
    this.canCastle = false;
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
    this.value = pieceValues[PieceTypes.QUEEN].points;
    this.cooldown = pieceValues[PieceTypes.QUEEN].cooldown;
    this.enPassantPossible = false;
    this.canCastle = false;
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
    this.value = pieceValues[PieceTypes.KING].points;
    this.cooldown = pieceValues[PieceTypes.KING].cooldown;
    this.canCastle = true;
    this.enPassantPossible = false;
  };

  moveIsValid(currentSquare: BoardSquare, targetSquare: BoardSquare, board: Board): boolean {
    const currentSquareCol = getColBySquare(currentSquare);
    const currentSquareRank = getRankById(currentSquare.id);
    const targetSquareCol = getColBySquare(targetSquare);
    const targetSquareRank = getRankById(targetSquare.id);

    const getCastleStatus = () => {
      const kingSideAvailableWhite = !!(
        this.canCastle
        && board[8].piece?.canCastle
        && targetSquare.id === 7
        && !board[7].piece
        && !board[6].piece
      );
      const queenSideAvailableWhite = !!(
        this.canCastle
        && board[1].piece?.canCastle
        && targetSquare.id === 3
        && !board[4].piece
        && !board[3].piece
        && !board[2].piece
      );
      const kingSideAvailableBlack = !!(
        this.canCastle
        && board[64].piece?.canCastle
        && targetSquare.id === 63
        && !board[62].piece
        && !board[63].piece
      );
      const queenSideAvailableBlack = !!(
        this.canCastle
        && board[57].piece?.canCastle
        && targetSquare.id === 59
        && !board[60].piece
        && !board[59].piece
        && !board[58].piece
      );
      return {
        kingSideAvailableWhite,
        queenSideAvailableWhite,
        kingSideAvailableBlack,
        queenSideAvailableBlack,
      };
    };

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
      || getCastleStatus().kingSideAvailableWhite
      || getCastleStatus().queenSideAvailableWhite
      || getCastleStatus().kingSideAvailableBlack
      || getCastleStatus().queenSideAvailableBlack
    ) && (
      !hasEdgeMismatch(currentSquareCol, currentSquareRank, targetSquareCol, targetSquareRank)
    );
  };
};