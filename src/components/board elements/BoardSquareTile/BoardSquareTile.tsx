import React from 'react';
import { useDrop } from 'react-dnd';
import { Board, BoardSquare } from '../../../board';
import { useGameController } from '../../../hooks/useGameController/useGameController';
import { Piece } from '../../../pieces';
import './BoardSquareTile.scss'

interface BoardSquareTileProps {
  square: BoardSquare;
}

const BoardSquareTile: React.FC<BoardSquareTileProps> = ({ square }) => {
  const { game, movePiece } = useGameController();

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: 'piece',
      canDrop: (item: Piece) => item.moveIsValid!(square, game),
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
      className={`BoardSquareTile ${square.color}`}
      style={getAddtleStyles()}
      ref={drop}
    >
      {square.piece && square.piece.icon}
      {/* {square.label} */}
      {/* {square.id} */}
    </div>
  )
}

export default BoardSquareTile;
