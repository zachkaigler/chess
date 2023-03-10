import React from 'react';
import { useDrop } from 'react-dnd';
import { BoardSquare } from '../../../board';
import { useGameController } from '../../../hooks/useGameController/useGameController';
import { Piece } from '../../../pieces';
import PieceIcon from '../../pieces/PieceIcon/PieceIcon';
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
    [game],
  );

  const getAddtleStyles = () => {
    if (isOver && !canDrop) {
      return {
        backgroundColor: 'crimson',
        color: 'black',
      };
    }
    if (isOver && canDrop) {
      return {
        backgroundColor: 'lightsalmon',
        color: 'black',
      }
    }
    if (square.onCooldown) {
      return {
        backgroundColor: 'lightpink',
        color: 'black'
      };
    }
  };

  return (
    <div
      className={`BoardSquareTile ${square.color} ${square.onCooldown ? 'cooldown' : ''} ${canDrop ? 'valid-move' : ''} ${canDrop && square.piece ? 'valid-capture' : ''}`}
      style={getAddtleStyles()}
      ref={drop}
    >
      {square.piece && <PieceIcon piece={square.piece} onCooldown={square.onCooldown} />}
      {/* {square.id} */}
    </div>
  )
}

export default BoardSquareTile;
