import { BoardSquare, Board, getRankById, getColBySquare } from "./board";
import KnightIcon from "./components/pieces/KnightIcon/KnightIcon";
import PawnIcon from "./components/pieces/PawnIcon/PawnIcon";
import RookIcon from "./components/pieces/RookIcon/RookIcon";

// moving 1 square forward for white is +8 to id
// moving 1 square forward for black is -8 to id

export class Piece {
  color: 'white' | 'black';
  startingSqrId: number;
  currentSqrId: number;
  abb: string | null;
  name: string;
  icon: React.ReactNode;
  moveIsValid?(targetSquare: BoardSquare, board: Board): boolean
}

export class Pawn extends Piece {
  constructor(startingSqrId: number, color: 'white' | 'black') {
    super();
    this.color = color;
    this.startingSqrId = startingSqrId;
    this.currentSqrId = startingSqrId;
    this.abb = null;
    this.name = 'pawn';
    this.icon = <PawnIcon piece={this} />;
  }

  // TODO: account for diagonal capturing and squares that are taken
  moveIsValid(targetSquare: BoardSquare, board: Board): boolean {
    switch (this.color) {
      case 'white':
        if (this.currentSqrId === this.startingSqrId) {
          if (board[this.currentSqrId + 8].piece) return false;
          if (
            targetSquare.id === this.currentSqrId + 8 && !targetSquare.piece
            || targetSquare.id === this.currentSqrId + 16 && !targetSquare.piece
          ) {
            return true;
          } else {
            return false;
          }
        } else if (targetSquare.id === this.currentSqrId + 8 && !targetSquare.piece) {
          return true;
        } else {
          return false;
        }
      case 'black':
        if (this.currentSqrId === this.startingSqrId) {
          if (board[this.currentSqrId - 8].piece) return false;
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
        } else {
          return false;
        }
    }
  }
}

export class Rook extends Piece {
  constructor(startingSqrId: number, color: 'white' | 'black') {
    super();
    this.color = color;
    this.startingSqrId = startingSqrId;
    this.currentSqrId = startingSqrId;
    this.abb = 'R';
    this.name = 'rook';
    this.icon = <RookIcon piece={this} />;
  }

  moveIsValid(targetSquare: BoardSquare, board: Board): boolean {
    const targetSquareRank = getRankById(targetSquare.id);
    const targetSquareCol = getColBySquare(targetSquare);
    const currentSquareRank = getRankById(this.currentSqrId);
    const currentSquareCol = getColBySquare(board[this.currentSqrId]);

    const currentRank = Object.values(board).filter((sqr: BoardSquare) => getRankById(sqr.id) === currentSquareRank);
    const currentCol = Object.values(board).filter((sqr: BoardSquare) => getColBySquare(sqr) === currentSquareCol);

    const piecesOnSameRankToRight = currentRank.filter((sqr: BoardSquare) => sqr.piece && sqr.id > this.currentSqrId);
    const piecesOnSameRankToLeft = currentRank.filter((sqr: BoardSquare) => sqr.piece && sqr.id < this.currentSqrId);
    const piecesOnSameColAbove = currentCol.filter((sqr: BoardSquare) => sqr.piece && sqr.id > this.currentSqrId);
    const piecesOnSameColBelow = currentCol.filter((sqr: BoardSquare) => sqr.piece && sqr.id < this.currentSqrId);

    const obstructingRightRankPiece = piecesOnSameRankToRight.sort()[0];
    const obstructingLeftRankPiece = piecesOnSameRankToLeft.sort()[piecesOnSameRankToLeft.length - 1];
    const obstructingAboveColPiece = piecesOnSameColAbove.sort()[0];
    const obstructingBelowColPiece = piecesOnSameColBelow.sort()[piecesOnSameColBelow.length - 1];

    const spacesShareCol = currentSquareCol === targetSquareCol;
    const spacesShareRank = targetSquareRank === currentSquareRank;

    return (
      targetSquare.piece?.color !== this.color 
    ) && (
      targetSquareCol === currentSquareCol
      || targetSquareRank === currentSquareRank
    ) && (
      !((targetSquare.id > obstructingRightRankPiece?.id) && spacesShareRank)
      && !((targetSquare.id > obstructingAboveColPiece?.id) && spacesShareCol)
      && !((targetSquare.id < obstructingLeftRankPiece?.id) && spacesShareRank)
      && !((targetSquare.id < obstructingBelowColPiece?.id)  && spacesShareCol)
    );
  }
}

export class Knight extends Piece {
  constructor(startingSqrId: number, color: 'white' | 'black') {
    super();
    this.color = color;
    this.startingSqrId = startingSqrId;
    this.currentSqrId = startingSqrId;
    this.abb = 'N';
    this.name = 'knight';
    this.icon = <KnightIcon piece={this} />;
  }

  moveIsValid(targetSquare: BoardSquare, board: Board): boolean {
    const currentSquareCol = getColBySquare(board[this.currentSqrId]);
    const currentSquareRank = getRankById(this.currentSqrId);
    const targetSquareCol = getColBySquare(targetSquare);
    const targetSquareRank = getRankById(targetSquare.id);
    const mismatchedEdge = (
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
      !mismatchedEdge
    );
  }
}