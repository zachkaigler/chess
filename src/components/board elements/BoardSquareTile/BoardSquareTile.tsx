import React from 'react';
import { useDrop } from 'react-dnd';
import { Board, BoardSquare } from '../../../board';
import { Piece } from '../../../pieces';
import './BoardSquareTile.scss'

interface BoardSquareTileProps {
  square: BoardSquare;
  movePiece(piece: Piece, targetSquare: BoardSquare): void;
  board: Board;
}

const BoardSquareTile: React.FC<BoardSquareTileProps> = ({ square, movePiece, board }) => {
  const getSquareColor = (square: BoardSquare) => {
    if (parseInt(square.label.split('')[1]) % 2 === 0) {
      return square.id % 2 === 0 ? 'dark' : 'light'
    } else {
      return square.id % 2 === 0 ? 'light' : 'dark'
    }
  };

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: 'piece',
      canDrop: (item: Piece) => item.moveIsValid!(square, board),
      drop: (item: Piece) => movePiece(item, square),
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    [],
  )

  const getAddtleStyles = () => {
    if (isOver && !canDrop) {
      return {
        backgroundColor: 'red',
        color: 'black',
      }
    }
    if (!isOver && canDrop) {
      return {
        backgroundColor: 'yellow',
        color: 'black',
      }
    }
    if (isOver && canDrop) {
      return {
        backgroundColor: 'green',
        color: 'black',
      }
    }
  }

  return (
    <div
      className={`BoardSquareTile ${getSquareColor(square)}`}
      style={getAddtleStyles()}
      ref={drop}
    >
      {square.piece && square.piece.icon}
      {/* {square.label} */}
      {square.id}
    </div>
  )
}

export default BoardSquareTile;
