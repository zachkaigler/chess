import React, { CSSProperties } from 'react';
import { useDrop } from 'react-dnd';
import { BoardSquare } from '../../../game/game';
import { useGameController } from '../../../hooks/useGameController/useGameController';
import PieceIcon from '../../pieces/PieceIcon/PieceIcon';
import './BoardSquareTile.scss'

interface BoardSquareTileProps {
  square: BoardSquare;
}

const BoardSquareTile: React.FC<BoardSquareTileProps> = ({ square }) => {
  const { game, movePiece } = useGameController();

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: 'square',
      canDrop: (item: BoardSquare) => item.piece!.moveIsValid!(item, square, game),
      drop: (item: BoardSquare) => movePiece(item.piece!, item, square),
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
        backgroundColor: 'lightgreen',
        color: 'black',
      };
    }
  };

  const cooldownTimerStyles: CSSProperties = {
    height: `${100 - square.cooldownProgress}%`,
    transition: !square.piece ? '' : `height ${square.piece.cooldown / 10}ms linear`,
  };

  return (
    <div
      className={`BoardSquareTile ${square.color} ${square.cooldownTimers ? 'cooldown' : ''} ${canDrop ? 'valid-move' : ''} ${canDrop && square.piece ? 'valid-capture' : ''}`}
      style={getAddtleStyles()}
      ref={drop}
      >
      {square.cooldownTimers && <div className='BoardSquareTile__CooldownProgress' style={cooldownTimerStyles} />}
      {square.piece && <PieceIcon square={square} onCooldown={!!square.cooldownTimers} style={{ position: 'absolute', zIndex: 2 }} />}
      {/* <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        color: 'white',
        fontSize: 10,
        zIndex: 10,
      }}>
        {square.id}
      </div> */}
    </div>
  )
}

export default BoardSquareTile;
