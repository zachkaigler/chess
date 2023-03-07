import { BoardSquare, Board } from "./board";
import PawnIcon from "./components/pieces/PawnIcon/PawnIcon";
import RookIcon from "./components/pieces/RookIcon/RookIcon";

// moving 1 square forward for white is +8 to id
// moving 1 square forward for black is -8 to id

export class Piece {
  color: 'white' | 'black';
  startingSqr: number;
  currentSqr: number;
  abb: string | null;
  name: string;
  icon: React.ReactNode;
  moveIsValid?(targetSquare: BoardSquare, board: Board): boolean
}

export class Pawn extends Piece {
  constructor(startingSqr: number, color: 'white' | 'black') {
    super();
    this.color = color;
    this.startingSqr = startingSqr;
    this.currentSqr = startingSqr;
    this.abb = null;
    this.name = 'pawn';
    this.icon = <PawnIcon piece={this} />;
  }

  // TODO: account for diagonal capturing and squares that are taken
  moveIsValid(targetSquare: BoardSquare): boolean {
    switch (this.color) {
      case 'white':
        if (this.currentSqr === this.startingSqr) {
          if (
            targetSquare.id === this.currentSqr + 8
            || targetSquare.id === this.currentSqr + 16
          ) {
            return true;
          } else {
            return false;
          }
        } else if (targetSquare.id === this.currentSqr + 8) {
          return true;
        } else {
          return false;
        }
      case 'black':
        if (this.currentSqr === this.startingSqr) {
          if (
            targetSquare.id === this.currentSqr - 8
            || targetSquare.id === this.currentSqr - 16
          ) {
            return true;
          } else {
            return false;
          }
        } else if (targetSquare.id === this.currentSqr - 8) {
          return true;
        } else {
          return false;
        }
    }
  }
}

export class Rook extends Piece {
  constructor(startingSqr: number, color: 'white' | 'black') {
    super();
    this.color = color;
    this.startingSqr = startingSqr;
    this.currentSqr = startingSqr;
    this.abb = 'R';
    this.name = 'rook';
    this.icon = <RookIcon piece={this} />;
  }

  moveIsValid(targetSquare: BoardSquare, board: Board): boolean {
    const targetSqrRowLabel = targetSquare.label[1];
    const targetSqrColLabel = targetSquare.label[0];
    const currentSqrRowLabel = board[this.currentSqr].label[1];
    const currentSqrColLabel = board[this.currentSqr].label[0];
    const currentRow = Object.values(board).filter((sqr: BoardSquare) => sqr.label[1] === currentSqrRowLabel);
    const currentCol = Object.values(board).filter((sqr: BoardSquare) => sqr.label[0] === currentSqrColLabel);
    const obstructingRightRowPiece = currentRow.find((sqr: BoardSquare) => sqr.piece && sqr.id > this.currentSqr);
    const obstructingLeftRowPiece = currentRow.find((sqr: BoardSquare) => sqr.piece && sqr.id < this.currentSqr);
    const obstructingAboveColPiece = currentCol.find((sqr: BoardSquare) => sqr.piece && sqr.id > this.currentSqr);
    const obstructingBelowColPiece = currentCol.find((sqr: BoardSquare) => sqr.piece && sqr.id < this.currentSqr);

    return (
      targetSquare.piece?.color !== this.color 
    ) && (
      targetSqrColLabel === currentSqrColLabel
      || targetSqrRowLabel === currentSqrRowLabel
    ) && (
      !(targetSquare.id > obstructingRightRowPiece?.id)
      && !(targetSquare.id > obstructingAboveColPiece?.id)
      && !(targetSquare.id < obstructingLeftRowPiece?.id)
      && !(targetSquare.id < obstructingBelowColPiece?.id)
    );
  }
}