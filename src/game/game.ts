import { Piece, Pawn, Rook, Knight, Bishop, Queen, King } from "./pieces";

export interface BoardSquare {
  id: number;
  label: string;
  color: SquareColors;
  cooldownTimers: null | { timeout: number, interval: number };
  cooldownProgress: number;
  piece?: Piece;
}

enum SquareColors {
  LIGHT = 'light',
  DARK = 'dark',
}

export interface Board {
  [key: number]: BoardSquare;
}

export const getRankById = (id: number): number => {
  if (id <= 8) return 1;
  if (id >= 9 && id <= 16) return 2;
  if (id >= 17 && id <= 24) return 3;
  if (id >= 25 && id <= 32) return 4;
  if (id >= 33 && id <= 40) return 5;
  if (id >= 41 && id <= 48) return 6;
  if (id >= 49 && id <= 56) return 7;
  else return 8;
};

export const getColBySquare = (square: BoardSquare): string => square.label[0];

const generateSquareLabel = (id: number): string => {
  const labelKey: { [key: number]: string } = {
    1: 'a',
    2: 'b',
    3: 'c',
    4: 'd',
    5: 'e',
    6: 'f',
    7: 'g',
    8: 'h',
  }

  const rank = getRankById(id);

  if (rank === 1) return `${labelKey[id]}1`;
  if (rank === 2) return `${labelKey[id - 8]}2`;
  if (rank === 3) return `${labelKey[id - 8 * 2]}3`;
  if (rank === 4) return `${labelKey[id - 8 * 3]}4`;
  if (rank === 5) return `${labelKey[id - 8 * 4]}5`;
  if (rank === 6) return `${labelKey[id - 8 * 5]}6`;
  if (rank === 7) return `${labelKey[id - 8 * 6]}7`;
  if (rank === 8) return `${labelKey[id - 8 * 7]}8`;
  return '';
};

const getStartingPiece = (id: number) => {
  const rank = getRankById(id);

  if (rank === 2) return new Pawn(id, 'white');
  if (rank === 7) return new Pawn(id, 'black');
  if (id === 1 || id === 8) return new Rook(id, 'white');
  if (id === 57 || id === 64) return new Rook(id, 'black');
  if (id === 2 || id === 7) return new Knight(id, 'white');
  if (id === 58 || id === 63) return new Knight(id, 'black');
  if (id === 3 || id === 6) return new Bishop(id, 'white');
  if (id === 59 || id === 62) return new Bishop(id, 'black');
  if (id === 4) return new Queen(id, 'white');
  if (id === 60) return new Queen(id, 'black');
  if (id === 5) return new King(id, 'white');
  if (id === 61) return new King(id, 'black');
};

export const generateBoard = () => {
  const board: Board = {};

  const getSquareColor = (id: number, label: string): SquareColors => {
    if (parseInt(label.split('')[1]) % 2 === 0) {
      return id % 2 === 0 ? SquareColors.DARK : SquareColors.LIGHT
    } else {
      return id % 2 === 0 ? SquareColors.LIGHT : SquareColors.DARK
    }
  };
  
  for (let i = 1; i <= 64; i++) {
    const label = generateSquareLabel(i);

    board[i] = {
      id: i,
      label,
      color: getSquareColor(i, label),
      piece: getStartingPiece(i),
      cooldownTimers: null,
      cooldownProgress: 0,
    }
  }

  return {
    board,
  };
};

export const convertBoardToMatrix = (board: Board) => (
  [
    [...Object.values(board).slice(56, 64)],
    [...Object.values(board).slice(48, 56)],
    [...Object.values(board).slice(40, 48)],
    [...Object.values(board).slice(32, 40)],
    [...Object.values(board).slice(24, 32)],
    [...Object.values(board).slice(16, 24)],
    [...Object.values(board).slice(8, 16)],
    [...Object.values(board).slice(0, 8)],
  ].flat()
);