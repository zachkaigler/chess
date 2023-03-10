import { BoardSquare, Board, getRankById, getColBySquare } from "./board";

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
  currentSqrId: number;
  abb: string | null;
  name: PieceTypes;
  cooldown: number;
  moveIsValid?(targetSquare: BoardSquare, board: Board): boolean
}

export class Pawn extends Piece {
  constructor(startingSqrId: number, color: 'white' | 'black') {
    super();
    this.color = color;
    this.startingSqrId = startingSqrId;
    this.currentSqrId = startingSqrId;
    this.abb = null;
    this.name = PieceTypes.PAWN;
    this.cooldown = 1000;
  }

  moveIsValid(targetSquare: BoardSquare, board: Board): boolean {
    const hasPieceToCapture = () => {
      if (this.color === 'white') return (
        targetSquare.id === this.currentSqrId + 9 && board[targetSquare.id].piece && board[targetSquare.id].piece?.color !== this.color
        || targetSquare.id === this.currentSqrId + 7 && targetSquare.piece && board[targetSquare.id].piece?.color !== this.color
      );
      return (
        targetSquare.id === this.currentSqrId - 9 && board[targetSquare.id].piece && board[targetSquare.id].piece?.color !== this.color
        || targetSquare.id === this.currentSqrId - 7 && targetSquare.piece && board[targetSquare.id].piece?.color !== this.color
      )
    };

    switch (this.color) {
      case 'white':
        if (this.currentSqrId === this.startingSqrId) {
          if (board[this.currentSqrId + 8].piece && !hasPieceToCapture()) return false;

          if (
            targetSquare.id === this.currentSqrId + 8 && !targetSquare.piece
            || targetSquare.id === this.currentSqrId + 16 && !targetSquare.piece
            || hasPieceToCapture()
          ) {
            return true;
          } else {
            return false;
          }
        } else if (targetSquare.id === this.currentSqrId + 8 && !targetSquare.piece) {
          return true;
        } else if (hasPieceToCapture()) {
          return true;
        } else {
          return false;
        }
      case 'black':
        if (this.currentSqrId === this.startingSqrId) {
          if (board[this.currentSqrId - 8].piece  && !hasPieceToCapture()) return false;
          if (
            targetSquare.id === this.currentSqrId - 8 && !targetSquare.piece
            || targetSquare.id === this.currentSqrId - 16 && !targetSquare.piece
          ) {
            return true;
          } else {
            return false;
          }
        } else if (targetSquare.id === this.currentSqrId - 8) {
          return true;
        } else if (hasPieceToCapture()) {
          return true;
        }else {
          return false;
        }
    };
  };
};

const checkRookRules = (targetSquare: BoardSquare, board: Board, piece: Piece) => {
    const targetSquareRank = getRankById(targetSquare.id);
    const targetSquareCol = getColBySquare(targetSquare);
    const currentSquareRank = getRankById(piece.currentSqrId);
    const currentSquareCol = getColBySquare(board[piece.currentSqrId]);

    const currentRank = Object.values(board).filter((sqr: BoardSquare) => getRankById(sqr.id) === currentSquareRank);
    const currentCol = Object.values(board).filter((sqr: BoardSquare) => getColBySquare(sqr) === currentSquareCol);

    const piecesOnSameRankToRight = currentRank.filter((sqr: BoardSquare) => sqr.piece && sqr.id > piece.currentSqrId);
    const piecesOnSameRankToLeft = currentRank.filter((sqr: BoardSquare) => sqr.piece && sqr.id < piece.currentSqrId);
    const piecesOnSameColAbove = currentCol.filter((sqr: BoardSquare) => sqr.piece && sqr.id > piece.currentSqrId);
    const piecesOnSameColBelow = currentCol.filter((sqr: BoardSquare) => sqr.piece && sqr.id < piece.currentSqrId);

    const obstructingRightRankPiece = piecesOnSameRankToRight.sort()[0];
    const obstructingLeftRankPiece = piecesOnSameRankToLeft.sort()[piecesOnSameRankToLeft.length - 1];
    const obstructingAboveColPiece = piecesOnSameColAbove.sort()[0];
    const obstructingBelowColPiece = piecesOnSameColBelow.sort()[piecesOnSameColBelow.length - 1];

    const spacesShareCol = currentSquareCol === targetSquareCol;
    const spacesShareRank = targetSquareRank === currentSquareRank;

    return (
      targetSquare.piece?.color !== piece.color 
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
    this.currentSqrId = startingSqrId;
    this.abb = 'R';
    this.name = PieceTypes.ROOK;
    this.cooldown = 5000;
  };

  moveIsValid(targetSquare: BoardSquare, board: Board): boolean {
    return checkRookRules(targetSquare, board, this);
  };
};

const checkBishopRules = (targetSquare: BoardSquare, board: Board, piece: Piece) => {
  const rightDiagMemberSquares = Object.values(board).filter((sqr: BoardSquare) => Math.abs(sqr.id - piece.currentSqrId) % 9 === 0);
  const leftDiagMemberSquares = Object.values(board).filter((sqr: BoardSquare) => Math.abs(sqr.id - piece.currentSqrId) % 7 === 0);

  const piecesOnRightDiagAbove = rightDiagMemberSquares.filter((sqr: BoardSquare) => sqr.piece && sqr.id > piece.currentSqrId);
  const piecesOnRightDiagBelow = rightDiagMemberSquares.filter((sqr: BoardSquare) => sqr.piece && sqr.id < piece.currentSqrId);
  const piecesOnLeftDiagAbove = leftDiagMemberSquares.filter((sqr: BoardSquare) => sqr.piece && sqr.id > piece.currentSqrId);
  const piecesOnLeftDiagBelow = leftDiagMemberSquares.filter((sqr: BoardSquare) => sqr.piece && sqr.id < piece.currentSqrId);

  const obstructingRightAbovePiece = piecesOnRightDiagAbove.sort()[0];
  const obstructingRightBelowPiece = piecesOnRightDiagBelow.sort()[piecesOnRightDiagBelow.length - 1];
  const obstructingLeftAbovePiece = piecesOnLeftDiagAbove.sort()[0];
  const obstructingLeftBelowPiece = piecesOnLeftDiagBelow.sort()[piecesOnLeftDiagBelow.length - 1];

  return (
    targetSquare.piece?.color !== piece.color 
  ) && (
    Math.abs(targetSquare.id - piece.currentSqrId) % 9 === 0
    || Math.abs(targetSquare.id - piece.currentSqrId) % 7 === 0
  ) && (
    !(targetSquare.id > obstructingRightAbovePiece?.id && rightDiagMemberSquares.find((sqr) => sqr.id === targetSquare.id))
    && !(targetSquare.id > obstructingLeftAbovePiece?.id && leftDiagMemberSquares.find((sqr) => sqr.id === targetSquare.id))
    && !(targetSquare.id < obstructingRightBelowPiece?.id && rightDiagMemberSquares.find((sqr) => sqr.id === targetSquare.id))
    && !(targetSquare.id < obstructingLeftBelowPiece?.id && leftDiagMemberSquares.find((sqr) => sqr.id === targetSquare.id))
  ) && (
    targetSquare.color === board[piece.currentSqrId].color
  );
};

export class Bishop extends Piece {
  constructor(startingSqrId: number, color: 'white' | 'black') {
    super();
    this.color = color;
    this.startingSqrId = startingSqrId;
    this.currentSqrId = startingSqrId;
    this.abb = 'B';
    this.name = PieceTypes.BISHOP;
    this.cooldown = 3000;
  };

  moveIsValid(targetSquare: BoardSquare, board: Board): boolean {
    return checkBishopRules(targetSquare, board, this);
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
    this.currentSqrId = startingSqrId;
    this.abb = 'N';
    this.name = PieceTypes.KNIGHT;
    this.cooldown = 3000;
  };

  moveIsValid(targetSquare: BoardSquare, board: Board): boolean {
    const currentSquareCol = getColBySquare(board[this.currentSqrId]);
    const currentSquareRank = getRankById(this.currentSqrId);
    const targetSquareCol = getColBySquare(targetSquare);
    const targetSquareRank = getRankById(targetSquare.id);
 
    return (
      targetSquare.piece?.color !== this.color
    ) && (
      this.currentSqrId - targetSquare.id === -17
      || this.currentSqrId - targetSquare.id === 17
      || this.currentSqrId - targetSquare.id === 10
      || this.currentSqrId - targetSquare.id === -10
      || this.currentSqrId - targetSquare.id === 6
      || this.currentSqrId - targetSquare.id === -6
      || this.currentSqrId - targetSquare.id === 15
      || this.currentSqrId - targetSquare.id === -15
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
    this.currentSqrId = startingSqrId;
    this.abb = 'B';
    this.name = PieceTypes.QUEEN;
    // this.icon = <PieceIcon piece={this} />;
    this.cooldown = 9000;
  };

  moveIsValid(targetSquare: BoardSquare, board: Board): boolean {
    return checkBishopRules(targetSquare, board, this) || checkRookRules(targetSquare, board, this);
  };
};


// TODO: controlled squares should not pass check
export class King extends Piece {
  constructor(startingSqrId: number, color: 'white' | 'black') {
    super();
    this.color = color;
    this.startingSqrId = startingSqrId;
    this.currentSqrId = startingSqrId;
    this.abb = 'K';
    this.name = PieceTypes.KING;
    this.cooldown = 5000;
  };

  moveIsValid(targetSquare: BoardSquare, board: Board): boolean {
    const currentSquareCol = getColBySquare(board[this.currentSqrId]);
    const currentSquareRank = getRankById(this.currentSqrId);
    const targetSquareCol = getColBySquare(targetSquare);
    const targetSquareRank = getRankById(targetSquare.id);

    return (
      targetSquare.piece?.color !== this.color
    ) && (
      targetSquare.id === this.currentSqrId - 1
      || targetSquare.id === this.currentSqrId + 1
      || targetSquare.id === this.currentSqrId + 9
      || targetSquare.id === this.currentSqrId - 9
      || targetSquare.id === this.currentSqrId + 8
      || targetSquare.id === this.currentSqrId - 8
      || targetSquare.id === this.currentSqrId + 7
      || targetSquare.id === this.currentSqrId - 7
    ) && (
      !hasEdgeMismatch(currentSquareCol, currentSquareRank, targetSquareCol, targetSquareRank)
    );
  };
};