import React, { HTMLAttributes } from 'react';
import { ConnectDragSource, useDrag } from 'react-dnd';
import { BoardSquare } from '../../../game/game';
import { PieceTypes } from '../../../game/pieces';
import BishopIcon from '../BishopIcon/BishopIcon';
import KingIcon from '../KingIcon/KingIcon';
import KnightIcon from '../KnightIcon/KnightIcon';
import PawnIcon from '../PawnIcon/PawnIcon';
import QueenIcon from '../QueenIcon/QueenIcon';
import RookIcon from '../RookIcon/RookIcon';

type PieceIconProps = {
  square: BoardSquare;
  onCooldown: boolean;
} & HTMLAttributes<HTMLDivElement>;

export type ChildIconProps = {
  color: string;
  dragRef: ConnectDragSource | null;
  isDragging?: boolean;
} & HTMLAttributes<HTMLDivElement>;

const PieceIcon: React.FC<PieceIconProps> = ({ square, onCooldown, ...props }) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'square',
      item: square,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [square],
  );

  const collectedProps = {
    color: square.piece!.color,
    isDragging,
    dragRef: onCooldown ? null : drag,
    ...props,
  };

  switch (square.piece?.name) {
    case PieceTypes.PAWN:
      return <PawnIcon {...collectedProps} />;
    case PieceTypes.QUEEN:
      return <QueenIcon {...collectedProps} />;
    case PieceTypes.KING:
      return <KingIcon {...collectedProps} />;
    case PieceTypes.BISHOP:
      return <BishopIcon {...collectedProps} />;
    case PieceTypes.KNIGHT:
      return <KnightIcon {...collectedProps} />;
    case PieceTypes.ROOK:
      return <RookIcon {...collectedProps} />;
    default: return null;
  }
};

export default PieceIcon;
