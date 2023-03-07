import { Piece, Pawn, Rook } from "./pieces";

export interface BoardSquare {
  id: number;
  label: string;
  piece?: Piece;
}

export interface Board {
  [key: number]: BoardSquare;
}

const getRankById = (id: number): number => {
  if (id <= 8) return 1;
  if (id >= 9 && id <= 16) return 2;
  if (id >= 17 && id <= 24) return 3;
  if (id >= 25 && id <= 32) return 4;
  if (id >= 33 && id <= 40) return 5;
  if (id >= 41 && id <= 48) return 6;
  if (id >= 49 && id <= 56) return 7;
  else return 8;
};

const getSquareInfo = (id: number): string => {
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
  if (id === 27) return new Rook(id, 'black');
};

export const generateBoard = () => {
  const board: Board = {};
  
  for (let i = 1; i <= 64; i++) {
    board[i] = {
      id: i,
      label: getSquareInfo(i),
      piece: getStartingPiece(i),
    }
  }

  return {
    board,
  };
};

export const convertBoardToMatrix = (board: Board) => (
  // [
  //   [board[57], board[58], board[59], board[60], board[61], board[62], board[63], board[64]],
  //   [board[49], board[50], board[51], board[52], board[53], board[54], board[55], board[56]],
  //   [board[41], board[42], board[43], board[44], board[45], board[46], board[47], board[48]],
  //   [board[33], board[34], board[35], board[36], board[37], board[38], board[39], board[40]],
  //   [board[25], board[26], board[27], board[28], board[29], board[30], board[31], board[32]],
  //   [board[17], board[18], board[19], board[20], board[21], board[22], board[23], board[24]],
  //   [board[9], board[10], board[11], board[12], board[13], board[14], board[15], board[16]],
  //   [board[1], board[2], board[3], board[4], board[5], board[6], board[7], board[8]],
  // ].flat()
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