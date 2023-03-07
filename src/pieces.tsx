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
  moveIsValid(targetSquare: BoardSquare): boolean {
    switch (this.color) {
      case 'white':
        if (this.currentSqrId === this.startingSqrId) {
          if (
            targetSquare.id === this.currentSqrId + 8
            || targetSquare.id === this.currentSqrId + 16
          ) {
            return true;
          } else {
            return false;
          }
        } else if (targetSquare.id === this.currentSqrId + 8) {
          return true;
        } else {
          return false;
        }
      case 'black':
        if (this.currentSqrId === this.startingSqrId) {
          if (
            targetSquare.id === this.currentSqrId - 8
            || targetSquare.id === this.currentSqrId - 16
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
    const targetSqrRankLabel = targetSquare.label[1];
    const targetSqrColLabel = targetSquare.label[0];
    const currentSqrIdRankLabel = board[this.currentSqrId].label[1];
    const currentSqrIdColLabel = board[this.currentSqrId].label[0];
    const currentRank = Object.values(board).filter((sqr: BoardSquare) => sqr.label[1] === currentSqrIdRankLabel);
    const currentCol = Object.values(board).filter((sqr: BoardSquare) => sqr.label[0] === currentSqrIdColLabel);
    const obstructingRightRankPiece = currentRank.find((sqr: BoardSquare) => sqr.piece && sqr.id > this.currentSqrId);
    const obstructingLeftRankPiece = currentRank.find((sqr: BoardSquare) => sqr.piece && sqr.id < this.currentSqrId);
    const obstructingAboveColPiece = currentCol.find((sqr: BoardSquare) => sqr.piece && sqr.id > this.currentSqrId);
    const obstructingBelowColPiece = currentCol.find((sqr: BoardSquare) => sqr.piece && sqr.id < this.currentSqrId);
    const targetSquareRank = getRankById(targetSquare.id);
    const currentSquareRank = getRankById(this.currentSqrId);
    const currentSquareCol = getColBySquare(board[this.currentSqrId]);
    const targetSquareCol = getColBySquare(targetSquare);
    const spacesShareCol = currentSquareCol === targetSquareCol;
    const spacesShareRank = targetSquareRank === currentSquareRank;

    return (
      targetSquare.piece?.color !== this.color 
    ) && (
      targetSqrColLabel === currentSqrIdColLabel
      || targetSqrRankLabel === currentSqrIdRankLabel
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